import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";
import type { PostgrestSingleResponse, PostgrestResponse } from "@supabase/supabase-js";
import { toast } from "sonner";
import { generateSmartContractInstallments } from "@/lib/installments";
import { FEATURE_TAX_DESCRIPTION } from "@/lib/features";

type SmartContract = Tables<"smart_contracts"> & {
  supplier?: { id: string; name: string } | null;
};
type SmartContractInsert = TablesInsert<"smart_contracts">;
type SmartContractUpdate = TablesUpdate<"smart_contracts">;

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

export const useSmartContracts = () => {
  const queryClient = useQueryClient();

  const { data: smartContracts, isLoading } = useQuery({
    queryKey: ["smart-contracts"],
    queryFn: async () => {
      const performSelect = () =>
        supabase
          .from("smart_contracts")
          .select(`*`)
          .order("created_at", { ascending: false });
      
      const { data, error } = await executeWithSchemaRetry<SmartContract[]>(performSelect);

      if (error) throw error;
      return (data ?? []) as SmartContract[];
    },
  });

  const createSmartContract = useMutation({
    mutationFn: async (expense: Omit<SmartContractInsert, "user_id">) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      const payload: Omit<SmartContractInsert, "user_id"> = expense;

      const performInsert = () =>
        supabase
          .from("smart_contracts")
          .insert({ ...payload, user_id: user.id })
          .select()
          .single();

      const { data, error } = await executeWithSchemaRetry(performInsert);

      if (error) throw error;

      // Generate installments immediately so the timeline reflects the new expense
      // Apenas se NÃO for esporádico (pois esporádicos são manuais)
      if (data?.id && payload.recurrence_type !== "esporadico") {
        try {
          await generateSmartContractInstallments({
            expenseId: data.id,
            monthsAhead: 6,
            rebuildMode: "replace-upcoming",
          });
        } catch (invokeError) {
          console.error("Erro ao gerar parcelas para a nova conta fixa:", invokeError);
        }
      }

      return data as SmartContract;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["smart-contracts"] });
      queryClient.invalidateQueries({ queryKey: ["smart-contract-installments"] });
      queryClient.invalidateQueries({ queryKey: ["onboarding", "progress"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Conta fixa criada com sucesso!");
    },
    onError: (error) => {
      toast.error("Erro ao criar conta fixa: " + error.message);
    },
  });

  const updateSmartContract = useMutation({
    mutationFn: async ({ id, ...updates }: SmartContractUpdate & { id: string }) => {
      const sanitizedUpdates: SmartContractUpdate = updates;

      const performUpdate = () =>
        supabase
          .from("smart_contracts")
          .update(sanitizedUpdates)
          .eq("id", id)
          .select()
          .single();

      const { data, error } = await executeWithSchemaRetry(performUpdate);
      
      if (error) throw error;
      if (data?.id && data.recurrence_type !== "esporadico") {
        try {
          const rebuildMode = data.is_active ? "replace-upcoming" : "remove-upcoming";
          const todayISO = new Date().toISOString().split("T")[0];
          await generateSmartContractInstallments({
            expenseId: data.id,
            monthsAhead: 6,
            rebuildMode,
            rebuildFrom: todayISO,
          });
        } catch (invokeError) {
          console.error("Erro ao sincronizar parcelas da conta fixa:", invokeError);
        }
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["smart-contracts"] });
      queryClient.invalidateQueries({ queryKey: ["smart-contract-installments"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Conta fixa atualizada com sucesso!");
    },
    onError: (error) => {
      toast.error("Erro ao atualizar conta fixa: " + error.message);
    },
  });

  const deleteSmartContract = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("smart_contracts")
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
      queryClient.invalidateQueries({ queryKey: ["smart-contracts"] });
      queryClient.invalidateQueries({ queryKey: ["smart-contract-installments"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Conta fixa excluída com sucesso!");
    },
    onError: (error) => {
      toast.error("Erro ao excluir conta fixa: " + error.message);
    },
  });

  return {
    smartContracts,
    isLoading,
    createSmartContract,
    updateSmartContract,
    deleteSmartContract,
  };
};
