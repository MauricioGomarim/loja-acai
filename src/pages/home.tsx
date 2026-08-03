import { Header } from "../components/header";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { useStore } from "../context/StoreContext";
import type { Product } from "../lib/api";

export function Home() {
  const { slug } = useParams<{ slug: string }>();
  const { currentStore, loadStoreBySlug, storeLoading } = useStore();
  const [timeLeft, setTimeLeft] = useState<number>(40 * 60);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      loadStoreBySlug(slug);
    }
  }, [slug, loadStoreBySlug]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!currentStore) return;
    async function fetchProducts() {
      try {
        const data = await api.getProducts(currentStore!.id);
        setProducts(data);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [currentStore]);

  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const seconds = String(timeLeft % 60).padStart(2, "0");

  const categories = [...new Set(products.map((p) => p.category))];

  function getProductsByCategory(category: string) {
    return products.filter((p) => p.category === category);
  }

  if (storeLoading || loading) {
    return (
      <div className="bg-white min-h-screen">
        <Header />
        <div className="max-w-6xl mx-auto px-4 py-8 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-[#5b0e5c] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-zinc-500">Carregando cardapio...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!currentStore) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-zinc-500 mb-4">Loja nao encontrada</p>
          <Link to="/" className="text-[#5b0e5c] underline">Voltar para lojas</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <Header />

      {/* Promo Timer - only show on first category */}
      {categories.length > 0 && (
        <div className="max-w-6xl mx-auto px-4 mb-4 mt-2">
          <div className="rounded-2xl overflow-hidden shadow-sm border border-zinc-100 relative">
            <div
              className="h-12 flex items-center justify-between px-4 text-white font-medium relative z-10"
              style={{ backgroundColor: currentStore.primaryColor }}
            >
              <div className="flex items-center gap-2 text-sm">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                </span>
                {categories[0]}
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-normal opacity-90">Encerra em:</span>
                <div className="flex gap-1">
                  <span className="bg-white/20 px-1.5 py-0.5 rounded text-xs font-mono">
                    {minutes[0]}
                  </span>
                  <span className="bg-white/20 px-1.5 py-0.5 rounded text-xs font-mono">
                    {minutes[1]}
                  </span>
                  <span className="text-xs font-mono">:</span>
                  <span className="bg-white/20 px-1.5 py-0.5 rounded text-xs font-mono">
                    {seconds[0]}
                  </span>
                  <span className="bg-white/20 px-1.5 py-0.5 rounded text-xs font-mono">
                    {seconds[1]}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delivery Info */}
      <div className="max-w-6xl mx-auto px-4 mb-4">
        <p className="text-center text-zinc-500 text-sm">
          Entrega Gratis • {currentStore.city || "Entrega"}
        </p>
      </div>

      {/* Products by Category */}
      <div className="max-w-6xl mx-auto px-4 pb-8">
        {categories.map((category) => (
          <div key={category} className="mb-8">
            <h2
              className="text-lg font-bold text-zinc-900 mb-4"
              id={`cat-${category.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
            >
              {category}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {getProductsByCategory(category).map((product) => (
                <Link
                  key={product.id}
                  to={`/${currentStore.slug}/product/${product.id}`}
                  className="bg-white border border-zinc-200 rounded-2xl overflow-hidden hover:shadow-md transition-shadow no-underline"
                >
                  <div className="relative">
                    {product.badge && (
                      <div
                        className="absolute top-2 left-2 text-white text-xs px-2 py-0.5 rounded-full z-10"
                        style={{ backgroundColor: currentStore.secondaryColor }}
                      >
                        {product.badge}
                      </div>
                    )}
                    <img
                      src={product.image || "/img/copo2.webp"}
                      alt={product.title}
                      className="w-full h-32 object-cover"
                    />
                  </div>
                  <div className="p-3">
                    <h3 className="font-semibold text-zinc-900 text-sm leading-tight">
                      {product.title}
                    </h3>
                    <p className="text-xs text-zinc-500 mt-1">{product.subtitle}</p>
                    <div className="flex items-center gap-2 mt-2">
                      {product.oldPrice > product.newPrice && (
                        <span className="text-xs text-zinc-400 line-through">
                          R$ {product.oldPrice.toFixed(2)}
                        </span>
                      )}
                      <span
                        className="text-sm font-bold"
                        style={{ color: currentStore.primaryColor }}
                      >
                        R$ {product.newPrice.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
