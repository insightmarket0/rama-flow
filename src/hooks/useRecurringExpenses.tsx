import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";
import type { PostgrestSingleResponse, PostgrestResponse } from "@supabase/supabase-js";
import { toast } from "sonner";
import { FEATURE_TAX_DESCRIPTION } from "@/lib/features";

type RecurringExpense = Tables<"recurring_expenses"> & {
  supplier?: { id: string; name: string } | null;
};
type RecurringExpenseInsert = TablesInsert<"recurring_expenses">;
type RecurringExpenseUpdate = TablesUpdate<"recurring_expenses">;

const SCHEMA_CACHE_ERROR_FRAGMENT = "schema cache";

const waitForSchemaReload = async () =>
  new Promise((resolve) => setTimeout(resolve, 1200));

const refreshSchemaCache = async () => {
  const { error } = await supabase.rpc("refresh_postgrest_schema");
  if (error) {
    console.warn("Falha ao atualizar cache do schema do PostgREST:", error);
  }
  await waitForSchemaReload();
};

type SchemaAwareResponse<T> = PostgrestSingleResponse<T> | PostgrestResponse<T>;

const executeWithSchemaRetry = async <T,>(
  operation: () => Promise<SchemaAwareResponse<T>>,
  retries = 2,
) => {
  let attempts = 0;
  let result = await operation();

  while (
    result.error &&
    result.error.message?.toLowerCase().includes(SCHEMA_CACHE_ERROR_FRAGMENT) &&
    attempts < retries
  ) {
    attempts += 1;
    await refreshSchemaCache();
    result = await operation();
  }

  return result;
};

export const useRecurringExpenses = () => {
  const queryClient = useQueryClient();

  const { data: recurringExpenses, isLoading } = useQuery({
    queryKey: ["recurring-expenses"],
    queryFn: async () => {
      const performSelect = () =>
        supabase
          .from("recurring_expenses")
          .select(`
            *,
            supplier:suppliers(id, name)
          `)
          .order("created_at", { ascending: false });
      
      const { data, error } = await executeWithSchemaRetry<RecurringExpense[]>(performSelect);

      if (error) throw error;
      return (data ?? []) as RecurringExpense[];
    },
  });

  const createRecurringExpense = useMutation({
    mutationFn: async (expense: Omit<RecurringExpenseInsert, "user_id">) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      const { tax_description, ...restExpense } = expense;
      const payload: Omit<RecurringExpenseInsert, "user_id"> = FEATURE_TAX_DESCRIPTION
        ? expense
        : restExpense;

      const performInsert = () =>
        supabase
          .from("recurring_expenses")
          .insert({ ...payload, user_id: user.id })
          .select()
          .single();

      const { data, error } = await executeWithSchemaRetry(performInsert);

      if (error) throw error;

      // Generate installments immediately so the timeline reflects the new expense
      if (data?.id) {
        try {
          await supabase.functions.invoke("generate-recurring-installments", {
            body: {
              expenseId: data.id,
              monthsAhead: 6,
              rebuildMode: "replace-upcoming",
            },
          });
        } catch (invokeError) {
          console.error("Erro ao gerar parcelas para a nova conta fixa:", invokeError);
        }
      }

      return data as RecurringExpense;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recurring-expenses"] });
      queryClient.invalidateQueries({ queryKey: ["recurring-expense-installments"] });
      queryClient.invalidateQueries({ queryKey: ["onboarding", "progress"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Conta fixa criada com sucesso!");
    },
    onError: (error) => {
      toast.error("Erro ao criar conta fixa: " + error.message);
    },
  });

  const updateRecurringExpense = useMutation({
    mutationFn: async ({ id, ...updates }: RecurringExpenseUpdate & { id: string }) => {
      const { tax_description, ...restUpdates } = updates;
      const sanitizedUpdates: RecurringExpenseUpdate = FEATURE_TAX_DESCRIPTION
        ? updates
        : (restUpdates as RecurringExpenseUpdate);

      const performUpdate = () =>
        supabase
          .from("recurring_expenses")
          .update(sanitizedUpdates)
          .eq("id", id)
          .select()
          .single();

      const { data, error } = await executeWithSchemaRetry(performUpdate);
      
      if (error) throw error;
      if (data?.id) {
        try {
          const rebuildMode = data.is_active ? "replace-upcoming" : "remove-upcoming";
          const todayISO = new Date().toISOString().split("T")[0];
          await supabase.functions.invoke("generate-recurring-installments", {
            body: {
              expenseId: data.id,
              monthsAhead: 6,
              rebuildMode,
              rebuildFrom: todayISO,
            },
          });
        } catch (invokeError) {
          console.error("Erro ao sincronizar parcelas da conta fixa:", invokeError);
        }
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recurring-expenses"] });
      queryClient.invalidateQueries({ queryKey: ["recurring-expense-installments"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
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
      try {
        await supabase
          .from("recurring_expense_installments")
          .delete()
          .eq("recurring_expense_id", id)
          .neq("status", "pago");
      } catch (cleanupError) {
        console.error("Erro ao remover parcelas da conta fixa excluída:", cleanupError);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recurring-expenses"] });
      queryClient.invalidateQueries({ queryKey: ["recurring-expense-installments"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
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
