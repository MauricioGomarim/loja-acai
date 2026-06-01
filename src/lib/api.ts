const API_URL = import.meta.env.VITE_API_URL || '/api';

interface RequestOptions {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private getToken(): string | null {
    return localStorage.getItem('acai_token');
  }

  private async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { method = 'GET', body, headers = {} } = options;

    const token = this.getToken();
    const config: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    };

    if (body) {
      config.body = JSON.stringify(body);
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, config);

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Erro desconhecido' }));
      throw new Error(error.error || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Auth
  async login(email: string, password: string) {
    return this.request<{ user: User; token: string }>('/auth/login', {
      method: 'POST',
      body: { email, password }
    });
  }

  async register(data: { name: string; email: string; phone: string; password: string }) {
    return this.request<{ user: User; token: string }>('/auth/register', {
      method: 'POST',
      body: data
    });
  }

  async getMe() {
    return this.request<User>('/auth/me');
  }

  // Users
  async getProfile() {
    return this.request<User>('/users/profile');
  }

  async updateProfile(data: { name?: string; phone?: string }) {
    return this.request<User>('/users/profile', {
      method: 'PUT',
      body: data
    });
  }

  async changePassword(data: { currentPassword: string; newPassword: string }) {
    return this.request<{ message: string }>('/users/password', {
      method: 'PUT',
      body: data
    });
  }

  async getUserOrders() {
    return this.request<Order[]>('/users/orders');
  }

  // Products
  async getProducts(category?: string) {
    const query = category ? `?category=${encodeURIComponent(category)}` : '';
    return this.request<Product[]>(`/products${query}`);
  }

  async getProductById(id: string) {
    return this.request<ProductDetail>(`/products/${id}`);
  }

  async getCategories() {
    return this.request<string[]>('/products/meta/categories');
  }

  async createProduct(data: CreateProductData) {
    return this.request<ProductDetail>('/products', {
      method: 'POST',
      body: data
    });
  }

  async updateProduct(id: string, data: Partial<CreateProductData>) {
    return this.request<ProductDetail>(`/products/${id}`, {
      method: 'PUT',
      body: data
    });
  }

  async deleteProduct(id: string) {
    return this.request<{ message: string }>(`/products/${id}`, {
      method: 'DELETE'
    });
  }

  async updateProductIngredients(id: string, ingredients: Ingredient[]) {
    return this.request<Ingredient[]>(`/products/${id}/ingredients`, {
      method: 'PUT',
      body: { ingredients }
    });
  }

  // Orders
  async createOrder(data: CreateOrderData) {
    return this.request<Order>('/orders', {
      method: 'POST',
      body: data
    });
  }

  async createGuestOrder(data: CreateOrderData & { payerEmail?: string }) {
    return this.request<{ id: string }>('/orders/guest', {
      method: 'POST',
      body: data
    });
  }

  async getMyOrders() {
    return this.request<Order[]>('/orders/my');
  }

  async getAllOrders(params?: { status?: string; date?: string }) {
    const query = new URLSearchParams();
    if (params?.status) query.set('status', params.status);
    if (params?.date) query.set('date', params.date);
    const queryStr = query.toString();
    return this.request<Order[]>(`/orders${queryStr ? `?${queryStr}` : ''}`);
  }

  async getOrderById(id: string) {
    return this.request<Order>(`/orders/${id}`);
  }

  async updateOrderStatus(id: string, status: OrderStatus) {
    return this.request<Order>(`/orders/${id}/status`, {
      method: 'PUT',
      body: { status }
    });
  }

  async getOrderStats() {
    return this.request<OrderStats>('/orders/stats/summary');
  }

  // Payments
  async getPaymentMethods() {
    return this.request<PaymentMethod[]>('/payments');
  }

  async getEnabledPaymentMethods() {
    return this.request<PaymentMethod[]>('/payments/enabled');
  }

  async updatePaymentMethod(id: string, data: { enabled?: boolean; pixKey?: string; pixKeyType?: string }) {
    return this.request<PaymentMethod>(`/payments/${id}`, {
      method: 'PUT',
      body: data
    });
  }

  async createPaymentMethod(data: { id: string; name: string; enabled?: boolean; pixKey?: string; pixKeyType?: string }) {
    return this.request<PaymentMethod>('/payments', {
      method: 'POST',
      body: data
    });
  }

  async deletePaymentMethod(id: string) {
    return this.request<{ message: string }>(`/payments/${id}`, {
      method: 'DELETE'
    });
  }

  async createPixPayment(data: { amount: number; description: string; payerEmail?: string; orderId?: string }) {
    return this.request<{ paymentId: string; status: string; qrCodeBase64: string | null; qrCode: string | null; ticketUrl: string | null }>('/payments/pix', {
      method: 'POST',
      body: data
    });
  }

  async checkPixPaymentStatus(paymentId: string) {
    return this.request<{ paymentId: string; status: string; statusDetail: string }>(`/payments/pix/${paymentId}/status`);
  }
}

export interface PixPayment {
  paymentId: string;
  status: string;
  qrCodeBase64: string | null;
  qrCode: string | null;
  ticketUrl: string | null;
}

// Types
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  isAdmin: boolean;
}

export interface Product {
  id: string;
  title: string;
  subtitle: string;
  oldPrice: number;
  newPrice: number;
  image: string;
  category: string;
  badge?: string;
  description?: string;
  extras?: string;
}

export interface ProductDetail extends Product {
  ingredients: Ingredient[];
}

export interface Ingredient {
  id: number;
  name: string;
  description: string;
  quantity: number;
}

export interface OrderItem {
  title: string;
  quantity: number;
  price: number;
  ingredients?: { name: string; quantity: number }[];
  details?: string;
}

export type OrderStatus = 'pending' | 'preparing' | 'delivering' | 'delivered';

export interface Order {
  id: string;
  date: string;
  total: number;
  status: OrderStatus;
  paymentMethod: string;
  deliveryAddress?: string;
  deliveryCep?: string;
  deliveryNeighborhood?: string;
  deliveryCity?: string;
  deliveryComplement?: string;
  items: OrderItem[];
  user?: {
    name: string;
    email: string;
    phone: string;
  };
}

export interface PaymentMethod {
  id: string;
  name: string;
  enabled: boolean;
  pixKey?: string;
  pixKeyType?: 'cpf' | 'email' | 'phone' | 'random';
}

export interface CreateProductData {
  title: string;
  subtitle?: string;
  oldPrice?: number;
  newPrice: number;
  image?: string;
  category: string;
  badge?: string;
  description?: string;
  extras?: string;
  ingredients?: Omit<Ingredient, 'id'>[];
}

export interface CreateOrderData {
  items: {
    productId?: string;
    title: string;
    quantity: number;
    price: number;
    ingredients?: { name: string; quantity: number }[];
    details?: string;
  }[];
  total: number;
  paymentMethod: string;
  deliveryAddress?: string;
  deliveryCep?: string;
  deliveryNeighborhood?: string;
  deliveryCity?: string;
  deliveryComplement?: string;
}

export interface OrderStats {
  today: {
    orders: number;
    revenue: number;
  };
  pending: number;
  total: number;
}

export const api = new ApiClient(API_URL);
