import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface CriticalIndicators {
  overdueInstallments: number;
  overdueRecurringInstallments: number;
  openOrders: number;
  openQuotations: number;
}

const fetchCount = async (table: string, filters: Record<string, unknown>) => {
  let query = supabase.from(table).select("id", { count: "exact", head: true });

  for (const [column, value] of Object.entries(filters)) {
    if (Array.isArray(value)) {
      query = query.in(column, value);
    } else {
      query = query.eq(column, value);
    }
  }

  const { count, error } = await query;
  if (error) throw error;
  return count ?? 0;
};

const fetchCriticalIndicators = async (): Promise<CriticalIndicators> => {
  const [overdueInstallments, overdueRecurring, openOrders, openQuotations] = await Promise.all([
    fetchCount("installments", { status: "atrasado" }),
    fetchCount("recurring_expense_installments", { status: "atrasado" }),
    fetchCount("orders", { status: "aberto" }),
    fetchCount("quotations", { status: "aberta" }),
  ]);

  return {
    overdueInstallments,
    overdueRecurringInstallments: overdueRecurring,
    openOrders,
    openQuotations,
  };
};

export const useCriticalIndicators = () =>
  useQuery({
    queryKey: ["critical-indicators"],
    queryFn: fetchCriticalIndicators,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
