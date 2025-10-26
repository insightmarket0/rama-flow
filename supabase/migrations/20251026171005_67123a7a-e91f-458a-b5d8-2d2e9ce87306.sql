-- Criar tabela de despesas recorrentes
CREATE TABLE public.recurring_expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  amount NUMERIC NOT NULL CHECK (amount > 0),
  recurrence_type TEXT NOT NULL CHECK (recurrence_type IN ('mensal', 'bimestral', 'trimestral', 'semestral', 'anual')),
  due_day INTEGER NOT NULL CHECK (due_day >= 1 AND due_day <= 31),
  start_date DATE NOT NULL,
  end_date DATE,
  supplier_id UUID REFERENCES public.suppliers(id) ON DELETE SET NULL,
  is_active BOOLEAN DEFAULT true,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- RLS Policies para recurring_expenses
ALTER TABLE public.recurring_expenses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own recurring expenses"
  ON public.recurring_expenses FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own recurring expenses"
  ON public.recurring_expenses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own recurring expenses"
  ON public.recurring_expenses FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own recurring expenses"
  ON public.recurring_expenses FOR DELETE
  USING (auth.uid() = user_id);

-- Trigger para updated_at
CREATE TRIGGER handle_updated_at_recurring_expenses
  BEFORE UPDATE ON public.recurring_expenses
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Índices para performance
CREATE INDEX idx_recurring_expenses_user_id ON public.recurring_expenses(user_id);
CREATE INDEX idx_recurring_expenses_is_active ON public.recurring_expenses(is_active);
CREATE INDEX idx_recurring_expenses_category ON public.recurring_expenses(category);

-- Criar tabela de parcelas geradas das despesas fixas
CREATE TABLE public.recurring_expense_installments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  recurring_expense_id UUID NOT NULL REFERENCES public.recurring_expenses(id) ON DELETE CASCADE,
  supplier_id UUID REFERENCES public.suppliers(id) ON DELETE SET NULL,
  reference_month DATE NOT NULL,
  value NUMERIC NOT NULL CHECK (value > 0),
  due_date DATE NOT NULL,
  status TEXT DEFAULT 'pendente' CHECK (status IN ('pendente', 'atrasado', 'pago')),
  paid_at TIMESTAMP WITH TIME ZONE,
  payment_proof TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- RLS Policies para recurring_expense_installments
ALTER TABLE public.recurring_expense_installments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own recurring expense installments"
  ON public.recurring_expense_installments FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own recurring expense installments"
  ON public.recurring_expense_installments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own recurring expense installments"
  ON public.recurring_expense_installments FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own recurring expense installments"
  ON public.recurring_expense_installments FOR DELETE
  USING (auth.uid() = user_id);

-- Trigger para updated_at
CREATE TRIGGER handle_updated_at_recurring_expense_installments
  BEFORE UPDATE ON public.recurring_expense_installments
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Trigger para atualizar status automaticamente
CREATE TRIGGER update_recurring_expense_installment_status
  BEFORE INSERT OR UPDATE ON public.recurring_expense_installments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_installment_status();

-- Índices para performance
CREATE INDEX idx_recurring_expense_installments_user_id ON public.recurring_expense_installments(user_id);
CREATE INDEX idx_recurring_expense_installments_status ON public.recurring_expense_installments(status);
CREATE INDEX idx_recurring_expense_installments_due_date ON public.recurring_expense_installments(due_date);
CREATE INDEX idx_recurring_expense_installments_recurring_expense_id ON public.recurring_expense_installments(recurring_expense_id);

-- Constraint única para evitar duplicatas
CREATE UNIQUE INDEX idx_unique_recurring_expense_month 
  ON public.recurring_expense_installments(recurring_expense_id, reference_month);