import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Marketplace {
    id: string; // uuid
    label: string;
    color: string;
    is_active: boolean;
    logo_url?: string | null;
}

export type NewMarketplace = Omit<Marketplace, "id" | "is_active">;

export const useMarketplaces = () => {
    const queryClient = useQueryClient();

    const { data: marketplaces = [], isLoading } = useQuery({
        queryKey: ["marketplaces"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("marketplaces")
                .select("*")
                .order("created_at", { ascending: true });

            if (error) throw error;
            return data as Marketplace[];
        },
    });

    const createMarketplace = useMutation({
        mutationFn: async (newMarket: NewMarketplace) => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("User not found");

            const { data, error } = await supabase
                .from("marketplaces")
                .insert({
                    user_id: user.id,
                    label: newMarket.label,
                    color: newMarket.color,
                    logo_url: newMarket.logo_url,
                })
                .select() // Return the created item
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["marketplaces"] });
            toast.success("Canal adicionado com sucesso!");
        },
        onError: () => {
            toast.error("Erro ao adicionar canal.");
        },
    });

    const deleteMarketplace = useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase
                .from("marketplaces")
                .delete()
                .eq("id", id);

            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["marketplaces"] });
            toast.success("Canal removido com sucesso!");
        },
        onError: () => {
            toast.error("Erro ao remover canal.");
        },
    });

    // Helper to ensure default marketplaces exist (called once on mount or check)
    // Or we can just let the user add them.
    // For "Migration" of the UI, we might want to "Upsert" the defaults if the list is empty?
    // Let's implement that logic in the UI layer or a separate function here.

    return {
        marketplaces,
        isLoading,
        createMarketplace,
        deleteMarketplace,
    };
};
