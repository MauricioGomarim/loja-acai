import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useSettings } from "../context/SettingsContext";
import { api } from "../lib/api";
import type { OrderStats } from "../lib/api";
import {
  IoArrowBack,
  IoCardOutline,
  IoCheckmarkCircle,
  IoChevronForward,
} from "react-icons/io5";

export function Admin() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { paymentMethods, updatePaymentMethod } = useSettings();
  const [editingMethod, setEditingMethod] = useState<string | null>(null);
  const [pixKey, setPixKey] = useState("");
  const [pixKeyType, setPixKeyType] = useState<
    "cpf" | "email" | "phone" | "random"
  >("phone");
  const [stats, setStats] = useState<OrderStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const data = await api.getOrderStats();
        setStats(data);
      } catch (err) {
        console.error("Error fetching stats:", err);
      } finally {
        setLoadingStats(false);
      }
    }
    fetchStats();
  }, []);

  if (!user?.isAdmin) {
    return (
      <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center">
        <div className="text-center p-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m0 0v2m0-2h2m-2 0H10m4-6V9a4 4 0 00-8 0v2"
              />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-zinc-900 mb-2">
            Acesso restrito
          </h2>
          <p className="text-sm text-zinc-500 mb-4">
            Esta área é exclusiva para administradores
          </p>
          <button
            onClick={() => navigate("/")}
            className="bg-[#5b0e5c] text-white px-6 py-2.5 rounded-full font-medium"
          >
            Voltar ao início
          </button>
        </div>
      </div>
    );
  }

  function handleEditMethod(id: string) {
    const method = paymentMethods.find((m) => m.id === id);
    if (method) {
      setEditingMethod(id);
      setPixKey(method.pixKey || "");
      setPixKeyType(method.pixKeyType || "phone");
    }
  }

  function handleSavePix() {
    if (editingMethod) {
      updatePaymentMethod(editingMethod, {
        pixKey,
        pixKeyType,
      });
      setEditingMethod(null);
    }
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      {/* Header */}
      <div className="bg-[#5b0e5c] p-4 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="text-white p-1">
          <IoArrowBack className="text-2xl" />
        </button>
        <h1 className="text-white font-semibold text-lg">
          Painel Administrativo
        </h1>
      </div>

      <div className="max-w-md mx-auto p-4">
        {/* Admin info */}
        <div className="bg-white rounded-2xl p-4 mt-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#5b0e5c] rounded-full flex items-center justify-center">
              <span className="text-white font-bold">A</span>
            </div>
            <div>
              <h2 className="font-semibold text-zinc-900">{user.name}</h2>
              <p className="text-sm text-green-600">Administrador</p>
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-2 gap-3 mt-4">
          <div className="bg-white rounded-2xl p-4 shadow-sm text-center">
            <div className="text-2xl font-bold text-[#5b0e5c]">
              {loadingStats ? "..." : stats?.today.orders || 0}
            </div>
            <div className="text-xs text-zinc-500 mt-1">Pedidos hoje</div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm text-center">
            <div className="text-2xl font-bold text-green-600">
              {loadingStats ? "..." : `R$ ${stats?.today.revenue.toFixed(2).replace(".", ",") || "0,00"}`}
            </div>
            <div className="text-xs text-zinc-500 mt-1">Faturamento</div>
          </div>
        </div>

        {/* Payment methods */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-zinc-900 mb-3">
            Formas de pagamento
          </h3>

          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            {paymentMethods.map((method) => (
              <div key={method.id}>
                <div className="flex items-center justify-between p-4 border-b border-zinc-100 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-zinc-100 rounded-full flex items-center justify-center">
                      <IoCardOutline className="text-lg text-zinc-500" />
                    </div>
                    <div>
                      <h4 className="font-medium text-zinc-900">
                        {method.name}
                      </h4>
                      {method.enabled && method.pixKey && (
                        <p className="text-xs text-zinc-500">
                          Chave: {method.pixKey}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {method.enabled && (
                      <IoCheckmarkCircle className="text-green-500 text-xl" />
                    )}
                    <button
                      onClick={() => handleEditMethod(method.id)}
                      className="p-2 hover:bg-zinc-100 rounded-full transition-colors"
                    >
                      <IoChevronForward className="text-zinc-400" />
                    </button>
                  </div>
                </div>

                {/* Edit form */}
                {editingMethod === method.id && (
                  <div className="p-4 bg-zinc-50 border-t border-zinc-100">
                    <h4 className="font-medium text-zinc-900 mb-3">
                      Configurar {method.name}
                    </h4>

                    {method.id === "pix" ? (
                      <>
                        <div className="mb-3">
                          <label className="block text-sm text-zinc-600 mb-1">
                            Tipo de chave
                          </label>
                          <select
                            value={pixKeyType}
                            onChange={(e) =>
                              setPixKeyType(
                                e.target.value as
                                  | "cpf"
                                  | "email"
                                  | "phone"
                                  | "random"
                              )
                            }
                            className="w-full border border-zinc-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#5b0e5c]"
                          >
                            <option value="phone">Telefone</option>
                            <option value="cpf">CPF</option>
                            <option value="email">Email</option>
                            <option value="random">Chave aleatória</option>
                          </select>
                        </div>

                        <div className="mb-3">
                          <label className="block text-sm text-zinc-600 mb-1">
                            Chave PIX
                          </label>
                          <input
                            type="text"
                            value={pixKey}
                            onChange={(e) => setPixKey(e.target.value)}
                            placeholder="Sua chave PIX"
                            className="w-full border border-zinc-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#5b0e5c]"
                          />
                        </div>
                      </>
                    ) : (
                      <div className="mb-3">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={method.enabled}
                            onChange={(e) =>
                              updatePaymentMethod(method.id, {
                                enabled: e.target.checked,
                              })
                            }
                            className="w-4 h-4 text-[#5b0e5c] rounded"
                          />
                          <span className="text-sm text-zinc-700">
                            Habilitar {method.name}
                          </span>
                        </label>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <button
                        onClick={handleSavePix}
                        className="flex-1 bg-[#5b0e5c] text-white py-2 rounded-xl text-sm font-medium"
                      >
                        Salvar
                      </button>
                      <button
                        onClick={() => setEditingMethod(null)}
                        className="flex-1 bg-zinc-200 text-zinc-700 py-2 rounded-xl text-sm font-medium"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Menu items */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-zinc-900 mb-3">
            Gerenciar
          </h3>
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <button
              onClick={() => navigate("/admin/orders")}
              className="w-full flex items-center justify-between p-4 hover:bg-zinc-50 transition-colors border-b border-zinc-100"
            >
              <span className="text-zinc-700">Pedidos</span>
              <IoChevronForward className="text-zinc-400" />
            </button>
            <button
              onClick={() => navigate("/admin/products")}
              className="w-full flex items-center justify-between p-4 hover:bg-zinc-50 transition-colors border-b border-zinc-100"
            >
              <span className="text-zinc-700">Cardápio</span>
              <IoChevronForward className="text-zinc-400" />
            </button>
            <button
              onClick={() => navigate("/admin/categories")}
              className="w-full flex items-center justify-between p-4 hover:bg-zinc-50 transition-colors border-b border-zinc-100"
            >
              <span className="text-zinc-700">Categorias</span>
              <IoChevronForward className="text-zinc-400" />
            </button>
            <button className="w-full flex items-center justify-between p-4 hover:bg-zinc-50 transition-colors">
              <span className="text-zinc-700">Relatórios</span>
              <IoChevronForward className="text-zinc-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
