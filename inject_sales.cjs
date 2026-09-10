const fs = require('fs');
let content = fs.readFileSync('src/pages/Marketing.tsx', 'utf8');

const hookUpdates = `
  const [isSalesModalOpen, setIsSalesModalOpen] = useState(false);
  const [salesForm, setSalesForm] = useState({ vendas: 0, vendasGrowth: 0 });

  const handleEditSales = () => {
    setSalesForm({ vendas: marketingBudget.vendas || 0, vendasGrowth: marketingBudget.vendasGrowth || 0 });
    setIsSalesModalOpen(true);
  };

  const handleSaveSales = () => {
    const updated = { ...marketingBudget, vendas: salesForm.vendas, vendasGrowth: salesForm.vendasGrowth };
    setMarketingBudget(updated);
    localStorage.setItem("rama_marketing_budget", JSON.stringify(updated));
    setIsSalesModalOpen(false);
  };
`;

if (!content.includes('const handleEditSales')) {
    content = content.replace('export default function Marketing() {', 'export default function Marketing() {\n' + hookUpdates);
    fs.writeFileSync('src/pages/Marketing.tsx', content, 'utf8');
    console.log("Sales hooks injected!");
} else {
    console.log("Hooks already exist");
}
