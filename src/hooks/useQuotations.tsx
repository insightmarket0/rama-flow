import { useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { getAuthenticatedUserId } from "@/lib/auth";
import { normalizeQuotation } from "@/lib/quotations";
import {
  CreateQuotationInput,
  QuotationFilters,
  QuotationListItem,
  QuotationStatus,
  QuotationWithResponses,
  RawQuotation,
  UpdateQuotationInput,
} from "@/types/quotations";

const buildListItem = (quotation: QuotationWithResponses): QuotationListItem => {
  const responses = quotation.responses ?? [];
  const activeResponses = responses.filter((response) => response.status !== "rascunho");
  const bestOffer =
    activeResponses.length > 0
      ? activeResponses.reduce((acc, response) => Math.min(acc, response.valor_total), Number.POSITIVE_INFINITY)
      : null;
  const approved = responses.find((response) => response.status === "aprovada");

  return {
    ...quotation,
    responsesCount: responses.length,
    bestOfferValue: bestOffer === Number.POSITIVE_INFINITY ? null : bestOffer,
    approvedResponseId: approved?.id ?? null,
  };
};

const buildFiltersKey = (filters?: QuotationFilters) => [
  filters?.status ?? "todos",
  filters?.startDate ?? null,
  filters?.endDate ?? null,
];

export const useQuotations = (filters?: QuotationFilters) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["quotations", ...buildFiltersKey(filters)],
    queryFn: async () => {
      let query = supabase
        .from("quotations")
        .select(
          `
            *,
            responses:quotation_responses (
              *,
              supplier:suppliers(id, name)
            )
          `,
        )
        .order("created_at", { ascending: false });

      if (filters?.status && filters.status !== "todos") {
        query = query.eq("status", filters.status);
      }
      if (filters?.startDate) {
        query = query.gte("created_at", filters.startDate);
      }
      if (filters?.endDate) {
        query = query.lte("created_at", filters.endDate);
      }

      const { data: quotations, error } = await query;
      if (error) throw error;

      return (quotations as RawQuotation[]).map(normalizeQuotation);
    },
  });

  const quotations = useMemo(
    () => (data ?? []).map(buildListItem),
    [data],
  );

  const createQuotation = useMutation({
    mutationFn: async (payload: CreateQuotationInput) => {
      const userId = await getAuthenticatedUserId();
      const { data: quotation, error } = await supabase
        .from("quotations")
        .insert([
          {
            user_id: userId,
            titulo: payload.titulo,
            descricao: payload.descricao ?? null,
            data_limite: payload.data_limite ?? null,
            organization_id: payload.organization_id ?? null,
            status: "aberta",
          },
        ])
        .select("*")
        .single();

      if (error) throw error;
      return normalizeQuotation(quotation as unknown as RawQuotation);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quotations"] });
      toast({
        title: "Cotação criada com sucesso!",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao criar cotação",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateQuotation = useMutation({
    mutationFn: async ({ id, ...updates }: UpdateQuotationInput) => {
      const userId = await getAuthenticatedUserId();
      const { error } = await supabase
        .from("quotations")
        .update({
          titulo: updates.titulo,
          descricao: updates.descricao,
          data_limite: updates.data_limite,
          organization_id: updates.organization_id,
        })
        .eq("id", id)
        .eq("user_id", userId);

      if (error) throw error;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["quotations"] });
      queryClient.invalidateQueries({ queryKey: ["quotation", id] });
      toast({
        title: "Cotação atualizada!",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao atualizar cotação",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateQuotationStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: QuotationStatus }) => {
      const userId = await getAuthenticatedUserId();
      const { error } = await supabase
        .from("quotations")
        .update({ status })
        .eq("id", id)
        .eq("user_id", userId);

      if (error) throw error;
    },
    onSuccess: (_, { id, status }) => {
      queryClient.invalidateQueries({ queryKey: ["quotations"] });
      queryClient.invalidateQueries({ queryKey: ["quotation", id] });
      toast({
        title: "Status da cotação atualizado!",
        description: `Novo status: ${status}`,
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao atualizar status",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    quotations,
    isLoading,
    isFetching,
    createQuotation,
    updateQuotation,
    updateQuotationStatus,
  };
};

export const useQuotationDetail = (quotationId?: string) => {
  return useQuery({
    queryKey: ["quotation", quotationId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("quotations")
        .select(
          `
            *,
            responses:quotation_responses (
              *,
              supplier:suppliers(id, name)
            )
          `,
        )
        .eq("id", quotationId)
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      if (!data) return null;

      return normalizeQuotation(data as unknown as RawQuotation);
    },
    enabled: Boolean(quotationId),
  });
};
