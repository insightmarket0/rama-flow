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
    content = content.replace('const handleEditBudget = () => {', hookUpdates + '\n  const handleEditBudget = () => {');
}

// Update the initial currentData to include vendas
content = content.replace(/let currentData = \{ currentMonth: getCurrentMonthStr\(\), total: 5000, gasto: 3250, history: \[\] \};/, 'let currentData = { currentMonth: getCurrentMonthStr(), total: 5000, gasto: 3250, vendas: 0, vendasGrowth: 0, history: [] };');

// Update handleConfirmNewMonth to reset vendas and store them in history
content = content.replace(/gasto: marketingBudget\.gasto(\s*)\}\];/g, 'gasto: marketingBudget.gasto, vendas: marketingBudget.vendas || 0$1}];');
content = content.replace(/gasto: 0,(\s*)history:/g, 'gasto: 0, vendas: 0, vendasGrowth: 0,$1history:');

// Replace the Vendas do Site card
const oldVendasCard = /<div className="bg-\[#0a0a0a\] border border-white\/5 rounded-2xl p-3\.5 flex flex-col justify-between[\s\S]*?\{currentKPI\.vendasTrend\}%[\s\S]*?<\/div>\s*<\/div>/;

const newVendasCard = `
                <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-3.5 flex flex-col justify-between relative overflow-hidden group hover:border-white/10 transition-colors">
                  <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="flex justify-between mb-1.5 items-center">
                    <span className="text-gray-500 text-[10px] font-medium tracking-widest uppercase">Vendas do Site</span>
                    <button onClick={handleEditSales} className="bg-white/5 hover:bg-white/10 text-gray-400 px-2 py-0.5 rounded text-[9px] font-medium transition-colors border border-white/5 uppercase flex items-center gap-1">Lançar +</button>
                  </div>
                  <div className="flex items-center gap-2 mt-auto">
                    <span className="text-lg font-semibold text-white tracking-tight">R$ {(marketingBudget.vendas || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    <span className="flex items-center text-cyan-400 text-[10px] font-medium bg-cyan-500/10 px-1.5 py-0.5 rounded-full border border-cyan-500/20">
                      <ArrowUpRight className="w-2.5 h-2.5 mr-0.5" /> {marketingBudget.vendasGrowth || 0}%
                    </span>
                  </div>
                </div>`;

if (content.match(oldVendasCard)) {
    content = content.replace(oldVendasCard, newVendasCard.trim());
} else {
    console.log("Could not match old vendas card");
}

// Inject sales modal
const salesModal = `
      {isSalesModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsSalesModalOpen(false)}></div>
          <div className="bg-[#111] border border-[#222] rounded-2xl p-6 relative z-10 w-full max-w-sm shadow-2xl flex flex-col gap-4">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h3 className="text-white font-semibold flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-cyan-400" />
                Vendas do Site
              </h3>
              <button onClick={() => setIsSalesModalOpen(false)} className="text-gray-500 hover:text-white">x</button>
            </div>
            
            <div className="space-y-4 mt-2">
              <div>
                <label className="text-[10px] uppercase font-bold text-gray-500 mb-1 block">Total em Vendas (R$)</label>
                <input type="number" value={salesForm.vendas} onChange={e => setSalesForm({...salesForm, vendas: parseFloat(e.target.value) || 0})} className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-cyan-500 outline-none" />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-gray-500 mb-1 block">Crescimento (%)</label>
                <input type="number" value={salesForm.vendasGrowth} onChange={e => setSalesForm({...salesForm, vendasGrowth: parseFloat(e.target.value) || 0})} className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-cyan-500 outline-none" />
              </div>
            </div>

            <button onClick={handleSaveSales} className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-sm py-2.5 rounded-lg mt-2 transition-colors">
              Salvar Vendas
            </button>
          </div>
        </div>
      )}
`;

if (!content.includes('isSalesModalOpen && (')) {
    content = content.replace(/(<\/div>\s*\r?\n\s*\);\r?\n\})\s*$/, `\n${salesModal}\n$1`);
}

fs.writeFileSync('src/pages/Marketing.tsx', content, 'utf8');
console.log("Success! Added sales card logic.");
