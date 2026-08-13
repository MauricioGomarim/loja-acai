import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Trash2, Plus } from "lucide-react";

export function StoreCategories() {
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCategory, setNewCategory] = useState("");
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  useEffect(() => { fetchCategories(); }, []);

  async function fetchCategories() {
    try {
      const data = await api.getCategories();
      setCategories(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function handleAddCategory() {
    if (!newCategory.trim()) return;
    setCategories((prev) => [...prev, newCategory.trim()]);
    setNewCategory("");
  }

  function handleSaveEdit() {
    if (!editValue.trim() || !editingCategory) return;
    setCategories((prev) => prev.map((c) => (c === editingCategory ? editValue.trim() : c)));
    setEditingCategory(null);
    setEditValue("");
  }

  function handleDeleteCategory(category: string) {
    if (!confirm(`Remover a categoria "${category}"?`)) return;
    setCategories((prev) => prev.filter((c) => c !== category));
  }

  if (loading) {
    return <div className="space-y-3">{[1, 2, 3].map((i) => <div key={i} className="h-14 bg-zinc-100 rounded-xl animate-pulse" />)}</div>;
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-4">
          <h3 className="font-semibold text-zinc-900 mb-3">Nova Categoria</h3>
          <div className="flex gap-2">
            <Input value={newCategory} onChange={(e) => setNewCategory(e.target.value)} placeholder="Nome da categoria" onKeyDown={(e) => e.key === "Enter" && handleAddCategory()} />
            <Button onClick={handleAddCategory} className="bg-[#5b0e5c] hover:bg-[#4a0a4b]"><Plus className="h-4 w-4" /></Button>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-2">
        {categories.length === 0 ? (
          <p className="text-center text-zinc-500 py-8">Nenhuma categoria cadastrada</p>
        ) : (
          categories.map((category) => (
            <Card key={category}>
              <CardContent className="p-3 flex items-center justify-between">
                {editingCategory === category ? (
                  <div className="flex gap-2 w-full">
                    <Input value={editValue} onChange={(e) => setEditValue(e.target.value)} autoFocus className="flex-1" />
                    <Button size="sm" onClick={handleSaveEdit} className="bg-green-600 hover:bg-green-700">Salvar</Button>
                    <Button size="sm" variant="outline" onClick={() => setEditingCategory(null)}>Cancelar</Button>
                  </div>
                ) : (
                  <>
                    <span className="font-medium text-zinc-900">{category}</span>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => { setEditingCategory(category); setEditValue(category); }}><Pencil className="h-4 w-4 text-zinc-400" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteCategory(category)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
      <p className="text-xs text-zinc-500 text-center">As categorias são sincronizadas com os produtos do cardápio.</p>
    </div>
  );
}
