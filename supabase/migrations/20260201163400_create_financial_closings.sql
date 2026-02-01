-- Create table for monthly financial closings
create table if not exists public.financial_closings (
    id uuid not null default gen_random_uuid(),
    user_id uuid not null references auth.users(id),
    month varchar not null, -- Format YYYY-MM
    revenue_ml numeric not null default 0,
    revenue_shopee numeric not null default 0,
    revenue_amazon numeric not null default 0,
    revenue_magalu numeric not null default 0,
    created_at timestamptz not null default now(),
    
    constraint financial_closings_pkey primary key (id),
    constraint financial_closings_month_user_unique unique (user_id, month)
);

-- RLS
alter table public.financial_closings enable row level security;

create policy "Users can view their own financial closings"
    on public.financial_closings
    for select
    using (auth.uid() = user_id);

create policy "Users can insert their own financial closings"
    on public.financial_closings
    for insert
    with check (auth.uid() = user_id);

create policy "Users can update their own financial closings"
    on public.financial_closings
    for update
    using (auth.uid() = user_id);

create policy "Users can delete their own financial closings"
    on public.financial_closings
    for delete
    using (auth.uid() = user_id);
