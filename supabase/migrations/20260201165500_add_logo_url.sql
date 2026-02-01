-- Add logo_url to marketplaces
alter table public.marketplaces
add column if not exists logo_url text;

-- Optional: Update existing records if we assume they match the new presets
-- But mostly this is for new records.
