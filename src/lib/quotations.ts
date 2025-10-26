import {
  ComparisonHighlight,
  QuotationResponseWithSupplier,
  QuotationWithResponses,
  RawQuotation,
  RawQuotationResponse,
  ResponseStatus,
} from "@/types/quotations";

const PAYMENT_PRIORITY: Record<string, number> = {
  "à vista": 0,
  "a vista": 0,
};

const parseInstallments = (cond: string) => cond.split(/[/+\s]+/).filter(Boolean).length;

export const paymentScore = (cond?: string | null) => {
  if (!cond) return 999;

  const normalized = cond.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
  if (normalized in PAYMENT_PRIORITY) {
    return PAYMENT_PRIORITY[normalized];
  }

  const parcelas = parseInstallments(cond);
  if (Number.isFinite(parcelas) && parcelas > 0) {
    return parcelas;
  }

  const numbers = cond.match(/\d+/g);
  if (numbers && numbers.length > 0) {
    return numbers.length;
  }

  return 999;
};

const eligibleForComparison = (status: ResponseStatus) =>
  status === "enviada" || status === "aprovada";

export function getHighlights(
  responses: QuotationResponseWithSupplier[],
): ComparisonHighlight {
  const eligible = responses.filter((response) => eligibleForComparison(response.status));
  if (!eligible.length) {
    return {};
  }

  const sortedByPrice = [...eligible].sort((a, b) => a.valor_total - b.valor_total);
  const sortedByLead = [...eligible].sort((a, b) => a.prazo_dias - b.prazo_dias);
  const sortedByPayment = [...eligible].sort(
    (a, b) => paymentScore(a.condicao_pagamento) - paymentScore(b.condicao_pagamento),
  );

  return {
    bestPriceId: sortedByPrice[0]?.id,
    bestLeadTimeId: sortedByLead[0]?.id,
    bestPaymentId: sortedByPayment[0]?.id,
  };
}

export const responseStatusLabel: Record<ResponseStatus, string> = {
  rascunho: "Rascunho",
  enviada: "Enviada",
  aprovada: "Aprovada",
};

export const quotationStatusLabel: Record<string, string> = {
  aberta: "Aberta",
  fechada: "Fechada",
  aprovada: "Aprovada",
};

export const normalizeQuotationResponse = (
  response: RawQuotationResponse,
): QuotationResponseWithSupplier => ({
  ...response,
  valor_total: typeof response.valor_total === "number" ? response.valor_total : Number(response.valor_total ?? 0),
  prazo_dias: typeof response.prazo_dias === "number" ? response.prazo_dias : Number(response.prazo_dias ?? 0),
  supplier: response.supplier ?? null,
});

export const normalizeQuotation = (quotation: RawQuotation): QuotationWithResponses => ({
  ...quotation,
  responses: (quotation.responses ?? []).map(normalizeQuotationResponse),
});
