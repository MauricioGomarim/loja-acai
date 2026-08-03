import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";
import type { OrderStats } from "../lib/api";
import { IoArrowBack, IoCardOutline, IoStorefront, IoCash, IoSettings } from "react-icons/io5";

export function Admin() {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();
  const { user, isPlatformOwner, isStoreOwner } = useAuth();
  const [stats, setStats] = useState<OrderStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);

  const adminBase = slug ? `/${slug}/admin` : "/admin";

  useEffect(() => {
    if (!user) return;

    async function fetchStats() {
      try {
        if (isPlatformOwner && !user?.store_id) {
          // Platform owner without a specific store - no stats to show
          setLoadingStats(false);
          return;
        }
        const storeId = user?.store_id;
        const data = await api.getOrderStats(storeId);
        setStats(data);
      } catch (err) {
        console.error("Error fetching stats:", err);
      } finally {
        setLoadingStats(false);
      }
    }
    fetchStats();
  }, [user, isPlatformOwner]);

  if (!user) {
    return (
      <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center">
        <div className="text-center p-6">
          <p className="text-zinc-500 mb-4">Voce precisa estar logado para acessar o painel</p>
          <button onClick={() => navigate("/login")} className="bg-[#5b0e5c] text-white px-6 py-3 rounded-xl">
            Fazer Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <div className="bg-[#5b0e5c] p-4 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="text-white p-1">
          <IoArrowBack className="text-2xl" />
        </button>
        <h1 className="text-white font-semibold text-lg">
          {isPlatformOwner ? "Painel da Plataforma" : "Painel da Loja"}
        </h1>
      </div>

      <div className="max-w-md mx-auto p-4">
        {/* Platform Owner: Link to Platform Admin */}
        {isPlatformOwner && (
          <button
            onClick={() => navigate("/platform")}
            className="w-full bg-[#077c22] text-white p-4 rounded-2xl mb-4 flex items-center gap-3 shadow-sm"
          >
            <IoStorefront className="text-2xl" />
            <div className="text-left">
              <p className="font-semibold">Gerenciar Plataforma</p>
              <p className="text-xs text-white/80">Lojas, saques e configuracoes</p>
            </div>
          </button>
        )}

        {/* Stats */}
        {user.store_id && !loadingStats && stats && (
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <p className="text-xs text-zinc-500">Pedidos Hoje</p>
              <p className="text-2xl font-bold text-zinc-900">{stats.today.orders}</p>
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <p className="text-xs text-zinc-500">Faturamento Hoje</p>
              <p className="text-2xl font-bold text-[#077c22]">
                R$ {stats.today.revenue.toFixed(0)}
              </p>
            </div>
          </div>
        )}

        {/* Menu */}
        <div className="space-y-2">
          {(isStoreOwner || user.role === "store_admin") && user.store_id && (
            <>
              <button
                onClick={() => navigate(`${adminBase}/orders`)}
                className="w-full bg-white p-4 rounded-2xl shadow-sm flex items-center gap-3"
              >
                <IoCardOutline className="text-xl text-[#5b0e5c]" />
                <div className="text-left">
                  <p className="font-semibold text-zinc-900">Pedidos</p>
                  <p className="text-xs text-zinc-500">Gerenciar pedidos da loja</p>
                </div>
              </button>
              <button
                onClick={() => navigate(`${adminBase}/products`)}
                className="w-full bg-white p-4 rounded-2xl shadow-sm flex items-center gap-3"
              >
                <IoStorefront className="text-xl text-[#5b0e5c]" />
                <div className="text-left">
                  <p className="font-semibold text-zinc-900">Cardapio</p>
                  <p className="text-xs text-zinc-500">Gerenciar produtos</p>
                </div>
              </button>
              <button
                onClick={() => navigate(`${adminBase}/withdrawals`)}
                className="w-full bg-white p-4 rounded-2xl shadow-sm flex items-center gap-3"
              >
                <IoCash className="text-xl text-[#5b0e5c]" />
                <div className="text-left">
                  <p className="font-semibold text-zinc-900">Saques</p>
                  <p className="text-xs text-zinc-500">Solicitar e acompanhar saques</p>
                </div>
              </button>
              <button
                onClick={() => navigate(`${adminBase}/settings`)}
                className="w-full bg-white p-4 rounded-2xl shadow-sm flex items-center gap-3"
              >
                <IoSettings className="text-xl text-[#5b0e5c]" />
                <div className="text-left">
                  <p className="font-semibold text-zinc-900">Configurar Loja</p>
                  <p className="text-xs text-zinc-500">Cores, dados, PIX e mais</p>
                </div>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
