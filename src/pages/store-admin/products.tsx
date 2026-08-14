import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import type { Product, ProductDetail, CreateProductData } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, ChevronDown } from "lucide-react";

export function StoreProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductDetail | null>(null);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const [form, setForm] = useState<CreateProductData>({
    title: "", subtitle: "", oldPrice: 0, newPrice: 0,
    image: "", category: "", badge: "", description: "", extras: "",
  });
  const [newCategory, setNewCategory] = useState("");
  const [showCategoryInput, setShowCategoryInput] = useState(false);

  useEffect(() => { fetchData(); }, []);

  async function fetchData() {
    try {
      const [p, c] = await Promise.all([api.getProducts(), api.getCategories()]);
      setProducts(p);
      setCategories(c);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setForm({ title: "", subtitle: "", oldPrice: 0, newPrice: 0, image: "", category: "", badge: "", description: "", extras: "" });
    setEditingProduct(null);
    setShowForm(false);
    setNewCategory("");
    setShowCategoryInput(false);
  }

  function handleEdit(product: Product) {
    setEditingProduct(product as ProductDetail);
    setForm({
      title: product.title, subtitle: product.subtitle, oldPrice: product.oldPrice,
      newPrice: product.newPrice, image: product.image, category: product.category,
      badge: product.badge || "", description: product.description || "", extras: product.extras || "",
    });
    setShowForm(true);
  }

  async function handleDelete(id: string) {
    if (!confirm("Tem certeza que deseja remover este produto?")) return;
    try {
      await api.deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch {
      alert("Erro ao remover produto");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title || !form.newPrice || !form.category) {
      alert("Preencha título, preço e categoria");
      return;
    }
    try {
      if (editingProduct) {
        const updated = await api.updateProduct(editingProduct.id, form);
        setProducts((prev) => prev.map((p) => (p.id === editingProduct.id ? { ...p, ...updated } : p)));
      } else {
        const created = await api.createProduct(form);
        setProducts((prev) => [...prev, created]);
        if (!categories.includes(form.category)) setCategories((prev) => [...prev, form.category]);
      }
      resetForm();
      await fetchData();
    } catch {
      alert("Erro ao salvar produto");
    }
  }

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => <div key={i} className="h-20 bg-zinc-100 rounded-xl animate-pulse" />)}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Button className="w-full bg-[#5b0e5c] hover:bg-[#4a0a4b]" onClick={() => { resetForm(); setShowForm(true); }}>
        <Plus className="h-4 w-4 mr-2" /> Adicionar Produto
      </Button>

      <Dialog open={showForm} onOpenChange={setOpen => { if (!setOpen) resetForm(); }}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingProduct ? "Editar Produto" : "Novo Produto"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div><Label>Título *</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /></div>
            <div><Label>Subtítulo</Label><Input value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Preço Antigo</Label><Input type="number" step="0.01" value={form.oldPrice} onChange={(e) => setForm({ ...form, oldPrice: parseFloat(e.target.value) || 0 })} /></div>
              <div><Label>Preço Atual *</Label><Input type="number" step="0.01" value={form.newPrice} onChange={(e) => setForm({ ...form, newPrice: parseFloat(e.target.value) || 0 })} required /></div>
            </div>
            <div><Label>URL da Imagem</Label><Input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="/img/copo2.webp" /></div>
            <div>
              <Label>Categoria *</Label>
              <div className="flex flex-wrap gap-2 mb-2 mt-1">
                {categories.map((cat) => (
                  <Badge key={cat} variant={form.category === cat ? "default" : "outline"} className="cursor-pointer" onClick={() => setForm({ ...form, category: cat })}>{cat}</Badge>
                ))}
                <Badge variant="outline" className="cursor-pointer text-green-600" onClick={() => setShowCategoryInput(!showCategoryInput)}>+ Nova</Badge>
              </div>
              {showCategoryInput && (
                <div className="flex gap-2">
                  <Input value={newCategory} onChange={(e) => setNewCategory(e.target.value)} placeholder="Nova categoria" />
                  <Button type="button" variant="outline" onClick={() => { if (newCategory.trim()) { setCategories((p) => [...p, newCategory.trim()]); setForm({ ...form, category: newCategory.trim() }); setNewCategory(""); setShowCategoryInput(false); } }}>Add</Button>
                </div>
              )}
            </div>
            <div><Label>Badge</Label><Input value={form.badge} onChange={(e) => setForm({ ...form, badge: e.target.value })} placeholder="MAIS VENDIDO" /></div>
            <div><Label>Descrição</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} /></div>
            <div><Label>Complementos</Label><Input value={form.extras} onChange={(e) => setForm({ ...form, extras: e.target.value })} placeholder="Granola, Banana" /></div>
            <div className="flex gap-2 pt-2">
              <Button type="submit" className="flex-1 bg-[#5b0e5c] hover:bg-[#4a0a4b]">{editingProduct ? "Salvar" : "Criar"}</Button>
              <Button type="button" variant="outline" className="flex-1" onClick={resetForm}>Cancelar</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {categories.map((category) => {
        const categoryProducts = products.filter((p) => p.category === category);
        const isExpanded = expandedCategory === category;
        return (
          <div key={category}>
            <button onClick={() => setExpandedCategory(isExpanded ? null : category)} className="w-full bg-white border rounded-xl p-4 flex items-center justify-between hover:bg-zinc-50 transition-colors">
              <div className="flex items-center gap-3">
                <span className="font-semibold text-zinc-900">{category}</span>
                <Badge variant="secondary">{categoryProducts.length}</Badge>
              </div>
              <ChevronDown className={`h-4 w-4 text-zinc-400 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
            </button>
            {isExpanded && (
              <div className="border border-t-0 rounded-b-xl p-4 space-y-3">
                {categoryProducts.length === 0 ? (
                  <p className="text-sm text-zinc-500 text-center py-4">Nenhum produto</p>
                ) : (
                  categoryProducts.map((product) => (
                    <div key={product.id} className="flex items-center gap-3 p-3 bg-zinc-50 rounded-lg">
                      <img src={product.image} alt={product.title} className="w-14 h-14 object-cover rounded-lg" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-zinc-900 text-sm truncate">{product.title}</h4>
                        <p className="text-xs text-zinc-500 truncate">{product.subtitle}</p>
                        <div className="flex items-center gap-2 mt-1">
                          {product.oldPrice > product.newPrice && <span className="text-xs text-zinc-400 line-through">R$ {product.oldPrice.toFixed(2).replace(".", ",")}</span>}
                          <span className="text-sm font-semibold text-green-600">R$ {product.newPrice.toFixed(2).replace(".", ",")}</span>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(product)}><Pencil className="h-4 w-4 text-zinc-500" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(product.id)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        );
      })}

      {categories.length === 0 && (
        <p className="text-center text-zinc-500 py-8">Nenhuma categoria encontrada</p>
      )}
    </div>
  );
}
