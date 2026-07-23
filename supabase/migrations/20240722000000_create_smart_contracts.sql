CREATE TABLE public.smart_contracts (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    name text NOT NULL,
    category text NOT NULL,
    amount numeric,
    due_day integer,
    user_id uuid,
    is_active boolean DEFAULT true,
    value_type text DEFAULT 'fixed'::text,
    recurrence_type text DEFAULT 'mensal'::text,
    due_days integer[],
    due_rule_type text DEFAULT 'fixed_day'::text,
    due_day_offset integer,
    start_date date,
    supplier_id uuid,
    notes text,
    access_info text
);

ALTER TABLE public.smart_contracts
    ADD CONSTRAINT smart_contracts_pkey PRIMARY KEY (id);

ALTER TABLE public.smart_contracts
    ADD CONSTRAINT smart_contracts_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id);

ALTER TABLE public.smart_contracts
    ADD CONSTRAINT smart_contracts_supplier_id_fkey FOREIGN KEY (supplier_id) REFERENCES public.suppliers(id);


CREATE TABLE public.smart_contract_installments (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    smart_contract_id uuid,
    value numeric NOT NULL,
    due_date date NOT NULL,
    status text NOT NULL DEFAULT 'pendente'::text,
    paid_at timestamp with time zone,
    user_id uuid,
    supplier_id uuid
);

ALTER TABLE public.smart_contract_installments
    ADD CONSTRAINT smart_contract_installments_pkey PRIMARY KEY (id);

ALTER TABLE public.smart_contract_installments
    ADD CONSTRAINT smart_contract_installments_smart_contract_id_fkey FOREIGN KEY (smart_contract_id) REFERENCES public.smart_contracts(id) ON DELETE CASCADE;

ALTER TABLE public.smart_contract_installments
    ADD CONSTRAINT smart_contract_installments_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id);

ALTER TABLE public.smart_contract_installments
    ADD CONSTRAINT smart_contract_installments_supplier_id_fkey FOREIGN KEY (supplier_id) REFERENCES public.suppliers(id);


-- RLS Policies
ALTER TABLE public.smart_contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.smart_contract_installments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own smart contracts" ON public.smart_contracts FOR SELECT USING ((auth.uid() = user_id));
CREATE POLICY "Users can insert their own smart contracts" ON public.smart_contracts FOR INSERT WITH CHECK ((auth.uid() = user_id));
CREATE POLICY "Users can update their own smart contracts" ON public.smart_contracts FOR UPDATE USING ((auth.uid() = user_id));
CREATE POLICY "Users can delete their own smart contracts" ON public.smart_contracts FOR DELETE USING ((auth.uid() = user_id));

CREATE POLICY "Users can view their own smart contract installments" ON public.smart_contract_installments FOR SELECT USING ((auth.uid() = user_id));
CREATE POLICY "Users can insert their own smart contract installments" ON public.smart_contract_installments FOR INSERT WITH CHECK ((auth.uid() = user_id));
CREATE POLICY "Users can update their own smart contract installments" ON public.smart_contract_installments FOR UPDATE USING ((auth.uid() = user_id));
CREATE POLICY "Users can delete their own smart contract installments" ON public.smart_contract_installments FOR DELETE USING ((auth.uid() = user_id));
