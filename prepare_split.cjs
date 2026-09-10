const fs = require('fs');
let content = fs.readFileSync('src/pages/Marketing.tsx', 'utf8');

const hookUpdates = `
  const [isSplitModalOpen, setIsSplitModalOpen] = useState(false);
  const [splitForm, setSplitForm] = useState({ trafego: 60, influenciadores: 25, seeding: 15 });

  const handleEditSplit = () => {
    setSplitForm(marketingBudget.budgetSplit || { trafego: 60, influenciadores: 25, seeding: 15 });
    setIsSplitModalOpen(true);
  };

  const handleSaveSplit = () => {
    const updated = { ...marketingBudget, budgetSplit: splitForm };
    setMarketingBudget(updated);
    localStorage.setItem("rama_marketing_budget", JSON.stringify(updated));
    setIsSplitModalOpen(false);
  };
`;

if (!content.includes('handleEditSplit')) {
    content = content.replace('const handleEditBudget = () => {', hookUpdates + '\n  const handleEditBudget = () => {');
}

// Update currentData initialization
content = content.replace(/vendasGrowth: 0, history: \[\]/g, 'vendasGrowth: 0, budgetSplit: { trafego: 60, influenciadores: 25, seeding: 15 }, history: []');
// Note: we might have two occurrences if we replaced it previously, let's just make sure we handle it robustly:
content = content.replace(/let currentData = \{ currentMonth: getCurrentMonthStr\(\), total: 5000, gasto: 3250, vendas: 0, vendasGrowth: 0, history: \[\] \};/, 'let currentData = { currentMonth: getCurrentMonthStr(), total: 5000, gasto: 3250, vendas: 0, vendasGrowth: 0, budgetSplit: { trafego: 60, influenciadores: 25, seeding: 15 }, history: [] };');

// Update the actual Split card. 
// It starts with `<h3 className="text-white text-sm font-semibold tracking-tight">Split de Investimentos</h3>`
const oldSplitStartRegex = /<div className="lg:col-span-7 bg-\[#0a0a0a\] border border-white\/5 rounded-2xl p-5 flex flex-col">[\s\S]*?\{/\* 2\. Meta vs Realizado \*\/\}/;

// Wait, I need to know where it ends.
// Let's first locate the exact block bounds.
