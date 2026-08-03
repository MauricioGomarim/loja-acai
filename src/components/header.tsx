import { AiOutlineInstagram } from "react-icons/ai";
import { FaCoins, FaMotorcycle, FaStar } from "react-icons/fa";
import { IoIosPin } from "react-icons/io";
import { IoInformationOutline, IoCartOutline, IoPersonOutline } from "react-icons/io5";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useStore } from "../context/StoreContext";
import { useLocation } from "../hooks/useLocation";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../lib/api";

export function Header() {
  const { totalItems, setIsCartOpen } = useCart();
  const { user } = useAuth();
  const { currentStore } = useStore();
  const { city } = useLocation();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    if (currentStore?.id) {
      api.getCategories(currentStore.id).then(setCategories).catch(() => {});
    }
  }, [currentStore?.id]);

  const primaryColor = currentStore?.primaryColor || "#5b0e5c";
  const secondaryColor = currentStore?.secondaryColor || "#077c22";
  const storeName = currentStore?.name || "Delivery";

  function getCategoryAnchor(cat: string) {
    return `#cat-${cat.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
  }

  return (
    <header className="bg-white shadow">
      <div
        className="bg-cover bg-top h-[150px]"
        style={{
          backgroundImage: currentStore?.bannerUrl
            ? `url(${currentStore.bannerUrl})`
            : `url('/img/background.webp')`
        }}
      ></div>
      <div className="bg-white h-[50px] mt-[-50px] rounded-tl-[35px] rounded-tr-[35px]"></div>
      <div className="mt-[-100px] flex flex-col items-center justify-center">
        <div className="logo">
          {currentStore?.logoUrl ? (
            <img
              src={currentStore.logoUrl}
              alt={storeName}
              className="w-28 h-28 mx-auto border-4 rounded-full shadow-lg object-cover"
            />
          ) : (
            <div
              className="w-28 h-28 mx-auto border-4 rounded-full shadow-lg flex items-center justify-center text-white text-4xl font-bold"
              style={{ backgroundColor: primaryColor }}
            >
              {storeName.charAt(0)}
            </div>
          )}
        </div>
        <h1 className="text-2xl font-[600] mt-2 mb-2" style={{ color: primaryColor }}>
          {storeName}
        </h1>
        {currentStore?.slogan && (
          <p className="text-sm text-zinc-500 mb-2">{currentStore.slogan}</p>
        )}
        <div className="flex gap-2 mb-2">
          <AiOutlineInstagram
            className="border-2 rounded-full w-10 h-10 p-2"
            style={{ borderColor: primaryColor, color: primaryColor }}
          />
          <IoInformationOutline
            className="border-2 rounded-full w-10 h-10 p-2"
            style={{ borderColor: primaryColor, color: primaryColor }}
          />
          <button
            onClick={() => navigate(user ? "/profile" : "/login", { state: { storeId: currentStore?.id } })}
            className="border-2 rounded-full w-10 h-10 p-2 hover:text-white transition-colors"
            style={{ borderColor: primaryColor, color: primaryColor }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = primaryColor;
              e.currentTarget.style.color = "#fff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = primaryColor;
            }}
          >
            <IoPersonOutline className="text-xl" />
          </button>
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative border-2 rounded-full w-10 h-10 p-2 hover:text-white transition-colors"
            style={{ borderColor: primaryColor, color: primaryColor }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = primaryColor;
              e.currentTarget.style.color = "#fff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = primaryColor;
            }}
          >
            <IoCartOutline className="text-xl" />
            {totalItems > 0 && (
              <span
                className="absolute -top-1 -right-1 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center"
                style={{ backgroundColor: secondaryColor }}
              >
                {totalItems}
              </span>
            )}
          </button>
        </div>

        <div className="pedido text-zinc-700 flex">
          <span className="flex items-center gap-1 text-[13px]">
            <FaCoins /> Pedido Minimo{" "}
            <span className="font-bold mr-2">R$ 10,00 </span> <FaMotorcycle />{" "}
            <span className="font-bold">30-50</span> min •{" "}
            <span style={{ color: secondaryColor }}>Gratis</span>
          </span>
        </div>
        <div className="loc text-zinc-700 flex items-center gap-1 text-[13px] mb-2">
          <IoIosPin /> {currentStore?.city || city || "Entrega"}
        </div>
        <div className="avaliacao text-zinc-700 flex items-center gap-1 text-[13px] mb-2">
          <FaStar /> <span className="font-bold">4,8</span> (136 avaliacoes)
        </div>
        <div
          className="uppercase py-1 px-3 rounded-full flex items-center gap-1 text-[13px] font-[600] mb-2"
          style={{ color: secondaryColor, backgroundColor: secondaryColor + "20" }}
        >
          <span
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: secondaryColor }}
          ></span>
          Aberto
        </div>
      </div>
      <nav className="py-2 overflow-x-auto" style={{ backgroundColor: primaryColor }}>
        <ul className="flex justify-center gap-3 text-white text-[16px] font-[600] font-medium">
          {categories.length > 0
            ? categories.map((cat) => (
                <li key={cat}>
                  <a href={getCategoryAnchor(cat)} className="p-2 block whitespace-nowrap">
                    {cat}
                  </a>
                </li>
              ))
            : (
                <>
                  <li><a href="#cat-pague-1-leve-2" className="p-2 block whitespace-nowrap">Pague 1, Leve 2</a></li>
                  <li><a href="#cat-pague-1-leve-2-zero" className="p-2 block whitespace-nowrap">Zero Acucar</a></li>
                  <li><a href="#cat-acai" className="p-2 block whitespace-nowrap">Acai</a></li>
                  <li><a href="#cat-acai-zero" className="p-2 block whitespace-nowrap">Acai Zero</a></li>
                </>
              )}
        </ul>
      </nav>
    </header>
  );
}
