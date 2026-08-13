import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import type { Store, User } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Store as StoreIcon, UserIcon } from "lucide-react";

export function PlatformOwners() {
  const [stores, setStores] = useState<Store[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [storesData, usersData] = await Promise.allSettled([
        api.getStores(),
        api.getAllUsers(),
      ]);
      if (storesData.status === "fulfilled") setStores(storesData.value);
      if (usersData.status === "fulfilled") setUsers(usersData.value);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleAssignOwner(userId: string, storeId: string) {
    if (!userId) return;
    await api.updateUserRole(userId, { role: "store_owner", store_id: storeId });
    const u = await api.getAllUsers();
    setUsers(u);
  }

  async function handleRemoveOwner(ownerId: string, storeName: string, ownerName: string) {
    if (!confirm(`Remover ${ownerName} como dono de ${storeName}?`)) return;
    await api.updateUserRole(ownerId, { role: "customer", store_id: null });
    const u = await api.getAllUsers();
    setUsers(u);
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
      <p className="text-sm text-zinc-500">
        Atribua donos às lojas. O usuário precisará fazer login novamente para a role ter efeito.
      </p>
      <div className="space-y-3">
        {stores.map((store) => {
          const owner = users.find((u) => u.store_id === store.id && u.role === "store_owner");
          return (
            <Card key={store.id}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
                    style={{ backgroundColor: store.primaryColor }}
                  >
                    <StoreIcon className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-zinc-900 text-sm">{store.name}</h3>
                    <p className="text-xs text-zinc-500">/{store.slug}</p>
                  </div>
                </div>
                {owner ? (
                  <div className="flex items-center justify-between bg-green-50 rounded-lg px-3 py-2">
                    <div className="flex items-center gap-2">
                      <UserIcon className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-green-800 font-medium">{owner.name}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleRemoveOwner(owner.id, store.name, owner.name)}
                    >
                      Remover
                    </Button>
                  </div>
                ) : (
                  <Select onValueChange={(v) => handleAssignOwner(v, store.id)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecionar dono..." />
                    </SelectTrigger>
                    <SelectContent>
                      {users
                        .filter((u) => !u.store_id || (u.role === "store_owner" && u.store_id === store.id))
                        .map((u) => (
                          <SelectItem key={u.id} value={u.id}>
                            {u.name} ({u.email})
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
