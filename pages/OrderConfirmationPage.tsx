
import React from 'react';
// Fixed: Updated react-router-dom imports to use namespace import.
import * as ReactRouterDOM from 'react-router-dom';
const { Link, useLocation, useNavigate } = ReactRouterDOM;
import { CURRENCY_SYMBOL } from '../constants';
import Icon from '../components/Icon';

const OrderConfirmationPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderTotal, paymentMethod } = (location.state as { orderTotal?: number; paymentMethod?: string }) || {};

  if (!orderTotal) {
    // If no order total, maybe redirect or show generic message
    // This might happen if user navigates directly to this page
    React.useEffect(() => {
      navigate('/');
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return null;
  }
  
  const estimatedDelivery = "5-20 minutes"; // Example

  return (
    <div className="bg-panda-bg-light min-h-screen flex flex-col items-center justify-center p-4 text-center">
      <div className="bg-white p-6 md:p-10 rounded-xl shadow-xl max-w-md w-full">
        <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-panda-green mb-6">
          <Icon name="checkCircle" size={48} className="text-white" />
        </div>
        <h1 className="text-2xl font-bold text-panda-text mb-3">Thank You!</h1>
        <p className="text-lg text-panda-green font-semibold mb-2">Your order has been placed successfully.</p>
        <p className="text-panda-text-light mb-6">
          An order confirmation and receipt has been sent to your (mock) email.
        </p>

        <div className="bg-gray-50 p-4 rounded-lg text-left mb-6 border border-panda-border">
            <h3 className="font-semibold text-panda-text mb-2">Order Summary</h3>
            <div className="flex justify-between text-sm text-panda-text-light mb-1">
                <span>Order Total:</span>
                <span className="font-medium text-panda-text">{CURRENCY_SYMBOL} {orderTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-panda-text-light mb-1">
                <span>Payment Method:</span>
                <span className="font-medium text-panda-text">{paymentMethod || 'N/A'}</span>
            </div>
             <div className="flex justify-between text-sm text-panda-text-light">
                <span>Estimated Delivery:</span>
                <span className="font-medium text-panda-text">{estimatedDelivery}</span>
            </div>
        </div>

        <div className="space-y-3">
            <button 
                // onClick={() => navigate('/account/orders/ORDER_ID')} // TODO: Navigate to specific order
                className="w-full bg-panda-pink text-white py-3 px-4 rounded-lg shadow-md hover:bg-panda-dark-pink transition duration-150 font-semibold"
            >
                Track Your Order
            </button>
            <Link
                to="/"
                className="block w-full bg-transparent text-panda-pink py-3 px-4 rounded-lg border-2 border-panda-pink hover:bg-pink-50 transition duration-150 font-semibold"
            >
                Continue Shopping
            </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;