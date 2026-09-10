import { useEffect, useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePaymentConditions } from "@/hooks/usePaymentConditions";
import { Tables } from "@/integrations/supabase/types";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { OPEN_PAYMENT_CONDITION_DIALOG_EVENT } from "@/lib/events";
import { Percent, Calendar, Settings2 } from "lucide-react";

const paymentConditionSchema = z.object({
  mode: z.enum(["padrao", "entrada", "customizado"]),
  name: z.string().min(1, "Nome é obrigatório").max(100),
  installments: z.coerce.number().min(1, "Mínimo 1 parcela").max(100),
  interval_days: z.coerce.number().min(0, "Intervalo não pode ser negativo").max(365),
  down_payment_percent: z.coerce.number().min(0, "Mínimo 0%").max(100, "Máximo 100%").optional(),
  customDays: z.string().optional(),
});

type PaymentConditionFormData = z.infer<typeof paymentConditionSchema>;

interface PaymentConditionDialogProps {
  condition?: Tables<"payment_conditions">;
  trigger?: React.ReactNode;
  listenForGlobalOpen?: boolean;
  onSuccess?: (condition: Tables<"payment_conditions">) => void;
}

const parseCustomDaysInput = (value?: string) => {
  if (!value) {
    return { days: [] as number[], invalidTokens: [] as string[] };
  }
  const tokens = value.split(/[,;\s]+/).map((token) => token.trim()).filter(Boolean);
  const days: number[] = [];
  const invalidTokens: string[] = [];
  const seen = new Set<number>();
  for (const token of tokens) {
    if (!/^\d+$/.test(token)) {
      invalidTokens.push(token);
      continue;
    }
    const parsed = Number.parseInt(token, 10);
    if (parsed < 0) {
      invalidTokens.push(token);
      continue;
    }
    if (!seen.has(parsed)) {
      seen.add(parsed);
      days.push(parsed);
    }
  }
  days.sort((a, b) => a - b);
  return { days, invalidTokens };
};

export const PaymentConditionDialog = ({
  condition,
  trigger,
  listenForGlobalOpen = false,
  onSuccess,
}: PaymentConditionDialogProps) => {
  const [open, setOpen] = useState(false);
  const { createPaymentCondition, updatePaymentCondition } = usePaymentConditions();

  let defaultMode: "padrao" | "entrada" | "customizado" = "padrao";
  if (condition?.due_days && condition.due_days.length > 0) defaultMode = "customizado";
  else if (condition?.down_payment_percent && condition.down_payment_percent > 0) defaultMode = "entrada";

  const form = useForm<PaymentConditionFormData>({
    resolver: zodResolver(paymentConditionSchema),
    defaultValues: {
      mode: defaultMode,
      name: condition?.name || "",
      installments: condition?.installments || 1,
      interval_days: condition?.interval_days || 30,
      down_payment_percent: condition?.down_payment_percent || 0,
      customDays: condition?.due_days?.join(", ") || "",
    },
  });

  const mode = form.watch("mode");
  const customDaysValue = form.watch("customDays");
  const parsedCustomDays = useMemo(
    () => parseCustomDaysInput(customDaysValue),
    [customDaysValue],
  );

  useEffect(() => {
    if (mode === "customizado" && parsedCustomDays.days.length > 0) {
      if (form.getValues("installments") !== parsedCustomDays.days.length) {
        form.setValue("installments", parsedCustomDays.days.length, { shouldValidate: true });
      }
    }
  }, [form, parsedCustomDays.days, mode]);

  useEffect(() => {
    if (!listenForGlobalOpen || condition || typeof window === "undefined") {
      return;
    }
    const handleOpen = () => {
      form.reset({
        mode: "padrao",
        name: "",
        installments: 1,
        interval_days: 30,
        down_payment_percent: 0,
        customDays: "",
      });
      setOpen(true);
    };
    window.addEventListener(OPEN_PAYMENT_CONDITION_DIALOG_EVENT, handleOpen);
    return () => window.removeEventListener(OPEN_PAYMENT_CONDITION_DIALOG_EVENT, handleOpen);
  }, [condition, form, listenForGlobalOpen]);

  const onSubmit = async (data: PaymentConditionFormData) => {
    try {
      if (data.mode === "customizado") {
        if (parsedCustomDays.invalidTokens.length > 0) {
          form.setError("customDays", { message: `Valores inválidos: ${parsedCustomDays.invalidTokens.join(", ")}` });
          return;
        }
        if (parsedCustomDays.days.length === 0) {
          form.setError("customDays", { message: "Informe pelo menos um dia válido separado por vírgula." });
          return;
        }
      }

      const isCustom = data.mode === "customizado";
      const isDownPayment = data.mode === "entrada";

      const conditionData = {
        name: data.name,
        installments: isCustom ? parsedCustomDays.days.length : data.installments,
        interval_days: isCustom ? 0 : data.interval_days,
        down_payment_percent: isDownPayment ? (data.down_payment_percent || 0) : 0,
        due_days: isCustom ? parsedCustomDays.days : null,
      };

      const savedCondition = condition
        ? await updatePaymentCondition.mutateAsync({ id: condition.id, ...conditionData })
        : await createPaymentCondition.mutateAsync(conditionData);

      setOpen(false);
      form.reset();
      if (savedCondition) {
        onSuccess?.(savedCondition as Tables<"payment_conditions">);
      }
    } catch (error) {
      console.error("Erro ao salvar condição:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger ? <DialogTrigger asChild>{trigger}</DialogTrigger> : null}
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{condition ? "Editar Condição" : "Nova Condição de Pagamento"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-2">
            
            <FormField
              control={form.control}
              name="mode"
              render={({ field }) => (
                <Tabs value={field.value} onValueChange={field.onChange} className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="padrao" className="text-xs gap-1.5"><Calendar className="w-3.5 h-3.5"/>Padrão</TabsTrigger>
                    <TabsTrigger value="entrada" className="text-xs gap-1.5"><Percent className="w-3.5 h-3.5"/>Com Entrada</TabsTrigger>
                    <TabsTrigger value="customizado" className="text-xs gap-1.5"><Settings2 className="w-3.5 h-3.5"/>Personalizado</TabsTrigger>
                  </TabsList>
                </Tabs>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome da Condição</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder={mode === 'entrada' ? "Ex: 50% Entrada + 3x" : "Ex: 30/60/90"} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {mode === "padrao" && (
              <div className="grid grid-cols-2 gap-4 animate-in fade-in zoom-in-95 duration-200">
                <FormField
                  control={form.control}
                  name="installments"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nº de Parcelas</FormLabel>
                      <FormControl><Input {...field} type="number" min="1" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="interval_days"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Intervalo (dias)</FormLabel>
                      <FormControl><Input {...field} type="number" min="0" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {mode === "entrada" && (
              <div className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
                <FormField
                  control={form.control}
                  name="down_payment_percent"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Porcentagem da Entrada (%)</FormLabel>
                      <FormControl><Input {...field} type="number" min="1" max="100" placeholder="Ex: 50" /></FormControl>
                      <FormDescription>Valor a ser pago no ato da compra.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="installments"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Parcelas Restantes</FormLabel>
                        <FormControl><Input {...field} type="number" min="1" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="interval_days"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Intervalo (dias)</FormLabel>
                        <FormControl><Input {...field} type="number" min="0" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            )}

            {mode === "customizado" && (
              <div className="animate-in fade-in zoom-in-95 duration-200">
                <FormField
                  control={form.control}
                  name="customDays"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dias Corridos Personalizados</FormLabel>
                      <FormControl><Input {...field} placeholder="Ex: 15, 30, 45" /></FormControl>
                      <FormDescription>Informe os dias após a data da compra. Separe por vírgula.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            <div className="flex gap-2 justify-end pt-2 border-t border-white/5">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={createPaymentCondition.isPending || updatePaymentCondition.isPending}>
                {condition ? "Salvar Alterações" : "Criar Condição"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
