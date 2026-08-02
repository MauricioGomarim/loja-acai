import { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { ReactNode } from "react";
import { api } from "../lib/api";
import type { Store, StoreStats, StoreBalance } from "../lib/api";

interface StoreContextType {
  currentStore: Store | null;
  storeLoading: boolean;
  loadStoreBySlug: (slug: string) => Promise<void>;
  loadStoreById: (id: string) => Promise<void>;
  clearStore: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [currentStore, setCurrentStore] = useState<Store | null>(null);
  const [storeLoading, setStoreLoading] = useState(false);

  const loadStoreBySlug = useCallback(async (slug: string) => {
    setStoreLoading(true);
    try {
      const store = await api.getStoreBySlug(slug);
      setCurrentStore(store);
      // Apply theme colors
      applyTheme(store);
    } catch (err) {
      console.error("Error loading store:", err);
      setCurrentStore(null);
    } finally {
      setStoreLoading(false);
    }
  }, []);

  const loadStoreById = useCallback(async (id: string) => {
    setStoreLoading(true);
    try {
      const store = await api.getStoreById(id);
      setCurrentStore(store);
      applyTheme(store);
    } catch (err) {
      console.error("Error loading store:", err);
    } finally {
      setStoreLoading(false);
    }
  }, []);

  const clearStore = useCallback(() => {
    setCurrentStore(null);
    resetTheme();
  }, []);

  return (
    <StoreContext.Provider
      value={{ currentStore, storeLoading, loadStoreBySlug, loadStoreById, clearStore }}
    >
      {children}
    </StoreContext.Provider>
  );
}

function applyTheme(store: Store) {
  const root = document.documentElement;
  root.style.setProperty('--store-primary', store.primaryColor || '#5b0e5c');
  root.style.setProperty('--store-secondary', store.secondaryColor || '#077c22');
  root.style.setProperty('--store-accent', store.accentColor || '#f1cdf2');
}

function resetTheme() {
  const root = document.documentElement;
  root.style.setProperty('--store-primary', '#5b0e5c');
  root.style.setProperty('--store-secondary', '#077c22');
  root.style.setProperty('--store-accent', '#f1cdf2');
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
}

export type { StoreStats, StoreBalance };
