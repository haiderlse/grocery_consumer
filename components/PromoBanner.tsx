
import React from 'react';
import { Promotion } from '../types';
// Fixed: Import the Icon component
import Icon from './Icon';

interface PromoBannerProps {
  promotion: Promotion;
}

const PromoBanner: React.FC<PromoBannerProps> = ({ promotion }) => {
  if (promotion.type === 'card') {
    return (
      <div className="bg-purple-100 p-3 rounded-lg shadow-sm flex items-center">
        <Icon name="gift" size={24} className="text-purple-600 mr-3" />
        <div>
          <h4 className="text-sm font-semibold text-purple-700">{promotion.title}</h4>
          <p className="text-xs text-purple-600">{promotion.description}</p>
        </div>
      </div>
    );
  }

  // Type 'banner'
  return (
    <div className="rounded-lg overflow-hidden shadow-md">
      <img src={promotion.imageUrl} alt={promotion.title} className="w-full h-auto object-cover" />
      {/* You can add text overlay if needed */}
    </div>
  );
};

export default PromoBanner;