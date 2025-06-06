
import React from 'react';
import Icon from './Icon';

interface QuantitySelectorProps {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  buttonSize?: 'small' | 'medium';
  showTrash?: boolean; // If true, decrease to 0 becomes trash
  maxQuantity?: number; // Optional maximum quantity allowed
}

const QuantitySelector: React.FC<QuantitySelectorProps> = ({ 
  quantity, 
  onIncrease, 
  onDecrease, 
  buttonSize = 'medium', 
  showTrash = false,
  maxQuantity 
}) => {
  const sizeClasses = buttonSize === 'small' 
    ? { button: 'p-1.5', icon: 16, text: 'text-sm' } 
    : { button: 'p-2', icon: 20, text: 'text-md' };

  const canIncrease = maxQuantity === undefined || quantity < maxQuantity;

  return (
    <div className="flex items-center justify-center bg-white rounded-md border border-panda-pink">
      <button
        onClick={onDecrease}
        className={`text-panda-pink hover:bg-pink-50 rounded-l-md ${sizeClasses.button} disabled:opacity-50 disabled:cursor-not-allowed`}
        disabled={!showTrash && quantity <=0} 
        aria-label="Decrease quantity"
      >
        {(showTrash && quantity === 1) ? <Icon name="trash" size={sizeClasses.icon} /> : <Icon name="minus" size={sizeClasses.icon} />}
      </button>
      <span className={`px-3 font-medium text-panda-text ${sizeClasses.text}`}>{quantity}</span>
      <button
        onClick={onIncrease}
        className={`text-panda-pink hover:bg-pink-50 rounded-r-md ${sizeClasses.button} disabled:opacity-50 disabled:cursor-not-allowed`}
        aria-label="Increase quantity"
        disabled={!canIncrease}
      >
        <Icon name="plus" size={sizeClasses.icon} />
      </button>
    </div>
  );
};

export default QuantitySelector;