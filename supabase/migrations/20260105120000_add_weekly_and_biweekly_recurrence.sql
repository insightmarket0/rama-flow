-- Add semanal and quinzenal to recurrence_type check
ALTER TABLE public.recurring_expenses
  DROP CONSTRAINT IF EXISTS recurring_expenses_recurrence_type_check;

ALTER TABLE public.recurring_expenses
  ADD CONSTRAINT recurring_expenses_recurrence_type_check
  CHECK (recurrence_type IN ('semanal', 'quinzenal', 'mensal', 'bimestral', 'trimestral', 'semestral', 'anual'));

-- If any functions rely on specific values, review them accordingly.
