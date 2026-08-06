import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";
import type { Withdrawal, StoreBalance } from "../lib/api";
import { IoArrowBack } from "react-icons/io5";

export function StoreWithdrawals() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [balance, setBalance] = useState<StoreBalance | null>(null);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState(false);

  const storeId = user?.store_id;

  useEffect(() => {
    if (!storeId) {
      setLoading(false);
      return;
    }
    loadData();
  }, [storeId]);

  async function loadData() {
    if (!storeId) return;
    try {
      const [w, b] = await Promise.all([api.getMyWithdrawals(), api.getStoreBalance(storeId)]);
      setWithdrawals(w);
      setBalance(b);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleRequestWithdrawal() {
    if (!storeId || !amount) return;
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum < 50) {
      alert("Valor minimo: R$ 50,00");
      return;
    }
    setRequesting(true);
    try {
      await api.requestWithdrawal({ store_id: storeId, amount: amountNum });
      setAmount("");
      await loadData();
    } catch (err: any) {
      alert(err.message || "Erro ao solicitar saque");
    } finally {
      setRequesting(false);
    }
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
        <h1 className="text-white font-semibold text-lg">Meus Saques</h1>
      </div>

      <div className="max-w-md mx-auto p-4">
        {/* Balance Card */}
        {balance && (
          <div className="bg-white rounded-2xl p-4 mb-4 shadow-sm">
            <h3 className="text-sm text-zinc-500 mb-2">Saldo Disponivel</h3>
            <p className="text-3xl font-bold text-[#077c22]">
              R$ {balance.available.toFixed(2).replace(".", ",")}
            </p>
            <div className="mt-3 text-xs text-zinc-400 space-y-1">
              <p>Total ganho: R$ {balance.storeEarnings.toFixed(2).replace(".", ",")}</p>
              <p>Ja sacado: R$ {balance.withdrawn.toFixed(2).replace(".", ",")}</p>
            </div>
          </div>
        )}

        {/* Request Withdrawal */}
        {balance && balance.available >= 50 && (
          <div className="bg-white rounded-2xl p-4 mb-4 shadow-sm">
            <h3 className="font-semibold mb-3">Solicitar Saque</h3>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Valor (min R$ 50)"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="flex-1 border border-zinc-200 rounded-xl px-3 py-2.5 text-sm"
                min="50"
              />
              <button
                onClick={handleRequestWithdrawal}
                disabled={requesting}
                className="bg-[#5b0e5c] text-white px-4 py-2.5 rounded-xl text-sm font-medium disabled:opacity-50"
              >
                {requesting ? "..." : "Solicitar"}
              </button>
            </div>
          </div>
        )}

        {/* Withdrawal History */}
        <h3 className="font-semibold text-zinc-900 mb-3">Historico</h3>
        {withdrawals.length === 0 ? (
          <p className="text-center text-zinc-500 py-8">Nenhum saque solicitado</p>
        ) : (
          withdrawals.map((w) => (
            <div key={w.id} className="bg-white rounded-2xl p-4 mb-3 shadow-sm">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold text-zinc-900">
                    R$ {w.amount.toFixed(2).replace(".", ",")}
                  </p>
                  <p className="text-xs text-zinc-400">
                    {new Date(w.requestedAt).toLocaleString("pt-BR")}
                  </p>
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
            </div>
          ))
        )}
      </div>
    </div>
  );
}
