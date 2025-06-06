
import React, { createContext, useContext, useReducer, ReactNode, useCallback } from 'react';
import { Product, CartItem } from '../types';

interface CartState {
  items: CartItem[];
}

interface CartContextType extends CartState {
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getItemCount: () => number;
  isProductInCart: (productId: string) => boolean;
  getProductQuantity: (productId: string) => number;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: { product: Product; quantity: number } }
  | { type: 'REMOVE_ITEM'; payload: { productId: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; quantity: number } }
  | { type: 'CLEAR_CART' };

const CartContext = createContext<CartContextType | undefined>(undefined);

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, quantity } = action.payload;
      const existingItemIndex = state.items.findIndex(
        item => item.product.id === product.id
      );

      if (existingItemIndex > -1) {
        const updatedItems = [...state.items];
        const existingItem = updatedItems[existingItemIndex];
        // Cap quantity at product's stock
        const newQuantity = Math.min(existingItem.quantity + quantity, existingItem.product.stock);
        updatedItems[existingItemIndex].quantity = newQuantity;
        return { ...state, items: updatedItems };
      }
      // For new item, cap quantity at product's stock
      const quantityToAdd = Math.min(quantity, product.stock);
      return {
        ...state,
        items: [...state.items, { product, quantity: quantityToAdd }],
      };
    }
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.product.id !== action.payload.productId),
      };
    case 'UPDATE_QUANTITY': {
      const { productId, quantity } = action.payload;
      const itemIndex = state.items.findIndex(item => item.product.id === productId);
      if (itemIndex === -1) return state;

      if (quantity <= 0) {
        return {
            ...state,
            items: state.items.filter(item => item.product.id !== productId),
        };
      }
      
      const updatedItems = [...state.items];
      const currentItem = updatedItems[itemIndex];
      // Cap quantity at product's stock (as recorded when added to cart)
      const newQuantity = Math.min(quantity, currentItem.product.stock);
      updatedItems[itemIndex].quantity = newQuantity;
      
      return { ...state, items: updatedItems };
    }
    case 'CLEAR_CART':
      return { ...state, items: [] };
    default:
      return state;
  }
};

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });

  const addToCart = useCallback((product: Product, quantity: number = 1) => {
    if (product.stock <= 0) {
      console.warn(`Product ${product.name} is out of stock. Cannot add to cart.`);
      // Optionally, dispatch a notification to the user
      return;
    }
    
    const existingItem = state.items.find(item => item.product.id === product.id);
    let quantityToAdd = quantity;

    if (existingItem) {
      // If item exists, check against remaining stock allowance
      if (existingItem.quantity + quantity > product.stock) {
        quantityToAdd = Math.max(0, product.stock - existingItem.quantity);
        if (quantityToAdd < quantity) {
            console.warn(`Quantity for ${product.name} adjusted to available stock.`);
            // Optionally, dispatch a notification
        }
      }
    } else {
      // If new item, check requested quantity against total stock
      if (quantity > product.stock) {
        quantityToAdd = product.stock;
        console.warn(`Quantity for ${product.name} adjusted to available stock.`);
        // Optionally, dispatch a notification
      }
    }

    if (quantityToAdd <= 0 && !existingItem) { // Don't add if effective quantity is zero for a new item
        console.warn(`Cannot add ${product.name} with quantity 0 or less.`);
        return;
    }
    // If existing item and quantityToAdd is 0 (meaning trying to add more than stock allows for existing quantity),
    // dispatch will handle capping in reducer.

    dispatch({ type: 'ADD_ITEM', payload: { product, quantity: quantityToAdd } });
  }, [state.items]);

  const removeFromCart = useCallback((productId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { productId } });
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    const item = state.items.find(i => i.product.id === productId);
    if (item) {
        const newQuantity = Math.min(quantity, item.product.stock); // Cap at original stock
         if (newQuantity < quantity) {
            console.warn(`Quantity for ${item.product.name} adjusted to available stock.`);
            // Optionally, dispatch a notification
        }
        dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity: newQuantity } });
    }
  }, [state.items]);

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR_CART' });
  }, []);

  const getCartTotal = useCallback(() => {
    return state.items.reduce((total, item) => total + item.product.price * item.quantity, 0);
  }, [state.items]);

  const getItemCount = useCallback(() => {
    return state.items.reduce((count, item) => count + item.quantity, 0);
  }, [state.items]);

  const isProductInCart = useCallback((productId: string): boolean => {
    return state.items.some(item => item.product.id === productId);
  }, [state.items]);

  const getProductQuantity = useCallback((productId: string): number => {
    const item = state.items.find(item => item.product.id === productId);
    return item ? item.quantity : 0;
  }, [state.items]);

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getItemCount,
        isProductInCart,
        getProductQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};