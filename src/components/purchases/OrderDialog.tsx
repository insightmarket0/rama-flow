import { useState, useEffect } from "react";
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Loader2, X, FileText, PackageOpen } from "lucide-react";
import { formatCurrencyBRL } from "@/lib/format";
import { useOrders } from "@/hooks/useOrders";
import { toast } from "sonner";

export function OrderDialog({ 
  open, 
  onOpenChange, 
  orderToEdit,
  suppliers,
  paymentConditions
}: any) {
  const { createOrder, updateOrder } = useOrders();
  
  const [formData, setFormData] = useState<any>({
    supplier_id: "",
    order_number: "",
    invoice_number: "",
    order_date: new Date().toISOString().split('T')[0],
    freight: 0,
    taxes: 0,
    discount: 0,
    payment_condition_id: "",
    items: [{ sku: "", description: "", quantity: 1, unit_price: 0 }]
  });

  useEffect(() => {
    if (open) {
      if (orderToEdit) {
        setFormData({
          supplier_id: orderToEdit.supplier_id || "",
          order_number: orderToEdit.order_number || "",
          invoice_number: orderToEdit.invoice_number || "",
          order_date: orderToEdit.order_date || new Date().toISOString().split('T')[0],
          freight: orderToEdit.freight || 0,
          taxes: orderToEdit.taxes || 0,
          discount: orderToEdit.discount || 0,
          payment_condition_id: orderToEdit.payment_condition_id || "",
          items: orderToEdit.items && orderToEdit.items.length > 0 ? orderToEdit.items : [{ sku: "", description: "", quantity: 1, unit_price: 0 }]
        });
      } else {
        setFormData({
          supplier_id: "",
          order_number: "",
          invoice_number: "",
          order_date: new Date().toISOString().split('T')[0],
          freight: 0,
          taxes: 0,
          discount: 0,
          payment_condition_id: "",
          items: [{ sku: "", description: "", quantity: 1, unit_price: 0 }]
        });
      }
    }
  }, [open, orderToEdit]);

  const calculateTotal = () => {
    const itemsTotal = formData.items.reduce((sum: number, item: any) => sum + (Number(item.quantity) * Number(item.unit_price)), 0);
    return itemsTotal + Number(formData.freight) + Number(formData.taxes) - Number(formData.discount);
  };

  const handleAddItem = () => {
    setFormData((prev: any) => ({
      ...prev,
      items: [...prev.items, { sku: "", description: "", quantity: 1, unit_price: 0 }]
    }));
  };

  const handleRemoveItem = (index: number) => {
    setFormData((prev: any) => ({
      ...prev,
      items: prev.items.filter((_: any, i: number) => i !== index)
    }));
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    setFormData((prev: any) => {
      const newItems = [...prev.items];
      newItems[index] = { ...newItems[index], [field]: value };
      return { ...prev, items: newItems };
    });
  };

  const handleSubmit = async () => {
    try {
      if (!formData.supplier_id) return toast.error("Selecione um fornecedor");
      if (!formData.payment_condition_id) return toast.error("Selecione uma condição de pagamento");
      if (formData.items.length === 0) return toast.error("Adicione pelo menos um item");
      if (formData.items.some((i: any) => !i.description || i.quantity <= 0)) return toast.error("Verifique os itens do pedido");

      const payload = {
        ...formData,
        freight: Number(formData.freight),
        taxes: Number(formData.taxes),
        discount: Number(formData.discount),
        items: formData.items.map((i: any) => ({
          ...i,
          quantity: Number(i.quantity),
          unit_price: Number(i.unit_price)
        }))
      };

      if (orderToEdit) {
        await updateOrder.mutateAsync({ id: orderToEdit.id, ...payload });
      } else {
        await createOrder.mutateAsync(payload);
      }
      onOpenChange(false);
    } catch (e: any) {
      console.error(e);
      toast.error("Erro ao salvar pedido");
    }
  };

  const isPending = createOrder.isPending || updateOrder.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#111111] border-white/10 text-white max-w-5xl shadow-2xl p-0 overflow-hidden">
        
        {/* Custom Header with Gradient */}
        <div className="bg-gradient-to-r from-[#1A1A1D] to-[#111111] border-b border-white/5 p-6 relative">
          <DialogTitle className="text-xl font-light text-white flex items-center gap-2">
            <PackageOpen className="h-5 w-5 text-[#00FF00]" />
            {orderToEdit ? "Editar Pedido de Compra" : "Novo Pedido de Compra"}
          </DialogTitle>
          <p className="text-gray-400 text-sm mt-1">Preencha os detalhes para registrar a ordem de compra e gerar o financeiro.</p>
        </div>

        <div className="p-5 max-h-[75vh] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10">
          <div className="space-y-6">
            
            {/* Top Section - Details */}
            <div className="space-y-3">
              <h3 className="text-[10px] uppercase tracking-widest text-gray-500 font-medium border-b border-white/5 pb-1.5">
                Detalhes Gerais
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div className="space-y-1">
                  <Label className="text-gray-400 text-[9px] uppercase tracking-wider font-semibold">Fornecedor *</Label>
                  <Select value={formData.supplier_id} onValueChange={(v) => setFormData({...formData, supplier_id: v})}>
                    <SelectTrigger className="bg-white/[0.02] border-white/10 text-white h-8 text-xs hover:bg-white/[0.04] transition-colors">
                      <SelectValue placeholder="Selecione o fornecedor" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1C1C1E] border-white/10 text-white">
                      {suppliers.map((s: any) => (
                        <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-gray-400 text-[9px] uppercase tracking-wider font-semibold">Nº do Pedido</Label>
                  <Input 
                    value={formData.order_number}
                    onChange={e => setFormData({...formData, order_number: e.target.value})}
                    placeholder="Opcional"
                    className="bg-white/[0.02] border-white/10 text-white h-8 text-xs hover:bg-white/[0.04] transition-colors placeholder:text-gray-600"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-gray-400 text-[9px] uppercase tracking-wider font-semibold">Nº da Nota Fiscal</Label>
                  <Input 
                    value={formData.invoice_number}
                    onChange={e => setFormData({...formData, invoice_number: e.target.value})}
                    placeholder="Opcional"
                    className="bg-white/[0.02] border-white/10 text-white h-8 text-xs hover:bg-white/[0.04] transition-colors placeholder:text-gray-600"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-gray-400 text-[9px] uppercase tracking-wider font-semibold">Data da compra</Label>
                  <Input 
                    type="date"
                    value={formData.order_date}
                    onChange={e => setFormData({...formData, order_date: e.target.value})}
                    className="bg-white/[0.02] border-white/10 text-white h-8 text-xs hover:bg-white/[0.04] transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Items Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-white/5 pb-1.5">
                <h3 className="text-[10px] uppercase tracking-widest text-gray-500 font-medium">
                  Itens do Pedido *
                </h3>
                <Button 
                  type="button"
                  variant="ghost"
                  className="h-6 text-[9px] uppercase tracking-wider text-[#00FF00] hover:bg-[#00FF00]/10 hover:text-[#00FF00] px-2 rounded-full"
                  onClick={handleAddItem}
                >
                  <Plus className="h-3 w-3 mr-1" /> Adicionar Item
                </Button>
              </div>
              
              <div className="space-y-1.5">
                {/* Table Header (Visual) */}
                <div className="flex gap-2 px-1 text-[9px] uppercase tracking-widest text-gray-500 font-semibold mb-1">
                  <div className="w-6"></div>
                  <div className="w-28">SKU / Cód</div>
                  <div className="flex-1">Descrição do Produto</div>
                  <div className="w-20">Qtd</div>
                  <div className="w-28">Val. Unit</div>
                  <div className="w-24 text-right">Subtotal</div>
                  <div className="w-6"></div>
                </div>

                {formData.items.map((item: any, idx: number) => (
                  <div key={idx} className="flex gap-2 items-center group">
                    <div className="w-6 text-center text-[10px] text-gray-600 font-mono">
                      {String(idx + 1).padStart(2, '0')}
                    </div>
                    <Input 
                      placeholder="SKU"
                      value={item.sku}
                      onChange={e => handleItemChange(idx, "sku", e.target.value)}
                      className="bg-white/[0.02] border-white/10 text-white h-8 text-xs w-28 focus-visible:ring-1 focus-visible:ring-[#00FF00]/50"
                    />
                    <Input 
                      placeholder="Descrição"
                      value={item.description}
                      onChange={e => handleItemChange(idx, "description", e.target.value)}
                      className="bg-white/[0.02] border-white/10 text-white h-8 text-xs flex-1 focus-visible:ring-1 focus-visible:ring-[#00FF00]/50"
                    />
                    <Input 
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={e => handleItemChange(idx, "quantity", e.target.value)}
                      className="bg-white/[0.02] border-white/10 text-white h-8 text-xs w-20 focus-visible:ring-1 focus-visible:ring-[#00FF00]/50"
                    />
                    <div className="relative w-28">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500 text-[10px]">R$</span>
                      <Input 
                        type="number"
                        step="0.01"
                        min="0"
                        value={item.unit_price}
                        onChange={e => handleItemChange(idx, "unit_price", e.target.value)}
                        className="bg-white/[0.02] border-white/10 text-white h-8 text-xs pl-7 focus-visible:ring-1 focus-visible:ring-[#00FF00]/50"
                      />
                    </div>
                    <div className="w-24 text-right text-xs font-medium text-gray-300 bg-black/20 h-8 rounded-md border border-white/5 flex items-center justify-end px-3">
                      {formatCurrencyBRL(item.quantity * item.unit_price)}
                    </div>
                    <div className="w-6 flex justify-end">
                      <Button
                        type="button"
                        variant="ghost"
                        className="h-6 w-6 p-0 text-gray-600 hover:text-red-400 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleRemoveItem(idx)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial Section */}
            <div className="space-y-3">
              <h3 className="text-[10px] uppercase tracking-widest text-gray-500 font-medium border-b border-white/5 pb-1.5">
                Financeiro & Condições
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div className="space-y-1 relative">
                  <Label className="text-gray-400 text-[9px] uppercase tracking-wider font-semibold">Frete (R$)</Label>
                  <Input 
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.freight}
                    onChange={e => setFormData({...formData, freight: e.target.value})}
                    className="bg-white/[0.02] border-white/10 text-white h-8 text-xs focus-visible:ring-1 focus-visible:ring-[#00FF00]/50"
                  />
                </div>
                <div className="space-y-1 relative">
                  <Label className="text-gray-400 text-[9px] uppercase tracking-wider font-semibold">Impostos (R$)</Label>
                  <Input 
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.taxes}
                    onChange={e => setFormData({...formData, taxes: e.target.value})}
                    className="bg-white/[0.02] border-white/10 text-white h-8 text-xs focus-visible:ring-1 focus-visible:ring-[#00FF00]/50"
                  />
                </div>
                <div className="space-y-1 relative">
                  <Label className="text-gray-400 text-[9px] uppercase tracking-wider font-semibold">Desconto (R$)</Label>
                  <Input 
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.discount}
                    onChange={e => setFormData({...formData, discount: e.target.value})}
                    className="bg-[#00FF00]/5 border-[#00FF00]/20 text-[#00FF00] h-8 text-xs focus-visible:ring-1 focus-visible:ring-[#00FF00]/50 placeholder:text-[#00FF00]/30"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-gray-400 text-[9px] uppercase tracking-wider font-semibold">Condição de Pgto *</Label>
                  <Select value={formData.payment_condition_id} onValueChange={(v) => setFormData({...formData, payment_condition_id: v})}>
                    <SelectTrigger className="bg-white/[0.02] border-white/10 text-white h-8 text-xs hover:bg-white/[0.04] transition-colors">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1C1C1E] border-white/10 text-white">
                      {paymentConditions.map((pc: any) => (
                        <SelectItem key={pc.id} value={pc.id}>{pc.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Total Bar */}
            <div className="flex justify-end pt-4 border-t border-white/5">
              <div className="flex items-center gap-6">
                <span className="text-[11px] text-gray-400 uppercase tracking-widest font-medium">Custo Final do Pedido:</span>
                <span className="text-4xl font-light text-[#00FF00]">
                  {formatCurrencyBRL(calculateTotal())}
                </span>
              </div>
            </div>

          </div>
        </div>

        <DialogFooter className="bg-[#151515] border-t border-white/5 p-6 flex items-center justify-between">
          <Button 
            variant="ghost" 
            onClick={() => onOpenChange(false)}
            className="text-gray-400 hover:text-white hover:bg-white/5 h-11 px-6 rounded-lg"
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isPending}
            className="bg-[#00FF00] text-black hover:bg-[#00FF00]/80 font-bold h-11 px-10 rounded-lg shadow-[0_0_20px_rgba(0,255,0,0.15)] transition-all"
          >
            {isPending ? <Loader2 className="animate-spin h-5 w-5 mr-2" /> : (orderToEdit ? "Salvar Alterações" : "Criar Pedido de Compra")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
