CREATE TABLE marketing_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  marketing_budget jsonb DEFAULT '{}'::jsonb,
  crm_partners jsonb DEFAULT '[]'::jsonb,
  scripts jsonb DEFAULT '[]'::jsonb,
  approvals jsonb DEFAULT '[]'::jsonb,
  social_metrics jsonb DEFAULT '{}'::jsonb,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- Seed initial global row
INSERT INTO marketing_settings (id) VALUES ('00000000-0000-0000-0000-000000000000');
