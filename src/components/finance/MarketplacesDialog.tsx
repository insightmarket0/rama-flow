import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
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
import { Settings, Plus, Loader2, Trash2 } from "lucide-react";
import { useMarketplaces } from "@/hooks/useMarketplaces";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

const formSchema = z.object({
    label: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
    color: z.string().regex(/^#/, "Cor deve ser hexadecimal (ex: #000000)"),
    logo_url: z.string().optional(),
});

interface PresetConfig {
    label: string;
    color: string;
    logo: string;
}

const PRESETS: PresetConfig[] = [
    { label: "Mercado Livre", color: "#ffe600", logo: "/logos/mercadolivre.png" },
    { label: "Shopee", color: "#ee4d2d", logo: "/logos/shopee.png" },
    { label: "Amazon", color: "#232f3e", logo: "/logos/amazon.png" },
    { label: "Magalu", color: "#0086ff", logo: "/logos/magalu.png" },
    { label: "TikTok Shop", color: "#000000", logo: "/logos/tiktok.png" },
];

export const MarketplacesDialog = () => {
    const { marketplaces, createMarketplace, deleteMarketplace, isLoading } = useMarketplaces();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            label: "",
            color: "#000000",
            logo_url: "",
        },
    });

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        createMarketplace.mutate({
            label: values.label,
            color: values.color,
            logo_url: values.logo_url || null,
        });
        form.reset({
            label: "",
            color: "#000000",
            logo_url: "",
        });
    };

    const handleAddPreset = (preset: PresetConfig) => {
        // Check if duplicate label exists to prevent spam
        if (marketplaces.some(m => m.label.toLowerCase() === preset.label.toLowerCase())) {
            return; // Already exists
        }
        createMarketplace.mutate({
            label: preset.label,
            color: preset.color,
            logo_url: preset.logo,
        });
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" size="icon" title="Gerenciar Canais">
                    <Settings className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Gerenciar Canais de Venda</DialogTitle>
                    <DialogDescription>
                        Adicione novos marketplaces para acompanhar no dashboard.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Presets Grid */}
                    <div>
                        <h4 className="text-sm font-medium mb-3 text-muted-foreground">Adicionar Rápido</h4>
                        <div className="grid grid-cols-5 gap-3">
                            {PRESETS.map((preset) => {
                                const isAdded = marketplaces.some(m => m.label === preset.label);
                                return (
                                    <button
                                        key={preset.label}
                                        onClick={() => handleAddPreset(preset)}
                                        className={cn(
                                            "flex flex-col items-center justify-center gap-2 p-3 border rounded-xl transition-all duration-200",
                                            "hover:bg-accent hover:border-accent-foreground/20 hover:scale-105",
                                            "active:scale-95",
                                            isAdded ? "opacity-40 cursor-not-allowed bg-muted" : "bg-card shadow-sm"
                                        )}
                                        disabled={isAdded}
                                        title={isAdded ? "Já adicionado" : `Adicionar ${preset.label}`}
                                    >
                                        <div className="w-10 h-10 relative flex items-center justify-center bg-white rounded-lg p-1.5 shadow-sm overflow-hidden">
                                            <img
                                                src={preset.logo}
                                                alt={preset.label}
                                                className="object-contain w-full h-full"
                                            />
                                            {isAdded && (
                                                <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
                                                    <div className="w-full h-full bg-black/10" />
                                                </div>
                                            )}
                                        </div>
                                        <span className="text-[10px] font-medium text-center leading-tight truncate w-full">
                                            {preset.label}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="h-[1px] bg-border w-full" />

                    {/* Custom Form */}
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 bg-muted/50 p-4 rounded-lg">
                            <h4 className="text-sm font-medium mb-2">Adicionar Canal Personalizado</h4>
                            <div className="grid grid-cols-[1fr,60px] gap-2">
                                <FormField
                                    control={form.control}
                                    name="label"
                                    render={({ field }) => (
                                        <FormItem className="space-y-0">
                                            <FormControl>
                                                <Input placeholder="Nome (ex: Loja Física)" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="color"
                                    render={({ field }) => (
                                        <FormItem className="space-y-0">
                                            <FormControl>
                                                <Input type="color" className="h-10 px-1 py-1" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <Button type="submit" size="sm" className="w-full">
                                <Plus className="mr-2 h-4 w-4" /> Adicionar Personalizado
                            </Button>
                        </form>
                    </Form>

                    {/* Active List */}
                    <div className="space-y-2">
                        <h4 className="text-sm font-medium">Canais Ativos</h4>
                        <ScrollArea className="h-[200px] border rounded-md p-2">
                            {isLoading ? (
                                <div className="flex justify-center p-4">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                </div>
                            ) : marketplaces.length === 0 ? (
                                <p className="text-sm text-muted-foreground text-center py-4">
                                    Nenhum canal cadastrado.
                                </p>
                            ) : (
                                <div className="space-y-2">
                                    {marketplaces.map((m) => (
                                        <div key={m.id} className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50 bg-card border group">
                                            {/* Show Logo if available, else show color dot */}
                                            {m.logo_url ? (
                                                <div className="w-6 h-6 flex items-center justify-center">
                                                    <img src={m.logo_url} className="w-full h-full object-contain" />
                                                </div>
                                            ) : (
                                                <span className="w-4 h-4 rounded-full shadow-sm" style={{ backgroundColor: m.color }} />
                                            )}

                                            <span className="font-medium text-sm flex-1">{m.label}</span>

                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                                onClick={() => deleteMarketplace.mutate(m.id)}
                                            >
                                                <Trash2 className="h-3 w-3 text-destructive" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </ScrollArea>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
