-- Add a descriptive field for tax-specific recurring expenses
ALTER TABLE public.recurring_expenses
  ADD COLUMN IF NOT EXISTS tax_description TEXT;
