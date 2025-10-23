-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT,
  role TEXT DEFAULT 'comprador' CHECK (role IN ('admin', 'financeiro', 'comprador')),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create trigger for profile updates
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Trigger to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Create suppliers table
CREATE TABLE public.suppliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  cnpj TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own suppliers"
  ON public.suppliers FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own suppliers"
  ON public.suppliers FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own suppliers"
  ON public.suppliers FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own suppliers"
  ON public.suppliers FOR DELETE
  USING (auth.uid() = user_id);

CREATE TRIGGER suppliers_updated_at
  BEFORE UPDATE ON public.suppliers
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Create payment_conditions table
CREATE TABLE public.payment_conditions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  installments INTEGER NOT NULL CHECK (installments > 0),
  interval_days INTEGER NOT NULL CHECK (interval_days >= 0),
  down_payment_percent DECIMAL(5,2) DEFAULT 0 CHECK (down_payment_percent >= 0 AND down_payment_percent <= 100),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

ALTER TABLE public.payment_conditions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own payment conditions"
  ON public.payment_conditions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own payment conditions"
  ON public.payment_conditions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own payment conditions"
  ON public.payment_conditions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own payment conditions"
  ON public.payment_conditions FOR DELETE
  USING (auth.uid() = user_id);

CREATE TRIGGER payment_conditions_updated_at
  BEFORE UPDATE ON public.payment_conditions
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Create orders table
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  supplier_id UUID REFERENCES public.suppliers(id) ON DELETE CASCADE NOT NULL,
  order_number TEXT NOT NULL,
  total_value DECIMAL(15,2) NOT NULL,
  payment_condition_id UUID REFERENCES public.payment_conditions(id) NOT NULL,
  status TEXT DEFAULT 'aberto' CHECK (status IN ('aberto', 'faturado', 'cancelado')),
  items JSONB DEFAULT '[]'::jsonb,
  freight DECIMAL(15,2) DEFAULT 0,
  discount DECIMAL(15,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(user_id, order_number)
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own orders"
  ON public.orders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own orders"
  ON public.orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own orders"
  ON public.orders FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own orders"
  ON public.orders FOR DELETE
  USING (auth.uid() = user_id);

CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Create installments table
CREATE TABLE public.installments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  supplier_id UUID REFERENCES public.suppliers(id) ON DELETE CASCADE NOT NULL,
  installment_number INTEGER NOT NULL,
  value DECIMAL(15,2) NOT NULL,
  due_date DATE NOT NULL,
  status TEXT DEFAULT 'pendente' CHECK (status IN ('pendente', 'pago', 'atrasado')),
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

ALTER TABLE public.installments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own installments"
  ON public.installments FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own installments"
  ON public.installments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own installments"
  ON public.installments FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own installments"
  ON public.installments FOR DELETE
  USING (auth.uid() = user_id);

CREATE TRIGGER installments_updated_at
  BEFORE UPDATE ON public.installments
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Function to auto-update installment status based on due date
CREATE OR REPLACE FUNCTION public.update_installment_status()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'pendente' AND NEW.due_date < CURRENT_DATE THEN
    NEW.status = 'atrasado';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER check_installment_status
  BEFORE INSERT OR UPDATE ON public.installments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_installment_status();

-- Create indexes for better performance
CREATE INDEX idx_suppliers_user_id ON public.suppliers(user_id);
CREATE INDEX idx_payment_conditions_user_id ON public.payment_conditions(user_id);
CREATE INDEX idx_orders_user_id ON public.orders(user_id);
CREATE INDEX idx_orders_supplier_id ON public.orders(supplier_id);
CREATE INDEX idx_installments_user_id ON public.installments(user_id);
CREATE INDEX idx_installments_order_id ON public.installments(order_id);
CREATE INDEX idx_installments_due_date ON public.installments(due_date);
CREATE INDEX idx_installments_status ON public.installments(status);