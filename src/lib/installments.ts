import { Tables } from "@/integrations/supabase/types";
import { supabase } from "@/integrations/supabase/client";

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

export async function generateSmartContractInstallments(params: {
  expenseId: string;
  monthsAhead: number;
  rebuildMode: "replace-upcoming" | "remove-upcoming";
  rebuildFrom?: string;
}) {
  const { expenseId, monthsAhead, rebuildMode } = params;
  const todayISO = params.rebuildFrom || new Date().toISOString().split("T")[0];

  const { data: contract, error: contractErr } = await supabase
    .from("smart_contracts")
    .select("*")
    .eq("id", expenseId)
    .single();

  if (contractErr || !contract) {
    console.error("Failed to fetch smart contract", contractErr);
    return;
  }

  if (rebuildMode === "replace-upcoming" || rebuildMode === "remove-upcoming") {
    await supabase
      .from("smart_contract_installments")
      .delete()
      .eq("smart_contract_id", expenseId)
      .neq("status", "pago")
      .gte("due_date", todayISO);
  }

  if (rebuildMode === "remove-upcoming" || !contract.is_active) {
    return; 
  }

  const installmentsToInsert = [];
  const baseDate = new Date(todayISO + "T12:00:00");
  
  let stepMonths = 1;
  if (contract.recurrence_type === "bimestral") stepMonths = 2;
  else if (contract.recurrence_type === "trimestral") stepMonths = 3;
  else if (contract.recurrence_type === "semestral") stepMonths = 6;
  else if (contract.recurrence_type === "anual") stepMonths = 12;

  let days: number[] = [];
  if (contract.due_rule_type === "specific_day") {
    if (contract.due_days && contract.due_days.length > 0) {
      days = contract.due_days;
    } else if (contract.due_day) {
      days = [contract.due_day];
    } else {
      days = [1];
    }
  } else {
    days = [1];
  }

  for (let i = 0; i < monthsAhead; i += stepMonths) {
    const targetMonth = new Date(baseDate);
    targetMonth.setMonth(targetMonth.getMonth() + i);

    for (const day of days) {
      const due = new Date(targetMonth.getFullYear(), targetMonth.getMonth(), day, 12, 0, 0);
      
      if (due.toISOString().split("T")[0] >= todayISO) {
        installmentsToInsert.push({
          smart_contract_id: expenseId,
          value: contract.amount || 0,
          due_date: due.toISOString().split("T")[0],
          status: "pendente",
          supplier_id: contract.supplier_id || null,
          user_id: contract.user_id || null
        });
      }
    }
  }

  if (installmentsToInsert.length > 0) {
    await supabase.from("smart_contract_installments").insert(installmentsToInsert);
  }
}
