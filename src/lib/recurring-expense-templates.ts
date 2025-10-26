export type RecurringExpenseTemplate = {
  id: string;
  name: string;
  description: string;
  category: string;
  amount: number;
  recurrence_type: "mensal" | "bimestral" | "trimestral" | "semestral" | "anual";
  due_day: number;
  notes?: string;
};

export const RECURRING_EXPENSE_TEMPLATES: RecurringExpenseTemplate[] = [
  {
    id: "aluguel-comercial",
    name: "Aluguel Comercial",
    description: "Pagamentos mensais de aluguel do escritório ou loja.",
    category: "aluguel",
    amount: 4800,
    recurrence_type: "mensal",
    due_day: 10,
    notes: "Reajuste anual conforme contrato.",
  },
  {
    id: "salario-funcionario",
    name: "Salário Funcionário",
    description: "Remuneração mensal de colaborador CLT.",
    category: "salarios",
    amount: 3200,
    recurrence_type: "mensal",
    due_day: 5,
    notes: "Incluir encargos trabalhistas na previsão de caixa.",
  },
  {
    id: "iptu",
    name: "IPTU",
    description: "Parcelas mensais do imposto predial.",
    category: "impostos",
    amount: 600,
    recurrence_type: "mensal",
    due_day: 15,
    notes: "Parcelamento anual liberado pela prefeitura.",
  },
  {
    id: "software-saas",
    name: "Software SaaS",
    description: "Licenças de ferramentas digitais e assinaturas.",
    category: "software",
    amount: 219,
    recurrence_type: "mensal",
    due_day: 1,
    notes: "Plano anual faturado mensalmente via cartão de crédito.",
  },
];
