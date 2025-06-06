
import React, { useState, useEffect } from 'react';
// Fixed: Updated react-router-dom imports to use namespace import.
import * as ReactRouterDOM from 'react-router-dom';
const { useParams, Link } = ReactRouterDOM;
import { Product, Product as ProductType } from '../types';
import { productService } from '../services/productService';
import { CURRENCY_SYMBOL } from '../constants';
import { useCart } from '../hooks/useCart';
import QuantitySelector from '../components/QuantitySelector';
import Icon from '../components/Icon';
import ProductCard from '../components/ProductCard';


const ProductDetailPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<ProductType | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { addToCart, isProductInCart, getProductQuantity, updateQuantity } = useCart();
  
  const quantityInCart = product ? getProductQuantity(product.id) : 0;
  const productInCart = product ? isProductInCart(product.id) : false;
  const isOutOfStock = product ? product.stock <= 0 : true;

  useEffect(() => {
    const fetchProductData = async () => {
      if (!productId) {
        setError("Product ID is missing.");
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      setError(null);
      try {
        const prod = await productService.getProductById(productId);
        if (prod) {
          setProduct(prod);
          const allCategoryProducts = await productService.getProducts(prod.category);
          setRelatedProducts(
            allCategoryProducts.filter(p => p.id !== prod.id && p.stock > 0).slice(0, 4)
          );
        } else {
          setError("Product not found.");
        }
      } catch (err) {
        console.error("Failed to fetch product data:", err);
        setError("Failed to load product details.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]); // Rerun if productId changes

  const handleAddToCart = () => {
    if (product && !isOutOfStock) {
      addToCart(product, 1);
    }
  };

  const handleIncrease = () => {
    if (product && !isOutOfStock && quantityInCart < product.stock) {
      updateQuantity(product.id, quantityInCart + 1);
    }
  };

  const handleDecrease = () => {
    if (product) {
      updateQuantity(product.id, quantityInCart - 1);
    }
  };


  if (isLoading) {
    return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-panda-pink"></div></div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">{error}</div>;
  }

  if (!product) {
    return <div className="p-4 text-center">Product not found.</div>;
  }
  
  const discountPercentage = product.originalPrice && product.price < product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <div className="bg-white">
      <div className="relative">
        <img src={product.imageUrl} alt={product.name} className={`w-full h-64 object-cover ${isOutOfStock ? 'opacity-60' : ''}`} />
        {discountPercentage && !isOutOfStock && (
         <div className="absolute top-4 left-4 bg-red-500 text-white text-sm font-semibold px-3 py-1.5 rounded-md">
           {discountPercentage}% OFF
         </div>
       )}
       {isOutOfStock && (
          <div className="absolute top-4 left-4 bg-gray-700 text-white text-sm font-semibold px-3 py-1.5 rounded-md">
            Out of Stock
          </div>
        )}
        <button className="absolute top-4 right-4 bg-white/80 p-2 rounded-full text-gray-700 hover:text-panda-pink">
          <Icon name="heart" size={24} />
        </button>
      </div>

      <div className="p-4">
        <h1 className="text-2xl font-bold text-panda-text mb-2">{product.name}</h1>
        <p className="text-panda-text-light mb-4">{product.description}</p>
        
        <div className="flex items-baseline mb-6">
          <span className={`text-3xl font-bold ${isOutOfStock ? 'text-gray-500' : 'text-panda-pink'}`}>{CURRENCY_SYMBOL} {product.price.toFixed(2)}</span>
          {product.originalPrice && (
            <span className={`text-lg line-through ml-3 ${isOutOfStock ? 'text-gray-400' : 'text-gray-500'}`}>{CURRENCY_SYMBOL} {product.originalPrice.toFixed(2)}</span>
          )}
        </div>

        {isOutOfStock ? (
          <p className="text-center text-xl font-semibold text-gray-600 bg-gray-100 p-3 rounded-md">
            Currently Out of Stock
          </p>
        ) : productInCart ? (
            <QuantitySelector 
              quantity={quantityInCart} 
              onIncrease={handleIncrease} 
              onDecrease={handleDecrease}
              maxQuantity={product.stock} // Pass product stock as max quantity
            />
          ) : (
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className="w-full bg-panda-pink text-white py-3 px-4 rounded-lg shadow-md hover:bg-panda-dark-pink transition duration-150 text-lg font-semibold flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <Icon name="plus" size={22} className="mr-2" /> Add to Cart
            </button>
          )}
      </div>

      {/* Product Details/Nutrition (Placeholder) */}
      <div className="p-4 border-t border-panda-border">
        <h3 className="text-lg font-semibold text-panda-text mb-2">Details</h3>
        <p className="text-sm text-panda-text-light">
          Category: <Link to={`/category/${product.category}`} className="text-panda-pink hover:underline">{product.category}</Link>
        </p>
        <p className="text-sm text-panda-text-light">Stock: {product.stock > 0 ? `${product.stock} available` : <span className="font-semibold text-red-600">Out of stock</span>}</p>
        {/* Add more details like ingredients, nutrition facts if available */}
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="p-4 border-t border-panda-border">
          <h3 className="text-lg font-semibold text-panda-text mb-3">You might also like</h3>
          <div className="grid grid-cols-2 gap-3">
            {relatedProducts.map(relatedProd => (
              <ProductCard key={relatedProd.id} product={relatedProd} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetailPage;