import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";
import type { Store, Withdrawal } from "../lib/api";
import { IoArrowBack, IoStorefront } from "react-icons/io5";

export function PlatformAdmin() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stores, setStores] = useState<Store[]>([]);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [tab, setTab] = useState<"stores" | "withdrawals">("stores");
  const [loading, setLoading] = useState(true);
  const [showCreateStore, setShowCreateStore] = useState(false);
  const [newStore, setNewStore] = useState({ name: "", slug: "", city: "", phone: "" });

  useEffect(() => {
    if (user?.role !== "platform_owner") {
      navigate("/");
      return;
    }
    loadData();
  }, [user, navigate]);

  async function loadData() {
    try {
      const [s, w] = await Promise.all([api.getStores(), api.getAllWithdrawals()]);
      setStores(s);
      setWithdrawals(w);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateStore() {
    if (!newStore.name || !newStore.slug) return;
    try {
      await api.createStore(newStore);
      setShowCreateStore(false);
      setNewStore({ name: "", slug: "", city: "", phone: "" });
      const s = await api.getStores();
      setStores(s);
    } catch (err) {
      alert("Erro ao criar loja");
    }
  }

  async function handleWithdrawalAction(id: string, status: string) {
    try {
      await api.updateWithdrawal(id, { status });
      const w = await api.getAllWithdrawals();
      setWithdrawals(w);
    } catch (err) {
      alert("Erro ao processar saque");
    }
  }

  if (!user || user.role !== "platform_owner") {
    return (
      <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center">
        <p className="text-zinc-500">Acesso restrito ao dono da plataforma</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#5b0e5c] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <div className="bg-[#5b0e5c] p-4 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="text-white p-1">
          <IoArrowBack className="text-2xl" />
        </button>
        <h1 className="text-white font-semibold text-lg">Painel da Plataforma</h1>
      </div>

      <div className="max-w-md mx-auto p-4">
        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setTab("stores")}
            className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              tab === "stores" ? "bg-[#5b0e5c] text-white" : "bg-white text-zinc-600"
            }`}
          >
            Lojas ({stores.length})
          </button>
          <button
            onClick={() => setTab("withdrawals")}
            className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              tab === "withdrawals" ? "bg-[#5b0e5c] text-white" : "bg-white text-zinc-600"
            }`}
          >
            Saques ({withdrawals.filter((w) => w.status === "pending").length})
          </button>
        </div>

        {tab === "stores" && (
          <>
            <button
              onClick={() => setShowCreateStore(!showCreateStore)}
              className="w-full bg-[#077c22] text-white py-3 rounded-xl font-medium mb-4"
            >
              + Nova Loja
            </button>

            {showCreateStore && (
              <div className="bg-white rounded-2xl p-4 mb-4 shadow-sm">
                <h3 className="font-semibold mb-3">Criar Loja</h3>
                <input
                  placeholder="Nome da loja"
                  value={newStore.name}
                  onChange={(e) => setNewStore({ ...newStore, name: e.target.value })}
                  className="w-full border border-zinc-200 rounded-xl px-3 py-2.5 text-sm mb-2"
                />
                <input
                  placeholder="slug (ex: minha-loja)"
                  value={newStore.slug}
                  onChange={(e) => setNewStore({ ...newStore, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") })}
                  className="w-full border border-zinc-200 rounded-xl px-3 py-2.5 text-sm mb-2"
                />
                <input
                  placeholder="Cidade"
                  value={newStore.city}
                  onChange={(e) => setNewStore({ ...newStore, city: e.target.value })}
                  className="w-full border border-zinc-200 rounded-xl px-3 py-2.5 text-sm mb-2"
                />
                <input
                  placeholder="Telefone"
                  value={newStore.phone}
                  onChange={(e) => setNewStore({ ...newStore, phone: e.target.value })}
                  className="w-full border border-zinc-200 rounded-xl px-3 py-2.5 text-sm mb-3"
                />
                <button onClick={handleCreateStore} className="w-full bg-[#5b0e5c] text-white py-2.5 rounded-xl text-sm font-medium">
                  Criar Loja
                </button>
              </div>
            )}

            {stores.map((store) => (
              <div key={store.id} className="bg-white rounded-2xl p-4 mb-3 shadow-sm">
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold"
                    style={{ backgroundColor: store.primaryColor }}
                  >
                    <IoStorefront />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-zinc-900">{store.name}</h3>
                    <p className="text-xs text-zinc-500">/{store.slug} | {store.city || "Sem cidade"}</p>
                    <p className="text-xs text-zinc-400">Comissao: {store.commissionRate}%</p>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}

        {tab === "withdrawals" && (
          <>
            {withdrawals.length === 0 ? (
              <p className="text-center text-zinc-500 py-8">Nenhum pedido de saque</p>
            ) : (
              withdrawals.map((w) => (
                <div key={w.id} className="bg-white rounded-2xl p-4 mb-3 shadow-sm">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-zinc-900">{w.storeName || "Loja"}</h3>
                      <p className="text-sm text-zinc-500">Solicitado por: {w.ownerName}</p>
                      <p className="text-lg font-bold text-[#5b0e5c] mt-1">
                        R$ {w.amount.toFixed(2).replace(".", ",")}
                      </p>
                      <p className="text-xs text-zinc-400">{new Date(w.requestedAt).toLocaleString("pt-BR")}</p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        w.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : w.status === "approved"
                          ? "bg-blue-100 text-blue-700"
                          : w.status === "paid"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {w.status === "pending" ? "Pendente" : w.status === "approved" ? "Aprovado" : w.status === "paid" ? "Pago" : "Rejeitado"}
                    </span>
                  </div>
                  {w.status === "pending" && (
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => handleWithdrawalAction(w.id, "approved")}
                        className="flex-1 bg-[#077c22] text-white py-2 rounded-xl text-sm font-medium"
                      >
                        Aprovar
                      </button>
                      <button
                        onClick={() => handleWithdrawalAction(w.id, "rejected")}
                        className="flex-1 bg-red-500 text-white py-2 rounded-xl text-sm font-medium"
                      >
                        Rejeitar
                      </button>
                    </div>
                  )}
                  {w.status === "approved" && (
                    <button
                      onClick={() => handleWithdrawalAction(w.id, "paid")}
                      className="w-full mt-3 bg-[#5b0e5c] text-white py-2 rounded-xl text-sm font-medium"
                    >
                      Marcar como Pago
                    </button>
                  )}
                </div>
              ))
            )}
          </>
        )}
      </div>
    </div>
  );
}
