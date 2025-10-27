import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

interface OnboardingCounts {
  suppliers: number;
  paymentConditions: number;
  orders: number;
  recurringExpenses: number;
}

const fetchOnboardingCounts = async (userId: string): Promise<OnboardingCounts> => {
  const headOptions = { count: "exact", head: true } as const;

  const [
    { count: suppliersCount, error: suppliersError },
    { count: conditionsCount, error: conditionsError },
    { count: ordersCount, error: ordersError },
    { count: recurringExpensesCount, error: recurringExpensesError },
  ] = await Promise.all([
    supabase
      .from("suppliers")
      .select("id", headOptions)
      .eq("user_id", userId),
    supabase
      .from("payment_conditions")
      .select("id", headOptions)
      .eq("user_id", userId),
    supabase
      .from("orders")
      .select("id", headOptions)
      .eq("user_id", userId),
    supabase
      .from("recurring_expenses")
      .select("id", headOptions)
      .eq("user_id", userId),
  ]);

  if (suppliersError) throw suppliersError;
  if (conditionsError) throw conditionsError;
  if (ordersError) throw ordersError;
  if (recurringExpensesError) throw recurringExpensesError;

  return {
    suppliers: suppliersCount ?? 0,
    paymentConditions: conditionsCount ?? 0,
    orders: ordersCount ?? 0,
    recurringExpenses: recurringExpensesCount ?? 0,
  };
};

export const useOnboardingProgress = () => {
  const { user } = useAuth();

  const query = useQuery({
    queryKey: ["onboarding", "progress", user?.id],
    queryFn: () => fetchOnboardingCounts(user!.id),
    enabled: Boolean(user?.id),
    staleTime: 15_000,
  });

  const counts = useMemo<OnboardingCounts>(
    () => ({
      suppliers: query.data?.suppliers ?? 0,
      paymentConditions: query.data?.paymentConditions ?? 0,
      orders: query.data?.orders ?? 0,
      recurringExpenses: query.data?.recurringExpenses ?? 0,
    }),
    [query.data],
  );

  return {
    ...query,
    counts,
  };
};
