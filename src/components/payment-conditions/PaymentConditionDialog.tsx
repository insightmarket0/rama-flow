import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePaymentConditions } from "@/hooks/usePaymentConditions";
import { Tables } from "@/integrations/supabase/types";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const paymentConditionSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").max(100),
  installments: z.coerce.number().min(1, "Mínimo 1 parcela").max(100),
  interval_days: z.coerce.number().min(0, "Intervalo não pode ser negativo").max(365),
  down_payment_percent: z.coerce.number().min(0, "Mínimo 0%").max(100, "Máximo 100%").optional(),
});

type PaymentConditionFormData = z.infer<typeof paymentConditionSchema>;

interface PaymentConditionDialogProps {
  condition?: Tables<"payment_conditions">;
  trigger: React.ReactNode;
}

export const PaymentConditionDialog = ({ condition, trigger }: PaymentConditionDialogProps) => {
  const [open, setOpen] = useState(false);
  const { createPaymentCondition, updatePaymentCondition } = usePaymentConditions();

  const form = useForm<PaymentConditionFormData>({
    resolver: zodResolver(paymentConditionSchema),
    defaultValues: {
      name: condition?.name || "",
      installments: condition?.installments || 1,
      interval_days: condition?.interval_days || 30,
      down_payment_percent: condition?.down_payment_percent || 0,
    },
  });

  const onSubmit = async (data: PaymentConditionFormData) => {
    try {
      const conditionData = {
        name: data.name,
        installments: data.installments,
        interval_days: data.interval_days,
        down_payment_percent: data.down_payment_percent || 0,
      };

      if (condition) {
        await updatePaymentCondition.mutateAsync({ id: condition.id, ...conditionData });
      } else {
        await createPaymentCondition.mutateAsync(conditionData);
      }
      setOpen(false);
      form.reset();
    } catch (error) {
      console.error("Erro ao salvar condição:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
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
                    <Input {...field} type="number" min="1" />
                  </FormControl>
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
                    <Input {...field} type="number" min="0" />
                  </FormControl>
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
