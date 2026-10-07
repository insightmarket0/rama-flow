import React, { useState, useEffect, useRef } from "react";
import { 
  Plus, MapPin, Phone, Calendar, DollarSign, Wrench, 
  Truck, CheckCircle2, User, CreditCard, Package, AlertCircle, 
  ArrowRight, Navigation, MessageCircle, BarChart3, Clock, Zap, Send, CornerDownLeft, X, Link, Trash2, Edit2, Check
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { useInstallTickets, InstallTicket } from "../hooks/useInstallTickets";
import { useAgendaStore } from "../store/useAgendaStore";
import { useEstoqueStore } from "../store/useEstoqueStore";

export default function GestaoInstaladores() {
  const { tickets, isLoading, updateStatus, deleteTicket, updatePrice } = useInstallTickets();
  const addServico = useAgendaStore(state => state.addServico);
  const deleteServico = useAgendaStore(state => state.deleteServico);
  const estoqueItens = useEstoqueStore(state => state.itens);
  const ultimaAtualizacaoEstoque = useEstoqueStore(state => state.ultimaAtualizacao);
  const solicitacaoAtiva = useEstoqueStore(state => state.solicitacaoAtiva);
  const registrarAbastecimento = useEstoqueStore(state => state.registrarAbastecimento);
  
  // Dashboard vs Wizard State
  const [isCreatingOS, setIsCreatingOS] = useState(false);

  // Conversational Form State (Typeform Style)
  const [form, setForm] = useState<any>({ technician: "Roberto" });
  const [currentStep, setCurrentStep] = useState(0);
  const [stepInput, setStepInput] = useState('');
  const [isEditingSummary, setIsEditingSummary] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Dynamic Questions based on form state
  const getQuestions = () => {
    const questions: any[] = [
      { field: 'customerName', text: 'Qual o nome do cliente?', placeholder: 'Ex: João Silva' },
      { field: 'whatsapp', text: 'Qual o WhatsApp dele(a)?', placeholder: 'Ex: (11) 99999-9999', type: 'tel' },
      { field: 'address', text: 'Qual o endereço completo para a instalação?', placeholder: 'Ex: Rua, Número, Bairro...' },
      { field: 'orderType', text: 'Qual o tipo de serviço?', options: ['Apenas Instalação', 'Venda + Instalação'] }
    ];

    if (form.orderType === 'Venda + Instalação') {
      questions.push({ field: 'product', text: 'Qual produto o técnico deve levar e instalar?', placeholder: 'Ex: Cooktop 5 Bocas, Regulador...' });
    }

    questions.push(
      { field: 'serviceRequested', text: 'Qual o serviço técnico necessário?', placeholder: 'Ex: Instalação Kit Gás' },
      { field: 'price', text: 'Qual o valor total acordado (R$)?', placeholder: 'Ex: 150,00', type: 'number' },
      { field: 'paymentMethod', text: 'Qual a forma de pagamento?', options: ['Pix', 'Cartão', 'Dinheiro'] },
      { field: 'scheduledDate', text: 'Qual a data do agendamento?', type: 'date' },
      { field: 'scheduledTime', text: 'Qual o horário do agendamento?', type: 'time' }
    );

    return questions;
  };

  const currentQuestions = getQuestions();

  useEffect(() => {
    if (isCreatingOS) {
      setForm({ technician: "A Definir" });
      setCurrentStep(0);
      setIsEditingSummary(false);
      setStepInput('');
    }
  }, [isCreatingOS]);

  // Focus input automatically when step changes
  useEffect(() => {
    if (isCreatingOS && currentStep < currentQuestions.length) {
      setStepInput('');
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [currentStep, isCreatingOS]);

  const handleNextStep = (value: string) => {
    if (!value.trim()) return;

    const fieldName = currentQuestions[currentStep].field;
    
    // Use the functional updater for state, but we also need the NEW state immediately to calculate the NEXT questions
    const nextForm = { ...form, [fieldName]: value };
    setForm(nextForm);

    const nextQuestions = getQuestions(); // This might still use stale form, but it's ok because the next line handles it.
    // Wait, getQuestions depends on `form`. If we just updated `orderType`, `getQuestions()` wouldn't see it until next render.
    // Let's pass nextForm to a pure function version of getQuestions to find the real length.

    const getNextQuestions = (f: any) => {
      const qs: any[] = [
        { field: 'customerName' }, { field: 'whatsapp' }, { field: 'address' }, { field: 'orderType' }
      ];
      if (f.orderType === 'Venda + Instalação') {
        qs.push({ field: 'product' });
      }
      qs.push({ field: 'serviceRequested' }, { field: 'price' }, { field: 'paymentMethod' }, { field: 'scheduledDate' }, { field: 'scheduledTime' });
      return qs;
    };

    const newQList = getNextQuestions(nextForm);

    if (currentStep + 1 < newQList.length) {
      setCurrentStep(currentStep + 1);
    } else {
      setCurrentStep(99); // Summary Step
    }
  };

  const handleCreate = () => {
    const newTicket: InstallTicket = {
      id: `INST-00${tickets.length + 1}`,
      ...form,
      status: 'pending'
    };
    addTicket(newTicket);

    // Push to the global agenda for the mobile app
    addServico({
      id: newTicket.id,
      cliente: newTicket.customerName,
      telefone: newTicket.whatsapp,
      endereco: newTicket.address,
      tipo: newTicket.serviceRequested,
      valor: `R$ ${newTicket.price}`,
      horario: form.scheduledTime || "00:00",
      data: form.scheduledDate || format(new Date(), 'yyyy-MM-dd'),
      status: 'pendente',
      tecnico: newTicket.technician
    });

    setIsCreatingOS(false);
  };

  const handleDispatch = (ticket: InstallTicket) => {
    // 1. Update status in CRM
    updateStatus(ticket.id, 'in_progress');
    
    // 2. Push to mobile app agenda
    addServico({
      id: ticket.id,
      cliente: ticket.customerName,
      telefone: ticket.whatsapp,
      endereco: ticket.address,
      tipo: ticket.serviceRequested || ticket.orderType,
      valor: ticket.price.includes('R$') || ticket.price === 'A Combinar' ? ticket.price : `R$ ${ticket.price}`,
      horario: ticket.scheduledTime || "00:00",
      data: ticket.scheduledDate || format(new Date(), 'yyyy-MM-dd'),
      status: 'pendente',
      tecnico: 'Roberto' // Force assignment to Roberto for now
    });
    
    toast.success('OS Despachada para o Instalador!');
  };

  const handleDelete = (id: string) => {
    deleteTicket(id);
    deleteServico(id);
    toast.info('Agendamento excluído do sistema.');
  };

  const handleCobrar = (ticket: InstallTicket) => {
    const [ano, mes, dia] = ticket.scheduledDate.split('-');
    const dataFormatada = dia ? `${dia}/${mes}/${ano}` : ticket.scheduledDate;
    const isPendente = ticket.price === 'Pendente' || !ticket.price;

    const text = `Olá, *${ticket.customerName}*! Tudo excelente?
Aqui é da central de atendimento.

Recebemos a sua solicitação com sucesso! Abaixo estão os detalhes do seu pedido:

*Serviço:* Instalação / Suporte
*Equipamento:* ${ticket.product || 'A definir'}
*Data Solicitada:* ${dataFormatada} às ${ticket.scheduledTime}

${isPendente ? `Nossa equipe técnica está analisando sua solicitação. Em breve retornaremos com o *valor do seu orçamento* e a confirmação de disponibilidade!` : `*Valor do Orçamento:* O valor para a realização deste serviço ficou em *R$ ${ticket.price}*.`}

${!isPendente ? 'Podemos confirmar e reservar este horário exclusivamente para você?' : 'Qualquer dúvida enquanto aguarda, sinta-se à vontade para nos chamar!'}`;

    window.open(`https://wa.me/${ticket.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleEnviarPagamento = (ticket: InstallTicket) => {
    const isPix = ticket.paymentMethod.toUpperCase().includes('PIX');
    
    const text = `Olá, *${ticket.customerName}*! Que maravilha, orçamento confirmado!

Para finalizarmos a reserva na nossa agenda e liberarmos a rota do seu técnico, segue os dados para efetivação:

${isPix ? `*Chave PIX (Celular/CNPJ):* (inserir sua chave aqui)
*Banco:* Nubank
*Favorecido:* (Nome da Empresa)` : `*Link Seguro de Pagamento (Cartão):*
(inserir link do Mercado Pago / Ton aqui)`}

*Valor do Serviço:* R$ ${ticket.price !== 'Pendente' ? ticket.price : 'A Combinar'}

Assim que concluir, basta me enviar o comprovante por aqui mesmo. Agradecemos a preferência e conte conosco!`;

    window.open(`https://wa.me/${ticket.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const totalRev = tickets.reduce((acc, val) => {
    const parsed = parseFloat(val.price?.replace('R$', '').trim().replace(',', '.') || '0');
    return acc + (isNaN(parsed) ? 0 : parsed);
  }, 0);
  const totalOrders = tickets.length;
  const lastWeekOrders = 0; // Replace with real data if available
  const robertoCount = tickets.filter(t => t.technician === 'Roberto' && t.status !== 'completed').length;
  const marcosCount = tickets.filter(t => t.technician === 'Marcos' && t.status !== 'completed').length;
  
  const totalEstoqueCount = estoqueItens.reduce((acc, item) => acc + item.quantidade, 0);
  const estoqueStatus = ultimaAtualizacaoEstoque ? `Última att: ${format(new Date(ultimaAtualizacaoEstoque), 'dd/MM HH:mm')}` : 'Sem dados recentes';

  return (
    <div className="flex-1 h-full overflow-y-auto bg-[#050505] text-white pt-6 pb-24 px-4 md:px-12 animate-in fade-in duration-500 font-sans selection:bg-[#00FF00] selection:text-black">
      
      {!isCreatingOS ? (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
            <div className="flex flex-col">
              <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-white uppercase leading-none">
                Operação <span className="text-[#00FF00]">Externa</span>
              </h1>
              <p className="text-gray-500 font-bold uppercase tracking-widest text-[9px] md:text-[10px] mt-2">
                Despacho, Agendamento e Monitoramento de Equipe
              </p>
            </div>
            <div className="flex flex-col sm:flex-row w-full md:w-auto gap-3">
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(window.location.origin + '/agendar');
                  toast.success('Link do cliente copiado!');
                }}
                className="w-full sm:w-auto bg-white/5 hover:bg-white/10 text-white border border-white/10 px-5 md:px-6 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] md:text-xs flex justify-center items-center gap-2 transition-all hover:scale-105"
              >
                <Link className="w-4 h-4 md:w-5 md:h-5" /> COPIAR LINK
              </button>
              <button 
                onClick={() => setIsCreatingOS(true)}
                className="w-full sm:w-auto bg-[#00FF00] hover:bg-[#00FF00]/80 text-black px-5 md:px-6 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] md:text-xs flex justify-center items-center gap-2 transition-all shadow-[0_0_20px_rgba(0,255,0,0.2)] hover:scale-105"
              >
                <MessageCircle className="w-4 h-4 md:w-5 md:h-5 stroke-[2.5]" /> INICIAR ATENDIMENTO
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8">
            <div className="bg-[#0A0A0A] border border-white/5 p-4 md:p-5 rounded-xl md:rounded-2xl flex flex-col justify-between">
              <div className="flex justify-between items-center mb-2 md:mb-4">
                <span className="text-[9px] md:text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-tight">Faturamento</span>
                <DollarSign className="w-3 h-3 md:w-4 md:h-4 text-[#00FF00]" />
              </div>
              <div>
                <div className="text-xl md:text-3xl font-black text-[#00FF00]">R$ {totalRev.toFixed(2).replace('.', ',')}</div>
                <span className="text-[9px] md:text-xs text-gray-500 font-bold mt-1 block truncate">Tempo real</span>
              </div>
            </div>
            <div className="bg-[#0A0A0A] border border-white/5 p-4 md:p-5 rounded-xl md:rounded-2xl flex flex-col justify-between">
              <div className="flex justify-between items-center mb-2 md:mb-4">
                <span className="text-[9px] md:text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-tight">Pedidos</span>
                <BarChart3 className="w-3 h-3 md:w-4 md:h-4 text-[#00FF00]" />
              </div>
              <div>
                <div className="text-xl md:text-3xl font-black text-white">{totalOrders} <span className="text-xs md:text-lg text-gray-500 font-medium">OS</span></div>
                <span className="text-[9px] md:text-xs text-gray-500 font-bold mt-1 block truncate">Semana atual</span>
              </div>
            </div>
            <div className="bg-[#0A0A0A] border border-white/5 p-4 md:p-5 rounded-xl md:rounded-2xl flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute right-0 top-0 bottom-0 w-1 md:w-2 bg-[#00FF00]/20"></div>
              <div className="flex justify-between items-center mb-2 md:mb-4">
                <span className="text-[9px] md:text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-tight">Equipe</span>
                <Truck className="w-3 h-3 md:w-4 md:h-4 text-white" />
              </div>
              <div>
                <div className="text-xl md:text-3xl font-black text-white">{robertoCount + marcosCount} <span className="text-xs md:text-lg text-gray-500 font-medium">Em Rota</span></div>
                <span className="text-[9px] md:text-xs text-gray-500 font-bold mt-1 block truncate">Via GPS</span>
              </div>
            </div>
            <div 
              onClick={() => {
                if (solicitacaoAtiva) {
                  registrarAbastecimento();
                  toast.success("Abastecimento confirmado! O alerta na van foi desligado.");
                }
              }}
              className={`bg-[#0A0A0A] border p-4 md:p-5 rounded-xl md:rounded-2xl flex flex-col justify-between relative overflow-hidden group transition-colors ${
                solicitacaoAtiva 
                  ? 'border-red-500 shadow-[0_0_15px_rgba(255,0,0,0.3)] cursor-pointer hover:bg-red-500/10' 
                  : 'border-white/5 cursor-default'
              }`}
            >
              <div className={`absolute right-0 top-0 bottom-0 w-1 md:w-2 ${solicitacaoAtiva ? 'bg-red-500 animate-pulse' : 'bg-purple-500/20'}`}></div>
              <div className="flex justify-between items-center mb-2 md:mb-4">
                <span className={`text-[9px] md:text-[10px] font-bold uppercase tracking-widest leading-tight ${solicitacaoAtiva ? 'text-red-500' : 'text-gray-500'}`}>
                  {solicitacaoAtiva ? '⚠️ ALERTA DE REPOSIÇÃO' : 'Estoque'}
                </span>
                <Package className={`w-3 h-3 md:w-4 md:h-4 ${solicitacaoAtiva ? 'text-red-500' : 'text-white group-hover:text-purple-400 transition-colors'}`} />
              </div>
              <div>
                <div className="text-xl md:text-3xl font-black text-white">{totalEstoqueCount} <span className="text-xs md:text-lg text-gray-500 font-medium">Itens</span></div>
                {solicitacaoAtiva ? (
                  <span className="text-[9px] md:text-xs text-red-400 font-bold mt-1 block truncate">
                    Clique aqui após abastecer a van
                  </span>
                ) : (
                  <span className="text-[9px] md:text-xs text-gray-500 font-bold mt-1 block truncate">{estoqueStatus}</span>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-10">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-2 h-2 rounded-full bg-[#00FF00] animate-pulse shadow-[0_0_10px_#00FF00]"></div>
                <h2 className="text-xl font-black uppercase tracking-tighter text-white">Técnicos em Rota</h2>
              </div>
              <div className="flex flex-col gap-3">
                {tickets.filter(t => t.status === 'in_progress').map(ticket => (
                  <ListCard key={ticket.id} ticket={ticket} onAction={() => updateStatus(ticket.id, 'completed')} onDelete={() => handleDelete(ticket.id)} onUpdatePrice={(price) => updatePrice(ticket.id, price)} onCobrar={() => handleCobrar(ticket)} onCobrarPix={() => handleEnviarPagamento(ticket)} />
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-2 h-2 rounded-full bg-[#FF3333] shadow-[0_0_10px_#FF3333]"></div>
                <h2 className="text-xl font-black uppercase tracking-tighter text-gray-400">Fila de Despacho</h2>
              </div>
              <div className="flex flex-col gap-3">
                {tickets.filter(t => t.status === 'pending').map(ticket => (
                  <ListCard key={ticket.id} ticket={ticket} onAction={() => handleDispatch(ticket)} onDelete={() => handleDelete(ticket.id)} onUpdatePrice={(price) => updatePrice(ticket.id, price)} onCobrar={() => handleCobrar(ticket)} onCobrarPix={() => handleEnviarPagamento(ticket)} />
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-4 mt-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-2 h-2 rounded-full bg-gray-500 shadow-[0_0_10px_gray]"></div>
                <h2 className="text-xl font-black uppercase tracking-tighter text-gray-400">Histórico (Concluídos)</h2>
              </div>
              <div className="flex flex-col gap-3">
                {tickets.filter(t => t.status === 'completed').length === 0 ? (
                  <div className="text-center py-8 text-gray-500 text-sm font-bold uppercase tracking-widest border border-white/5 border-dashed rounded-xl">
                    Nenhum serviço finalizado ainda.
                  </div>
                ) : (
                  tickets.filter(t => t.status === 'completed').map(ticket => (
                    <ListCard key={ticket.id} ticket={ticket} onDelete={() => handleDelete(ticket.id)} />
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="animate-in fade-in zoom-in-95 duration-500 w-full max-w-3xl mx-auto mt-10">
          <div className="bg-[#050505] border-2 border-[#00FF00] rounded-3xl overflow-hidden flex flex-col min-h-[500px] shadow-[0_0_50px_rgba(0,255,0,0.1)] relative">
            
            <button 
              onClick={() => setIsCreatingOS(false)}
              className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {currentStep < currentQuestions.length ? (
              <div className="flex flex-col h-full flex-1 p-10 pt-16">
                
                <div className="w-full bg-white/10 h-1.5 rounded-full mb-10 overflow-hidden">
                  <div 
                    className="bg-[#00FF00] h-full transition-all duration-500 ease-out" 
                    style={{ width: `${((currentStep) / currentQuestions.length) * 100}%` }}
                  />
                </div>

                <div className="flex-1 flex flex-col justify-center">
                  <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-white mb-8 leading-tight">
                    {currentQuestions[currentStep].text}
                  </h2>

                  {currentQuestions[currentStep].options ? (
                    <div className="flex flex-col sm:flex-row flex-wrap gap-4">
                      {currentQuestions[currentStep].options.map((opt: string) => (
                        <button 
                          key={opt}
                          onClick={() => handleNextStep(opt)}
                          className="bg-[#111] border-2 border-white/10 hover:border-[#00FF00] hover:bg-[#00FF00]/10 text-white hover:text-[#00FF00] px-6 py-4 rounded-xl text-lg font-black transition-all active:scale-95"
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col gap-4">
                      <input 
                        key={`step-input-${currentStep}`}
                        ref={inputRef}
                        type={currentQuestions[currentStep].type || 'text'}
                        value={stepInput}
                        onChange={e => setStepInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleNextStep(stepInput)}
                        placeholder={currentQuestions[currentStep].placeholder || ''}
                        className="w-full bg-transparent border-b-4 border-white/20 focus:border-[#00FF00] text-2xl md:text-4xl font-black text-[#00FF00] placeholder:text-gray-700 placeholder:font-bold focus:outline-none pb-4 transition-colors"
                      />
                      <div className="flex items-center gap-2 text-gray-500 mt-2">
                        <span className="text-xs font-bold uppercase tracking-widest">Pressione ENTER para continuar</span>
                        <CornerDownLeft className="w-4 h-4" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              
              <div className="flex flex-col h-full flex-1 p-10 animate-in fade-in zoom-in-95 duration-500">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl font-black uppercase tracking-tighter flex items-center gap-3 text-[#00FF00]">
                    <CheckCircle2 className="w-8 h-8" /> Resumo Final
                  </h2>
                  <button 
                    onClick={() => setIsEditingSummary(!isEditingSummary)}
                    className="text-xs text-gray-400 hover:text-white underline decoration-dashed transition-colors uppercase font-bold tracking-widest"
                  >
                    {isEditingSummary ? 'Salvar Edição' : 'Editar Dados'}
                  </button>
                </div>

                <div className="flex flex-col gap-4 text-base flex-1 overflow-y-auto pr-2">
                  {isEditingSummary ? (
                    <>
                      <div className="flex flex-col gap-1"><span className="text-[10px] text-[#00FF00] uppercase tracking-widest font-black">Cliente</span> <input value={form.customerName || ''} onChange={e => setForm({...form, customerName: e.target.value})} className="bg-[#111] border-2 border-white/10 focus:border-[#00FF00] outline-none p-3 rounded-xl text-white font-bold" /></div>
                      <div className="flex flex-col gap-1"><span className="text-[10px] text-[#00FF00] uppercase tracking-widest font-black">WhatsApp</span> <input value={form.whatsapp || ''} onChange={e => setForm({...form, whatsapp: e.target.value})} className="bg-[#111] border-2 border-white/10 focus:border-[#00FF00] outline-none p-3 rounded-xl text-white font-bold" /></div>
                      <div className="flex flex-col gap-1"><span className="text-[10px] text-[#00FF00] uppercase tracking-widest font-black">Endereço</span> <input value={form.address || ''} onChange={e => setForm({...form, address: e.target.value})} className="bg-[#111] border-2 border-white/10 focus:border-[#00FF00] outline-none p-3 rounded-xl text-white font-bold" /></div>
                      <div className="flex flex-col gap-1"><span className="text-[10px] text-[#00FF00] uppercase tracking-widest font-black">Tipo de Serviço</span> <input value={form.orderType || ''} onChange={e => setForm({...form, orderType: e.target.value})} className="bg-[#111] border-2 border-white/10 focus:border-[#00FF00] outline-none p-3 rounded-xl text-white font-bold" /></div>
                      {form.orderType === 'Venda + Instalação' && (
                        <div className="flex flex-col gap-1"><span className="text-[10px] text-[#00FF00] uppercase tracking-widest font-bold">Produto</span> <input value={form.product || ''} onChange={e => setForm({...form, product: e.target.value})} className="bg-[#111] border-2 border-white/10 focus:border-[#00FF00] outline-none p-3 rounded-xl text-white font-bold" /></div>
                      )}
                      <div className="flex flex-col gap-1"><span className="text-[10px] text-[#00FF00] uppercase tracking-widest font-bold">Serviço Técnico</span> <input value={form.serviceRequested || ''} onChange={e => setForm({...form, serviceRequested: e.target.value})} className="bg-[#111] border-2 border-white/10 focus:border-[#00FF00] outline-none p-3 rounded-xl text-white font-bold" /></div>
                      <div className="flex flex-col gap-1"><span className="text-[10px] text-[#00FF00] uppercase tracking-widest font-bold">Data/Hora</span> <input value={form.scheduledDate || ''} onChange={e => setForm({...form, scheduledDate: e.target.value})} className="bg-[#111] border-2 border-white/10 focus:border-[#00FF00] outline-none p-3 rounded-xl text-white font-bold" /></div>
                    </>
                  ) : (
                    <>
                      <div className="flex justify-between items-center py-2 border-b border-white/5"><span className="text-gray-500 font-bold uppercase tracking-widest text-xs">Cliente</span> <b className="text-right text-lg">{form.customerName}</b></div>
                      <div className="flex justify-between items-center py-2 border-b border-white/5"><span className="text-gray-500 font-bold uppercase tracking-widest text-xs">WhatsApp</span> <b className="text-right text-lg">{form.whatsapp}</b></div>
                      <div className="flex justify-between items-center py-2 border-b border-white/5"><span className="text-gray-500 font-bold uppercase tracking-widest text-xs">Endereço</span> <b className="text-right text-lg max-w-[250px] truncate">{form.address}</b></div>
                      <div className="flex justify-between items-center py-2 border-b border-white/5"><span className="text-gray-500 font-bold uppercase tracking-widest text-xs">Tipo</span> <b className="text-right text-lg">{form.orderType}</b></div>
                      {form.orderType === 'Venda + Instalação' && (
                        <div className="flex justify-between items-center py-2 border-b border-white/5"><span className="text-gray-500 font-bold uppercase tracking-widest text-xs">Produto a Levar</span> <b className="text-right text-lg text-[#00FF00]">{form.product}</b></div>
                      )}
                      <div className="flex justify-between items-center py-2 border-b border-white/5"><span className="text-gray-500 font-bold uppercase tracking-widest text-xs">Serviço Técnico</span> <b className="text-right text-lg">{form.serviceRequested}</b></div>
                      <div className="flex justify-between items-center py-2 border-b border-white/5"><span className="text-gray-500 font-bold uppercase tracking-widest text-xs">Data/Hora</span> <b className="text-right text-lg">{form.scheduledDate}</b></div>
                    </>
                  )}
                </div>
                
                {!isEditingSummary && (
                  <button 
                    onClick={handleCreate}
                    className="w-full bg-[#00FF00] hover:bg-[#00FF00]/80 text-black font-black uppercase tracking-widest py-4 rounded-xl mt-8 transition-all active:scale-[0.98] text-lg shadow-[0_0_30px_rgba(0,255,0,0.2)]"
                  >
                    Confirmar e Despachar
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function ListCard({ ticket, onAction, onDelete, onUpdatePrice, onCobrar, onCobrarPix }: { ticket: InstallTicket, onAction?: () => void, onDelete?: () => void, onUpdatePrice?: (p: string) => void, onCobrar?: () => void, onCobrarPix?: () => void }) {
  const isPending = ticket.status === 'pending';
  const borderColor = isPending ? 'border-l-[#FF3333]' : 'border-l-[#00FF00]';
  const [isEditingPrice, setIsEditingPrice] = useState(false);
  const [priceInput, setPriceInput] = useState(ticket.price);

  const handleSavePrice = () => {
    if (onUpdatePrice) onUpdatePrice(priceInput);
    setIsEditingPrice(false);
  };

  return (
    <div className={`bg-[#0A0A0A] border border-white/5 border-l-[4px] ${borderColor} rounded-xl p-3 md:p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-0 hover:bg-[#111] transition-colors group`}>
      <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-6 w-full md:w-auto">
        <div className="flex flex-row md:flex-col items-center md:items-start justify-between w-full md:w-32 shrink-0">
          <span className="text-[10px] md:text-xs font-mono text-gray-500 font-bold">{ticket.displayId || ticket.id.substring(0, 8)}</span>
          <span className="text-xs md:text-sm font-black text-white">{ticket.scheduledDate} {ticket.scheduledTime !== '00:00' && `• ${ticket.scheduledTime}`}</span>
        </div>
        
        <div className="flex flex-col min-w-[200px]">
          <span className="text-sm md:text-base font-bold text-white truncate">{ticket.customerName}</span>
          <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400 mt-0.5 truncate flex items-center gap-1">
            {ticket.orderType === 'Venda + Instalação' && <Package className="w-3 h-3 text-[#00FF00]" />}
            {ticket.serviceRequested}
          </span>
        </div>

        <div className="hidden md:flex flex-col min-w-[250px] flex-1">
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <MapPin className="w-3.5 h-3.5" /> <span className="truncate">{ticket.address}</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-400 mt-1">
            {isEditingPrice ? (
              <div className="flex items-center gap-2 bg-black/50 p-1 rounded-md border border-white/10">
                <span className="text-[#00FF00] font-bold text-[10px]">R$</span>
                <input 
                  type="text" 
                  value={priceInput}
                  onChange={e => setPriceInput(e.target.value)}
                  className="bg-transparent border-none text-white text-xs font-bold w-20 outline-none"
                  autoFocus
                />
                <button onClick={handleSavePrice} className="text-[#00FF00] hover:scale-110 transition-transform"><Check className="w-3.5 h-3.5" /></button>
                <button onClick={() => setIsEditingPrice(false)} className="text-red-500 hover:scale-110 transition-transform"><X className="w-3.5 h-3.5" /></button>
              </div>
            ) : ticket.price === 'Pendente' || !ticket.price ? (
              <button 
                onClick={() => setIsEditingPrice(true)} 
                className="flex items-center gap-1.5 bg-[#FF3333]/10 text-[#FF3333] border border-[#FF3333]/30 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest hover:bg-[#FF3333] hover:text-white transition-all shadow-[0_0_10px_rgba(255,51,51,0.1)] hover:shadow-[0_0_15px_rgba(255,51,51,0.4)]"
                title="Clique para definir o valor do orçamento"
              >
                <DollarSign className="w-3 h-3" /> Definir Preço
              </button>
            ) : (
              <span className="flex items-center gap-1 text-[#00FF00] font-bold">
                <DollarSign className="w-3 h-3"/> {ticket.price}
                {isPending && (
                  <button onClick={() => setIsEditingPrice(true)} className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity hover:text-white">
                    <Edit2 className="w-3 h-3" />
                  </button>
                )}
              </span>
            )}
            <span className="bg-white/10 px-1.5 rounded uppercase text-[9px] font-bold flex items-center gap-1">
              {ticket.paymentMethod}
            </span>
            {onCobrar && (
              <div className="flex gap-1 ml-2">
                <button 
                  onClick={onCobrar} 
                  className="bg-[#00FF00] text-black px-2 py-0.5 rounded text-[10px] font-black hover:bg-white transition-colors flex items-center gap-1 shadow-[0_0_10px_rgba(0,255,0,0.3)]" 
                  title="Enviar Orçamento via WhatsApp"
                >
                  <MessageCircle className="w-3 h-3 stroke-[3]" />
                  <span>ZAP</span>
                </button>
                {onCobrarPix && (
                  <button 
                    onClick={onCobrarPix} 
                    className="bg-purple-600 text-white px-2 py-0.5 rounded text-[10px] font-black hover:bg-purple-500 transition-colors flex items-center gap-1" 
                    title="Enviar Dados de Pagamento via WhatsApp"
                  >
                    <DollarSign className="w-3 h-3 stroke-[3]" />
                    <span>COBRAR</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between md:justify-end w-full md:w-auto gap-3 pt-3 md:pt-0 border-t border-white/5 md:border-t-0 mt-2 md:mt-0">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 md:w-7 md:h-7 rounded-full bg-white/10 flex items-center justify-center">
            <User className="w-3 h-3 md:w-3.5 md:h-3.5 text-white" />
          </div>
          <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-gray-300">{ticket.technician}</span>
        </div>
        
        <div className="flex items-center gap-2">
          {onDelete && (
            <button 
              onClick={onDelete}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-500 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
          {onAction && ticket.status !== 'completed' && (
            <button 
              onClick={onAction}
              className={`px-3 md:px-4 py-2 rounded-lg font-black uppercase tracking-widest text-[9px] md:text-[10px] transition-all hover:scale-[1.02] ${isPending ? 'bg-[#FF3333] text-black hover:bg-[#FF3333]/80' : 'bg-[#00FF00] text-black hover:bg-[#00FF00]/80'}`}
            >
              {isPending ? 'Despachar' : 'Concluir'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
