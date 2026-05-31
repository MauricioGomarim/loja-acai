import logo from "../assets/img/logo.png";
import compra_segura from "../assets/img/compra-segura.webp";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useSettings } from "../context/SettingsContext";
import { IMaskInput } from "react-imask";

interface ViaCepResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
}

export function Checkout() {
  const navigate = useNavigate();
  const { items, totalPrice, clearCart } = useCart();
  const { user, addOrder } = useAuth();
  const { getEnabledMethods } = useSettings();
  const enabledMethods = getEnabledMethods();

  const [cep, setCep] = useState<string>("");
  const [cepDados, setDadosCep] = useState<ViaCepResponse>();
  const [step, setStep] = useState(1);
  const [entregaActive, setEntregaActive] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(
    enabledMethods[0]?.id || ""
  );
  const [orderPlaced, setOrderPlaced] = useState(false);

  // Auto-fill user data if logged in
  const [formData, setFormData] = useState({
    email: user?.email || "",
    phone: user?.phone || "",
    name: user?.name || "",
    cpf: "",
  });

  function nextStep(step: number) {
    setStep(step);
  }

  useEffect(() => {
    if (!cep || cep.length < 9) {
      setDadosCep(undefined);
    }

    async function fetchCep() {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        if (!response.ok) throw new Error("Erro na requisição");
        const data: ViaCepResponse = await response.json();
        setDadosCep(data);
      } catch (error) {
        console.error("Erro ao buscar CEP:", error);
      }
    }

    fetchCep();
  }, [cep]);

  async function handleFinishOrder() {
    const paymentMethod =
      enabledMethods.find((m) => m.id === selectedPayment)?.name || "PIX";

    try {
      await addOrder({
        items: items.map((item) => ({
          title: item.title,
          quantity: item.quantity,
          price: item.price,
          ingredients: item.ingredients,
          details: item.details,
        })),
        total: totalPrice,
        paymentMethod,
        deliveryAddress: cepDados ? `${cepDados.logradouro}, ${cepDados.bairro}` : undefined,
        deliveryCep: cep,
        deliveryNeighborhood: cepDados?.bairro,
        deliveryCity: cepDados?.localidade,
      });

      setOrderPlaced(true);
      clearCart();
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Erro ao finalizar pedido. Tente novamente.");
    }
  }

  if (items.length === 0 && !orderPlaced) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center p-6">
          <div className="w-20 h-20 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-10 h-10 text-zinc-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-zinc-900 mb-2">
            Carrinho vazio
          </h2>
          <p className="text-sm text-zinc-500 mb-4">
            Adicione itens ao carrinho para continuar
          </p>
          <button
            onClick={() => navigate("/")}
            className="bg-[#5b0e5c] text-white px-6 py-2.5 rounded-full font-medium"
          >
            Ver cardápio
          </button>
        </div>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center p-6 max-w-md">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-10 h-10 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-zinc-900 mb-2">
            Pedido realizado!
          </h2>
          <p className="text-zinc-500 mb-6">
            Seu pedido foi recebido e está sendo preparado. Acompanhe pelo seu
            perfil.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => navigate("/profile")}
              className="bg-[#5b0e5c] text-white px-6 py-2.5 rounded-full font-medium"
            >
              Ver meus pedidos
            </button>
            <button
              onClick={() => navigate("/")}
              className="bg-zinc-200 text-zinc-700 px-6 py-2.5 rounded-full font-medium"
            >
              Voltar ao início
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <header>
        <div className="w-full bg-[#6c009e] p-3">
          <h1 className="text-center text-white">
            Assim que sua compra for concluída, enviaremos o status da entrega
            pelo WhatsApp
          </h1>
        </div>
        <div className="max-w-[1250px] mx-auto py-5 flex justify-between items-center">
          <img className="w-35 h-full" src={logo} />
          <img className="w-60 h-full" src={compra_segura} />
        </div>
        <div className="w-full bg-[#3f0156] p-3">
          <h1 className="text-center text-white">
            Atenção! A oferta se encerrará assim que o Açaí acabar!
          </h1>
        </div>
      </header>

      <div className="flex max-w-[1250px] mx-auto py-15 gap-10 items-start justify-start">
        <div className="w-2/3 flex gap-10 items-start justify-start">
          <div className="w-1/2">
            <div
              className={`border-1 border-zinc-200 rounded-2xl p-5 mb-10 ${
                step == 1 ? "opacity-100" : "opacity-50"
              }`}
            >
              <h1 className="font-bold  text-[20px] flex gap-3 text-zinc-900">
                <span className="w-[15px] h-[15px] flex items-center justify-center rounded-full p-4 text-[20px] text-white bg-[#3f0154]">
                  1
                </span>
                Identificação
              </h1>

              {step == 1 ? (
                <>
                  <div className="grid w-full max-w-sm items-center gap-3 mt-5">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      type="email"
                      id="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                  </div>
                  <div className="grid w-full max-w-sm items-center gap-3 mt-5">
                    <Label htmlFor="telefone">Telefone</Label>
                    <Input
                      type="tel"
                      id="telefone"
                      placeholder="Telefone"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                    />
                  </div>
                  <div className="grid w-full max-w-sm items-center gap-3 mt-5">
                    <Label htmlFor="nome">Nome completo</Label>
                    <Input
                      type="text"
                      id="nome"
                      placeholder="Nome"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="grid w-full max-w-sm items-center gap-3 mt-5">
                    <Label htmlFor="cpf">CPF</Label>
                    <Input
                      type="text"
                      id="cpf"
                      placeholder="CPF"
                      value={formData.cpf}
                      onChange={(e) =>
                        setFormData({ ...formData, cpf: e.target.value })
                      }
                    />
                  </div>

                  <Button
                    className="mt-5 w-full bg-[#3f0156] !py-5 cursor-pointer"
                    onClick={() => nextStep(2)}
                  >
                    Ir para entrega
                  </Button>
                </>
              ) : null}
            </div>

            <div
              className={`border-1 border-zinc-200 rounded-2xl p-5 mb-10 ${
                step == 2 || step == 3 ? "opacity-100" : "opacity-50"
              }`}
            >
              <h1 className="font-bold text-zinc-900 text-[20px] flex gap-3">
                <span className="w-[15px] h-[15px] flex items-center justify-center rounded-full p-4 text-[20px] text-white bg-[#3f0154]">
                  2
                </span>
                Entrega
              </h1>

              {step == 2 || step == 3 ? (
                <>
                  {entregaActive == false ? (
                    <>
                      <div className="grid w-full max-w-sm items-center gap-3 mt-5">
                        <Label htmlFor="cep">CEP</Label>
                        <IMaskInput
                          mask="00000-000"
                          placeholder="00000-000"
                          value={cep}
                          onAccept={(value: string) => setCep(value)}
                          className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        />
                      </div>

                      {cepDados ? (
                        <>
                          <div className="grid w-full max-w-sm items-center gap-3 mt-5">
                            <span>{cepDados.localidade}</span>
                            <Label htmlFor="endereco">Endereço</Label>
                            <Input
                              type="text"
                              id="endereco"
                              placeholder=""
                              value={cepDados.logradouro}
                            />
                          </div>

                          <div className="w-full flex max-w-sm items-center gap-3 mt-5">
                            <div className="w-1/3 grid w-full max-w-sm items-center gap-3 mt-5">
                              <Label htmlFor="numero">Número</Label>
                              <Input type="text" id="numero" placeholder="" />
                            </div>
                            <div className="w-2/3 grid w-full max-w-sm items-center gap-3 mt-5">
                              <Label htmlFor="bairro">Bairro</Label>
                              <Input
                                type="text"
                                id="bairro"
                                value={cepDados.bairro}
                                placeholder=""
                              />
                            </div>
                          </div>

                          <div className="grid w-full max-w-sm items-center gap-3 mt-5">
                            <Label htmlFor="complemento">
                              Complemento (opcional)
                            </Label>
                            <Input
                              type="text"
                              id="complemento"
                              placeholder=""
                            />
                          </div>
                          <div className="grid w-full max-w-sm items-center gap-3 mt-5">
                            <Label htmlFor="destinatário">Destinatário</Label>
                            <Input
                              type="text"
                              id="destinatário"
                              placeholder=""
                            />
                          </div>

                          <Button
                            className="mt-5  w-full bg-[#3f0156] !py-5"
                            onClick={() => setEntregaActive(true)}
                          >
                            Continuar
                          </Button>
                        </>
                      ) : null}
                    </>
                  ) : (
                    <div>
                      <Button
                        className="mt-5  w-full bg-[#3f0156] !py-5"
                        onClick={() => nextStep(4)}
                      >
                        Continuar
                      </Button>
                    </div>
                  )}
                </>
              ) : null}
            </div>
          </div>

          <div
            className={`w-1/2 border-1 border-zinc-200 rounded-2xl p-5 ${
              step == 4 ? "opacity-100" : "opacity-50"
            }`}
          >
            <h1 className="font-bold text-zinc-900  text-[20px]  flex gap-3">
              <span className="w-[15px] h-[15px] flex items-center justify-center rounded-full p-4 text-[20px] text-white bg-[#3f0154]">
                3
              </span>
              Pagamento
            </h1>
            {step == 4 ? (
              <>
                <p className="mt-3 text-zinc-600">
                  Escolha uma forma de pagamento
                </p>

                <RadioGroup
                  value={selectedPayment}
                  onValueChange={setSelectedPayment}
                  className="py-5"
                >
                  {enabledMethods.map((method) => (
                    <div
                      key={method.id}
                      className="flex items-center space-x-2"
                    >
                      <RadioGroupItem value={method.id} id={method.id} />
                      <Label htmlFor={method.id}>{method.name}</Label>
                    </div>
                  ))}
                </RadioGroup>

                {selectedPayment === "pix" && (
                  <div className="bg-zinc-50 p-4 rounded-xl mb-4">
                    <p className="text-sm text-zinc-600 mb-2">
                      Chave PIX para pagamento:
                    </p>
                    <p className="font-mono text-sm bg-white p-2 rounded border border-zinc-200">
                      {enabledMethods.find((m) => m.id === "pix")?.pixKey ||
                        "14999999999"}
                    </p>
                    <p className="text-xs text-zinc-500 mt-2">
                      Após finalizar, envie o comprovante pelo WhatsApp
                    </p>
                  </div>
                )}

                {!user && (
                  <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl mb-4">
                    <p className="text-sm text-amber-700">
                      Faça{" "}
                      <a href="/login" className="font-medium underline">
                        login
                      </a>{" "}
                      para acompanhar seus pedidos
                    </p>
                  </div>
                )}

                <Button
                  className="mt-5 w-full bg-[#3f0156] !py-5"
                  onClick={handleFinishOrder}
                >
                  Finalizar pagamento
                </Button>
              </>
            ) : null}
          </div>
        </div>

        <div className="w-1/3">
          <h1 className="font-bold text-zinc-900 text-[20px] flex gap-5 mb-4">
            Resumo
          </h1>

          <div className="border border-zinc-200 rounded-2xl p-5">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center py-3 border-b border-zinc-100 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                  <div>
                    <p className="text-sm font-medium text-zinc-900">
                      {item.title}
                    </p>
                    <p className="text-xs text-zinc-500">
                      {item.quantity}x R${" "}
                      {item.price.toFixed(2).replace(".", ",")}
                    </p>
                  </div>
                </div>
                <span className="font-medium text-zinc-900">
                  R$ {(item.price * item.quantity).toFixed(2).replace(".", ",")}
                </span>
              </div>
            ))}

            <div className="border-t border-zinc-200 mt-3 pt-3">
              <div className="flex justify-between mb-1">
                <span className="text-sm text-zinc-500">Subtotal</span>
                <span className="text-sm text-zinc-700">
                  R$ {totalPrice.toFixed(2).replace(".", ",")}
                </span>
              </div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-zinc-500">Entrega</span>
                <span className="text-sm text-green-600">Grátis</span>
              </div>
              <div className="flex justify-between mt-3 pt-3 border-t border-zinc-200">
                <span className="font-bold text-zinc-900">Total</span>
                <span className="font-bold text-lg text-zinc-900">
                  R$ {totalPrice.toFixed(2).replace(".", ",")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
