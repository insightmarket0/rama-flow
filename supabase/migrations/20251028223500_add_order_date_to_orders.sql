-- Allow purchase orders to set a specific base date
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS order_date DATE;
