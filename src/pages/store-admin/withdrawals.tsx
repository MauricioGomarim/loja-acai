import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import type { Withdrawal, StoreBalance } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const statusConfig = {
  pending: { label: "Pendente", className: "bg-yellow-100 text-yellow-700" },
  approved: { label: "Aprovado", className: "bg-blue-100 text-blue-700" },
  paid: { label: "Pago", className: "bg-green-100 text-green-700" },
  rejected: { label: "Rejeitado", className: "bg-red-100 text-red-700" },
} as const;

export function StoreWithdrawals() {
  const { user } = useAuth();
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [balance, setBalance] = useState<StoreBalance | null>(null);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState(false);
  const storeId = user?.store_id;

  useEffect(() => {
    if (!storeId) { setLoading(false); return; }
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
    if (isNaN(amountNum) || amountNum < 50) { alert("Valor minimo: R$ 50,00"); return; }
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
    return <div className="space-y-3">{[1, 2].map((i) => <div key={i} className="h-24 bg-zinc-100 rounded-xl animate-pulse" />)}</div>;
  }

  return (
    <div className="space-y-4">
      {balance && (
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-zinc-500 mb-1">Saldo Disponível</p>
            <p className="text-3xl font-bold text-green-600">R$ {balance.available.toFixed(2).replace(".", ",")}</p>
            <div className="mt-3 text-xs text-zinc-400 space-y-1">
              <p>Total ganho: R$ {balance.storeEarnings.toFixed(2).replace(".", ",")}</p>
              <p>Já sacado: R$ {balance.withdrawn.toFixed(2).replace(".", ",")}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {balance && balance.available >= 50 && (
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-3">Solicitar Saque</h3>
            <div className="flex gap-2">
              <Input type="number" placeholder="Valor (min R$ 50)" value={amount} onChange={(e) => setAmount(e.target.value)} min="50" className="flex-1" />
              <Button onClick={handleRequestWithdrawal} disabled={requesting} className="bg-[#5b0e5c] hover:bg-[#4a0a4b]">
                {requesting ? "..." : "Solicitar"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <h3 className="font-semibold text-zinc-900">Histórico</h3>
      {withdrawals.length === 0 ? (
        <p className="text-center text-zinc-500 py-8">Nenhum saque solicitado</p>
      ) : (
        withdrawals.map((w) => (
          <Card key={w.id}>
            <CardContent className="p-4 flex justify-between items-center">
              <div>
                <p className="font-semibold text-zinc-900">R$ {w.amount.toFixed(2).replace(".", ",")}</p>
                <p className="text-xs text-zinc-400">{new Date(w.requestedAt).toLocaleString("pt-BR")}</p>
              </div>
              <Badge className={statusConfig[w.status as keyof typeof statusConfig]?.className}>
                {statusConfig[w.status as keyof typeof statusConfig]?.label || w.status}
              </Badge>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
