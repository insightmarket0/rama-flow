import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { getAuthenticatedUserId } from "@/lib/auth";
import { normalizeQuotationResponse } from "@/lib/quotations";
import {
  ApproveQuotationPayload,
  RawQuotationResponse,
  ResponseStatus,
  UpsertQuotationResponseInput,
} from "@/types/quotations";

export const useQuotationResponses = (quotationId: string | null) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const friendly = (e: unknown) => {
    const msg = typeof e === "object" && e && "message" in e ? String((e as any).message) : String(e);
    if (msg.includes("Could not find the table 'public.quotation_responses'")) {
      return "Tabela de respostas não encontrada. Aplique as migrações e reabra o app.";
    }
    if (msg.toLowerCase().includes("schema cache")) {
      return "Schema do PostgREST desatualizado. Aplique migrações e reabra o preview.";
    }
    return msg;
  };

  const { data, isLoading } = useQuery({
    queryKey: ["quotation-responses", quotationId],
    queryFn: async () => {
      const { data: responses, error } = await supabase
        .from("quotation_responses")
        .select(
          `
            *,
            supplier:suppliers(id, name)
          `,
        )
        .eq("quotation_id", quotationId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      return (responses as RawQuotationResponse[]).map(normalizeQuotationResponse);
    },
    enabled: Boolean(quotationId),
  });

  const invalidateQuotationQueries = (id?: string | null) => {
    queryClient.invalidateQueries({ queryKey: ["quotations"] });
    if (!id) return;
    queryClient.invalidateQueries({ queryKey: ["quotation-responses", id] });
    queryClient.invalidateQueries({ queryKey: ["quotation", id] });
  };

  const upsertResponse = useMutation({
    mutationFn: async (payload: UpsertQuotationResponseInput) => {
      const userId = await getAuthenticatedUserId();
      const basePayload = {
        quotation_id: payload.quotation_id,
        fornecedor_id: payload.fornecedor_id,
        valor_total: payload.valor_total,
        prazo_dias: payload.prazo_dias,
        condicao_pagamento: payload.condicao_pagamento ?? null,
        observacao: payload.observacao ?? null,
        status: payload.status,
      };

      if (payload.id) {
        const { error } = await supabase
          .from("quotation_responses")
          .update(basePayload)
          .eq("id", payload.id)
          .eq("user_id", userId);

        if (error) throw error;
        return payload.id;
      }

      const { data: response, error } = await supabase
        .from("quotation_responses")
        .insert([
          {
            ...basePayload,
            user_id: userId,
          },
        ])
        .select("*")
        .single();

      if (error) throw error;
      return response.id as string;
    },
    onSuccess: (_, { quotation_id }) => {
      invalidateQuotationQueries(quotation_id);
      toast({
        title: "Resposta salva!",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao salvar resposta",
        description: friendly(error),
        variant: "destructive",
      });
    },
  });

  const deleteResponse = useMutation({
    mutationFn: async (responseId: string) => {
      const userId = await getAuthenticatedUserId();
      const { error } = await supabase
        .from("quotation_responses")
        .delete()
        .eq("id", responseId)
        .eq("user_id", userId);

      if (error) throw error;
    },
    onSuccess: () => {
      invalidateQuotationQueries(quotationId);
      toast({
        title: "Resposta removida!",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao remover resposta",
        description: friendly(error),
        variant: "destructive",
      });
    },
  });

  const approveResponse = useMutation({
    mutationFn: async ({ responseId, observacao }: ApproveQuotationPayload) => {
      const { error } = await supabase.rpc("approve_quotation_response", {
        p_response_id: responseId,
        p_observacao: observacao ?? null,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      invalidateQuotationQueries(quotationId);
      toast({
        title: "Cotação aprovada!",
        description: "Fornecedor selecionado como vencedor.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao aprovar fornecedor",
        description: friendly(error),
        variant: "destructive",
      });
    },
  });

  const updateResponseStatus = useMutation({
    mutationFn: async ({ responseId, status }: { responseId: string; status: ResponseStatus }) => {
      const userId = await getAuthenticatedUserId();
      const { error } = await supabase
        .from("quotation_responses")
        .update({ status })
        .eq("id", responseId)
        .eq("user_id", userId);

      if (error) throw error;
    },
    onSuccess: () => {
      invalidateQuotationQueries(quotationId);
      toast({
        title: "Status da resposta atualizado!",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao atualizar status",
        description: friendly(error),
        variant: "destructive",
      });
    },
  });

  return {
    responses: data ?? [],
    isLoading,
    upsertResponse,
    deleteResponse,
    approveResponse,
    updateResponseStatus,
  };
};
