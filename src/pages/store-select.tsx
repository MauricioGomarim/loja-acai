import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";
import type { Store } from "../lib/api";

export function StoreSelect() {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getStores()
      .then(setStores)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="bg-white min-h-screen">
        <div className="bg-[#5b0e5c] p-6 text-center">
          <div className="h-7 bg-white/20 rounded w-32 mx-auto mb-2 animate-pulse" />
          <div className="h-4 bg-white/15 rounded w-48 mx-auto animate-pulse" />
        </div>
        <div className="max-w-2xl mx-auto px-4 py-6 space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border-2 border-zinc-100 rounded-2xl p-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-zinc-100 animate-pulse" />
                <div className="flex-1">
                  <div className="h-5 bg-zinc-100 rounded w-32 mb-2 animate-pulse" />
                  <div className="h-3 bg-zinc-100 rounded w-48 mb-1 animate-pulse" />
                  <div className="h-3 bg-zinc-100 rounded w-24 animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="bg-[#5b0e5c] p-6 text-center">
        <h1 className="text-white text-2xl font-bold">Delivery</h1>
        <p className="text-white/80 mt-1">Escolha uma loja para pedir</p>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {stores.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-zinc-500">Nenhuma loja disponivel no momento</p>
          </div>
        ) : (
          <div className="space-y-3">
            {stores.map((store) => (
              <Link
                key={store.id}
                to={`/${store.slug}`}
                className="block border-2 border-zinc-200 rounded-2xl p-4 hover:border-[#5b0e5c] transition-colors no-underline"
              >
                <div className="flex items-center gap-4">
                  {store.logoUrl ? (
                    <img src={store.logoUrl} alt={store.name} className="w-16 h-16 rounded-xl object-cover" />
                  ) : (
                    <div
                      className="w-16 h-16 rounded-xl flex items-center justify-center text-white text-2xl font-bold"
                      style={{ backgroundColor: store.primaryColor }}
                    >
                      {store.name.charAt(0)}
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold text-zinc-900">{store.name}</h3>
                    {store.slogan && <p className="text-sm text-zinc-500">{store.slogan}</p>}
                    {store.city && <p className="text-xs text-zinc-400 mt-1">{store.city}</p>}
                  </div>
                  <span className="text-zinc-400">→</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
