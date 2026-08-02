import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useStore } from "../context/StoreContext";
import { api } from "../lib/api";
import type { ProductDetail } from "../lib/api";
import { FaCheckCircle } from "react-icons/fa";
import { IoAdd, IoArrowBack } from "react-icons/io5";
import { IoIosRemove } from "react-icons/io";
import { useState, useEffect } from "react";

interface Ingredient {
  id: number;
  name: string;
  description: string;
  quantity: number;
}

export function AddProduct() {
  const { id, slug } = useParams<{ id: string; slug: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { currentStore } = useStore();
  const primaryColor = currentStore?.primaryColor || "#5b0e5c";
  const secondaryColor = currentStore?.secondaryColor || "#077c22";
  const storeSlug = slug || currentStore?.slug || "";

  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [quantitySelectedIngredients, setQuantitySelectedIngredients] = useState(0);
  const [details, setDetails] = useState("");
  const [productQuantity, setProductQuantity] = useState(1);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const data = await api.getProductById(id || "");
        setProduct(data);
        setIngredients(data.ingredients.map(i => ({ ...i, quantity: 0 })));
      } catch (err) {
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#5b0e5c] border-t-transparent rounded-full animate-spin mx-auto"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-zinc-500 text-lg">Produto nao encontrado</p>
          <button onClick={() => navigate(`/loja/${storeSlug}`)} className="mt-4 font-medium" style={{ color: primaryColor }}>
            Voltar ao cardapio
          </button>
        </div>
      </div>
    );
  }

  function decreaseQuantity(ingredientId: number) {
    setIngredients((prev) => {
      const updated = prev.map((i) => i.id === ingredientId && i.quantity > 0 ? { ...i, quantity: i.quantity - 1 } : i);
      const wasDecremented = prev.find((i) => i.id === ingredientId)?.quantity ?? 0;
      if (wasDecremented > 0) setQuantitySelectedIngredients((p) => p - 1);
      return updated;
    });
  }

  function incrementQuantity(ingredientId: number) {
    setIngredients((prev) => prev.map((i) => {
      if (i.id === ingredientId && i.quantity < 12 && quantitySelectedIngredients < 12) {
        setQuantitySelectedIngredients((p) => p + 1);
        return { ...i, quantity: i.quantity + 1 };
      }
      return i;
    }));
  }

  function handleAddToCart() {
    const selectedIngredients = ingredients.filter((i) => i.quantity > 0).map((i) => ({ name: i.name, quantity: i.quantity }));
    addToCart({ id: product!.id, title: product!.title, subtitle: product!.subtitle, price: product!.newPrice, image: product!.image, ingredients: selectedIngredients, details });
    navigate(`/loja/${storeSlug}`);
  }

  const discount = Math.round(((product.oldPrice - product.newPrice) / product.oldPrice) * 100);

  return (
    <div className="relative">
      <div className="relative">
        <div className="absolute top-0 left-0 right-0 z-10 flex justify-between items-center p-4">
          <button onClick={() => navigate(-1)} className="bg-white/90 backdrop-blur-sm p-2.5 rounded-full shadow-lg">
            <IoArrowBack className="text-zinc-800 text-xl" />
          </button>
        </div>
        <div className="w-full h-[280px] overflow-hidden">
          <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>
      </div>

      <div className="max-w-[800px] mx-auto p-4 sm:p-8 border-2 border-zinc-300 rounded-[25px] mt-[-30px] mb-30 bg-white relative z-10">
        {product.badge && (
          <span className="inline-block text-xs font-semibold px-3 py-1.5 rounded-full mb-3" style={{ backgroundColor: primaryColor + "20", color: primaryColor }}>
            {product.badge}
          </span>
        )}
        <div className="flex w-full flex-wrap">
          <div className="w-[100%] sm:w-[48%] md:w-[38%] mb-5">
            <img src={product.image} alt={product.title} className="w-full h-[300px] object-cover rounded-2xl" />
          </div>
          <div className="w-[100%] sm:w-[48%] md:w-[62%] pl-0 sm:pl-4 flex flex-col justify-center items-center md:items-start mt-4 sm:mt-0">
            <h3 className="text-zinc-900 font-[600] text-[18px] text-center md:text-left">{product.title}: "{product.subtitle}"</h3>
            {product.description && <p className="text-[16px] text-zinc-600 mt-1">{product.description}</p>}
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[16px] text-zinc-400 line-through">R$ {product.oldPrice.toFixed(2).replace(".", ",")}</span>
              <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-0.5 rounded-full">-{discount}%</span>
            </div>
            <span className="text-[22px] mt-2 font-[600]" style={{ color: primaryColor }}>R$ {product.newPrice.toFixed(2).replace(".", ",")}</span>
            <div className="flex items-center gap-4 mt-4">
              <button onClick={() => setProductQuantity((q) => Math.max(1, q - 1))} className="w-10 h-10 rounded-full border-2 border-zinc-300 flex items-center justify-center text-zinc-500">
                <IoIosRemove className="text-lg" />
              </button>
              <span className="text-xl font-semibold text-zinc-900 w-8 text-center">{productQuantity}</span>
              <button onClick={() => setProductQuantity((q) => q + 1)} className="w-10 h-10 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: primaryColor }}>
                <IoAdd className="text-lg" />
              </button>
            </div>
          </div>
        </div>

        <div className="border-1 border-dashed border-zinc-300 rounded-[10px] mt-5">
          <div className="h-10 flex items-center justify-between py-8 px-4 rounded-t-[10px]" style={{ backgroundColor: "#cecece" }}>
            <div className="flex flex-col">
              <h1 className="text-zinc-900 font-[600] text-[16px] leading-none">Escolha seus complementos</h1>
              <p className="leading-none text-[14px] text-zinc-600 mt-1">Escolha ate 12 opcoes</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-zinc-950 rounded-[5px] text-[8px] p-1.5 text-white">{quantitySelectedIngredients}/12</span>
              <FaCheckCircle className="text-green-700 bg-white rounded-full text-[22px]" />
            </div>
          </div>
          {ingredients.map((ingredient) => (
            <div key={ingredient.id} className={`h-10 rounded-b-[0px] rounded-t-[10px] flex items-center justify-between py-10 px-4 border-b-1 border-dashed border-zinc-300 ${quantitySelectedIngredients === 12 && ingredient.quantity < 1 ? "opacity-50" : ""}`}>
              <div className="flex flex-col">
                <h1 className="text-zinc-900 font-[600] text-[16px] leading-none">{ingredient.name}</h1>
                <p className="leading-none text-[14px] text-zinc-600 mt-1 italic">{ingredient.description}</p>
              </div>
              <div className="flex items-center gap-2 border-2 border-zinc-300 rounded-[25px] py-1 px-5 text-[18px] gap-4">
                <button onClick={() => decreaseQuantity(ingredient.id)} className="cursor-pointer"><IoIosRemove className="text-gray-600 bg-white rounded-full text-[25px]" /></button>
                <span className="text-gray-600 select-none">{ingredient.quantity}</span>
                <button disabled={quantitySelectedIngredients >= 12} onClick={() => incrementQuantity(ingredient.id)} className={`cursor-pointer ${quantitySelectedIngredients >= 12 ? "opacity-30" : ""}`}><IoAdd className="text-gray-600 bg-white rounded-full text-[25px]" /></button>
              </div>
            </div>
          ))}
        </div>

        <div>
          <h1 className="text-zinc-900 font-[600] text-[16px] leading-none mt-5">Adicionar algum detalhe?</h1>
          <input className="placeholder-gray-300 mt-3 w-full border-2 border-zinc-300 rounded-[25px] py-2 px-5 text-[18px] focus:outline-none" style={{ borderColor: undefined }} placeholder="Escreva o detalhe aqui..." value={details} onChange={(e) => setDetails(e.target.value)} />
        </div>
      </div>

      <div className="w-full shadow-lg shadow-black fixed bottom-0 bg-white px-10 z-50">
        <div className="max-w-[1000px] mx-auto pt-4 pb-4 flex justify-between items-center">
          <h1 className="text-[18px] mt-2 font-[600]" style={{ color: secondaryColor }}>R$ {(product.newPrice * productQuantity).toFixed(2).replace(".", ",")}</h1>
          <button onClick={handleAddToCart} className="hover:opacity-90 shadow-md transition-all flex items-center p-3 rounded-full py-2 px-5 text-white font-semibold" style={{ backgroundColor: primaryColor }}>
            Adicionar ao carrinho
          </button>
        </div>
      </div>
    </div>
  );
}
