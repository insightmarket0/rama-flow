-- Helper function to refresh PostgREST schema cache on demand
CREATE OR REPLACE FUNCTION public.refresh_postgrest_schema()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM pg_notify('pgrst', 'reload schema');
END;
$$;

GRANT EXECUTE ON FUNCTION public.refresh_postgrest_schema() TO anon, authenticated, service_role;
