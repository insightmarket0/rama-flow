-- Sanity checks para o módulo de Cotações

-- 1) Verificar existência das tabelas
select to_regclass('public.quotations')   as quotations_table;
select to_regclass('public.quotation_responses') as quotation_responses_table;

-- 2) Listar políticas ativas
select pol.polname, pol.polcmd, pol.polroles, pol.polqual, pol.polwithcheck
from pg_policy pol
join pg_class c on c.oid = pol.polrelid
join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public' and c.relname in ('quotations','quotation_responses')
order by c.relname, pol.polname;

-- 3) Reload do schema do PostgREST (executar se houver erro de cache)
select pg_notify('pgrst', 'reload schema');

-- 4) Consulta exemplo (respeita RLS):
-- select * from public.quotations limit 10;
