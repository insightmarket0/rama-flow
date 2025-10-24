const BRL_CURRENCY_FORMATTER = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const BR_NUMBER_FORMATTER = new Intl.NumberFormat("pt-BR");

export const formatCurrencyBRL = (value?: number | null) => {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return BRL_CURRENCY_FORMATTER.format(0);
  }

  return BRL_CURRENCY_FORMATTER.format(value);
};

export const formatNumberBR = (value?: number | null) => {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return BR_NUMBER_FORMATTER.format(0);
  }

  return BR_NUMBER_FORMATTER.format(value);
};
