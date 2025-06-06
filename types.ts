
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  imageUrl: string;
  category: string;
  rating?: number;
  stock: number;
  tags?: string[]; // e.g., "New", "Sale", "20% Off"
}

export interface Category {
  id: string;
  name: string;
  imageUrl: string;
  productCount?: number;
}

// CartItem for use in the cart context and potentially for building order items
export interface CartItem {
  product: Product; // Contains all product details needed for display and order
  quantity: number;
}

// Represents an item within an Order, storing necessary details at the time of purchase
export interface OrderItem {
  productId: string;
  name: string; // Denormalized product name
  price: number; // Price at the time of order
  quantity: number;
  imageUrl: string; // Denormalized image URL
}

export interface RiderDetails {
  name: string;
  phone: string;
  imageUrl?: string; // Optional
}

export interface PickupAddress {
  name?: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  phone?: string;
  latitude?: number;
  longitude?: number;
}

export interface Order {
  id: string;
  userId?: string | UserProfile; // Can be populated
  riderId?: string | UserProfile; 
  items: OrderItem[];
  totalAmount: number;
  deliveryAddress: DeliveryAddress;
  pickupAddress?: PickupAddress; // Optional pickup address for rider
  paymentMethod: string;
  paymentDetails?: string; 
  paymentStatus: 'Pending' | 'Paid' | 'Failed' | 'Refunded' | 'Processing';
  orderStatus: 'AwaitingPayment' | 'Pending' | 'Processing' | 'PickedUp' | 'EnRoute' | 'Shipped' | 'Delivered' | 'Cancelled'; // Added 'EnRoute'
  orderDate: string; // ISO string
  estimatedDeliveryTime?: string;
  riderTip?: number;
  specialInstructions?: string;
  adminNotes?: string; 
  riderDetails?: RiderDetails; 
  riderNotes?: string; // Added for rider app
  proofOfDeliveryImageUrl?: string; // Added for rider app
  createdAt?: string;
  updatedAt?: string;
}

export interface DeliveryAddress {
  street: string;
  city: string;
  postalCode: string;
  country: string;
  floor?: string;
  instructions?: string; 
  contactName?: string; 
  contactPhone?: string; 
}

export interface UserProfile {
  id:string;
  name: string;
  email: string;
  phone?: string;
  addresses?: DeliveryAddress[];
  paymentMethods?: any[]; 
  role?: 'customer' | 'rider' | 'admin'; 
  vehicleType?: string; // For riders
  currentLocation?: {
    latitude: number;
    longitude: number;
  }; // For riders
  isOnline?: boolean; // For riders
}

export interface Promotion {
  id: string;
  title: string;
  description: string;
  imageUrl: string; 
  shortDescription?: string; 
  type: 'banner' | 'card';
  discountCode?: string;
  validUntil?: string;
}

export enum PageView {
  Home = "Home",
  Category = "Category",
  Product = "Product",
  Cart = "Cart",
  Checkout = "Checkout",
  OrderConfirmation = "OrderConfirmation", 
  OrderTracking = "OrderTracking", 
  Account = "Account"
}