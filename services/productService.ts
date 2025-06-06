
import { Product, Category, Promotion, Order, DeliveryAddress } from '../types';

const API_BASE_URL = 'https://grocery-backend-u0z8.onrender.com/api'; // Updated API Base URL
const GENERIC_PLACEHOLDER_IMAGE = 'https://via.placeholder.com/100'; // For synthetic categories

export const productService = {
  // PRODUCT Endpoints
  getProducts: async (categoryName?: string, tag?: string): Promise<Product[]> => {
    const params = new URLSearchParams();
    let actualTag = tag;

    if (categoryName && ['Order Again', 'Popular', 'Sale'].includes(categoryName)) {
      actualTag = categoryName;
    } else if (categoryName) {
      params.append('category', categoryName);
    }

    if (actualTag) {
      params.append('tag', actualTag);
    }

    const response = await fetch(`${API_BASE_URL}/products?${params.toString()}`);
    if (!response.ok) {
      console.error(`Error fetching products: ${response.statusText}`);
      throw new Error(`Failed to fetch products: ${response.statusText}`);
    }
    return response.json();
  },

  getProductById: async (id: string): Promise<Product | undefined> => {
    const response = await fetch(`${API_BASE_URL}/products/${id}`);
    if (!response.ok) {
      if (response.status === 404) {
        return undefined;
      }
      console.error(`Error fetching product ${id}: ${response.statusText}`);
      throw new Error(`Failed to fetch product ${id}: ${response.statusText}`);
    }
    return response.json();
  },

  searchProducts: async (query: string): Promise<Product[]> => {
    const normalizedQuery = query.toLowerCase().trim();
    if (normalizedQuery.length < 1) return []; 
    
    const params = new URLSearchParams();
    params.append('q', normalizedQuery);

    const response = await fetch(`${API_BASE_URL}/products/search?${params.toString()}`);
    if (!response.ok) {
      console.error(`Error searching products: ${response.statusText}`);
      throw new Error(`Failed to search products: ${response.statusText}`);
    }
    return response.json();
  },

  createProduct: async (productData: Omit<Product, 'id' | 'rating'>): Promise<Product> => {
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: response.statusText }));
      console.error('Error creating product:', errorData.message);
      throw new Error(`Failed to create product: ${errorData.message}`);
    }
    return response.json();
  },

  updateProduct: async (productId: string, productData: Partial<Omit<Product, 'id' | 'rating'>>): Promise<Product> => {
    const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: response.statusText }));
      console.error(`Error updating product ${productId}:`, errorData.message);
      throw new Error(`Failed to update product ${productId}: ${errorData.message}`);
    }
    return response.json();
  },

  deleteProduct: async (productId: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: response.statusText }));
      console.error(`Error deleting product ${productId}:`, errorData.message);
      throw new Error(`Failed to delete product ${productId}: ${errorData.message}`);
    }
    if (response.status !== 200 && response.status !== 204) { 
        const errorText = await response.text();
        console.warn(`Unexpected status after deleting product ${productId}: ${response.status}. Body: ${errorText}`);
    }
  },

  // CATEGORY Endpoints
  getCategories: async (): Promise<Category[]> => {
    const response = await fetch(`${API_BASE_URL}/categories`);
    if (!response.ok) {
      console.error(`Error fetching categories: ${response.statusText}`);
      throw new Error(`Failed to fetch categories: ${response.statusText}`);
    }
    return response.json();
  },

  getCategoryById: async (id: string): Promise<Category | undefined> => {
    const response = await fetch(`${API_BASE_URL}/categories/${id}`);
    if (!response.ok) {
      if (response.status === 404) return undefined;
      console.error(`Error fetching category ${id}: ${response.statusText}`);
      throw new Error(`Failed to fetch category ${id}: ${response.statusText}`);
    }
    return response.json();
  },

  createCategory: async (categoryData: Omit<Category, 'id' | 'productCount'>): Promise<Category> => {
    const response = await fetch(`${API_BASE_URL}/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categoryData),
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        console.error('Error creating category:', errorData.message);
        throw new Error(`Failed to create category: ${errorData.message}`);
    }
    return response.json();
  },

  updateCategory: async (categoryId: string, categoryData: Partial<Omit<Category, 'id' | 'productCount'>>): Promise<Category> => {
    const response = await fetch(`${API_BASE_URL}/categories/${categoryId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categoryData),
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        console.error(`Error updating category ${categoryId}:`, errorData.message);
        throw new Error(`Failed to update category ${categoryId}: ${errorData.message}`);
    }
    return response.json();
  },

  deleteCategory: async (categoryId: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/categories/${categoryId}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        console.error(`Error deleting category ${categoryId}:`, errorData.message);
        throw new Error(`Failed to delete category ${categoryId}: ${errorData.message}`);
    }
    if (response.status !== 200 && response.status !== 204) {
        const errorText = await response.text();
        console.warn(`Unexpected status after deleting category ${categoryId}: ${response.status}. Body: ${errorText}`);
    }
  },

  // PROMOTION Endpoints
  getPromotions: async (type?: 'banner' | 'card'): Promise<Promotion[]> => {
    const params = new URLSearchParams();
    if (type) {
      params.append('type', type);
    }
    const response = await fetch(`${API_BASE_URL}/promotions?${params.toString()}`);
    if (!response.ok) {
      console.error(`Error fetching promotions: ${response.statusText}`);
      throw new Error(`Failed to fetch promotions: ${response.statusText}`);
    }
    return response.json();
  },

  // ORDER Endpoints
  createOrder: async (orderData: {
    items: { productId: string, quantity: number }[],
    deliveryAddress: DeliveryAddress,
    paymentMethod: string,
    paymentDetails?: string,
    paymentStatus?: Order['paymentStatus'],
    orderStatus?: Order['orderStatus'],
    riderTip?: number,
    specialInstructions?: string,
    userId?: string, 
    riderId?: string, 
  }): Promise<Order> => {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
    });
    if (!response.ok) {
      let errorPayload;
      try {
        errorPayload = await response.json();
      } catch (e) {
        errorPayload = { message: response.statusText, status: response.status };
      }
      const detail = errorPayload.message || `HTTP error ${response.status}`;
      const fullErrorLog = typeof errorPayload === 'object' && errorPayload !== null ? errorPayload : {};
      console.error(`Error creating order (status ${response.status}):`, detail, 'Full error object:', fullErrorLog);
      throw new Error(`Failed to create order. Server responded with: ${detail}`);
    }
    return response.json();
  },

  getOrderById: async (orderId: string): Promise<Order | undefined> => {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}`);
    if (!response.ok) {
      if (response.status === 404) {
        return undefined;
      }
      const errorData = await response.json().catch(() => ({ message: response.statusText }));
      console.error(`Error fetching order ${orderId}: ${errorData.message || response.statusText}`);
      throw new Error(`Failed to fetch order ${orderId}: ${errorData.message || response.statusText}`);
    }
    return response.json();
  },

  getOrdersAdmin: async (params?: { page?: number; limit?: number; orderStatus?: string; paymentStatus?: string; userId?: string; riderId?: string }): Promise<{ orders: Order[], totalPages: number, currentPage: number, totalOrders: number }> => {
    const queryParams = new URLSearchParams();
    if (params) {
        if (params.page) queryParams.append('page', params.page.toString());
        if (params.limit) queryParams.append('limit', params.limit.toString());
        if (params.orderStatus) queryParams.append('orderStatus', params.orderStatus);
        if (params.paymentStatus) queryParams.append('paymentStatus', params.paymentStatus);
        if (params.userId) queryParams.append('userId', params.userId);
        if (params.riderId) queryParams.append('riderId', params.riderId); 
    }
    const response = await fetch(`${API_BASE_URL}/orders?${queryParams.toString()}`);
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        console.error('Error fetching admin orders:', errorData.message);
        throw new Error(`Failed to fetch admin orders: ${errorData.message}`);
    }
    return response.json();
  },

  updateOrderStatusAdmin: async (orderId: string, updates: Partial<Pick<Order, 'orderStatus' | 'paymentStatus' | 'adminNotes' | 'estimatedDeliveryTime' | 'riderId' | 'riderDetails' | 'riderNotes' | 'proofOfDeliveryImageUrl'>>): Promise<Order> => {
    const response = await fetch(`${API_BASE_URL}/orders/admin/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        console.error(`Error updating order ${orderId}:`, errorData.message, errorData); // Log full error data
        throw new Error(`Failed to update order ${orderId}: ${errorData.message || response.statusText}`);
    }
    return response.json();
  },
};