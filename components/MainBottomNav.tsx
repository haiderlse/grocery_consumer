
import React from 'react';
// Fixed: Updated react-router-dom imports to use namespace import.
import * as ReactRouterDOM from 'react-router-dom';
const { Link, useLocation } = ReactRouterDOM;
import Icon from './Icon';

interface NavItemProps {
  to: string;
  iconName: string;
  label: string;
}

const NavItem: React.FC<NavItemProps> = ({ to, iconName, label }) => {
  const location = useLocation();
  const isActive = location.pathname === to || (to === "/" && location.pathname.startsWith("/category")) || (to === "/" && location.pathname.startsWith("/product")) ;


  return (
    <Link to={to} className={`flex flex-col items-center justify-center flex-1 py-2 px-1 group ${isActive ? 'text-panda-pink' : 'text-panda-text-light hover:text-panda-pink'}`}>
      <Icon name={iconName} size={24} className={`mb-0.5 ${isActive ? 'text-panda-pink' : 'text-gray-500 group-hover:text-panda-pink'}`} />
      <span className={`text-xs font-medium ${isActive ? 'text-panda-pink' : 'text-gray-600 group-hover:text-panda-pink'}`}>{label}</span>
    </Link>
  );
};

const MainBottomNav: React.FC = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-panda-border shadow-[-2px_0px_10px_rgba(0,0,0,0.1)] flex justify-around items-center h-16 md:max-w-md md:left-1/2 md:-translate-x-1/2 z-50"> {/* Removed md:mx-auto */}
      <NavItem to="/" iconName="home" label="Home" />
      <NavItem to="/search" iconName="search" label="Search" />
      <NavItem to="/account" iconName="user" label="Account" />
    </nav>
  );
};

export default MainBottomNav;