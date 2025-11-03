-- Ensure the due_days column exists and refresh PostgREST cache
ALTER TABLE public.payment_conditions
  ADD COLUMN IF NOT EXISTS due_days INTEGER[];

NOTIFY pgrst, 'reload schema';
