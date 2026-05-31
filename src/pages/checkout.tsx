import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useSettings } from "../context/SettingsContext";
import { api } from "../lib/api";
import type { PixPayment } from "../lib/api";
import { IMaskInput } from "react-imask";

interface ViaCepResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
}

const STEPS = [
  { id: 1, label: "Identificação", icon: "1" },
  { id: 2, label: "Entrega", icon: "2" },
  { id: 3, label: "Pagamento", icon: "3" },
];

export function Checkout() {
  const navigate = useNavigate();
  const { items, totalPrice, clearCart } = useCart();
  const { user, addOrder } = useAuth();
  const { getEnabledMethods } = useSettings();
  const enabledMethods = getEnabledMethods();

  const [step, setStep] = useState(1);
  const [selectedPayment, setSelectedPayment] = useState(
    enabledMethods[0]?.id || ""
  );
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState<string | null>(null);
  const [showPixQr, setShowPixQr] = useState(false);

  // PIX state
  const [pixData, setPixData] = useState<PixPayment | null>(null);
  const [pixLoading, setPixLoading] = useState(false);
  const [pixPaid, setPixPaid] = useState(false);
  const [copied, setCopied] = useState(false);

  // Address
  const [cep, setCep] = useState("");
  const [cepDados, setDadosCep] = useState<ViaCepResponse | null>(null);
  const [cepLoading, setCepLoading] = useState(false);
  const [numero, setNumero] = useState("");
  const [complemento, setComplemento] = useState("");

  // Form
  const [formData, setFormData] = useState({
    email: user?.email || "",
    phone: user?.phone || "",
    name: user?.name || "",
  });

  // CEP lookup
  useEffect(() => {
    if (!cep || cep.length < 9) {
      setDadosCep(null);
      return;
    }
    let cancelled = false;
    setCepLoading(true);
    fetch(`https://viacep.com.br/ws/${cep}/json/`)
      .then((r) => r.json())
      .then((data: ViaCepResponse) => {
        if (!cancelled && !data.cep) setDadosCep(null);
        if (!cancelled && data.cep) setDadosCep(data);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setCepLoading(false);
      });
    return () => { cancelled = true; };
  }, [cep]);

  // PIX polling
  useEffect(() => {
    if (!pixData?.paymentId || pixPaid) return;
    const interval = setInterval(async () => {
      try {
        const status = await api.checkPixPaymentStatus(pixData.paymentId);
        if (status.status === "approved") {
          setPixPaid(true);
          clearInterval(interval);
        }
      } catch {}
    }, 3000);
    return () => clearInterval(interval);
  }, [pixData?.paymentId, pixPaid]);

  const handleGeneratePix = useCallback(async (orderId?: string) => {
    setPixLoading(true);
    try {
      const result = await api.createPixPayment({
        amount: totalPrice,
        description: `Pedido Açaí Delli #${orderId || Date.now()}`,
        payerEmail: formData.email || undefined,
        orderId,
      });
      setPixData(result);
    } catch (err) {
      console.error("Erro ao gerar PIX:", err);
      alert("Erro ao gerar QR Code PIX. Tente novamente.");
    } finally {
      setPixLoading(false);
    }
  }, [totalPrice, formData.email]);

  const handleCopyCode = useCallback(() => {
    if (pixData?.qrCode) {
      navigator.clipboard.writeText(pixData.qrCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [pixData?.qrCode]);

  const handleFinishOrder = useCallback(async () => {
    setPlacing(true);
    try {
      const paymentMethod = enabledMethods.find((m) => m.id === selectedPayment)?.name || "PIX";
      const order = await addOrder({
        items: items.map((item) => ({
          title: item.title,
          quantity: item.quantity,
          price: item.price,
          ingredients: item.ingredients,
          details: item.details,
        })),
        total: totalPrice,
        paymentMethod,
        deliveryAddress: cepDados ? `${cepDados.logradouro}, ${numero}` : undefined,
        deliveryCep: cep || undefined,
        deliveryNeighborhood: cepDados?.bairro,
        deliveryCity: cepDados?.localidade,
        deliveryComplement: complemento || undefined,
      });
      clearCart();

      if (selectedPayment === "pix") {
        setCreatedOrderId(order.id);
        setShowPixQr(true);
        await handleGeneratePix(order.id);
      } else {
        setOrderPlaced(true);
      }
    } catch (err) {
      console.error("Error placing order:", err);
      alert("Erro ao finalizar pedido. Tente novamente.");
    } finally {
      setPlacing(false);
    }
  }, [selectedPayment, enabledMethods, items, totalPrice, cepDados, cep, numero, complemento, addOrder, clearCart, handleGeneratePix]);

  // When PIX payment is confirmed, show success
  useEffect(() => {
    if (pixPaid && showPixQr) {
      setOrderPlaced(true);
    }
  }, [pixPaid, showPixQr]);

  // ---- EMPTY CART ----
  if (items.length === 0 && !orderPlaced && !showPixQr) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-24 h-24 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <svg className="w-12 h-12 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-zinc-900 mb-2">Carrinho vazio</h2>
          <p className="text-zinc-500 mb-6">Adicione itens ao carrinho para continuar</p>
          <button onClick={() => navigate("/")} className="bg-[#5b0e5c] text-white px-8 py-3 rounded-full font-semibold active:scale-95 transition-transform">
            Ver cardápio
          </button>
        </div>
      </div>
    );
  }

  // ---- ORDER PLACED ----
  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <svg className="w-12 h-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-zinc-900 mb-2">Pedido realizado!</h2>
          <p className="text-zinc-500 mb-8">Seu pedido foi recebido e está sendo preparado. Acompanhe pelo seu perfil.</p>
          <div className="flex flex-col gap-3">
            <button onClick={() => navigate("/profile")} className="bg-[#5b0e5c] text-white px-6 py-3 rounded-full font-semibold active:scale-95 transition-transform">
              Ver meus pedidos
            </button>
            <button onClick={() => navigate("/")} className="bg-zinc-200 text-zinc-700 px-6 py-3 rounded-full font-semibold active:scale-95 transition-transform">
              Voltar ao início
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ---- MAIN CHECKOUT ----
  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Header */}
      <div className="bg-[#5b0e5c] text-white text-center py-3 px-4 text-sm font-medium">
        Assim que sua compra for concluída, enviaremos o status da entrega pelo WhatsApp
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 lg:flex lg:gap-8 lg:items-start">
        {/* LEFT: Steps */}
        <div className="flex-1 min-w-0">
          {/* Stepper */}
          <div className="flex items-center justify-center gap-2 mb-6">
            {STEPS.map((s, i) => (
              <div key={s.id} className="flex items-center">
                <button
                  onClick={() => s.id < step && setStep(s.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-semibold transition-all ${
                    step === s.id
                      ? "bg-[#5b0e5c] text-white shadow-lg shadow-purple-200"
                      : step > s.id
                      ? "bg-green-100 text-green-700"
                      : "bg-zinc-100 text-zinc-400"
                  }`}
                >
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    step > s.id ? "bg-green-500 text-white" : step === s.id ? "bg-white/20" : ""
                  }`}>
                    {step > s.id ? "✓" : s.icon}
                  </span>
                  <span className="hidden sm:inline">{s.label}</span>
                </button>
                {i < STEPS.length - 1 && (
                  <div className={`w-8 h-0.5 mx-1 ${step > s.id ? "bg-green-400" : "bg-zinc-200"}`} />
                )}
              </div>
            ))}
          </div>

          {/* STEP 1: Identificação */}
          {step === 1 && (
            <div className="bg-white rounded-2xl shadow-sm border border-zinc-100 p-5 mb-4">
              <h2 className="text-lg font-bold text-zinc-900 mb-5 flex items-center gap-2">
                <span className="w-7 h-7 bg-[#5b0e5c] text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
                Identificação
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1.5">Email</label>
                  <input
                    type="email"
                    placeholder="seu@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full h-12 px-4 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#5b0e5c]/30 focus:border-[#5b0e5c] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1.5">Telefone</label>
                  <IMaskInput
                    mask="(00) 00000-0000"
                    placeholder="(00) 00000-0000"
                    value={formData.phone}
                    onAccept={(value: string) => setFormData({ ...formData, phone: value })}
                    className="w-full h-12 px-4 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#5b0e5c]/30 focus:border-[#5b0e5c] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1.5">Nome completo</label>
                  <input
                    type="text"
                    placeholder="Seu nome"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full h-12 px-4 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#5b0e5c]/30 focus:border-[#5b0e5c] transition-all"
                  />
                </div>
              </div>
              <button
                onClick={() => setStep(2)}
                className="w-full mt-6 bg-[#5b0e5c] text-white py-3.5 rounded-full font-semibold text-sm active:scale-[0.98] transition-transform shadow-lg shadow-purple-200"
              >
                Ir para entrega
              </button>
            </div>
          )}

          {/* STEP 2: Entrega */}
          {step === 2 && (
            <div className="bg-white rounded-2xl shadow-sm border border-zinc-100 p-5 mb-4">
              <h2 className="text-lg font-bold text-zinc-900 mb-5 flex items-center gap-2">
                <span className="w-7 h-7 bg-[#5b0e5c] text-white rounded-full flex items-center justify-center text-xs font-bold">2</span>
                Entrega
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1.5">CEP</label>
                  <IMaskInput
                    mask="00000-000"
                    placeholder="00000-000"
                    value={cep}
                    onAccept={(value: string) => setCep(value)}
                    className="w-full h-12 px-4 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#5b0e5c]/30 focus:border-[#5b0e5c] transition-all"
                  />
                  {cepLoading && <p className="text-xs text-zinc-400 mt-1">Buscando endereço...</p>}
                </div>

                {cepDados && (
                  <>
                    <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-sm text-green-700">
                      {cepDados.localidade} - {cepDados.uf}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 mb-1.5">Endereço</label>
                      <input
                        type="text"
                        value={cepDados.logradouro}
                        readOnly
                        className="w-full h-12 px-4 rounded-xl border border-zinc-200 text-sm bg-zinc-50 text-zinc-500"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-zinc-700 mb-1.5">Número</label>
                        <input
                          type="text"
                          placeholder="123"
                          value={numero}
                          onChange={(e) => setNumero(e.target.value)}
                          className="w-full h-12 px-4 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#5b0e5c]/30 focus:border-[#5b0e5c]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-zinc-700 mb-1.5">Bairro</label>
                        <input
                          type="text"
                          value={cepDados.bairro}
                          readOnly
                          className="w-full h-12 px-4 rounded-xl border border-zinc-200 text-sm bg-zinc-50 text-zinc-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 mb-1.5">Complemento (opcional)</label>
                      <input
                        type="text"
                        placeholder="Apto, bloco, etc."
                        value={complemento}
                        onChange={(e) => setComplemento(e.target.value)}
                        className="w-full h-12 px-4 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#5b0e5c]/30 focus:border-[#5b0e5c]"
                      />
                    </div>
                  </>
                )}
              </div>
              {cepDados && (
                <button
                  onClick={() => setStep(3)}
                  className="w-full mt-6 bg-[#5b0e5c] text-white py-3.5 rounded-full font-semibold text-sm active:scale-[0.98] transition-transform shadow-lg shadow-purple-200"
                >
                  Continuar para pagamento
                </button>
              )}
            </div>
          )}

          {/* STEP 3: Pagamento */}
          {step === 3 && (
            <div className="bg-white rounded-2xl shadow-sm border border-zinc-100 p-5 mb-4">
              <h2 className="text-lg font-bold text-zinc-900 mb-5 flex items-center gap-2">
                <span className="w-7 h-7 bg-[#5b0e5c] text-white rounded-full flex items-center justify-center text-xs font-bold">3</span>
                {showPixQr ? "Pagamento PIX" : "Pagamento"}
              </h2>

              {/* After order created: show only QR Code for PIX */}
              {showPixQr ? (
                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-5">
                  {pixLoading && (
                    <div className="text-center py-8">
                      <div className="w-10 h-10 border-3 border-[#5b0e5c] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                      <p className="text-sm text-zinc-600">Gerando QR Code PIX...</p>
                    </div>
                  )}

                  {pixData && !pixPaid && (
                    <div className="text-center">
                      <p className="text-sm text-zinc-600 mb-4">
                        Pedido <span className="font-bold">#{createdOrderId}</span> criado! Realize o pagamento abaixo.
                      </p>
                      {pixData.qrCodeBase64 && (
                        <div className="bg-white p-4 rounded-xl inline-block mb-4 shadow-sm">
                          <img
                            src={`data:image/png;base64,${pixData.qrCodeBase64}`}
                            alt="QR Code PIX"
                            className="w-48 h-48 sm:w-56 sm:h-56"
                          />
                        </div>
                      )}
                      <p className="text-sm text-zinc-600 mb-3">
                        Escaneie o QR Code acima ou copie o código abaixo
                      </p>
                      {pixData.qrCode && (
                        <div className="bg-white rounded-xl p-3 mb-4">
                          <p className="text-xs text-zinc-500 mb-2">PIX Copia e Cola:</p>
                          <p className="font-mono text-xs text-zinc-700 break-all bg-zinc-50 p-2 rounded-lg mb-2">
                            {pixData.qrCode}
                          </p>
                          <button
                            onClick={handleCopyCode}
                            className={`w-full py-2.5 rounded-lg text-sm font-semibold transition-all active:scale-[0.98] ${
                              copied
                                ? "bg-green-500 text-white"
                                : "bg-[#5b0e5c] text-white"
                            }`}
                          >
                            {copied ? "Copiado!" : "Copiar código PIX"}
                          </button>
                        </div>
                      )}
                      <div className="flex items-center justify-center gap-2 text-xs text-zinc-500">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                        Aguardando pagamento...
                      </div>
                    </div>
                  )}

                  {pixPaid && (
                    <div className="text-center py-4">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <p className="font-bold text-green-700">Pagamento confirmado!</p>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  {/* Payment method selector */}
                  <div className="space-y-2 mb-5">
                    {enabledMethods.map((method) => (
                      <label
                        key={method.id}
                        className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          selectedPayment === method.id
                            ? "border-[#5b0e5c] bg-purple-50"
                            : "border-zinc-100 hover:border-zinc-200"
                        }`}
                      >
                        <input
                          type="radio"
                          name="payment"
                          value={method.id}
                          checked={selectedPayment === method.id}
                          onChange={() => setSelectedPayment(method.id)}
                          className="w-4 h-4 accent-[#5b0e5c]"
                        />
                        <span className="font-medium text-sm text-zinc-800">{method.name}</span>
                      </label>
                    ))}
                  </div>

                  {/* Login hint */}
                  {!user && (
                    <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl mb-4 text-sm text-amber-700">
                      Faça <a href="/login" className="font-semibold underline">login</a> para acompanhar seus pedidos
                    </div>
                  )}

                  <button
                    onClick={handleFinishOrder}
                    disabled={placing}
                    className="w-full bg-[#5b0e5c] text-white py-3.5 rounded-full font-semibold text-sm active:scale-[0.98] transition-transform shadow-lg shadow-purple-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {placing ? "Finalizando..." : "Finalizar pedido"}
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {/* RIGHT: Resumo */}
        <div className="lg:w-80 mt-4 lg:mt-0">
          <div className="bg-white rounded-2xl shadow-sm border border-zinc-100 p-5 lg:sticky lg:top-4">
            <h3 className="font-bold text-zinc-900 mb-4">Resumo do pedido</h3>
            <div className="space-y-3 mb-4">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-11 h-11 object-cover rounded-lg flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-zinc-900 truncate">{item.title}</p>
                    <p className="text-xs text-zinc-500">{item.quantity}x R$ {item.price.toFixed(2).replace(".", ",")}</p>
                  </div>
                  <span className="text-sm font-semibold text-zinc-900 flex-shrink-0">
                    R$ {(item.price * item.quantity).toFixed(2).replace(".", ",")}
                  </span>
                </div>
              ))}
            </div>
            <div className="border-t border-zinc-100 pt-3 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500">Subtotal</span>
                <span className="text-zinc-700">R$ {totalPrice.toFixed(2).replace(".", ",")}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500">Entrega</span>
                <span className="text-green-600 font-medium">Grátis</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-zinc-100">
                <span className="font-bold text-zinc-900">Total</span>
                <span className="font-bold text-lg text-[#5b0e5c]">R$ {totalPrice.toFixed(2).replace(".", ",")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
