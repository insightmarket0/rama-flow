-- Extend recurring expenses to support variable values and flexible due rules
ALTER TABLE public.recurring_expenses
  ADD COLUMN value_type TEXT NOT NULL DEFAULT 'fixed' CHECK (value_type IN ('fixed', 'variable')),
  ADD COLUMN due_rule_type TEXT NOT NULL DEFAULT 'specific_day' CHECK (due_rule_type IN ('specific_day', 'days_after_start')),
  ADD COLUMN due_day_offset INTEGER;

ALTER TABLE public.recurring_expenses
  ALTER COLUMN amount DROP NOT NULL,
  ALTER COLUMN due_day DROP NOT NULL;

ALTER TABLE public.recurring_expenses
  DROP CONSTRAINT IF EXISTS recurring_expenses_amount_check,
  DROP CONSTRAINT IF EXISTS recurring_expenses_due_day_check;

ALTER TABLE public.recurring_expenses
  ADD CONSTRAINT recurring_expenses_amount_value_type_check
    CHECK (
      (value_type = 'fixed' AND amount IS NOT NULL AND amount > 0)
      OR
      (value_type = 'variable' AND (amount IS NULL OR amount >= 0))
    ),
  ADD CONSTRAINT recurring_expenses_due_day_valid_check
    CHECK (due_day IS NULL OR (due_day >= 1 AND due_day <= 31)),
  ADD CONSTRAINT recurring_expenses_due_day_offset_valid_check
    CHECK (due_day_offset IS NULL OR (due_day_offset >= 0 AND due_day_offset <= 31)),
  ADD CONSTRAINT recurring_expenses_due_rule_requirements_check
    CHECK (
      (due_rule_type = 'specific_day' AND due_day IS NOT NULL)
      OR
      (due_rule_type = 'days_after_start' AND due_day_offset IS NOT NULL)
    );

-- Allow installments to start without a value and include the new waiting status
ALTER TABLE public.recurring_expense_installments
  ALTER COLUMN value DROP NOT NULL;

ALTER TABLE public.recurring_expense_installments
  DROP CONSTRAINT IF EXISTS recurring_expense_installments_value_check,
  DROP CONSTRAINT IF EXISTS recurring_expense_installments_status_check;

ALTER TABLE public.recurring_expense_installments
  ADD CONSTRAINT recurring_expense_installments_value_check
    CHECK (value IS NULL OR value >= 0),
  ADD CONSTRAINT recurring_expense_installments_status_check
    CHECK (status IN ('pendente', 'aguardando_valor', 'atrasado', 'pago'));

-- Keep overdue automation compatible with the new status
CREATE OR REPLACE FUNCTION public.update_installment_status()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status IN ('pendente', 'aguardando_valor') AND NEW.due_date < CURRENT_DATE THEN
    NEW.status = 'atrasado';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
