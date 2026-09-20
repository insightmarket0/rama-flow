const fs = require('fs');
let content = fs.readFileSync('src/hooks/useSmartContractInstallments.tsx', 'utf-8');

const toReplace = `      const today = new Date();
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 60);

      const { data, error } = await supabase
        .from("smart_contract_installments")
        .select(\`
          *,
          smart_contract:smart_contracts(name, category, value_type)
        \`)
        .gte("due_date", today.toISOString().split("T")[0])
        .lte("due_date", futureDate.toISOString().split("T")[0])
        .neq("status", "pago")
        .order("due_date", { ascending: true });`;

const replacement = `      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 365); // Considera dívidas em aberto até 1 ano atrás
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 60);

      const { data, error } = await supabase
        .from("smart_contract_installments")
        .select(\`
          *,
          smart_contract:smart_contracts(name, category, value_type)
        \`)
        .gte("due_date", pastDate.toISOString().split("T")[0])
        .lte("due_date", futureDate.toISOString().split("T")[0])
        .neq("status", "pago")
        .order("due_date", { ascending: true });`;

if (content.includes(toReplace)) {
    content = content.replace(toReplace, replacement);
    fs.writeFileSync('src/hooks/useSmartContractInstallments.tsx', content, 'utf-8');
    console.log('Fixed query to include overdue bills');
} else {
    console.log('Could not find the target string');
}
