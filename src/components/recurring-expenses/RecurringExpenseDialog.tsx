import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useRecurringExpenses } from "@/hooks/useRecurringExpenses";
import { useSuppliers } from "@/hooks/useSuppliers";
import { EXPENSE_CATEGORIES, RECURRENCE_TYPES } from "@/lib/recurring-expense-categories";
import { RECURRING_EXPENSE_TEMPLATES } from "@/lib/recurring-expense-templates";
import { formatCurrencyBRL } from "@/lib/format";
import { Loader2, Check, ChevronRight, Sparkles } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { format, setDate } from "date-fns";
import { ptBR } from "date-fns/locale";
import { FEATURE_TAX_DESCRIPTION } from "@/lib/features";

const formSchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  category: z.string().min(1, "Selecione uma categoria"),
  tax_description: z.string().optional(),
  supplier_id: z.string().optional(),
  amount: z
    .string()
    .min(1, "Informe o valor")
    .refine((value) => Number(value) > 0, "Valor deve ser maior que zero"),
  recurrence_type: z.enum(["mensal", "bimestral", "trimestral", "semestral", "anual"], {
    errorMap: () => ({ message: "Selecione a recorrência" }),
  }),
  due_day: z
    .string()
    .min(1, "Informe o dia de vencimento")
    .refine((value) => {
      const day = Number(value);
      return Number.isInteger(day) && day >= 1 && day <= 31;
    }, "Dia deve estar entre 1 e 31"),
  start_date: z.string().min(1, "Informe a data de início"),
  end_date: z.string().optional(),
  notes: z.string().optional(),
}).superRefine((data, ctx) => {
  if (FEATURE_TAX_DESCRIPTION && data.category === "impostos") {
    if (!data.tax_description || data.tax_description.trim().length < 2) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["tax_description"],
        message: "Informe qual imposto está sendo pago",
      });
    }
  }
  if (data.end_date && new Date(data.end_date) < new Date(data.start_date)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["end_date"],
      message: "Data de fim não pode ser anterior à data de início",
    });
  }
});

type FormData = z.infer<typeof formSchema>;

type WizardStep = {
  id: string;
  title: string;
  description: string;
  fields: (keyof FormData)[];
};

const RECURRENCE_MONTHS: Record<FormData["recurrence_type"], number> = {
  mensal: 1,
  bimestral: 2,
  trimestral: 3,
  semestral: 6,
  anual: 12,
};

interface RecurringExpenseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RecurringExpenseDialog({ open, onOpenChange }: RecurringExpenseDialogProps) {
  const { createRecurringExpense } = useRecurringExpenses();
  const { suppliers } = useSuppliers();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      category: "",
      tax_description: "",
      supplier_id: "",
      amount: "",
      recurrence_type: "mensal",
      due_day: "10",
      start_date: new Date().toISOString().split("T")[0],
      end_date: "",
      notes: "",
    },
  });

  const steps: WizardStep[] = [
    {
      id: "basic",
      title: "Informações Básicas",
      description: "Defina nome, categoria e fornecedor.",
      fields: FEATURE_TAX_DESCRIPTION
        ? ["name", "category", "tax_description", "supplier_id"]
        : ["name", "category", "supplier_id"],
    },
    {
      id: "recurrence",
      title: "Valor e Recorrência",
      description: "Configure o valor, a frequência e o vencimento.",
      fields: ["amount", "recurrence_type", "due_day"],
    },
    {
      id: "period",
      title: "Período",
      description: "Informe início, fim (opcional) e observações.",
      fields: ["start_date", "end_date", "notes"],
    },
    {
      id: "preview",
      title: "Prévia",
      description: "Revise os detalhes antes de confirmar.",
      fields: [],
    },
  ];

  const values = form.watch();
  const selectedCategory = values.category;

  useEffect(() => {
    if (FEATURE_TAX_DESCRIPTION && selectedCategory !== "impostos" && form.getValues("tax_description")) {
      form.setValue("tax_description", "", { shouldValidate: false });
    }
  }, [form, selectedCategory]);

  const upcomingDueDates = useMemo(() => {
    const results: Date[] = [];
    if (!values.start_date || !values.recurrence_type || !values.due_day) {
      return results;
    }

    const startDate = new Date(values.start_date);
    if (Number.isNaN(startDate.getTime())) {
      return results;
    }

    const monthsToAdd = RECURRENCE_MONTHS[values.recurrence_type];
    if (!Number.isFinite(monthsToAdd) || monthsToAdd <= 0) {
      return results;
    }

    const endDate = values.end_date ? new Date(values.end_date) : null;
    if (endDate && Number.isNaN(endDate.getTime())) {
      return results;
    }

    const dueDay = Number(values.due_day);

    if (!Number.isFinite(dueDay) || dueDay < 1 || dueDay > 31) {
      return results;
    }

    const normalized = setDate(startDate, Math.min(dueDay, daysInMonth(startDate)));
    let current = normalized;

    if (current < startDate) {
      current = addMonthsRespectingDay(current, monthsToAdd, dueDay);
    }

    while (results.length < 4) {
      if (endDate && current > endDate) {
        break;
      }
      results.push(current);
      current = addMonthsRespectingDay(current, monthsToAdd, dueDay);
    }

    return results;
  }, [values.start_date, values.end_date, values.recurrence_type, values.due_day]);

  const nextStep = async () => {
    const step = steps[currentStep];
    if (step.fields.length > 0) {
      const valid = await form.trigger(step.fields, { shouldFocus: true });
      if (!valid) {
        return;
      }
    }
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const previousStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const taxDescription =
        FEATURE_TAX_DESCRIPTION && data.category === "impostos" && data.tax_description?.trim()
          ? data.tax_description.trim()
          : null;

      await createRecurringExpense.mutateAsync({
        name: data.name,
        category: data.category,
        ...(FEATURE_TAX_DESCRIPTION ? { tax_description: taxDescription } : {}),
        amount: parseFloat(data.amount),
        recurrence_type: data.recurrence_type,
        due_day: parseInt(data.due_day),
        start_date: data.start_date,
        end_date: data.end_date || null,
        supplier_id: data.supplier_id || null,
        notes: data.notes || null,
        is_active: true,
      });
      form.reset();
      setCurrentStep(0);
      onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTemplateSelect = (templateId: string) => {
    const template = RECURRING_EXPENSE_TEMPLATES.find((item) => item.id === templateId);
    if (!template) return;

    form.setValue("name", template.name, { shouldValidate: true });
    form.setValue("category", template.category, { shouldValidate: true });
    if (FEATURE_TAX_DESCRIPTION) {
      form.setValue("tax_description", template.category === "impostos" ? template.name : "", {
        shouldValidate: template.category === "impostos",
      });
    }
    form.setValue("amount", template.amount.toString(), { shouldValidate: true });
    form.setValue("recurrence_type", template.recurrence_type, { shouldValidate: true });
    form.setValue("due_day", template.due_day.toString(), { shouldValidate: true });
    if (template.notes) {
      form.setValue("notes", template.notes, { shouldValidate: false });
    }
  };

  const isLastStep = currentStep === steps.length - 1;
  const progressValue = ((currentStep + 1) / steps.length) * 100;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nova Conta Fixa</DialogTitle>
          <DialogDescription>Cadastre despesas recorrentes para acompanhar seus próximos vencimentos.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-primary">Passo {currentStep + 1} de {steps.length}</p>
                    <h2 className="text-2xl font-bold">{steps[currentStep].title}</h2>
                    <p className="text-sm text-muted-foreground">{steps[currentStep].description}</p>
                  </div>
                  <Progress value={progressValue} className="w-32" />
                </div>
                <div className="flex flex-wrap gap-2">
                  {steps.map((step, index) => (
                    <button
                      key={step.id}
                      type="button"
                      className={cn(
                        "flex items-center gap-2 rounded-full border px-3 py-1 text-sm transition",
                        index === currentStep
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground",
                      )}
                      onClick={async () => {
                        if (index === currentStep) return;
                        if (index > currentStep) {
                          const valid = await form.trigger(steps[currentStep].fields, { shouldFocus: true });
                          if (!valid) return;
                        }
                        setCurrentStep(index);
                      }}
                    >
                      <span className="flex h-6 w-6 items-center justify-center rounded-full border border-primary/20 bg-background text-xs font-semibold">
                        {index < currentStep ? <Check className="h-3 w-3" /> : index + 1}
                      </span>
                      {step.title}
                    </button>
                  ))}
                </div>
              </div>

              {currentStep === 0 && (
                <div className="space-y-4">
                  <div className="rounded-lg border border-dashed bg-muted/40 p-4">
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-3">
                      <Sparkles className="h-4 w-4 text-primary" />
                      Templates sugeridos
                    </div>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {RECURRING_EXPENSE_TEMPLATES.map((template) => (
                        <Button
                          key={template.id}
                          type="button"
                          variant="outline"
                          className="justify-start text-left"
                          onClick={() => handleTemplateSelect(template.id)}
                        >
                          <div className="flex flex-col items-start">
                            <span className="font-semibold">{template.name}</span>
                            <span className="text-xs text-muted-foreground">{template.description}</span>
                          </div>
                          <ChevronRight className="ml-auto h-4 w-4" />
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem className="sm:col-span-2">
                          <FormLabel>Nome da Despesa</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: Aluguel do Escritório" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Categoria</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {EXPENSE_CATEGORIES.map((cat) => (
                                <SelectItem key={cat.value} value={cat.value}>
                                  {cat.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                    )}
                  />

                  {FEATURE_TAX_DESCRIPTION && values.category === "impostos" && (
                    <FormField
                      control={form.control}
                      name="tax_description"
                      render={({ field }) => (
                        <FormItem className="sm:col-span-2">
                          <FormLabel>Tipo de imposto</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: ICMS, ISS, FGTS..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  <FormField
                    control={form.control}
                    name="supplier_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fornecedor (Opcional)</FormLabel>
                        <Select
                          onValueChange={(value) => field.onChange(value === "__none__" ? "" : value)}
                          value={field.value && field.value.length > 0 ? field.value : "__none__"}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione um fornecedor" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="__none__">Nenhum</SelectItem>
                            {suppliers?.map((supplier) => (
                              <SelectItem key={supplier.id} value={supplier.id}>
                                {supplier.name}
                              </SelectItem>
                            ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}

              {currentStep === 1 && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Valor (R$)</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" min="0.01" placeholder="0,00" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="due_day"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Dia de Vencimento</FormLabel>
                        <FormControl>
                          <Input type="number" min="1" max="31" placeholder="10" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="recurrence_type"
                    render={({ field }) => (
                      <FormItem className="sm:col-span-2">
                        <FormLabel>Recorrência</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {RECURRENCE_TYPES.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                <div className="flex flex-col">
                                  <span>{type.label}</span>
                                  <span className="text-xs text-muted-foreground">{type.description}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {currentStep === 2 && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="start_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Data de Início</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="end_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Data de Fim (Opcional)</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem className="sm:col-span-2">
                        <FormLabel>Observações (Opcional)</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Informações adicionais..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {currentStep === 3 && (
                <div className="grid gap-4">
                  <div className="rounded-lg border bg-card p-4 shadow-sm">
                    <h3 className="text-lg font-semibold">Resumo da Conta Fixa</h3>
                    <div className="mt-3 grid gap-2 text-sm">
                      <SummaryRow label="Nome" value={values.name || "—"} />
                      <SummaryRow
                        label="Categoria"
                        value={
                          EXPENSE_CATEGORIES.find((category) => category.value === values.category)?.label || "—"
                        }
                      />
                      {FEATURE_TAX_DESCRIPTION && values.category === "impostos" && (
                        <SummaryRow
                          label="Imposto"
                          value={values.tax_description || "—"}
                        />
                      )}
                      <SummaryRow
                        label="Fornecedor"
                        value={
                          suppliers?.find((supplier) => supplier.id === values.supplier_id)?.name || "Não informado"
                        }
                      />
                      <SummaryRow label="Valor" value={values.amount ? formatCurrencyBRL(Number(values.amount)) : "—"} />
                      <SummaryRow
                        label="Recorrência"
                        value={
                          RECURRENCE_TYPES.find((type) => type.value === values.recurrence_type)?.description || "—"
                        }
                      />
                      <SummaryRow label="Dia de vencimento" value={values.due_day || "—"} />
                      <SummaryRow
                        label="Período"
                        value={getPeriodLabel(values.start_date, values.end_date)}
                      />
                      <SummaryRow label="Observações" value={values.notes || "Sem observações"} />
                    </div>
                  </div>

                  <div className="rounded-lg border bg-muted/30 p-4">
                    <h3 className="text-sm font-medium text-muted-foreground uppercase">Próximos vencimentos</h3>
                    {upcomingDueDates.length === 0 ? (
                      <p className="mt-3 text-sm text-muted-foreground">
                        Preencha a data de início, recorrência e dia de vencimento para visualizar uma prévia dos
                        próximos lançamentos.
                      </p>
                    ) : (
                      <ul className="mt-3 space-y-2 text-sm">
                        {upcomingDueDates.map((date, index) => (
                          <li key={date.toISOString()} className="flex items-center justify-between rounded-md bg-background px-3 py-2">
                            <span className="font-medium text-foreground">
                              {format(date, "dd 'de' MMMM yyyy", { locale: ptBR })}
                            </span>
                            <span className="text-xs text-muted-foreground">Parcela {index + 1}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Button type="button" variant="ghost" onClick={() => { onOpenChange(false); setCurrentStep(0); }}>
                Cancelar
              </Button>
              <div className="flex items-center gap-2">
                {currentStep > 0 && (
                  <Button type="button" variant="outline" onClick={previousStep}>
                    Voltar
                  </Button>
                )}
                <Button
                  type="button"
                  disabled={isLastStep && isSubmitting}
                  onClick={isLastStep ? form.handleSubmit(onSubmit) : nextStep}
                >
                  {isLastStep ? (
                    <>
                      {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Confirmar e criar
                    </>
                  ) : (
                    "Avançar"
                  )}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

function daysInMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}

function addMonthsRespectingDay(base: Date, monthsToAdd: number, desiredDay: number) {
  const next = new Date(base);
  next.setMonth(next.getMonth() + monthsToAdd);
  next.setDate(Math.min(desiredDay, daysInMonth(next)));
  return next;
}

interface SummaryRowProps {
  label: string;
  value: string;
}

const SummaryRow = ({ label, value }: SummaryRowProps) => (
  <div className="flex items-start justify-between gap-3 rounded-md border border-transparent bg-background px-3 py-2 hover:border-border">
    <span className="text-muted-foreground">{label}</span>
    <span className="max-w-[60%] text-right font-medium text-foreground">{value}</span>
  </div>
);

function formatDateString(value?: string | null) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return null;
  }
  return format(date, "dd/MM/yyyy");
}

function getPeriodLabel(start?: string | null, end?: string | null) {
  const startLabel = formatDateString(start);
  if (!startLabel) {
    return "—";
  }

  const endLabel = formatDateString(end);
  return endLabel ? `${startLabel} até ${endLabel}` : `${startLabel} em diante`;
}
