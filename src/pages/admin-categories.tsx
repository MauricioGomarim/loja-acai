import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";
import {
  IoArrowBack,
  IoAdd,
  IoTrashOutline,
  IoChevronForward,
} from "react-icons/io5";

export function AdminCategories() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCategory, setNewCategory] = useState("");
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  useEffect(() => {
    if (!user?.isAdmin) {
      navigate("/");
      return;
    }
    fetchCategories();
  }, [user, navigate]);

  async function fetchCategories() {
    try {
      const data = await api.getCategories();
      setCategories(data);
    } catch (err) {
      console.error("Error fetching categories:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddCategory() {
    if (!newCategory.trim()) return;

    try {
      // Categories are managed through products - create a placeholder product
      // or just add to the list (frontend only for now)
      setCategories((prev) => [...prev, newCategory.trim()]);
      setNewCategory("");
    } catch (err) {
      console.error("Error adding category:", err);
    }
  }

  function handleEditCategory(category: string) {
    setEditingCategory(category);
    setEditValue(category);
  }

  function handleSaveEdit() {
    if (!editValue.trim() || !editingCategory) return;

    setCategories((prev) =>
      prev.map((c) => (c === editingCategory ? editValue.trim() : c))
    );
    setEditingCategory(null);
    setEditValue("");
  }

  function handleDeleteCategory(category: string) {
    if (!confirm(`Tem certeza que deseja remover a categoria "${category}"?`)) return;
    setCategories((prev) => prev.filter((c) => c !== category));
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
        <h1 className="text-white font-semibold text-lg">Gerenciar Categorias</h1>
      </div>

      <div className="max-w-md mx-auto p-4">
        {/* Add Category */}
        <div className="bg-white rounded-2xl p-4 shadow-sm mb-4">
          <h3 className="font-semibold text-zinc-900 mb-3">Nova Categoria</h3>
          <div className="flex gap-2">
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="flex-1 border border-zinc-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#5b0e5c]"
              placeholder="Nome da categoria"
              onKeyPress={(e) => e.key === "Enter" && handleAddCategory()}
            />
            <button
              onClick={handleAddCategory}
              className="bg-[#5b0e5c] text-white px-4 py-2.5 rounded-xl text-sm font-medium"
            >
              <IoAdd className="text-lg" />
            </button>
          </div>
        </div>

        {/* Categories List */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {categories.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-zinc-500">Nenhuma categoria cadastrada</p>
            </div>
          ) : (
            categories.map((category) => (
              <div
                key={category}
                className="border-b border-zinc-100 last:border-0"
              >
                {editingCategory === category ? (
                  <div className="p-4 flex gap-2">
                    <input
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="flex-1 border border-zinc-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#5b0e5c]"
                      autoFocus
                    />
                    <button
                      onClick={handleSaveEdit}
                      className="bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-medium"
                    >
                      Salvar
                    </button>
                    <button
                      onClick={() => setEditingCategory(null)}
                      className="bg-zinc-200 text-zinc-700 px-4 py-2 rounded-xl text-sm font-medium"
                    >
                      Cancelar
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <IoChevronForward className="text-[#5b0e5c]" />
                      </div>
                      <span className="font-medium text-zinc-900">{category}</span>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleEditCategory(category)}
                        className="p-2 hover:bg-zinc-100 rounded-full transition-colors"
                      >
                        <IoChevronForward className="text-zinc-400" />
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(category)}
                        className="p-2 hover:bg-red-100 rounded-full transition-colors"
                      >
                        <IoTrashOutline className="text-red-500" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Info */}
        <p className="text-xs text-zinc-500 mt-4 text-center">
          As categorias são sincronizadas com os produtos do cardápio.
        </p>
      </div>
    </div>
  );
}
