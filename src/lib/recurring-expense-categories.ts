export const EXPENSE_CATEGORIES = [
  { value: "infraestrutura", label: "Infraestrutura Física (Aluguel, Luz, etc)", icon: "Building" },
  { value: "saas", label: "Ferramentas e SaaS (ERPs, Hubs)", icon: "Laptop" },
  { value: "folha", label: "Folha e Encargos (Salários, Contabilidade)", icon: "Users" },
  { value: "marketing", label: "Marketing e Ads (Tráfego, Influencers)", icon: "Megaphone" },
  { value: "impostos", label: "Impostos Diretos", icon: "FileText" },
] as const;

export const RECURRENCE_TYPES = [
  { value: "semanal", label: "Semanal", description: "A cada 7 dias" },
  { value: "quinzenal", label: "Quinzenal", description: "A cada 15 dias" },
  { value: "mensal", label: "Mensal", description: "A cada 1 mês" },
  { value: "bimestral", label: "Bimestral", description: "A cada 2 meses" },
  { value: "trimestral", label: "Trimestral", description: "A cada 3 meses" },
  { value: "semestral", label: "Semestral", description: "A cada 6 meses" },
  { value: "anual", label: "Anual", description: "A cada 12 meses" },
] as const;
