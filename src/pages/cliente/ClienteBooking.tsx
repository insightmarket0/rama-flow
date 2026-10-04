import React, { useState } from 'react';
import { useCRMStore } from "../../store/useCRMStore";
import { useAgendaStore } from "../../store/useAgendaStore";
import { format, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ArrowRight, CheckCircle2, ChevronLeft, Calendar as CalendarIcon, Clock, CreditCard, MapPin, Package, User } from 'lucide-react';
import { toast } from 'sonner';

export default function ClienteBooking() {
  const addTicket = useCRMStore(state => state.addTicket);
  const addServico = useAgendaStore(state => state.addServico);
  
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    customerName: '',
    whoToAskFor: '',
    whatsapp: '',
    address: '',
    serviceType: '',
    product: '',
    paymentTiming: '',
    paymentMethod: '',
    scheduledDate: '',
    scheduledTime: ''
  });

  const [isFinished, setIsFinished] = useState(false);

  const updateForm = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const handleFinish = () => {
    const newId = `WEB-${Math.floor(Math.random() * 10000)}`;
    const scheduledDate = formData.scheduledDate || format(new Date(), 'yyyy-MM-dd');
    
    // Save to global CRM Store
    addTicket({
      id: newId,
      customerName: formData.customerName,
      whatsapp: formData.whatsapp,
      address: formData.address + (formData.whoToAskFor ? ` (Procurar por: ${formData.whoToAskFor})` : ''),
      orderType: formData.serviceType,
      product: formData.product,
      serviceRequested: 'Agendamento via Site',
      price: 'A Combinar', // Or could be calculated
      paymentMethod: `${formData.paymentMethod} (${formData.paymentTiming})`,
      scheduledDate: scheduledDate,
      scheduledTime: formData.scheduledTime || '00:00',
      technician: 'A Definir',
      status: 'pending'
    });

    setIsFinished(true);
    toast.success('Agendamento recebido com sucesso!');
  };

  if (isFinished) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex flex-col items-center justify-center p-6 text-center font-sans">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-black text-gray-900 mb-2">Tudo Certo!</h1>
        <p className="text-gray-500 mb-8 max-w-sm">Seu agendamento foi recebido pela nossa central. Nossa equipe entrará em contato pelo WhatsApp para confirmar os detalhes e o valor final.</p>
        <button 
          onClick={() => window.location.reload()}
          className="bg-black text-white px-8 py-4 rounded-xl font-bold"
        >
          Fazer Novo Agendamento
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 flex flex-col relative overflow-hidden">
      
      {/* Header */}
      <header className="px-6 pt-12 pb-6 flex items-center gap-4 border-b border-gray-100">
        {step > 1 && (
          <button onClick={prevStep} className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}
        <div className="flex-1">
          <div className="flex gap-1 mb-2">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors ${i <= step ? 'bg-purple-600' : 'bg-gray-100'}`} />
            ))}
          </div>
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Passo {step} de 5</span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col px-6 py-8 pb-32">
        <div className="max-w-md w-full mx-auto animate-in slide-in-from-right-4 fade-in duration-300">
          
          {step === 1 && (
            <div className="flex flex-col gap-6">
              <h2 className="text-3xl font-black tracking-tight leading-tight">Como podemos te ajudar hoje?</h2>
              <div className="grid gap-3">
                <button 
                  onClick={() => { updateForm('serviceType', 'Apenas Instalação'); nextStep(); }}
                  className={`p-5 rounded-2xl border-2 text-left transition-all ${formData.serviceType === 'Apenas Instalação' ? 'border-purple-600 bg-purple-50' : 'border-gray-100 hover:border-purple-200'}`}
                >
                  <WrenchIcon className={`w-6 h-6 mb-3 ${formData.serviceType === 'Apenas Instalação' ? 'text-purple-600' : 'text-gray-400'}`} />
                  <h3 className="font-bold text-lg">Apenas Instalação</h3>
                  <p className="text-gray-500 text-sm mt-1">Eu já tenho o equipamento, só preciso do técnico.</p>
                </button>
                <button 
                  onClick={() => { updateForm('serviceType', 'Venda + Instalação'); nextStep(); }}
                  className={`p-5 rounded-2xl border-2 text-left transition-all ${formData.serviceType === 'Venda + Instalação' ? 'border-purple-600 bg-purple-50' : 'border-gray-100 hover:border-purple-200'}`}
                >
                  <Package className={`w-6 h-6 mb-3 ${formData.serviceType === 'Venda + Instalação' ? 'text-purple-600' : 'text-gray-400'}`} />
                  <h3 className="font-bold text-lg">Comprar + Instalar</h3>
                  <p className="text-gray-500 text-sm mt-1">Quero comprar o equipamento e já agendar a instalação.</p>
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="flex flex-col gap-6">
              <h2 className="text-3xl font-black tracking-tight leading-tight">Seus dados para contato</h2>
              
              <div className="flex flex-col gap-4">
                <div>
                  <label className="text-sm font-bold text-gray-700 mb-1.5 block">Seu Nome Completo</label>
                  <input 
                    type="text" 
                    value={formData.customerName}
                    onChange={e => updateForm('customerName', e.target.value)}
                    placeholder="Ex: João da Silva"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 focus:outline-none focus:border-purple-500 focus:bg-white transition-all font-medium"
                  />
                </div>
                <div>
                  <label className="text-sm font-bold text-gray-700 mb-1.5 block">WhatsApp</label>
                  <input 
                    type="tel" 
                    value={formData.whatsapp}
                    onChange={e => updateForm('whatsapp', e.target.value)}
                    placeholder="(11) 99999-9999"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 focus:outline-none focus:border-purple-500 focus:bg-white transition-all font-medium"
                  />
                </div>
              </div>

              <button 
                disabled={!formData.customerName || !formData.whatsapp}
                onClick={nextStep}
                className="w-full bg-black text-white font-bold py-4 rounded-xl mt-4 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
              >
                Continuar <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="flex flex-col gap-6">
              <h2 className="text-3xl font-black tracking-tight leading-tight">Onde será a instalação?</h2>
              
              <div className="flex flex-col gap-4">
                <div>
                  <label className="text-sm font-bold text-gray-700 mb-1.5 flex items-center gap-2"><MapPin className="w-4 h-4" /> Endereço Completo</label>
                  <input 
                    type="text" 
                    value={formData.address}
                    onChange={e => updateForm('address', e.target.value)}
                    placeholder="Rua, Número, Bairro, CEP"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 focus:outline-none focus:border-purple-500 focus:bg-white transition-all font-medium"
                  />
                </div>
                <div>
                  <label className="text-sm font-bold text-gray-700 mb-1.5 flex items-center gap-2"><User className="w-4 h-4" /> Procurar por quem no local?</label>
                  <input 
                    type="text" 
                    value={formData.whoToAskFor}
                    onChange={e => updateForm('whoToAskFor', e.target.value)}
                    placeholder="Ex: Falar com o porteiro Carlos"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 focus:outline-none focus:border-purple-500 focus:bg-white transition-all font-medium"
                  />
                </div>
              </div>

              <button 
                disabled={!formData.address}
                onClick={nextStep}
                className="w-full bg-black text-white font-bold py-4 rounded-xl mt-4 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
              >
                Continuar <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {step === 4 && (
            <div className="flex flex-col gap-6">
              <h2 className="text-3xl font-black tracking-tight leading-tight">Qual o melhor dia e horário?</h2>
              
              <div className="flex flex-col gap-6">
                
                {/* Date Picker (Horizontal Scroll) */}
                <div>
                  <label className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2"><CalendarIcon className="w-4 h-4" /> Escolha o Dia</label>
                  <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-6 px-6">
                    {Array.from({ length: 14 }).map((_, i) => {
                      const date = addDays(new Date(), i);
                      const dateStr = format(date, 'yyyy-MM-dd');
                      const dayName = i === 0 ? 'Hoje' : i === 1 ? 'Amanhã' : format(date, 'EEE', { locale: ptBR });
                      const dayNum = format(date, 'dd');
                      const monthStr = format(date, 'MMM', { locale: ptBR });
                      
                      const isSelected = formData.scheduledDate === dateStr;

                      return (
                        <button 
                          key={dateStr}
                          onClick={() => updateForm('scheduledDate', dateStr)}
                          className={`flex flex-col items-center justify-center min-w-[70px] py-3 rounded-2xl border-2 transition-all shrink-0 ${isSelected ? 'border-purple-600 bg-purple-600 text-white' : 'border-gray-100 bg-white text-gray-500 hover:border-purple-200'}`}
                        >
                          <span className={`text-[10px] font-bold uppercase tracking-wider ${isSelected ? 'text-purple-100' : 'text-gray-400'}`}>{dayName}</span>
                          <span className="text-2xl font-black my-0.5">{dayNum}</span>
                          <span className={`text-[10px] font-bold uppercase ${isSelected ? 'text-purple-100' : 'text-gray-400'}`}>{monthStr}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Time Picker (Grid) */}
                <div className="animate-in fade-in slide-in-from-bottom-2">
                  <label className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2"><Clock className="w-4 h-4" /> Horário Desejado</label>
                  <div className="grid grid-cols-4 gap-2">
                    {['08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'].map(time => {
                      const isSelected = formData.scheduledTime === time;
                      return (
                        <button 
                          key={time}
                          onClick={() => updateForm('scheduledTime', time)}
                          className={`py-3 rounded-xl border-2 text-sm font-bold transition-all ${isSelected ? 'border-purple-600 bg-purple-50 text-purple-700' : 'border-gray-100 bg-white text-gray-600 hover:border-purple-200'}`}
                        >
                          {time}
                        </button>
                      );
                    })}
                  </div>
                </div>

              </div>

              <button 
                disabled={!formData.scheduledDate || !formData.scheduledTime}
                onClick={nextStep}
                className="w-full bg-black text-white font-bold py-4 rounded-xl mt-4 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
              >
                Continuar <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {step === 5 && (
            <div className="flex flex-col gap-6">
              <h2 className="text-3xl font-black tracking-tight leading-tight">Como prefere pagar?</h2>
              
              <div className="grid gap-3">
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mt-2">Momento do Pagamento</p>
                <button 
                  onClick={() => updateForm('paymentTiming', 'Pagar Agora (10% OFF)')}
                  className={`p-4 rounded-xl border-2 text-left font-bold transition-all ${formData.paymentTiming === 'Pagar Agora (10% OFF)' ? 'border-purple-600 bg-purple-50 text-purple-700' : 'border-gray-100 text-gray-700 hover:border-purple-200'}`}
                >
                  Pagar Agora (10% Desconto)
                </button>
                <button 
                  onClick={() => updateForm('paymentTiming', 'Pagar na Instalação')}
                  className={`p-4 rounded-xl border-2 text-left font-bold transition-all ${formData.paymentTiming === 'Pagar na Instalação' ? 'border-purple-600 bg-purple-50 text-purple-700' : 'border-gray-100 text-gray-700 hover:border-purple-200'}`}
                >
                  Pagar na Instalação
                </button>
              </div>

              {formData.paymentTiming && (
                <div className="grid gap-3 animate-in fade-in slide-in-from-bottom-2 mt-4">
                  <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Forma de Pagamento</p>
                  <div className="grid grid-cols-3 gap-2">
                    {['Pix', 'Cartão', 'Dinheiro'].map(method => (
                      <button 
                        key={method}
                        onClick={() => updateForm('paymentMethod', method)}
                        className={`py-3 px-2 rounded-xl border-2 text-center text-sm font-bold transition-all ${formData.paymentMethod === method ? 'border-purple-600 bg-purple-600 text-white' : 'border-gray-100 bg-white text-gray-600 hover:border-purple-200'}`}
                      >
                        {method}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <button 
                disabled={!formData.paymentTiming || !formData.paymentMethod}
                onClick={handleFinish}
                className="w-full bg-[#00FF00] text-black font-black py-4 rounded-xl mt-8 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 hover:bg-[#00FF00]/80 transition-all shadow-lg shadow-[#00FF00]/20"
              >
                Concluir Agendamento <CheckCircle2 className="w-5 h-5" />
              </button>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}

// Internal icon wrapper since lucide doesn't have WrenchIcon by default, just Wrench
function WrenchIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  )
}
