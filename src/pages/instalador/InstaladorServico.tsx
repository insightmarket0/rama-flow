import React, { useState, useRef, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Check, Camera, Mic, CheckCircle2, PackagePlus, AlertCircle, X, ShoppingCart, DollarSign, ChevronRight } from "lucide-react";
import SignaturePad from "react-signature-canvas";

const MOCK_PIM = {
  "Instalação Kit Gás 2M": [
    { id: "item-1", nome: "Kit Mangueira 2 Metros", qtdPadrao: 1 },
    { id: "item-2", nome: "Registro de Baixa Pressão", qtdPadrao: 1 },
    { id: "item-3", nome: "Abraçadeira de Aço", qtdPadrao: 2 },
  ]
};

const ESTOQUE_VEICULO = [
  { nome: "Abraçadeira de Aço", preco: 5.00 },
  { nome: "Mangueira (Metro Extra)", preco: 25.00 },
  { nome: "Registro (Reserva)", preco: 45.00 },
  { nome: "Fita Veda Rosca", preco: 8.00 },
  { nome: "Válvula de Retenção", preco: 35.00 }
];

const JUSTIFICATIVAS = [
  "Estrutura fora do padrão",
  "Peça defeituosa / Quebra",
  "Solicitação Extra (Venda)", 
  "Outro (Detalhar)"
];

export default function InstaladorServico() {
  const { id } = useParams();
  const navigate = useNavigate();
  const signatureRef = useRef<SignaturePad>(null);
  
  const tipoServico = "Instalação Kit Gás 2M";
  const itensPadrao = MOCK_PIM[tipoServico as keyof typeof MOCK_PIM] || [];
  
  const [checklistPadrao, setChecklistPadrao] = useState(false);
  
  type ExtraItem = { id: number; nome: string; preco: number; qtd: number; justificativa: string; detalhe: string; isPago?: boolean; formaPagamento?: string };
  const [extras, setExtras] = useState<ExtraItem[]>([]);
  const [showAddExtra, setShowAddExtra] = useState(false);
  
  const [newExtra, setNewExtra] = useState({ nome: ESTOQUE_VEICULO[0].nome, qtd: 1, justificativa: JUSTIFICATIVAS[0], detalhe: "" });

  const [formaPagamentoCaixa, setFormaPagamentoCaixa] = useState("PIX");
  const [signatureData, setSignatureData] = useState<string | null>(null);

  const vendasExtrasPendentes = extras.filter(e => e.justificativa.includes("Venda") && !e.isPago);
  const totalPixPendente = vendasExtrasPendentes.reduce((acc, curr) => acc + (curr.preco * curr.qtd), 0);

  const isCompleted = useMemo(() => {
    if (!checklistPadrao || !signatureData) return false;
    if (vendasExtrasPendentes.length > 0) return false; 
    for (const extra of extras) {
      if (!extra.justificativa) return false;
      if (extra.justificativa === "Outro (Detalhar)" && !extra.detalhe.trim()) return false;
    }
    return true;
  }, [checklistPadrao, signatureData, extras, vendasExtrasPendentes]);

  const handleSaveSignature = () => {
    if (signatureRef.current && !signatureRef.current.isEmpty()) {
      setSignatureData(signatureRef.current.toDataURL());
    }
  };

  const handleClearSignature = () => {
    if (signatureRef.current) {
      signatureRef.current.clear();
      setSignatureData(null);
    }
  };

  const handleAddExtra = () => {
    if (newExtra.justificativa === "Outro (Detalhar)" && !newExtra.detalhe.trim()) {
      alert("Por favor, detalhe o motivo.");
      return;
    }
    
    const produtoSelecionado = ESTOQUE_VEICULO.find(item => item.nome === newExtra.nome);
    const preco = produtoSelecionado ? produtoSelecionado.preco : 0;

    setExtras([...extras, { ...newExtra, preco, id: Date.now(), isPago: false }]);
    setShowAddExtra(false);
    setNewExtra({ nome: ESTOQUE_VEICULO[0].nome, qtd: 1, justificativa: JUSTIFICATIVAS[0], detalhe: "" });
  };

  const removeExtra = (idToRemove: number) => {
    setExtras(extras.filter(e => e.id !== idToRemove));
  };

  const confirmarPagamento = () => {
    setExtras(extras.map(e => e.justificativa.includes("Venda") ? { ...e, isPago: true } : e));
  };

  return (
    <div className="flex flex-col min-h-[100dvh] bg-[#050505] text-white selection:bg-[#00FF00]/30">
      
      {/* Minimal Header */}
      <header className="sticky top-0 z-50 bg-[#050505]/80 backdrop-blur-xl pt-4 pb-4 px-6 flex flex-col gap-4">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors w-fit">
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Voltar</span>
        </button>
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">João da Silva</h1>
          <p className="text-[#00FF00] font-semibold text-xs tracking-widest uppercase mt-1 opacity-90">{tipoServico}</p>
        </div>
      </header>

      <main className="flex-1 px-6 py-4 flex flex-col gap-10 pb-32">
        
        {/* Ficha Técnica (BOM) - Clean List */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-gray-500" />
            <h3 className="text-gray-400 text-xs font-bold tracking-widest uppercase">Material Padrão</h3>
          </div>
          
          <div className="flex flex-col gap-3">
            {itensPadrao.map(item => (
              <div key={item.id} className="flex justify-between items-center border-b border-white/5 pb-3">
                <span className="text-gray-200 text-sm">{item.nome}</span>
                <span className="text-gray-500 font-medium text-sm">x{item.qtdPadrao}</span>
              </div>
            ))}
          </div>
          
          <label className="flex items-center gap-4 mt-2 cursor-pointer group">
            <div className={`w-6 h-6 rounded-md flex items-center justify-center transition-all duration-300 ${checklistPadrao ? 'bg-[#00FF00] text-black shadow-[0_0_15px_rgba(0,255,0,0.4)]' : 'bg-white/5 border border-white/10 text-transparent group-hover:bg-white/10'}`}>
              <Check className="w-4 h-4" strokeWidth={3} />
            </div>
            <span className={`text-sm font-medium transition-colors duration-300 ${checklistPadrao ? 'text-white' : 'text-gray-400'}`}>Confirmo o uso do material listado</span>
            <input type="checkbox" className="hidden" checked={checklistPadrao} onChange={() => setChecklistPadrao(!checklistPadrao)} />
          </label>
        </section>

        {/* Material Extra Minimalist */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              <h3 className="text-gray-400 text-xs font-bold tracking-widest uppercase">Itens Extras</h3>
            </div>
            <button 
              onClick={() => setShowAddExtra(!showAddExtra)}
              className="text-[#00FF00] text-sm font-medium flex items-center gap-1 hover:opacity-80 transition-opacity"
            >
              <PackagePlus className="w-4 h-4" /> Adicionar
            </button>
          </div>

          {showAddExtra && (
            <div className="bg-[#111111] rounded-2xl p-5 flex flex-col gap-4 animate-in slide-in-from-top-4 fade-in duration-300 border border-white/5">
              <select 
                value={newExtra.nome}
                onChange={e => setNewExtra({...newExtra, nome: e.target.value})}
                className="bg-transparent border-b border-white/10 pb-2 text-base text-white focus:outline-none focus:border-[#00FF00] transition-colors w-full"
              >
                {ESTOQUE_VEICULO.map(item => <option key={item.nome} value={item.nome} className="bg-[#111111]">{item.nome}</option>)}
              </select>

              <div className="flex gap-4">
                <input 
                  type="number" 
                  min="1"
                  value={newExtra.qtd}
                  onChange={e => setNewExtra({...newExtra, qtd: Number(e.target.value)})}
                  placeholder="Qtd" 
                  className="bg-transparent border-b border-white/10 pb-2 text-base text-white focus:outline-none focus:border-[#00FF00] transition-colors w-20 text-center" 
                />

                <select 
                  value={newExtra.justificativa}
                  onChange={e => setNewExtra({...newExtra, justificativa: e.target.value})}
                  className={`bg-transparent border-b pb-2 text-base focus:outline-none transition-colors w-full ${newExtra.justificativa.includes("Venda") ? 'border-[#00FF00] text-[#00FF00]' : 'border-white/10 text-white focus:border-[#00FF00]'}`}
                >
                  {JUSTIFICATIVAS.map(just => <option key={just} value={just} className="bg-[#111111] text-white">{just}</option>)}
                </select>
              </div>

              {newExtra.justificativa === "Outro (Detalhar)" && (
                <input 
                  placeholder="Detalhe o motivo..."
                  value={newExtra.detalhe}
                  onChange={e => setNewExtra({...newExtra, detalhe: e.target.value})}
                  className="bg-transparent border-b border-white/10 pb-2 text-base text-white focus:outline-none focus:border-[#00FF00] transition-colors w-full"
                />
              )}

              {newExtra.justificativa.includes("Venda") && (
                <div className="flex justify-between items-center py-2">
                  <span className="text-[#00FF00] text-xs font-bold uppercase tracking-wider">Total Extra</span>
                  <span className="text-[#00FF00] text-xl font-light">
                    R$ {((ESTOQUE_VEICULO.find(i => i.nome === newExtra.nome)?.preco || 0) * newExtra.qtd).toFixed(2).replace('.', ',')}
                  </span>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowAddExtra(false)} className="px-6 py-3 text-sm font-medium text-gray-400 hover:text-white">Cancelar</button>
                <button onClick={handleAddExtra} className={`flex-1 py-3 rounded-full text-sm font-bold text-black transition-transform active:scale-95 ${newExtra.justificativa.includes("Venda") ? 'bg-[#00FF00]' : 'bg-white'}`}>
                  {newExtra.justificativa.includes("Venda") ? 'Lançar Venda' : 'Confirmar'}
                </button>
              </div>
            </div>
          )}

          {/* Lista de Extras */}
          {extras.length > 0 && (
            <div className="flex flex-col gap-4 mt-2">
              {extras.map(extra => (
                <div key={extra.id} className="flex justify-between items-start group">
                  <div className="flex flex-col">
                    <span className={`text-base font-medium ${extra.justificativa.includes("Venda") ? 'text-[#00FF00]' : 'text-white'}`}>
                      {extra.nome} <span className="opacity-50 text-sm">x{extra.qtd}</span>
                    </span>
                    <span className="text-gray-500 text-xs mt-0.5">{extra.justificativa} {extra.detalhe && `- ${extra.detalhe}`}</span>
                    {extra.justificativa.includes("Venda") && (
                      <span className="text-[#00FF00] font-medium text-sm mt-1">R$ {(extra.preco * extra.qtd).toFixed(2).replace('.', ',')}</span>
                    )}
                  </div>
                  {!extra.isPago && (
                    <button onClick={() => removeExtra(extra.id)} className="p-2 text-gray-600 hover:text-red-500 transition-colors">
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Checkout Minimalist */}
          {vendasExtrasPendentes.length > 0 && (
            <div className="mt-6 bg-[#00FF00] text-black rounded-3xl p-6 flex flex-col gap-6 shadow-[0_10px_30px_rgba(0,255,0,0.15)]">
              <div className="flex justify-between items-end">
                <div className="flex flex-col">
                  <span className="text-black/60 font-bold text-[10px] tracking-widest uppercase">Pagamento Extra</span>
                  <span className="text-3xl font-extrabold tracking-tight">R$ {totalPixPendente.toFixed(2).replace('.', ',')}</span>
                </div>
                <ShoppingCart className="w-8 h-8 opacity-20" />
              </div>
              
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {["PIX", "Crédito", "Débito", "Dinheiro"].map((metodo) => (
                  <button 
                    key={metodo}
                    onClick={() => setFormaPagamentoCaixa(metodo)}
                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${formaPagamentoCaixa === metodo ? 'bg-black text-[#00FF00]' : 'bg-black/10 text-black/70 hover:bg-black/20'}`}
                  >
                    {metodo}
                  </button>
                ))}
              </div>

              {formaPagamentoCaixa === "PIX" && (
                <div className="w-full bg-white rounded-2xl flex flex-col items-center justify-center p-6 mt-2">
                  <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=PIX_RAMA_${totalPixPendente}`} alt="QR Code PIX" className="w-32 h-32" />
                </div>
              )}

              <button onClick={confirmarPagamento} className="w-full bg-black text-[#00FF00] py-4 rounded-full font-bold uppercase tracking-widest text-xs flex justify-center items-center gap-2 active:scale-95 transition-transform">
                <CheckCircle2 className="w-4 h-4" /> Pagamento Recebido
              </button>
            </div>
          )}
        </section>

        {/* Mídias */}
        <section className="flex gap-4">
          <button className="flex-1 bg-[#111111] border border-white/5 rounded-2xl p-5 flex flex-col gap-3 group hover:bg-[#151515] transition-colors">
            <Camera className="w-6 h-6 text-gray-400 group-hover:text-white transition-colors" />
            <span className="font-medium text-sm text-gray-300">Tirar Foto</span>
          </button>
          <button className="flex-1 bg-[#111111] border border-white/5 rounded-2xl p-5 flex flex-col gap-3 group hover:bg-[#151515] transition-colors">
            <Mic className="w-6 h-6 text-gray-400 group-hover:text-white transition-colors" />
            <span className="font-medium text-sm text-gray-300">Gravar Áudio</span>
          </button>
        </section>

        {/* Assinatura */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-gray-500" />
              <h3 className="text-gray-400 text-xs font-bold tracking-widest uppercase">Assinatura</h3>
            </div>
            {signatureData && <span className="text-[#00FF00] text-xs font-bold flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> OK</span>}
          </div>
          
          <div className="bg-white rounded-3xl overflow-hidden relative border border-white/5">
            <SignaturePad 
              ref={signatureRef}
              canvasProps={{className: "w-full h-48", style: { touchAction: "none" }}}
              onEnd={handleSaveSignature}
            />
            <button 
              onClick={handleClearSignature}
              className="absolute bottom-4 right-4 bg-gray-100 text-black/70 hover:bg-gray-200 hover:text-black px-4 py-2 rounded-full text-xs font-bold transition-colors"
            >
              Refazer
            </button>
          </div>
        </section>

      </main>

      {/* Modern FAB */}
      <div className="fixed bottom-[72px] left-0 right-0 px-6 z-40 pointer-events-none flex justify-end">
        <button 
          disabled={!isCompleted}
          onClick={() => navigate('/instalador')}
          className={`pointer-events-auto h-14 px-8 rounded-full font-bold text-sm tracking-widest uppercase flex items-center gap-3 shadow-2xl transition-all duration-500 active:scale-95 ${
            isCompleted 
              ? 'bg-[#00FF00] text-black hover:bg-[#00e500]' 
              : 'bg-[#111111] text-gray-600 border border-white/10 cursor-not-allowed opacity-80'
          }`}
        >
          {vendasExtrasPendentes.length > 0 
            ? 'Aguardando PIX'
            : isCompleted 
              ? 'Finalizar' 
              : 'Pendente'}
          {isCompleted && <ChevronRight className="w-5 h-5" />}
        </button>
      </div>

    </div>
  );
}
