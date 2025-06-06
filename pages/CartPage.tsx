
import React, { useState, useEffect } from 'react';
// Fixed: Updated react-router-dom imports to use namespace import.
import * as ReactRouterDOM from 'react-router-dom';
const { Link, useNavigate } = ReactRouterDOM;
import { useCart } from '../hooks/useCart';
import { CURRENCY_SYMBOL, PICK_ME_UP_LOCATION } from '../constants';
import CartItemCard from '../components/CartItem';
import ProductCard from '../components/ProductCard';
import Stepper from '../components/Stepper';
import { Product } from '../types';
import { productService } from '../services/productService';
import Icon from '../components/Icon';

const CartPage: React.FC = () => {
  const { items, getCartTotal, clearCart, getItemCount } = useCart();
  const navigate = useNavigate();
  const cartTotal = getCartTotal();
  const itemCount = getItemCount();
  const [suggestedItems, setSuggestedItems] = useState<Product[]>([]);

  useEffect(() => {
    const fetchSuggestedItems = async () => {
      const popular = await productService.getProducts(undefined, 'Popular');
      setSuggestedItems(popular.filter(p => p.stock > 0).slice(0, 3)); // Show 3 in-stock suggestions
    };
    fetchSuggestedItems();
  }, []);


  const handleCheckout = () => {
    if (items.length > 0) {
      navigate('/checkout');
    } else {
      // Optionally show an alert or message
      alert("Your cart is empty. Please add items to proceed.");
    }
  };
  
  const deliveryTime = "Standard (5–20 mins)"; // Example


  return (
    <div className="bg-panda-bg-light min-h-screen flex flex-col">
      <div className="bg-white shadow-sm">
        <div className="p-4">
            <p className="text-sm text-panda-text-light text-center">{PICK_ME_UP_LOCATION}</p>
        </div>
        <Stepper steps={['Menu', 'Cart', 'Checkout']} currentStep={1} />
      </div>

      {items.length === 0 ? (
        <div className="flex-grow flex flex-col items-center justify-center p-8 text-center">
          <Icon name="cart" size={64} className="text-gray-300 mb-4" />
          <h2 className="text-xl font-semibold text-panda-text mb-2">Your cart is empty</h2>
          <p className="text-panda-text-light mb-6">Looks like you haven't added anything to your cart yet.</p>
          <Link
            to="/"
            className="bg-panda-pink text-white py-3 px-6 rounded-lg font-semibold hover:bg-panda-dark-pink transition duration-150"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <>
          <div className="p-4 bg-white">
            <div className="flex justify-between items-center mb-3">
                <div>
                    <p className="text-sm text-panda-text-light">Est. Delivery Time</p>
                    <p className="text-md font-semibold text-panda-text">{deliveryTime}</p>
                </div>
                <Link to="#" className="text-sm text-panda-pink font-medium hover:underline">Change</Link>
            </div>
          </div>

          <div className="flex-grow p-4 bg-white mt-2">
            {items.map(item => (
              <CartItemCard key={item.product.id} item={item} />
            ))}
            <button 
              onClick={() => navigate('/')} // Or to a specific category page
              className="w-full mt-4 text-panda-pink font-medium py-2 flex items-center justify-center hover:bg-pink-50 rounded-md border border-panda-pink"
            >
              <Icon name="plus" size={18} className="mr-2" /> Add more items
            </button>
          </div>
        </>
      )}

      {/* Items you've bought before / Suggestions */}
      {suggestedItems.length > 0 && (
        <section className="p-4 bg-white mt-2 relative z-[1]"> {/* Added relative z-[1] */}
          <h3 className="text-md font-semibold text-panda-text mb-3">You might also like</h3>
          <div className="grid grid-cols-3 gap-3">
            {suggestedItems.map(product => (
              <div key={product.id} className="text-xs"> {/* Simplified card for suggestions */}
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Cart Summary & Action Button - Fixed at bottom */}
      {items.length > 0 && (
         <div className="sticky bottom-0 bg-white p-4 shadow-[-2px_0px_10px_rgba(0,0,0,0.1)] border-t border-panda-border z-40">
            <div className="flex justify-between items-center mb-3">
                <span className="text-panda-text-light">Total ({itemCount} item{itemCount !== 1 ? 's' : ''}):</span>
                <span className="text-xl font-bold text-panda-text">{CURRENCY_SYMBOL} {cartTotal.toFixed(2)}</span>
            </div>
            <p className="text-xs text-panda-text-light mb-3">Incl. fees and tax - <Link to="#" className="text-panda-pink underline">See summary</Link></p>
            <button
                onClick={handleCheckout}
                className="w-full bg-panda-pink text-white py-3 px-4 rounded-lg shadow-md hover:bg-panda-dark-pink transition duration-150 font-semibold"
            >
                Confirm payment and address
            </button>
         </div>
      )}
    </div>
  );
};

export default CartPage;