-- Add due_days array to support multiple fixed due days (e.g. [5,15])
ALTER TABLE recurring_expenses
  ADD COLUMN IF NOT EXISTS due_days integer[];

-- Note: After applying this migration, existing recurring_expenses will continue to work.
-- You may want to backfill `due_days` from `due_day` for existing rows if desired, for example:
-- UPDATE recurring_expenses SET due_days = ARRAY[due_day] WHERE due_day IS NOT NULL;
