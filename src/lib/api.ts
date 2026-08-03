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

    let response: Response;
    try {
      response = await fetch(`${this.baseUrl}${endpoint}`, config);
    } catch (networkError) {
      // Network error (CORS, server down, timeout) — throw as-is, don't treat as auth error
      throw networkError;
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Erro desconhecido' }));
      const err = new Error(error.details || error.error || `HTTP error! status: ${response.status}`);
      // Mark auth errors so callers can distinguish them from network/server errors
      if (response.status === 401 || response.status === 403) {
        (err as any).isAuthError = true;
      }
      throw err;
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

  async register(data: { name: string; email: string; phone: string; password: string; store_id?: string }) {
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

  async getAllUsers() {
    return this.request<User[]>('/users/all');
  }

  async updateUserRole(userId: string, data: { role?: string; store_id?: string | null }) {
    return this.request<User>(`/users/${userId}/role`, {
      method: 'PUT',
      body: data
    });
  }

  // Products
  async getProducts(storeId?: string, category?: string) {
    const params = new URLSearchParams();
    if (storeId) params.set('store_id', storeId);
    if (category) params.set('category', category);
    const query = params.toString();
    return this.request<Product[]>(`/products${query ? `?${query}` : ''}`);
  }

  async getProductById(id: string) {
    return this.request<ProductDetail>(`/products/${id}`);
  }

  async getCategories(storeId?: string) {
    const query = storeId ? `?store_id=${storeId}` : '';
    return this.request<string[]>(`/products/meta/categories${query}`);
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
  async createOrder(data: CreateOrderData & { store_id?: string }) {
    return this.request<Order>('/orders', {
      method: 'POST',
      body: data
    });
  }

  async createGuestOrder(data: CreateOrderData & { payerEmail?: string; store_id?: string }) {
    return this.request<{ id: string; storeId?: string }>('/orders/guest', {
      method: 'POST',
      body: data
    });
  }

  async getMyOrders() {
    return this.request<Order[]>('/orders/my');
  }

  async getAllOrders(params?: { status?: string; date?: string; store_id?: string }) {
    const query = new URLSearchParams();
    if (params?.status) query.set('status', params.status);
    if (params?.date) query.set('date', params.date);
    if (params?.store_id) query.set('store_id', params.store_id);
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

  async getOrderStats(storeId?: string) {
    const query = storeId ? `?store_id=${storeId}` : '';
    return this.request<OrderStats>(`/orders/stats/summary${query}`);
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

  async createPixPayment(data: { amount: number; description: string; payerEmail?: string; orderId?: string; customerName?: string; customerPhone?: string; customerCpf?: string }) {
    return this.request<{ paymentId: string; status: string; qrCodeBase64: string | null; qrCode: string | null; ticketUrl: string | null }>('/payments/pix', {
      method: 'POST',
      body: data
    });
  }

  async checkPixPaymentStatus(paymentId: string) {
    return this.request<{ paymentId: string; status: string; statusDetail: string }>(`/payments/pix/${paymentId}/status`);
  }

  // Stores
  async getStores() {
    return this.request<Store[]>('/stores');
  }

  async getStoreBySlug(slug: string) {
    return this.request<Store>(`/stores/slug/${slug}`);
  }

  async getStoreById(id: string) {
    return this.request<Store>(`/stores/${id}`);
  }

  async createStore(data: CreateStoreData) {
    return this.request<Store>('/stores', {
      method: 'POST',
      body: data
    });
  }

  async updateStore(id: string, data: Partial<CreateStoreData>) {
    return this.request<Store>(`/stores/${id}`, {
      method: 'PUT',
      body: data
    });
  }

  async deleteStore(id: string) {
    return this.request<{ message: string }>(`/stores/${id}`, {
      method: 'DELETE'
    });
  }

  async getStoreOrders(storeId: string, params?: { status?: string; date?: string }) {
    const query = new URLSearchParams();
    if (params?.status) query.set('status', params.status);
    if (params?.date) query.set('date', params.date);
    const queryStr = query.toString();
    return this.request<Order[]>(`/stores/${storeId}/orders${queryStr ? `?${queryStr}` : ''}`);
  }

  async getStoreStats(storeId: string) {
    return this.request<StoreStats>(`/stores/${storeId}/stats`);
  }

  // Withdrawals
  async requestWithdrawal(data: { store_id: string; amount: number }) {
    return this.request<Withdrawal>('/withdrawals', {
      method: 'POST',
      body: data
    });
  }

  async getMyWithdrawals() {
    return this.request<Withdrawal[]>('/withdrawals/my');
  }

  async getAllWithdrawals(params?: { status?: string; store_id?: string }) {
    const query = new URLSearchParams();
    if (params?.status) query.set('status', params.status);
    if (params?.store_id) query.set('store_id', params.store_id);
    const queryStr = query.toString();
    return this.request<Withdrawal[]>(`/withdrawals${queryStr ? `?${queryStr}` : ''}`);
  }

  async updateWithdrawal(id: string, data: { status: string; notes?: string }) {
    return this.request<Withdrawal>(`/withdrawals/${id}`, {
      method: 'PUT',
      body: data
    });
  }

  async getStoreBalance(storeId: string) {
    return this.request<StoreBalance>(`/withdrawals/balance/${storeId}`);
  }
}

// Types
export type UserRole = 'platform_owner' | 'store_owner' | 'store_admin' | 'customer';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  isAdmin: boolean;
  role: UserRole;
  store_id?: string;
}

export interface Store {
  id: string;
  name: string;
  slug: string;
  ownerId?: string;
  logoUrl?: string;
  bannerUrl?: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  slogan?: string;
  description?: string;
  phone?: string;
  address?: string;
  city?: string;
  pixKey?: string;
  pixKeyType?: string;
  commissionRate: number;
  active: boolean;
  createdAt: string;
}

export interface StoreStats {
  today: { orders: number; revenue: number };
  pending: number;
  total: number;
  totalRevenue: number;
  commissionRate: number;
  platformFee: number;
  storeEarnings: number;
}

export interface StoreBalance {
  totalRevenue: number;
  commissionRate: number;
  platformFee: number;
  storeEarnings: number;
  withdrawn: number;
  available: number;
}

export interface Product {
  id: string;
  storeId?: string;
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
  storeId?: string;
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
  store_id?: string;
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

export interface CreateStoreData {
  name: string;
  slug: string;
  logo_url?: string;
  banner_url?: string;
  primary_color?: string;
  secondary_color?: string;
  accent_color?: string;
  slogan?: string;
  description?: string;
  phone?: string;
  address?: string;
  city?: string;
  pix_key?: string;
  pix_key_type?: string;
  commission_rate?: number;
  owner_id?: string;
}

export interface Withdrawal {
  id: string;
  storeId: string;
  storeName?: string;
  ownerId: string;
  ownerName?: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected' | 'paid';
  requestedAt: string;
  processedAt?: string;
  notes?: string;
  processedBy?: string;
}

export interface PixPayment {
  paymentId: string;
  status: string;
  qrCodeBase64: string | null;
  qrCode: string | null;
  ticketUrl: string | null;
}

export const api = new ApiClient(API_URL);
