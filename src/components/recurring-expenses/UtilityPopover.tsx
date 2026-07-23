import React, { useState, useEffect } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Loader2, Zap, Droplets, Wifi, Building, AlertTriangle } from "lucide-react";
import { useSmartContracts } from "@/hooks/useSmartContracts";
import { useSuppliers } from "@/hooks/useSuppliers";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type UtilityType = "aluguel" | "energia" | "agua" | "internet";

interface UtilityPopoverProps {
  expenseToEdit?: any;
  type: UtilityType;
  children: React.ReactNode;
}

const UTILITY_CONFIG = {
  aluguel: { title: "Aluguel Comercial", icon: Building, color: "text-cyan-500", defaultVariable: false },
  energia: { title: "Energia Elétrica", icon: Zap, color: "text-cyan-500", defaultVariable: true },
  agua: { title: "Água e Esgoto", icon: Droplets, color: "text-cyan-500", defaultVariable: true },
  internet: { title: "Internet / Telecom", icon: Wifi, color: "text-cyan-500", defaultVariable: false }
};

export function UtilityPopover({ expenseToEdit, type, children }: UtilityPopoverProps) {
  const [open, setOpen] = useState(false);
  const { createSmartContract, updateSmartContract } = useSmartContracts();
  const { data: suppliers } = useSuppliers();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const config = UTILITY_CONFIG[type];
  const Icon = config.icon;

  const [supplierId, setSupplierId] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDay, setDueDay] = useState("");
  const [pixKey, setPixKey] = useState("");
  const [barcode, setBarcode] = useState("");
  const [hasRenewalAlert, setHasRenewalAlert] = useState(false);
  const [renewalMonth, setRenewalMonth] = useState("");
  const [isVariable, setIsVariable] = useState(config.defaultVariable);

  useEffect(() => {
    if (open && expenseToEdit) {
      setSupplierId(expenseToEdit.supplier_id || "");
      setAmount(expenseToEdit.amount ? String(expenseToEdit.amount) : "");
      setDueDay(expenseToEdit.due_day ? String(expenseToEdit.due_day) : "");
      setIsVariable(expenseToEdit.value_type === "variable");
      
      if (expenseToEdit.notes) {
        try {
          const parsed = JSON.parse(expenseToEdit.notes);
          setPixKey(parsed.pix_key || "");
          setBarcode(parsed.barcode || "");
          setHasRenewalAlert(parsed.has_renewal_alert || false);
          setRenewalMonth(parsed.renewal_month || "");
        } catch (e) {}
      }
    } else if (open && !expenseToEdit) {
      setSupplierId("");
      setAmount("");
      setDueDay("");
      setPixKey("");
      setBarcode("");
      setHasRenewalAlert(false);
      setRenewalMonth("");
      setIsVariable(config.defaultVariable);
    }
  }, [open, expenseToEdit, config.defaultVariable]);

  const handleSubmit = async () => {
    if (!amount || !dueDay) {
      alert("Preencha o Valor e o Dia de Vencimento.");
      return;
    }

    try {
      setIsSubmitting(true);
      
      const payload = {
        name: config.title,
        category: "infraestrutura",
        value_type: isVariable ? "variable" : "fixed",
        amount: parseFloat(amount),
        recurrence_type: "mensal",
        due_rule_type: "specific_day",
        due_day: parseInt(dueDay, 10),
        due_days: null,
        due_day_offset: null,
        start_date: expenseToEdit?.start_date || new Date().toISOString().split("T")[0],
        supplier_id: supplierId || null,
        notes: JSON.stringify({
          pix_key: pixKey,
          barcode: barcode,
          has_renewal_alert: hasRenewalAlert,
          renewal_month: renewalMonth
        }),
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
      alert("Erro ao salvar configuração.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent side="right" align="start" className="bg-[#111111] border-white/10 text-white w-[500px] p-0 shadow-2xl overflow-hidden">
        {/* Header com Gradiente */}
        <div className="bg-gradient-to-r from-cyan-500/20 via-transparent to-transparent p-6 border-b border-white/5">
          <h3 className="text-2xl font-light text-white flex items-center gap-2 mb-2">
            <Icon className={`h-5 w-5 ${config.color}`} />
            {expenseToEdit ? "Editar " : "Configurar "} {config.title}
          </h3>
          <p className="text-gray-400 text-sm">
            {isVariable 
              ? "Defina o valor base para a provisão mensal."
              : "Defina os detalhes desse custo estrutural da empresa."}
          </p>
        </div>

        {/* Corpo sem scroll forçado e sem o quadrado de regras divisório */}
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center mb-1">
                <Label className="text-xs text-gray-300">{isVariable ? "Valor Médio (R$)" : "Valor (R$)"}</Label>
                <div className="flex items-center gap-1.5">
                  <Switch checked={isVariable} onCheckedChange={setIsVariable} className="scale-75 data-[state=checked]:bg-[#00FF00]" />
                  <span className="text-[9px] text-gray-500 uppercase tracking-widest font-bold">Variável</span>
                </div>
              </div>
              <Input 
                type="number" 
                value={amount} 
                onChange={e => setAmount(e.target.value)} 
                placeholder="0.00" 
                className={`bg-white/5 border-white/10 h-10 text-white font-light focus-visible:ring-1 focus-visible:ring-current ${config.color.replace('text-', 'focus-visible:ring-')}`} 
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-gray-300 block mb-1">Dia Vencimento</Label>
              <Input 
                type="number" 
                min="1" 
                max="31" 
                value={dueDay} 
                onChange={e => setDueDay(e.target.value)} 
                placeholder="Ex: 10" 
                className={`bg-white/5 border-white/10 h-10 text-white font-light focus-visible:ring-1 focus-visible:ring-current ${config.color.replace('text-', 'focus-visible:ring-')}`} 
              />
            </div>
          </div>

          {type === "aluguel" && (
            <div className="bg-white/5 border border-white/10 p-4 rounded-xl space-y-4 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500"></div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-cyan-400" />
                  <Label className="text-sm font-medium text-white cursor-pointer" onClick={() => setHasRenewalAlert(!hasRenewalAlert)}>Alerta de Reajuste (IGPM/IPCA)</Label>
                </div>
                <Switch checked={hasRenewalAlert} onCheckedChange={setHasRenewalAlert} className="data-[state=checked]:bg-cyan-500" />
              </div>
              {hasRenewalAlert && (
                <div className="space-y-2 pt-2 border-t border-white/10">
                  <Label className="text-xs text-gray-400 uppercase tracking-widest font-bold">Mês do Aniversário</Label>
                  <Select value={renewalMonth} onValueChange={setRenewalMonth}>
                    <SelectTrigger className="bg-[#111111] border-white/10 text-white h-10 font-light focus:ring-1 focus:ring-cyan-500">
                      <SelectValue placeholder="Mês do reajuste" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1a1a1a] border-white/10 text-white">
                      {["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"].map((m) => (
                        <SelectItem key={m} value={m.toLowerCase()}>{m}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          )}

          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label className="text-xs text-gray-300">Chave PIX (Opcional)</Label>
              <Input 
                value={pixKey} 
                onChange={e => setPixKey(e.target.value)} 
                placeholder="E-mail, CPF, Telefone..." 
                className={`bg-white/5 border-white/10 h-10 text-white font-light focus-visible:ring-1 focus-visible:ring-current ${config.color.replace('text-', 'focus-visible:ring-')}`} 
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-gray-300">Código de Barras (Opcional)</Label>
              <Input 
                value={barcode} 
                onChange={e => setBarcode(e.target.value)} 
                placeholder="Numeração do boleto..." 
                className={`bg-white/5 border-white/10 h-10 text-white font-light focus-visible:ring-1 focus-visible:ring-current ${config.color.replace('text-', 'focus-visible:ring-')}`} 
              />
            </div>
          </div>
        </div>

        {/* Rodapé */}
        <div className="p-6 border-t border-white/10 bg-[#151515] flex justify-end gap-3">
          <Button variant="outline" className="border-white/10 text-gray-300 hover:bg-white/5" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button 
            className="text-black font-bold bg-cyan-500 hover:bg-cyan-600 shadow-[0_0_15px_rgba(6,182,212,0.3)]" 
            onClick={handleSubmit} 
            disabled={isSubmitting}
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Salvar Estrutura
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
