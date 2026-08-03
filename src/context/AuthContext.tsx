import { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { ReactNode } from "react";
import { api } from "../lib/api";
import type { User, Order, CreateOrderData } from "../lib/api";

interface AuthContextType {
  user: User | null;
  orders: Order[];
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, phone: string, password: string, storeId?: string) => Promise<boolean>;
  logout: () => void;
  addOrder: (orderData: CreateOrderData & { store_id?: string }) => Promise<Order>;
  refreshOrders: () => Promise<void>;
  isPlatformOwner: boolean;
  isStoreOwner: boolean;
  isStoreAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("acai_token");
    if (!token) {
      setLoading(false);
      return;
    }

    // Decode JWT locally first so user is available immediately
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUser({
        id: payload.id,
        name: payload.name || '',
        email: payload.email || '',
        phone: payload.phone || '',
        isAdmin: payload.isAdmin || false,
        role: payload.role || 'customer',
        store_id: payload.store_id || undefined,
      });
    } catch {
      // Invalid token format
      localStorage.removeItem("acai_token");
      setLoading(false);
      return;
    }

    setLoading(false);

    // Then try to refresh user data from server in the background
    api.getMe()
      .then(userData => {
        setUser(userData);
        api.getMyOrders().then(setOrders).catch(() => {});
      })
      .catch(() => {
        // Server error — keep the local JWT data, don't remove token
      });
  }, []);

  const refreshOrders = useCallback(async () => {
    try {
      const userOrders = await api.getMyOrders();
      setOrders(userOrders);
    } catch (err) {
      console.error("Error refreshing orders:", err);
    }
  }, []);

  async function login(email: string, password: string): Promise<boolean> {
    try {
      const { user: userData, token } = await api.login(email, password);
      localStorage.setItem("acai_token", token);
      setUser(userData);
      api.getMyOrders().then(setOrders).catch(() => {});
      return true;
    } catch (err) {
      console.error("Login error:", err);
      return false;
    }
  }

  async function register(
    name: string,
    email: string,
    phone: string,
    password: string,
    storeId?: string
  ): Promise<boolean> {
    try {
      const { user: userData, token } = await api.register({ name, email, phone, password, store_id: storeId });
      localStorage.setItem("acai_token", token);
      setUser(userData);
      return true;
    } catch (err) {
      console.error("Register error:", err);
      return false;
    }
  }

  function logout() {
    localStorage.removeItem("acai_token");
    setUser(null);
    setOrders([]);
  }

  async function addOrder(orderData: CreateOrderData & { store_id?: string }): Promise<Order> {
    try {
      const newOrder = await api.createOrder(orderData);
      setOrders((prev) => [newOrder, ...prev]);
      return newOrder;
    } catch (err) {
      console.error("Error creating order:", err);
      throw err;
    }
  }

  const isPlatformOwner = user?.role === 'platform_owner';
  const isStoreOwner = user?.role === 'store_owner';
  const isStoreAdmin = user?.role === 'store_admin';

  return (
    <AuthContext.Provider
      value={{ user, orders, loading, login, register, logout, addOrder, refreshOrders, isPlatformOwner, isStoreOwner, isStoreAdmin }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
