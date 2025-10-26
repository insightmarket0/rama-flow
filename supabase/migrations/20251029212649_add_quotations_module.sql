-- Module: Cotação

-- 1) Tabela de cotações
CREATE TABLE public.quotations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  organization_id UUID,
  titulo TEXT NOT NULL CHECK (char_length(titulo) BETWEEN 3 AND 80),
  descricao TEXT,
  status TEXT NOT NULL DEFAULT 'aberta' CHECK (status IN ('aberta', 'fechada', 'aprovada')),
  data_limite DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.quotations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their quotations"
  ON public.quotations
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their quotations"
  ON public.quotations
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their quotations"
  ON public.quotations
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their quotations"
  ON public.quotations
  FOR DELETE
  USING (auth.uid() = user_id);

CREATE INDEX idx_quotations_user_id ON public.quotations(user_id);
CREATE INDEX idx_quotations_status ON public.quotations(status);
CREATE INDEX idx_quotations_created_at ON public.quotations(created_at DESC);

CREATE TRIGGER handle_updated_at_quotations
  BEFORE UPDATE ON public.quotations
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- 2) Tabela de respostas de fornecedores
CREATE TABLE public.quotation_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  quotation_id UUID NOT NULL REFERENCES public.quotations(id) ON DELETE CASCADE,
  fornecedor_id UUID NOT NULL REFERENCES public.suppliers(id),
  valor_total NUMERIC(14,2) NOT NULL CHECK (valor_total > 0),
  prazo_dias INT NOT NULL DEFAULT 0 CHECK (prazo_dias >= 0),
  condicao_pagamento TEXT CHECK (
    condicao_pagamento IS NULL
    OR char_length(condicao_pagamento) BETWEEN 1 AND 30
  ),
  observacao TEXT,
  status TEXT NOT NULL DEFAULT 'rascunho' CHECK (status IN ('rascunho', 'enviada', 'aprovada')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.quotation_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their quotation responses"
  ON public.quotation_responses
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their quotation responses"
  ON public.quotation_responses
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their quotation responses"
  ON public.quotation_responses
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their quotation responses"
  ON public.quotation_responses
  FOR DELETE
  USING (auth.uid() = user_id);

CREATE INDEX idx_quotation_responses_quotation_id ON public.quotation_responses(quotation_id);
CREATE INDEX idx_quotation_responses_status ON public.quotation_responses(status);

CREATE TRIGGER handle_updated_at_quotation_responses
  BEFORE UPDATE ON public.quotation_responses
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Apenas uma resposta aprovada por cotação
CREATE UNIQUE INDEX idx_unique_approved_response_per_quotation
  ON public.quotation_responses(quotation_id)
  WHERE status = 'aprovada';

-- 3) Função utilitária para aprovar resposta e cotação
CREATE OR REPLACE FUNCTION public.approve_quotation_response(p_response_id UUID, p_observacao TEXT DEFAULT NULL)
RETURNS VOID
LANGUAGE plpgsql
AS $$
DECLARE
  v_user_id UUID := auth.uid();
  v_quotation_id UUID;
BEGIN
  SELECT quotation_id
    INTO v_quotation_id
  FROM public.quotation_responses
  WHERE id = p_response_id
    AND user_id = v_user_id;

  IF v_quotation_id IS NULL THEN
    RAISE EXCEPTION 'Resposta não encontrada ou sem permissão';
  END IF;

  -- Reabrir qualquer resposta aprovada anterior
  UPDATE public.quotation_responses
     SET status = 'enviada',
         updated_at = now()
   WHERE quotation_id = v_quotation_id
     AND user_id = v_user_id
     AND status = 'aprovada'
     AND id <> p_response_id;

  -- Aprovar resposta escolhida
  UPDATE public.quotation_responses
     SET status = 'aprovada',
         observacao = COALESCE(p_observacao, observacao),
         updated_at = now()
   WHERE id = p_response_id
     AND user_id = v_user_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Falha ao aprovar resposta';
  END IF;

  -- Atualizar cotação
  UPDATE public.quotations
     SET status = 'aprovada',
         updated_at = now()
   WHERE id = v_quotation_id
     AND user_id = v_user_id;
END;
$$;
