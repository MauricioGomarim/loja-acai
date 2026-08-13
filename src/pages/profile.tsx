import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  IoArrowBack,
  IoLogOutOutline,
  IoChevronForward,
} from "react-icons/io5";

export function Profile() {
  const navigate = useNavigate();
  const { user, orders, ordersLoading, logout } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen bg-[#f5f5f5]">
        <div className="bg-[#5b0e5c] p-4 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="text-white p-1">
            <IoArrowBack className="text-2xl" />
          </button>
          <h1 className="text-white font-semibold text-lg">Perfil</h1>
        </div>
        <div className="max-w-md mx-auto p-6 text-center mt-20">
          <div className="w-20 h-20 bg-zinc-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-10 h-10 text-zinc-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-zinc-900 mb-2">
            Faça login para continuar
          </h2>
          <p className="text-sm text-zinc-500 mb-6">
            Acesse sua conta para acompanhar seus pedidos
          </p>
          <button
            onClick={() => navigate("/login")}
            className="bg-[#5b0e5c] hover:bg-[#4a0b4b] text-white font-semibold py-3 px-8 rounded-full transition-colors"
          >
            Entrar ou criar conta
          </button>
        </div>
      </div>
    );
  }

  function getStatusColor(status: string) {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "preparing":
        return "bg-blue-100 text-blue-700";
      case "delivering":
        return "bg-purple-100 text-purple-700";
      case "delivered":
        return "bg-green-100 text-green-700";
      default:
        return "bg-zinc-100 text-zinc-700";
    }
  }

  function getStatusText(status: string) {
    switch (status) {
      case "pending":
        return "Pendente";
      case "preparing":
        return "Preparando";
      case "delivering":
        return "A caminho";
      case "delivered":
        return "Entregue";
      default:
        return status;
    }
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      {/* Header */}
      <div className="bg-[#5b0e5c] p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="text-white p-1">
            <IoArrowBack className="text-2xl" />
          </button>
          <h1 className="text-white font-semibold text-lg">Meu perfil</h1>
        </div>
        <button
          onClick={() => {
            logout();
            navigate("/");
          }}
          className="text-white p-2 hover:bg-white/10 rounded-full transition-colors"
        >
          <IoLogOutOutline className="text-xl" />
        </button>
      </div>

      <div className="max-w-md mx-auto p-4">
        {/* User info */}
        <div className="bg-white rounded-2xl p-4 mt-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 bg-[#5b0e5c] rounded-full flex items-center justify-center">
              <span className="text-white text-xl font-bold">
                {user.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h2 className="font-semibold text-zinc-900">{user.name}</h2>
              <p className="text-sm text-zinc-500">{user.email}</p>
              <p className="text-sm text-zinc-500">{user.phone}</p>
            </div>
          </div>
        </div>

        {/* Menu options */}
        <div className="bg-white rounded-2xl mt-4 shadow-sm overflow-hidden">
          <button className="w-full flex items-center justify-between p-4 hover:bg-zinc-50 transition-colors border-b border-zinc-100">
            <span className="text-zinc-700">Meus dados</span>
            <IoChevronForward className="text-zinc-400" />
          </button>
          <button className="w-full flex items-center justify-between p-4 hover:bg-zinc-50 transition-colors">
            <span className="text-zinc-700">Endereços</span>
            <IoChevronForward className="text-zinc-400" />
          </button>
        </div>

        {/* Orders */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-zinc-900 mb-3">
            Meus pedidos
          </h3>

          {ordersLoading ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="bg-white rounded-2xl p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="h-4 bg-zinc-100 rounded w-24 mb-1 animate-pulse" />
                      <div className="h-3 bg-zinc-100 rounded w-32 animate-pulse" />
                    </div>
                    <div className="h-6 bg-zinc-100 rounded-full w-20 animate-pulse" />
                  </div>
                  <div className="border-t border-zinc-100 pt-3 space-y-2">
                    <div className="h-4 bg-zinc-100 rounded w-3/4 animate-pulse" />
                    <div className="h-4 bg-zinc-100 rounded w-1/2 animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
              <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg
                  className="w-8 h-8 text-zinc-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <p className="text-zinc-500">Você ainda não fez pedidos</p>
              <button
                onClick={() => navigate("/")}
                className="mt-3 text-[#5b0e5c] font-medium text-sm"
              >
                Ver cardápio
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl p-4 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-sm text-zinc-500">
                        Pedido #{order.id.slice(-6)}
                      </p>
                      <p className="text-xs text-zinc-400">
                        {new Date(order.date).toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    <span
                      className={`text-xs font-medium px-2.5 py-1 rounded-full ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {getStatusText(order.status)}
                    </span>
                  </div>

                  <div className="border-t border-zinc-100 pt-3">
                    {order.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between text-sm mb-1"
                      >
                        <span className="text-zinc-600">
                          {item.quantity}x {item.title}
                        </span>
                        <span className="text-zinc-700 font-medium">
                          R${" "}
                          {(item.price * item.quantity)
                            .toFixed(2)
                            .replace(".", ",")}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-zinc-100 mt-3 pt-3 flex justify-between">
                    <span className="text-sm text-zinc-500">
                      {order.paymentMethod}
                    </span>
                    <span className="font-bold text-zinc-900">
                      R$ {order.total.toFixed(2).replace(".", ",")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
