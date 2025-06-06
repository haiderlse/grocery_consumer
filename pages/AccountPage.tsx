
import React, { useState, useEffect } from 'react';
// Fixed: Updated react-router-dom imports to use namespace import.
import * as ReactRouterDOM from 'react-router-dom';
const { Link, useNavigate, useSearchParams } = ReactRouterDOM;
import { Order, UserProfile, Product } from '../types';
import Icon from '../components/Icon';
import { CURRENCY_SYMBOL } from '../constants';
import OrderHistoryItem from '../components/OrderHistoryItem';
import { useFavourites } from '../hooks/useFavourites'; // Import useFavourites
import { productService } from '../services/productService'; // Import productService
import ProductCard from '../components/ProductCard'; // Import ProductCard
import { useAuth } from '@/hooks/useAuth'; // Added useAuth import

// Mock data
const mockUserProfile: UserProfile = {
  id: 'user123',
  name: 'Ali', // Updated name
  email: 'ali.pro@example.com',
  phone: '+92 300 1234567',
};

const mockOrders: Order[] = [
  { 
    id: 'order001', 
    items: [
        // Example: { product: { id: 'p1', name: 'Apple', price: 100, imageUrl: '', category: '', description: '', stock: 10 }, quantity: 2 }
    ], 
    totalAmount: 1500.50, 
    deliveryAddress: { street: '123 Food St', city: 'Karachi', postalCode: '75500', country: 'PK' },
    paymentMethod: 'JazzCash', 
    orderStatus: 'Delivered', // Changed from status to orderStatus
    paymentStatus: 'Paid',
    orderDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    estimatedDeliveryTime: '15-25 mins' 
  },
  { 
    id: 'order002', 
    items: [],
    totalAmount: 850.00, 
    deliveryAddress: { street: '456 Snack Ave', city: 'Lahore', postalCode: '54000', country: 'PK' },
    paymentMethod: 'Card on Delivery', 
    orderStatus: 'Processing', // Changed from status to orderStatus
    paymentStatus: 'Pending',
    orderDate: new Date().toISOString(), // Today
    estimatedDeliveryTime: '20-30 mins' 
  },
];


const AccountPage: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeSection, setActiveSection] = useState<'profile' | 'orders' | 'favourites'>('profile');

  const { getFavouriteProductIds } = useFavourites();
  const [favouriteProducts, setFavouriteProducts] = useState<Product[]>([]);
  const [isLoadingFavourites, setIsLoadingFavourites] = useState(false);
  
  const auth = useAuth(); // Get auth context

  useEffect(() => {
    setUser(mockUserProfile);
    setOrders(mockOrders);
    
    const tab = searchParams.get('tab');
    if (tab === 'orders') {
        setActiveSection('orders');
    } else if (tab === 'favourites') {
        setActiveSection('favourites');
    } else {
        setActiveSection('profile');
    }
  }, [searchParams]);

  useEffect(() => {
    if (activeSection === 'favourites') {
      const fetchFavouriteProducts = async () => {
        setIsLoadingFavourites(true);
        const favIds = getFavouriteProductIds();
        if (favIds.length > 0) {
          try {
            const productPromises = favIds.map(id => productService.getProductById(id));
            const fetchedProducts = (await Promise.all(productPromises))
                                      .filter(p => p !== undefined && p.stock > 0) as Product[]; // Filter for in-stock
            setFavouriteProducts(fetchedProducts);
          } catch (error) {
            console.error("Failed to fetch favourite products:", error);
            setFavouriteProducts([]);
          }
        } else {
          setFavouriteProducts([]);
        }
        setIsLoadingFavourites(false);
      };
      fetchFavouriteProducts();
    }
  }, [activeSection, getFavouriteProductIds]);


  if (!user && activeSection === 'profile') { // Only show main loader for profile if user isn't loaded
    return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-panda-pink"></div></div>;
  }
  
  const perkItems = [
    { name: 'Subscription', icon: 'crown', link: '/account/subscription' },
    { name: 'Vouchers', icon: 'ticket-alt', link: '/account/vouchers' },
    { name: 'Pick Me Up Rewards', icon: 'star', link: '/account/rewards' },
    { name: 'Invite friends', icon: 'gift', link: '/account/invite' },
  ];

  const quickActions = [
    { name: 'Orders', icon: 'receipt', section: 'orders' as const, link: null },
    { name: 'Favourites', icon: 'heart', section: 'favourites' as const, link: null },
    { name: 'Addresses', icon: 'address-book', link: '/account/addresses', section: null },
  ];

  const handleQuickActionClick = (action: typeof quickActions[0]) => {
    if (action.section) {
      setActiveSection(action.section);
      setSearchParams({ tab: action.section });
    } else if (action.link) {
      navigate(action.link);
    }
  };


  const handleLogout = () => {
    auth.logout();
    navigate('/login', { replace: true });
  };

  const renderProfileView = () => (
    <>
        {/* User Profile Section */}
        <div className="bg-white p-4 pt-2">
            <div className="flex items-center">
            <img 
                src={`https://ui-avatars.com/api/?name=${user?.name.replace(' ', '+')}&background=14b8a6&color=fff&font-size=0.5&size=128`} 
                alt={user?.name} 
                className="w-16 h-16 rounded-full mr-4 border-2 border-panda-pink"
            />
            <div>
                <div className="flex items-center">
                    <h2 className="text-xl font-bold text-panda-text mr-2">{user?.name}</h2>
                    <span className="bg-purple-600 text-white text-xs font-semibold px-2 py-0.5 rounded-full flex items-center">
                        <Icon name="crown" size={12} className="mr-1"/> PRO
                    </span>
                </div>
                <button onClick={() => navigate('/account/profile-details')} className="text-sm text-panda-pink hover:underline">View profile</button>
            </div>
            </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-4 mt-2 shadow-sm">
            <div className="grid grid-cols-3 gap-4 text-center">
            {quickActions.map(action => (
                <button 
                    key={action.name} 
                    onClick={() => handleQuickActionClick(action)}
                    className="flex flex-col items-center p-2 rounded-lg hover:bg-gray-100 focus:outline-none"
                >
                    <div className="bg-pink-50 p-3 rounded-full mb-1.5">
                        <Icon name={action.icon} size={24} className="text-panda-pink" />
                    </div>
                    <span className="text-xs text-panda-text font-medium">{action.name}</span>
                </button>
            ))}
            </div>
        </div>
        
        {/* Pick Me Up Credit */}
        <div className="bg-white p-4 mt-2 shadow-sm">
            <Link to="/account/wallet" className="flex items-center justify-between hover:bg-gray-50 -m-4 p-4 rounded-lg">
                <div className="flex items-center">
                    <Icon name="wallet" size={24} className="text-panda-pink mr-3" />
                    <span className="text-md font-medium text-panda-text">Pick Me Up Credit</span>
                </div>
                <div className="flex items-center">
                    <span className="text-md text-panda-text-light mr-1">{CURRENCY_SYMBOL} 0.00</span>
                    <Icon name="chevronRight" size={20} className="text-gray-400" />
                </div>
            </Link>
        </div>

        {/* Perks for you */}
        <div className="bg-white p-4 mt-2 shadow-sm">
            <h3 className="text-md font-semibold text-panda-text mb-1">Perks for you</h3>
            {perkItems.map(perk => (
                <Link key={perk.name} to={perk.link} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 -mx-4 px-4">
                    <div className="flex items-center">
                        <Icon name={perk.icon} size={20} className="text-panda-text-light mr-3" />
                        <span className="text-sm text-panda-text capitalize">{perk.name}</span>
                    </div>
                    <Icon name="chevronRight" size={20} className="text-gray-400" />
                </Link>
            ))}
        </div>
        
        <div className="bg-white p-4 mt-2 shadow-sm">
                <Link to="/account/settings" className="flex items-center justify-between py-3 border-b border-gray-100 hover:bg-gray-50 -mx-4 px-4">
                    <div className="flex items-center">
                        <Icon name="settings" size={20} className="text-panda-text-light mr-3" />
                        <span className="text-sm text-panda-text">Settings</span>
                    </div>
                    <Icon name="chevronRight" size={20} className="text-gray-400" />
                </Link>
                <button 
                    onClick={handleLogout}
                    className="w-full text-left flex items-center py-3 text-red-500 hover:bg-red-50 -mx-4 px-4 mt-1"
                >
                    <Icon name="logout" size={20} className="mr-3" />
                    <span className="text-sm font-medium">Logout</span>
                </button>
        </div>
    </>
  );

  const renderOrdersView = () => (
    <div className="p-4">
      <div className="flex items-center mb-4">
        <button onClick={() => { setActiveSection('profile'); setSearchParams({}); }} className="text-panda-pink mr-2 p-1 hover:bg-pink-50 rounded-full">
          <Icon name="back" size={24} />
        </button>
        <h2 className="text-xl font-bold text-panda-text">My Orders</h2>
      </div>
      {orders.length === 0 ? (
        <div className="text-center py-10">
          <Icon name="receipt" size={48} className="text-gray-300 mb-4" />
          <p className="text-panda-text-light">You have no past orders.</p>
          <Link to="/" className="mt-4 inline-block bg-panda-pink text-white py-2 px-4 rounded-md hover:bg-panda-dark-pink">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map(order => (
            <OrderHistoryItem key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );

  const renderFavouritesView = () => (
    <div className="p-4">
      <div className="flex items-center mb-4">
        <button onClick={() => { setActiveSection('profile'); setSearchParams({}); }} className="text-panda-pink mr-2 p-1 hover:bg-pink-50 rounded-full">
          <Icon name="back" size={24} />
        </button>
        <h2 className="text-xl font-bold text-panda-text">My Favourites</h2>
      </div>
      {isLoadingFavourites ? (
        <div className="flex justify-center items-center h-40"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-panda-pink"></div></div>
      ) : favouriteProducts.length === 0 ? (
        <div className="text-center py-10">
          <Icon name="heart" size={48} className="text-gray-300 mb-4" />
          <p className="text-panda-text-light mb-4">You haven't added any favourites yet, or your favourite items are out of stock.</p>
          <p className="text-sm text-panda-text-light mb-6">Explore products and tap the heart to save them!</p>
          <Link to="/" className="bg-panda-pink text-white py-3 px-6 rounded-lg font-semibold hover:bg-panda-dark-pink transition duration-150">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4"> {/* Adjusted grid */}
          {favouriteProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );


  return (
    <div className="bg-panda-bg-light min-h-screen pb-24"> {/* Added padding-bottom for MainBottomNav */}
      {activeSection === 'profile' && renderProfileView()}
      {activeSection === 'orders' && renderOrdersView()}
      {activeSection === 'favourites' && renderFavouritesView()}
    </div>
  );
};

export default AccountPage;