import { Tables } from "@/integrations/supabase/types";

export type QuotationStatus = "aberta" | "fechada" | "aprovada";
export type ResponseStatus = "rascunho" | "enviada" | "aprovada";

export type Quotation = Tables<"quotations">;
export type QuotationResponse = Tables<"quotation_responses">;

export interface QuotationResponseWithSupplier extends QuotationResponse {
  supplier?: Pick<Tables<"suppliers">, "id" | "name"> | null;
}

export interface QuotationWithResponses extends Quotation {
  responses?: QuotationResponseWithSupplier[];
}

export type RawQuotationResponse = Tables<"quotation_responses"> & {
  supplier: Pick<Tables<"suppliers">, "id" | "name"> | null;
};

export type RawQuotation = Tables<"quotations"> & {
  responses: RawQuotationResponse[] | null;
};

export interface QuotationListItem extends QuotationWithResponses {
  responsesCount: number;
  approvedResponseId?: string | null;
  bestOfferValue?: number | null;
}

export type ComparisonHighlight = {
  bestPriceId?: string;
  bestLeadTimeId?: string;
  bestPaymentId?: string;
};

export interface QuotationFilters {
  status?: QuotationStatus | "todos";
  startDate?: string;
  endDate?: string;
}

export type CreateQuotationInput = Pick<Quotation, "titulo"> & {
  descricao?: string | null;
  data_limite?: string | null;
  organization_id?: string | null;
};

export type UpdateQuotationInput = Partial<CreateQuotationInput> & {
  id: string;
};

export interface UpsertQuotationResponseInput {
  id?: string;
  quotation_id: string;
  fornecedor_id: string;
  valor_total: number;
  prazo_dias: number;
  condicao_pagamento?: string | null;
  observacao?: string | null;
  status: ResponseStatus;
}

export interface ApproveQuotationPayload {
  responseId: string;
  observacao?: string | null;
}
