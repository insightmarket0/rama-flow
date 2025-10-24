import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";
import { toast } from "sonner";

type PaymentCondition = Tables<"payment_conditions">;
type PaymentConditionInsert = TablesInsert<"payment_conditions">;
type PaymentConditionUpdate = TablesUpdate<"payment_conditions">;

export const usePaymentConditions = () => {
  const queryClient = useQueryClient();

  const { data: paymentConditions, isLoading } = useQuery({
    queryKey: ["payment_conditions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("payment_conditions")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as PaymentCondition[];
    },
  });

  const createPaymentCondition = useMutation({
    mutationFn: async (condition: Omit<PaymentConditionInsert, "user_id">) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      const { data, error } = await supabase
        .from("payment_conditions")
        .insert({ ...condition, user_id: user.id })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payment_conditions"] });
      toast.success("Condição de pagamento criada com sucesso!");
    },
    onError: (error) => {
      toast.error("Erro ao criar condição: " + error.message);
    },
  });

  const updatePaymentCondition = useMutation({
    mutationFn: async ({ id, ...updates }: PaymentConditionUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from("payment_conditions")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payment_conditions"] });
      toast.success("Condição de pagamento atualizada com sucesso!");
    },
    onError: (error) => {
      toast.error("Erro ao atualizar condição: " + error.message);
    },
  });

  const deletePaymentCondition = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("payment_conditions")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payment_conditions"] });
      toast.success("Condição de pagamento excluída com sucesso!");
    },
    onError: (error) => {
      toast.error("Erro ao excluir condição: " + error.message);
    },
  });

  return {
    paymentConditions,
    isLoading,
    createPaymentCondition,
    updatePaymentCondition,
    deletePaymentCondition,
  };
};
