import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";
import type { Product, ProductDetail, CreateProductData } from "../lib/api";
import {
  IoArrowBack,
  IoAdd,
  IoCreateOutline,
  IoTrashOutline,
  IoChevronDown,
} from "react-icons/io5";

export function AdminProducts() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductDetail | null>(null);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  // Form state
  const [form, setForm] = useState<CreateProductData>({
    title: "",
    subtitle: "",
    oldPrice: 0,
    newPrice: 0,
    image: "",
    category: "",
    badge: "",
    description: "",
    extras: "",
  });
  const [newCategory, setNewCategory] = useState("");
  const [showCategoryInput, setShowCategoryInput] = useState(false);

  useEffect(() => {
    if (!user || !["platform_owner", "store_owner", "store_admin"].includes(user.role)) {
      navigate("/");
      return;
    }
    fetchData();
  }, [user, navigate]);

  async function fetchData() {
    try {
      const [productsData, categoriesData] = await Promise.all([
        api.getProducts(),
        api.getCategories(),
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setForm({
      title: "",
      subtitle: "",
      oldPrice: 0,
      newPrice: 0,
      image: "",
      category: "",
      badge: "",
      description: "",
      extras: "",
    });
    setEditingProduct(null);
    setShowForm(false);
    setNewCategory("");
    setShowCategoryInput(false);
  }

  function handleEdit(product: Product) {
    setEditingProduct(product as ProductDetail);
    setForm({
      title: product.title,
      subtitle: product.subtitle,
      oldPrice: product.oldPrice,
      newPrice: product.newPrice,
      image: product.image,
      category: product.category,
      badge: product.badge || "",
      description: product.description || "",
      extras: product.extras || "",
    });
    setShowForm(true);
  }

  async function handleDelete(id: string) {
    if (!confirm("Tem certeza que deseja remover este produto?")) return;

    try {
      await api.deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Error deleting product:", err);
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
        setProducts((prev) =>
          prev.map((p) => (p.id === editingProduct.id ? { ...p, ...updated } : p))
        );
      } else {
        const created = await api.createProduct(form);
        setProducts((prev) => [...prev, created]);
        // Add category if new
        if (!categories.includes(form.category)) {
          setCategories((prev) => [...prev, form.category]);
        }
      }
      resetForm();
      await fetchData(); // Refresh to get full data
    } catch (err) {
      console.error("Error saving product:", err);
      alert("Erro ao salvar produto");
    }
  }

  function handleCategorySelect(category: string) {
    setForm((prev) => ({ ...prev, category }));
  }

  function handleAddNewCategory() {
    if (newCategory.trim()) {
      setCategories((prev) => [...prev, newCategory.trim()]);
      setForm((prev) => ({ ...prev, category: newCategory.trim() }));
      setNewCategory("");
      setShowCategoryInput(false);
    }
  }

  function getProductsByCategory(category: string) {
    return products.filter((p) => p.category === category);
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
      {/* Header */}
      <div className="bg-[#5b0e5c] p-4 flex items-center gap-3">
        <button onClick={() => navigate("/admin")} className="text-white p-1">
          <IoArrowBack className="text-2xl" />
        </button>
        <h1 className="text-white font-semibold text-lg">Gerenciar Cardápio</h1>
      </div>

      <div className="max-w-md mx-auto p-4">
        {/* Add Product Button */}
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="w-full bg-[#5b0e5c] text-white py-3 rounded-2xl font-semibold flex items-center justify-center gap-2 mb-4"
        >
          <IoAdd className="text-xl" />
          Adicionar Produto
        </button>

        {/* Product Form */}
        {showForm && (
          <div className="bg-white rounded-2xl p-4 mb-4 shadow-sm">
            <h3 className="font-semibold text-zinc-900 mb-4">
              {editingProduct ? "Editar Produto" : "Novo Produto"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-sm text-zinc-600 mb-1">
                  Título *
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                  className="w-full border border-zinc-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#5b0e5c]"
                  placeholder="Ex: Açaí 500ml"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-zinc-600 mb-1">
                  Subtítulo
                </label>
                <input
                  type="text"
                  value={form.subtitle}
                  onChange={(e) => setForm((prev) => ({ ...prev, subtitle: e.target.value }))}
                  className="w-full border border-zinc-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#5b0e5c]"
                  placeholder="Ex: Acompanha granola e banana"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-zinc-600 mb-1">
                    Preço Antigo
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={form.oldPrice}
                    onChange={(e) => setForm((prev) => ({ ...prev, oldPrice: parseFloat(e.target.value) || 0 }))}
                    className="w-full border border-zinc-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#5b0e5c]"
                  />
                </div>
                <div>
                  <label className="block text-sm text-zinc-600 mb-1">
                    Preço Atual *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={form.newPrice}
                    onChange={(e) => setForm((prev) => ({ ...prev, newPrice: parseFloat(e.target.value) || 0 }))}
                    className="w-full border border-zinc-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#5b0e5c]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-zinc-600 mb-1">
                  URL da Imagem
                </label>
                <input
                  type="text"
                  value={form.image}
                  onChange={(e) => setForm((prev) => ({ ...prev, image: e.target.value }))}
                  className="w-full border border-zinc-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#5b0e5c]"
                  placeholder="/img/copo2.webp"
                />
              </div>

              {/* Category Selection */}
              <div>
                <label className="block text-sm text-zinc-600 mb-1">
                  Categoria *
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => handleCategorySelect(cat)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                        form.category === cat
                          ? "bg-[#5b0e5c] text-white"
                          : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setShowCategoryInput(!showCategoryInput)}
                    className="px-3 py-1.5 rounded-full text-xs font-medium bg-green-100 text-green-700 hover:bg-green-200"
                  >
                    + Nova
                  </button>
                </div>

                {showCategoryInput && (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="flex-1 border border-zinc-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#5b0e5c]"
                      placeholder="Nome da nova categoria"
                    />
                    <button
                      type="button"
                      onClick={handleAddNewCategory}
                      className="bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-medium"
                    >
                      Adicionar
                    </button>
                  </div>
                )}

                {form.category && (
                  <p className="text-xs text-zinc-500 mt-1">
                    Selecionada: <span className="font-medium">{form.category}</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm text-zinc-600 mb-1">
                  Badge (opcional)
                </label>
                <input
                  type="text"
                  value={form.badge}
                  onChange={(e) => setForm((prev) => ({ ...prev, badge: e.target.value }))}
                  className="w-full border border-zinc-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#5b0e5c]"
                  placeholder="Ex: MAIS VENDIDO, PROMOÇÃO"
                />
              </div>

              <div>
                <label className="block text-sm text-zinc-600 mb-1">
                  Descrição
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                  className="w-full border border-zinc-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#5b0e5c]"
                  rows={2}
                  placeholder="Descrição do produto"
                />
              </div>

              <div>
                <label className="block text-sm text-zinc-600 mb-1">
                  Complementos/Extras
                </label>
                <input
                  type="text"
                  value={form.extras}
                  onChange={(e) => setForm((prev) => ({ ...prev, extras: e.target.value }))}
                  className="w-full border border-zinc-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#5b0e5c]"
                  placeholder="Ex: Granola, Banana, Leite Condensado"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-[#5b0e5c] text-white py-2.5 rounded-xl text-sm font-semibold"
                >
                  {editingProduct ? "Salvar Alterações" : "Criar Produto"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 bg-zinc-200 text-zinc-700 py-2.5 rounded-xl text-sm font-medium"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Products by Category */}
        {categories.map((category) => {
          const categoryProducts = getProductsByCategory(category);
          const isExpanded = expandedCategory === category;

          return (
            <div key={category} className="mb-3">
              <button
                onClick={() => setExpandedCategory(isExpanded ? null : category)}
                className="w-full bg-white rounded-2xl p-4 shadow-sm flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-zinc-900">{category}</span>
                  <span className="bg-zinc-100 text-zinc-500 text-xs px-2 py-0.5 rounded-full">
                    {categoryProducts.length}
                  </span>
                </div>
                <IoChevronDown
                  className={`text-zinc-400 transition-transform ${
                    isExpanded ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isExpanded && (
                <div className="bg-white rounded-b-2xl -mt-2 pt-2 px-4 pb-4 shadow-sm">
                  {categoryProducts.length === 0 ? (
                    <p className="text-sm text-zinc-500 py-4 text-center">
                      Nenhum produto nesta categoria
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {categoryProducts.map((product) => (
                        <div
                          key={product.id}
                          className="flex items-center gap-3 p-3 bg-zinc-50 rounded-xl"
                        >
                          <img
                            src={product.image}
                            alt={product.title}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-zinc-900 text-sm truncate">
                              {product.title}
                            </h4>
                            <p className="text-xs text-zinc-500 truncate">
                              {product.subtitle}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              {product.oldPrice > product.newPrice && (
                                <span className="text-xs text-zinc-400 line-through">
                                  R$ {product.oldPrice.toFixed(2).replace(".", ",")}
                                </span>
                              )}
                              <span className="text-sm font-semibold text-green-600">
                                R$ {product.newPrice.toFixed(2).replace(".", ",")}
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <button
                              onClick={() => handleEdit(product)}
                              className="p-2 hover:bg-zinc-200 rounded-full transition-colors"
                            >
                              <IoCreateOutline className="text-zinc-500" />
                            </button>
                            <button
                              onClick={() => handleDelete(product.id)}
                              className="p-2 hover:bg-red-100 rounded-full transition-colors"
                            >
                              <IoTrashOutline className="text-red-500" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {/* Empty state */}
        {categories.length === 0 && (
          <div className="text-center py-12">
            <p className="text-zinc-500">Nenhuma categoria encontrada</p>
            <button
              onClick={() => {
                setShowForm(true);
                setShowCategoryInput(true);
              }}
              className="mt-4 text-[#5b0e5c] font-medium"
            >
              Adicionar primeiro produto
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
