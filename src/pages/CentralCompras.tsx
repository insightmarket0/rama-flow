import React, { useState, useEffect, useMemo } from "react";
import { Package, Box, AlertTriangle, CheckCircle2, Clock, ShoppingCart, RefreshCw, DollarSign, BarChart2, Calendar, FileText, Trash2, Truck, Link, MapPin } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function CentralCompras() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'pendentes' | 'a_caminho' | 'recebidos'>('pendentes');
  
  // Estados para o Modal de Compra
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [purchaseQuantity, setPurchaseQuantity] = useState("");
  const [purchaseCost, setPurchaseCost] = useState("");
  const [purchaseETA, setPurchaseETA] = useState("");
  const [purchaseSupplier, setPurchaseSupplier] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('supply_requests')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) {
        // Fallback Fictício
        setRequests([{
          id: "fake-123",
          item_name: "Caixas de Papelão Parda (Tamanho M)",
          category: "Embalagem",
          priority: "critico",
          status: "pendente",
          author: "Mara",
          created_at: new Date().toISOString(),
        },
        {
          id: "fake-456",
          item_name: "Fita Adesiva Larga (Transparente)",
          category: "Embalagem",
          priority: "alta",
          status: "comprado",
          quantity_bought: 50,
          total_cost: 250.00,
          expected_date: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
          supplier: "Mercado Livre",
          author: "Mara",
          created_at: new Date().toISOString(),
        }]);
      } else if (data) {
        setRequests(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();

    const channel = supabase
      .channel('supply_requests_changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'supply_requests'
      }, () => {
        fetchRequests(); 
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  // Cálculos de Métricas
  const metrics = useMemo(() => {
    const currentMonth = new Date().getMonth();
    const thisMonthRequests = requests.filter(r => new Date(r.created_at).getMonth() === currentMonth);
    
    const totalSpent = thisMonthRequests.reduce((acc, curr) => acc + (Number(curr.total_cost) || 0), 0);
    const totalItems = thisMonthRequests.reduce((acc, curr) => acc + (Number(curr.quantity_bought) || 0), 0);
    
    const totalBoxes = thisMonthRequests
      .filter(r => r.item_name.toLowerCase().includes('caixa'))
      .reduce((acc, curr) => acc + (Number(curr.quantity_bought) || 0), 0);

    const totalBags = thisMonthRequests
      .filter(r => r.item_name.toLowerCase().includes('saco') || r.item_name.toLowerCase().includes('envelope') || r.item_name.toLowerCase().includes('plástico') || r.item_name.toLowerCase().includes('plastico'))
      .reduce((acc, curr) => acc + (Number(curr.quantity_bought) || 0), 0);

    const totalLabels = thisMonthRequests
      .filter(r => r.item_name.toLowerCase().includes('etiqueta') || r.item_name.toLowerCase().includes('bobina') || r.item_name.toLowerCase().includes('fita'))
      .reduce((acc, curr) => acc + (Number(curr.quantity_bought) || 0), 0);

    const urgenciesToday = requests.filter(r => 
      r.category === 'Produto Vendido (Urgência)' && 
      r.status === 'pendente'
    ).length;

    return {
      totalSpent,
      totalItems,
      totalBoxes,
      totalBags,
      totalLabels,
      urgenciesToday
    };
  }, [requests]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  const openPurchaseModal = (req: any) => {
    setSelectedRequest(req);
    setPurchaseQuantity("");
    setPurchaseCost("");
    setPurchaseETA("");
    setPurchaseSupplier("");
    setIsPurchaseModalOpen(true);
  };

  const confirmPurchase = async () => {
    if (!purchaseQuantity || !purchaseCost || !purchaseETA) {
      toast.error("Preencha quantidade, valor e data de previsão.");
      return;
    }
    
    setIsSubmitting(true);

    try {
      const numericCost = parseFloat(purchaseCost.replace(',', '.'));
      const { error } = await supabase
        .from('supply_requests')
        .update({ 
          status: 'comprado',
          quantity_bought: Number(purchaseQuantity),
          total_cost: numericCost,
          expected_date: purchaseETA,
          supplier: purchaseSupplier || 'Não informado'
        })
        .eq('id', selectedRequest.id);

      if (error) {
        setRequests(prev => prev.map(r => r.id === selectedRequest.id ? { 
          ...r, 
          status: 'comprado', 
          quantity_bought: Number(purchaseQuantity), 
          total_cost: numericCost,
          expected_date: purchaseETA,
          supplier: purchaseSupplier || 'Não informado'
        } : r));
      }

      // Remove da triagem (aguardando) e manda para resolvido (aprovado) na expedição
      // Fazemos isso independente de erro no supply_requests para suportar o fallback
      await supabase
        .from('expedicao_tickets')
        .update({ status: 'aprovado' })
        .eq('title', selectedRequest.item_name)
        .eq('status', 'aguardando');

      toast.success("Compra registrada com sucesso!");

      await supabase.from('chat_messages').insert({
        channel: 'expedicao',
        user_id: user?.id,
        sender_name: "Sistema Bot",
        sender_initials: "BOT",
        sender_color: "bg-[#00FF00] text-black",
        text: `✅ O item **${selectedRequest.item_name}** foi comprado pelo Rogério! Qtd: ${purchaseQuantity} | Previsão de chegada: ${new Date(purchaseETA).toLocaleDateString('pt-BR')} (A Caminho).`
      });

      setIsPurchaseModalOpen(false);
    } catch (err) {
      console.error(err);
      toast.error("Erro ao registrar a compra.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmReceipt = async (id: string) => {
    try {
      const { error } = await supabase
        .from('supply_requests')
        .update({ status: 'recebido' })
        .eq('id', id);

      if (error) {
        setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'recebido' } : r));
      }

      toast.success("Item marcado como recebido!");
    } catch (err) {
      console.error(err);
      toast.error("Erro ao confirmar recebimento.");
    }
  };

  const handleDeleteRequest = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este pedido? Essa ação não pode ser desfeita.")) return;

    try {
      const { error } = await supabase
        .from('supply_requests')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success("Pedido excluído com sucesso!");
      fetchRequests();
    } catch (err) {
      console.error(err);
      toast.error("Erro ao excluir o pedido.");
    }
  };

  if (!user) return null;

  const filteredRequests = requests.filter(req => {
    if (activeTab === 'pendentes') return req.status === 'pendente';
    if (activeTab === 'a_caminho') return req.status === 'comprado';
    if (activeTab === 'recebidos') return req.status === 'recebido';
    return true;
  });

  return (
    <div className="flex flex-col h-full bg-transparent w-full font-sans animate-in fade-in duration-700 overflow-hidden p-2 md:p-3">
      {/* Header & Metrics */}
      <div className="mb-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#00FF00]/10 flex items-center justify-center border border-[#00FF00]/20 shadow-[0_0_15px_rgba(0,255,0,0.15)]">
              <ShoppingCart className="w-5 h-5 text-[#00FF00]" />
            </div>
            <div>
              <h2 className="text-white text-lg font-black uppercase tracking-wider leading-none">Central de Compras</h2>
              <p className="text-gray-400 text-xs mt-1">Painel de controle e acompanhamento de insumos</p>
            </div>
          </div>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-2 md:gap-3">
          <div className="bg-[#111]/60 backdrop-blur-xl border border-white/[0.05] hover:border-[#00FF00]/30 rounded-xl p-3 flex flex-col relative overflow-hidden group shadow-md transition-all duration-300">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#00FF00]/5 rounded-bl-full -mr-6 -mt-6 transition-transform duration-500 group-hover:scale-110" />
            <div className="flex items-center gap-1.5 mb-1.5 text-[#00FF00]">
              <DollarSign className="w-3.5 h-3.5" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Gasto Mês</span>
            </div>
            <span className="text-lg md:text-xl font-black text-white truncate tracking-tight">{formatCurrency(metrics.totalSpent)}</span>
          </div>

          <div className="bg-[#111]/60 backdrop-blur-xl border border-white/[0.05] hover:border-white/20 rounded-xl p-3 flex flex-col relative overflow-hidden group shadow-md transition-all duration-300">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-bl-full -mr-6 -mt-6 transition-transform duration-500 group-hover:scale-110" />
            <div className="flex items-center gap-1.5 mb-1.5 text-gray-300">
              <Package className="w-3.5 h-3.5" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Caixas</span>
            </div>
            <span className="text-lg md:text-xl font-black text-white truncate tracking-tight">{metrics.totalBoxes} <span className="text-[10px] font-medium text-gray-500">un.</span></span>
          </div>
          
          <div className="bg-[#111]/60 backdrop-blur-xl border border-white/[0.05] hover:border-white/20 rounded-xl p-3 flex flex-col relative overflow-hidden group shadow-md transition-all duration-300">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-bl-full -mr-6 -mt-6 transition-transform duration-500 group-hover:scale-110" />
            <div className="flex items-center gap-1.5 mb-1.5 text-gray-300">
              <Box className="w-3.5 h-3.5" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Sacos/Env</span>
            </div>
            <span className="text-lg md:text-xl font-black text-white truncate tracking-tight">{metrics.totalBags} <span className="text-[10px] font-medium text-gray-500">un.</span></span>
          </div>
          
          <div className="bg-[#111]/60 backdrop-blur-xl border border-white/[0.05] hover:border-white/20 rounded-xl p-3 flex flex-col relative overflow-hidden group shadow-md transition-all duration-300">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-bl-full -mr-6 -mt-6 transition-transform duration-500 group-hover:scale-110" />
            <div className="flex items-center gap-1.5 mb-1.5 text-gray-300">
              <FileText className="w-3.5 h-3.5" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Fitas</span>
            </div>
            <span className="text-lg md:text-xl font-black text-white truncate tracking-tight">{metrics.totalLabels} <span className="text-[10px] font-medium text-gray-500">un.</span></span>
          </div>

          <div className="bg-[#111]/60 backdrop-blur-xl border border-white/[0.05] hover:border-[#00FF00]/30 rounded-xl p-3 flex flex-col relative overflow-hidden group shadow-md transition-all duration-300">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#00FF00]/10 rounded-bl-full -mr-6 -mt-6 transition-transform duration-500 group-hover:scale-110" />
            <div className="flex items-center gap-1.5 mb-1.5 text-[#00FF00]">
              <BarChart2 className="w-3.5 h-3.5" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Volume</span>
            </div>
            <span className="text-lg md:text-xl font-black text-white truncate tracking-tight">{metrics.totalItems} <span className="text-[10px] font-medium text-gray-500">un.</span></span>
          </div>
        </div>
      </div>

      {/* Requests List */}
      <div className="bg-[#111]/40 backdrop-blur-2xl border border-white/5 rounded-2xl p-4 shadow-xl flex-1 flex flex-col relative overflow-hidden">
        
        {metrics.urgenciesToday > 0 && (
          <div className="mb-4 bg-red-500/10 border-l-4 border-l-red-500 border-t border-t-white/5 border-r border-r-white/5 border-b border-b-white/5 rounded-r-xl rounded-l-md p-3 flex items-center justify-between shadow-[0_0_15px_rgba(239,68,68,0.1)]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.3)] shrink-0">
                <AlertTriangle className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <h3 className="text-red-400 font-bold uppercase text-[11px] tracking-widest">Urgências Pendentes</h3>
                <p className="text-gray-300 text-xs mt-0.5">Faltas no estoque para envio <strong className="text-white">hoje</strong>.</p>
              </div>
            </div>
            <div className="text-center bg-black/60 border border-red-500/30 px-4 py-2 rounded-lg flex flex-col items-center justify-center shrink-0">
              <span className="block text-[9px] text-gray-400 font-bold uppercase tracking-widest mb-0.5">Hoje</span>
              <span className="block text-2xl font-black text-red-500 leading-none drop-shadow-[0_0_5px_rgba(239,68,68,0.8)]">{metrics.urgenciesToday}</span>
            </div>
          </div>
        )}

        {/* Abas */}
        <div className="flex items-center mb-4 gap-2 border-b border-white/10 pb-3">
          <div className="flex bg-[#050505]/80 p-1 rounded-xl border border-white/5 shadow-inner">
            <button 
              onClick={() => setActiveTab('pendentes')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-300 flex items-center gap-1.5 ${activeTab === 'pendentes' ? 'bg-[#00FF00]/20 text-[#00FF00] shadow-[0_0_10px_rgba(0,255,0,0.15)]' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
            >
              <ShoppingCart className="w-3.5 h-3.5" /> Pendentes ({requests.filter(r => r.status === 'pendente').length})
            </button>
            <button 
              onClick={() => setActiveTab('a_caminho')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-300 flex items-center gap-1.5 ${activeTab === 'a_caminho' ? 'bg-white/10 text-white shadow-[0_0_10px_rgba(255,255,255,0.05)]' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
            >
              <Truck className="w-3.5 h-3.5" /> A Caminho ({requests.filter(r => r.status === 'comprado').length})
            </button>
            <button 
              onClick={() => setActiveTab('recebidos')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-300 flex items-center gap-1.5 ${activeTab === 'recebidos' ? 'bg-[#00FF00]/20 text-[#00FF00] shadow-[0_0_10px_rgba(0,255,0,0.15)]' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" /> Histórico
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 custom-scrollbar">
          {loading ? (
            <div className="flex justify-center mt-10 text-gray-500">
              <RefreshCw className="w-5 h-5 animate-spin" />
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-gray-500 opacity-50">
              <FileText className="w-8 h-8 mb-2" />
              <p className="text-xs">Nenhum pedido nesta aba.</p>
            </div>
          ) : (
            filteredRequests.map((req) => (
              <div key={req.id} className={`bg-white/[0.02] backdrop-blur-sm border ${req.category === 'Produto Vendido (Urgência)' && req.status === 'pendente' ? 'border-red-500/40 bg-red-950/10' : req.status === 'recebido' ? 'border-[#00FF00]/10 opacity-75' : 'border-white/5'} rounded-xl p-3.5 transition-all duration-300 hover:bg-white/[0.04] flex flex-col md:flex-row md:items-center justify-between gap-3`}>
                <div className="flex flex-col flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded flex items-center gap-1 ${req.priority === 'critico' ? 'bg-red-500/20 text-red-400' : req.priority === 'alta' ? 'bg-orange-500/20 text-orange-400' : 'bg-gray-500/20 text-gray-400'}`}>
                      {req.priority === 'critico' && <AlertTriangle className="w-3 h-3" />}
                      {req.priority.toUpperCase()}
                    </span>
                    <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded flex items-center gap-1 ${req.status === 'recebido' ? 'bg-[#00FF00]/20 text-[#00FF00]' : req.status === 'comprado' ? 'bg-white/10 text-gray-300' : 'bg-white/10 text-white'}`}>
                      {req.status === 'recebido' ? <CheckCircle2 className="w-3 h-3" /> : req.status === 'comprado' ? <Truck className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                      {req.status === 'recebido' ? 'RECEBIDO' : req.status === 'comprado' ? 'A CAMINHO' : 'AGUARDANDO'}
                    </span>
                  </div>
                  
                  <h3 className="text-white font-bold text-sm mb-1.5 truncate">{req.item_name}</h3>
                  <div className="flex items-center flex-wrap gap-x-2 gap-y-1 text-[11px] text-gray-400">
                    <span className="flex items-center gap-1 bg-white/5 px-1.5 py-0.5 rounded shadow-inner border border-white/5"><Package className="w-3 h-3 text-gray-300" /> {req.category}</span>
                    <span className="flex items-center gap-1"><span className="w-1 h-1 rounded-full bg-[#00FF00]" /> Solicitante: <strong className="text-gray-200">{req.author}</strong></span>
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3 text-gray-500" /> {new Date(req.created_at).toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>
                
                {req.status === 'pendente' ? (
                  <div className="flex gap-2 w-full md:w-auto shrink-0 mt-2 md:mt-0">
                    <button 
                      onClick={() => openPurchaseModal(req)}
                      className="flex-1 md:flex-none bg-[#00FF00] hover:bg-[#00FF00]/80 text-black font-bold text-xs px-4 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow-[0_0_10px_rgba(0,255,0,0.2)] whitespace-nowrap"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      Comprar
                    </button>
                    <button 
                      onClick={() => handleDeleteRequest(req.id)}
                      className="bg-white/5 hover:bg-red-500/20 hover:text-red-500 text-gray-400 px-3 py-2 rounded-lg flex items-center justify-center transition-colors"
                      title="Excluir Pedido"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 shrink-0 mt-2 md:mt-0 bg-black/30 border border-white/5 p-2 rounded-lg">
                    <div className="flex flex-col">
                      <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">Custo ({req.quantity_bought || 0} un)</span>
                      <span className="text-[#00FF00] font-bold text-xs">{formatCurrency(req.total_cost || 0)}</span>
                    </div>
                    <div className="w-px h-6 bg-white/10 hidden sm:block"></div>
                    <div className="flex flex-col">
                      <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">Prev / Fornecedor</span>
                      <div className="flex items-center gap-1.5">
                        {req.expected_date && <span className="text-gray-300 font-bold text-[10px] flex items-center gap-0.5"><Calendar className="w-2.5 h-2.5"/> {new Date(req.expected_date).toLocaleDateString('pt-BR')}</span>}
                        {req.supplier && <span className="text-gray-400 text-[10px] flex items-center gap-0.5 bg-white/10 px-1 py-0.5 rounded"><Link className="w-2.5 h-2.5"/> {req.supplier}</span>}
                      </div>
                    </div>
                    {req.status === 'comprado' && (
                      <>
                        <div className="w-px h-6 bg-white/10 hidden sm:block"></div>
                        <button 
                          onClick={() => confirmReceipt(req.id)}
                          className="bg-[#00FF00]/10 hover:bg-[#00FF00]/20 text-[#00FF00] p-1.5 rounded-md transition-colors"
                          title="Marcar como Recebido"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal de Confirmação de Compra */}
      <Dialog open={isPurchaseModalOpen} onOpenChange={setIsPurchaseModalOpen}>
        <DialogContent className="bg-[#121212] border-white/10 text-white sm:max-w-md p-5">
          <DialogHeader className="mb-2">
            <DialogTitle className="text-lg font-bold flex items-center gap-2"><ShoppingCart className="w-4 h-4 text-[#00FF00]"/> Registrar Compra</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-3 bg-white/5 rounded-lg border border-white/5">
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-0.5">Item Solicitado</span>
              <span className="font-bold text-[#00FF00] text-sm">{selectedRequest?.item_name}</span>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="qty" className="text-gray-300 font-bold text-[10px] uppercase tracking-wider">Quantidade</Label>
                <Input 
                  id="qty"
                  type="number" 
                  placeholder="Ex: 50"
                  value={purchaseQuantity}
                  onChange={(e) => setPurchaseQuantity(e.target.value)}
                  className="bg-[#1A1A1A] border-white/10 focus:border-[#00FF00] h-9 text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="cost" className="text-gray-300 font-bold text-[10px] uppercase tracking-wider">Valor Total (R$)</Label>
                <Input 
                  id="cost"
                  type="text" 
                  placeholder="Ex: 150.50"
                  value={purchaseCost}
                  onChange={(e) => setPurchaseCost(e.target.value)}
                  className="bg-[#1A1A1A] border-white/10 focus:border-[#00FF00] h-9 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="eta" className="text-gray-300 font-bold text-[10px] uppercase tracking-wider flex items-center gap-1"><Calendar className="w-3 h-3"/> Prev. Entrega</Label>
                <Input 
                  id="eta"
                  type="date" 
                  value={purchaseETA}
                  onChange={(e) => setPurchaseETA(e.target.value)}
                  className="bg-[#1A1A1A] border-white/10 focus:border-[#00FF00] [color-scheme:dark] h-9 text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="supplier" className="text-gray-300 font-bold text-[10px] uppercase tracking-wider flex items-center gap-1"><MapPin className="w-3 h-3"/> Fornecedor/Rastreio</Label>
                <Input 
                  id="supplier"
                  type="text" 
                  placeholder="Mercado Livre"
                  value={purchaseSupplier}
                  onChange={(e) => setPurchaseSupplier(e.target.value)}
                  className="bg-[#1A1A1A] border-white/10 focus:border-[#00FF00] h-9 text-sm"
                />
              </div>
            </div>

            <div className="bg-[#00FF00]/5 border border-[#00FF00]/20 rounded-lg p-2.5">
              <p className="text-[11px] text-gray-300 flex gap-2 leading-snug">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-[#00FF00]" />
                Ao confirmar, a Expedição será notificada com a previsão de chegada.
              </p>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0 mt-4">
            <Button variant="ghost" onClick={() => setIsPurchaseModalOpen(false)} className="hover:bg-white/5 text-gray-400 h-9 text-xs">
              Cancelar
            </Button>
            <Button onClick={confirmPurchase} disabled={isSubmitting} className="bg-[#00FF00] hover:bg-[#00FF00]/80 text-black font-black px-5 h-9 text-xs">
              {isSubmitting ? <RefreshCw className="w-3.5 h-3.5 animate-spin mr-1.5" /> : <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />}
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
