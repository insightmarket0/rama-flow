CREATE TABLE IF NOT EXISTS public.supply_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    item_name TEXT NOT NULL,
    category TEXT,
    priority TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pendente',
    author TEXT NOT NULL,
    user_id UUID REFERENCES auth.users(id)
);

ALTER TABLE public.supply_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to read supply_requests" 
    ON public.supply_requests FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to insert supply_requests" 
    ON public.supply_requests FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update supply_requests" 
    ON public.supply_requests FOR UPDATE TO authenticated USING (true);
