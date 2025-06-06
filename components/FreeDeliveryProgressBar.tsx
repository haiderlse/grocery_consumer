import React from 'react';
import { CURRENCY_SYMBOL, MIN_ORDER_FOR_FREE_DELIVERY } from '../constants';
import Icon from './Icon';

interface FreeDeliveryProgressBarProps {
  cartTotal: number;
  itemCount: number;
  className?: string; // To pass dynamic bottom positioning
}

const FreeDeliveryProgressBar: React.FC<FreeDeliveryProgressBarProps> = ({ cartTotal, itemCount, className }) => {
  const amountNeededForFreeDelivery = MIN_ORDER_FOR_FREE_DELIVERY - cartTotal;

  if (itemCount === 0 || amountNeededForFreeDelivery <= 0) {
    return null;
  }

  const progressPercentage = Math.max(0, (cartTotal / MIN_ORDER_FOR_FREE_DELIVERY) * 100);

  return (
    <div className={`sticky left-0 right-0 bg-pink-50 p-3 shadow-md border-t border-pink-200 md:max-w-md md:mx-auto z-30 ${className}`}>
      <div className="flex items-center">
        <Icon name="gift" size={24} className="text-panda-pink mr-2 flex-shrink-0" />
        <p className="text-xs text-panda-text">
          Add <span className="font-semibold text-panda-pink">{CURRENCY_SYMBOL} {amountNeededForFreeDelivery.toFixed(2)}</span> more for free delivery
        </p>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1.5">
        <div 
          className="bg-panda-pink h-1.5 rounded-full transition-all duration-300 ease-out" 
          style={{ width: `${progressPercentage}%` }}
          aria-valuenow={progressPercentage}
          aria-valuemin={0}
          aria-valuemax={100}
          role="progressbar"
          aria-label="Free delivery progress"
        ></div>
      </div>
    </div>
  );
};

export default FreeDeliveryProgressBar;