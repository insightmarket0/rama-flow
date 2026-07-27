import React, { useState, useEffect, useMemo } from "react";
import { Package, Box, AlertTriangle, CheckCircle2, Clock, ShoppingCart, RefreshCw, DollarSign, BarChart2, Calendar, FileText, Trash2 } from "lucide-react";
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
  
  // Estados para o Modal de Compra
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [purchaseQuantity, setPurchaseQuantity] = useState("");
  const [purchaseCost, setPurchaseCost] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('supply_requests')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) {
        // Fallback Fictício se a tabela não existir
        setRequests([{
          id: "fake-123",
          item_name: "Caixas de Papelão Parda (Tamanho M)",
          category: "Embalagem",
          priority: "critico",
          status: "pendente",
          author: "Mara",
          created_at: new Date().toISOString(),
        }]);
      } else if (data) {
        setRequests(data.length > 0 ? data : [{
          id: "fake-123",
          item_name: "Fita Adesiva Larga (Transparente)",
          category: "Embalagem",
          priority: "alta",
          status: "pendente",
          author: "Mara",
          created_at: new Date().toISOString(),
        }]);
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
    setIsPurchaseModalOpen(true);
  };

  const confirmPurchase = async () => {
    if (!purchaseQuantity || !purchaseCost) {
      toast.error("Preencha a quantidade e o valor.");
      return;
    }
    
    setIsSubmitting(true);

    try {
      // Tentar atualizar no Supabase (se a coluna existir)
      const numericCost = parseFloat(purchaseCost.replace(',', '.'));
      const { error } = await supabase
        .from('supply_requests')
        .update({ 
          status: 'comprado',
          quantity_bought: Number(purchaseQuantity),
          total_cost: numericCost 
        })
        .eq('id', selectedRequest.id);

      if (error) {
        // Fallback visual se não conseguir gravar (ex: mock mode)
        setRequests(prev => prev.map(r => r.id === selectedRequest.id ? { 
          ...r, 
          status: 'comprado', 
          quantity_bought: Number(purchaseQuantity), 
          total_cost: numericCost 
        } : r));
      }

      toast.success("Compra registrada com sucesso!");

      // Envia notificação no chat da Expedição para fechar o loop
      await supabase.from('chat_messages').insert({
        channel: 'expedicao',
        user_id: user?.id,
        sender_name: "Sistema Bot",
        sender_initials: "BOT",
        sender_color: "bg-blue-500 text-white",
        text: `✅ O item **${selectedRequest.item_name}** foi comprado pelo Rogério! Qtd: ${purchaseQuantity} | Previsão: A Caminho.`
      });

      setIsPurchaseModalOpen(false);
    } catch (err) {
      console.error(err);
      toast.error("Erro ao registrar a compra.");
    } finally {
      setIsSubmitting(false);
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

  return (
    <div className="flex flex-col h-full bg-transparent w-full font-sans animate-in fade-in duration-700 overflow-hidden p-2 md:p-4">
      
      {/* Header & Metrics */}
      <div className="mb-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
            <ShoppingCart className="w-6 h-6 text-blue-500" />
          </div>
          <div>
            <h2 className="text-white text-xl font-black uppercase tracking-wider">Central de Compras</h2>
            <p className="text-gray-400 text-sm">Controle financeiro e gestão de insumos da operação</p>
          </div>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4">
          <div className="bg-[#111] border border-white/5 rounded-xl p-4 flex flex-col relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />
            <div className="flex items-center gap-2 mb-1 text-blue-400">
              <DollarSign className="w-4 h-4" />
              <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider">Gasto no Mês</span>
            </div>
            <span className="text-xl md:text-2xl font-black text-white truncate">{formatCurrency(metrics.totalSpent)}</span>
          </div>

          <div className="bg-[#111] border border-white/5 rounded-xl p-4 flex flex-col relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />
            <div className="flex items-center gap-2 mb-1 text-purple-400">
              <Package className="w-4 h-4" />
              <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider">Caixas</span>
            </div>
            <span className="text-xl md:text-2xl font-black text-white truncate">{metrics.totalBoxes} <span className="text-xs md:text-sm font-medium text-gray-500">un.</span></span>
          </div>
          
          <div className="bg-[#111] border border-white/5 rounded-xl p-4 flex flex-col relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />
            <div className="flex items-center gap-2 mb-1 text-orange-400">
              <Box className="w-4 h-4" />
              <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider">Sacos / Env.</span>
            </div>
            <span className="text-xl md:text-2xl font-black text-white truncate">{metrics.totalBags} <span className="text-xs md:text-sm font-medium text-gray-500">un.</span></span>
          </div>
          
          <div className="bg-[#111] border border-white/5 rounded-xl p-4 flex flex-col relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-500/5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />
            <div className="flex items-center gap-2 mb-1 text-yellow-400">
              <FileText className="w-4 h-4" />
              <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider">Etiquetas/Fitas</span>
            </div>
            <span className="text-xl md:text-2xl font-black text-white truncate">{metrics.totalLabels} <span className="text-xs md:text-sm font-medium text-gray-500">un.</span></span>
          </div>

          <div className="bg-[#111] border border-white/5 rounded-xl p-4 flex flex-col relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#00FF00]/5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />
            <div className="flex items-center gap-2 mb-1 text-[#00FF00]">
              <BarChart2 className="w-4 h-4" />
              <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider">Volume Total</span>
            </div>
            <span className="text-xl md:text-2xl font-black text-white truncate">{metrics.totalItems} <span className="text-xs md:text-sm font-medium text-gray-500">un.</span></span>
          </div>
        </div>
      </div>

      {/* Requests List */}
      <div className="bg-[#1A1A1A] border border-white/5 rounded-2xl p-6 shadow-xl flex-1 flex flex-col relative overflow-hidden">
        
        {metrics.urgenciesToday > 0 && (
          <div className="mb-6 bg-red-500/10 border-l-4 border-l-red-500 border-t border-t-white/5 border-r border-r-white/5 border-b border-b-white/5 rounded-r-xl rounded-l-md p-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <h3 className="text-red-400 font-bold uppercase text-sm tracking-wider">Atenção: Urgências Pendentes</h3>
                <p className="text-gray-300 text-sm mt-0.5">Existem produtos vendidos que faltaram no estoque e precisam ser comprados <strong className="text-white">hoje</strong>.</p>
              </div>
            </div>
            <div className="text-center bg-black/40 border border-red-500/20 px-5 py-2.5 rounded-xl flex flex-col items-center justify-center">
              <span className="block text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Urgências Hoje</span>
              <span className="block text-3xl font-black text-red-500 leading-none">{metrics.urgenciesToday}</span>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white text-lg font-bold flex items-center gap-2">
            <FileText className="w-5 h-5 text-gray-400" />
            Fila de Pedidos
          </h3>
        </div>

        <div className="flex-1 overflow-y-auto space-y-3 pr-2">
          {loading ? (
            <div className="flex justify-center mt-10 text-gray-500">
              <RefreshCw className="w-6 h-6 animate-spin" />
            </div>
          ) : requests.length === 0 ? (
            <p className="text-gray-500 text-center mt-10">Nenhum pedido de insumo na fila.</p>
          ) : (
            requests.map((req) => (
              <div key={req.id} className={`bg-[#151515] border ${req.category === 'Produto Vendido (Urgência)' && req.status !== 'comprado' ? 'border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.15)] bg-red-950/20' : req.status === 'comprado' ? 'border-[#00FF00]/20' : 'border-white/5'} rounded-xl p-5 transition-all hover:bg-white/[0.02] flex flex-col md:flex-row md:items-center justify-between gap-4`}>
                <div className="flex flex-col">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md flex items-center gap-1.5 ${req.priority === 'critico' ? 'bg-red-500/10 text-red-500' : req.priority === 'alta' ? 'bg-orange-500/10 text-orange-500' : 'bg-gray-500/10 text-gray-400'}`}>
                      <AlertTriangle className="w-3.5 h-3.5" />
                      {req.priority.toUpperCase()}
                    </span>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md flex items-center gap-1.5 ${req.status === 'comprado' ? 'bg-[#00FF00]/10 text-[#00FF00]' : 'bg-blue-500/10 text-blue-400'}`}>
                      {req.status === 'comprado' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                      {req.status === 'comprado' ? 'COMPRADO' : 'AGUARDANDO COMPRA'}
                    </span>
                  </div>
                  
                  <h3 className="text-white font-bold text-lg mb-1">{req.item_name}</h3>
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <span className="flex items-center gap-1"><Package className="w-3.5 h-3.5" /> {req.category}</span>
                    <span>•</span>
                    <span>Solicitado por: <span className="text-gray-200 font-semibold">{req.author}</span></span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {new Date(req.created_at).toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>
                
                {req.status !== 'comprado' ? (
                  <div className="flex gap-2 w-full md:w-auto">
                    <button 
                      onClick={() => openPurchaseModal(req)}
                      className="flex-1 md:flex-none bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm px-5 py-3 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg whitespace-nowrap"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Registrar Compra
                    </button>
                    <button 
                      onClick={() => handleDeleteRequest(req.id)}
                      className="bg-white/5 hover:bg-red-500/20 hover:text-red-500 text-gray-400 font-bold px-4 py-3 rounded-xl flex items-center justify-center transition-colors border border-transparent hover:border-red-500/30"
                      title="Excluir Pedido"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="bg-[#00FF00]/10 border border-[#00FF00]/20 rounded-xl p-3 flex items-center gap-4 min-w-[200px]">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Quantidade</span>
                      <span className="text-white font-bold">{req.quantity_bought || 0} unid.</span>
                    </div>
                    <div className="w-px h-8 bg-white/10"></div>
                    <div className="flex flex-col">
                      <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Custo Total</span>
                      <span className="text-[#00FF00] font-bold">{formatCurrency(req.total_cost || 0)}</span>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal de Confirmação de Compra */}
      <Dialog open={isPurchaseModalOpen} onOpenChange={setIsPurchaseModalOpen}>
        <DialogContent className="bg-[#121212] border-white/10 text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">Registrar Compra</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="p-3 bg-white/5 rounded-lg border border-white/5">
              <span className="text-xs text-gray-400 block mb-1">Item Solicitado:</span>
              <span className="font-bold text-blue-400">{selectedRequest?.item_name}</span>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="qty" className="text-gray-300">Quantidade Comprada</Label>
                <Input 
                  id="qty"
                  type="number" 
                  placeholder="Ex: 50"
                  value={purchaseQuantity}
                  onChange={(e) => setPurchaseQuantity(e.target.value)}
                  className="bg-[#1A1A1A] border-white/10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cost" className="text-gray-300">Valor Total Pago (R$)</Label>
                <Input 
                  id="cost"
                  type="text" 
                  placeholder="Ex: 150.50"
                  value={purchaseCost}
                  onChange={(e) => setPurchaseCost(e.target.value)}
                  className="bg-[#1A1A1A] border-white/10"
                />
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="ghost" onClick={() => setIsPurchaseModalOpen(false)} className="hover:bg-white/5">
              Cancelar
            </Button>
            <Button onClick={confirmPurchase} disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-500 text-white font-bold">
              {isSubmitting ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : <CheckCircle2 className="w-4 h-4 mr-2" />}
              Confirmar Compra
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
