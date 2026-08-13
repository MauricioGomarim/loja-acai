import { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { ReactNode } from "react";
import { api } from "../lib/api";
import type { PaymentMethod } from "../lib/api";

interface SettingsContextType {
  paymentMethods: PaymentMethod[];
  loading: boolean;
  updatePaymentMethod: (id: string, data: Partial<PaymentMethod>) => Promise<void>;
  getEnabledMethods: () => PaymentMethod[];
  refreshPaymentMethods: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPaymentMethods = useCallback(async () => {
    try {
      const methods = await api.getPaymentMethods();
      setPaymentMethods(methods);
    } catch (err) {
      console.error("Error fetching payment methods:", err);
      // Fallback to defaults if API fails
      setPaymentMethods([
        { id: "pix", name: "PIX", enabled: true, pixKey: "14999999999", pixKeyType: "phone" },
        { id: "test", name: "Simular Pedido (Teste)", enabled: true },
        { id: "credit", name: "Cartão de Crédito", enabled: false },
        { id: "debit", name: "Cartão de Débito", enabled: false },
        { id: "cash", name: "Dinheiro", enabled: false }
      ]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPaymentMethods();
  }, [fetchPaymentMethods]);

  async function updatePaymentMethod(id: string, data: Partial<PaymentMethod>) {
    try {
      const updated = await api.updatePaymentMethod(id, {
        enabled: data.enabled,
        pixKey: data.pixKey,
        pixKeyType: data.pixKeyType
      });
      setPaymentMethods((prev) =>
        prev.map((method) =>
          method.id === id ? { ...method, ...updated } : method
        )
      );
    } catch (err) {
      console.error("Error updating payment method:", err);
      throw err;
    }
  }

  function getEnabledMethods() {
    return paymentMethods.filter((m) => m.enabled);
  }

  return (
    <SettingsContext.Provider
      value={{ paymentMethods, loading, updatePaymentMethod, getEnabledMethods, refreshPaymentMethods: fetchPaymentMethods }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
