
import React, { useState, useEffect, FormEvent, useRef, useLayoutEffect } from 'react';
// Fixed: Updated react-router-dom imports to use namespace import.
import * as ReactRouterDOM from 'react-router-dom';
const { Link, useNavigate } = ReactRouterDOM;
import { Product, Category, Promotion } from '../types';
import { productService } from '../services/productService';
import ProductCard from '../components/ProductCard';
import CategoryCard from '../components/CategoryCard';
import PromoBanner from '../components/PromoBanner';
import Icon from '../components/Icon';
import { PICK_ME_UP_LOCATION, PICK_ME_UP_DELIVERY_INFO } from '../constants';
// Removed CURRENCY_SYMBOL, MIN_ORDER_FOR_FREE_DELIVERY, useCart as progress bar is global

// Helper component for product sections
const ProductSection: React.FC<{ title: string; products: Product[]; ctaLink?: string; ctaText?: string; }> = ({ title, products, ctaLink, ctaText = "View all" }) => {
  const inStockProducts = products.filter(p => p.stock > 0);
  if (!inStockProducts || inStockProducts.length === 0) return null;
  
  return (
    <section className="mb-6 bg-white p-4 rounded-lg shadow">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-semibold text-panda-text">{title}</h2>
        {ctaLink && (
          <Link to={ctaLink} className="text-sm text-panda-pink font-medium hover:underline">
            {ctaText} <Icon name="chevronRight" size={16} className="inline" />
          </Link>
        )}
      </div>
      <div className="flex overflow-x-auto space-x-3 no-scrollbar pb-2">
        {inStockProducts.map(product => (
          <div key={product.id} className="min-w-[160px] max-w-[160px] sm:min-w-[180px] sm:max-w-[180px]">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
};

const HomePage: React.FC = () => {
  const [orderAgainProducts, setOrderAgainProducts] = useState<Product[]>([]);
  const [popularProducts, setPopularProducts] = useState<Product[]>([]);
  const [saleProducts, setSaleProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [bannerPromos, setBannerPromos] = useState<Promotion[]>([]);
  const [cardPromo, setCardPromo] = useState<Promotion | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAllCategories, setShowAllCategories] = useState(false);
  const navigate = useNavigate();

  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const bannerContainerRef = useRef<HTMLDivElement>(null);
  const bannerItemRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Removed useCart and related constants for local progress bar

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [
          orderAgainData, 
          popularData, 
          salesData, 
          catsData, 
          allPromosData
        ] = await Promise.all([
          productService.getProducts('Order Again'),
          productService.getProducts('Popular'),
          productService.getProducts('Sale'), 
          productService.getCategories(),
          productService.getPromotions()
        ]);

        setOrderAgainProducts(orderAgainData);
        setPopularProducts(popularData);
        setSaleProducts(salesData);
        setCategories(catsData);
        
        const filteredBannerPromos = allPromosData.filter(p => p.type === 'banner');
        setBannerPromos(filteredBannerPromos);
        bannerItemRefs.current = bannerItemRefs.current.slice(0, filteredBannerPromos.length);

        const firstCardPromo = allPromosData.find(p => p.type === 'card');
        setCardPromo(firstCardPromo || null);
        
      } catch (error) {
        console.error("Failed to fetch homepage data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (bannerPromos.length <= 1) return;
    const timer = setTimeout(() => {
      setCurrentBannerIndex((prevIndex) => (prevIndex + 1) % bannerPromos.length);
    }, 3000);
    return () => clearTimeout(timer);
  }, [currentBannerIndex, bannerPromos.length]);

  useEffect(() => {
    const container = bannerContainerRef.current;
    const activeBannerElement = bannerItemRefs.current[currentBannerIndex];

    if (container && activeBannerElement) {
      container.scrollTo({
        left: activeBannerElement.offsetLeft,
        behavior: 'auto' 
      });
    }
  }, [currentBannerIndex, bannerPromos.length]);

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const displayedCategories = showAllCategories ? categories : categories.slice(0, 7);

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-panda-pink"></div></div>;
  }

  return (
    <>
      <div className="bg-panda-bg-light pb-4"> {/* Main content wrapper */}
        <div className="bg-white p-3 shadow-sm">
          <div className="flex items-center mb-1">
              <Icon name="mapPin" size={32} className="text-panda-text-light mr-2" />
              <p className="text-sm font-medium text-panda-text">{PICK_ME_UP_LOCATION}</p>
          </div>
          <p className="text-xs text-panda-text-light ml-7">{PICK_ME_UP_DELIVERY_INFO}</p>
        </div>

        <div className="p-3 sticky top-[80px] bg-white z-40 shadow-sm"> {/* Search bar container, z-40 */}
          <form onSubmit={handleSearchSubmit} className="flex">
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for groceries..."
              className="w-full p-3 border border-r-0 border-panda-border rounded-l-md focus:ring-1 focus:ring-panda-pink focus:outline-none text-sm bg-white text-panda-pink placeholder-panda-pink"
            />
            <button type="submit" className="bg-panda-pink text-white px-4 py-3 rounded-r-md hover:bg-panda-dark-pink transition-colors">
              <Icon name="search" size={20} />
            </button>
          </form>
        </div>
        
        {/* Main scrolling content area - given relative z-30 */}
        <div className="p-3 space-y-4 relative z-[30]"> 
          {bannerPromos.length > 0 && (
            <section className="mb-2 relative z-[1]"> {/* Banner section, z-1 relative to its parent (now z-30 context) */}
              <div ref={bannerContainerRef} className="flex overflow-x-auto space-x-3 no-scrollbar snap-x snap-mandatory">
                {bannerPromos.map((promo, index) => (
                  <div 
                    key={promo.id} 
                    ref={(el: HTMLDivElement | null) => { bannerItemRefs.current[index] = el; }}
                    className="w-full snap-start flex-shrink-0" // Changed: Replaced min-w with w-full
                  >
                     <PromoBanner promotion={promo} />
                  </div>
                ))}
              </div>
              {bannerPromos.length > 1 && (
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {bannerPromos.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentBannerIndex(index)}
                      className="p-0.5 focus:outline-none rounded-full" 
                      aria-label={`Go to banner ${index + 1}`}
                    >
                       <img
                        src="/assets/carousel-dot.png" 
                        alt={`Banner ${index + 1} indicator`}
                        className={`w-2.5 h-2.5 transition-opacity duration-300 ${
                          currentBannerIndex === index ? 'opacity-100' : 'opacity-40 hover:opacity-70'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              )}
            </section>
          )}

          {cardPromo && (
              <section className="mb-4">
                  <PromoBanner promotion={cardPromo} />
              </section>
          )}

          {categories.length > 0 && (
            <section className="mb-4 bg-white p-4 rounded-lg shadow">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-semibold text-panda-text">Categories</h2>
                {!showAllCategories && categories.length > 7 && (
                   <button onClick={() => setShowAllCategories(true)} className="text-sm text-panda-pink font-medium hover:underline">
                      View all <Icon name="chevronRight" size={16} className="inline" />
                   </button>
                )}
              </div>
              <div className="grid grid-cols-4 gap-x-2 gap-y-4">
                {displayedCategories.map(category => (
                  <CategoryCard key={category.id} category={category} />
                ))}
                {!showAllCategories && categories.length > 7 && (
                   <div 
                      onClick={() => setShowAllCategories(true)} 
                      className="block text-center group cursor-pointer"
                      role="button"
                      tabIndex={0}
                      onKeyPress={(e) => e.key === 'Enter' && setShowAllCategories(true)}
                      aria-label="View all categories"
                    >
                      <div className="bg-gray-100 p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-150 aspect-square flex flex-col items-center justify-center group-hover:bg-pink-50">
                          <Icon name="chevronRight" size={24} className="text-panda-pink mb-1" />
                          <h3 className="text-xs md:text-sm font-medium text-panda-pink group-hover:text-panda-dark-pink truncate w-full">View All</h3>
                      </div>
                  </div>
                )}
              </div>
              {showAllCategories && (
                  <button onClick={() => setShowAllCategories(false)} className="mt-4 text-sm text-panda-pink font-medium hover:underline w-full text-center">
                      Show less
                   </button>
              )}
            </section>
          )}
          
          <ProductSection title="Order Again" products={orderAgainProducts} ctaLink="/category/order-again" />
          <ProductSection title="Popular Right Now" products={popularProducts} ctaLink="/category/popular" />
          <ProductSection title="Hot Deals" products={saleProducts} ctaLink="/category/sale" />
          
        </div>
      </div> {/* End of main content wrapper */}

    </>
  );
};

export default HomePage;