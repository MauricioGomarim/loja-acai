import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";
import type { Order, OrderStatus } from "../lib/api";
import {
  IoArrowBack,
  IoChevronDown,
  IoRefresh,
} from "react-icons/io5";

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

export function AdminOrders() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<OrderStatus | "all">("all");
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !["platform_owner", "store_owner", "store_admin"].includes(user.role)) {
      navigate("/");
      return;
    }
    fetchOrders();

    const handleVisibility = () => {
      if (document.visibilityState === "visible") fetchOrders();
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [user, navigate]);

  async function fetchOrders() {
    try {
      const data = await api.getAllOrders();
      setOrders(data);
    } catch (err) {
      console.error("Error fetching orders:", err);
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
    } catch (err) {
      console.error("Error updating order status:", err);
      alert("Erro ao atualizar status");
    }
  }

  const filteredOrders =
    filterStatus === "all"
      ? orders
      : orders.filter((o) => o.status === filterStatus);

  const statusCounts = {
    all: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    preparing: orders.filter((o) => o.status === "preparing").length,
    delivering: orders.filter((o) => o.status === "delivering").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#5b0e5c] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      {/* Header */}
      <div className="bg-[#5b0e5c] p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/admin")} className="text-white p-1">
            <IoArrowBack className="text-2xl" />
          </button>
          <h1 className="text-white font-semibold text-lg">Gerenciar Pedidos</h1>
        </div>
        <button onClick={fetchOrders} className="text-white p-2 hover:bg-white/10 rounded-full transition-colors">
          <IoRefresh className="text-xl" />
        </button>
      </div>

      <div className="max-w-md mx-auto p-4">
        {/* Status Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
          {(["all", ...STATUS_OPTIONS] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                filterStatus === status
                  ? "bg-[#5b0e5c] text-white"
                  : "bg-white text-zinc-700 hover:bg-zinc-100"
              }`}
            >
              {status === "all" ? "Todos" : STATUS_LABELS[status]}
              <span className="ml-1 text-xs opacity-75">
                ({statusCounts[status]})
              </span>
            </button>
          ))}
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-zinc-500">Nenhum pedido encontrado</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredOrders.map((order) => {
              const isExpanded = expandedOrder === order.id;

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl shadow-sm overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                    className="w-full p-4 text-left"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-mono text-zinc-500">
                          #{order.id.slice(-6)}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            STATUS_COLORS[order.status]
                          }`}
                        >
                          {STATUS_LABELS[order.status]}
                        </span>
                      </div>
                      <IoChevronDown
                        className={`text-zinc-400 transition-transform ${
                          isExpanded ? "rotate-180" : ""
                        }`}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        {order.user && (
                          <p className="text-sm font-medium text-zinc-900">
                            {order.user.name}
                          </p>
                        )}
                        <p className="text-xs text-zinc-500">
                          {new Date(order.date).toLocaleDateString("pt-BR", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                      <span className="text-lg font-semibold text-[#5b0e5c]">
                        R$ {order.total.toFixed(2).replace(".", ",")}
                      </span>
                    </div>
                  </button>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className="px-4 pb-4 border-t border-zinc-100">
                      {/* Order Items */}
                      <div className="mt-3 mb-4">
                        <h4 className="text-sm font-medium text-zinc-700 mb-2">
                          Itens do pedido:
                        </h4>
                        <div className="space-y-2">
                          {order.items.map((item, idx) => (
                            <div
                              key={idx}
                              className="flex justify-between text-sm"
                            >
                              <div>
                                <span className="text-zinc-900">
                                  {item.quantity}x {item.title}
                                </span>
                                {item.ingredients && item.ingredients.length > 0 && (
                                  <p className="text-xs text-zinc-500">
                                    {item.ingredients
                                      .filter((i) => i.quantity > 0)
                                      .map((i) => `${i.quantity}x ${i.name}`)
                                      .join(", ")}
                                  </p>
                                )}
                              </div>
                              <span className="text-zinc-600">
                                R$ {(item.price * item.quantity).toFixed(2).replace(".", ",")}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Delivery Info */}
                      {order.deliveryAddress && (
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-zinc-700 mb-1">
                            Endereço de entrega:
                          </h4>
                          <p className="text-sm text-zinc-600">
                            {order.deliveryAddress}
                            {order.deliveryNeighborhood && `, ${order.deliveryNeighborhood}`}
                            {order.deliveryCity && ` - ${order.deliveryCity}`}
                            {order.deliveryCep && ` (${order.deliveryCep})`}
                          </p>
                        </div>
                      )}

                      {/* Payment Method */}
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-zinc-700 mb-1">
                          Pagamento:
                        </h4>
                        <p className="text-sm text-zinc-600">{order.paymentMethod}</p>
                      </div>

                      {/* Status Change */}
                      <div>
                        <h4 className="text-sm font-medium text-zinc-700 mb-2">
                          Alterar status:
                        </h4>
                        <div className="grid grid-cols-2 gap-2">
                          {STATUS_OPTIONS.map((status) => (
                            <button
                              key={status}
                              onClick={() => handleStatusChange(order.id, status)}
                              disabled={order.status === status}
                              className={`py-2 rounded-xl text-sm font-medium transition-colors ${
                                order.status === status
                                  ? "bg-[#5b0e5c] text-white"
                                  : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
                              }`}
                            >
                              {STATUS_LABELS[status]}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
