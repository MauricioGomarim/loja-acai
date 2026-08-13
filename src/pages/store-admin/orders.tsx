import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import type { Order, OrderStatus } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronDown, RefreshCw } from "lucide-react";

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Pendente",
  preparing: "Preparando",
  delivering: "Entregando",
  delivered: "Entregue",
};

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  preparing: "bg-blue-100 text-blue-800",
  delivering: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
};

const STATUS_OPTIONS: OrderStatus[] = ["pending", "preparing", "delivering", "delivered"];

export function StoreOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<OrderStatus | "all">("all");
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
    const handleVisibility = () => {
      if (document.visibilityState === "visible") fetchOrders();
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  async function fetchOrders() {
    try {
      const data = await api.getAllOrders();
      setOrders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(orderId: string, newStatus: OrderStatus) {
    try {
      await api.updateOrderStatus(orderId, newStatus);
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
    } catch {
      alert("Erro ao atualizar status");
    }
  }

  const filteredOrders =
    filterStatus === "all" ? orders : orders.filter((o) => o.status === filterStatus);

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 bg-zinc-100 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Tabs value={filterStatus} onValueChange={(v) => setFilterStatus(v as OrderStatus | "all")}>
          <TabsList className="h-auto flex-wrap">
            <TabsTrigger value="all">Todos ({orders.length})</TabsTrigger>
            {STATUS_OPTIONS.map((s) => (
              <TabsTrigger key={s} value={s}>
                {STATUS_LABELS[s]} ({orders.filter((o) => o.status === s).length})
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <Button variant="ghost" size="icon" onClick={fetchOrders}>
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      {filteredOrders.length === 0 ? (
        <p className="text-center text-zinc-500 py-8">Nenhum pedido encontrado</p>
      ) : (
        <div className="space-y-3">
          {filteredOrders.map((order) => {
            const isExpanded = expandedOrder === order.id;
            return (
              <Card key={order.id}>
                <button
                  onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                  className="w-full p-4 text-left"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-mono text-zinc-500">#{order.id.slice(-6)}</span>
                      <Badge className={STATUS_COLORS[order.status]}>
                        {STATUS_LABELS[order.status]}
                      </Badge>
                    </div>
                    <ChevronDown className={`h-4 w-4 text-zinc-400 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      {order.user && <p className="text-sm font-medium text-zinc-900">{order.user.name}</p>}
                      <p className="text-xs text-zinc-500">
                        {new Date(order.date).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "2-digit", hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                    <span className="text-lg font-semibold text-[#5b0e5c]">
                      R$ {order.total.toFixed(2).replace(".", ",")}
                    </span>
                  </div>
                </button>

                {isExpanded && (
                  <CardContent className="px-4 pb-4 border-t border-zinc-100">
                    <div className="mt-3 mb-4">
                      <h4 className="text-sm font-medium text-zinc-700 mb-2">Itens:</h4>
                      <div className="space-y-2">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-sm">
                            <div>
                              <span className="text-zinc-900">{item.quantity}x {item.title}</span>
                              {item.ingredients && item.ingredients.length > 0 && (
                                <p className="text-xs text-zinc-500">
                                  {item.ingredients.filter((i) => i.quantity > 0).map((i) => `${i.quantity}x ${i.name}`).join(", ")}
                                </p>
                              )}
                            </div>
                            <span className="text-zinc-600">R$ {(item.price * item.quantity).toFixed(2).replace(".", ",")}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {order.deliveryAddress && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-zinc-700 mb-1">Endereço:</h4>
                        <p className="text-sm text-zinc-600">
                          {order.deliveryAddress}
                          {order.deliveryNeighborhood && `, ${order.deliveryNeighborhood}`}
                          {order.deliveryCity && ` - ${order.deliveryCity}`}
                          {order.deliveryCep && ` (${order.deliveryCep})`}
                        </p>
                      </div>
                    )}

                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-zinc-700 mb-1">Pagamento:</h4>
                      <p className="text-sm text-zinc-600">{order.paymentMethod}</p>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-zinc-700 mb-2">Alterar status:</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {STATUS_OPTIONS.map((status) => (
                          <Button
                            key={status}
                            variant={order.status === status ? "default" : "outline"}
                            size="sm"
                            className={order.status === status ? "bg-[#5b0e5c]" : ""}
                            onClick={() => handleStatusChange(order.id, status)}
                          >
                            {STATUS_LABELS[status]}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
