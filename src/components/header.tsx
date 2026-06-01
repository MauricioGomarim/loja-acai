import { AiOutlineInstagram } from "react-icons/ai";
import { FaCoins, FaMotorcycle, FaStar } from "react-icons/fa";
import { IoIosPin } from "react-icons/io";
import { IoInformationOutline, IoCartOutline, IoPersonOutline } from "react-icons/io5";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useLocation } from "../hooks/useLocation";
import { useNavigate } from "react-router-dom";

export function Header() {
  const { totalItems, setIsCartOpen } = useCart();
  const { user } = useAuth();
  const { city } = useLocation();
  const navigate = useNavigate();

  return (
    <header className="bg-white shadow">
      <div
        className={`bg-[url('/img/background.webp')] bg-cover bg-top h-[150px]`}
      ></div>
      <div className="bg-white h-[50px] mt-[-50px] rounded-tl-[35px] rounded-tr-[35px]"></div>
      <div className="mt-[-100px] flex flex-col items-center justify-center">
        <div className=" logo ">
          <img
            src="/img/logo.png"
            alt="Logo"
            className="w-28 h-28 mx-auto mt-[0px] border-4 rounded-full shadow-lg"
          />
        </div>
        <h1 className="text-[#5b0e5c] text-2xl font-[600] mt-2 mb-2">
          Açaí Delli Delivery
        </h1>
        <div className="flex gap-2 mb-2">
          <AiOutlineInstagram className="border-[#5b0e5c] border-2 rounded-full w-10 h-10 text-[#5b0e5c] p-2" />{" "}
          <IoInformationOutline className="border-[#5b0e5c] border-2 rounded-full w-10 h-10 text-[#5b0e5c] p-2" />
          <button
            onClick={() => navigate(user ? "/profile" : "/login")}
            className="border-[#5b0e5c] border-2 rounded-full w-10 h-10 text-[#5b0e5c] p-2 hover:bg-[#5b0e5c] hover:text-white transition-colors"
          >
            <IoPersonOutline className="text-xl" />
          </button>
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative border-[#5b0e5c] border-2 rounded-full w-10 h-10 text-[#5b0e5c] p-2 hover:bg-[#5b0e5c] hover:text-white transition-colors"
          >
            <IoCartOutline className="text-xl" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>
        </div>

        <div className="pedido text-zinc-700 flex">
          <span className="flex items-center gap-1 text-[13px]">
            <FaCoins /> Pedido Mínimo{" "}
            <span className="font-bold mr-2">R$ 10,00 </span> <FaMotorcycle />{" "}
            <span className="font-bold">30-50</span> min •{" "}
            <span className="text-[#077c22]">Grátis</span>
          </span>{" "}
        </div>
        <div className="loc text-zinc-700 flex items-center gap-1 text-[13px] mb-2">
          <IoIosPin /> {city || "Bebedouro - SP"} • 1,6km de você
        </div>
        <div className="avaliacao text-zinc-700 flex items-center gap-1 text-[13px] mb-2">
          <FaStar /> <span className="font-bold">4,8</span> (136 avaliações)
        </div>
        <div className="uppercase text-[#077c22] bg-[#d7fdd7] py-1 px-3 rounded-full flex items-center gap-1 text-[13px] font-[600] mb-2">
          {" "}
          <span className="w-3 h-3 bg-green-800 rounded-full"></span>Aberto
        </div>
      </div>
      <nav className="bg-[#5b0e5c] py-2 overflow-x-auto">
        <ul className="flex justify-center gap-3 text-[#fff] text-[16px] font-[600] font-medium">
          <li><a href="#cat-pague-1-leve-2" className="p-2 block whitespace-nowrap">Pague 1, Leve 2</a></li>
          <li><a href="#cat-pague-1-leve-2-zero" className="p-2 block whitespace-nowrap">Pague 1, Leve 2 - Zero Açúcar</a></li>
          <li><a href="#cat-acai" className="p-2 block whitespace-nowrap">Açaí</a></li>
          <li><a href="#cat-acai-zero" className="p-2 block whitespace-nowrap">Açaí Zero</a></li>
        </ul>
      </nav>
    </header>
  );
}
