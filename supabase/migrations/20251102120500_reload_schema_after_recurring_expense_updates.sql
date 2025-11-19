-- Ensure PostgREST reloads schema after adding new columns to recurring expenses
select pg_notify('pgrst', 'reload schema');
