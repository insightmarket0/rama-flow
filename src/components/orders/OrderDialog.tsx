import { useEffect, useState } from "react";
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

const orderSchema = z.object({
  supplier_id: z.string().min(1, "Selecione um fornecedor"),
  payment_condition_id: z.string().min(1, "Selecione uma condição"),
  freight: z.number().or(z.string()).transform((val) => typeof val === 'string' ? parseFloat(val) || 0 : val),
  discount: z.number().or(z.string()).transform((val) => typeof val === 'string' ? parseFloat(val) || 0 : val),
});

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

  const { createOrder } = useOrders();
  const { suppliers } = useSuppliers();
  const { paymentConditions } = usePaymentConditions();

  const form = useForm<z.infer<typeof orderSchema>>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      supplier_id: "",
      payment_condition_id: "",
      freight: 0,
      discount: 0,
    },
  });

  useEffect(() => {
    if (!enableGlobalOpen || typeof window === "undefined") {
      return;
    }

    const handleOpen = () => {
      setOpen(true);
    };

    window.addEventListener(OPEN_ORDER_DIALOG_EVENT, handleOpen);
    return () => window.removeEventListener(OPEN_ORDER_DIALOG_EVENT, handleOpen);
  }, [enableGlobalOpen]);

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
    return itemsTotal + freight - discount;
  };

  const calculateInstallmentsPreview = () => {
    const total = calculateTotal();
    const conditionId = form.watch("payment_condition_id");
    const condition = paymentConditions?.find((c) => c.id === conditionId);

    if (!condition || total <= 0) return [];

    const preview = [];
    const downPayment = (total * condition.down_payment_percent) / 100;
    const remainingValue = total - downPayment;
    const installmentValue = remainingValue / condition.installments;

    if (downPayment > 0) {
      preview.push({
        number: "Entrada",
        value: downPayment,
        date: new Date().toLocaleDateString("pt-BR"),
      });
    }

    for (let i = 1; i <= condition.installments; i++) {
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + i * condition.interval_days);
      preview.push({
        number: i,
        value: installmentValue,
        date: dueDate.toLocaleDateString("pt-BR"),
      });
    }

    return preview;
  };

  const onSubmit = async (values: z.infer<typeof orderSchema>) => {
    if (items.length === 0) {
      form.setError("supplier_id", {
        message: "Adicione pelo menos um item ao pedido",
      });
      return;
    }

    await createOrder.mutateAsync({
      supplier_id: values.supplier_id,
      payment_condition_id: values.payment_condition_id,
      items,
      freight: values.freight,
      discount: values.discount,
    });

    setOpen(false);
    form.reset();
    setItems([]);
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
            <div className="grid grid-cols-2 gap-4">
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
                name="payment_condition_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Condição de Pagamento</FormLabel>
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
                        {paymentConditions?.map((condition) => (
                          <SelectItem key={condition.id} value={condition.id}>
                            {condition.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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

            <div className="grid grid-cols-2 gap-4">
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

            <div className="bg-muted p-4 rounded-lg space-y-2">
              <div className="flex justify-between font-semibold">
                <span>Valor Total:</span>
                <span>{formatCurrencyBRL(calculateTotal())}</span>
              </div>
            </div>

            {calculateInstallmentsPreview().length > 0 && (
              <div className="space-y-2">
                <h3 className="font-semibold">Prévia das Parcelas</h3>
                <div className="bg-muted p-4 rounded-lg space-y-2">
                  {calculateInstallmentsPreview().map((inst, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>
                        {inst.number === "Entrada"
                          ? "Entrada"
                          : `Parcela ${inst.number}`}
                      </span>
                      <span>{formatCurrencyBRL(inst.value)}</span>
                      <span>{inst.date}</span>
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
