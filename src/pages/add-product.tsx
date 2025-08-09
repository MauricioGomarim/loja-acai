import morango2 from "../assets/img/morango4.jpg";

import { FaCheckCircle } from "react-icons/fa";
import { IoAdd } from "react-icons/io5";
import { IoIosRemove } from "react-icons/io";
import { useState } from "react";

interface ingredients {
  id: number;
  name: string;
  description: string;
  quantity: number;
}

const ingredientsList = [
  {
    id: 1,
    name: "Clássico do Amor",
    description: "Morangos cobertos com caramelo crocante",
    quantity: 0,
  },
  {
    id: 2,
    name: "Chocolate da Paixão",
    description: "Morangos com chocolate ao leite (ou meio amargo)",
    quantity: 0,
  },
  {
    id: 3,
    name: "Doce Tentação",
    description: "Morangos com chocolate branco e granulado colorido",
    quantity: 0,
  },
  {
    id: 4,
    name: "Delícia Tropical",
    description: "Morangos com cobertura de maracujá e coco ralado",
    quantity: 0,
  },
  {
    id: 5,
    name: "Sensação de Verão",
    description: "Morangos com cobertura de iogurte e frutas vermelhas",
    quantity: 0,
  },
];

export function AddProduct() {
  const [ingredients, setIngredients] =
    useState<ingredients[]>(ingredientsList);

    const [quantitySelectedIngredients, setQuantitySelectedIngredients] = useState(0);


  function decreaseQuantity(ingredientId: number) {
    setIngredients((prevIngredients) => {
      const updatedIngredients = prevIngredients.map((ingredient) => {
        if(ingredient.id === ingredientId && ingredient.quantity > 0) {
          return { ...ingredient, quantity: ingredient.quantity - 1 }
        }

        return ingredient
      });

      const wasDecremented = prevIngredients.find(i => i.id === ingredientId)?.quantity ?? 0;
      if(wasDecremented > 0) {
        setQuantitySelectedIngredients((prev) => prev - 1)
      }

      return updatedIngredients
    }) 
      
 
  }

function incrementQuantity(ingredientId: number) {
  setIngredients((prevIngredients) => {

    const updatedIngredients = prevIngredients.map((ingredient) => {
      if (ingredient.id === ingredientId && ingredient.quantity < 12) {
        setQuantitySelectedIngredients((prev) => prev + 1);// Marca que houve incremento
        return { ...ingredient, quantity: ingredient.quantity + 1 };
      }
      return ingredient;
    });


    return updatedIngredients;
  });
}



  return (
    <div className="max-w-[800px] mx-auto p-8 border-2 border-zinc-300 rounded-[25px] mt-5">
      <div className=" flex w-full flex-wrap">
        <div className="w-[100%] sm:w-[48%] md:w-[38%] mb-5">
          <img
            src={morango2}
            className="w-full h-[300px] object-cover rounded-2xl"
          />
        </div>
        <div className="w-[100%] sm:w-[48%] md:w-[62%] pl-4 flex flex-col justify-center items-center md:items-start">
          <h3 className="text-zinc-900 font-[600] text-[18px] text-center md:text-left">
            Promoção da Semana: “8 Morangos por 50% OFF”
          </h3>
          <p className="text-[16px] text-zinc-600 mt-1">por tempo limitado</p>
          <p className="text-[16px] text-zinc-600 mt-1">de</p>
          <span className="text-[16px] text-zinc-600 mt-1 line-through">
            R$ 40,00
          </span>
          <p className="text-[16px] text-zinc-600 mt-1">por</p>
          <span className="text-[22px] text-red-600 mt-2 font-[600] ">
            R$ 19,90
          </span>
        </div>
      </div>
      <div className="border-1 border-dashed border-zinc-300 rounded-[10px]  mt-5">
        <div className="bg-[#cecece] h-10 flex items-center justify-between py-8 px-4 ">
          <div className="flex flex-col">
            <h1 className="text-zinc-900 font-[600] text-[16px] leading-none">
              Escolha seus morangos
            </h1>{" "}
            <p className="leading-none text-[14px] text-zinc-600 mt-1">
              Escolha até 12 opções
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="bg-zinc-950 rounded-[5px] text-[8px] p-1.5">
              ${quantitySelectedIngredients}/12
            </span>
            <FaCheckCircle className="text-green-700 bg-white rounded-full text-[22px]" />
          </div>
        </div>

        {ingredients &&
          ingredients.map((ingredient) => (
            <div
              key={ingredient.id}
              
              className={`h-10 rounded-b-[0px] rounded-t-[10px] flex items-center justify-between py-10 px-4 border-b-1 border-dashed border-zinc-300 ${quantitySelectedIngredients === 12 && ingredient.quantity < 1 }`}
            >
              <div className="flex flex-col">
                <h1 className="text-zinc-900 font-[600] text-[16px] leading-none">
                  {ingredient.name}
                </h1>
                <p className="leading-none text-[14px] text-zinc-600 mt-1 italic">
                  {ingredient.description}
                </p>
              </div>
              <div className="flex items-center gap-2 border-2 border-zinc-300 rounded-[25px] py-1 px-5 text-[18px] gap-4">
                <button>
                  <IoIosRemove
                    onClick={() => decreaseQuantity(ingredient.id)}
                    className="text-gray-600 bg-white rounded-full text-[25px] cursor-pointer"
                  />
                </button>

                <span className="text-gray-600 select-none">
                  {ingredient.quantity}
                </span>
                <button>
                  <IoAdd
                    onClick={() => incrementQuantity(ingredient.id)}
                    className="text-gray-600 bg-white rounded-full text-[25px] cursor-pointer"
                  />
                </button>
              </div>
            </div>
          ))}
      </div>
      <div>
        <h1 className="text-zinc-900 font-[600] text-[16px] leading-none mt-5">
          Adicionar algum detalhe?
        </h1>
        <input className=" placeholder-gray-300 mt-3 w-full border-2 border-zinc-300 rounded-[25px] py-2 px-5 text-[18px] text-shadow-zinc-900" placeholder="Escreva o detalhe aqui..."></input>
      </div>
    </div>
  );
}
