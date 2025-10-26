-- Ensure recurring expense tables keep referential integrity with users
ALTER TABLE public.recurring_expenses
  ADD CONSTRAINT recurring_expenses_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.recurring_expense_installments
  ADD CONSTRAINT recurring_expense_installments_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Enable required extensions for scheduled edge function calls
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA extensions;

-- Recreate the daily cron job that triggers the recurring installments generator
SELECT cron.unschedule('generate-recurring-installments');

SELECT cron.schedule(
  'generate-recurring-installments',
  '0 0 * * *',
  $$
  SELECT
    net.http_post(
      url := 'https://njxbxijllwattlarwoxr.supabase.co/functions/v1/generate-recurring-installments',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || coalesce(current_setting('app.settings.service_role_key', true), '')
      )
    ) AS request_id;
  $$
);
