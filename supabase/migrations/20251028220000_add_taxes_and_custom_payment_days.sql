-- Add taxes column to orders for storing cumulative tax values
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS taxes DECIMAL(15,2) DEFAULT 0;

-- Allow payment conditions to define custom day offsets for installments
ALTER TABLE public.payment_conditions
  ADD COLUMN IF NOT EXISTS due_days INTEGER[];
