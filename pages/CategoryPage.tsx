
import React, { useState, useEffect } from 'react';
// Fixed: Updated react-router-dom imports to use namespace import.
import * as ReactRouterDOM from 'react-router-dom';
const { useParams, Link, useNavigate } = ReactRouterDOM;
import { Product, Category as CategoryType } from '../types';
import { productService } from '../services/productService';
import ProductCard from '../components/ProductCard';
import Icon from '../components/Icon';
// Removed CURRENCY_SYMBOL, MIN_ORDER_FOR_FREE_DELIVERY, useCart for local progress bar

interface SubFilter {
  id: string;
  name: string;
  icon?: string;
}

const CategoryPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  // Removed useCart for local progress bar

  const [products, setProducts] = useState<Product[]>([]);
  const [currentCategory, setCurrentCategory] = useState<CategoryType | null>(null);
  const [allCategories, setAllCategories] = useState<CategoryType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const mockSubFilters: SubFilter[] = [
    { id: 'sort', name: 'Sort', icon: 'sort' },
    { id: 'offer', name: 'Offer', icon: 'tag' },
    { id: 'fresh-seafood', name: 'Fresh Seafood' },
    { id: 'fresh-chicken', name: 'Fresh Chicken' },
    { id: 'beef-mutton', name: 'Beef & Mutton' },
  ];
  const [activeSubFilter, setActiveSubFilter] = useState<SubFilter>(mockSubFilters[0]); // Default to first filter

  // Removed cartTotal, itemCount, amountNeededForFreeDelivery for local progress bar

  useEffect(() => {
    const fetchCategoryData = async () => {
      if (!categoryId) {
        setError("Category ID is missing.");
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      setError(null);
      try {
        const [catDetails, fetchedAllCategories, prods] = await Promise.all([
          productService.getCategoryById(categoryId),
          productService.getCategories(),
          productService.getProducts(undefined) 
        ]);

        setAllCategories(fetchedAllCategories);

        let categoryToSet: CategoryType | null = null;
        let productsToSet: Product[] = [];

        if (categoryId === 'order-again' || categoryId === 'popular' || categoryId === 'sale') {
            const specialCategoryName = categoryId.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
            categoryToSet = { id: categoryId, name: specialCategoryName, imageUrl: '', productCount: 0 }; 
            productsToSet = (await productService.getProducts(undefined, specialCategoryName)).filter(p => p.stock > 0);
            // Fix for error on line 68: Ensure categoryToSet is not null before assigning productCount
            if (categoryToSet) {
              categoryToSet.productCount = productsToSet.length;
            }
        } else if (catDetails) {
            categoryToSet = catDetails;
            productsToSet = (await productService.getProducts(catDetails.name)).filter(p => p.stock > 0);
        } else {
            setError(`Category "${categoryId}" not found.`);
            productsToSet = [];
        }
        
        setCurrentCategory(categoryToSet);
        setProducts(productsToSet); // products are already filtered for stock > 0

        // Set active subfilter based on category or default
        const defaultMeatSubFilter = mockSubFilters.find(f => f.id === 'fresh-seafood');
        if (categoryToSet && categoryToSet.name === "Meat & Seafood" && defaultMeatSubFilter) {
            setActiveSubFilter(defaultMeatSubFilter);
        } else if (mockSubFilters.length > 0 && (categoryId === 'order-again' || categoryId === 'popular' || categoryId === 'sale')) {
             // For special categories, default to "Sort" or the first available general filter
            setActiveSubFilter(mockSubFilters[0]);
        } else if (mockSubFilters.length > 0) {
             setActiveSubFilter(mockSubFilters[0]);
        }


      } catch (err) {
        console.error("Failed to fetch category data:", err);
        setError("Failed to load products for this category.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategoryData();
  }, [categoryId]);

  const handleSubFilterClick = (filter: SubFilter) => {
    setActiveSubFilter(filter);
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-panda-pink"></div></div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">{error}</div>;
  }

  // Products are already filtered for stock > 0 from the fetch effect
  const displayedProducts = activeSubFilter.id !== 'sort' && activeSubFilter.id !== 'offer' && currentCategory?.name === "Meat & Seafood"
    ? products.filter(p => p.name.toLowerCase().includes(activeSubFilter.name.split(' ')[0].toLowerCase()))
    : products;

  return (
    <div className="flex flex-col min-h-screen bg-panda-bg-light">
      {/* Category Tabs: This section is already horizontally scrollable */}
      <div className="sticky top-[72px] bg-white shadow-sm z-30 px-2 py-2 no-scrollbar overflow-x-auto whitespace-nowrap border-b border-panda-border">
        {allCategories.map(cat => (
          <Link
            key={cat.id}
            to={`/category/${cat.id}`}
            className={`inline-block px-3 py-2 text-sm rounded-md mr-2 flex-shrink-0 ${cat.id === categoryId ? 'text-panda-pink font-semibold border-b-2 border-panda-pink' : 'text-panda-text-light hover:bg-gray-100'}`}
          >
            {cat.name}
          </Link>
        ))}
      </div>
      
      <div className="p-4 flex-grow">
        {/* Sub-filter Chips: This section is already horizontally scrollable */}
        <div className="mb-4 flex space-x-2 no-scrollbar overflow-x-auto whitespace-nowrap py-1">
          {(currentCategory?.name === "Meat & Seafood" ? mockSubFilters : mockSubFilters.slice(0,2)).map(filter => (
            <button
              key={filter.id}
              onClick={() => handleSubFilterClick(filter)}
              className={`px-4 py-2 text-sm font-medium rounded-full flex items-center flex-shrink-0 ${activeSubFilter.id === filter.id ? 'bg-panda-text text-white' : 'bg-gray-200 text-panda-text hover:bg-gray-300'}`}
            >
              {filter.icon && <Icon name={filter.icon} size={16} className="mr-1.5" />}
              {filter.name}
            </button>
          ))}
        </div>

        {activeSubFilter && activeSubFilter.id !== 'sort' && activeSubFilter.id !== 'offer' && currentCategory?.name === "Meat & Seafood" && (
          <h1 className="text-xl font-bold text-panda-text mb-4">{activeSubFilter.name}</h1>
        )}
        
        {currentCategory && (
             <h1 className="text-xl font-bold text-panda-text mb-4">{currentCategory.name}</h1>
        )}

        {displayedProducts.length === 0 && !isLoading ? (
          <p className="text-center text-panda-text-light py-10">
            No products found {activeSubFilter.id !== 'sort' && activeSubFilter.id !== 'offer' ? `for "${activeSubFilter.name}"` : ''} in {currentCategory?.name || 'this category'}.
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4"> {/* Adjusted grid for better responsiveness within constrained view */}
            {displayedProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
      
      {/* Free Delivery Progress Bar removed from here, now handled globally in App.tsx */}
    </div>
  );
};

export default CategoryPage;