import React, { useState, useEffect } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Loader2, Bot, Scale, Rocket, TrendingUp, Truck, Heart, Calculator } from "lucide-react";
import { useSmartContracts } from "@/hooks/useSmartContracts";

type SubscriptionType = "gemini" | "advogado" | "mercadoturbo" | "upseller" | "flex" | "saude" | "contabilidade";

interface SubscriptionPopoverProps {
  expenseToEdit?: any;
  type: SubscriptionType;
  children: React.ReactNode;
}

const SUBSCRIPTION_CONFIG = {
  gemini: { title: "Google Gemini", category: "software", icon: Bot, color: "text-emerald-500", defaultVariable: false, defaultRecurrence: "mensal" },
  advogado: { title: "Heloíde Advogada", category: "servicos", icon: Scale, color: "text-stone-400", defaultVariable: false, defaultRecurrence: "mensal" },
  saude: { title: "Plano de Saúde", category: "servicos", icon: Heart, color: "text-stone-400", defaultVariable: false, defaultRecurrence: "mensal" },
  contabilidade: { title: "Contabilidade Ideal", category: "servicos", icon: Calculator, color: "text-stone-400", defaultVariable: false, defaultRecurrence: "mensal" },
  mercadoturbo: { title: "Mercado Turbo", category: "software", icon: Rocket, color: "text-emerald-500", defaultVariable: false, defaultRecurrence: "mensal" },
  upseller: { title: "Up Seller", category: "software", icon: TrendingUp, color: "text-emerald-500", defaultVariable: false, defaultRecurrence: "semestral" },
  flex: { title: "Logística Flex (Motoboy)", category: "servicos", icon: Truck, color: "text-stone-400", defaultVariable: true, defaultRecurrence: "quinzenal" }
};

export function SubscriptionPopover({ expenseToEdit, type, children }: SubscriptionPopoverProps) {
  const [open, setOpen] = useState(false);
  const { createSmartContract, updateSmartContract } = useSmartContracts();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const config = SUBSCRIPTION_CONFIG[type] || { title: "Assinatura", category: "software", icon: Bot, color: "text-gray-400", defaultVariable: false };
  const Icon = config.icon;

  const [amount, setAmount] = useState("");
  const [dueDay, setDueDay] = useState("");
  const [accessInfo, setAccessInfo] = useState("");
  const [isVariable, setIsVariable] = useState(config.defaultVariable);
  const [startDate, setStartDate] = useState("");

  const isLongTerm = config.defaultRecurrence === "semestral" || config.defaultRecurrence === "anual";

  useEffect(() => {
    if (open && expenseToEdit) {
      setAmount(expenseToEdit.amount ? String(expenseToEdit.amount) : "");
      
      const hasMultipleDays = Array.isArray(expenseToEdit.due_days) && expenseToEdit.due_days.length > 0;
      setDueDay(hasMultipleDays ? expenseToEdit.due_days.join(', ') : (expenseToEdit.due_day ? String(expenseToEdit.due_day) : ""));
      setStartDate(expenseToEdit.start_date || "");
      
      setIsVariable(expenseToEdit.value_type === "variable");
      
      if (expenseToEdit.notes) {
        try {
          const parsed = JSON.parse(expenseToEdit.notes);
          setAccessInfo(parsed.access_info || parsed.pix_key || "");
        } catch (e) {}
      }
    } else if (open && !expenseToEdit) {
      setAmount("");
      setDueDay("");
      setAccessInfo("");
      setStartDate("");
      setIsVariable(config.defaultVariable);
    }
  }, [open, expenseToEdit, config.defaultVariable]);

  const handleSubmit = async () => {
    if (!amount && !isVariable) {
      alert("Preencha o Valor Fixo.");
      return;
    }
    if (!isLongTerm && !dueDay) {
      alert("Preencha o(s) Dia(s) de Vencimento.");
      return;
    }
    if (isLongTerm && !startDate) {
      alert("Preencha a Data da Próxima Cobrança.");
      return;
    }

    try {
      setIsSubmitting(true);
      
      const isMultiple = !isLongTerm && dueDay.includes(',');
      const parsedDays = isMultiple ? dueDay.split(',').map(d => parseInt(d.trim(), 10)).filter(d => !isNaN(d)) : null;
      
      let singleDay = null;
      let finalStartDate = expenseToEdit?.start_date || new Date().toISOString().split("T")[0];

      if (isLongTerm) {
        // Se for longo prazo, usa a data exata selecionada
        finalStartDate = startDate;
        const d = new Date(startDate + "T12:00:00");
        singleDay = d.getDate();
      } else {
        singleDay = !isMultiple ? parseInt(dueDay, 10) : (parsedDays && parsedDays.length > 0 ? parsedDays[0] : parseInt(dueDay, 10));
      }

      const payload = {
        name: config.title,
        category: config.category,
        value_type: isVariable ? "variable" : "fixed",
        amount: amount ? parseFloat(amount) : 0,
        recurrence_type: isMultiple ? "quinzenal" : (config.defaultRecurrence || "mensal"),
        due_rule_type: "specific_day",
        due_day: singleDay,
        due_days: parsedDays,
        due_day_offset: null,
        start_date: finalStartDate,
        supplier_id: null,
        notes: JSON.stringify({
          access_info: accessInfo
        }),
        is_active: true
      };

      if (expenseToEdit) {
        await updateSmartContract.mutateAsync({ id: expenseToEdit.id, ...payload });
      } else {
        await createSmartContract.mutateAsync(payload);
      }
      
      setOpen(false);
    } catch (error) {
      console.error(error);
      alert("Erro ao salvar contrato.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent className="w-[500px] p-0 bg-[#111111] border-white/10 shadow-2xl overflow-hidden" side="right" align="start">
        {/* Header com Gradiente */}
        <div className={`bg-gradient-to-r ${
          config.category === 'software' ? 'from-emerald-500/20' : 'from-stone-400/20'
        } via-transparent to-transparent p-6 border-b border-white/5`}>
          <h3 className="text-2xl font-light text-white flex items-center gap-2 mb-2">
            <Icon className={`h-5 w-5 ${config.color}`} />
            {expenseToEdit ? `Editar ${config.title}` : `Configurar ${config.title}`}
          </h3>
          <p className="text-gray-400 text-sm">
            {isLongTerm 
              ? `Defina o valor e a data exata da próxima cobrança (${config.defaultRecurrence}).`
              : "Defina o valor e dias de vencimento deste contrato."}
          </p>
        </div>

        {/* Corpo sem scroll forçado e sem divisão de regras */}
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between bg-white/5 p-4 rounded-xl border border-white/10">
            <div className="space-y-0.5">
              <Label className="text-sm text-white">Valor Variável?</Label>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Muda a cada cobrança</p>
            </div>
            <Switch checked={isVariable} onCheckedChange={setIsVariable} className={`data-[state=checked]:${config.category === 'software' ? 'bg-emerald-500' : 'bg-stone-500'}`} />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className={isLongTerm ? "space-y-2 col-span-2" : "space-y-2"}>
              <Label className="text-xs text-gray-300 block mb-1">{isVariable ? "Valor Médio (R$)" : "Valor Fixo (R$)"}</Label>
              <Input 
                type="number" 
                value={amount} 
                onChange={e => setAmount(e.target.value)}
                placeholder="Ex: 199.90"
                className={`bg-white/5 border-white/10 text-white h-10 font-light focus-visible:ring-1 focus-visible:ring-current ${config.color.replace('text-', 'focus-visible:ring-')}`}
              />
            </div>
            
            {isLongTerm ? (
              <div className="space-y-2 col-span-2">
                <Label className="text-xs text-gray-300 block mb-1">Data da Próxima Cobrança (Renovação)</Label>
                <Input 
                  type="date" 
                  value={startDate} 
                  onChange={e => setStartDate(e.target.value)}
                  className={`bg-white/5 border-white/10 text-white h-10 font-light focus-visible:ring-1 focus-visible:ring-current ${config.color.replace('text-', 'focus-visible:ring-')}`}
                  style={{ colorScheme: 'dark' }}
                />
              </div>
            ) : (
              <div className="space-y-2">
                <Label className="text-xs text-gray-300 block mb-1">Dia(s) (ex: 15, 30)</Label>
                <Input 
                  type="text" 
                  value={dueDay} 
                  onChange={e => setDueDay(e.target.value)}
                  placeholder="Ex: 15, 30"
                  className={`bg-white/5 border-white/10 text-white h-10 font-light focus-visible:ring-1 focus-visible:ring-current ${config.color.replace('text-', 'focus-visible:ring-')}`}
                />
              </div>
            )}
          </div>

          <div className="space-y-2 pt-2">
            <Label className="text-xs text-gray-300 block mb-1">URL / Chave PIX (Opcional)</Label>
            <Input 
              value={accessInfo} 
              onChange={e => setAccessInfo(e.target.value)}
              placeholder="Link de acesso ou PIX..."
              className={`bg-white/5 border-white/10 text-white h-10 font-light focus-visible:ring-1 focus-visible:ring-current ${config.color.replace('text-', 'focus-visible:ring-')}`}
            />
          </div>
        </div>

        {/* Rodapé */}
        <div className="p-6 border-t border-white/10 bg-[#151515] flex justify-end gap-3">
          <Button variant="outline" className="border-white/10 text-gray-300 hover:bg-white/5" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button 
            className={`text-black font-bold ${
              config.category === 'software' ? 'bg-emerald-500 hover:bg-emerald-600 shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 
              'bg-stone-400 hover:bg-stone-500 shadow-[0_0_15px_rgba(168,162,158,0.3)]'
            }`} 
            onClick={handleSubmit} 
            disabled={isSubmitting}
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Salvar Contrato
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
