import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { toast } from "sonner";

type RecurringExpenseInstallment = Tables<"recurring_expense_installments"> & {
  recurring_expense?: { name: string; category: string } | null;
  supplier?: { name: string } | null;
};

export const useRecurringExpenseInstallments = () => {
  const queryClient = useQueryClient();

  const { data: upcomingInstallments, isLoading } = useQuery({
    queryKey: ["recurring-expense-installments", "upcoming"],
    queryFn: async () => {
      const today = new Date();
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 60);

      const { data, error } = await supabase
        .from("recurring_expense_installments")
        .select(`
          *,
          recurring_expense:recurring_expenses(name, category, amount),
          supplier:suppliers(name)

        `)
        .gte("due_date", today.toISOString().split("T")[0])
        .lte("due_date", futureDate.toISOString().split("T")[0])
        .neq("status", "pago")
        .order("due_date", { ascending: true });
      
      if (error) throw error;
      return data as RecurringExpenseInstallment[];
    },
  });

  const { data: pastInstallments } = useQuery({
    queryKey: ["recurring-expense-installments", "past"],
    queryFn: async () => {
      const today = new Date();
      const pastDate = new Date();
      pastDate.setMonth(pastDate.getMonth() - 6);

      const { data, error } = await supabase
        .from("recurring_expense_installments")
        .select('id, recurring_expense_id, value, due_date, status')
        .gte("due_date", pastDate.toISOString().split("T")[0])
        .lt("due_date", today.toISOString().split("T")[0])
        .order("due_date", { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const { data: paidInstallmentsHistory, isLoading: isLoadingHistory } = useQuery({
    queryKey: ["recurring-expense-installments", "history"],
    queryFn: async () => {
      const today = new Date();
      const pastDate = new Date();
      pastDate.setFullYear(pastDate.getFullYear() - 1); // 1 year history

      const { data, error } = await supabase
        .from("recurring_expense_installments")
        .select(`
          *,
          recurring_expense:recurring_expenses(name, category, amount),
          supplier:suppliers(name)
        `)
        .eq("status", "pago")
        .gte("paid_at", pastDate.toISOString())
        .order("paid_at", { ascending: false });
      
      if (error) throw error;
      return data as RecurringExpenseInstallment[];
    },
  });

  const markAsPaid = useMutation({
    mutationFn: async ({ id, value }: { id: string; value?: number }) => {
      const updatePayload: Record<string, unknown> = {
        status: "pago",
        paid_at: new Date().toISOString(),
      };

      if (typeof value === "number") {
        updatePayload.value = value;
      }

      const { data, error } = await supabase
        .from("recurring_expense_installments")
        .update(updatePayload)
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recurring-expense-installments"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Pagamento registrado com sucesso!");
    },
    onError: (error) => {
      toast.error("Erro ao registrar pagamento: " + error.message);
    },
  });

  const updateInstallmentValue = useMutation({
    mutationFn: async ({ id, value }: { id: string; value: number }) => {
      const { data, error } = await supabase
        .from("recurring_expense_installments")
        .update({ value, status: "pendente" })
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recurring-expense-installments"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Valor da fatura atualizado com sucesso!");

    },
    onError: (error) => {
      toast.error("Erro ao atualizar valor: " + error.message);
    },
  });

  const createInstallment = useMutation({
    mutationFn: async ({ recurring_expense_id, due_date, value }: { recurring_expense_id: string; due_date: string; value: number }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      const { data, error } = await supabase
        .from("recurring_expense_installments")
        .insert([{
          recurring_expense_id,
          due_date,
          value,
          status: "pendente",
          user_id: user.id
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recurring-expense-installments"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Nova fatura lançada com sucesso!");
    },
    onError: (error) => {
      toast.error("Erro ao lançar fatura: " + error.message);
    },
  });

  return {
    upcomingInstallments,
    pastInstallments,
    paidInstallmentsHistory,
    isLoadingHistory,
    isLoading,
    markAsPaid,
    updateInstallmentValue,
    createInstallment,
  };
};
