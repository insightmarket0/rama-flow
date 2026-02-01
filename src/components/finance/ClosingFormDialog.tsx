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
            <DialogContent className="sm:max-w-[500px] bg-[#0A0A0A] border-[#1F1F1F] shadow-2xl">
                <DialogHeader className="border-b border-[#1F1F1F] pb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-gradient-to-br from-green-500/20 to-green-500/5 rounded-xl border border-green-500/20 shadow-[0_0_15px_rgba(34,197,94,0.1)]">
                            <Calendar className="h-5 w-5 text-green-500" />
                        </div>
                        <div>
                            <DialogTitle className="text-xl font-bold text-white">
                                {isEditing ? "Editar Fechamento" : "Novo Fechamento"}
                            </DialogTitle>
                            <DialogDescription className="text-gray-400">
                                Preencha os valores brutos faturados para o período.
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                {loadingMarketplaces ? (
                    <div className="flex justify-center p-8">
                        <Loader2 className="h-8 w-8 animate-spin text-green-500" />
                    </div>
                ) : (
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
                            <FormField
                                control={form.control}
                                name="month"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-medium text-gray-300">
                                            Mês de Referência
                                        </FormLabel>
                                        <FormControl>
                                            <div className="relative group">
                                                <Input
                                                    type="month"
                                                    className="pl-10 h-11 bg-[#121212] border-[#2A2A2A] text-white focus:border-green-500/50 transition-all rounded-lg"
                                                    {...field}
                                                />
                                                <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-500 group-hover:text-green-500 transition-colors pointer-events-none" />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                                {marketplaces.map((market) => (
                                    <FormField
                                        key={market.id}
                                        control={form.control}
                                        name={market.id} // Name matches the key in Zod schema
                                        render={({ field }) => (
                                            <FormItem className="space-y-1.5 p-3 rounded-xl bg-[#121212] border border-[#1F1F1F] hover:border-[#2A2A2A] transition-colors">
                                                <FormLabel className="flex items-center gap-3 font-medium mb-1 cursor-pointer">
                                                    {market.logo_url ? (
                                                        <div className="w-8 h-8 flex items-center justify-center bg-white rounded-lg p-1 shadow-sm shrink-0">
                                                            <img
                                                                src={market.logo_url}
                                                                alt={market.label}
                                                                className="w-full h-full object-contain"
                                                            />
                                                        </div>
                                                    ) : (
                                                        <div
                                                            className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0 shadow-md"
                                                            style={{ backgroundColor: market.color }}
                                                        >
                                                            <DollarSign className="h-4 w-4 text-white opacity-80" />
                                                        </div>
                                                    )}
                                                    <span className="text-base text-gray-200">{market.label}</span>
                                                </FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <Input
                                                            type="number"
                                                            step="0.01"
                                                            className="pl-10 h-10 bg-[#0A0A0A] border-[#2A2A2A] text-white font-mono focus:border-green-500/30 rounded-lg text-right pr-4"
                                                            placeholder="0,00"
                                                            {...field}
                                                        />
                                                        <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-600 pointer-events-none" />
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                ))}
                                {marketplaces.length === 0 && (
                                    <div className="text-center p-6 border border-dashed border-[#2A2A2A] rounded-xl">
                                        <p className="text-gray-500 text-sm">
                                            Nenhum canal cadastrado. <br /> Adicione canais em "Gerenciar Canais".
                                        </p>
                                    </div>
                                )}
                            </div>

                            <DialogFooter>
                                <Button
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white font-bold h-11 rounded-lg uppercase tracking-wide shadow-lg shadow-green-900/20 transition-all active:scale-[0.98]"
                                    disabled={marketplaces.length === 0}
                                >
                                    <Check className="mr-2 h-5 w-5" />
                                    {isEditing ? "Salvar Alterações" : "Confirmar Fechamento"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                )}
            </DialogContent>
        </Dialog>
    );
};
