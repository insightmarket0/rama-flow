import React, { useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, MapPin, Clock, Camera, Mic, Plus, CheckCircle2, ChevronRight, X, Package, ShoppingCart, Navigation, Minus } from "lucide-react";
import SignaturePad from "react-signature-canvas";
import { toast } from "sonner";
import { useAgendaStore } from "../../store/useAgendaStore";
import { useInstallTickets } from "../../hooks/useInstallTickets";
import { useEstoqueStore } from "../../store/useEstoqueStore";

export default function InstaladorServico() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const servicos = useAgendaStore(state => state.servicos);
  const deleteServico = useAgendaStore(state => state.deleteServico);
  const { updateStatus } = useInstallTickets();
  const estoqueItens = useEstoqueStore(state => state.itens);
  const deduzirEstoque = useEstoqueStore(state => state.deduzirEstoque);
  
  // Encontra o serviço real na agenda
  const servicoReal = servicos.find(s => s.id === id);
  const MOCK_SERVICO = servicoReal ? {
    id: servicoReal.id,
    cliente: servicoReal.cliente,
    endereco: servicoReal.endereco,
    horario: servicoReal.horario,
    tipo: servicoReal.tipo,
    valorTotal: servicoReal.valor,
    pagamentoPrevisto: "PIX"
  } : {
    id: "N/A",
    cliente: "Serviço Não Encontrado",
    endereco: "N/A",
    horario: "00:00",
    tipo: "N/A",
    valorTotal: 0,
    pagamentoPrevisto: "PIX"
  };

  const signatureRef = useRef<any>(null);
  const [signatureData, setSignatureData] = useState<string | null>(null);
  const [extras, setExtras] = useState<any[]>([]);
  const [showAddExtra, setShowAddExtra] = useState(false);
  const [newExtra, setNewExtra] = useState({ nome: "", qtd: 1, justificativa: "Reposição/Garantia", detalhe: "", isPago: false, preco: 0 });
  const [formaPagamentoCaixa, setFormaPagamentoCaixa] = useState("PIX");

  const handleClearSignature = () => {
    signatureRef.current?.clear();
    setSignatureData(null);
  };

  const handleSaveSignature = () => {
    if (signatureRef.current && !signatureRef.current.isEmpty()) {
      setSignatureData(signatureRef.current.toDataURL());
    }
  };

  const handleAddExtra = () => {
    if (!newExtra.nome) return;
    const itemEstoque = estoqueItens.find(i => i.nome === newExtra.nome);
    const preco = itemEstoque ? itemEstoque.preco : 0;
    
    setExtras([...extras, { ...newExtra, id: Date.now(), preco }]);
    setShowAddExtra(false);
    setNewExtra({ nome: "", qtd: 1, justificativa: "Reposição/Garantia", detalhe: "", isPago: false, preco: 0 });
  };

  const removeExtra = (extraId: number) => {
    setExtras(extras.filter(e => e.id !== extraId));
  };

  const confirmarPagamento = () => {
    setExtras(extras.map(e => e.justificativa.includes("Venda") ? { ...e, isPago: true } : e));
  };

  const handleFinalizar = () => {
    if (id) {
      // Deduzir tudo que foi usado do estoque real
      extras.forEach(extra => {
        deduzirEstoque(extra.nome, extra.qtd);
      });

      // Baixa no app mobile
      deleteServico(id);
      
      // Baixa no CRM (Operação Externa)
      updateStatus(id, 'completed');
    }
    toast.success('Serviço finalizado com sucesso!');
    navigate('/instalador');
  };

  const vendasExtrasPendentes = extras.filter(e => e.justificativa.includes("Venda") && !e.isPago);
  const totalPixPendente = vendasExtrasPendentes.reduce((acc, curr) => acc + (curr.preco * curr.qtd), 0);
  const isCompleted = signatureData !== null && vendasExtrasPendentes.length === 0;

  return (
    <div className="flex flex-col min-h-[100dvh] bg-[#F8F9FA] text-[#1A1C1E] selection:bg-purple-200">
      
      {/* Header Soft */}
      <header className="sticky top-0 z-40 bg-[#F8F9FA]/90 backdrop-blur-xl pt-2 pb-2 px-6 flex items-center justify-between border-b border-gray-200/50">
        <button onClick={() => navigate('/instalador')} className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-600 shadow-sm border border-gray-100 hover:bg-gray-50 active:scale-95 transition-all">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex flex-col items-end">
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">OS #{MOCK_SERVICO.id}</span>
          <span className="text-purple-600 text-xs font-bold uppercase tracking-widest">Em Andamento</span>
        </div>
      </header>

      <main className="flex-1 px-6 py-6 flex flex-col gap-8 pb-40">
        
        {/* Info Principal */}
        <section className="flex flex-col gap-2">
          <h1 className="text-3xl font-black tracking-tight leading-none text-[#1A1C1E]">{MOCK_SERVICO.cliente}</h1>
          <p className="text-purple-600 font-medium">{MOCK_SERVICO.tipo}</p>
          
          <div className="flex flex-col gap-3 mt-4 bg-white p-5 rounded-3xl shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-gray-50">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                <span className="text-sm text-gray-600 font-medium leading-relaxed">{MOCK_SERVICO.endereco}</span>
              </div>
              <button 
                onClick={() => window.open(`https://waze.com/ul?q=${encodeURIComponent(MOCK_SERVICO.endereco)}`, '_blank')}
                className="shrink-0 px-3 py-1.5 rounded-full bg-purple-100 text-purple-600 text-[10px] font-bold uppercase tracking-widest hover:bg-purple-200 transition-colors flex items-center gap-1"
              >
                <Navigation className="w-3 h-3" /> Waze
              </button>
            </div>
            <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
              <Clock className="w-5 h-5 text-gray-400" />
              <span className="text-sm font-bold text-gray-800">Agendado para {MOCK_SERVICO.horario}</span>
            </div>
          </div>
        </section>

        {/* Uso de Estoque / Baixa */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-gray-500 text-xs font-bold tracking-widest uppercase flex items-center gap-2">
              <Package className="w-4 h-4" /> Uso de Material
            </h3>
            {!showAddExtra && (
              <button onClick={() => setShowAddExtra(true)} className="text-purple-600 bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-full flex items-center gap-1 text-xs font-bold transition-colors">
                <Plus className="w-3 h-3" /> Registrar Uso
              </button>
            )}
          </div>

          {/* Form ADD */}
          {showAddExtra && (
            <div className="bg-white rounded-3xl p-5 flex flex-col gap-5 border border-purple-100 shadow-sm animate-in fade-in slide-in-from-top-2">
              <select 
                value={newExtra.nome}
                onChange={e => setNewExtra({...newExtra, nome: e.target.value})}
                className="bg-transparent border-b border-gray-200 pb-2 text-base text-gray-900 focus:outline-none focus:border-purple-500 transition-colors"
              >
                <option value="" disabled>Selecione um item da Van...</option>
                {estoqueItens.map(i => <option key={i.id} value={i.nome}>{i.nome}</option>)}
              </select>

              <div className="flex items-center gap-4">
                <span className="text-xs text-gray-500 uppercase font-bold tracking-widest w-16">Qtd:</span>
                <div className="flex items-center gap-4 bg-gray-50 rounded-full px-2 py-1 border border-gray-100">
                  <button onClick={() => setNewExtra({...newExtra, qtd: Math.max(1, newExtra.qtd - 1)})} className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm text-gray-600 active:scale-95"><Minus className="w-4 h-4" /></button>
                  <span className="font-bold text-lg w-4 text-center">{newExtra.qtd}</span>
                  <button onClick={() => setNewExtra({...newExtra, qtd: newExtra.qtd + 1})} className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm text-gray-600 active:scale-95"><Plus className="w-4 h-4" /></button>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-xs text-gray-500 uppercase font-bold tracking-widest w-16">Motivo:</span>
                <select 
                  value={newExtra.justificativa}
                  onChange={e => setNewExtra({...newExtra, justificativa: e.target.value})}
                  className="bg-transparent border-b border-gray-200 pb-2 text-sm text-gray-900 focus:outline-none focus:border-purple-500 transition-colors"
                >
                  <option>Reposição/Garantia</option>
                  <option>Ajuste de Instalação</option>
                  <option>Venda Extra p/ Cliente</option>
                  <option>Outro (Detalhar)</option>
                </select>
              </div>

              {newExtra.justificativa === "Outro (Detalhar)" && (
                <input 
                  placeholder="Detalhe o motivo..."
                  value={newExtra.detalhe}
                  onChange={e => setNewExtra({...newExtra, detalhe: e.target.value})}
                  className="bg-transparent border-b border-gray-200 pb-2 text-base text-gray-900 focus:outline-none focus:border-purple-500 transition-colors w-full"
                />
              )}

              {newExtra.justificativa.includes("Venda") && (
                <div className="flex justify-between items-center py-2 bg-purple-50 px-4 rounded-xl">
                  <span className="text-purple-600 text-xs font-bold uppercase tracking-wider">Total Extra</span>
                  <span className="text-purple-700 text-xl font-black">
                    R$ {((estoqueItens.find(i => i.nome === newExtra.nome)?.preco || 0) * newExtra.qtd).toFixed(2).replace('.', ',')}
                  </span>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowAddExtra(false)} className="px-6 py-3 text-sm font-medium text-gray-500 hover:text-gray-800">Cancelar</button>
                <button onClick={handleAddExtra} className={`flex-1 py-3 rounded-full text-sm font-bold text-white shadow-md transition-transform active:scale-95 ${newExtra.justificativa.includes("Venda") ? 'bg-purple-600 shadow-purple-600/20' : 'bg-[#1A1C1E]'}`}>
                  {newExtra.justificativa.includes("Venda") ? 'Lançar Venda' : 'Confirmar'}
                </button>
              </div>
            </div>
          )}

          {/* Lista de Extras */}
          {extras.length > 0 && (
            <div className="flex flex-col gap-3 mt-2">
              {extras.map(extra => (
                <div key={extra.id} className="bg-white p-4 rounded-2xl flex justify-between items-start group shadow-sm border border-gray-50">
                  <div className="flex flex-col">
                    <span className={`text-sm font-bold ${extra.justificativa.includes("Venda") ? 'text-purple-600' : 'text-gray-900'}`}>
                      {extra.nome} <span className="text-gray-400 font-medium">x{extra.qtd}</span>
                    </span>
                    <span className="text-gray-500 text-xs mt-0.5">{extra.justificativa} {extra.detalhe && `- ${extra.detalhe}`}</span>
                    {extra.justificativa.includes("Venda") && (
                      <span className="text-purple-700 font-black text-sm mt-1">R$ {(extra.preco * extra.qtd).toFixed(2).replace('.', ',')}</span>
                    )}
                  </div>
                  {!extra.isPago && (
                    <button onClick={() => removeExtra(extra.id)} className="w-8 h-8 bg-red-50 text-red-500 rounded-full flex items-center justify-center hover:bg-red-100 transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Checkout Minimalist (Fintech style) */}
          {vendasExtrasPendentes.length > 0 && (
            <div className="mt-6 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-[32px] p-6 flex flex-col gap-6 shadow-xl shadow-purple-500/20">
              <div className="flex justify-between items-end">
                <div className="flex flex-col">
                  <span className="text-white/80 font-bold text-[10px] tracking-widest uppercase">Cobrar Extra</span>
                  <span className="text-4xl font-black tracking-tight mt-1">R$ {totalPixPendente.toFixed(2).replace('.', ',')}</span>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <ShoppingCart className="w-6 h-6 text-white" />
                </div>
              </div>
              
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {["PIX", "Crédito", "Débito", "Dinheiro"].map((metodo) => (
                  <button 
                    key={metodo}
                    onClick={() => setFormaPagamentoCaixa(metodo)}
                    className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${formaPagamentoCaixa === metodo ? 'bg-white text-purple-600 shadow-md' : 'bg-white/20 text-white hover:bg-white/30'}`}
                  >
                    {metodo}
                  </button>
                ))}
              </div>

              {formaPagamentoCaixa === "PIX" && (
                <div className="w-full bg-white rounded-3xl flex flex-col items-center justify-center p-6 mt-2">
                  <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=PIX_RAMA_${totalPixPendente}`} alt="QR Code PIX" className="w-32 h-32" />
                  <span className="text-gray-500 text-xs font-medium mt-3">Leia o QR Code para pagar</span>
                </div>
              )}

              <button onClick={confirmarPagamento} className="w-full bg-white text-purple-600 py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex justify-center items-center gap-2 active:scale-95 transition-transform shadow-lg">
                <CheckCircle2 className="w-5 h-5" /> Confirmar Recebimento
              </button>
            </div>
          )}
        </section>

        {/* Mídias */}
        <section className="flex gap-4">
          <button className="flex-1 bg-white border border-gray-100 rounded-3xl p-5 flex flex-col items-center gap-3 shadow-sm hover:bg-gray-50 transition-colors active:scale-95">
            <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center">
              <Camera className="w-5 h-5" />
            </div>
            <span className="font-bold text-sm text-gray-700">Tirar Foto</span>
          </button>
          <button className="flex-1 bg-white border border-gray-100 rounded-3xl p-5 flex flex-col items-center gap-3 shadow-sm hover:bg-gray-50 transition-colors active:scale-95">
            <div className="w-12 h-12 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center">
              <Mic className="w-5 h-5" />
            </div>
            <span className="font-bold text-sm text-gray-700">Gravar Áudio</span>
          </button>
        </section>

        {/* Assinatura */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-gray-500 text-xs font-bold tracking-widest uppercase">Assinatura do Cliente</h3>
            {signatureData && <span className="text-green-600 bg-green-50 px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 uppercase tracking-widest"><CheckCircle2 className="w-3 h-3" /> Salva</span>}
          </div>
          
          <div className="bg-white rounded-3xl overflow-hidden relative border border-gray-100 shadow-sm">
            <SignaturePad 
              ref={signatureRef}
              canvasProps={{className: "w-full h-48", style: { touchAction: "none" }}}
              onEnd={handleSaveSignature}
            />
            <button 
              onClick={handleClearSignature}
              className="absolute bottom-4 right-4 bg-gray-100 text-gray-600 hover:bg-gray-200 px-4 py-2 rounded-full text-xs font-bold transition-colors"
            >
              Refazer
            </button>
          </div>
        </section>

      </main>

      {/* Modern FAB */}
      <div className="fixed bottom-28 left-0 right-0 px-6 z-40 pointer-events-none flex justify-center">
        <button 
          disabled={!isCompleted}
          onClick={handleFinalizar}
          className={`pointer-events-auto w-full h-14 rounded-2xl font-bold text-sm flex justify-center items-center gap-2 shadow-xl transition-all duration-300 active:scale-95 ${
            isCompleted 
              ? 'bg-[#1A1C1E] text-white' 
              : 'bg-white text-gray-400 border border-gray-100 cursor-not-allowed'
          }`}
        >
          {vendasExtrasPendentes.length > 0 
            ? 'Aguardando PIX'
            : isCompleted 
              ? 'Finalizar Atendimento' 
              : 'Pendente'}
          {isCompleted && <ChevronRight className="w-5 h-5" />}
        </button>
      </div>

    </div>
  );
}
