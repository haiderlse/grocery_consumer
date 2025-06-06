
import React, { useState, useEffect, FormEvent } from 'react';
// Fixed: Updated react-router-dom imports to use namespace import.
import * as ReactRouterDOM from 'react-router-dom';
const { useSearchParams, useNavigate, Link } = ReactRouterDOM;
import { Product } from '../types';
import { productService } from '../services/productService';
import ProductCard from '../components/ProductCard';
import Icon from '../components/Icon';

const mockRecentSearches = ["water gun", "yogurt", "poppers", "bread", "eggs", "infinity"];
const mockPopularSearches = ["chips", "ice cream", "bread", "chocolate", "vegetables", "biscuits", "milk", "lays", "eggs", "noodles"];
const mockSearchSuggestions = (query: string) => {
  if (!query) return [];
  const baseSuggestions = ["ice cream", "icecream", "iceberg", "ice cream tub", "iceberg lettuce", "ice", "ice cream vanilla", "ice pop", "ice cream chocolate", "ice cream cookies"];
  return baseSuggestions.filter(s => s.toLowerCase().includes(query.toLowerCase()));
};


const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialQuery = searchParams.get('q') || '';
  
  const [searchTerm, setSearchTerm] = useState<string>(initialQuery);
  const [results, setResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchedOnce, setSearchedOnce] = useState<boolean>(!!initialQuery); // True if initialQuery exists
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [pastPurchases, setPastPurchases] = useState<Product[]>([]);

  useEffect(() => {
    const queryFromUrl = searchParams.get('q') || '';
    setSearchTerm(queryFromUrl);
    
    if (queryFromUrl) {
      fetchResults(queryFromUrl);
      setSuggestions([]); // Clear suggestions when a search is executed
    } else {
      setResults([]);
      setSearchedOnce(false);
      // Fetch suggestions if user is typing but hasn't searched
      if (searchTerm) { 
        setSuggestions(mockSearchSuggestions(searchTerm));
      } else {
        setSuggestions([]);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]); // Re-run when URL query param 'q' changes

  useEffect(() => {
    // Fetch past purchases on initial load
    const fetchPastItems = async () => {
      const items = await productService.getProducts('Order Again'); // Assuming 'Order Again' maps to past purchases
      setPastPurchases(items.filter(p => p.stock > 0).slice(0, 3)); // Show a few in-stock items
    };
    fetchPastItems();
  }, []);

  useEffect(() => {
    // Update suggestions as user types, but only if no search has been formally submitted yet via URL
    if (!searchParams.get('q') && searchTerm) {
      setSuggestions(mockSearchSuggestions(searchTerm));
    } else if (!searchTerm) {
      setSuggestions([]);
    }
  }, [searchTerm, searchParams]);


  const fetchResults = async (query: string) => {
    if (!query || query.trim().length < 1) { 
      setResults([]);
      setIsLoading(false);
      setSearchedOnce(true);
      return;
    }
    setIsLoading(true);
    setSearchedOnce(true);
    try {
      const products = await productService.searchProducts(query);
      setResults(products.filter(p => p.stock > 0)); // Filter for in-stock products
    } catch (error) {
      console.error("Error fetching search results:", error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    performSearch(searchTerm.trim());
  };

  const performSearch = (query: string) => {
    const trimmedQuery = query.trim();
    setSearchTerm(trimmedQuery); // Update input field state
    setSearchParams(trimmedQuery ? { q: trimmedQuery } : {}); // Update URL, triggers useEffect for fetching
    setSuggestions([]); // Clear suggestions on search submission
    if (!trimmedQuery) {
        setResults([]);
        setSearchedOnce(false);
    } else {
        setSearchedOnce(true); // Ensure searchedOnce is true
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    performSearch(suggestion);
  };
  
  const handleClearSearch = () => {
    setSearchTerm('');
    setSuggestions([]);
    setResults([]);
    setSearchedOnce(false);
    setSearchParams({});
  };

  const renderInitialState = () => (
    <div className="space-y-6">
      <section>
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-md font-semibold text-panda-text flex items-center"><Icon name="clock" className="mr-2 text-panda-text-light" size={20}/>Recent searches</h2>
          <button className="text-sm text-panda-text-light hover:text-panda-pink">Clear All</button>
        </div>
        <div className="flex flex-wrap gap-2">
          {mockRecentSearches.map(s => <button key={s} onClick={() => performSearch(s)} className="bg-gray-200 text-panda-text-light text-sm px-3 py-1.5 rounded-full hover:bg-gray-300">{s}</button>)}
        </div>
      </section>
      <section>
        <h2 className="text-md font-semibold text-panda-text mb-2 flex items-center"><Icon name="star" className="mr-2 text-panda-text-light" size={20}/>Popular searches</h2>
        <div className="flex flex-wrap gap-2">
          {mockPopularSearches.map(s => <button key={s} onClick={() => performSearch(s)} className="bg-gray-200 text-panda-text-light text-sm px-3 py-1.5 rounded-full hover:bg-gray-300">{s}</button>)}
        </div>
      </section>
      {pastPurchases.length > 0 && (
        <section>
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-md font-semibold text-panda-text flex items-center"><Icon name="cart" className="mr-2 text-panda-text-light" size={20}/>Past purchases</h2>
            <Link to="/account?tab=orders" className="text-sm text-panda-pink hover:underline">View All</Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3"> {/* Adjusted grid */}
            {pastPurchases.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );

  const renderSuggestionsState = () => (
    <div className="space-y-1">
      {suggestions.map(s => (
        <button 
          key={s} 
          onClick={() => handleSuggestionClick(s)}
          className="w-full flex items-center justify-between text-left p-3 hover:bg-gray-100 rounded-md"
        >
          <div className="flex items-center">
            <Icon name="search" size={20} className="text-gray-400 mr-3" />
            <span className="text-panda-text">{s}</span>
          </div>
          <Icon name="arrow-up-left" size={20} className="text-gray-400 transform -rotate-45" />
        </button>
      ))}
      {searchTerm && (
         <button 
            onClick={() => performSearch(searchTerm)}
            className="w-full text-left p-3 text-panda-pink font-semibold hover:bg-pink-50 rounded-md mt-2"
          >
            Search for "{searchTerm}"
        </button>
      )}
    </div>
  );


  return (
    <div className="p-0"> {/* Changed p-4 to p-0 to allow full-width search bar section */}
      {/* Search Bar Section */}
      <div className="bg-white p-3 sticky top-[80px] z-40 border-b border-gray-200"> {/* Changed top-[72px] to top-[80px] */}
        <form onSubmit={handleSearchSubmit} className="flex items-center">
          <div className="flex-grow relative">
            <input
              type="search"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                if (!e.target.value) { // If input cleared, reset to initial state
                    setSuggestions([]);
                    setResults([]);
                    setSearchedOnce(false);
                    setSearchParams({});
                } else {
                    setSearchedOnce(false); // Typing new things, not yet searched
                }
              }}
              placeholder="Search products and categories"
              className="w-full p-3 pl-10 text-sm text-black bg-gray-100 rounded-lg focus:outline-none focus:ring-1 focus:ring-panda-pink"
              aria-label="Search products"
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <Icon name="search" size={20} className="text-gray-400" />
            </div>
            {searchTerm && (
                <button
                    type="button"
                    onClick={handleClearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-panda-pink"
                    aria-label="Clear search"
                >
                    <Icon name="x-circle" size={20} />
                </button>
            )}
          </div>
        </form>
      </div>

      {/* Content Area */}
      <div className="p-4">
        {isLoading && (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-panda-pink"></div>
          </div>
        )}

        {!isLoading && !searchedOnce && !searchTerm && renderInitialState()}
        {!isLoading && !searchedOnce && searchTerm && suggestions.length > 0 && renderSuggestionsState()}
        
        {!isLoading && !searchedOnce && searchTerm && suggestions.length === 0 && (
             <button 
                onClick={() => performSearch(searchTerm)}
                className="w-full text-left p-3 text-panda-pink font-semibold hover:bg-pink-50 rounded-md mt-2"
              >
                Search for "{searchTerm}"
            </button>
        )}


        {!isLoading && searchedOnce && results.length === 0 && (
          <div className="text-center py-10">
            <Icon name="search" size={48} className="text-gray-300 mb-4" />
            <h2 className="text-xl font-semibold text-panda-text mb-2">
              {searchParams.get('q') ? `No results for "${searchParams.get('q')}"` : "No results found"}
            </h2>
            <p className="text-panda-text-light">
              {searchParams.get('q') ? "Try searching for something else." : "Enter a term above to search."}
            </p>
          </div>
        )}

        {!isLoading && searchedOnce && results.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-panda-text mb-4">
              Search Results for "{searchParams.get('q')}" ({results.length})
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4"> {/* Adjusted grid */}
              {results.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;