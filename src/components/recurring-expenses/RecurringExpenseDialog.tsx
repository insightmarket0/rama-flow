import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useRecurringExpenses } from "@/hooks/useRecurringExpenses";
import { useSuppliers } from "@/hooks/useSuppliers";
import { EXPENSE_CATEGORIES, RECURRENCE_TYPES } from "@/lib/recurring-expense-categories";
import { RECURRING_EXPENSE_TEMPLATES } from "@/lib/recurring-expense-templates";
import { formatCurrencyBRL } from "@/lib/format";
import { Loader2, Check, ChevronRight, Sparkles } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { FEATURE_TAX_DESCRIPTION } from "@/lib/features";

const formSchema = z
  .object({
    name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
    category: z.string().min(1, "Selecione uma categoria"),
    tax_description: z.string().optional(),
    supplier_id: z.string().optional(),
    value_type: z.enum(["fixed", "variable"]),
    amount: z.string().optional(),
    recurrence_type: z.enum(["semanal", "quinzenal", "mensal", "bimestral", "trimestral", "semestral", "anual"], {
      errorMap: () => ({ message: "Selecione a recorrência" }),
    }),
    due_rule_type: z.enum(["specific_day", "days_after_start"]),
    due_day: z.string().optional(),
    due_days: z.string().optional(),
    due_day_offset: z.string().optional(),
    start_date: z.string().min(1, "Informe a data de início"),
    end_date: z.string().optional(),
    notes: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (FEATURE_TAX_DESCRIPTION && data.category === "impostos") {
      if (!data.tax_description || data.tax_description.trim().length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["tax_description"],
          message: "Informe qual imposto está sendo pago",
        });
      }
    }

    if (data.value_type === "fixed") {
      if (!data.amount || Number(data.amount) <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["amount"],
          message: "Informe um valor maior que zero",
        });
      }
    } else if (data.amount && Number(data.amount) <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["amount"],
        message: "Use apenas valores positivos",
      });
    }

    if (data.due_rule_type === "specific_day") {
      const raw = data.due_days ?? data.due_day ?? "";
      if (!raw || raw.toString().trim().length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["due_days"],
          message: "Informe o(s) dia(s) de vencimento",
        });
      } else {
        const parts = raw
          .toString()
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
        if (parts.length === 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["due_days"],
            message: "Informe o(s) dia(s) de vencimento",
          });
        } else {
          for (const p of parts) {
            const day = Number(p);
            if (!Number.isInteger(day) || day < 1 || day > 31) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["due_days"],
                message: "Cada dia deve estar entre 1 e 31",
              });
              break;
            }
          }
        }
      }
    } else if (!data.due_day_offset || data.due_day_offset.trim().length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["due_day_offset"],
        message: "Informe quantos dias após o início do mês",
      });
    } else {
      const offset = Number(data.due_day_offset);
      if (!Number.isInteger(offset) || offset < 0 || offset > 31) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["due_day_offset"],
          message: "Use valores entre 0 e 31 dias",
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

const RECURRENCE_INTERVALS: Record<
  FormData["recurrence_type"],
  { unit: "months" | "days"; value: number }
> = {
  semanal: { unit: "days", value: 7 },
  quinzenal: { unit: "days", value: 15 },
  mensal: { unit: "months", value: 1 },
  bimestral: { unit: "months", value: 2 },
  trimestral: { unit: "months", value: 3 },
  semestral: { unit: "months", value: 6 },
  anual: { unit: "months", value: 12 },
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
      value_type: "fixed",
      amount: "",
      recurrence_type: "mensal",
      due_rule_type: "specific_day",
      due_day: "10",
      due_days: "",
      due_day_offset: "5",
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
        ? ["name", "category", "tax_description", "supplier_id", "value_type"]
        : ["name", "category", "supplier_id", "value_type"],
    },
    {
      id: "recurrence",
      title: "Valor e Recorrência",
      description: "Configure o valor, a frequência e o vencimento.",
      fields: ["amount", "recurrence_type", "due_rule_type", "due_day", "due_day_offset"],
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
  const selectedValueType = values.value_type;
  const selectedDueRule = values.due_rule_type;
  const isVariableValue = selectedValueType === "variable";
  const usesDayOffset = selectedDueRule === "days_after_start";

  useEffect(() => {
    if (FEATURE_TAX_DESCRIPTION && selectedCategory !== "impostos" && form.getValues("tax_description")) {
      form.setValue("tax_description", "", { shouldValidate: false });
    }
  }, [form, selectedCategory]);

  const upcomingDueDates = useMemo(() => {
    const results: Date[] = [];
    if (!values.start_date || !values.recurrence_type) {
      return results;
    }

    const startDate = new Date(values.start_date);
    if (Number.isNaN(startDate.getTime())) {
      return results;
    }

    const interval = RECURRENCE_INTERVALS[values.recurrence_type];
    if (!interval || interval.value <= 0) {
      return results;
    }

    const endDate = values.end_date ? new Date(values.end_date) : null;
    if (endDate && Number.isNaN(endDate.getTime())) {
      return results;
    }

    const dueRuleType = values.due_rule_type;
    const dueDay = values.due_day ? Number(values.due_day) : null;
    const dueDaysRaw = values.due_days ? values.due_days.toString() : "";
    const dueDayOffset = values.due_day_offset ? Number(values.due_day_offset) : null;

    if (
      (dueRuleType === "specific_day" && (!Number.isFinite(dueDay) || (dueDay ?? 0) < 1 || (dueDay ?? 0) > 31)) ||
      (dueRuleType === "days_after_start" && (!Number.isFinite(dueDayOffset) || (dueDayOffset ?? 0) < 0))
    ) {
      return results;
    }

    const parsedDueDays = dueDaysRaw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .map((s) => Number(s))
      .filter((n) => Number.isInteger(n) && n >= 1 && n <= 31);

    let currentMonth = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
    // Collect up to 4 upcoming dates
    while (results.length < 4) {
      if (endDate && currentMonth > endDate) break;

      if (dueRuleType === "specific_day" && parsedDueDays.length > 0) {
        for (const day of parsedDueDays) {
          const candidate = getDueDateForRule(currentMonth, dueRuleType, day, dueDayOffset);
          if (candidate >= startDate && !(endDate && candidate > endDate)) {
            results.push(candidate);
            if (results.length >= 4) break;
          }
        }
      } else {
        const candidate = getDueDateForRule(currentMonth, dueRuleType, dueDay, dueDayOffset);
        if (candidate >= startDate && !(endDate && candidate > endDate)) {
          results.push(candidate);
        }
      }

      if (interval.unit === "months") {
        currentMonth = addMonthsRespectingRule(currentMonth, interval.value, dueRuleType, dueDay, dueDayOffset);
      } else {
        // If specific fixed days are configured (e.g. 5,15), advance by months
        // so we generate those days every month rather than repeating within the same month.
        if (dueRuleType === "specific_day" && parsedDueDays.length > 0) {
          currentMonth = addMonthsRespectingRule(currentMonth, 1, dueRuleType, dueDay, dueDayOffset);
        } else {
          currentMonth = addDaysRespectingRule(currentMonth, interval.value);
        }
      }
    }

    return results;
  }, [
    values.start_date,
    values.end_date,
    values.recurrence_type,
    values.due_rule_type,
    values.due_day,
    values.due_day_offset,
    values.due_days,
  ]);

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

      const parsedAmount =
        data.amount && data.amount.trim().length > 0 ? parseFloat(data.amount) : null;
      const parsedDueDay =
        data.due_rule_type === "specific_day" && data.due_day
          ? parseInt(data.due_day, 10)
          : null;
      const parsedDueDays =
        data.due_rule_type === "specific_day" && data.due_days
          ? data.due_days
              .toString()
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
              .map((s) => parseInt(s, 10))
          : null;
      const parsedDueDayOffset =
        data.due_rule_type === "days_after_start" && data.due_day_offset
          ? parseInt(data.due_day_offset, 10)
          : null;

      await createRecurringExpense.mutateAsync({
        name: data.name,
        category: data.category,
        ...(FEATURE_TAX_DESCRIPTION ? { tax_description: taxDescription } : {}),
        amount: parsedAmount,
        value_type: data.value_type,
        recurrence_type: data.recurrence_type,
        due_rule_type: data.due_rule_type,
        due_day: parsedDueDay,
        due_days: parsedDueDays,
        due_day_offset: parsedDueDayOffset,
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
    form.setValue("due_days", template.due_day.toString(), { shouldValidate: true });
    form.setValue("value_type", "fixed", { shouldValidate: true });
    form.setValue("due_rule_type", "specific_day", { shouldValidate: true });
    form.setValue("due_day_offset", "", { shouldValidate: false });
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
                      <FormItem className="flex flex-col justify-end">
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
                  <FormField
                    control={form.control}
                    name="value_type"
                    render={({ field }) => (
                      <FormItem className="sm:col-span-2">
                        <FormLabel>Tipo de valor</FormLabel>
                        <FormDescription>Escolha se essa conta tem um valor fixo ou se o valor varia mês a mês.</FormDescription>
                        <FormControl>
                          <RadioGroup
                            value={field.value}
                            onValueChange={field.onChange}
                            className="grid gap-3 sm:grid-cols-2"
                          >
                            <div
                              className={cn(
                                "flex gap-3 rounded-lg border p-3",
                                field.value === "fixed"
                                  ? "border-primary bg-primary/10"
                                  : "border-border hover:border-primary/50",
                              )}
                            >
                              <RadioGroupItem value="fixed" id="value-type-fixed" className="mt-1" />
                              <div>
                                <p className="font-semibold">Valor fixo</p>
                                <p className="text-sm text-muted-foreground">
                                  Usaremos o mesmo valor automaticamente em cada lançamento.
                                </p>
                              </div>
                            </div>
                            <div
                              className={cn(
                                "flex gap-3 rounded-lg border p-3",
                                field.value === "variable"
                                  ? "border-primary bg-primary/10"
                                  : "border-border hover:border-primary/50",
                              )}
                            >
                              <RadioGroupItem value="variable" id="value-type-variable" className="mt-1" />
                              <div>
                                <p className="font-semibold">Valor variável</p>
                                <p className="text-sm text-muted-foreground">
                                  Geramos o lembrete todo mês e você informa o valor quando a fatura chegar.
                                </p>
                              </div>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        {field.value === "variable" && (
                          <p className="text-xs text-muted-foreground">
                            O valor será preenchido todo mês quando a fatura chegar. Vamos criar apenas o lembrete em Contas a Pagar.
                          </p>
                        )}
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
                      <FormItem className="flex flex-col justify-end">
                        <FormLabel>{isVariableValue ? "Valor estimado (opcional)" : "Valor da recorrência (R$)"}</FormLabel>
                        <FormDescription>
                          {isVariableValue
                            ? "O lançamento mensal será criado sem valor."
                            : "Esse valor será preenchido automaticamente em cada lançamento."}
                        </FormDescription>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            min={isVariableValue ? "0" : "0.01"}
                            placeholder={isVariableValue ? "0,00 (opcional)" : "0,00"}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="recurrence_type"
                    render={({ field }) => (
                      <FormItem className="flex flex-col justify-end">
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

                  <FormField
                    control={form.control}
                    name="due_rule_type"
                    render={({ field }) => (
                      <FormItem className="sm:col-span-2">
                        <FormLabel>Regra de vencimento</FormLabel>
                        <FormDescription>Escolha se o vencimento é um dia fixo ou alguns dias após o início do mês.</FormDescription>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="specific_day">
                              <div className="flex flex-col">
                                <span>Dia fixo</span>
                                <span className="text-xs text-muted-foreground">Ex: todo dia 10</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="days_after_start">
                              <div className="flex flex-col">
                                <span>Dias após início do mês</span>
                                <span className="text-xs text-muted-foreground">Ex: 5 dias após o dia 1</span>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {usesDayOffset ? (
                    <FormField
                      control={form.control}
                      name="due_day_offset"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Dias após o início do mês</FormLabel>
                          <FormDescription>Informe quantos dias após o dia 1 devemos gerar o vencimento.</FormDescription>
                          <FormControl>
                            <Input type="number" min="0" max="31" placeholder="5" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ) : (
                    <FormField
                      control={form.control}
                      name="due_days"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Dias de vencimento</FormLabel>
                          <FormDescription>Informe os dias do mês separados por vírgula. Ex: 5,15</FormDescription>
                          <FormControl>
                            <Input type="text" placeholder="5,15" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
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
                      <SummaryRow label="Tipo de valor" value={getValueTypeLabel(values.value_type)} />
                      <SummaryRow
                        label={values.value_type === "variable" ? "Valor estimado" : "Valor"}
                        value={
                          values.amount && values.amount.length > 0
                            ? formatCurrencyBRL(Number(values.amount))
                            : values.value_type === "variable"
                              ? "Definido quando a fatura chegar"
                              : "—"
                        }
                      />
                      <SummaryRow
                        label="Recorrência"
                        value={
                          RECURRENCE_TYPES.find((type) => type.value === values.recurrence_type)?.description || "—"
                        }
                      />
                      <SummaryRow
                        label="Regra de vencimento"
                        value={getDueRuleLabel(values.due_rule_type, values.due_day, values.due_day_offset, values.due_days)}
                      />
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

function getDueDateForRule(
  baseDate: Date,
  ruleType: FormData["due_rule_type"],
  dueDay?: number | null,
  dueDayOffset?: number | null,
) {
  const working = new Date(baseDate);
  working.setDate(1);
  const limit = daysInMonth(working);

  if (ruleType === "days_after_start") {
    const safeOffset = Math.max(0, Math.min(dueDayOffset ?? 0, limit - 1));
    working.setDate(1 + safeOffset);
    return working;
  }

  const safeDay = Math.max(1, Math.min(dueDay ?? 1, limit));
  working.setDate(safeDay);
  return working;
}

function addMonthsRespectingRule(
  current: Date,
  monthsToAdd: number,
  ruleType: FormData["due_rule_type"],
  dueDay?: number | null,
  dueDayOffset?: number | null,
) {
  const reference = new Date(current);
  reference.setMonth(reference.getMonth() + monthsToAdd);
  return getDueDateForRule(reference, ruleType, dueDay, dueDayOffset);
}

function addDaysRespectingRule(current: Date, daysToAdd: number) {
  const next = new Date(current);
  next.setDate(next.getDate() + daysToAdd);
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

function getValueTypeLabel(valueType: FormData["value_type"]) {
  return valueType === "variable" ? "Valor variável" : "Valor fixo";
}

function getDueRuleLabel(
  ruleType: FormData["due_rule_type"],
  dueDay?: string | null,
  dueDayOffset?: string | null,
  dueDays?: string | null,
) {
  if (ruleType === "days_after_start") {
    const offset = dueDayOffset && dueDayOffset.length > 0 ? Number(dueDayOffset) : null;
    if (typeof offset === "number" && !Number.isNaN(offset)) {
      return `${offset} dia${offset === 1 ? "" : "s"} após o início do mês`;
    }
    return "Dias após o início do mês";
  }

  const daysRaw = dueDays ?? dueDay ?? "";
  if (daysRaw && daysRaw.length > 0) {
    const parts = daysRaw
      .toString()
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    if (parts.length === 1) {
      return `Todo dia ${parts[0]}`;
    }
    if (parts.length > 1) {
      return `Todo dia ${parts.join(", ")}`;
    }
  }

  return "Dia fixo do mês";
}
