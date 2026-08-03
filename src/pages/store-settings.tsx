import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";
import type { Store } from "../lib/api";
import { IoArrowBack, IoCheckmark } from "react-icons/io5";

export function StoreSettings() {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();
  const adminBase = slug ? `/${slug}/admin` : "/admin";
  const { user } = useAuth();
  const [store, setStore] = useState<Store | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    name: "",
    slogan: "",
    description: "",
    phone: "",
    address: "",
    city: "",
    pix_key: "",
    pix_key_type: "cpf",
    primary_color: "#5b0e5c",
    secondary_color: "#077c22",
    accent_color: "#f1cdf2",
    commission_rate: 10,
  });

  useEffect(() => {
    if (!user?.store_id) {
      navigate(adminBase);
      return;
    }
    api.getStoreById(user.store_id)
      .then((s) => {
        setStore(s);
        setForm({
          name: s.name || "",
          slogan: s.slogan || "",
          description: s.description || "",
          phone: s.phone || "",
          address: s.address || "",
          city: s.city || "",
          pix_key: s.pixKey || "",
          pix_key_type: s.pixKeyType || "cpf",
          primary_color: s.primaryColor || "#5b0e5c",
          secondary_color: s.secondaryColor || "#077c22",
          accent_color: s.accentColor || "#f1cdf2",
          commission_rate: s.commissionRate || 10,
        });
      })
      .catch(() => navigate(adminBase))
      .finally(() => setLoading(false));
  }, [user, navigate]);

  async function handleSave() {
    if (!store) return;
    setSaving(true);
    try {
      await api.updateStore(store.id, form);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      alert("Erro ao salvar");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#5b0e5c] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <div className="bg-[#5b0e5c] p-4 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="text-white p-1">
          <IoArrowBack className="text-2xl" />
        </button>
        <h1 className="text-white font-semibold text-lg">Configurar Loja</h1>
      </div>

      <div className="max-w-md mx-auto p-4 space-y-4">
        {/* Preview */}
        <div
          className="rounded-2xl p-4 text-center"
          style={{ backgroundColor: form.primary_color }}
        >
          <h2 className="text-white font-bold text-lg">{form.name || "Nome da Loja"}</h2>
          {form.slogan && <p className="text-white/80 text-sm mt-1">{form.slogan}</p>}
          <div className="flex justify-center gap-2 mt-3">
            <span className="px-3 py-1 rounded-full text-xs text-white" style={{ backgroundColor: form.secondary_color }}>Secundaria</span>
            <span className="px-3 py-1 rounded-full text-xs text-zinc-800" style={{ backgroundColor: form.accent_color }}>Accent</span>
          </div>
        </div>

        {/* Dados */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <h3 className="font-semibold text-zinc-900 mb-3">Dados da Loja</h3>
          <label className="block text-xs text-zinc-500 mb-1">Nome</label>
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full border border-zinc-200 rounded-xl px-3 py-2.5 text-sm mb-3" />
          <label className="block text-xs text-zinc-500 mb-1">Slogan</label>
          <input value={form.slogan} onChange={(e) => setForm({ ...form, slogan: e.target.value })}
            className="w-full border border-zinc-200 rounded-xl px-3 py-2.5 text-sm mb-3" />
          <label className="block text-xs text-zinc-500 mb-1">Descricao</label>
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full border border-zinc-200 rounded-xl px-3 py-2.5 text-sm mb-3" rows={2} />
          <label className="block text-xs text-zinc-500 mb-1">Telefone</label>
          <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full border border-zinc-200 rounded-xl px-3 py-2.5 text-sm mb-3" />
          <label className="block text-xs text-zinc-500 mb-1">Endereco</label>
          <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })}
            className="w-full border border-zinc-200 rounded-xl px-3 py-2.5 text-sm mb-3" />
          <label className="block text-xs text-zinc-500 mb-1">Cidade</label>
          <input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })}
            className="w-full border border-zinc-200 rounded-xl px-3 py-2.5 text-sm mb-3" />
        </div>

        {/* PIX */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <h3 className="font-semibold text-zinc-900 mb-3">Chave PIX</h3>
          <label className="block text-xs text-zinc-500 mb-1">Tipo</label>
          <select value={form.pix_key_type} onChange={(e) => setForm({ ...form, pix_key_type: e.target.value })}
            className="w-full border border-zinc-200 rounded-xl px-3 py-2.5 text-sm mb-3">
            <option value="cpf">CPF</option>
            <option value="cnpj">CNPJ</option>
            <option value="email">Email</option>
            <option value="phone">Telefone</option>
            <option value="key">Chave Aleatoria</option>
          </select>
          <label className="block text-xs text-zinc-500 mb-1">Chave PIX</label>
          <input value={form.pix_key} onChange={(e) => setForm({ ...form, pix_key: e.target.value })}
            className="w-full border border-zinc-200 rounded-xl px-3 py-2.5 text-sm" />
        </div>

        {/* Cores */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <h3 className="font-semibold text-zinc-900 mb-3">Cores</h3>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs text-zinc-500 mb-1">Principal</label>
              <input type="color" value={form.primary_color} onChange={(e) => setForm({ ...form, primary_color: e.target.value })}
                className="w-full h-10 rounded-xl border border-zinc-200 cursor-pointer" />
            </div>
            <div>
              <label className="block text-xs text-zinc-500 mb-1">Secundaria</label>
              <input type="color" value={form.secondary_color} onChange={(e) => setForm({ ...form, secondary_color: e.target.value })}
                className="w-full h-10 rounded-xl border border-zinc-200 cursor-pointer" />
            </div>
            <div>
              <label className="block text-xs text-zinc-500 mb-1">Accent</label>
              <input type="color" value={form.accent_color} onChange={(e) => setForm({ ...form, accent_color: e.target.value })}
                className="w-full h-10 rounded-xl border border-zinc-200 cursor-pointer" />
            </div>
          </div>
        </div>

        {/* Salvar */}
        <button
          onClick={handleSave}
          disabled={saving}
          className={`w-full py-3 rounded-xl font-medium text-white flex items-center justify-center gap-2 ${
            saved ? "bg-[#077c22]" : "bg-[#5b0e5c]"
          }`}
        >
          {saved ? <><IoCheckmark className="text-xl" /> Salvo!</> : saving ? "Salvando..." : "Salvar Alteracoes"}
        </button>
      </div>
    </div>
  );
}
