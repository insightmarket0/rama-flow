import React, { useState, useEffect } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Plus, Trash2, Users } from "lucide-react";
import { useSmartContracts } from "@/hooks/useSmartContracts";
import { formatCurrencyBRL } from "@/lib/format";

interface StaffPopoverProps {
  expenseToEdit?: any;
  type: "prolabore" | "folha";
  children: React.ReactNode;
}

interface Partner {
  id: string;
  name: string;
  amount: string;
  day: string;
  pix_key: string;
}

export function StaffPopover({ expenseToEdit, type, children }: StaffPopoverProps) {
  const [open, setOpen] = useState(false);
  const { createSmartContract, updateSmartContract } = useSmartContracts();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [partners, setPartners] = useState<Partner[]>([]);

  useEffect(() => {
    if (open && expenseToEdit) {
      let loadedPartners: Partner[] = [];
      if (expenseToEdit.notes) {
        try {
          const parsed = JSON.parse(expenseToEdit.notes);
          if (parsed.split_rules && Array.isArray(parsed.split_rules)) {
            loadedPartners = parsed.split_rules.map((r: any) => ({
              id: Math.random().toString(),
              name: r.name || "",
              amount: r.amount ? String(r.amount) : "",
              day: r.day ? String(r.day) : "",
              pix_key: r.pix_key || ""
            }));
          }
        } catch (e) {}
      }
      setPartners(loadedPartners);
    } else if (open && !expenseToEdit) {
      setPartners([]);
    }
  }, [open, expenseToEdit]);

  const handleAddPartner = () => {
    setPartners([...partners, { id: Math.random().toString(), name: "", amount: "", day: "", pix_key: "" }]);
  };

  const handleRemovePartner = (id: string) => {
    setPartners(partners.filter(p => p.id !== id));
  };

  const handleChange = (id: string, field: keyof Partner, value: string) => {
    setPartners(partners.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const totalAmount = partners.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

  const isProlabore = type === "prolabore";
  const title = isProlabore ? "Pró-labore (Diretoria)" : "Folha de Pagamento";
  const entityName = isProlabore ? "Sócio" : "Funcionário";
  const totalLabel = isProlabore ? "Total Pró-labore" : "Total Folha";


  const handleSubmit = async () => {
    if (partners.length === 0) return;
    
    // Validations
    if (partners.some(p => !p.name || !p.amount || !p.day)) {
      alert(`Preencha Nome, Valor e Dia para todos os ${isProlabore ? "sócios" : "funcionários"}.`);
      return;
    }

    try {
      setIsSubmitting(true);
      
      const splitRules = partners.map(p => ({
        name: p.name,
        amount: Number(p.amount),
        day: parseInt(p.day, 10),
        pix_key: p.pix_key
      }));

      const uniqueDays = [...new Set(splitRules.map(r => r.day))];

      const payload = {
        name: title,
        category: "folha",
        value_type: "fixed",
        amount: totalAmount,
        recurrence_type: "mensal",
        due_rule_type: "specific_day",
        due_day: uniqueDays.length > 0 ? uniqueDays[0] : 1,
        due_days: uniqueDays,
        due_day_offset: null,
        start_date: expenseToEdit?.start_date || new Date().toISOString().split("T")[0],
        supplier_id: null,
        notes: JSON.stringify({ split_rules: splitRules }),
        is_active: expenseToEdit ? expenseToEdit.is_active : true,
      };

      if (expenseToEdit) {
        await updateSmartContract.mutateAsync({ id: expenseToEdit.id, ...payload });
      } else {
        await createSmartContract.mutateAsync(payload);
      }

      setOpen(false);
    } catch (e) {
      console.error(e);
      alert("Erro ao salvar " + title + ".");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent side="right" align="start" className="bg-[#111111] border-white/10 text-white w-[560px] p-0 shadow-2xl overflow-hidden">
        {/* Header com Gradiente */}
        <div className="bg-gradient-to-r from-blue-500/20 via-transparent to-transparent p-6 border-b border-white/5">
          <h3 className="text-2xl font-light text-white flex items-center gap-2 mb-2">
            <Users className="h-5 w-5 text-blue-500" />
            {expenseToEdit ? "Editar " + title : "Configurar " + title}
          </h3>
          <p className="text-gray-400 text-sm">
            Adicione os {isProlabore ? "sócios" : "funcionários"} e defina o valor, o dia de pagamento e a chave PIX de cada um. O sistema irá somar o total automaticamente.
          </p>
        </div>

        {/* Corpo scrollável */}
        <div className="p-6 space-y-8 max-h-[60vh] overflow-y-auto">
          {partners.map((partner, index) => (
            <div key={partner.id} className="relative">
              {/* Sessão Title */}
              <div className="border-b border-white/10 pb-2 mb-4 flex justify-between items-center">
                <h4 className="text-sm font-medium uppercase tracking-widest flex items-center gap-2 text-blue-400">
                  <Users className="h-4 w-4" /> {entityName} {index + 1}
                </h4>
                <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-500 hover:text-red-500 hover:bg-red-500/10" onClick={() => handleRemovePartner(partner.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-5 space-y-2">
                    <Label className="text-xs text-gray-300">Nome</Label>
                    <Input 
                      value={partner.name} 
                      onChange={e => handleChange(partner.id, 'name', e.target.value)} 
                      placeholder="Ex: Anderson" 
                      className="bg-white/5 border-white/10 h-10 text-white font-light focus-visible:ring-1 focus-visible:ring-blue-500" 
                    />
                  </div>
                  <div className="col-span-4 space-y-2">
                    <Label className="text-xs text-gray-300">Valor (R$)</Label>
                    <Input 
                      type="number" 
                      value={partner.amount} 
                      onChange={e => handleChange(partner.id, 'amount', e.target.value)} 
                      placeholder="5000.00" 
                      className="bg-white/5 border-white/10 h-10 text-white font-light focus-visible:ring-1 focus-visible:ring-blue-500" 
                    />
                  </div>
                  <div className="col-span-3 space-y-2">
                    <Label className="text-xs text-gray-300">Dia</Label>
                    <Input 
                      type="number" 
                      min="1" 
                      max="31" 
                      value={partner.day} 
                      onChange={e => handleChange(partner.id, 'day', e.target.value)} 
                      placeholder="05" 
                      className="bg-white/5 border-white/10 h-10 text-white font-light focus-visible:ring-1 focus-visible:ring-blue-500" 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-gray-300">Chave PIX (Opcional)</Label>
                  <Input 
                    value={partner.pix_key} 
                    onChange={e => handleChange(partner.id, 'pix_key', e.target.value)} 
                    placeholder="E-mail, CPF, Telefone..." 
                    className="bg-white/5 border-white/10 h-10 text-white font-light focus-visible:ring-1 focus-visible:ring-blue-500" 
                  />
                </div>
              </div>
            </div>
          ))}

          <Button variant="outline" className="w-full border-dashed border-white/20 hover:border-white/40 hover:bg-white/5 text-gray-300 h-12 hover:text-blue-400" onClick={handleAddPartner}>
            <Plus className="mr-2 h-4 w-4" /> Adicionar {entityName}
          </Button>
        </div>

        {/* Rodapé / Total */}
        <div className="p-6 border-t border-white/10 bg-[#151515]">
          {partners.length > 0 && (
            <div className="bg-[#00FF00]/5 border border-[#00FF00]/20 rounded-xl p-4 flex justify-between items-center mb-6">
              <span className="text-[#00FF00] text-sm uppercase tracking-widest font-bold">{totalLabel}</span>
              <span className="text-[#00FF00] text-2xl font-light drop-shadow-[0_0_8px_rgba(0,255,0,0.3)]">{formatCurrencyBRL(totalAmount)}</span>
            </div>
          )}
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" className="border-white/10 text-gray-300 hover:bg-white/5" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button 
              className="text-white font-medium bg-blue-500 hover:bg-blue-600 shadow-[0_0_15px_rgba(59,130,246,0.3)]" 
              onClick={handleSubmit} 
              disabled={isSubmitting || partners.length === 0}
            >
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Salvar Estrutura
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
