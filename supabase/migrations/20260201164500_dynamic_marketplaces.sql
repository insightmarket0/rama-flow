-- Create marketplaces table
create table if not exists public.marketplaces (
    id uuid not null default gen_random_uuid(),
    user_id uuid not null references auth.users(id),
    label text not null,
    color text not null,
    is_active boolean not null default true,
    created_at timestamptz not null default now(),

    constraint marketplaces_pkey primary key (id)
);

-- RLS for marketplaces
alter table public.marketplaces enable row level security;

create policy "Users can view their own marketplaces"
    on public.marketplaces for select
    using (auth.uid() = user_id);

create policy "Users can insert their own marketplaces"
    on public.marketplaces for insert
    with check (auth.uid() = user_id);

create policy "Users can update their own marketplaces"
    on public.marketplaces for update
    using (auth.uid() = user_id);

create policy "Users can delete their own marketplaces"
    on public.marketplaces for delete
    using (auth.uid() = user_id);

-- Alter financial_closings to support dynamic revenues
alter table public.financial_closings
add column revenues jsonb not null default '{}'::jsonb;

-- Migrate existing columns to JSONB (best effort migration for standard keys)
-- We use a known set of keys for the initial migration matching the old hardcoded columns
update public.financial_closings
set revenues = jsonb_build_object(
    'mercadolivre', revenue_ml,
    'shopee', revenue_shopee,
    'amazon', revenue_amazon,
    'magalu', revenue_magalu
);

-- Drop old columns
alter table public.financial_closings drop column revenue_ml;
alter table public.financial_closings drop column revenue_shopee;
alter table public.financial_closings drop column revenue_amazon;
alter table public.financial_closings drop column revenue_magalu;

-- Seed default marketplaces for existing users (optional, but good UX to not start empty)
-- This is tricky in a migration file without knowing specific users, usually handles in app logic
-- For now, we rely on the Front-end checking if no marketplaces exist, then prompting to create defaults, 
-- OR we can insert defaults for all users who have financial_closings.
-- Let's stick to the App Logic approach or a simple insert for the current user if I could, but I can't here.
