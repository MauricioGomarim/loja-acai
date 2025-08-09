import { Header } from "../components/header";
import morango from "../assets/img/morango2.jpg";
import morango2 from "../assets/img/morango4.jpg";
import copo from "../assets/img/copo2.webp";
import { useEffect, useState } from "react";

export function Home() {
    const [timeLeft, setTimeLeft] = useState<number>(40 * 60); // 40 minutos em segundos

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const seconds = String(timeLeft % 60).padStart(2, "0");

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
        <h1 className="text-[#5b0e5c] text-[20px] font-[600] mt-2 mb-2">
          Pague 1, Leve 2
        </h1>
        <div className="mt-2 flex flex-wrap gap-[2%]">
          <div className="border-2 border-zinc-300 rounded-[10px] flex p-3 gap-2 items-center w-[100%] sm:w-[48%] md:w-[32%] mb-3 h-fit">
            <div className="flex-1">
              <h3 className="text-zinc-900 font-[600] text-[16px]">
                Promoção da Semana: “8 Morangos por 50% OFF”
              </h3>
              <p className="text-[14px] text-zinc-600 mt-1">
                por tempo limitado
              </p>
              <p className="text-[14px] text-zinc-600 mt-1">de</p>
              <span className="text-[14px] text-zinc-600 mt-1 line-through">
                R$ 40,00
              </span>
              <p className="text-[14px] text-zinc-600 mt-1">por</p>
              <span className="text-[18px] text-[#077c22] mt-2 font-[600] ">
                R$ 19,90
              </span>
            </div>
            <div className="w-[108px]">
              <img
                className="w-[108px] h-[108px] object-cover rounded-2xl"
                src={morango}
              />
            </div>
          </div>

          <div className="border-2 border-zinc-300 rounded-[10px] flex p-3 gap-2 items-center w-[100%] sm:w-[48%] md:w-[32%] mb-3 h-fit">
            <div className="flex-1">
              <h3 className="text-zinc-900 font-[600] text-[16px]">
                Promoção da Semana: “12 Morangos por 50% OFF”
              </h3>
              <p className="text-[14px] text-zinc-600 mt-1">
                por tempo limitado
              </p>
              <p className="text-[14px] text-zinc-600 mt-1">de</p>
              <span className="text-[14px] text-zinc-600 mt-1 line-through">
                R$ 60,00
              </span>
              <p className="text-[14px] text-zinc-600 mt-1">por</p>
              <span className="text-[18px] text-[#077c22] mt-2 font-[600] ">
                R$ 24,90
              </span>
            </div>
            <div className="w-[108px]">
              <img
                className="w-[108px] h-[108px] object-cover rounded-2xl"
                src={morango2}
              />
            </div>
          </div>

          <div className="border-2 border-zinc-300 rounded-[10px] flex p-3 gap-2 items-center w-[100%] sm:w-[48%] md:w-[32%] mb-3 h-fit">
            <div className="flex-1">
              <h3 className="text-zinc-900 font-[600] text-[16px]">
                2 Copos Açaí 300ml
              </h3>
              <p className="text-[14px] text-zinc-600 mt-1">
                9 Complementos Grátis
              </p>
              <p className="text-[14px] text-zinc-600 mt-1">de</p>
              <span className="text-[14px] text-zinc-600 mt-1 line-through">
                R$ 39,80
              </span>
              <p className="text-[14px] text-zinc-600 mt-1">por</p>
              <span className="text-[18px] text-[#077c22] mt-2 font-[600] ">
                R$ 23,90
              </span>
            </div>
            <div className="w-[108px]">
              <img
                className="w-[108px] h-[108px] object-cover rounded-2xl"
                src={copo}
              />
            </div>
          </div>

          <div className="border-2 border-zinc-300 rounded-[10px] flex p-3 gap-2 items-center w-[100%] sm:w-[48%] md:w-[32%] mb-3 h-fit">
            <div className="flex-1">
              <h3 className="text-zinc-900 font-[600] text-[16px]">
                2 Copos Açaí 500ml
              </h3>
              <p className="text-[14px] text-zinc-600 mt-1">
                9 Complementos Grátis
              </p>
              <p className="text-[14px] text-zinc-600 mt-1">de</p>
              <span className="text-[14px] text-zinc-600 mt-1 line-through">
                R$ 43,80
              </span>
              <p className="text-[14px] text-zinc-600 mt-1">por</p>
              <span className="text-[18px] text-[#077c22] mt-2 font-[600] ">
                R$ 26,90
              </span>
            </div>
            <div className="w-[108px]">
              <img
                className="w-[108px] h-[108px] object-cover rounded-2xl"
                src={copo}
              />
            </div>
          </div>

          <div className="border-2 border-zinc-300 rounded-[10px] flex p-3 gap-2 items-center w-[100%] sm:w-[48%] md:w-[32%] mb-3 h-fit pulsar">
            <div className="flex-1">
              <span className="text-[#5b0e5c] bg-[#f1cdf2] mb-2 font-[600] text-[14px] p-1 flex rounded-[10px] uppercase items-center justify-center">
                MAIS VENDIDO 💜
              </span>
              <h3 className="text-zinc-900 font-[600] text-[16px]">
                2 Copos Açaí 700ml
              </h3>
              <p className="text-[14px] text-zinc-600 mt-1">
                9 Complementos Grátis
              </p>
              <p className="p-3 bg-zinc-200 rounded-[10px] block text-zinc-700 text-[14px]">
                Mais que o dobro do Combo 1 por apenas{" "}
                <span className="font-bold">R$7 a mais!</span>{" "}
              </p>
              <p className="text-[14px] text-zinc-600 mt-1">de</p>
              <span className="text-[14px] text-zinc-600 mt-1 line-through">
                R$ 53,80
              </span>

              <p className="text-[14px] text-zinc-600 mt-1">por</p>
              <span className="text-[20px] text-white bg-[#077c22] mt-2 font-[600] px-1  rounded-[8px] ">
                R$ 29,90
              </span>
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
            </div>
            <div className="w-[108px]">
              <img
                className="w-[108px] h-[108px] object-cover rounded-2xl"
                src={copo}
              />
            </div>
          </div>

          <div className="border-2 border-red-600 bg-red-100 rounded-[10px] flex p-3 gap-2 items-start w-[100%] sm:w-[48%] md:w-[32%] mb-3 ]">
            <div className="flex-1">
              <h3 className="text-red-600 text-center font-[600] text-[14px]">
                A promoção vai acabar em:
              </h3>
              <div className="flex justify-center items-center mt-2 gap-6">

                <div className="flex gap-2 flex-col">
                  <span className="bg-red-600 p-4 rounded text-[20px] flex justify-center font-bold">{minutes}</span>
                  <p className="text-red-600">Minutos</p>
                </div>

                <div className="flex gap-2 flex-col">
                  <span className="bg-red-600 p-4 rounded text-[20px] flex justify-center font-bold">{seconds}</span>
                  <p className="text-red-600">Segundos</p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-2 border-zinc-300 rounded-[10px] flex p-3 gap-2 items-center w-[100%] sm:w-[48%] md:w-[32%] mb-3 h-fit">
            <div className="flex-1">
              <h3 className="text-zinc-900 font-[600] text-[16px]">
                2 Copos Açaí 500ml
              </h3>
              <p className="text-[14px] text-zinc-600 mt-1">
                9 Complementos Grátis
              </p>
              <p className="text-[14px] text-zinc-600 mt-1">de</p>
              <span className="text-[14px] text-zinc-600 mt-1 line-through">
                R$ 43,80
              </span>
              <p className="text-[14px] text-zinc-600 mt-1">por</p>
              <span className="text-[18px] text-[#077c22] mt-2 font-[600] ">
                R$ 26,90
              </span>
            </div>
            <div className="w-[108px]">
              <img
                className="w-[108px] h-[108px] object-cover rounded-2xl"
                src={copo}
              />
            </div>
          </div>
        </div>
          <h1 className="text-[#5b0e5c] text-[20px] font-[600] mt-2 mb-2">
          Pague 1, Leve 2 - Zero Açúcar
        </h1>
        <div className="mt-2 flex flex-wrap gap-[2%]">
          <div className="border-2 border-zinc-300 rounded-[10px] flex p-3 gap-2 items-center w-[100%] sm:w-[48%] md:w-[32%] mb-3 h-fit">
            <div className="flex-1">
              <h3 className="text-zinc-900 font-[600] text-[16px]">
                Promoção da Semana: “8 Morangos por 50% OFF”
              </h3>
              <p className="text-[14px] text-zinc-600 mt-1">
                por tempo limitado
              </p>
              <p className="text-[14px] text-zinc-600 mt-1">de</p>
              <span className="text-[14px] text-zinc-600 mt-1 line-through">
                R$ 40,00
              </span>
              <p className="text-[14px] text-zinc-600 mt-1">por</p>
              <span className="text-[18px] text-[#077c22] mt-2 font-[600] ">
                R$ 19,90
              </span>
            </div>
            <div className="w-[108px]">
              <img
                className="w-[108px] h-[108px] object-cover rounded-2xl"
                src={morango}
              />
            </div>
          </div>

          <div className="border-2 border-zinc-300 rounded-[10px] flex p-3 gap-2 items-center w-[100%] sm:w-[48%] md:w-[32%] mb-3 h-fit">
            <div className="flex-1">
              <h3 className="text-zinc-900 font-[600] text-[16px]">
                Promoção da Semana: “12 Morangos por 50% OFF”
              </h3>
              <p className="text-[14px] text-zinc-600 mt-1">
                por tempo limitado
              </p>
              <p className="text-[14px] text-zinc-600 mt-1">de</p>
              <span className="text-[14px] text-zinc-600 mt-1 line-through">
                R$ 60,00
              </span>
              <p className="text-[14px] text-zinc-600 mt-1">por</p>
              <span className="text-[18px] text-[#077c22] mt-2 font-[600] ">
                R$ 24,90
              </span>
            </div>
            <div className="w-[108px]">
              <img
                className="w-[108px] h-[108px] object-cover rounded-2xl"
                src={morango2}
              />
            </div>
          </div>

          <div className="border-2 border-zinc-300 rounded-[10px] flex p-3 gap-2 items-center w-[100%] sm:w-[48%] md:w-[32%] mb-3 h-fit">
            <div className="flex-1">
              <h3 className="text-zinc-900 font-[600] text-[16px]">
                2 Copos Açaí 300ml
              </h3>
              <p className="text-[14px] text-zinc-600 mt-1">
                9 Complementos Grátis
              </p>
              <p className="text-[14px] text-zinc-600 mt-1">de</p>
              <span className="text-[14px] text-zinc-600 mt-1 line-through">
                R$ 39,80
              </span>
              <p className="text-[14px] text-zinc-600 mt-1">por</p>
              <span className="text-[18px] text-[#077c22] mt-2 font-[600] ">
                R$ 23,90
              </span>
            </div>
            <div className="w-[108px]">
              <img
                className="w-[108px] h-[108px] object-cover rounded-2xl"
                src={copo}
              />
            </div>
          </div>

          <div className="border-2 border-zinc-300 rounded-[10px] flex p-3 gap-2 items-center w-[100%] sm:w-[48%] md:w-[32%] mb-3 h-fit">
            <div className="flex-1">
              <h3 className="text-zinc-900 font-[600] text-[16px]">
                2 Copos Açaí 500ml
              </h3>
              <p className="text-[14px] text-zinc-600 mt-1">
                9 Complementos Grátis
              </p>
              <p className="text-[14px] text-zinc-600 mt-1">de</p>
              <span className="text-[14px] text-zinc-600 mt-1 line-through">
                R$ 43,80
              </span>
              <p className="text-[14px] text-zinc-600 mt-1">por</p>
              <span className="text-[18px] text-[#077c22] mt-2 font-[600] ">
                R$ 26,90
              </span>
            </div>
            <div className="w-[108px]">
              <img
                className="w-[108px] h-[108px] object-cover rounded-2xl"
                src={copo}
              />
            </div>
          </div>

          <div className="border-2 border-zinc-300 rounded-[10px] flex p-3 gap-2 items-center w-[100%] sm:w-[48%] md:w-[32%] mb-3 h-fit pulsar">
            <div className="flex-1">
              <span className="text-[#5b0e5c] bg-[#f1cdf2] mb-2 font-[600] text-[14px] p-1 flex rounded-[10px] uppercase items-center justify-center">
                MAIS VENDIDO 💜
              </span>
              <h3 className="text-zinc-900 font-[600] text-[16px]">
                2 Copos Açaí 700ml
              </h3>
              <p className="text-[14px] text-zinc-600 mt-1">
                9 Complementos Grátis
              </p>
              <p className="p-3 bg-zinc-200 rounded-[10px] block text-zinc-700 text-[14px]">
                Mais que o dobro do Combo 1 por apenas{" "}
                <span className="font-bold">R$7 a mais!</span>{" "}
              </p>
              <p className="text-[14px] text-zinc-600 mt-1">de</p>
              <span className="text-[14px] text-zinc-600 mt-1 line-through">
                R$ 53,80
              </span>

              <p className="text-[14px] text-zinc-600 mt-1">por</p>
              <span className="text-[20px] text-white bg-[#077c22] mt-2 font-[600] px-1  rounded-[8px] ">
                R$ 29,90
              </span>
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
            </div>
            <div className="w-[108px]">
              <img
                className="w-[108px] h-[108px] object-cover rounded-2xl"
                src={copo}
              />
            </div>
          </div>

          <div className="border-2 border-red-600 bg-red-100 rounded-[10px] flex p-3 gap-2 items-start w-[100%] sm:w-[48%] md:w-[32%] mb-3 ]">
            <div className="flex-1">
              <h3 className="text-red-600 text-center font-[600] text-[14px]">
                A promoção vai acabar em:
              </h3>
              <div className="flex justify-center items-center mt-2 gap-6">

                <div className="flex gap-2 flex-col">
                  <span className="bg-red-600 p-4 rounded text-[20px] flex justify-center font-bold">{minutes}</span>
                  <p className="text-red-600">Minutos</p>
                </div>

                <div className="flex gap-2 flex-col">
                  <span className="bg-red-600 p-4 rounded text-[20px] flex justify-center font-bold">{seconds}</span>
                  <p className="text-red-600">Segundos</p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-2 border-zinc-300 rounded-[10px] flex p-3 gap-2 items-center w-[100%] sm:w-[48%] md:w-[32%] mb-3 h-fit">
            <div className="flex-1">
              <h3 className="text-zinc-900 font-[600] text-[16px]">
                2 Copos Açaí 500ml
              </h3>
              <p className="text-[14px] text-zinc-600 mt-1">
                9 Complementos Grátis
              </p>
              <p className="text-[14px] text-zinc-600 mt-1">de</p>
              <span className="text-[14px] text-zinc-600 mt-1 line-through">
                R$ 43,80
              </span>
              <p className="text-[14px] text-zinc-600 mt-1">por</p>
              <span className="text-[18px] text-[#077c22] mt-2 font-[600] ">
                R$ 26,90
              </span>
            </div>
            <div className="w-[108px]">
              <img
                className="w-[108px] h-[108px] object-cover rounded-2xl"
                src={copo}
              />
            </div>
          </div>
        </div>

         <h1 className="text-[#5b0e5c] text-[20px] font-[600] mt-2 mb-2">
          Açaí
        </h1>
        <div className="mt-2 flex flex-wrap gap-[2%]">
          <div className="border-2 border-zinc-300 rounded-[10px] flex p-3 gap-2 items-center w-[100%] sm:w-[48%] md:w-[32%] mb-3 h-fit">
            <div className="flex-1">
              <h3 className="text-zinc-900 font-[600] text-[16px]">
                Promoção da Semana: “8 Morangos por 50% OFF”
              </h3>
              <p className="text-[14px] text-zinc-600 mt-1">
                por tempo limitado
              </p>
              <p className="text-[14px] text-zinc-600 mt-1">de</p>
              <span className="text-[14px] text-zinc-600 mt-1 line-through">
                R$ 40,00
              </span>
              <p className="text-[14px] text-zinc-600 mt-1">por</p>
              <span className="text-[18px] text-[#077c22] mt-2 font-[600] ">
                R$ 19,90
              </span>
            </div>
            <div className="w-[108px]">
              <img
                className="w-[108px] h-[108px] object-cover rounded-2xl"
                src={morango}
              />
            </div>
          </div>

          <div className="border-2 border-zinc-300 rounded-[10px] flex p-3 gap-2 items-center w-[100%] sm:w-[48%] md:w-[32%] mb-3 h-fit">
            <div className="flex-1">
              <h3 className="text-zinc-900 font-[600] text-[16px]">
                Promoção da Semana: “12 Morangos por 50% OFF”
              </h3>
              <p className="text-[14px] text-zinc-600 mt-1">
                por tempo limitado
              </p>
              <p className="text-[14px] text-zinc-600 mt-1">de</p>
              <span className="text-[14px] text-zinc-600 mt-1 line-through">
                R$ 60,00
              </span>
              <p className="text-[14px] text-zinc-600 mt-1">por</p>
              <span className="text-[18px] text-[#077c22] mt-2 font-[600] ">
                R$ 24,90
              </span>
            </div>
            <div className="w-[108px]">
              <img
                className="w-[108px] h-[108px] object-cover rounded-2xl"
                src={morango2}
              />
            </div>
          </div>

          <div className="border-2 border-zinc-300 rounded-[10px] flex p-3 gap-2 items-center w-[100%] sm:w-[48%] md:w-[32%] mb-3 h-fit">
            <div className="flex-1">
              <h3 className="text-zinc-900 font-[600] text-[16px]">
                2 Copos Açaí 300ml
              </h3>
              <p className="text-[14px] text-zinc-600 mt-1">
                9 Complementos Grátis
              </p>
              <p className="text-[14px] text-zinc-600 mt-1">de</p>
              <span className="text-[14px] text-zinc-600 mt-1 line-through">
                R$ 39,80
              </span>
              <p className="text-[14px] text-zinc-600 mt-1">por</p>
              <span className="text-[18px] text-[#077c22] mt-2 font-[600] ">
                R$ 23,90
              </span>
            </div>
            <div className="w-[108px]">
              <img
                className="w-[108px] h-[108px] object-cover rounded-2xl"
                src={copo}
              />
            </div>
          </div>

          <div className="border-2 border-zinc-300 rounded-[10px] flex p-3 gap-2 items-center w-[100%] sm:w-[48%] md:w-[32%] mb-3 h-fit">
            <div className="flex-1">
              <h3 className="text-zinc-900 font-[600] text-[16px]">
                2 Copos Açaí 500ml
              </h3>
              <p className="text-[14px] text-zinc-600 mt-1">
                9 Complementos Grátis
              </p>
              <p className="text-[14px] text-zinc-600 mt-1">de</p>
              <span className="text-[14px] text-zinc-600 mt-1 line-through">
                R$ 43,80
              </span>
              <p className="text-[14px] text-zinc-600 mt-1">por</p>
              <span className="text-[18px] text-[#077c22] mt-2 font-[600] ">
                R$ 26,90
              </span>
            </div>
            <div className="w-[108px]">
              <img
                className="w-[108px] h-[108px] object-cover rounded-2xl"
                src={copo}
              />
            </div>
          </div>

          <div className="border-2 border-zinc-300 rounded-[10px] flex p-3 gap-2 items-center w-[100%] sm:w-[48%] md:w-[32%] mb-3 h-fit pulsar">
            <div className="flex-1">
              <span className="text-[#5b0e5c] bg-[#f1cdf2] mb-2 font-[600] text-[14px] p-1 flex rounded-[10px] uppercase items-center justify-center">
                MAIS VENDIDO 💜
              </span>
              <h3 className="text-zinc-900 font-[600] text-[16px]">
                2 Copos Açaí 700ml
              </h3>
              <p className="text-[14px] text-zinc-600 mt-1">
                9 Complementos Grátis
              </p>
              <p className="p-3 bg-zinc-200 rounded-[10px] block text-zinc-700 text-[14px]">
                Mais que o dobro do Combo 1 por apenas{" "}
                <span className="font-bold">R$7 a mais!</span>{" "}
              </p>
              <p className="text-[14px] text-zinc-600 mt-1">de</p>
              <span className="text-[14px] text-zinc-600 mt-1 line-through">
                R$ 53,80
              </span>

              <p className="text-[14px] text-zinc-600 mt-1">por</p>
              <span className="text-[20px] text-white bg-[#077c22] mt-2 font-[600] px-1  rounded-[8px] ">
                R$ 29,90
              </span>
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
            </div>
            <div className="w-[108px]">
              <img
                className="w-[108px] h-[108px] object-cover rounded-2xl"
                src={copo}
              />
            </div>
          </div>

          <div className="border-2 border-red-600 bg-red-100 rounded-[10px] flex p-3 gap-2 items-start w-[100%] sm:w-[48%] md:w-[32%] mb-3 ]">
            <div className="flex-1">
              <h3 className="text-red-600 text-center font-[600] text-[14px]">
                A promoção vai acabar em:
              </h3>
              <div className="flex justify-center items-center mt-2 gap-6">

                <div className="flex gap-2 flex-col">
                  <span className="bg-red-600 p-4 rounded text-[20px] flex justify-center font-bold">{minutes}</span>
                  <p className="text-red-600">Minutos</p>
                </div>

                <div className="flex gap-2 flex-col">
                  <span className="bg-red-600 p-4 rounded text-[20px] flex justify-center font-bold">{seconds}</span>
                  <p className="text-red-600">Segundos</p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-2 border-zinc-300 rounded-[10px] flex p-3 gap-2 items-center w-[100%] sm:w-[48%] md:w-[32%] mb-3 h-fit">
            <div className="flex-1">
              <h3 className="text-zinc-900 font-[600] text-[16px]">
                2 Copos Açaí 500ml
              </h3>
              <p className="text-[14px] text-zinc-600 mt-1">
                9 Complementos Grátis
              </p>
              <p className="text-[14px] text-zinc-600 mt-1">de</p>
              <span className="text-[14px] text-zinc-600 mt-1 line-through">
                R$ 43,80
              </span>
              <p className="text-[14px] text-zinc-600 mt-1">por</p>
              <span className="text-[18px] text-[#077c22] mt-2 font-[600] ">
                R$ 26,90
              </span>
            </div>
            <div className="w-[108px]">
              <img
                className="w-[108px] h-[108px] object-cover rounded-2xl"
                src={copo}
              />
            </div>
          </div>
        </div>


                 <h1 className="text-[#5b0e5c] text-[20px] font-[600] mt-2 mb-2">
          Açaí Zero Açúcar
        </h1>
        <div className="mt-2 flex flex-wrap gap-[2%]">
          <div className="border-2 border-zinc-300 rounded-[10px] flex p-3 gap-2 items-center w-[100%] sm:w-[48%] md:w-[32%] mb-3 h-fit">
            <div className="flex-1">
              <h3 className="text-zinc-900 font-[600] text-[16px]">
                Promoção da Semana: “8 Morangos por 50% OFF”
              </h3>
              <p className="text-[14px] text-zinc-600 mt-1">
                por tempo limitado
              </p>
              <p className="text-[14px] text-zinc-600 mt-1">de</p>
              <span className="text-[14px] text-zinc-600 mt-1 line-through">
                R$ 40,00
              </span>
              <p className="text-[14px] text-zinc-600 mt-1">por</p>
              <span className="text-[18px] text-[#077c22] mt-2 font-[600] ">
                R$ 19,90
              </span>
            </div>
            <div className="w-[108px]">
              <img
                className="w-[108px] h-[108px] object-cover rounded-2xl"
                src={morango}
              />
            </div>
          </div>

          <div className="border-2 border-zinc-300 rounded-[10px] flex p-3 gap-2 items-center w-[100%] sm:w-[48%] md:w-[32%] mb-3 h-fit">
            <div className="flex-1">
              <h3 className="text-zinc-900 font-[600] text-[16px]">
                Promoção da Semana: “12 Morangos por 50% OFF”
              </h3>
              <p className="text-[14px] text-zinc-600 mt-1">
                por tempo limitado
              </p>
              <p className="text-[14px] text-zinc-600 mt-1">de</p>
              <span className="text-[14px] text-zinc-600 mt-1 line-through">
                R$ 60,00
              </span>
              <p className="text-[14px] text-zinc-600 mt-1">por</p>
              <span className="text-[18px] text-[#077c22] mt-2 font-[600] ">
                R$ 24,90
              </span>
            </div>
            <div className="w-[108px]">
              <img
                className="w-[108px] h-[108px] object-cover rounded-2xl"
                src={morango2}
              />
            </div>
          </div>

          <div className="border-2 border-zinc-300 rounded-[10px] flex p-3 gap-2 items-center w-[100%] sm:w-[48%] md:w-[32%] mb-3 h-fit">
            <div className="flex-1">
              <h3 className="text-zinc-900 font-[600] text-[16px]">
                2 Copos Açaí 300ml
              </h3>
              <p className="text-[14px] text-zinc-600 mt-1">
                9 Complementos Grátis
              </p>
              <p className="text-[14px] text-zinc-600 mt-1">de</p>
              <span className="text-[14px] text-zinc-600 mt-1 line-through">
                R$ 39,80
              </span>
              <p className="text-[14px] text-zinc-600 mt-1">por</p>
              <span className="text-[18px] text-[#077c22] mt-2 font-[600] ">
                R$ 23,90
              </span>
            </div>
            <div className="w-[108px]">
              <img
                className="w-[108px] h-[108px] object-cover rounded-2xl"
                src={copo}
              />
            </div>
          </div>

          <div className="border-2 border-zinc-300 rounded-[10px] flex p-3 gap-2 items-center w-[100%] sm:w-[48%] md:w-[32%] mb-3 h-fit">
            <div className="flex-1">
              <h3 className="text-zinc-900 font-[600] text-[16px]">
                2 Copos Açaí 500ml
              </h3>
              <p className="text-[14px] text-zinc-600 mt-1">
                9 Complementos Grátis
              </p>
              <p className="text-[14px] text-zinc-600 mt-1">de</p>
              <span className="text-[14px] text-zinc-600 mt-1 line-through">
                R$ 43,80
              </span>
              <p className="text-[14px] text-zinc-600 mt-1">por</p>
              <span className="text-[18px] text-[#077c22] mt-2 font-[600] ">
                R$ 26,90
              </span>
            </div>
            <div className="w-[108px]">
              <img
                className="w-[108px] h-[108px] object-cover rounded-2xl"
                src={copo}
              />
            </div>
          </div>

 
        </div>
      </div>
    </div>
  );
}
