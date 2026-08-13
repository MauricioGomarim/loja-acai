import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import type { Store } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Store as StoreIcon, Plus } from "lucide-react";

export function PlatformStores() {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [newStore, setNewStore] = useState({ name: "", slug: "", city: "", phone: "" });

  useEffect(() => {
    loadStores();
  }, []);

  async function loadStores() {
    try {
      const data = await api.getStores();
      setStores(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateStore() {
    if (!newStore.name || !newStore.slug) return;
    try {
      await api.createStore(newStore);
      setOpen(false);
      setNewStore({ name: "", slug: "", city: "", phone: "" });
      loadStores();
    } catch {
      alert("Erro ao criar loja");
    }
  }

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
        <div>
          <p className="text-sm text-zinc-500">{stores.length} lojas cadastradas</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#5b0e5c] hover:bg-[#4a0a4b]">
              <Plus className="h-4 w-4 mr-2" />
              Nova Loja
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar Loja</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label>Nome da loja</Label>
                <Input
                  value={newStore.name}
                  onChange={(e) => setNewStore({ ...newStore, name: e.target.value })}
                  placeholder="Minha Loja"
                />
              </div>
              <div>
                <Label>Slug</Label>
                <Input
                  value={newStore.slug}
                  onChange={(e) => setNewStore({ ...newStore, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") })}
                  placeholder="minha-loja"
                />
              </div>
              <div>
                <Label>Cidade</Label>
                <Input
                  value={newStore.city}
                  onChange={(e) => setNewStore({ ...newStore, city: e.target.value })}
                  placeholder="São Paulo"
                />
              </div>
              <div>
                <Label>Telefone</Label>
                <Input
                  value={newStore.phone}
                  onChange={(e) => setNewStore({ ...newStore, phone: e.target.value })}
                  placeholder="(11) 99999-9999"
                />
              </div>
              <Button onClick={handleCreateStore} className="w-full bg-[#5b0e5c] hover:bg-[#4a0a4b]">
                Criar Loja
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3">
        {stores.map((store) => (
          <Card key={store.id}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white"
                  style={{ backgroundColor: store.primaryColor }}
                >
                  <StoreIcon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-zinc-900">{store.name}</h3>
                  <p className="text-xs text-zinc-500">/{store.slug} | {store.city || "Sem cidade"}</p>
                </div>
                <Badge variant="secondary">{store.commissionRate}%</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
