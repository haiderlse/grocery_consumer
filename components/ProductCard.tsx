
import React, { useState, useEffect, useRef } from 'react';
// Fixed: Updated react-router-dom imports to use namespace import.
import * as ReactRouterDOM from 'react-router-dom';
const { Link } = ReactRouterDOM;
import { Product } from '../types';
import { CURRENCY_SYMBOL } from '../constants';
import { useCart } from '../hooks/useCart';
import { useFavourites } from '../hooks/useFavourites'; // Import useFavourites
import Icon from './Icon';
// QuantitySelector is no longer used directly in this component's main layout for adding to cart.

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, getProductQuantity, updateQuantity } = useCart();
  const { addFavourite, removeFavourite, isFavourite } = useFavourites(); // Use Favourites hook
  
  const quantityInCart = getProductQuantity(product.id);
  const productInCart = quantityInCart > 0;
  const isProdFavourite = isFavourite(product.id);
  const isOutOfStock = product.stock <= 0;

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
    }, 2500); // Changed from 5000 to 2500
  };

  useEffect(() => {
    // Cleanup timer on unmount
    return () => {
      clearCollapseTimer();
    };
  }, []);

  useEffect(() => {
    if (quantityInCart === 0 && isExpanded) {
      setIsExpanded(false);
      clearCollapseTimer();
    }
  }, [quantityInCart, isExpanded]);


  const handleInitialAdd = () => {
    if (isOutOfStock) return;
    addToCart(product, 1);
    setIsExpanded(true);
    startCollapseTimer();
  };

  const handleIncrease = () => {
    if (isOutOfStock || quantityInCart >= product.stock) return;
    updateQuantity(product.id, quantityInCart + 1);
    startCollapseTimer();
  };

  const handleDecrease = () => {
    updateQuantity(product.id, quantityInCart - 1); 
    if (quantityInCart - 1 <= 0) {
      setIsExpanded(false); 
      clearCollapseTimer();
    } else {
      startCollapseTimer(); 
    }
  };

  const handleQuantityBadgeClick = () => {
    if (isOutOfStock) return;
    setIsExpanded(true);
    startCollapseTimer();
  };

  const handleToggleFavourite = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent link navigation if heart is inside a Link
    e.stopPropagation(); // Prevent event bubbling
    if (isProdFavourite) {
      removeFavourite(product.id);
    } else {
      addFavourite(product.id);
    }
  };
  
  let displayDiscountText: string | null = null;
  const explicitDiscountTag = product.tags?.find(tag => /^\d+(\.\d+)?%\s*off$/i.test(tag.trim()));

  if (explicitDiscountTag) {
    const match = explicitDiscountTag.trim().match(/^(\d+(\.\d+)?)%\s*off$/i);
    if (match && match[1]) {
      displayDiscountText = `${match[1]}% OFF`;
    }
  } else if (product.originalPrice && product.price < product.originalPrice) {
    const calculatedPercentage = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
    if (calculatedPercentage > 0) {
      displayDiscountText = `${calculatedPercentage}% OFF`;
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full relative">
      <div className="relative">
        {displayDiscountText && !isOutOfStock && (
         <div className="absolute top-2 left-2 bg-panda-pink text-white text-xs font-semibold px-2 py-1 rounded z-10">
           {displayDiscountText}
         </div>
       )}
       {isOutOfStock && (
          <div className="absolute top-2 left-2 bg-gray-500 text-white text-xs font-semibold px-2 py-1 rounded z-10">
            Out of Stock
          </div>
        )}
        <Link to={`/product/${product.id}`} className={`block ${isOutOfStock ? 'opacity-70 cursor-not-allowed' : ''}`} aria-label={`View details for ${product.name}`} onClick={(e) => isOutOfStock && e.preventDefault()}>
          <img src={product.imageUrl} alt={product.name} className="w-full h-36 object-cover" />
        </Link>
        
        {!isOutOfStock && (
          <div className="absolute bottom-2 right-2 z-20">
            {!productInCart && !isExpanded && (
              <button
                onClick={handleInitialAdd}
                className="bg-panda-green text-white rounded-full p-0 shadow-lg hover:bg-green-700 transition-colors flex items-center justify-center w-9 h-9 opacity-90"
                aria-label={`Add ${product.name} to cart`}
                disabled={isOutOfStock}
              >
                <Icon name="plus" size={20} />
              </button>
            )}

            {productInCart && isExpanded && (
              <div className="flex items-center bg-white rounded-full shadow-lg border border-gray-300 overflow-hidden">
                <button
                  onClick={handleDecrease}
                  className="p-2 text-panda-pink hover:bg-pink-50 focus:outline-none"
                  aria-label={quantityInCart === 1 ? `Remove ${product.name} from cart` : `Decrease quantity of ${product.name}`}
                >
                  <Icon name={quantityInCart === 1 ? "trash" : "minus"} size={18} /> 
                </button>
                <span className="px-2.5 text-sm font-medium text-panda-text select-none" aria-live="polite" aria-atomic="true">
                  {quantityInCart}
                </span>
                <button
                  onClick={handleIncrease}
                  className="p-2 text-panda-pink hover:bg-pink-50 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label={`Increase quantity of ${product.name}`}
                  disabled={quantityInCart >= product.stock}
                >
                  <Icon name="plus" size={18} />
                </button>
              </div>
            )}

            {productInCart && !isExpanded && (
              <button
                onClick={handleQuantityBadgeClick}
                className="bg-panda-pink text-white rounded-full w-7 h-7 flex items-center justify-center text-xs font-bold shadow-lg hover:bg-panda-dark-pink transition-colors"
                aria-label={`Currently ${quantityInCart} ${product.name} in cart. Click to edit quantity.`}
                disabled={isOutOfStock}
              >
                {quantityInCart}
              </button>
            )}
          </div>
        )}

        <button 
            onClick={handleToggleFavourite}
            className={`absolute top-2 right-2 bg-white/80 p-1.5 rounded-full focus:outline-none z-10 
                        ${isProdFavourite ? 'text-panda-pink' : 'text-gray-600 hover:text-panda-pink'}`}
            aria-label={isProdFavourite ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
        >
          <Icon name={isProdFavourite ? "heart-filled" : "heart"} size={18} />
        </button>
      </div>

      <div className="p-3 flex flex-col flex-grow">
        <Link to={`/product/${product.id}`} className={`block ${isOutOfStock ? 'opacity-70 cursor-not-allowed' : ''}`} onClick={(e) => isOutOfStock && e.preventDefault()}>
          <h3 className="text-sm font-semibold text-panda-text mb-1 truncate">{product.name}</h3>
        </Link>
        <p className="text-xs text-panda-text-light mb-2 truncate h-8">{product.description}</p>
        <div className="mt-auto">
          <div className="flex items-center mb-2">
            <span className={`font-bold text-md ${isOutOfStock ? 'text-gray-400' : 'text-panda-pink'}`}>{CURRENCY_SYMBOL} {product.price.toFixed(2)}</span>
            {product.originalPrice && (
              <span className={`text-xs line-through ml-2 ${isOutOfStock ? 'text-gray-400' : 'text-gray-500'}`}>{CURRENCY_SYMBOL} {product.originalPrice.toFixed(2)}</span>
            )}
          </div>
          <div className="h-[30px]"></div> {/* Reduced height from h-[36px] */}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;