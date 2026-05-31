import morango from "../assets/img/morango2.jpg";
import morango2 from "../assets/img/morango4.jpg";
import copo from "../assets/img/copo2.webp";

export interface Product {
  id: string;
  title: string;
  subtitle: string;
  oldPrice: number;
  newPrice: number;
  image: string;
  category: string;
  badge?: string;
  description?: string;
  extras?: string;
}

export const products: Product[] = [
  // Pague 1, Leve 2
  {
    id: "promo-8-morangos",
    title: "Promoção da Semana",
    subtitle: "8 Morangos por 50% OFF",
    oldPrice: 40.0,
    newPrice: 19.9,
    image: morango,
    category: "Pague 1, Leve 2",
    description: "por tempo limitado",
  },
  {
    id: "promo-12-morangos",
    title: "Promoção da Semana",
    subtitle: "12 Morangos por 50% OFF",
    oldPrice: 60.0,
    newPrice: 24.9,
    image: morango2,
    category: "Pague 1, Leve 2",
    description: "por tempo limitado",
  },
  {
    id: "copos-300ml",
    title: "2 Copos Açaí 300ml",
    subtitle: "9 Complementos Grátis",
    oldPrice: 39.8,
    newPrice: 23.9,
    image: copo,
    category: "Pague 1, Leve 2",
  },
  {
    id: "copos-500ml",
    title: "2 Copos Açaí 500ml",
    subtitle: "9 Complementos Grátis",
    oldPrice: 43.8,
    newPrice: 26.9,
    image: copo,
    category: "Pague 1, Leve 2",
  },
  {
    id: "copos-700ml",
    title: "2 Copos Açaí 700ml",
    subtitle: "9 Complementos Grátis",
    oldPrice: 53.8,
    newPrice: 29.9,
    image: copo,
    category: "Pague 1, Leve 2",
    badge: "MAIS VENDIDO",
    extras:
      "Mais que o dobro do Combo 1 por apenas R$7 a mais! A maioria dos clientes escolhe esse porque é o melhor custo-benefício!",
  },
  // Pague 1, Leve 2 - Zero Açúcar
  {
    id: "promo-8-morangos-zero",
    title: "Promoção da Semana",
    subtitle: "8 Morangos por 50% OFF",
    oldPrice: 40.0,
    newPrice: 19.9,
    image: morango,
    category: "Pague 1, Leve 2 - Zero Açúcar",
    description: "por tempo limitado",
  },
  {
    id: "promo-12-morangos-zero",
    title: "Promoção da Semana",
    subtitle: "12 Morangos por 50% OFF",
    oldPrice: 60.0,
    newPrice: 24.9,
    image: morango2,
    category: "Pague 1, Leve 2 - Zero Açúcar",
    description: "por tempo limitado",
  },
  {
    id: "copos-300ml-zero",
    title: "2 Copos Açaí 300ml",
    subtitle: "9 Complementos Grátis",
    oldPrice: 39.8,
    newPrice: 23.9,
    image: copo,
    category: "Pague 1, Leve 2 - Zero Açúcar",
  },
  {
    id: "copos-500ml-zero",
    title: "2 Copos Açaí 500ml",
    subtitle: "9 Complementos Grátis",
    oldPrice: 43.8,
    newPrice: 26.9,
    image: copo,
    category: "Pague 1, Leve 2 - Zero Açúcar",
  },
  {
    id: "copos-700ml-zero",
    title: "2 Copos Açaí 700ml",
    subtitle: "9 Complementos Grátis",
    oldPrice: 53.8,
    newPrice: 29.9,
    image: copo,
    category: "Pague 1, Leve 2 - Zero Açúcar",
    badge: "MAIS VENDIDO",
    extras:
      "Mais que o dobro do Combo 1 por apenas R$7 a mais! A maioria dos clientes escolhe esse porque é o melhor custo-benefício!",
  },
  // Açaí
  {
    id: "acai-8-morangos",
    title: "Promoção da Semana",
    subtitle: "8 Morangos por 50% OFF",
    oldPrice: 40.0,
    newPrice: 19.9,
    image: morango,
    category: "Açaí",
    description: "por tempo limitado",
  },
  {
    id: "acai-12-morangos",
    title: "Promoção da Semana",
    subtitle: "12 Morangos por 50% OFF",
    oldPrice: 60.0,
    newPrice: 24.9,
    image: morango2,
    category: "Açaí",
    description: "por tempo limitado",
  },
  {
    id: "acai-copos-300ml",
    title: "2 Copos Açaí 300ml",
    subtitle: "9 Complementos Grátis",
    oldPrice: 39.8,
    newPrice: 23.9,
    image: copo,
    category: "Açaí",
  },
  {
    id: "acai-copos-500ml",
    title: "2 Copos Açaí 500ml",
    subtitle: "9 Complementos Grátis",
    oldPrice: 43.8,
    newPrice: 26.9,
    image: copo,
    category: "Açaí",
  },
  {
    id: "acai-copos-700ml",
    title: "2 Copos Açaí 700ml",
    subtitle: "9 Complementos Grátis",
    oldPrice: 53.8,
    newPrice: 29.9,
    image: copo,
    category: "Açaí",
    badge: "MAIS VENDIDO",
    extras:
      "Mais que o dobro do Combo 1 por apenas R$7 a mais! A maioria dos clientes escolhe esse porque é o melhor custo-benefício!",
  },
  // Açaí Zero Açúcar
  {
    id: "acai-zero-8-morangos",
    title: "Promoção da Semana",
    subtitle: "8 Morangos por 50% OFF",
    oldPrice: 40.0,
    newPrice: 19.9,
    image: morango,
    category: "Açaí Zero Açúcar",
    description: "por tempo limitado",
  },
  {
    id: "acai-zero-12-morangos",
    title: "Promoção da Semana",
    subtitle: "12 Morangos por 50% OFF",
    oldPrice: 60.0,
    newPrice: 24.9,
    image: morango2,
    category: "Açaí Zero Açúcar",
    description: "por tempo limitado",
  },
  {
    id: "acai-zero-copos-300ml",
    title: "2 Copos Açaí 300ml",
    subtitle: "9 Complementos Grátis",
    oldPrice: 39.8,
    newPrice: 23.9,
    image: copo,
    category: "Açaí Zero Açúcar",
  },
  {
    id: "acai-zero-copos-500ml",
    title: "2 Copos Açaí 500ml",
    subtitle: "9 Complementos Grátis",
    oldPrice: 43.8,
    newPrice: 26.9,
    image: copo,
    category: "Açaí Zero Açúcar",
  },
];

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}
