
import React from 'react';
// Fixed: Updated react-router-dom imports to use namespace import.
import * as ReactRouterDOM from 'react-router-dom';
const { Link } = ReactRouterDOM;
import { Order } from '../types';
import Icon from './Icon';
import { CURRENCY_SYMBOL } from '../constants';

interface OrderHistoryItemProps {
  order: Order;
}

const OrderHistoryItem: React.FC<OrderHistoryItemProps> = ({ order }) => {
  const orderDate = new Date(order.orderDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const getStatusColor = (status: Order['orderStatus']) => { // Changed from Order['status']
    switch (status) {
      case 'Delivered': return 'text-green-600 bg-green-100';
      case 'Processing': return 'text-blue-600 bg-blue-100';
      case 'Shipped': return 'text-yellow-600 bg-yellow-100';
      case 'Cancelled': return 'text-red-600 bg-red-100';
      case 'AwaitingPayment':
      case 'Pending':
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-panda-border">
      <div className="flex flex-wrap justify-between items-center mb-2 gap-2">
        <h3 className="text-sm font-semibold text-panda-text truncate">Order ID: {order.id}</h3>
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${getStatusColor(order.orderStatus)}`}> {/* Changed from order.status */}
          {order.orderStatus} {/* Changed from order.status */}
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 text-xs text-panda-text-light mb-3">
          <p className="mb-1">Date: <span className="font-medium text-panda-text">{orderDate}</span></p>
          <p className="mb-1 sm:text-right">Total: <span className="font-medium text-panda-text">{CURRENCY_SYMBOL}{order.totalAmount.toFixed(2)}</span></p>
          <p className="col-span-1 sm:col-span-2 mb-1">Payment: <span className="font-medium text-panda-text">{order.paymentMethod}</span></p>
          <p className="col-span-1 sm:col-span-2 mb-1 truncate" title={`${order.deliveryAddress.street}, ${order.deliveryAddress.city}`}>
            Delivers to: <span className="font-medium text-panda-text">{order.deliveryAddress.street}, {order.deliveryAddress.city}</span>
          </p>
      </div>
      
      <Link
        to={`#`} // Placeholder: Consider `/account/orders/${order.id}` for future actual navigation
        onClick={(e) => { 
            e.preventDefault(); // Prevent default if it's just a placeholder
            console.log("View order details for:", order.id); 
            // Potentially navigate or open a modal here in a real app
        }}
        className="w-full text-sm text-center bg-panda-pink text-white py-2 px-3 rounded-md hover:bg-panda-dark-pink transition duration-150 flex items-center justify-center"
        aria-label={`View details for order ${order.id}`}
      >
        View Details <Icon name="chevronRight" size={16} className="ml-1" />
      </Link>
    </div>
  );
};

export default OrderHistoryItem;