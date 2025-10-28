import { useEffect, useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePaymentConditions } from "@/hooks/usePaymentConditions";
import { Tables } from "@/integrations/supabase/types";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { OPEN_PAYMENT_CONDITION_DIALOG_EVENT } from "@/lib/events";

const paymentConditionSchema = z.object({
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

  const tokens = value
    .split(/[,;\s]+/)
    .map((token) => token.trim())
    .filter(Boolean);

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

  const form = useForm<PaymentConditionFormData>({
    resolver: zodResolver(paymentConditionSchema),
    defaultValues: {
      name: condition?.name || "",
      installments: condition?.installments || 1,
      interval_days: condition?.interval_days || 30,
      down_payment_percent: condition?.down_payment_percent || 0,
      customDays: condition?.due_days?.join(", ") || "",
    },
  });

  const customDaysValue = form.watch("customDays");
  const parsedCustomDays = useMemo(
    () => parseCustomDaysInput(customDaysValue),
    [customDaysValue],
  );

  useEffect(() => {
    if (parsedCustomDays.days.length > 0 && form.getValues("installments") !== parsedCustomDays.days.length) {
      form.setValue("installments", parsedCustomDays.days.length, { shouldValidate: true });
    }
  }, [form, parsedCustomDays.days]);

  useEffect(() => {
    if (!listenForGlobalOpen || condition || typeof window === "undefined") {
      return;
    }

    const handleOpen = () => {
      form.reset({
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
      if (parsedCustomDays.invalidTokens.length > 0) {
        form.setError("customDays", {
          message: `Valores inválidos: ${parsedCustomDays.invalidTokens.join(", ")}`,
        });
        return;
      }

      if (data.customDays && parsedCustomDays.days.length === 0) {
        form.setError("customDays", {
          message: "Informe pelo menos um dia válido separado por vírgula.",
        });
        return;
      }

      const hasCustomDays = parsedCustomDays.days.length > 0;
      const conditionData = {
        name: data.name,
        installments: hasCustomDays ? parsedCustomDays.days.length : data.installments,
        interval_days: data.interval_days,
        down_payment_percent: data.down_payment_percent || 0,
        due_days: hasCustomDays ? parsedCustomDays.days : null,
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{condition ? "Editar Condição" : "Nova Condição de Pagamento"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Ex: 30/60/90" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="installments"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número de Parcelas</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      min="1"
                      disabled={parsedCustomDays.days.length > 0}
                    />
                  </FormControl>
                  <FormDescription>
                    {parsedCustomDays.days.length > 0
                      ? "Total de parcelas calculado a partir dos dias personalizados."
                      : "Informe o número de parcelas quando não houver dias personalizados."}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="customDays"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dias personalizados (opcional)</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Ex: 15, 30, 45" />
                  </FormControl>
                  <FormDescription>
                    Informe os dias após a data da compra para gerar cada parcela. Separe por vírgulas.
                  </FormDescription>
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
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      min="0"
                      disabled={parsedCustomDays.days.length > 0}
                    />
                  </FormControl>
                  <FormDescription>
                    {parsedCustomDays.days.length > 0
                      ? "Mantido apenas para referência; os dias personalizados prevalecem."
                      : "Intervalo fixo entre cada parcela."}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="down_payment_percent"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Entrada (%)</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" min="0" max="100" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={createPaymentCondition.isPending || updatePaymentCondition.isPending}>
                {condition ? "Atualizar" : "Criar"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
