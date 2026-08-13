import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useStore } from "../context/StoreContext";
import { IoArrowBack, IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";

export function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const storeId = (location.state as any)?.storeId;
  const { user, loading, login, register } = useAuth();
  const { currentStore } = useStore();

  // Redirect already-logged-in users
  useEffect(() => {
    if (loading || !user) return;

    if (user.role === "platform_owner") {
      navigate("/platform", { replace: true });
    } else if (user.isAdmin || user.role === "store_owner" || user.role === "store_admin") {
      // Store admin/owner — need slug from store_id
      if (currentStore?.slug) {
        navigate(`/${currentStore.slug}/admin`, { replace: true });
      } else if (user.store_id) {
        import("../lib/api").then(({ api }) =>
          api.getStoreById(user.store_id!).then((store) => {
            if (store?.slug) navigate(`/${store.slug}/admin`, { replace: true });
            else navigate("/", { replace: true });
          }).catch(() => navigate("/", { replace: true }))
        );
      } else {
        navigate("/", { replace: true });
      }
    } else if (currentStore?.slug) {
      navigate(`/${currentStore.slug}`, { replace: true });
    } else {
      navigate("/", { replace: true });
    }
  }, [user, loading, currentStore, navigate]);
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (isLogin) {
      if (!form.email.trim() || !form.password) {
        setError("Preencha email e senha");
        return;
      }
      const success = await login(form.email.trim(), form.password);
      if (!success) {
        setError("Email ou senha incorretos");
      }
    } else {
      if (!form.name.trim() || !form.email.trim() || !form.phone.trim() || !form.password) {
        setError("Preencha todos os campos");
        return;
      }
      const success = await register(form.name.trim(), form.email.trim(), form.phone.trim(), form.password, storeId);
      if (!success) {
        setError("Este email já está cadastrado");
      }
    }
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      {/* Header */}
      <div className="bg-[#5b0e5c] p-4 flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="text-white p-1"
        >
          <IoArrowBack className="text-2xl" />
        </button>
        <h1 className="text-white font-semibold text-lg">
          {isLogin ? "Entrar" : "Criar conta"}
        </h1>
      </div>

      <div className="max-w-md mx-auto p-6">
        {/* Logo */}
        <div className="text-center mb-8">
          <img
            src="/img/logo.png"
            alt="Logo"
            className="w-20 h-20 mx-auto rounded-full border-4 border-[#5b0e5c] shadow-lg"
          />
          <h2 className="text-[#5b0e5c] text-xl font-bold mt-3">
            Açaí Delli Delivery
          </h2>
        </div>

        {/* Tabs */}
        <div className="flex bg-white rounded-xl p-1 mb-6 shadow-sm">
          <button
            onClick={() => {
              setIsLogin(true);
              setError("");
            }}
            className={`flex-1 py-2.5 rounded-lg font-medium transition-colors ${
              isLogin
                ? "bg-[#5b0e5c] text-white"
                : "text-zinc-500 hover:text-zinc-700"
            }`}
          >
            Entrar
          </button>
          <button
            onClick={() => {
              setIsLogin(false);
              setError("");
            }}
            className={`flex-1 py-2.5 rounded-lg font-medium transition-colors ${
              !isLogin
                ? "bg-[#5b0e5c] text-white"
                : "text-zinc-500 hover:text-zinc-700"
            }`}
          >
            Criar conta
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                Nome completo
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Seu nome"
                className="w-full border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#5b0e5c] transition-colors"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1.5">
              Email
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="seu@email.com"
              className="w-full border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#5b0e5c] transition-colors"
            />
          </div>

          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                WhatsApp
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="(14) 99999-9999"
                className="w-full border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#5b0e5c] transition-colors"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1.5">
              Senha
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
                placeholder="Sua senha"
                className="w-full border border-zinc-200 rounded-xl px-4 py-3 pr-12 text-sm focus:outline-none focus:border-[#5b0e5c] transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
              >
                {showPassword ? (
                  <IoEyeOffOutline className="text-xl" />
                ) : (
                  <IoEyeOutline className="text-xl" />
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-xl">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-[#5b0e5c] hover:bg-[#4a0b4b] text-white font-semibold py-3.5 rounded-xl transition-colors"
          >
            {isLogin ? "Entrar" : "Criar conta"}
          </button>
        </form>

        {/* Admin hint */}
        {isLogin && (
          <div className="mt-6 p-4 bg-zinc-100 rounded-xl">
            <p className="text-xs text-zinc-500 text-center">
              <strong>Admin:</strong> admin@acai.com / admin123
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
