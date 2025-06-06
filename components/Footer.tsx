
import React from 'react';
// Fixed: Updated react-router-dom imports to use namespace import.
import * as ReactRouterDOM from 'react-router-dom';
const { Link, useLocation } = ReactRouterDOM;
import { useCart } from '../hooks/useCart';
import { CURRENCY_SYMBOL } from '../constants';
import Icon from './Icon';

const Footer: React.FC = () => {
  const { getItemCount, getCartTotal } = useCart();
  const location = useLocation();
  const itemCount = getItemCount();
  const cartTotal = getCartTotal();

  const isHomePage = location.pathname === '/';
  const isCategoryPage = location.pathname.startsWith('/category');
  const isProductPage = location.pathname.startsWith('/product');

  // This component is only rendered by App.tsx if MainBottomNav is also present.
  // So, we can assume MainBottomNav is taking up the bottom h-16 (4rem).
  const showCartBar = (isHomePage || isCategoryPage || isProductPage) && itemCount > 0;

  if (showCartBar) {
    return (
      <footer className="fixed bottom-16 left-0 right-0 bg-white p-4 shadow-[-2px_0px_10px_rgba(0,0,0,0.1)] md:max-w-md md:left-1/2 md:-translate-x-1/2 z-40"> {/* Changed bottom-0 to bottom-16, added z-40, removed md:mx-auto */}
        <Link
          to="/cart"
          className="flex items-center justify-between bg-panda-pink text-white w-full py-3 px-4 rounded-lg shadow-md hover:bg-panda-dark-pink transition duration-150"
        >
          <div className="flex items-center">
            <div className="bg-white/20 rounded p-1 mr-3">
              <Icon name="cart" className="text-white" size={20} />
            </div>
            <span className="font-semibold">{itemCount} item{itemCount > 1 ? 's' : ''}</span>
          </div>
          <div className="flex items-center">
            <span className="font-bold mr-2">View your cart</span>
            <span className="font-bold">{CURRENCY_SYMBOL} {cartTotal.toFixed(2)}</span>
          </div>
        </Link>
      </footer>
    );
  }
  
  return null; 
};

export default Footer;