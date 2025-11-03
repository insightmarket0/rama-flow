-- Add invoice number field to purchase orders
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS invoice_number TEXT;
