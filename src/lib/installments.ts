import { Tables } from "@/integrations/supabase/types";

export interface InstallmentPlanItem {
  installmentNumber: number;
  value: number;
  dueDate: Date;
  dueInDays: number;
  isDownPayment: boolean;
}

const roundToCents = (value: number) =>
  Math.round((value + Number.EPSILON) * 100) / 100;

const clampPercent = (value?: number | null) => {
  if (value === null || value === undefined) return 0;
  if (value < 0) return 0;
  if (value > 100) return 100;
  return value;
};

export const generateInstallmentPlan = (
  total: number,
  condition: Tables<"payment_conditions">,
  baseDate = new Date(),
): InstallmentPlanItem[] => {
  if (!Number.isFinite(total) || total <= 0) {
    return [];
  }

  const plan: InstallmentPlanItem[] = [];
  const downPaymentPercent = clampPercent(condition.down_payment_percent);
  const downPaymentValue = roundToCents((total * downPaymentPercent) / 100);
  let remainingValue = roundToCents(total - downPaymentValue);
  if (remainingValue < 0) {
    remainingValue = 0;
  }

  if (downPaymentValue > 0) {
    plan.push({
      installmentNumber: 0,
      value: downPaymentValue,
      dueDate: new Date(baseDate),
      dueInDays: 0,
      isDownPayment: true,
    });
  }

  const customDays =
    condition.due_days && condition.due_days.length > 0
      ? condition.due_days
          .map((day) => Number(day))
          .filter((day) => Number.isFinite(day) && day >= 0)
          .sort((a, b) => a - b)
      : null;

  const installmentDays =
    customDays ??
    Array.from({ length: Math.max(condition.installments ?? 0, 0) }, (_, idx) =>
      (idx + 1) * (condition.interval_days ?? 0),
    );

  const installmentsCount = installmentDays.length;
  if (installmentsCount === 0 || remainingValue <= 0) {
    return plan;
  }

  const installmentValues: number[] = [];
  const baseInstallment = roundToCents(remainingValue / installmentsCount);
  let accumulated = 0;

  for (let i = 0; i < installmentsCount - 1; i++) {
    installmentValues.push(baseInstallment);
    accumulated += baseInstallment;
  }

  const lastValue = roundToCents(remainingValue - accumulated);
  installmentValues.push(lastValue);

  installmentDays.forEach((days, index) => {
    const dueDate = new Date(baseDate);
    dueDate.setDate(dueDate.getDate() + days);

    plan.push({
      installmentNumber: index + 1,
      value: installmentValues[index],
      dueDate,
      dueInDays: days,
      isDownPayment: false,
    });
  });

  return plan;
};
