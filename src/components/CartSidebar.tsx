import { useCart } from "../context/CartContext";
import { useStore } from "../context/StoreContext";
import { IoClose, IoAdd, IoRemove, IoTrashOutline } from "react-icons/io5";
import { useNavigate, useLocation } from "react-router-dom";

export function CartSidebar() {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
  } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const { currentStore } = useStore();
  // Extract slug from URL path (e.g. "/acaidelli/product/123" -> "acaidelli")
  const pathSlug = location.pathname.split("/").filter(Boolean)[0] || "";
  const storeSlug = pathSlug || currentStore?.slug || "";

  if (!isCartOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-100">
          <div>
            <h2 className="text-lg font-bold text-zinc-900">Seu carrinho</h2>
            <p className="text-sm text-zinc-500">
              {totalItems} {totalItems === 1 ? "item" : "itens"}
            </p>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-2 hover:bg-zinc-100 rounded-full transition-colors"
          >
            <IoClose className="text-xl text-zinc-500" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-20 h-20 bg-zinc-100 rounded-full flex items-center justify-center mb-4">
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
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
              </div>
              <p className="text-zinc-500 font-medium">
                Seu carrinho está vazio
              </p>
              <p className="text-sm text-zinc-400 mt-1">
                Adicione itens para começar
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-zinc-50 rounded-xl p-3 flex gap-3"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-zinc-900 text-sm truncate">
                      {item.title}
                    </h3>
                    <p className="text-xs text-zinc-500 truncate">
                      {item.subtitle}
                    </p>
                    {item.ingredients.length > 0 && (
                      <p className="text-xs text-zinc-400 mt-1 truncate">
                        {item.ingredients.map((i) => i.name).join(", ")}
                      </p>
                    )}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2 border border-zinc-200 rounded-full">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="p-1 hover:bg-zinc-100 rounded-full transition-colors"
                        >
                          <IoRemove className="text-sm text-zinc-500" />
                        </button>
                        <span className="text-sm font-medium text-zinc-700 w-6 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="p-1 hover:bg-zinc-100 rounded-full transition-colors"
                        >
                          <IoAdd className="text-sm text-zinc-500" />
                        </button>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-zinc-900">
                          R${" "}
                          {(item.price * item.quantity)
                            .toFixed(2)
                            .replace(".", ",")}
                        </span>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="p-1 hover:bg-red-50 rounded-full transition-colors"
                        >
                          <IoTrashOutline className="text-sm text-red-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-zinc-100 p-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-zinc-500">Subtotal</span>
              <span className="text-lg font-bold text-zinc-900">
                R$ {totalPrice.toFixed(2).replace(".", ",")}
              </span>
            </div>
            <button
              onClick={() => {
                setIsCartOpen(false);
                navigate(`/${storeSlug}/checkout`);
              }}
              className="w-full bg-[#5b0e5c] hover:bg-[#4a0b4b] text-white font-semibold py-3.5 rounded-full transition-colors"
            >
              Finalizar compra
            </button>
            <button
              onClick={clearCart}
              className="w-full mt-2 text-zinc-500 hover:text-zinc-700 font-medium py-2 transition-colors text-sm"
            >
              Limpar carrinho
            </button>
          </div>
        )}
      </div>
    </>
  );
}
