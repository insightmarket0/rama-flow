import { useState, useEffect, useMemo } from "react";
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Loader2, FileText, PackageOpen, Settings2 } from "lucide-react";
import { formatCurrencyBRL } from "@/lib/format";
import { useOrders } from "@/hooks/useOrders";
import { toast } from "sonner";
import { generateInstallmentPlan } from "@/lib/installments";
import { PaymentConditionDialog } from "@/components/payment-conditions/PaymentConditionDialog";

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
    items: [{ sku: "", description: "", quantity: 1, unit_price: 0 }],
    installments_override: []
  });

  const [isPending, setIsPending] = useState(false);

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
          items: orderToEdit.items && orderToEdit.items.length > 0 ? orderToEdit.items : [{ sku: "", description: "", quantity: 1, unit_price: 0 }],
          installments_override: orderToEdit.installments_override || []
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
          items: [{ sku: "", description: "", quantity: 1, unit_price: 0 }],
          installments_override: []
        });
      }
    }
  }, [open, orderToEdit]);

  const calculateTotal = () => {
    const itemsTotal = formData.items.reduce((sum: number, item: any) => sum + (Number(item.quantity) * Number(item.unit_price)), 0);
    return itemsTotal + Number(formData.freight) + Number(formData.taxes) - Number(formData.discount);
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;
    setFormData({ ...formData, items: newItems });
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

  const currentTotal = calculateTotal();
  useEffect(() => {
    if (!formData.payment_condition_id || currentTotal <= 0) {
      if (formData.installments_override?.length > 0 && !orderToEdit) {
         setFormData((prev: any) => ({ ...prev, installments_override: [] }));
      }
      return;
    }
    
    const condition = paymentConditions.find((c: any) => c.id === formData.payment_condition_id);
    if (condition && (!orderToEdit || formData.payment_condition_id !== orderToEdit?.payment_condition_id)) {
       const baseDate = new Date(`${formData.order_date}T12:00:00`);
       const plan = generateInstallmentPlan(currentTotal, condition, baseDate);
       const override = plan.map(p => ({
         installmentNumber: p.installmentNumber,
         label: p.installmentNumber === 0 ? "Entrada" : `Parcela ${p.installmentNumber}`,
         value: p.value,
         due_date: p.dueDate.toISOString().split('T')[0]
       }));
       setFormData((prev: any) => ({ ...prev, installments_override: override }));
    }
  }, [formData.payment_condition_id, currentTotal, formData.order_date, paymentConditions, orderToEdit]);

  const handleInstallmentChange = (index: number, field: string, value: any) => {
    const newInst = [...(formData.installments_override || [])];
    newInst[index][field] = value;
    setFormData({ ...formData, installments_override: newInst });
  };

  const handleSubmit = async () => {
    try {
      if (!formData.supplier_id) return toast.error("Selecione um fornecedor");
      if (!formData.payment_condition_id) return toast.error("Selecione uma condição de pagamento");
      if (formData.items.length === 0) return toast.error("Adicione pelo menos um item");
      if (formData.items.some((i: any) => !i.description || i.quantity <= 0)) return toast.error("Verifique os itens do pedido");

      const sumInstallments = formData.installments_override.reduce((acc: number, inst: any) => acc + Number(inst.value), 0);
      if (formData.installments_override.length > 0 && Math.abs(sumInstallments - currentTotal) > 0.05) {
         return toast.error(`A soma das parcelas (${formatCurrencyBRL(sumInstallments)}) não bate com o total (${formatCurrencyBRL(currentTotal)}).`);
      }

      setIsPending(true);
      const payload = {
        ...formData,
        freight: Number(formData.freight),
        taxes: Number(formData.taxes),
        discount: Number(formData.discount),
        items: formData.items.map((i: any) => ({
          ...i,
          quantity: Number(i.quantity),
          unit_price: Number(i.unit_price)
        })),
        installments_override: formData.installments_override.map((i: any) => ({
          installmentNumber: i.installmentNumber,
          value: Number(i.value),
          due_date: i.due_date
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
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl bg-[#111111] border-white/10 text-white p-0 overflow-hidden shadow-2xl rounded-2xl flex flex-col max-h-[90vh]">
        
        <DialogHeader className="p-6 pb-4 border-b border-white/5 bg-black/20 flex-shrink-0">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 rounded-lg bg-[#00FF00]/10 flex items-center justify-center border border-[#00FF00]/20">
              <PackageOpen className="w-4 h-4 text-[#00FF00]" />
            </div>
            <DialogTitle className="text-xl font-light tracking-tight text-white">
              {orderToEdit ? "Editar Pedido de Compra" : "Novo Pedido de Compra"}
            </DialogTitle>
          </div>
          <p className="text-sm text-gray-400 font-medium ml-11">Preencha os detalhes para registrar a ordem de compra e gerar o financeiro.</p>
        </DialogHeader>

        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
          <div className="space-y-8">
            
            {/* General Details */}
            <div className="space-y-4">
              <h3 className="text-[10px] uppercase tracking-widest text-gray-500 font-medium border-b border-white/5 pb-1.5">
                Detalhes Gerais
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-1 md:col-span-1">
                  <Label className="text-gray-400 text-[9px] uppercase tracking-wider font-semibold">Fornecedor *</Label>
                  <Select value={formData.supplier_id} onValueChange={(v) => setFormData({...formData, supplier_id: v})}>
                    <SelectTrigger className="bg-white/[0.02] border-white/10 text-white h-9 focus:ring-1 focus:ring-[#00FF00]/50 transition-all shadow-inner">
                      <SelectValue placeholder="Selecione o fornecedor" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1C1C1E] border-white/10 text-white shadow-xl">
                      {suppliers.map((s: any) => (
                        <SelectItem key={s.id} value={s.id} className="focus:bg-white/5 focus:text-white">{s.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <Label className="text-gray-400 text-[9px] uppercase tracking-wider font-semibold">Nº do Pedido</Label>
                  <Input 
                    placeholder="Opcional"
                    value={formData.order_number}
                    onChange={e => setFormData({...formData, order_number: e.target.value})}
                    className="bg-white/[0.02] border-white/10 text-white h-9 focus-visible:ring-1 focus-visible:ring-[#00FF00]/50 shadow-inner"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-gray-400 text-[9px] uppercase tracking-wider font-semibold">Nº da Nota Fiscal</Label>
                  <Input 
                    placeholder="Opcional"
                    value={formData.invoice_number}
                    onChange={e => setFormData({...formData, invoice_number: e.target.value})}
                    className="bg-white/[0.02] border-white/10 text-white h-9 focus-visible:ring-1 focus-visible:ring-[#00FF00]/50 shadow-inner"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-gray-400 text-[9px] uppercase tracking-wider font-semibold">Data da Compra</Label>
                  <Input 
                    type="date"
                    value={formData.order_date}
                    onChange={e => setFormData({...formData, order_date: e.target.value})}
                    className="bg-white/[0.02] border-white/10 text-white h-9 focus-visible:ring-1 focus-visible:ring-[#00FF00]/50 shadow-inner [color-scheme:dark]"
                  />
                </div>
              </div>
            </div>

            {/* Items */}
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-white/5 pb-1.5">
                <h3 className="text-[10px] uppercase tracking-widest text-gray-500 font-medium">
                  Itens do Pedido *
                </h3>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleAddItem}
                  className="h-6 text-[10px] font-bold uppercase tracking-wider text-[#00FF00] hover:text-[#00FF00] hover:bg-[#00FF00]/10 px-2"
                >
                  <Plus className="w-3 h-3 mr-1" /> Adicionar Item
                </Button>
              </div>

              <div className="space-y-2">
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
            <div className="space-y-3 border-t border-white/5 pt-4">
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
                <div className="space-y-1 flex flex-col">
                  <Label className="text-gray-400 text-[9px] uppercase tracking-wider font-semibold mb-1 flex justify-between items-center">
                    <span>Condição de Pgto *</span>
                    <PaymentConditionDialog 
                      trigger={<button type="button" className="text-[#00FF00] hover:underline">Nova</button>}
                      onSuccess={(c) => setFormData({...formData, payment_condition_id: c.id})}
                    />
                  </Label>
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

            {/* Installments Overrides */}
            {formData.installments_override && formData.installments_override.length > 0 && (
              <div className="bg-[#1C1C1E]/50 rounded-xl border border-white/5 p-4 space-y-3">
                <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-widest">
                  <Settings2 className="w-3.5 h-3.5" /> 
                  Personalizar Parcelas (Auto-calculado)
                </div>
                
                <div className="space-y-2">
                  <div className="flex gap-2 px-1 text-[9px] uppercase tracking-widest text-gray-500 font-semibold mb-1">
                    <div className="w-20">Parcela</div>
                    <div className="w-36">Vencimento</div>
                    <div className="flex-1 text-right">Valor (R$)</div>
                  </div>
                  {formData.installments_override.map((inst: any, idx: number) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <div className="w-20 text-[11px] font-medium text-gray-300 bg-white/[0.02] h-8 rounded-md border border-white/5 flex items-center px-3">
                        {inst.label}
                      </div>
                      <Input 
                        type="date"
                        value={inst.due_date}
                        onChange={e => handleInstallmentChange(idx, "due_date", e.target.value)}
                        className="bg-white/[0.02] border-white/10 text-white h-8 text-xs w-36 focus-visible:ring-1 focus-visible:ring-[#00FF00]/50 [color-scheme:dark]"
                      />
                      <div className="relative flex-1 max-w-[200px] ml-auto">
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500 text-[10px]">R$</span>
                        <Input 
                          type="number"
                          step="0.01"
                          min="0"
                          value={inst.value}
                          onChange={e => handleInstallmentChange(idx, "value", e.target.value)}
                          className="bg-white/[0.02] border-white/10 text-white h-8 text-xs pl-7 focus-visible:ring-1 focus-visible:ring-[#00FF00]/50 text-right font-medium"
                        />
                      </div>
                    </div>
                  ))}
                  
                  {/* Totals Validation */}
                  <div className="flex justify-end text-[10px] font-mono mt-2 pt-2 border-t border-white/5">
                    {(() => {
                      const sum = formData.installments_override.reduce((acc: number, inst: any) => acc + Number(inst.value), 0);
                      const diff = currentTotal - sum;
                      const isValid = Math.abs(diff) <= 0.05;
                      return (
                        <div className={`flex items-center gap-2 ${isValid ? 'text-gray-500' : 'text-red-400 font-bold'}`}>
                          <span>Soma: {formatCurrencyBRL(sum)}</span>
                          {!isValid && <span>(Diferença de {formatCurrencyBRL(Math.abs(diff))})</span>}
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>
            )}

            {/* Total Bar */}
            <div className="flex justify-end pt-4 border-t border-white/5">
              <div className="flex items-center gap-6">
                <span className="text-[11px] text-gray-400 uppercase tracking-widest font-medium">Custo Final do Pedido:</span>
                <span className="text-4xl font-light text-[#00FF00]">
                  {formatCurrencyBRL(currentTotal)}
                </span>
              </div>
            </div>

          </div>
        </div>

        <DialogFooter className="bg-[#151515] border-t border-white/5 p-6 flex items-center justify-between flex-shrink-0">
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
