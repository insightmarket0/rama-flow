-- RLS por organization_id (sem quebrar o modelo por user_id)

-- POLÍTICAS ADICIONAIS EM quotations
-- SELECT por organização: libera leitura para todos os usuários do mesmo org
CREATE POLICY "Org can view quotations"
  ON public.quotations FOR SELECT
  USING (
    organization_id IS NOT NULL AND
    (auth.jwt() ->> 'organization_id')::uuid = organization_id
  );

-- INSERT: quando organization_id é informado, deve bater com o claim
CREATE POLICY "Org can insert quotations"
  ON public.quotations FOR INSERT
  WITH CHECK (
    organization_id IS NULL OR
    (auth.jwt() ->> 'organization_id')::uuid = organization_id
  );

-- UPDATE: permite edição a membros da organização
CREATE POLICY "Org can update quotations"
  ON public.quotations FOR UPDATE
  USING (
    organization_id IS NOT NULL AND
    (auth.jwt() ->> 'organization_id')::uuid = organization_id
  )
  WITH CHECK (
    organization_id IS NOT NULL AND
    (auth.jwt() ->> 'organization_id')::uuid = organization_id
  );

-- DELETE: idem
CREATE POLICY "Org can delete quotations"
  ON public.quotations FOR DELETE
  USING (
    organization_id IS NOT NULL AND
    (auth.jwt() ->> 'organization_id')::uuid = organization_id
  );

-- POLÍTICAS ADICIONAIS EM quotation_responses (via vínculo com quotations)
-- SELECT: libera leitura se a cotação pertencer à organização do token
CREATE POLICY "Org can view quotation responses"
  ON public.quotation_responses FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.quotations q
      WHERE q.id = quotation_id
        AND q.organization_id IS NOT NULL
        AND (auth.jwt() ->> 'organization_id')::uuid = q.organization_id
    )
  );

-- INSERT: só permite inserir se a cotação pertencer à organização
CREATE POLICY "Org can insert quotation responses"
  ON public.quotation_responses FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.quotations q
      WHERE q.id = quotation_id
        AND (
          q.organization_id IS NULL -- permite fluxo antigo sem org definida
          OR (auth.jwt() ->> 'organization_id')::uuid = q.organization_id
        )
    )
  );

-- UPDATE
CREATE POLICY "Org can update quotation responses"
  ON public.quotation_responses FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.quotations q
      WHERE q.id = quotation_id
        AND q.organization_id IS NOT NULL
        AND (auth.jwt() ->> 'organization_id')::uuid = q.organization_id
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.quotations q
      WHERE q.id = quotation_id
        AND q.organization_id IS NOT NULL
        AND (auth.jwt() ->> 'organization_id')::uuid = q.organization_id
    )
  );

-- DELETE
CREATE POLICY "Org can delete quotation responses"
  ON public.quotation_responses FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.quotations q
      WHERE q.id = quotation_id
        AND q.organization_id IS NOT NULL
        AND (auth.jwt() ->> 'organization_id')::uuid = q.organization_id
    )
  );

-- Reload do schema do PostgREST
NOTIFY pgrst, 'reload schema';
