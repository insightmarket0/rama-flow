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
          recurring_expense:recurring_expenses(name, category),
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

  const markAsPaid = useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from("recurring_expense_installments")
        .update({
          status: "pago",
          paid_at: new Date().toISOString(),
        })
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

  return {
    upcomingInstallments,
    isLoading,
    markAsPaid,
  };
};
