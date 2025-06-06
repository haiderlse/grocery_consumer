import React, { useState, useEffect, useRef } from 'react';
import { CartItem as CartItemType } from '../types';
import { CURRENCY_SYMBOL } from '../constants';
import { useCart } from '../hooks/useCart';
import Icon from './Icon';
// QuantitySelector is no longer used directly.

interface CartItemProps {
  item: CartItemType;
}

const CartItemCard: React.FC<CartItemProps> = ({ item }) => {
  const { updateQuantity, removeFromCart, getProductQuantity } = useCart();
  // Current quantity from the hook, ensuring it's always up-to-date
  const currentQuantity = getProductQuantity(item.product.id); 

  const [isExpanded, setIsExpanded] = useState(false);
  const collapseTimerRef = useRef<number | null>(null);

  const clearCollapseTimer = () => {
    if (collapseTimerRef.current) {
      clearTimeout(collapseTimerRef.current);
      collapseTimerRef.current = null;
    }
  };

  const startCollapseTimer = () => {
    clearCollapseTimer();
    collapseTimerRef.current = window.setTimeout(() => {
      setIsExpanded(false);
    }, 2500); // 2.5 seconds
  };

  useEffect(() => {
    // Cleanup timer on unmount
    return () => {
      clearCollapseTimer();
    };
  }, []);

  // If quantity drops to 0 (e.g. from another component or devtools), ensure it's not expanded
  useEffect(() => {
    if (currentQuantity === 0 && isExpanded) {
      setIsExpanded(false);
      clearCollapseTimer();
    }
  }, [currentQuantity, isExpanded]);


  const handleIncrease = () => {
    updateQuantity(item.product.id, currentQuantity + 1);
    startCollapseTimer();
  };

  const handleDecrease = () => {
    // updateQuantity in useCart hook handles removal if quantity becomes 0
    updateQuantity(item.product.id, currentQuantity - 1); 
    if (currentQuantity - 1 <= 0) {
      setIsExpanded(false); // Collapse immediately if item removed
      clearCollapseTimer();
    } else {
      startCollapseTimer(); // Otherwise, just reset timer
    }
  };

  const handleQuantityBadgeClick = () => {
    setIsExpanded(true);
    startCollapseTimer();
  };

  // If for some reason the item is no longer in cart (currentQuantity is 0), don't render anything or render differently
  if (currentQuantity === 0) {
    return null; 
  }

  return (
    <div className="flex items-center py-4 border-b border-panda-border">
      <img src={item.product.imageUrl} alt={item.product.name} className="w-16 h-16 object-cover rounded-md mr-4 flex-shrink-0" />
      <div className="flex-grow min-w-0"> {/* Added min-w-0 for better truncation */}
        <h3 className="text-sm font-medium text-panda-text truncate">{item.product.name}</h3>
        <p className="text-xs text-panda-text-light">{CURRENCY_SYMBOL} {item.product.price.toFixed(2)}</p>
      </div>
      <div className="flex flex-col items-end ml-2 space-y-1 flex-shrink-0"> {/* Reduced ml-4 to ml-2 for space */}
        {isExpanded ? (
          <div className="flex items-center bg-white rounded-full shadow-lg border border-gray-300 overflow-hidden">
            <button
              onClick={handleDecrease}
              className="p-1.5 sm:p-2 text-panda-pink hover:bg-pink-50 focus:outline-none" // Slightly smaller padding
              aria-label={currentQuantity === 1 ? `Remove ${item.product.name} from cart` : `Decrease quantity of ${item.product.name}`}
            >
              <Icon name="trash" size={16} /> {/* Smaller icon */}
            </button>
            <span className="px-2 text-xs sm:text-sm font-medium text-panda-text select-none" aria-live="polite" aria-atomic="true">
              {currentQuantity}
            </span>
            <button
              onClick={handleIncrease}
              className="p-1.5 sm:p-2 text-panda-pink hover:bg-pink-50 focus:outline-none"
              aria-label={`Increase quantity of ${item.product.name}`}
            >
              <Icon name="plus" size={16} />
            </button>
          </div>
        ) : (
          <button
            onClick={handleQuantityBadgeClick}
            className="bg-panda-pink text-white rounded-full w-7 h-7 flex items-center justify-center text-xs font-bold shadow-lg hover:bg-panda-dark-pink transition-colors"
            aria-label={`Currently ${currentQuantity} ${item.product.name} in cart. Click to edit quantity.`}
          >
            {currentQuantity}
          </button>
        )}
        <p className="text-sm font-semibold text-panda-pink">
          {CURRENCY_SYMBOL} {(item.product.price * currentQuantity).toFixed(2)}
        </p>
      </div>
    </div>
  );
};

export default CartItemCard;