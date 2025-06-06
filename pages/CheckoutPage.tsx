
import React, { useState } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
const { useNavigate } = ReactRouterDOM;
import { useCart } from '../hooks/useCart';
import { CURRENCY_SYMBOL } from '../constants';
import Icon from '../components/Icon';
import { productService } from '../services/productService'; // Import productService
import { DeliveryAddress, Order } from '../types'; // Import DeliveryAddress type

const CheckoutPage: React.FC = () => {
  const { getCartTotal, getItemCount, clearCart, items } = useCart(); 
  const navigate = useNavigate();
  const cartTotal = getCartTotal();
  const itemCount = getItemCount();
  const deliveryFee = 50; 
  const totalWithFee = cartTotal + deliveryFee;

  const [deliveryAddress, setDeliveryAddress] = useState<DeliveryAddress>({ // Use DeliveryAddress type
    street: '36/1 Khayaban e Muslim',
    city: 'Karachi',
    postalCode: '75200', // Example postal code
    country: 'PK',      // Example country
    floor: '1st Floor',
    instructions: 'Note to rider - e.g. landmark'
  });
  const [leaveAtDoor, setLeaveAtDoor] = useState(false);
  const [deliveryOption, setDeliveryOption] = useState('standard'); 
  const [paymentMethod, setPaymentMethod] = useState('JazzCash 1221');
  const [tipAmount, setTipAmount] = useState(0);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderSuccessfullyPlaced, setOrderSuccessfullyPlaced] = useState(false);


  const handlePlaceOrder = async () => {
    if (itemCount === 0) {
        alert("Your cart is empty!");
        navigate('/cart');
        return;
    }
    setIsPlacingOrder(true);
    setError(null);

    try {
      const orderPayload = {
        items: items.map(item => ({ 
            productId: item.product.id, 
            name: item.product.name, // Denormalize for order record
            price: item.product.price, // Denormalize for order record
            imageUrl: item.product.imageUrl, // Denormalize for order record
            quantity: item.quantity 
        })),
        deliveryAddress: {
          ...deliveryAddress, 
          instructions: `${deliveryAddress.instructions || ''}${leaveAtDoor ? ' (Leave at door)' : ''}`.trim() 
        },
        paymentMethod: paymentMethod,
        paymentDetails: paymentMethod, 
        paymentStatus: paymentMethod.toLowerCase().includes('cash') ? 'Pending' as const : 'Paid' as const,
        orderStatus: 'Pending' as const, 
        riderTip: tipAmount,
        totalAmount: totalWithFee + tipAmount, // Ensure totalAmount is passed
        specialInstructions: deliveryAddress.instructions 
      };

      const createdOrder = await productService.createOrder(orderPayload);
      
      // Simulate stock deduction
      // In a real app, this should be a transactional operation on the backend.
      try {
        for (const cartItem of items) {
          const newStock = Math.max(0, cartItem.product.stock - cartItem.quantity);
          await productService.updateProduct(cartItem.product.id, { stock: newStock });
        }
        console.log("Stock updated for ordered items.");
      } catch (stockUpdateError) {
        console.error("Error updating stock after order placement (order still placed):", stockUpdateError);
        // Decide on error handling: alert user, log, etc. Order is already placed.
      }

      setOrderSuccessfullyPlaced(true); 
      clearCart();
      navigate(`/track-order/${createdOrder.id}`, { replace: true });

    } catch (err) {
      console.error('Failed to place order:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred while placing your order.');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (!orderSuccessfullyPlaced && itemCount === 0 && cartTotal === 0 && !isPlacingOrder) { 
    navigate('/'); 
    return null;
  }

  const handleBackFromCheckout = () => {
    if (window.history.state && window.history.state.idx > 0) {
        navigate(-1); 
    } else {
        navigate('/cart', { replace: true });
    }
  };

  return (
    <div className="bg-panda-bg-light min-h-screen flex flex-col">
      <header className="bg-white shadow-sm sticky top-0 z-50 p-4">
        <div className="container mx-auto flex items-center h-12">
          <button
            onClick={handleBackFromCheckout} 
            className="text-panda-pink mr-3 p-1 hover:bg-pink-50 rounded-full"
            aria-label="Go back"
          >
            <Icon name="back" size={24} />
          </button>
          <h1 className="text-lg font-semibold text-panda-text">Checkout</h1>
        </div>
        <p className="text-xs text-panda-text-light text-center mt-1">Pick Me Up - DHA (Phase-VIII) (KHI)</p>
      </header>
      
      <div className="flex-grow p-4 space-y-4">
        {error && (
          <div className="mb-4 p-3 text-red-700 bg-red-100 rounded-md border border-red-300" role="alert">
            <p><strong>Error:</strong> {error}</p>
          </div>
        )}
        {/* Delivery Address */}
        <section className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-md font-semibold text-panda-text mb-3">Delivery address</h2>
          <div className="flex items-start">
            <div className="w-16 h-16 bg-gray-200 rounded-md mr-3 flex items-center justify-center">
              <Icon name="mapPin" size={32} className="text-gray-500" />
            </div>
            <div className="flex-grow">
              <input 
                type="text"
                value={deliveryAddress.street}
                onChange={(e) => setDeliveryAddress({...deliveryAddress, street: e.target.value})}
                placeholder="Street Address"
                className="w-full mb-1 p-1 border-b border-panda-border focus:border-panda-pink outline-none text-sm font-medium text-panda-text"
              />
              <input 
                type="text"
                value={deliveryAddress.city}
                onChange={(e) => setDeliveryAddress({...deliveryAddress, city: e.target.value})}
                placeholder="City"
                className="w-full mb-1 p-1 border-b border-panda-border focus:border-panda-pink outline-none text-sm text-panda-text-light"
              />
               <input 
                type="text"
                value={deliveryAddress.floor || ''}
                onChange={(e) => setDeliveryAddress({...deliveryAddress, floor: e.target.value})}
                placeholder="Apt, Suite, Floor (Optional)"
                className="w-full mb-1 p-1 border-b border-panda-border focus:border-panda-pink outline-none text-sm text-panda-text-light"
              />
            </div>
            <button className="text-panda-pink self-center">
              <Icon name="chevronRight" size={24} />
            </button>
          </div>
          <input 
            type="text"
            value={deliveryAddress.instructions}
            onChange={(e) => setDeliveryAddress({...deliveryAddress, instructions: e.target.value})}
            placeholder="Delivery instructions/Alternate phone nu..."
            className="w-full mt-3 p-2 border border-panda-border rounded-md text-sm focus:ring-1 focus:ring-panda-pink"
          />
          <div className="mt-3 flex justify-between items-center">
            <div className="flex items-center">
              <Icon name="home" size={20} className="text-panda-text-light mr-2" />
              <span className="text-sm text-panda-text">Leave at the door</span>
            </div>
            <button
              onClick={() => setLeaveAtDoor(!leaveAtDoor)}
              className={`w-12 h-6 rounded-full flex items-center transition-colors duration-200 ease-in-out ${
                leaveAtDoor ? 'bg-panda-pink' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                  leaveAtDoor ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </section>

        {/* Delivery Options */}
        <section className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-md font-semibold text-panda-text mb-3">Delivery options</h2>
          <div 
            onClick={() => setDeliveryOption('standard')}
            className={`p-3 border rounded-lg cursor-pointer flex items-center ${deliveryOption === 'standard' ? 'border-panda-pink bg-pink-50' : 'border-panda-border'}`}
          >
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-3 ${deliveryOption === 'standard' ? 'border-panda-pink bg-panda-pink' : 'border-gray-400'}`}>
              {deliveryOption === 'standard' && <div className="w-2.5 h-2.5 bg-white rounded-full"></div>}
            </div>
            <div>
              <p className="font-medium text-panda-text">Standard <span className="text-panda-text-light">5-20 mins</span></p>
            </div>
          </div>
        </section>

        {/* Payment Method */}
        <section className="bg-white p-4 rounded-lg shadow">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-md font-semibold text-panda-text">Payment method</h2>
            <button className="text-sm text-panda-pink font-medium">Change</button>
          </div>
          <div className="flex items-center">
            <div className="w-8 h-8 bg-orange-500 rounded-sm flex items-center justify-center text-white text-xs font-bold mr-3">JC</div>
            <div>
              <p className="font-medium text-panda-text">{paymentMethod}</p>
              <p className="text-sm text-panda-text-light">Rs. {totalWithFee.toFixed(2)}</p>
            </div>
          </div>
        </section>

        {/* Tip your rider */}
        <section className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-md font-semibold text-panda-text mb-3">Tip your rider</h2>
            <p className="text-xs text-panda-text-light mb-3">100% of the tip will go to your rider.</p>
            <div className="flex space-x-2 mb-3">
                {[0, 10, 20, 30].map(amount => (
                    <button 
                        key={amount}
                        onClick={() => setTipAmount(amount)}
                        className={`flex-1 py-2 border rounded-md text-sm ${tipAmount === amount ? 'bg-panda-pink text-white border-panda-pink' : 'bg-gray-100 border-panda-border text-panda-text'}`}
                    >
                        {amount === 0 ? 'No tip' : `${CURRENCY_SYMBOL}${amount}`}
                    </button>
                ))}
            </div>
        </section>
      </div>

      {/* Footer Summary & Place Order Button */}
      <div className="sticky bottom-0 bg-white p-4 shadow-[-2px_0px_10px_rgba(0,0,0,0.1)] border-t border-panda-border">
        <div className="flex justify-between items-center mb-1">
          <span className="text-panda-text-light">Subtotal ({itemCount} items)</span>
          <span className="text-panda-text">{CURRENCY_SYMBOL} {cartTotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center mb-1">
          <span className="text-panda-text-light">Delivery fee</span>
          <span className="text-panda-text">{CURRENCY_SYMBOL} {deliveryFee.toFixed(2)}</span>
        </div>
        {tipAmount > 0 && (
            <div className="flex justify-between items-center mb-1">
                <span className="text-panda-text-light">Rider tip</span>
                <span className="text-panda-text">{CURRENCY_SYMBOL} {tipAmount.toFixed(2)}</span>
            </div>
        )}
        <div className="flex justify-between items-center mb-3 font-bold text-lg">
          <span className="text-panda-text">Total (incl. fees and tax)</span>
          <span className="text-panda-text">{CURRENCY_SYMBOL} {(totalWithFee + tipAmount).toFixed(2)}</span>
        </div>
        <button
          onClick={handlePlaceOrder}
          disabled={isPlacingOrder}
          className="w-full bg-panda-pink text-white py-3 px-4 rounded-lg shadow-md hover:bg-panda-dark-pink transition duration-150 font-semibold flex items-center justify-center disabled:opacity-70"
        >
          {isPlacingOrder ? (
            <>
              <Icon name="info" size={20} className="animate-spin mr-2" /> Placing Order...
            </>
          ) : (
             'Place order'
          )}
        </button>
      </div>
    </div>
  );
};

export default CheckoutPage;