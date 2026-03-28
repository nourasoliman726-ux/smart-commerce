// User
export interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  interests?: string[];
}

// Product
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: Category;
  rating: number;
  reviewsCount: number;
  stock: number;
  images: string[];
  tags?: string[];
}

export type Category =
  | "electronics"
  | "clothing"
  | "books"
  | "home"
  | "sports";

// Cart
export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  couponCode?: string;
  discount: number;
}

// Order
export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered";
  createdAt: string;
  shippingAddress: ShippingAddress;
}

export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
}

// Filters
export interface ProductFilters {
  category?: Category | "all";
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  search?: string;
  sortBy?: "price_asc" | "price_desc" | "rating" | "newest";
}

// API
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}