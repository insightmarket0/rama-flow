import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
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
import { useOrders, OrderItem, Order } from "@/hooks/useOrders";
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
import { formatCurrencyBRL } from "@/lib/format";

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

const editOrderSchema = z.object({
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

interface EditOrderDialogProps {
    order: Order | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function EditOrderDialog({ order, open, onOpenChange }: EditOrderDialogProps) {
    const [items, setItems] = useState<OrderItem[]>([]);
    const [currentItem, setCurrentItem] = useState({
        sku: "",
        description: "",
        quantity: "",
        unit_price: "",
    });

    const { updateOrder } = useOrders();
    const { suppliers } = useSuppliers();
    const { paymentConditions } = usePaymentConditions();

    const form = useForm<z.infer<typeof editOrderSchema>>({
        resolver: zodResolver(editOrderSchema),
        defaultValues: {
            supplier_id: "",
            order_number: "",
            invoice_number: "",
            payment_condition_id: "",
            freight: 0,
            discount: 0,
            taxes: 0,
            order_date: new Date().toISOString().split("T")[0],
        },
    });

    useEffect(() => {
        if (order && open) {
            form.reset({
                supplier_id: order.supplier_id || "",
                order_number: order.order_number || "",
                invoice_number: order.invoice_number || "",
                payment_condition_id: order.payment_condition_id || "",
                freight: order.freight || 0,
                discount: order.discount || 0,
                taxes: order.taxes || 0,
                order_date: order.order_date || new Date().toISOString().split("T")[0],
            });
            setItems(order.items || []);
        }
    }, [order, open, form]);

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

    const onSubmit = async (values: z.infer<typeof editOrderSchema>) => {
        if (!order) return;
        if (items.length === 0) {
            form.setError("supplier_id", {
                message: "Adicione pelo menos um item ao pedido",
            });
            return;
        }

        await updateOrder.mutateAsync({
            id: order.id,
            supplier_id: values.supplier_id,
            payment_condition_id: values.payment_condition_id,
            order_number: values.order_number,
            invoice_number: values.invoice_number,
            items,
            freight: values.freight,
            discount: values.discount,
            taxes: values.taxes,
            order_date: values.order_date,
        });

        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Visualizar e Editar Pedido: {order?.order_number}</DialogTitle>
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
                                            value={field.value}
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
                                            <Input placeholder="Digite o número (opcional)" {...field} value={field.value ?? ""} disabled />
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
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
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

                        <div className="bg-muted p-4 rounded-lg space-y-2">
                            <div className="flex justify-between font-semibold">
                                <span>Valor Total:</span>
                                <span>{formatCurrencyBRL(calculateTotal())}</span>
                            </div>
                        </div>

                        <div className="flex justify-end gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                            >
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={updateOrder.isPending}>
                                {updateOrder.isPending ? "Salvando..." : "Salvar Alterações"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
