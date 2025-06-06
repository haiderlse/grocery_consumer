
import React from 'react';
// Fixed: Updated react-router-dom imports to use namespace import.
import * as ReactRouterDOM from 'react-router-dom';
const { Link } = ReactRouterDOM;
import { Category } from '../types';

interface CategoryCardProps {
  category: Category;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  return (
    <Link to={`/category/${category.id}`} className="block text-center group">
      <div className="bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-150 aspect-square flex flex-col items-center justify-center">
        <img src={category.imageUrl} alt={category.name} className="w-16 h-16 md:w-20 md:h-20 object-contain mb-2 rounded-md" /> {/* Increased size */}
        <h3 className="text-xs md:text-sm font-medium text-panda-text group-hover:text-panda-pink truncate w-full">{category.name}</h3>
      </div>
    </Link>
  );
};

export default CategoryCard;