import React from 'react';
// Fixed: Updated react-router-dom imports to use namespace import.
import * as ReactRouterDOM from 'react-router-dom';
const { useNavigate, Link, useLocation } = ReactRouterDOM;
import Icon from './Icon';
import { useCart } from '../hooks/useCart';
import Logo from './Logo'; // Import the new Logo component

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
  onBackButtonClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, showBackButton = true, onBackButtonClick }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { getItemCount } = useCart();
  const itemCount = getItemCount();

  const handleBack = () => {
    if (onBackButtonClick) {
      onBackButtonClick();
    } else {
      // Check if there's meaningful history to go back to
      if (window.history.length > 2) {
        navigate(-1);
      } else {
        navigate('/'); // Fallback to home page if history is minimal
      }
    }
  };

  const showDefaultRightIcons = !['/account', '/search'].includes(location.pathname);
  const isHomePage = location.pathname === '/';


  return (
    <header className="bg-white shadow-sm sticky top-0 z-50 p-4">
      <div className="container mx-auto flex items-center justify-between h-12">
        <div className="flex items-center">
          {showBackButton && (
            <button
              onClick={handleBack}
              className="text-panda-pink mr-3 p-1 hover:bg-pink-50 rounded-full"
              aria-label="Go back"
            >
              <Icon name="back" size={24} />
            </button>
          )}
          {isHomePage && !showBackButton ? (
            <Logo className="h-7 w-auto" /> // Use Logo component on homepage
          ) : (
            <h1 className={`text-lg font-semibold text-panda-text ${showBackButton ? '' : 'ml-1'}`}>{title}</h1>
          )}
        </div>
        
        {showDefaultRightIcons && (
          <div className="flex items-center space-x-3">
            <button onClick={() => navigate('/search')} className="text-panda-text-light hover:text-panda-pink p-1" aria-label="Search">
              <Icon name="search" size={24} />
            </button>
            <Link to="/account" className="text-panda-text-light hover:text-panda-pink p-1" aria-label="My Account">
              <Icon name="user" size={24} />
            </Link>
            <Link to="/cart" className="relative text-panda-text-light hover:text-panda-pink p-1" aria-label="View Cart">
              <Icon name="cart" size={24} />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-panda-pink text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;