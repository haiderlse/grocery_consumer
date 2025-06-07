
import React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
const { HashRouter, Routes, Route, useLocation, useNavigate, Link, Navigate } = ReactRouterDOM;
import { Analytics } from "@vercel/analytics/react"; // Added import

// Page Imports using @/ alias
import HomePage from '@/pages/HomePage';
import CategoryPage from '@/pages/CategoryPage';
import ProductDetailPage from '@/pages/ProductDetailPage';
import CartPage from '@/pages/CartPage';
import CheckoutPage from '@/pages/CheckoutPage';
import OrderTrackingPage from '@/pages/OrderTrackingPage'; 
import AccountPage from '@/pages/AccountPage';
import SearchPage from '@/pages/SearchPage';
import LoginPage from '@/pages/LoginPage'; 
import RegistrationPage from '@/pages/RegistrationPage'; 

// New Account Sub-Page Imports
import ProfileDetailsPage from '@/pages/account/ProfileDetailsPage';
import AddressesPage from '@/pages/account/AddressesPage';
import WalletPage from '@/pages/account/WalletPage';
import SubscriptionPage from '@/pages/account/SubscriptionPage';
import VouchersPage from '@/pages/account/VouchersPage';
import RewardsPage from '@/pages/account/RewardsPage';
import InviteFriendsPage from '@/pages/account/InviteFriendsPage';
import SettingsPage from '@/pages/account/SettingsPage';


// Component Imports using @/ alias
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MainBottomNav from '@/components/MainBottomNav';
import FreeDeliveryProgressBar from '@/components/FreeDeliveryProgressBar';
import Icon from '@/components/Icon';
// Admin components and ProtectedRoute removed as admin functionality is being removed

// Hook Imports using @/ alias
import { useCart } from '@/hooks/useCart';
// import { useAuth } from '@/hooks/useAuth'; // auth check removed for bypass
import { MIN_ORDER_FOR_FREE_DELIVERY } from '@/constants';


const App: React.FC = () => {
  return (
    <HashRouter>
      <Analytics /> {/* Added Vercel Analytics component */}
      <AppRouterOutlet />
    </HashRouter>
  );
};

const AppRouterOutlet: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegistrationPage />} /> 
      {/* Admin routes removed */}
      <Route path="/*" element={<MainApplicationContent />} />
    </Routes>
  );
};

// AdminApplicationInternalRoutes component removed as it's no longer used.

const MainApplicationContent: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { getItemCount, getCartTotal } = useCart();
  // const auth = useAuth(); // auth check removed for bypass

  const itemCount = getItemCount();
  const cartTotal = getCartTotal();

  const noHeaderPaths = ['/checkout', '/track-order/:orderId']; 
  const noGeneralFooterElementsPaths = ['/checkout', '/track-order/:orderId']; 
  const noMainBottomNavSpecificPaths = ['/cart'];

  const isTrackingPage = /^\/track-order\/[^/]+$/.test(location.pathname);

  const showHeader = !noHeaderPaths.some(path => 
    path.includes(':orderId') ? new RegExp(`^${path.replace(':orderId', '[^/]+')}$`).test(location.pathname) : path === location.pathname
  ) && !isTrackingPage;


  const showMainBottomNav = ![...noGeneralFooterElementsPaths, ...noMainBottomNavSpecificPaths].some(path => 
     path.includes(':orderId') ? new RegExp(`^${path.replace(':orderId', '[^/]+')}$`).test(location.pathname) : path === location.pathname
  ) && !isTrackingPage;

  const showCartBarFooter = showMainBottomNav && !['/cart'].includes(location.pathname) && itemCount > 0;
  
  const showFreeDeliveryProgress =
    itemCount > 0 &&
    cartTotal < MIN_ORDER_FOR_FREE_DELIVERY &&
    !noGeneralFooterElementsPaths.some(path => 
      path.includes(':orderId') ? new RegExp(`^${path.replace(':orderId', '[^/]+')}$`).test(location.pathname) : path === location.pathname
    ) && !isTrackingPage;


  let freeDeliveryBarBottomClass = '';
  if (showFreeDeliveryProgress) {
    if (showCartBarFooter) {
      freeDeliveryBarBottomClass = 'bottom-32';
    } else if (showMainBottomNav) {
      freeDeliveryBarBottomClass = 'bottom-16';
    } else {
      freeDeliveryBarBottomClass = 'bottom-0';
    }
  }

  let headerTitle = "Pick Me Up";
  let showBackButton = true;
  
  const isAccountPage = location.pathname === '/account';
  const isAccountSubPage = location.pathname.startsWith('/account/') && location.pathname !== '/account';


  if (location.pathname === '/') {
    headerTitle = "Pick Me Up";
    showBackButton = false;
  } else if (location.pathname.startsWith('/category/')) {
    headerTitle = "All categories";
  } else if (location.pathname.startsWith('/product/')) {
    headerTitle = "Product Details";
  } else if (location.pathname === '/cart') {
    headerTitle = "Cart";
  } else if (location.pathname === '/checkout') {
    headerTitle = "Checkout";
  } else if (isTrackingPage) { 
    headerTitle = "Your Order"; 
  } else if (isAccountPage) {
    headerTitle = "Account";
    showBackButton = false;
  } else if (location.pathname === '/account/profile-details') {
    headerTitle = "Profile Details";
  } else if (location.pathname === '/account/addresses') {
    headerTitle = "My Addresses";
  } else if (location.pathname === '/account/wallet') {
    headerTitle = "My Wallet";
  } else if (location.pathname === '/account/subscription') {
    headerTitle = "Subscription";
  } else if (location.pathname === '/account/vouchers') {
    headerTitle = "My Vouchers";
  } else if (location.pathname === '/account/rewards') {
    headerTitle = "Rewards";
  } else if (location.pathname === '/account/invite') {
    headerTitle = "Invite Friends";
  } else if (location.pathname === '/account/settings') {
    headerTitle = "Settings";
  } else if (location.pathname === '/search') {
    headerTitle = "Search";
  }

  const isCategoryPage = location.pathname.startsWith('/category/');
  
  const customBackAction = isCategoryPage ? () => navigate('/') : 
                           isAccountSubPage ? () => navigate('/account') : undefined;

  const headerForSearch = (
    <Header
        title="Search"
        showBackButton={true}
    />
  );

  const headerForAccount = ( // This header is ONLY for the main /account page
     <header className="bg-white shadow-sm sticky top-0 z-50 p-4">
      <div className="container mx-auto flex items-center justify-between h-12">
        <div className="flex items-center">
           <h1 className="text-lg font-semibold text-panda-text ml-1">{headerTitle}</h1>
        </div>
        <div className="flex items-center space-x-3">
            <Link to="/account/settings" className="text-panda-text-light hover:text-panda-pink p-1" aria-label="Settings">
              <Icon name="settings" size={24} />
            </Link>
        </div>
      </div>
    </header>
  );

  let mainPaddingBottomClass = '';
  if (showCartBarFooter) {
    mainPaddingBottomClass = 'pb-32';
  } else if (showMainBottomNav) {
    mainPaddingBottomClass = 'pb-16';
  }

  return (
    <div className="flex flex-col min-h-screen font-sans bg-panda-bg-light md:max-w-md md:mx-auto md:shadow-lg">
      {showHeader && location.pathname === '/search' && headerForSearch}
      {showHeader && isAccountPage && headerForAccount} {/* Show custom header only for /account */}
      
      {/* Default Header for other pages, including account sub-pages */}
      {showHeader && !['/search', '/account'].includes(location.pathname) && (
        <Header
          title={headerTitle}
          showBackButton={showBackButton && location.pathname !== '/'}
          onBackButtonClick={customBackAction}
        />
      )}

      <main className={`flex-grow ${mainPaddingBottomClass}`}>
        <Routes>
          <Route 
            path="/" 
            element={<HomePage />} // Directly render HomePage, bypassing auth check
          />
          <Route path="/category/:categoryId" element={<CategoryPage />} />
          <Route path="/product/:productId" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/track-order/:orderId" element={<OrderTrackingPage />} /> 
          <Route path="/account" element={<AccountPage />} />
          <Route path="/search" element={<SearchPage />} />

          {/* New Account Sub-Page Routes */}
          <Route path="/account/profile-details" element={<ProfileDetailsPage />} />
          <Route path="/account/addresses" element={<AddressesPage />} />
          <Route path="/account/wallet" element={<WalletPage />} />
          <Route path="/account/subscription" element={<SubscriptionPage />} />
          <Route path="/account/vouchers" element={<VouchersPage />} />
          <Route path="/account/rewards" element={<RewardsPage />} />
          <Route path="/account/invite" element={<InviteFriendsPage />} />
          <Route path="/account/settings" element={<SettingsPage />} />
          
          <Route 
            path="*" 
            element={<Navigate to="/" replace />} // Navigate to home for any unmatched paths
          />
        </Routes>
      </main>

      {showFreeDeliveryProgress && (
        <FreeDeliveryProgressBar
          cartTotal={cartTotal}
          itemCount={itemCount}
          className={freeDeliveryBarBottomClass}
        />
      )}
      {showCartBarFooter && <Footer />}
      {showMainBottomNav && <MainBottomNav />}
    </div>
  );
};

export default App;
