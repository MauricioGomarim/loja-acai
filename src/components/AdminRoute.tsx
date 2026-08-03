import { useState, useEffect } from "react";
import { Navigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";

interface AdminRouteProps {
  children: React.ReactNode;
}

export function AdminRoute({ children }: AdminRouteProps) {
  const { loading, user, isPlatformOwner } = useAuth();
  const { slug } = useParams<{ slug: string }>();
  const [storeValid, setStoreValid] = useState<boolean | null>(null);

  useEffect(() => {
    if (loading || !user) return;

    // Platform owner can access any admin
    if (isPlatformOwner || user.isAdmin) {
      setStoreValid(true);
      return;
    }

    // No slug = generic /admin route, allow it
    if (!slug) {
      setStoreValid(true);
      return;
    }

    // Store owner: check if the slug matches their store
    api.getStoreBySlug(slug)
      .then(store => {
        setStoreValid(store.id === user.store_id);
      })
      .catch(() => setStoreValid(false));
  }, [loading, user, isPlatformOwner, slug]);

  if (loading || storeValid === null) {
    return (
      <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#5b0e5c] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!storeValid) {
    return (
      <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl p-8 shadow-sm text-center max-w-sm">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🚫</span>
          </div>
          <h2 className="text-xl font-bold text-zinc-900 mb-2">Acesso Negado</h2>
          <p className="text-zinc-500 text-sm mb-6">
            Voce nao tem permissao para acessar o painel desta loja.
          </p>
          <button
            onClick={() => window.history.back()}
            className="w-full bg-[#5b0e5c] text-white py-3 rounded-xl font-medium"
          >
            Voltar
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
