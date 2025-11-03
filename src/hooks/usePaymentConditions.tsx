import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";
import { toast } from "sonner";
import type { PostgrestSingleResponse } from "@supabase/supabase-js";

type PaymentCondition = Tables<"payment_conditions">;
type PaymentConditionInsert = TablesInsert<"payment_conditions">;
type PaymentConditionUpdate = TablesUpdate<"payment_conditions">;

const SCHEMA_CACHE_ERROR_FRAGMENT = "schema cache";

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
      return (data as PaymentCondition[]).map((condition) => ({
        ...condition,
        due_days: condition.due_days ? condition.due_days.map((day) => Number(day)) : null,
      }));
    },
  });

  const waitForSchemaReload = async () =>
<<<<<<< HEAD
    new Promise((resolve) => setTimeout(resolve, 400));
=======
    new Promise((resolve) => setTimeout(resolve, 1200));
>>>>>>> 5623264 (Allow manual due dates in order dialog)

  const refreshSchemaCache = async () => {
    const { error } = await supabase.rpc("refresh_postgrest_schema");
    if (error) {
<<<<<<< HEAD
      // Schema refresh é tentativa; falhas não devem quebrar o fluxo.
=======
>>>>>>> 5623264 (Allow manual due dates in order dialog)
      console.warn("Não foi possível atualizar o cache do schema:", error);
    }
    await waitForSchemaReload();
  };

<<<<<<< HEAD
=======
  const executeWithSchemaRetry = async <T,>(
    operation: () => Promise<PostgrestSingleResponse<T>>,
    retries = 2,
  ) => {
    let attempts = 0;
    let result = await operation();

    while (result.error && result.error.message?.toLowerCase().includes(SCHEMA_CACHE_ERROR_FRAGMENT) && attempts < retries) {
      attempts += 1;
      await refreshSchemaCache();
      result = await operation();
    }

    return result;
  };

>>>>>>> 5623264 (Allow manual due dates in order dialog)
  const createPaymentCondition = useMutation({
    mutationFn: async (condition: Omit<PaymentConditionInsert, "user_id">) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      const performInsert = () =>
        supabase
          .from("payment_conditions")
          .insert({ ...condition, user_id: user.id })
          .select()
          .single();

<<<<<<< HEAD
      let { data, error } = await performInsert();

      if (error && error.message?.toLowerCase().includes(SCHEMA_CACHE_ERROR_FRAGMENT)) {
        await refreshSchemaCache();
        ({ data, error } = await performInsert());
      }
=======
      const { data, error } = await executeWithSchemaRetry(performInsert);
>>>>>>> 5623264 (Allow manual due dates in order dialog)

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payment_conditions"] });
      queryClient.invalidateQueries({ queryKey: ["onboarding", "progress"] });
      toast.success("Condição de pagamento criada com sucesso!");
    },
    onError: (error) => {
      toast.error("Erro ao criar condição: " + error.message);
    },
  });

  const updatePaymentCondition = useMutation({
    mutationFn: async ({ id, ...updates }: PaymentConditionUpdate & { id: string }) => {
      const performUpdate = () =>
        supabase
          .from("payment_conditions")
          .update(updates)
          .eq("id", id)
          .select()
          .single();

<<<<<<< HEAD
      let { data, error } = await performUpdate();

      if (error && error.message?.toLowerCase().includes(SCHEMA_CACHE_ERROR_FRAGMENT)) {
        await refreshSchemaCache();
        ({ data, error } = await performUpdate());
      }
=======
      const { data, error } = await executeWithSchemaRetry(performUpdate);
>>>>>>> 5623264 (Allow manual due dates in order dialog)

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payment_conditions"] });
      queryClient.invalidateQueries({ queryKey: ["onboarding", "progress"] });
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
      queryClient.invalidateQueries({ queryKey: ["onboarding", "progress"] });
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
