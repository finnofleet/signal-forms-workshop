// ============================================
// API Response Types
// ============================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  errors?: ApiError[];
  message?: string;
}

export interface ApiError {
  field: string;
  code: string;
  message: string;
}

// ============================================
// Auth Types
// ============================================

export interface CheckUsernameResponse {
  available: boolean;
  suggestions?: string[];
  message?: string;
}

export interface CheckEmailResponse {
  available: boolean;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  success: boolean;
  id?: string;
  errors?: ApiError[];
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  token?: string;
  user?: {
    email: string;
    name: string;
  };
  errors?: ApiError[];
}

// ============================================
// User Types
// ============================================

export interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  phone?: string;
  address?: Address;
}

export interface Address {
  street: string;
  city: string;
  postalCode: string;
}

// ============================================
// Order Types
// ============================================

export interface DiscountValidationRequest {
  code: string;
}

export interface DiscountValidationResponse {
  valid: boolean;
  discount?: number;
  message: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
}

export interface CreateOrderRequest {
  customer: {
    name: string;
    email: string;
  };
  items: OrderItem[];
  deliveryType: 'pickup' | 'shipping';
  shippingAddress?: Address;
  discountCode?: string;
}

export interface CreateOrderResponse {
  success: boolean;
  orderId?: string;
  message?: string;
  errors?: ApiError[];
}

// ============================================
// Utility Types
// ============================================

export interface Country {
  code: string;
  name: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
}
