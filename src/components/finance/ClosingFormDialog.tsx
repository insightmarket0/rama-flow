import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useEffect, useMemo } from "react";
import { MonthlyClosing } from "@/types/finance";
import { Check, Calendar, DollarSign, Loader2 } from "lucide-react";
import { useMarketplaces } from "@/hooks/useMarketplaces";

interface ClosingFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initialData?: MonthlyClosing | null;
    onSave: (data: Omit<MonthlyClosing, "id" | "total">) => void;
}

export const ClosingFormDialog = ({
    open,
    onOpenChange,
    initialData,
    onSave,
}: ClosingFormDialogProps) => {
    const isEditing = !!initialData;
    const { marketplaces, isLoading: loadingMarketplaces } = useMarketplaces();

    // Dynamic Schema
    const formSchema = useMemo(() => {
        const fields: Record<string, any> = {
            month: z.string().regex(/^\d{4}-\d{2}$/, "Formato inválido (AAAA-MM)"),
        };

        // Add validation for each active marketplace
        marketplaces.forEach((market) => {
            // Use the markeplace ID as the key for validation
            fields[market.id] = z.coerce.number().min(0, "Valor deve ser positivo");
        });

        return z.object(fields);
    }, [marketplaces]);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { month: new Date().toISOString().slice(0, 7) },
    });

    // Reset/Pre-fill form
    useEffect(() => {
        if (open && marketplaces.length > 0) {
            if (initialData) {
                // Map revenues JSONB to flat form values
                const formValues: Record<string, any> = {
                    month: initialData.month,
                    ...initialData.revenues, // Map "mercadolivre": 100 directly
                };
                // Ensure all current marketplaces have a value, even if 0 (handling new ones added after record creation)
                marketplaces.forEach(m => {
                    if (formValues[m.id] === undefined) formValues[m.id] = 0;
                });

                form.reset(formValues);
            } else {
                // Init empty
                const defaultValues: Record<string, any> = {
                    month: new Date().toISOString().slice(0, 7),
                };
                marketplaces.forEach(m => {
                    defaultValues[m.id] = 0;
                });
                form.reset(defaultValues);
            }
        }
    }, [open, initialData, marketplaces, form]);

    const onSubmit = (values: Record<string, any>) => {
        // Reconstruct revenues object
        const revenues: Record<string, number> = {};

        marketplaces.forEach(market => {
            revenues[market.id] = Number(values[market.id] || 0);
        });

        onSave({
            month: values.month,
            revenues,
        });
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] border-l-4 border-l-primary">
                <DialogHeader>
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-primary/10 rounded-full">
                            <Calendar className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <DialogTitle className="text-xl">
                                {isEditing ? "Editar Fechamento" : "Novo Fechamento Mensal"}
                            </DialogTitle>
                            <DialogDescription>
                                Preencha os valores brutos faturados para o período.
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                {loadingMarketplaces ? (
                    <div className="flex justify-center p-8">
                        <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                ) : (
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="month"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-base font-semibold">
                                            Mês de Referência
                                        </FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input
                                                    type="month"
                                                    className="pl-10 h-10 text-base"
                                                    disabled={isEditing}
                                                    {...field}
                                                />
                                                <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground pointer-events-none" />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
                                {marketplaces.map((market) => (
                                    <FormField
                                        key={market.id}
                                        control={form.control}
                                        name={market.id} // Name matches the key in Zod schema
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="flex items-center gap-3 font-medium mb-2">
                                                    {market.logo_url ? (
                                                        <div className="w-8 h-8 flex items-center justify-center bg-white rounded-md p-1 shadow-sm shrink-0">
                                                            <img
                                                                src={market.logo_url}
                                                                alt={market.label}
                                                                className="w-full h-full object-contain"
                                                            />
                                                        </div>
                                                    ) : (
                                                        <div
                                                            className="h-4 w-4 rounded-full shrink-0"
                                                            style={{ backgroundColor: market.color }}
                                                        />
                                                    )}
                                                    <span className="text-base">{market.label}</span>
                                                </FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <Input
                                                            type="number"
                                                            step="0.01"
                                                            className="pl-10 h-11 text-lg font-mono"
                                                            placeholder="0,00"
                                                            {...field}
                                                        />
                                                        <DollarSign className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground pointer-events-none" />
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                ))}
                                {marketplaces.length === 0 && (
                                    <p className="text-center text-muted-foreground text-sm py-4">
                                        Nenhum canal cadastrado. Adicione canais em "Gerenciar Canais".
                                    </p>
                                )}
                            </div>

                            <DialogFooter>
                                <Button
                                    type="submit"
                                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold h-11 uppercase tracking-wider"
                                    disabled={marketplaces.length === 0}
                                >
                                    <Check className="mr-2 h-5 w-5" />
                                    {isEditing ? "Salvar Alterações" : "Salvar Fechamento"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                )}
            </DialogContent>
        </Dialog>
    );
};
