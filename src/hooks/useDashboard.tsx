import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import {
  addWeeks,
  differenceInCalendarDays,
  endOfMonth,
  endOfWeek,
  format,
  parseISO,
  startOfDay,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { InstallmentWithRelations, InstallmentStatus } from "@/hooks/useInstallments";

interface WeeklyInstallmentData {
  label: string;
  range: string;
  variaveis: number;
  fixas: number;
}

interface DashboardMetrics {
  upcomingVariable30DaysTotal: number;
  recurringMonthlyTotal: number;
  cashProjectionNext30Days: number;
  overdueCount: number;
  openOrdersCount: number;
  activeSuppliersCount: number;
}

interface DashboardData {
  metrics: DashboardMetrics;
  variableVsFixedChart: WeeklyInstallmentData[];
  upcomingInstallments: InstallmentWithRelations[];
}

const WEEKS_TO_DISPLAY = 6;

type RecurringInstallmentRow = Tables<"recurring_expense_installments"> & {
  recurring_expense?: { name: string; category: string } | null;
};

type RecurringInstallmentWithRelations = Omit<RecurringInstallmentRow, "status"> & {
  status: InstallmentStatus;
};

const normalizeInstallmentStatus = (
  installment: { due_date: string; status: string | null },
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
      const monthStart = startOfMonth(todayStart);
      const monthEnd = endOfMonth(todayStart);

      const { error: overdueInstallmentsError } = await supabase
        .from("installments")
        .update({
          status: "atrasado",
          updated_at: new Date().toISOString(),
        })
        .lt("due_date", todayISO)
        .eq("status", "pendente");

      if (overdueInstallmentsError) {
        throw overdueInstallmentsError;
      }

      const { error: overdueRecurringError } = await supabase
        .from("recurring_expense_installments")
        .update({
          status: "atrasado",
          updated_at: new Date().toISOString(),
        })
        .lt("due_date", todayISO)
        .eq("status", "pendente");

      if (overdueRecurringError) {
        throw overdueRecurringError;
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

      const { data: recurringInstallmentsData, error: recurringInstallmentsError } = await supabase
        .from("recurring_expense_installments")
        .select(`
          *,
          recurring_expense:recurring_expenses(name, category)
        `)
        .order("due_date", { ascending: true });

      if (recurringInstallmentsError) {
        throw recurringInstallmentsError;
      }

      const recurringInstallments: RecurringInstallmentWithRelations[] = (
        (recurringInstallmentsData ?? []) as RecurringInstallmentRow[]
      ).map(
        (installment) =>
          ({
            ...installment,
            status: normalizeInstallmentStatus(installment, todayISO),
          }) as RecurringInstallmentWithRelations,
      );

      const upcomingVariable30DaysTotal = installments.reduce((total, installment) => {
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

      const recurringNext30DaysTotal = recurringInstallments.reduce((total, installment) => {
        if (installment.status === "pago") {
          return total;
        }

        const dueDate = parseISO(installment.due_date);
        const diff = differenceInCalendarDays(dueDate, todayStart);

        if (diff >= 0 && diff <= 30) {
          return total + Number(installment.value);
        }

        return total;
      }, 0);

      const recurringMonthlyTotal = recurringInstallments.reduce((total, installment) => {
        if (installment.status === "pago") {
          return total;
        }

        const dueDate = parseISO(installment.due_date);

        if (dueDate >= monthStart && dueDate <= monthEnd) {
          return total + Number(installment.value);
        }

        return total;
      }, 0);

      const cashProjectionNext30Days = upcomingVariable30DaysTotal + recurringNext30DaysTotal;

      const overdueCount = installments.filter(
        (installment) => installment.status === "atrasado",
      ).length;

      const weeklyChartData: WeeklyInstallmentData[] = Array.from(
        { length: WEEKS_TO_DISPLAY },
        (_, index) => {
          const weekStart = startOfWeek(addWeeks(todayStart, index), { weekStartsOn: 1 });
          const weekEnd = endOfWeek(addWeeks(todayStart, index), { weekStartsOn: 1 });

          const variaveis = installments.reduce((sum, installment) => {
            if (installment.status === "pago") {
              return sum;
            }

            const dueDate = parseISO(installment.due_date);

            if (dueDate >= weekStart && dueDate <= weekEnd) {
              return sum + installment.value;
            }

            return sum;
          }, 0);

          const fixas = recurringInstallments.reduce((sum, installment) => {
            if (installment.status === "pago") {
              return sum;
            }

            const dueDate = parseISO(installment.due_date);

            if (dueDate >= weekStart && dueDate <= weekEnd) {
              return sum + Number(installment.value);
            }

            return sum;
          }, 0);

          return {
            label: format(weekStart, "dd/MM"),
            range: `${format(weekStart, "dd/MM")} - ${format(weekEnd, "dd/MM")}`,
            variaveis,
            fixas,
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
          upcomingVariable30DaysTotal,
          recurringMonthlyTotal,
          cashProjectionNext30Days,
          overdueCount,
          openOrdersCount: openOrdersCount ?? 0,
          activeSuppliersCount: activeSuppliersCount ?? 0,
        },
        variableVsFixedChart: weeklyChartData,
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
