import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import type { OrderStats } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ClipboardList, DollarSign } from "lucide-react";

export function StoreDashboard() {
  const { slug } = useParams<{ slug: string }>();
  const { user, isPlatformOwner } = useAuth();
  const [stats, setStats] = useState<OrderStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    if (isPlatformOwner && !user?.store_id) {
      setLoading(false);
      return;
    }
    api.getOrderStats(user?.store_id)
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user, isPlatformOwner]);

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4">
        {[1, 2].map((i) => (
          <Skeleton key={i} className="h-28 rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <ClipboardList className="h-5 w-5 text-[#5b0e5c]" />
              </div>
              <div>
                <p className="text-xs text-zinc-500">Pedidos Hoje</p>
                <p className="text-2xl font-bold text-zinc-900">{stats?.today.orders || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-zinc-500">Faturamento</p>
                <p className="text-2xl font-bold text-green-600">
                  R$ {stats?.today.revenue.toFixed(0) || "0"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
