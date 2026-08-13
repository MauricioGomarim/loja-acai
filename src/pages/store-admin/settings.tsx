import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import type { Store } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Check } from "lucide-react";

export function StoreSettings() {
  const { user } = useAuth();
  const [store, setStore] = useState<Store | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    name: "", slogan: "", description: "", phone: "", address: "", city: "",
    pix_key: "", pix_key_type: "cpf",
    primary_color: "#5b0e5c", secondary_color: "#077c22", accent_color: "#f1cdf2",
    commission_rate: 10,
    mp_access_token: "", mp_public_key: "", mp_webhook_secret: "", payment_provider: "appmax",
  });

  useEffect(() => {
    if (!user?.store_id) { setLoading(false); return; }
    api.getStoreById(user.store_id)
      .then((s) => {
        setStore(s);
        setForm({
          name: s.name || "", slogan: s.slogan || "", description: s.description || "",
          phone: s.phone || "", address: s.address || "", city: s.city || "",
          pix_key: s.pixKey || "", pix_key_type: s.pixKeyType || "cpf",
          primary_color: s.primaryColor || "#5b0e5c", secondary_color: s.secondaryColor || "#077c22",
          accent_color: s.accentColor || "#f1cdf2", commission_rate: s.commissionRate || 10,
          mp_access_token: "", mp_public_key: s.mpPublicKey || "", mp_webhook_secret: "",
          payment_provider: s.paymentProvider || "appmax",
        });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

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
    return <div className="space-y-3">{[1, 2, 3].map((i) => <div key={i} className="h-32 bg-zinc-100 rounded-xl animate-pulse" />)}</div>;
  }

  return (
    <div className="space-y-4">
      {/* Preview */}
      <div className="rounded-xl p-4 text-center" style={{ backgroundColor: form.primary_color }}>
        <h2 className="text-white font-bold text-lg">{form.name || "Nome da Loja"}</h2>
        {form.slogan && <p className="text-white/80 text-sm mt-1">{form.slogan}</p>}
        <div className="flex justify-center gap-2 mt-3">
          <span className="px-3 py-1 rounded-full text-xs text-white" style={{ backgroundColor: form.secondary_color }}>Secundária</span>
          <span className="px-3 py-1 rounded-full text-xs text-zinc-800" style={{ backgroundColor: form.accent_color }}>Accent</span>
        </div>
      </div>

      {/* Dados */}
      <Card>
        <CardContent className="p-4 space-y-3">
          <h3 className="font-semibold text-zinc-900">Dados da Loja</h3>
          <div><Label>Nome</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
          <div><Label>Slogan</Label><Input value={form.slogan} onChange={(e) => setForm({ ...form, slogan: e.target.value })} /></div>
          <div><Label>Descrição</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} /></div>
          <div><Label>Telefone</Label><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
          <div><Label>Endereço</Label><Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></div>
          <div><Label>Cidade</Label><Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} /></div>
        </CardContent>
      </Card>

      {/* PIX */}
      <Card>
        <CardContent className="p-4 space-y-3">
          <h3 className="font-semibold text-zinc-900">Chave PIX</h3>
          <div>
            <Label>Tipo</Label>
            <Select value={form.pix_key_type} onValueChange={(v) => setForm({ ...form, pix_key_type: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="cpf">CPF</SelectItem>
                <SelectItem value="cnpj">CNPJ</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="phone">Telefone</SelectItem>
                <SelectItem value="key">Chave Aleatória</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div><Label>Chave PIX</Label><Input value={form.pix_key} onChange={(e) => setForm({ ...form, pix_key: e.target.value })} /></div>
        </CardContent>
      </Card>

      {/* Mercado Pago */}
      <Card>
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-zinc-900">Mercado Pago</h3>
            {store?.mpAccessTokenSet && (
              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Configurado</span>
            )}
          </div>
          <p className="text-xs text-zinc-500">Configure suas credenciais do Mercado Pago para receber pagamentos via PIX.</p>
          <div>
            <Label>Access Token</Label>
            <Input
              type="password"
              value={form.mp_access_token}
              onChange={(e) => setForm({ ...form, mp_access_token: e.target.value })}
              placeholder={store?.mpAccessTokenSet ? "•••••••••••• (já salvo)" : "APP_USR-..."}
            />
            <p className="text-xs text-zinc-400 mt-1">Produção: APP_USR-... | Teste: TEST-...</p>
          </div>
          <div>
            <Label>Public Key</Label>
            <Input
              value={form.mp_public_key}
              onChange={(e) => setForm({ ...form, mp_public_key: e.target.value })}
              placeholder="APP_USR-..."
            />
          </div>
          <div>
            <Label>Webhook Secret (opcional)</Label>
            <Input
              type="password"
              value={form.mp_webhook_secret}
              onChange={(e) => setForm({ ...form, mp_webhook_secret: e.target.value })}
              placeholder="Para validar notificações IPN"
            />
          </div>
        </CardContent>
      </Card>

      {/* Cores */}
      <Card>
        <CardContent className="p-4">
          <h3 className="font-semibold text-zinc-900 mb-3">Cores</h3>
          <div className="grid grid-cols-3 gap-3">
            <div><Label>Principal</Label><input type="color" value={form.primary_color} onChange={(e) => setForm({ ...form, primary_color: e.target.value })} className="w-full h-10 rounded-lg border cursor-pointer" /></div>
            <div><Label>Secundária</Label><input type="color" value={form.secondary_color} onChange={(e) => setForm({ ...form, secondary_color: e.target.value })} className="w-full h-10 rounded-lg border cursor-pointer" /></div>
            <div><Label>Accent</Label><input type="color" value={form.accent_color} onChange={(e) => setForm({ ...form, accent_color: e.target.value })} className="w-full h-10 rounded-lg border cursor-pointer" /></div>
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSave} disabled={saving} className={`w-full ${saved ? "bg-green-600" : "bg-[#5b0e5c] hover:bg-[#4a0a4b]"}`}>
        {saved ? <><Check className="h-4 w-4 mr-2" /> Salvo!</> : saving ? "Salvando..." : "Salvar Alterações"}
      </Button>
    </div>
  );
}
