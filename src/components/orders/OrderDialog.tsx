import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
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
import { Plus, Trash2 } from "lucide-react";
import { useOrders, OrderItem } from "@/hooks/useOrders";
import { useSuppliers } from "@/hooks/useSuppliers";
import { usePaymentConditions } from "@/hooks/usePaymentConditions";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { OPEN_ORDER_DIALOG_EVENT } from "@/lib/events";
import { formatCurrencyBRL } from "@/lib/format";
import { generateInstallmentPlan } from "@/lib/installments";
import { PaymentConditionDialog } from "@/components/payment-conditions/PaymentConditionDialog";
import { PaymentConditionsPanel } from "@/components/payment-conditions/PaymentConditionsPanel";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const dateStringSchema = z
  .string()
  .min(1, "Selecione uma data")
  .refine(
    (value) => {
      const parsed = new Date(`${value}T00:00:00`);
      return !Number.isNaN(parsed.getTime());
    },
    { message: "Data inválida" },
  );

const orderSchema = z.object({
  supplier_id: z.string().min(1, "Selecione um fornecedor"),
  order_number: z
    .string()
    .max(100, "Máximo de 100 caracteres")
    .optional()
    .transform((value) => value?.trim() || undefined),
  invoice_number: z
    .string()
    .max(100, "Máximo de 100 caracteres")
    .optional()
    .transform((value) => value?.trim() || undefined),
  payment_condition_id: z.string().min(1, "Selecione uma condição"),
  freight: z.number().or(z.string()).transform((val) => typeof val === 'string' ? parseFloat(val) || 0 : val),
  discount: z.number().or(z.string()).transform((val) => typeof val === 'string' ? parseFloat(val) || 0 : val),
  taxes: z.number().or(z.string()).transform((val) => typeof val === 'string' ? parseFloat(val) || 0 : val),
  order_date: dateStringSchema,
});

type InstallmentPreview = {
  installmentNumber: number;
  label: string;
  value: number;
  date: string;
  isoDate: string;
  dueInDays: number;
};

type CustomInstallment = {
  installmentNumber: number;
  label: string;
  value: number;
  isoDate: string;
};

const toISODateString = (date: Date) => date.toISOString().split("T")[0] ?? "";

const formatISOToDisplay = (isoDate: string) => {
  if (!isoDate) return "-";
  const parsed = new Date(`${isoDate}T00:00:00`);
  return Number.isNaN(parsed.getTime()) ? "-" : parsed.toLocaleDateString("pt-BR");
};

interface OrderDialogProps {
  children?: React.ReactNode;
  enableGlobalOpen?: boolean;
}

export function OrderDialog({ children, enableGlobalOpen = false }: OrderDialogProps) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [currentItem, setCurrentItem] = useState({
    sku: "",
    description: "",
    quantity: "",
    unit_price: "",
  });
  const [customInstallments, setCustomInstallments] = useState<CustomInstallment[]>([]);

  const { createOrder } = useOrders();
  const { suppliers } = useSuppliers();
  const { paymentConditions } = usePaymentConditions();

  const getDefaultValues = useCallback(() => ({
    supplier_id: "",
    order_number: "",
    invoice_number: "",
    payment_condition_id: "",
    freight: 0,
    discount: 0,
    taxes: 0,
    order_date: new Date().toISOString().split("T")[0],
  }), []);

  const form = useForm<z.infer<typeof orderSchema>>({
    resolver: zodResolver(orderSchema),
    defaultValues: getDefaultValues(),
  });

  useEffect(() => {
    if (!enableGlobalOpen || typeof window === "undefined") {
      return;
    }

    const handleOpen = () => {
      form.reset(getDefaultValues());
      setOpen(true);
      setItems([]);
      setCustomInstallments([]);
    };

    window.addEventListener(OPEN_ORDER_DIALOG_EVENT, handleOpen);
    return () => window.removeEventListener(OPEN_ORDER_DIALOG_EVENT, handleOpen);
  }, [enableGlobalOpen, form, getDefaultValues]);

  const addItem = () => {
    if (
      currentItem.sku &&
      currentItem.description &&
      currentItem.quantity &&
      currentItem.unit_price
    ) {
      setItems([
        ...items,
        {
          sku: currentItem.sku,
          description: currentItem.description,
          quantity: parseFloat(currentItem.quantity),
          unit_price: parseFloat(currentItem.unit_price),
        },
      ]);
      setCurrentItem({ sku: "", description: "", quantity: "", unit_price: "" });
    }
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const calculateTotal = () => {
    const itemsTotal = items.reduce(
      (sum, item) => sum + item.quantity * item.unit_price,
      0
    );
    const freight = Number(form.watch("freight")) || 0;
    const discount = Number(form.watch("discount")) || 0;
    const taxes = Number(form.watch("taxes")) || 0;
    return itemsTotal + freight + taxes - discount;
  };

  const calculateInstallmentsPreview = (): InstallmentPreview[] => {
    const total = calculateTotal();
    const conditionId = form.watch("payment_condition_id");
    const condition = paymentConditions?.find((c) => c.id === conditionId);
    const orderDateValue = form.watch("order_date");
    const baseDate = orderDateValue
      ? new Date(`${orderDateValue}T00:00:00`)
      : new Date();
    const effectiveBaseDate = Number.isNaN(baseDate.getTime()) ? new Date() : baseDate;

    if (!condition || total <= 0) return [];

    return generateInstallmentPlan(total, condition, effectiveBaseDate).map((item) => {
      const isoDate = toISODateString(item.dueDate);
      return {
        installmentNumber: item.installmentNumber,
        label: item.installmentNumber === 0 ? "Entrada" : `Parcela ${item.installmentNumber}`,
        value: item.value,
        date: item.dueDate.toLocaleDateString("pt-BR"),
        isoDate,
        dueInDays: item.dueInDays,
      };
    });
  };

  const installmentsPreview = calculateInstallmentsPreview();

  useEffect(() => {
    setCustomInstallments((previous) => {
      if (installmentsPreview.length === 0) {
        return previous.length > 0 ? [] : previous;
      }

      const mapped = installmentsPreview.map((installment) => {
        const existing = previous.find(
          (item) => item.installmentNumber === installment.installmentNumber,
        );
        return {
          installmentNumber: installment.installmentNumber,
          label: installment.label,
          value: installment.value,
          isoDate: existing?.isoDate ?? installment.isoDate,
        };
      });

      const hasChanges =
        mapped.length !== previous.length ||
        mapped.some((item, index) => {
          const current = previous[index];
          return (
            !current ||
            current.installmentNumber !== item.installmentNumber ||
            current.label !== item.label ||
            current.value !== item.value ||
            current.isoDate !== item.isoDate
          );
        });

      return hasChanges ? mapped : previous;
    });
  }, [installmentsPreview]);

  const orderDateValue = form.watch("order_date");
  const normalizedBaseOrderDate = useMemo(() => {
    const baseOrderDate = orderDateValue
      ? new Date(`${orderDateValue}T00:00:00`)
      : new Date();
    return Number.isNaN(baseOrderDate.getTime()) ? new Date() : baseOrderDate;
  }, [orderDateValue]);

  const displayedInstallments = useMemo(() => {
    return installmentsPreview.map((installment) => {
      const custom = customInstallments.find(
        (item) => item.installmentNumber === installment.installmentNumber,
      );
      const isoDate = custom?.isoDate ?? installment.isoDate;
      const dueDate = isoDate ? new Date(`${isoDate}T00:00:00`) : null;
      const dueInDays =
        dueDate && !Number.isNaN(dueDate.getTime())
          ? Math.round((dueDate.getTime() - normalizedBaseOrderDate.getTime()) / (1000 * 60 * 60 * 24))
          : installment.dueInDays;

      return {
        ...installment,
        isoDate,
        date: formatISOToDisplay(isoDate),
        dueInDays,
      };
    });
  }, [customInstallments, installmentsPreview, normalizedBaseOrderDate]);

  const hasCompleteCustomInstallments =
    customInstallments.length === installmentsPreview.length &&
    customInstallments.every((installment) => installment.isoDate);

  const handleInstallmentDateChange = (installmentNumber: number, value: string) => {
    setCustomInstallments((previous) =>
      previous.map((installment) =>
        installment.installmentNumber === installmentNumber
          ? { ...installment, isoDate: value }
          : installment,
      ),
    );
  };

  const resetInstallmentDates = () => {
    setCustomInstallments(
      installmentsPreview.map((installment) => ({
        installmentNumber: installment.installmentNumber,
        label: installment.label,
        value: installment.value,
        isoDate: installment.isoDate,
      })),
    );
  };

  const onSubmit = async (values: z.infer<typeof orderSchema>) => {
    if (items.length === 0) {
      form.setError("supplier_id", {
        message: "Adicione pelo menos um item ao pedido",
      });
      return;
    }

    const installmentsOverride =
      hasCompleteCustomInstallments && installmentsPreview.length > 0
        ? customInstallments.map((installment) => ({
            installmentNumber: installment.installmentNumber,
            value: installment.value,
            due_date: installment.isoDate,
          }))
        : undefined;

    await createOrder.mutateAsync({
      supplier_id: values.supplier_id,
      payment_condition_id: values.payment_condition_id,
      order_number: values.order_number,
      invoice_number: values.invoice_number,
      items,
      freight: values.freight,
      discount: values.discount,
      taxes: values.taxes,
      order_date: values.order_date,
      installments_override: installmentsOverride,
    });

    setOpen(false);
    form.reset(getDefaultValues());
    setItems([]);
    setCustomInstallments([]);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {children ? <DialogTrigger asChild>{children}</DialogTrigger> : null}
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Novo Pedido de Compra</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <FormField
                control={form.control}
                name="supplier_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fornecedor</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
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
                name="order_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número do Pedido</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite o número (opcional)" {...field} value={field.value ?? ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="invoice_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número da Nota Fiscal</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite o número (opcional)" {...field} value={field.value ?? ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="order_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data da compra</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Itens do Pedido</h3>
              <div className="grid grid-cols-5 gap-2">
                <Input
                  placeholder="SKU"
                  value={currentItem.sku}
                  onChange={(e) =>
                    setCurrentItem({ ...currentItem, sku: e.target.value })
                  }
                />
                <Input
                  placeholder="Descrição"
                  value={currentItem.description}
                  onChange={(e) =>
                    setCurrentItem({
                      ...currentItem,
                      description: e.target.value,
                    })
                  }
                />
                <Input
                  type="number"
                  placeholder="Qtd"
                  value={currentItem.quantity}
                  onChange={(e) =>
                    setCurrentItem({ ...currentItem, quantity: e.target.value })
                  }
                />
                <Input
                  type="number"
                  placeholder="Preço"
                  value={currentItem.unit_price}
                  onChange={(e) =>
                    setCurrentItem({
                      ...currentItem,
                      unit_price: e.target.value,
                    })
                  }
                />
                <Button type="button" onClick={addItem}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {items.length > 0 && (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>SKU</TableHead>
                      <TableHead>Descrição</TableHead>
                      <TableHead>Qtd</TableHead>
                      <TableHead>Preço Unit.</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.sku}</TableCell>
                        <TableCell>{item.description}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>
                          {formatCurrencyBRL(item.unit_price)}
                        </TableCell>
                        <TableCell>
                          {formatCurrencyBRL(item.quantity * item.unit_price)}
                        </TableCell>
                        <TableCell>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeItem(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="freight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Frete</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="taxes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Impostos</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="discount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Desconto</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="payment_condition_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Condição de Pagamento</FormLabel>
                  <div className="flex flex-wrap items-center gap-2">
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="min-w-[220px]">
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {paymentConditions?.map((condition) => (
                          <SelectItem key={condition.id} value={condition.id}>
                            {condition.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <PaymentConditionDialog
                      onSuccess={(condition) => {
                        form.setValue("payment_condition_id", condition.id, { shouldValidate: true });
                      }}
                      trigger={
                        <Button type="button" variant="outline" size="sm">
                          Nova
                        </Button>
                      }
                    />
                    <Sheet>
                      <SheetTrigger asChild>
                        <Button type="button" variant="outline" size="sm">
                          Gerenciar
                        </Button>
                      </SheetTrigger>
                      <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
                        <SheetHeader>
                          <SheetTitle>Condições de Pagamento</SheetTitle>
                        </SheetHeader>
                        <div className="mt-6">
                          <PaymentConditionsPanel
                            variant="flat"
                            onCreateSuccess={(condition) => {
                              form.setValue("payment_condition_id", condition.id, { shouldValidate: true });
                            }}
                          />
                        </div>
                      </SheetContent>
                    </Sheet>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="bg-muted p-4 rounded-lg space-y-2">
              <div className="flex justify-between font-semibold">
                <span>Valor Total:</span>
                <span>{formatCurrencyBRL(calculateTotal())}</span>
              </div>
            </div>

            {installmentsPreview.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">Vencimentos das Parcelas</h3>
                    <p className="text-sm text-muted-foreground">
                      Ajuste manualmente as datas em que cada parcela deve vencer.
                    </p>
                  </div>
                  <Button type="button" variant="ghost" size="sm" onClick={resetInstallmentDates}>
                    Restaurar padrão
                  </Button>
                </div>
                <div className="space-y-3">
                  {displayedInstallments.map((installment) => (
                    <div
                      key={`installment-${installment.installmentNumber}`}
                      className="flex flex-col gap-2 rounded-lg border border-muted p-3 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <p className="font-medium">{installment.label}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatCurrencyBRL(installment.value)}
                        </p>
                      </div>
                      <div className="flex flex-col items-start gap-1 sm:flex-row sm:items-center sm:gap-3">
                        <Input
                          type="date"
                          value={installment.isoDate}
                          onChange={(event) =>
                            handleInstallmentDateChange(
                              installment.installmentNumber,
                              event.target.value,
                            )
                          }
                        />
                        <span className="text-sm text-muted-foreground">
                          {installment.dueInDays > 0
                            ? `${installment.dueInDays} dias após a compra`
                            : installment.dueInDays === 0
                              ? "Vence no dia da compra"
                              : `${Math.abs(installment.dueInDays)} dias antes da compra`}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={createOrder.isPending}>
                {createOrder.isPending ? "Salvando..." : "Criar Pedido"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
