import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useSmartContracts } from "@/hooks/useSmartContracts";
import { useSmartContractInstallments } from "@/hooks/useSmartContractInstallments";
import { formatCurrencyBRL } from "@/lib/format";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2, AlertTriangle, Building2, Calendar, Target } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";

const formSchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  company_name: z.string().min(3, "Informe a empresa ou CNPJ"),
  amount: z.string().min(1, "Informe o valor"),
  is_estimated: z.boolean().default(true),
  recurrence_type: z.enum(["mensal", "anual", "esporadico"]),
  due_day: z.string().min(1, "Informe o dia"),
  start_date: z.string().min(1, "Informe a data de início"),
});

type FormData = z.infer<typeof formSchema>;

interface TaxDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  taxToEdit?: any;
  presetName?: string;
  presetRecurrence?: "mensal" | "anual" | "esporadico";
}

export function TaxDialog({ open, onOpenChange, taxToEdit, presetName, presetRecurrence }: TaxDialogProps) {
  const { createSmartContract, updateSmartContract } = useSmartContracts();
  const { createInstallment } = useSmartContractInstallments();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      company_name: "",
      amount: "",
      is_estimated: true,
      recurrence_type: "mensal",
      due_day: "20",
      start_date: new Date().toISOString().split("T")[0],
    },
  });

  useEffect(() => {
    if (open) {
      if (taxToEdit) {
        let parsedNotes: any = {};
        if (taxToEdit.notes) {
          try { parsedNotes = JSON.parse(taxToEdit.notes); } catch (e) {}
        }
        
        form.reset({
          name: taxToEdit.name,
          company_name: parsedNotes.company_name || "",
          amount: taxToEdit.amount ? String(taxToEdit.amount) : "",
          is_estimated: taxToEdit.value_type === "variable",
          recurrence_type: taxToEdit.recurrence_type === "anual" ? "anual" : taxToEdit.recurrence_type === "esporadico" ? "esporadico" : "mensal",
          due_day: taxToEdit.due_day ? String(taxToEdit.due_day) : "20",
          start_date: taxToEdit.start_date,
        });
      } else {
        form.reset({
          name: presetName || "",
          company_name: "",
          amount: "",
          is_estimated: true,
          recurrence_type: presetRecurrence || "mensal",
          due_day: "20",
          start_date: new Date().toISOString().split("T")[0],
        });
      }
    }
  }, [open, taxToEdit, presetName, presetRecurrence, form]);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const parsedAmount = data.amount && data.amount.trim().length > 0 ? parseFloat(data.amount) : 0;

      const notesPayload = JSON.stringify({
        company_name: data.company_name || "",
      });

      const payload = {
        name: data.name,
        category: "impostos",
        value_type: data.is_estimated ? "variable" : "fixed",
        amount: parsedAmount,
        recurrence_type: data.recurrence_type,
        due_rule_type: "specific_day",
        due_day: parseInt(data.due_day, 10),
        start_date: data.start_date,
        notes: notesPayload,
        is_active: taxToEdit ? taxToEdit.is_active : true,
      };

      if (taxToEdit) {
        await updateSmartContract.mutateAsync({ id: taxToEdit.id, ...payload });
        
        if (payload.recurrence_type === "esporadico") {
          try {
            const { data: pendingGuia } = await supabase
              .from("smart_contract_installments")
              .select("id")
              .eq("smart_contract_id", taxToEdit.id)
              .neq("status", "pago")
              .limit(1)
              .single();

            if (pendingGuia) {
              await supabase
                .from("smart_contract_installments")
                .update({
                  due_date: payload.start_date,
                  value: parsedAmount
                })
                .eq("id", pendingGuia.id);
                
              queryClient.invalidateQueries({ queryKey: ["smart-contract-installments"] });
            }
          } catch (e) {
            console.error("Erro ao atualizar a guia pendente esporádica:", e);
          }
        }
      } else {
        const createdContract = await createSmartContract.mutateAsync(payload);
        
        // Se for esporádico e tiver valor e data preenchidos, lança a primeira guia na hora.
        if (payload.recurrence_type === "esporadico" && parsedAmount > 0 && payload.start_date) {
          try {
             await createInstallment.mutateAsync({
               smart_contract_id: createdContract.id,
               value: parsedAmount,
               due_date: payload.start_date
             });
          } catch (e) {
            console.error("Erro ao criar a 1ª guia esporádica", e);
          }
        }
      }
      
      onOpenChange(false);
      form.reset();
    } catch (error) {
      console.error("Erro ao salvar imposto:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(val) => { if (!isSubmitting) onOpenChange(val); }}>
      <DialogContent className="sm:max-w-[600px] bg-[#111111] border-white/10 text-white p-0 overflow-hidden">
        <div className="bg-gradient-to-r from-orange-500/20 via-transparent to-transparent p-6 border-b border-white/5">
          <DialogHeader>
            <DialogTitle className="text-2xl font-light text-white flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              {taxToEdit ? "Editar Obrigação Tributária" : "Configurar Obrigação Tributária"}
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Cadastre impostos e guias para que a central de pagamentos possa prever e gerenciar o envio pela contabilidade.
            </DialogDescription>
          </DialogHeader>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 space-y-6">
            <div className="grid md:grid-cols-2 gap-8">
              
              {/* Coluna Esquerda: Identificação */}
              <div className="space-y-4">
                <div className="border-b border-white/10 pb-2 mb-4">
                  <h3 className="text-sm font-medium text-orange-400 uppercase tracking-widest flex items-center gap-2">
                    <Target className="h-4 w-4" /> Identificação
                  </h3>
                </div>

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">Nome do Imposto</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Ex: DAS - Simples Nacional" 
                          {...field} 
                          className="bg-white/5 border-white/10 focus-visible:ring-orange-500 text-white" 
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="company_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300 flex items-center gap-2">
                        <Building2 className="h-3 w-3" /> Empresa / CNPJ
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Ex: RAMA Matriz" 
                          {...field} 
                          className="bg-white/5 border-white/10 focus-visible:ring-orange-500 text-white" 
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
              </div>

              {/* Coluna Direita: Regras e Provisão */}
              <div className="space-y-4">
                <div className="border-b border-white/10 pb-2 mb-4">
                  <h3 className="text-sm font-medium text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                    <Calendar className="h-4 w-4" /> Regras e Provisão
                  </h3>
                </div>

                <div className="flex gap-4 items-start">
                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel className="text-gray-300">
                          {form.watch("recurrence_type") === "esporadico" ? "Valor da Guia (R$)" : "Valor Base (R$)"}
                        </FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.01" 
                            placeholder="0.00" 
                            {...field} 
                            className="bg-white/5 border-white/10 focus-visible:ring-emerald-500 text-white" 
                          />
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />
                  
                  {form.watch("recurrence_type") !== "esporadico" && (
                    <FormField
                      control={form.control}
                      name="is_estimated"
                      render={({ field }) => (
                        <FormItem className="flex flex-col pt-8">
                          <div className="flex items-center gap-2">
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                className="data-[state=checked]:bg-emerald-500"
                              />
                            </FormControl>
                            <FormLabel className="text-gray-400 text-xs font-normal m-0 pb-0">É estimativa?</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="recurrence_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Frequência</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-white/5 border-white/10 text-white focus:ring-emerald-500">
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-[#1a1a1a] border-white/10 text-white">
                            <SelectItem value="mensal">Mensal</SelectItem>
                            <SelectItem value="anual">Anual</SelectItem>
                            <SelectItem value="esporadico">Esporádico</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />

                  {form.watch("recurrence_type") !== "esporadico" && (
                    <FormField
                      control={form.control}
                      name="due_day"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300">Dia de Vencimento</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min="1" 
                              max="31" 
                              placeholder="Ex: 20" 
                              {...field} 
                              className="bg-white/5 border-white/10 focus-visible:ring-emerald-500 text-white" 
                            />
                          </FormControl>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
                
                <FormField
                  control={form.control}
                  name="start_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">
                        {form.watch("recurrence_type") === "esporadico" ? "Data de Vencimento" : "Inicia em (Referência)"}
                      </FormLabel>
                      <FormControl>
                        <Input 
                          type="date" 
                          {...field} 
                          className="bg-white/5 border-white/10 focus-visible:ring-emerald-500 text-white [color-scheme:dark] w-full" 
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="pt-6 border-t border-white/10 flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="border-white/10 text-gray-300 hover:bg-white/5">
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting} className="bg-orange-500 hover:bg-orange-600 text-white font-medium shadow-[0_0_15px_rgba(249,115,22,0.3)]">
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {taxToEdit ? "Salvar Alterações" : "Cadastrar Imposto"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
