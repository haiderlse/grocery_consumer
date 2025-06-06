
import React, { useState, useEffect, useMemo } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
const { useParams, useNavigate } = ReactRouterDOM;
import { Order, RiderDetails } from '../types'; 
import { productService } from '../services/productService';
import Icon from '../components/Icon';
import { CURRENCY_SYMBOL } from '../constants';

// Define UI stages for the tracking simulation
const UI_STAGES: ReadonlyArray<string> = [
  'Confirmed',      // Maps to AwaitingPayment, Pending
  'Preparing',      // Maps to Processing
  'Out for Delivery', // Maps to PickedUp, EnRoute, Shipped (first part)
  'Near You',       // Maps to Shipped (second part, simulated), or EnRoute after a while
  'Delivered',      // Maps to Delivered
];

// Polling interval in milliseconds
const POLLING_INTERVAL = 15000; // 15 seconds
// Simulation interval for stages if no server update
const SIMULATION_INTERVAL = 15000; // 15 seconds per stage

const OrderTrackingPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [currentUiStageIndex, setCurrentUiStageIndex] = useState(0);

  const MOCK_RIDER_DETAILS: RiderDetails = {
    name: "Rider Ali",
    phone: "03001234567",
    imageUrl: "https://via.placeholder.com/100/007bff/ffffff?Text=Rider" 
  };

  const mapBackendStatusToUiStageIndex = (backendStatus: Order['orderStatus']): number => {
    switch (backendStatus) {
      case 'AwaitingPayment':
      case 'Pending': 
        return UI_STAGES.indexOf('Confirmed');
      case 'Processing':
        return UI_STAGES.indexOf('Preparing');
      case 'PickedUp':
      case 'EnRoute': // Added EnRoute mapping
      case 'Shipped':
        return UI_STAGES.indexOf('Out for Delivery');
      case 'Delivered':
        return UI_STAGES.indexOf('Delivered');
      case 'Cancelled':
        return -1; 
      default:
        return UI_STAGES.indexOf('Confirmed'); 
    }
  };

  // Effect for initial order fetch
  useEffect(() => {
    if (!orderId) {
      setError("Order ID is missing.");
      setIsLoading(false);
      return;
    }
    const fetchInitialOrder = async () => {
      setIsLoading(true);
      setError(null);
      try {
        let fetchedOrder = await productService.getOrderById(orderId);
        if (fetchedOrder) {
          if (!fetchedOrder.riderDetails && 
              ['Processing', 'PickedUp', 'EnRoute', 'Shipped', 'Pending'].includes(fetchedOrder.orderStatus)) {
            setTimeout(() => {
                 setOrder(prevOrder => prevOrder ? {...prevOrder, riderDetails: MOCK_RIDER_DETAILS} : null);
            }, 2000);
          }
          setOrder(fetchedOrder);
          const initialMappedIndex = mapBackendStatusToUiStageIndex(fetchedOrder.orderStatus);
          setCurrentUiStageIndex(initialMappedIndex === -1 ? 0 : initialMappedIndex);
        } else {
          setError("Order not found.");
        }
      } catch (err) {
        setError("Failed to load order details.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchInitialOrder();
  }, [orderId]);

  // Effect for polling order updates
  useEffect(() => {
    if (!orderId || !order || order.orderStatus === 'Delivered' || order.orderStatus === 'Cancelled') {
      return; 
    }

    const pollOrder = async () => {
      try {
        const fetchedOrder = await productService.getOrderById(orderId);
        if (fetchedOrder) {
          setOrder(fetchedOrder); 
          const newMappedIndex = mapBackendStatusToUiStageIndex(fetchedOrder.orderStatus);
          if (fetchedOrder.orderStatus !== 'Cancelled') { 
            setCurrentUiStageIndex(newMappedIndex === -1 ? currentUiStageIndex : newMappedIndex); 
          }
        }
      } catch (err) {
        console.error("Error polling order status:", err);
      }
    };

    const intervalId = setInterval(pollOrder, POLLING_INTERVAL);
    return () => clearInterval(intervalId); 

  }, [orderId, order, currentUiStageIndex]); 

  // Effect for client-side UI simulation
  useEffect(() => {
    if (!order || order.orderStatus === 'Delivered' || order.orderStatus === 'Cancelled' || currentUiStageIndex >= UI_STAGES.length - 1) {
      return; 
    }

    const timer = setTimeout(() => {
      const serverMappedIndex = mapBackendStatusToUiStageIndex(order.orderStatus);
      if (currentUiStageIndex === serverMappedIndex && serverMappedIndex < UI_STAGES.length -1) {
         setCurrentUiStageIndex(prev => prev + 1);
      } else if (currentUiStageIndex < serverMappedIndex) {
        // setCurrentUiStageIndex(serverMappedIndex); // Option to jump to server status immediately
      }
    }, SIMULATION_INTERVAL); 

    return () => clearTimeout(timer);
  }, [order, currentUiStageIndex]);


  const displayedUiStage = useMemo(() => {
    if (order?.orderStatus === 'Cancelled') return 'Cancelled'; 
    if (order?.orderStatus === 'Delivered') return 'Delivered'; 
    return UI_STAGES[currentUiStageIndex] || UI_STAGES[0]; 
  }, [order, currentUiStageIndex]);

  const isEffectivelyDelivered = displayedUiStage === 'Delivered';
  const isEffectivelyCancelled = displayedUiStage === 'Cancelled';


  const getStatusText = (uiStage: string): string => {
    switch (uiStage) {
      case 'Confirmed': return "We've received and confirmed your order!";
      case 'Preparing': return "Your items are being carefully prepared.";
      case 'Out for Delivery': return "Your rider is on the way!";
      case 'Near You': return "Your order is arriving shortly.";
      case 'Delivered': return "Your order has been delivered!";
      case 'Cancelled': return "Your order has been cancelled."; 
      default: return "Tracking your order...";
    }
  };

  const progressPercentage = useMemo(() => {
    if (isEffectivelyDelivered) return 100;
    if (isEffectivelyCancelled) return 0; 
    
    const currentIndexInSequence = UI_STAGES.indexOf(displayedUiStage);
    if (currentIndexInSequence === -1) return 0; 
    return Math.min(100, (currentIndexInSequence / (UI_STAGES.length - 1)) * 100);
  }, [displayedUiStage, isEffectivelyCancelled, isEffectivelyDelivered]);


  if (isLoading && !order) { 
    return <div className="flex justify-center items-center h-screen"><Icon name="info" size={48} className="animate-spin text-panda-pink" /></div>;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-4 bg-panda-bg-light">
        <Icon name="x-circle" size={48} className="text-red-500 mb-4" />
        <p className="text-center text-red-700 text-lg mb-4">{error}</p>
        <button
            onClick={() => navigate('/')}
            className="bg-panda-pink text-white py-2 px-6 rounded-lg font-semibold hover:bg-panda-dark-pink transition duration-150"
        >
            Back to Home
        </button>
      </div>
    );
  }
  
  if (!order) {
     return (
      <div className="flex flex-col items-center justify-center h-screen p-4 bg-panda-bg-light">
        <Icon name="search" size={48} className="text-gray-400 mb-4" />
        <p className="text-center text-panda-text-light text-lg mb-4">Order data is not available.</p>
        <button
            onClick={() => navigate('/')}
            className="bg-panda-pink text-white py-2 px-6 rounded-lg font-semibold hover:bg-panda-dark-pink transition duration-150"
        >
            Back to Home
        </button>
      </div>
    );
  }

  let headerTitle = "Live Order Tracking";
  if (isEffectivelyDelivered) headerTitle = "Order Delivered";
  else if (isEffectivelyCancelled) headerTitle = "Order Cancelled";

  return (
    <div className="bg-panda-bg-light min-h-screen flex flex-col">
      <header className="bg-white shadow-sm sticky top-0 z-50 p-4">
        <div className="container mx-auto flex items-center justify-between h-12">
          <button onClick={() => navigate('/')} className="text-panda-pink p-1 hover:bg-pink-50 rounded-full" aria-label="Close tracking and go home">
            <Icon name="chevron-down" size={24} />
          </button>
          <h1 className="text-lg font-semibold text-panda-text">{headerTitle}</h1>
          <button onClick={() => alert('Help clicked')} className="text-sm text-panda-pink font-medium">Help</button>
        </div>
      </header>

      {isEffectivelyDelivered ? (
        <div className="flex-grow flex flex-col items-center justify-center p-6 text-center">
          <Icon name="checkCircle" size={64} className="text-panda-green mb-4" />
          <h2 className="text-2xl font-bold text-panda-text mb-3">Order Successfully Delivered!</h2>
          <p className="text-panda-text-light mb-6">
            Thank you for choosing Pick Me Up! We hope you enjoy your items.
          </p>
          <div className="w-full max-w-xs space-y-3">
            <button
              onClick={() => navigate('/')}
              className="w-full bg-panda-pink text-white py-3 px-4 rounded-lg shadow-md hover:bg-panda-dark-pink transition duration-150 font-semibold"
            >
              Order Again Now
            </button>
            <button
              onClick={() => alert('Feedback feature coming soon!')}
              className="w-full bg-gray-200 text-panda-text py-3 px-4 rounded-lg shadow-md hover:bg-gray-300 transition duration-150 font-semibold"
            >
              Leave Feedback
            </button>
          </div>
        </div>
      ) : isEffectivelyCancelled ? (
        <div className="flex-grow flex flex-col items-center justify-center p-6 text-center">
          <Icon name="x-circle" size={64} className="text-red-500 mb-4" />
          <h2 className="text-2xl font-bold text-panda-text mb-3">Order Cancelled</h2>
          <p className="text-panda-text-light mb-6">
            This order has been cancelled. If you have any questions, please contact support.
          </p>
          <div className="w-full max-w-xs">
            <button
              onClick={() => navigate('/')}
              className="w-full bg-panda-pink text-white py-3 px-4 rounded-lg shadow-md hover:bg-panda-dark-pink transition duration-150 font-semibold"
            >
              Back to Home
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Map Area Placeholder */}
          <div className="relative h-64 bg-gray-300 flex items-center justify-center text-gray-500">
            <span className="text-lg">Map Placeholder</span>
            <Icon name="store" size={32} className="absolute top-1/4 left-1/4 text-red-500 opacity-70" />
            <Icon name="motorcycle" size={32} className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-blue-500 opacity-90 animate-pulse" />
            <Icon name="person-pin" size={32} className="absolute bottom-1/4 right-1/4 text-green-500 opacity-70" />
          </div>

          {/* Content Area */}
          <div className="flex-grow p-4 space-y-4">
            <section className="bg-white p-4 rounded-lg shadow">
              <p className="text-sm text-panda-text-light text-center">Estimated time of delivery</p>
              <p className="text-3xl font-bold text-panda-text text-center my-2">
                {order.estimatedDeliveryTime || `${new Date(Date.now() + 15 * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${new Date(Date.now() + 25 * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                <div 
                  className="bg-panda-pink h-2.5 rounded-full transition-all duration-500 ease-linear" 
                  style={{ width: `${progressPercentage}%` }}
                  role="progressbar"
                  aria-valuenow={progressPercentage}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label="Order progress"
                ></div>
              </div>
              <p className="text-sm text-panda-text text-center font-medium">{getStatusText(displayedUiStage)}</p>
            </section>

            <section className="bg-white p-4 rounded-lg shadow flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-200 rounded-full mr-3 flex items-center justify-center overflow-hidden">
                  {order.riderDetails?.imageUrl ? (
                    <img src={order.riderDetails.imageUrl} alt={order.riderDetails.name} className="w-full h-full object-cover" />
                  ) : (
                    <Icon name="motorcycle" size={20} className="text-gray-500"/>
                  )}
                </div>
                <div>
                  {order.riderDetails ? (
                    <>
                      <p className="text-sm font-semibold text-panda-text">{order.riderDetails.name}</p>
                      <p className="text-xs text-panda-text-light">Your Rider</p>
                    </>
                  ) : (
                    <p className="text-sm text-panda-text-light">Rider information will appear once assigned.</p>
                  )}
                </div>
              </div>
              {order.riderDetails ? (
                <a 
                  href={`tel:${order.riderDetails.phone}`}
                  className="bg-panda-green text-white py-2 px-3 rounded-lg text-sm font-semibold flex items-center hover:bg-green-700 transition-colors"
                  aria-label={`Call rider ${order.riderDetails.name}`}
                >
                  <Icon name="message-circle" size={18} className="mr-1.5" /> Call Rider
                </a>
              ) : (
                <button 
                    disabled 
                    className="bg-gray-300 text-gray-500 py-2 px-3 rounded-lg text-sm font-semibold flex items-center cursor-not-allowed"
                >
                  <Icon name="message-circle" size={18} className="mr-1.5" /> Contact
                </button>
              )}
            </section>

            <section className="bg-white p-4 rounded-lg shadow">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-md font-semibold text-panda-text">Delivery details</h2>
              </div>
              <div className="flex items-start mb-2">
                <Icon name="mapPin" size={20} className="text-panda-pink mr-3 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm text-panda-text">{order.deliveryAddress.street}</p>
                  {order.deliveryAddress.floor && <p className="text-xs text-panda-text-light">{order.deliveryAddress.floor}</p>}
                  <p className="text-xs text-panda-text-light">{order.deliveryAddress.city}, {order.deliveryAddress.postalCode}</p>
                </div>
              </div>
              {order.deliveryAddress.instructions && (
                <div className="flex items-start">
                    <Icon name="info" size={16} className="text-panda-text-light mr-3 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-panda-text-light italic">{order.deliveryAddress.instructions}</p>
                </div>
              )}
              <p className="text-xs text-panda-text-light mt-3 pt-3 border-t border-gray-200">Delivered by <span className="font-medium">Pick Me Up Rider</span></p>
            </section>

            <section className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-md font-semibold text-panda-text mb-2">Order Summary ({order.items.length} item{order.items.length === 1 ? '' : 's'})</h2>
              <ul className="space-y-1">
                {order.items.slice(0,2).map(item => (
                  <li key={item.productId} className="flex justify-between text-sm text-panda-text-light">
                    <span>{item.quantity} x {item.name}</span>
                    <span>{CURRENCY_SYMBOL}{(item.price * item.quantity).toFixed(2)}</span>
                  </li>
                ))}
                {order.items.length > 2 && <li className="text-xs text-panda-text-light text-center">...and {order.items.length - 2} more items</li>}
              </ul>
              <div className="flex justify-between font-semibold text-panda-text mt-2 pt-2 border-t">
                <span>Total</span>
                <span>{CURRENCY_SYMBOL}{order.totalAmount.toFixed(2)}</span>
              </div>
            </section>
          </div>
        </>
      )}
    </div>
  );
};

export default OrderTrackingPage;