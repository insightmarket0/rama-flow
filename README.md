# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/a3e10015-2c0f-4bb6-9faf-59366c91f871

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/a3e10015-2c0f-4bb6-9faf-59366c91f871) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/a3e10015-2c0f-4bb6-9faf-59366c91f871) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)

## Supabase configuration

The cron job that gera parcelas automáticas chama a edge function `generate-recurring-installments` usando a configuração `app.settings.service_role_key`. Antes de habilitar o agendamento, defina esse valor no seu banco Supabase (substitua pelo Service Role Key real, encontrado nas configurações do projeto):

```sql
-- Execute no SQL Editor do Supabase
alter database postgres set app.settings.service_role_key = 'SUPABASE_SERVICE_ROLE_KEY_AQUI';
```

Depois de aplicar o comando, reinicie as conexões (ou aguarde alguns segundos) para que o valor fique disponível para `current_setting('app.settings.service_role_key', true)`. Sem essa configuração, o job agendado retornará erro de autorização ao acionar a função edge.
## Módulo de Cotações – Setup rápido

1) Aplicar migrations no Supabase

- Execute o SQL de `supabase/migrations/20251029212649_add_quotations_module.sql` no SQL Editor do seu projeto, ou rode `supabase db push` se estiver usando a CLI.
- A migration inclui `NOTIFY pgrst, 'reload schema'` ao final para recarregar o schema do PostgREST.

- Multiempresa (opcional): aplique também `supabase/migrations/20251027130518_quotations_rls_by_organization.sql` para liberar acesso por `organization_id` (sem quebrar o fluxo por `user_id`).

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
