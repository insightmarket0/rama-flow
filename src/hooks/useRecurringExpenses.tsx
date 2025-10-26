import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";
import { toast } from "sonner";

type RecurringExpense = Tables<"recurring_expenses"> & {
  supplier?: { id: string; name: string } | null;
};
type RecurringExpenseInsert = TablesInsert<"recurring_expenses">;
type RecurringExpenseUpdate = TablesUpdate<"recurring_expenses">;

export const useRecurringExpenses = () => {
  const queryClient = useQueryClient();

  const { data: recurringExpenses, isLoading } = useQuery({
    queryKey: ["recurring-expenses"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("recurring_expenses")
        .select(`
          *,
          supplier:suppliers(id, name)
        `)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as RecurringExpense[];
    },
  });

  const createRecurringExpense = useMutation({
    mutationFn: async (expense: Omit<RecurringExpenseInsert, "user_id">) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      const { data, error } = await supabase
        .from("recurring_expenses")
        .insert({ ...expense, user_id: user.id })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recurring-expenses"] });
      queryClient.invalidateQueries({ queryKey: ["onboarding", "progress"] });
      toast.success("Conta fixa criada com sucesso!");
    },
    onError: (error) => {
      toast.error("Erro ao criar conta fixa: " + error.message);
    },
  });

  const updateRecurringExpense = useMutation({
    mutationFn: async ({ id, ...updates }: RecurringExpenseUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from("recurring_expenses")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recurring-expenses"] });
      toast.success("Conta fixa atualizada com sucesso!");
    },
    onError: (error) => {
      toast.error("Erro ao atualizar conta fixa: " + error.message);
    },
  });

  const deleteRecurringExpense = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("recurring_expenses")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recurring-expenses"] });
      queryClient.invalidateQueries({ queryKey: ["recurring-expense-installments"] });
      toast.success("Conta fixa excluída com sucesso!");
    },
    onError: (error) => {
      toast.error("Erro ao excluir conta fixa: " + error.message);
    },
  });

  return {
    recurringExpenses,
    isLoading,
    createRecurringExpense,
    updateRecurringExpense,
    deleteRecurringExpense,
  };
};
