export const EXPENSE_CATEGORIES = [
  { value: "aluguel", label: "Aluguel", icon: "Home" },
  { value: "salarios", label: "Salários", icon: "Users" },
  { value: "impostos", label: "Impostos", icon: "FileText" },
  { value: "seguros", label: "Seguros", icon: "Shield" },
  { value: "energia", label: "Energia Elétrica", icon: "Zap" },
  { value: "agua", label: "Água", icon: "Droplet" },
  { value: "internet", label: "Internet/Telefone", icon: "Wifi" },
  { value: "contabilidade", label: "Contabilidade", icon: "Calculator" },
  { value: "manutencao", label: "Manutenção", icon: "Wrench" },
  { value: "software", label: "Software/SaaS", icon: "Laptop" },
  { value: "outros", label: "Outros", icon: "MoreHorizontal" },
] as const;

export const RECURRENCE_TYPES = [
  { value: "mensal", label: "Mensal", description: "A cada 1 mês" },
  { value: "bimestral", label: "Bimestral", description: "A cada 2 meses" },
  { value: "trimestral", label: "Trimestral", description: "A cada 3 meses" },
  { value: "semestral", label: "Semestral", description: "A cada 6 meses" },
  { value: "anual", label: "Anual", description: "A cada 12 meses" },
] as const;
