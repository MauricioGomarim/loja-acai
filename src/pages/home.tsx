import { Header } from "../components/header";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../lib/api";
import type { Product } from "../lib/api";

export function Home() {
  const [timeLeft, setTimeLeft] = useState<number>(40 * 60);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const data = await api.getProducts();
        setProducts(data);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const seconds = String(timeLeft % 60).padStart(2, "0");

  const categories = [
    "Pague 1, Leve 2",
    "Pague 1, Leve 2 - Zero Açúcar",
    "Açaí",
    "Açaí Zero Açúcar",
  ];

  function getProductsByCategory(category: string) {
    return products.filter((p) => p.category === category);
  }

  if (loading) {
    return (
      <div className="bg-white min-h-screen">
        <Header />
        <div className="max-w-6xl mx-auto px-4 py-8 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-[#5b0e5c] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-zinc-500">Carregando cardápio...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <Header />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="w-full">
          <span className="text-center border-[#077c22] border-2 rounded-[10px] w-full flex text-[#077c22] justify-center p-2.5 text-[13px] font-medium mb-4">
            Entrega Grátis para Bastos!
          </span>
          <span className="text-center border-[#800080] border-2 rounded-[10px] w-full flex text-[#800080] justify-center p-2.5 text-[13px] font-medium">
            Aproveite nossa promoção com preços irresistíveis igual Açaí 💜
          </span>
        </div>

        {categories.map((category, index) => {
          const categoryProducts = getProductsByCategory(category);
          if (categoryProducts.length === 0) return null;

          return (
            <div key={category}>
              <h1 className="text-[#5b0e5c] text-[20px] font-[600] mt-6 mb-2">
                {category}
              </h1>
              <div className="mt-2 flex flex-wrap gap-[2%]">
                {categoryProducts.map((product) => (
                  <Link
                    key={product.id}
                    to={`/product/${product.id}`}
                    className={`border-2 rounded-[10px] flex p-3 gap-2 items-center w-[100%] sm:w-[48%] md:w-[32%] mb-3 h-fit no-underline ${
                      product.badge
                        ? "border-[#5b0e5c] pulsar"
                        : "border-zinc-300"
                    }`}
                  >
                    <div className="flex-1">
                      {product.badge && (
                        <span className="text-[#5b0e5c] bg-[#f1cdf2] mb-2 font-[600] text-[14px] p-1 flex rounded-[10px] uppercase items-center justify-center">
                          {product.badge} 💜
                        </span>
                      )}
                      <h3 className="text-zinc-900 font-[600] text-[16px]">
                        {product.title}
                      </h3>
                      <p className="text-[14px] text-zinc-600 mt-1">
                        {product.subtitle}
                      </p>
                      {product.extras && (
                        <p className="p-3 bg-zinc-200 rounded-[10px] block text-zinc-700 text-[14px] mt-2">
                          {product.extras.split("!")[0]}!
                        </p>
                      )}
                      {product.description && (
                        <p className="text-[14px] text-zinc-600 mt-1">
                          {product.description}
                        </p>
                      )}
                      <p className="text-[14px] text-zinc-600 mt-1">de</p>
                      <span className="text-[14px] text-zinc-600 mt-1 line-through">
                        R${" "}
                        {product.oldPrice.toFixed(2).replace(".", ",")}
                      </span>
                      <p className="text-[14px] text-zinc-600 mt-1">por</p>
                      <span
                        className={`text-[18px] mt-2 font-[600] ${
                          product.badge
                            ? "text-white bg-[#077c22] px-1 rounded-[8px]"
                            : "text-[#077c22]"
                        }`}
                      >
                        R${" "}
                        {product.newPrice.toFixed(2).replace(".", ",")}
                      </span>
                      {product.badge && (
                        <>
                          <p className="text-[14px] text-zinc-600 mt-1 italic">
                            A maioria dos clientes escolhe esse porque é o melhor
                            custo-benefício!
                          </p>
                          <p className="text-[12px] text-zinc-600 mt-1">
                            🔥 Apenas{" "}
                            <span className="text-white bg-red-600 rounded-2xl font-[600] px-1">
                              1 combo(s)
                            </span>{" "}
                            com esse preço especial
                          </p>
                        </>
                      )}
                    </div>
                    <div className="w-[108px]">
                      <img
                        className="w-[108px] h-[108px] object-cover rounded-2xl"
                        src={product.image}
                        alt={product.title}
                      />
                    </div>
                  </Link>
                ))}

                {/* Timer apenas na primeira categoria */}
                {index === 0 && (
                  <div className="border-2 border-red-600 bg-red-100 rounded-[10px] flex p-3 gap-2 items-start w-[100%] sm:w-[48%] md:w-[32%] mb-3">
                    <div className="flex-1">
                      <h3 className="text-red-600 text-center font-[600] text-[14px]">
                        A promoção vai acabar em:
                      </h3>
                      <div className="flex justify-center items-center mt-2 gap-6">
                        <div className="flex gap-2 flex-col items-center">
                          <span className="bg-red-600 p-4 rounded text-[20px] flex justify-center font-bold min-w-[60px]">
                            {minutes}
                          </span>
                          <p className="text-red-600">Minutos</p>
                        </div>
                        <div className="flex gap-2 flex-col items-center">
                          <span className="bg-red-600 p-4 rounded text-[20px] flex justify-center font-bold min-w-[60px]">
                            {seconds}
                          </span>
                          <p className="text-red-600">Segundos</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
