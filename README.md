Rama Flow
=========

Aplicação web construída com Vite + React para gestão financeira, usando Supabase como backend (Postgres, autenticação e edge functions).

Como rodar localmente
---------------------

1. Instale as dependências: `npm install`
2. Configure o arquivo `.env` com as chaves do seu projeto Supabase (veja a seção *Variáveis de ambiente*).
3. Suba o dev server: `npm run dev`

Variáveis de ambiente
---------------------

No arquivo `.env` mantenha (ou adicione) as seguintes chaves:

```
VITE_SUPABASE_PROJECT_ID=unfveyhxbfnshjdadcfn
VITE_SUPABASE_URL=https://unfveyhxbfnshjdadcfn.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=<ANON_PUBLIC_KEY_DO_SUPABASE>
SUPABASE_DB_URL=postgresql://postgres:<SENHA>@db.unfveyhxbfnshjdadcfn.supabase.co:5432/postgres
```

Use a *anon/public key* (chave pública) e a senha do banco reais do seu projeto Supabase. Esses valores não devem ser commitados em repositórios públicos.

Linkando o projeto pela CLI
---------------------------

Para aplicar as migrations e gerenciar edge functions a partir deste repositório:

```
supabase login
supabase link --project-ref unfveyhxbfnshjdadcfn
```

Depois rode `supabase db push` para aplicar as migrations existentes em `supabase/migrations`.

Supabase configuration
----------------------

O cron job que gera parcelas automáticas chama a edge function `generate-recurring-installments` usando a configuração `app.settings.service_role_key`. Antes de habilitar o agendamento, defina esse valor no seu banco Supabase (substitua pelo Service Role Key real, encontrado nas configurações do projeto):

```sql
-- Execute no SQL Editor do Supabase
alter database postgres set app.settings.service_role_key = 'SUPABASE_SERVICE_ROLE_KEY_AQUI';
```

Depois de aplicar o comando, reinicie as conexões (ou aguarde alguns segundos) para que o valor fique disponível para `current_setting('app.settings.service_role_key', true)`. Sem essa configuração, o job agendado retornará erro de autorização ao acionar a função edge.

Módulo de Cotações – Setup rápido
---------------------------------

1) Aplicar migrations no Supabase

- Execute o SQL de `supabase/migrations/20251029212649_add_quotations_module.sql` no SQL Editor do seu projeto, ou rode `supabase db push` se estiver usando a CLI.
- A migration inclui `NOTIFY pgrst, 'reload schema'` ao final para recarregar o schema do PostgREST.

- Multiempresa (opcional): aplique também `supabase/migrations/20251029222600_quotations_rls_by_organization.sql` para liberar acesso por `organization_id` (sem quebrar o fluxo por `user_id`).

2) Recarregar preview

- Feche/reabra o preview/dev-server após aplicar as migrations. Caso veja mensagens sobre "schema cache", é sintoma de schema desatualizado.

3) Verificação rápida

- No SQL Editor: `select to_regclass('public.quotations');` deve retornar `public.quotations`.
- Na UI: crie uma nova cotação em `/quotations/new`.

4) Sanity helper

- Use `supabase/sanity/quotations_sanity.sql` no SQL Editor para:
  - Verificar existência das tabelas
  - Listar policies
  - Disparar reload do schema do PostgREST

5) Observações

- RLS: o projeto usa `user_id` para isolar dados. Há campo `organization_id` previsto, mas sem policies ativas por organização.
- Multiempresa: com a migration de RLS por organização aplicada, usuários com `organization_id` no JWT passam a ler/editar linhas da mesma organização. Se o claim não existir, o acesso continua valendo por `user_id`.
- O client tenta enviar `organization_id` ao criar cotação lendo `user_metadata.organization_id` (fallback: `organizationId`/`org_id`).
- Aprovação: a função `approve_quotation_response` garante apenas uma resposta aprovada por cotação e atualiza o status da cotação.
