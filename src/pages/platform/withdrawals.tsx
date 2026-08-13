import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import type { Withdrawal } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const statusConfig = {
  pending: { label: "Pendente", className: "bg-yellow-100 text-yellow-700" },
  approved: { label: "Aprovado", className: "bg-blue-100 text-blue-700" },
  paid: { label: "Pago", className: "bg-green-100 text-green-700" },
  rejected: { label: "Rejeitado", className: "bg-red-100 text-red-700" },
} as const;

export function PlatformWithdrawals() {
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWithdrawals();
  }, []);

  async function loadWithdrawals() {
    try {
      const data = await api.getAllWithdrawals();
      setWithdrawals(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleAction(id: string, status: string) {
    try {
      await api.updateWithdrawal(id, { status });
      loadWithdrawals();
    } catch {
      alert("Erro ao processar saque");
    }
  }

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 bg-zinc-100 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {withdrawals.length === 0 ? (
        <p className="text-center text-zinc-500 py-8">Nenhum pedido de saque</p>
      ) : (
        withdrawals.map((w) => (
          <Card key={w.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold text-zinc-900">{w.storeName || "Loja"}</h3>
                  <p className="text-sm text-zinc-500">Solicitado por: {w.ownerName}</p>
                </div>
                <Badge className={statusConfig[w.status as keyof typeof statusConfig]?.className}>
                  {statusConfig[w.status as keyof typeof statusConfig]?.label || w.status}
                </Badge>
              </div>
              <p className="text-lg font-bold text-[#5b0e5c]">
                R$ {w.amount.toFixed(2).replace(".", ",")}
              </p>
              <p className="text-xs text-zinc-400 mb-3">
                {new Date(w.requestedAt).toLocaleString("pt-BR")}
              </p>
              {w.status === "pending" && (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    onClick={() => handleAction(w.id, "approved")}
                  >
                    Aprovar
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="flex-1"
                    onClick={() => handleAction(w.id, "rejected")}
                  >
                    Rejeitar
                  </Button>
                </div>
              )}
              {w.status === "approved" && (
                <Button
                  size="sm"
                  className="w-full bg-[#5b0e5c] hover:bg-[#4a0a4b]"
                  onClick={() => handleAction(w.id, "paid")}
                >
                  Marcar como Pago
                </Button>
              )}
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
