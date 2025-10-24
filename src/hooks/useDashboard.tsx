import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { addWeeks, differenceInCalendarDays, format, parseISO, startOfDay, startOfWeek, endOfWeek } from "date-fns";
import { InstallmentWithRelations, InstallmentStatus } from "@/hooks/useInstallments";

interface WeeklyInstallmentData {
  label: string;
  range: string;
  total: number;
}

interface DashboardMetrics {
  upcoming30DaysTotal: number;
  overdueCount: number;
  openOrdersCount: number;
  activeSuppliersCount: number;
}

interface DashboardData {
  metrics: DashboardMetrics;
  chartData: WeeklyInstallmentData[];
  upcomingInstallments: InstallmentWithRelations[];
}

const WEEKS_TO_DISPLAY = 6;

const normalizeInstallmentStatus = (
  installment: Tables<"installments">,
  todayISO: string,
): InstallmentStatus => {
  const status = (installment.status as InstallmentStatus | null) ?? "pendente";

  if (status === "pago") {
    return "pago";
  }

  if (installment.due_date < todayISO) {
    return "atrasado";
  }

  return status === "atrasado" ? "atrasado" : "pendente";
};

export const useDashboard = () => {
  const query = useQuery<DashboardData>({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const now = new Date();
      const todayISO = now.toISOString().split("T")[0];
      const todayStart = startOfDay(now);

      const { error: overdueError } = await supabase
        .from("installments")
        .update({
          status: "atrasado",
          updated_at: new Date().toISOString(),
        })
        .lt("due_date", todayISO)
        .eq("status", "pendente");

      if (overdueError) {
        throw overdueError;
      }

      const { data: installmentsData, error: installmentsError } = await supabase
        .from("installments")
        .select(`
          *,
          supplier:suppliers(name),
          order:orders(order_number)
        `)
        .order("due_date", { ascending: true });

      if (installmentsError) {
        throw installmentsError;
      }

      const installments: InstallmentWithRelations[] = (installmentsData || []).map(
        (installment) =>
          ({
            ...installment,
            status: normalizeInstallmentStatus(installment, todayISO),
          }) as InstallmentWithRelations,
      );

      const upcoming30DaysTotal = installments.reduce((total, installment) => {
        if (installment.status !== "pendente") {
          return total;
        }

        const dueDate = parseISO(installment.due_date);
        const diff = differenceInCalendarDays(dueDate, todayStart);

        if (diff >= 0 && diff <= 30) {
          return total + installment.value;
        }

        return total;
      }, 0);

      const overdueCount = installments.filter(
        (installment) => installment.status === "atrasado",
      ).length;

      const weeklyChartData: WeeklyInstallmentData[] = Array.from(
        { length: WEEKS_TO_DISPLAY },
        (_, index) => {
          const weekStart = startOfWeek(addWeeks(todayStart, index), { weekStartsOn: 1 });
          const weekEnd = endOfWeek(addWeeks(todayStart, index), { weekStartsOn: 1 });

          const total = installments.reduce((sum, installment) => {
            if (installment.status === "pago") {
              return sum;
            }

            const dueDate = parseISO(installment.due_date);

            if (dueDate >= weekStart && dueDate <= weekEnd) {
              return sum + installment.value;
            }

            return sum;
          }, 0);

          return {
            label: format(weekStart, "dd/MM"),
            range: `${format(weekStart, "dd/MM")} - ${format(weekEnd, "dd/MM")}`,
            total,
          };
        },
      );

      const upcomingInstallments = installments
        .filter((installment) => installment.status !== "pago")
        .sort(
          (a, b) =>
            parseISO(a.due_date).getTime() - parseISO(b.due_date).getTime(),
        )
        .slice(0, 5);

      const { count: openOrdersCount, error: openOrdersError } = await supabase
        .from("orders")
        .select("id", { count: "exact", head: true })
        .eq("status", "aberto");

      if (openOrdersError) {
        throw openOrdersError;
      }

      const { count: activeSuppliersCount, error: suppliersError } = await supabase
        .from("suppliers")
        .select("id", { count: "exact", head: true });

      if (suppliersError) {
        throw suppliersError;
      }

      return {
        metrics: {
          upcoming30DaysTotal,
          overdueCount,
          openOrdersCount: openOrdersCount ?? 0,
          activeSuppliersCount: activeSuppliersCount ?? 0,
        },
        chartData: weeklyChartData,
        upcomingInstallments,
      };
    },
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
};
