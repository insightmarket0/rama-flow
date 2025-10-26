import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tables } from "@/integrations/supabase/types";
import { QuotationResponseWithSupplier, ResponseStatus, UpsertQuotationResponseInput } from "@/types/quotations";
import { UseMutationResult } from "@tanstack/react-query";

const parseCurrency = (value: string) => {
  if (!value) return NaN;
  const normalized = value.replace(/\s/g, "").replace(/\./g, "").replace(",", ".");
  return Number(normalized);
};

const responseSchema = z.object({
  fornecedor_id: z.string().min(1, "Selecione um fornecedor"),
  valor_total: z
    .string()
    .min(1, "Informe o valor")
    .refine((val) => !Number.isNaN(parseCurrency(val)), {
      message: "Valor inválido",
    }),
  prazo_dias: z
    .string()
    .min(1, "Informe o prazo")
    .refine((val) => {
      const parsed = Number(val);
      return !Number.isNaN(parsed) && parsed >= 0;
    }, "Prazo não pode ser negativo"),
  condicao_pagamento: z.string().max(30, "Máximo de 30 caracteres").optional().or(z.literal("")),
  observacao: z.string().max(300, "Máximo de 300 caracteres").optional().or(z.literal("")),
  status: z.enum(["rascunho", "enviada", "aprovada"] as const),
});

type ResponseFormData = z.infer<typeof responseSchema> & {
  condicao_pagamento?: string;
  observacao?: string;
};

interface QuotationResponseDialogProps {
  quotationId: string;
  response?: QuotationResponseWithSupplier;
  suppliers?: Tables<"suppliers">[];
  trigger?: React.ReactNode;
  disabled?: boolean;
  mutation: UseMutationResult<string, Error, UpsertQuotationResponseInput>;
}

export const QuotationResponseDialog = ({
  quotationId,
  response,
  suppliers,
  trigger,
  disabled,
  mutation,
}: QuotationResponseDialogProps) => {
  const [open, setOpen] = useState(false);

  const form = useForm<ResponseFormData>({
    resolver: zodResolver(responseSchema),
    defaultValues: {
      fornecedor_id: response?.fornecedor_id ?? "",
      valor_total: response ? String(response.valor_total) : "",
      prazo_dias: response ? String(response.prazo_dias) : "",
      condicao_pagamento: response?.condicao_pagamento ?? null,
      observacao: response?.observacao ?? null,
      status: response?.status ?? "rascunho",
    },
  });

  useEffect(() => {
    if (!open) return;
    form.reset({
      fornecedor_id: response?.fornecedor_id ?? "",
      valor_total: response ? String(response.valor_total) : "",
      prazo_dias: response ? String(response.prazo_dias) : "",
      condicao_pagamento: response?.condicao_pagamento ?? null,
      observacao: response?.observacao ?? null,
      status: response?.status ?? "rascunho",
    });
  }, [response, form, open]);

  const handleSubmit = async (values: ResponseFormData) => {
    await mutation.mutateAsync({
      quotation_id: quotationId,
      id: response?.id,
      fornecedor_id: values.fornecedor_id,
      valor_total: parseCurrency(values.valor_total),
      prazo_dias: Number(values.prazo_dias),
      condicao_pagamento: values.condicao_pagamento ? values.condicao_pagamento : null,
      observacao: values.observacao ? values.observacao : null,
      status: values.status,
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={(value) => (!disabled ? setOpen(value) : setOpen(false))}>
      {trigger ? (
        disabled ? (
          <span className="pointer-events-none opacity-60">{trigger}</span>
        ) : (
          <DialogTrigger asChild>{trigger}</DialogTrigger>
        )
      ) : (
        <DialogTrigger asChild>
          <Button variant="outline" disabled={disabled}>
            Adicionar fornecedor
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{response ? "Editar resposta" : "Nova resposta"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="fornecedor_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fornecedor</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange} disabled={mutation.isPending}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o fornecedor" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {(suppliers ?? []).map((supplier) => (
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
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="valor_total"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor total (R$)</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="0,00"
                        inputMode="decimal"
                        disabled={mutation.isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="prazo_dias"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prazo (dias)</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" min={0} disabled={mutation.isPending} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="condicao_pagamento"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Condição de pagamento</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Ex.: à vista / 30/60"
                        disabled={mutation.isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange} disabled={mutation.isPending}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                      <SelectItem value="rascunho">Rascunho</SelectItem>
                      <SelectItem value="enviada">Enviada</SelectItem>
                      <SelectItem value="aprovada" disabled>
                        Aprovada (usar modal)
                      </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="observacao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={3} disabled={mutation.isPending} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="flex items-center gap-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? "Salvando..." : "Salvar"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
