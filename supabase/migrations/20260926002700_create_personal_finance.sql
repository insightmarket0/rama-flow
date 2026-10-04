CREATE TABLE public.personal_incomes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  amount NUMERIC NOT NULL DEFAULT 0,
  type TEXT NOT NULL,
  expected_date TEXT,
  status TEXT DEFAULT 'Previsto',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.personal_incomes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own personal incomes"
  ON public.personal_incomes FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.personal_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  limit_amount NUMERIC NOT NULL DEFAULT 0,
  current_invoice NUMERIC NOT NULL DEFAULT 0,
  closing_day INTEGER,
  due_day INTEGER,
  color TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.personal_cards ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own personal cards"
  ON public.personal_cards FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.personal_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  price NUMERIC NOT NULL DEFAULT 0,
  category TEXT,
  due_date TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.personal_subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own personal subscriptions"
  ON public.personal_subscriptions FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
