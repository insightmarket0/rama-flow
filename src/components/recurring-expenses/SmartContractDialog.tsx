import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSmartContracts } from "@/hooks/useSmartContracts";
import { ArrowLeft, Building2, Cpu, FileText, Loader2, Plus, Users } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

const TEMPLATE_CATEGORIES = [
  {
    id: "folha",
    title: "Equipe & Talentos",
    icon: <Users className="h-5 w-5 text-blue-400" />,
    color: "bg-blue-500/10 border-blue-500/20",
    templates: [
      { name: "Pró-labore", category: "folha", value_type: "fixed" },
      { name: "Folha de Pagamento", category: "folha", value_type: "fixed" },
      { name: "Vale Transporte / Refeição", category: "folha", value_type: "fixed" },
    ]
  },
  {
    id: "infraestrutura",
    title: "Infraestrutura",
    icon: <Building2 className="h-5 w-5 text-cyan-400" />,
    color: "bg-cyan-500/10 border-cyan-500/20",
    templates: [
      { name: "Aluguel Comercial", category: "infraestrutura", value_type: "fixed" },
      { name: "Energia Elétrica", category: "infraestrutura", value_type: "variable" },
      { name: "Água / Saneamento", category: "infraestrutura", value_type: "variable" },
      { name: "Internet / Telefonia", category: "infraestrutura", value_type: "fixed" },
    ]
  },
  {
    id: "impostos",
    title: "Impostos",
    icon: <FileText className="h-5 w-5 text-red-400" />,
    color: "bg-red-500/10 border-red-500/20",
    templates: [
      { name: "Simples Nacional (DAS)", category: "impostos", value_type: "variable" },
      { name: "INSS", category: "impostos", value_type: "variable" },
      { name: "FGTS", category: "impostos", value_type: "variable" },
    ]
  },
  {
    id: "software",
    title: "Software & TI",
    icon: <Cpu className="h-5 w-5 text-emerald-400" />,
    color: "bg-emerald-500/10 border-emerald-500/20",
    templates: [
      { name: "Google Gemini", category: "software", value_type: "fixed" },
      { name: "Servidor / Hospedagem", category: "software", value_type: "fixed" },
      { name: "Mercado Turbo", category: "software", value_type: "fixed" },
      { name: "Up Seller", category: "software", value_type: "fixed" },
    ]
  },
  {
    id: "servicos",
    title: "Serviços Contratados",
    icon: <Users className="h-5 w-5 text-stone-400" />,
    color: "bg-stone-400/10 border-stone-400/20",
    templates: [
      { name: "Plano de Saúde", category: "servicos", value_type: "fixed" },
      { name: "Heloíde Advogada", category: "servicos", value_type: "fixed" },
      { name: "Contabilidade Ideal", category: "servicos", value_type: "fixed" },
      { name: "Logística Flex (Motoboy)", category: "servicos", value_type: "variable" },
    ]
  }
];

const formSchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  category: z.string().min(1, "Selecione uma categoria"),
  value_type: z.enum(["fixed", "variable"]),
  amount: z.string().optional(),
  due_day: z.string().min(1, "Informe o dia do vencimento"),
  pix_key: z.string().optional(),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface SmartContractDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  expenseToEdit?: any;
  preset?: {name: string, category: string} | null;
}

export function SmartContractDialog({ open, onOpenChange, expenseToEdit, preset }: SmartContractDialogProps) {
  const { createRecurringExpense, updateRecurringExpense } = useSmartContracts();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState<"catalog" | "form">("catalog");
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      category: "",
      value_type: "fixed",
      amount: "",
      due_day: "",
      pix_key: "",
      notes: "",
    },
  });

  useEffect(() => {
    if (open) {
      if (expenseToEdit) {
        setStep("form");
        let parsedNotes: any = {};
        if (expenseToEdit.notes) {
          try { parsedNotes = JSON.parse(expenseToEdit.notes); } catch (e) {}
        }
        form.reset({
          name: expenseToEdit.name,
          category: expenseToEdit.category,
          value_type: expenseToEdit.value_type,
          amount: expenseToEdit.amount ? String(expenseToEdit.amount) : "",
          due_day: expenseToEdit.due_day ? String(expenseToEdit.due_day) : "",
          pix_key: parsedNotes.pix_key || "",
          notes: parsedNotes.text || "",
        });
      } else if (preset) {
        setStep("form");
        form.reset({
          name: preset.name,
          category: preset.category,
          value_type: "fixed",
          amount: "",
          due_day: "",
          pix_key: "",
          notes: "",
        });
      } else {
        setStep("catalog");
        form.reset({
          name: "", category: "", value_type: "fixed", amount: "", due_day: "", pix_key: "", notes: ""
        });
      }
    }
  }, [open, expenseToEdit, preset, form]);

  const handleSelectTemplate = (template: any) => {
    setSelectedTemplate(template);
    form.reset({
      name: template.name,
      category: template.category,
      value_type: template.value_type,
      amount: "",
      due_day: "",
      pix_key: "",
      notes: "",
    });
    setStep("form");
  };

  const handleCustomExpense = () => {
    setSelectedTemplate(null);
    form.reset({
      name: "", category: "outros", value_type: "fixed", amount: "", due_day: "", pix_key: "", notes: ""
    });
    setStep("form");
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const parsedAmount = data.amount && data.amount.trim().length > 0 ? parseFloat(data.amount) : null;
      const parsedDueDay = data.due_day ? parseInt(data.due_day, 10) : null;
      
      const notesPayload = JSON.stringify({
        text: data.notes || "",
        pix_key: data.pix_key || "",
      });

      const payload = {
        name: data.name,
        category: data.category,
        amount: parsedAmount,
        value_type: data.value_type,
        recurrence_type: "mensal", // Default fixo para simplificar
        due_rule_type: "specific_day",
        due_day: parsedDueDay,
        start_date: new Date().toISOString().split("T")[0],
        notes: notesPayload,
        is_active: expenseToEdit ? expenseToEdit.is_active : true,
      };

      if (expenseToEdit) {
        await updateRecurringExpense.mutateAsync({ id: expenseToEdit.id, ...payload });
      } else {
        await createRecurringExpense.mutateAsync(payload);
      }
      form.reset();
      onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden bg-[#0a0a0a] border-white/10 text-white shadow-2xl p-0 flex flex-col">
        
        {step === "catalog" && (
          <div className="flex flex-col h-full overflow-hidden">
            <DialogHeader className="p-6 pb-4 border-b border-white/5 shrink-0 bg-black/40">
              <DialogTitle className="text-2xl font-light text-white">Catálogo de Contas Fixas</DialogTitle>
              <DialogDescription className="text-gray-400">Escolha o que você deseja adicionar à sua estrutura de custos recorrentes.</DialogDescription>
            </DialogHeader>

            <ScrollArea className="flex-1 p-6">
              <div className="grid md:grid-cols-2 gap-6 pb-6">
                {TEMPLATE_CATEGORIES.map(sector => (
                  <div key={sector.id} className="space-y-3">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500 flex items-center gap-2">
                      {sector.icon} {sector.title}
                    </h3>
                    <div className="space-y-2">
                      {sector.templates.map(tpl => (
                        <button
                          key={tpl.name}
                          type="button"
                          onClick={() => handleSelectTemplate(tpl)}
                          className="w-full text-left p-3 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all flex items-center justify-between group"
                        >
                          <span className="text-sm font-medium text-gray-300 group-hover:text-white">{tpl.name}</span>
                          <Plus className="h-4 w-4 text-gray-500 group-hover:text-[#00FF00] transition-colors" />
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-6 border-t border-white/5">
                <button
                  type="button"
                  onClick={handleCustomExpense}
                  className="w-full text-center p-4 rounded-xl border border-dashed border-white/20 hover:border-[#00FF00]/50 hover:bg-[#00FF00]/5 transition-all group"
                >
                  <span className="text-sm font-medium text-gray-400 group-hover:text-[#00FF00]">Não encontrou o que queria? Criar Conta Personalizada</span>
                </button>
              </div>
            </ScrollArea>
          </div>
        )}

        {step === "form" && (
          <div className="flex flex-col h-full overflow-hidden">
            <DialogHeader className="p-6 pb-4 border-b border-white/5 shrink-0 bg-black/40 relative">
              {!expenseToEdit && !preset && (
                <button 
                  onClick={() => setStep("catalog")}
                  className="absolute left-6 top-6 h-8 w-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4 text-gray-300" />
                </button>
              )}
              <div className={!expenseToEdit && !preset ? "ml-12" : ""}>
                <DialogTitle className="text-xl font-light text-white">
                  {expenseToEdit ? "Editar Conta" : `Configurar: ${form.watch("name") || "Nova Conta"}`}
                </DialogTitle>
                <DialogDescription className="text-gray-400">Preencha apenas os dados essenciais.</DialogDescription>
              </div>
            </DialogHeader>

            <ScrollArea className="flex-1 p-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  
                  <div className="grid gap-6 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300">Nome da Despesa</FormLabel>
                          <FormControl>
                            <Input className="bg-white/5 border-white/10 text-white focus-visible:ring-[#00FF00]/50" {...field} />
                          </FormControl>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300">Categoria (Setor)</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-white/5 border-white/10 text-white focus-visible:ring-[#00FF00]/50">
                                <SelectValue placeholder="Selecione" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-[#111] border-white/10 text-white">
                              <SelectItem value="folha">Folha / RH</SelectItem>
                              <SelectItem value="infraestrutura">Infraestrutura</SelectItem>
                              <SelectItem value="impostos">Impostos</SelectItem>
                              <SelectItem value="software">Software & TI</SelectItem>
                              <SelectItem value="marketing">Marketing</SelectItem>
                              <SelectItem value="outros">Outros</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[#00FF00]">Valor Mensal (R$)</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" placeholder="Ex: 1500.00" className="bg-[#00FF00]/5 border-[#00FF00]/20 text-[#00FF00] focus-visible:ring-[#00FF00]/50 placeholder:text-[#00FF00]/30" {...field} />
                          </FormControl>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="due_day"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[#00FF00]">Dia do Vencimento</FormLabel>
                          <FormControl>
                            <Input type="number" min="1" max="31" placeholder="Ex: 5" className="bg-[#00FF00]/5 border-[#00FF00]/20 text-[#00FF00] focus-visible:ring-[#00FF00]/50 placeholder:text-[#00FF00]/30" {...field} />
                          </FormControl>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="space-y-4 pt-4 border-t border-white/5">
                    <h3 className="text-sm font-medium text-gray-400">Dados Opcionais (Pagamento)</h3>
                    
                    <FormField
                      control={form.control}
                      name="pix_key"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300">Chave Pix</FormLabel>
                          <FormControl>
                            <Input placeholder="CNPJ, E-mail, Celular..." className="bg-white/5 border-white/10 text-white focus-visible:ring-[#00FF00]/50" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300">Observações</FormLabel>
                          <FormControl>
                            <Input placeholder="Link de cobrança, portal do cliente..." className="bg-white/5 border-white/10 text-white focus-visible:ring-[#00FF00]/50" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="pt-4 flex items-center justify-end gap-3 sticky bottom-0 bg-[#0a0a0a] pb-2 border-t border-white/5 mt-auto">
                    <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="text-gray-400 hover:text-white hover:bg-white/5">
                      Cancelar
                    </Button>
                    <Button type="submit" disabled={isSubmitting} className="bg-[#00FF00] text-black hover:bg-[#00CC00] font-medium min-w-[120px]">
                      {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : (expenseToEdit ? "Salvar Alterações" : "Salvar Conta")}
                    </Button>
                  </div>

                </form>
              </Form>
            </ScrollArea>
          </div>
        )}

      </DialogContent>
    </Dialog>
  );
}