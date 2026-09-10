const fs = require('fs');
let content = fs.readFileSync('src/pages/Marketing.tsx', 'utf8');

const hookAdd = `
  const [marketingBudget, setMarketingBudget] = useState({
    total: 5000,
    gasto: 3250
  });
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [budgetForm, setBudgetForm] = useState({ total: 0, gasto: 0 });

  React.useEffect(() => {
    const saved = localStorage.getItem("rama_marketing_budget");
    if (saved) {
      try { setMarketingBudget(JSON.parse(saved)); } catch(e) {}
    }
  }, []);

  const handleEditBudget = () => {
    setBudgetForm(marketingBudget);
    setIsBudgetModalOpen(true);
  };

  const handleSaveBudget = () => {
    setMarketingBudget(budgetForm);
    localStorage.setItem("rama_marketing_budget", JSON.stringify(budgetForm));
    setIsBudgetModalOpen(false);
  };
`;

// Insert the new hook state just after the social metrics hook
content = content.replace(/(const \[socialForm, setSocialForm\] = useState\(\{.*?\}\);)/, `$1\n${hookAdd}`);

// Replace the hardcoded ORÇAMENTO block
const oldOrcamentoBlock = `<div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-3.5 flex flex-col justify-between \r?\n?relative overflow-hidden group hover:border-white/10 transition-colors">\r?\n?\\s*<div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 \r?\n?to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>\r?\n?\\s*<div className="flex justify-between mb-1.5">\r?\n?\\s*<span className="text-gray-500 text-\\[10px\\] font-medium tracking-widest uppercase">Or.*?amento</span>\r?\n?\\s*<DollarSign className="w-3.5 h-3.5 text-gray-600" />\r?\n?\\s*<\/div>\r?\n?\\s*<div className="flex items-end justify-between">\r?\n?\\s*<span className="text-lg font-semibold text-white tracking-tight">\{currentKPI.orcamento\}</span>\r?\n?\\s*<span className="text-\\[10px\\] text-gray-500">\{currentKPI.percentGasto\}% gasto</span>\r?\n?\\s*<\/div>\r?\n?\\s*<div className="w-full h-1 bg-\\[#1a1a1a\\] rounded-full mt-2 overflow-hidden">\r?\n?\\s*<div className="h-full bg-cyan-500 shadow-\\[0_0_10px_rgba\\(6,182,212,0.5\\)\\] transition-all \r?\n?duration-500" style=\{\{ width: \`\\\$\{currentKPI.percentGasto\}%\` \}\}></div\r?\n?>\\s*<\/div>\r?\n?\\s*<\/div>`;

const newOrcamentoBlock = `
                <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-3.5 flex flex-col justify-between relative overflow-hidden group hover:border-white/10 transition-colors">
                  <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="flex justify-between mb-1.5 items-center">
                    <span className="text-gray-500 text-[10px] font-medium tracking-widest uppercase">Orçamento</span>
                    <button onClick={handleEditBudget} className="bg-white/5 hover:bg-white/10 text-gray-400 px-2 py-0.5 rounded text-[9px] font-medium transition-colors border border-white/5 uppercase flex items-center gap-1">Lançar +</button>
                  </div>
                  <div className="flex items-end justify-between">
                    <span className="text-lg font-semibold text-white tracking-tight">R$ {marketingBudget.total.toLocaleString('pt-BR')}</span>
                    <span className="text-[10px] text-gray-500">{marketingBudget.total > 0 ? Math.round((marketingBudget.gasto / marketingBudget.total) * 100) : 0}% gasto</span>
                  </div>
                  <div className="w-full h-1 bg-[#1a1a1a] rounded-full mt-2 overflow-hidden">
                    <div className="h-full bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)] transition-all duration-500" style={{ width: \`\${marketingBudget.total > 0 ? Math.min(100, Math.round((marketingBudget.gasto / marketingBudget.total) * 100)) : 0}%\` }}></div>
                  </div>
                </div>
`;

// It's safer to just replace by finding the Orçamento string
let idx = content.indexOf('uppercase">Oramento</span>');
if (idx === -1) idx = content.indexOf('uppercase">Orçamento</span>');
if (idx !== -1) {
    let startIdx = content.lastIndexOf('<div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-3.5 flex flex-col justify-between', idx);
    let endIdx = content.indexOf('</div>\n  \n                <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-3.5', idx);
    if(endIdx === -1) endIdx = content.indexOf('</div>\r\n  \r\n                <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-3.5', idx);
    if(endIdx === -1) endIdx = content.indexOf('</div>\n                <div className="bg-[#0a0a0a]', idx);
    if (startIdx !== -1 && endIdx !== -1) {
        let blockToReplace = content.substring(startIdx, endIdx + 6); // include </div>
        content = content.replace(blockToReplace, newOrcamentoBlock.trim());
        console.log("Orcamento block replaced.");
    } else {
        console.log("Could not find bounds of Orcamento block.");
    }
} else {
    console.log("Could not find Orcamento text.");
}

const budgetModalCode = `
      {isBudgetModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsBudgetModalOpen(false)}></div>
          <div className="bg-[#111] border border-[#222] rounded-2xl p-6 relative z-10 w-full max-w-sm shadow-2xl flex flex-col gap-4">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h3 className="text-white font-semibold flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-cyan-400" />
                Atualizar Orçamento
              </h3>
              <button onClick={() => setIsBudgetModalOpen(false)} className="text-gray-500 hover:text-white">x</button>
            </div>
            
            <div className="space-y-4 mt-2">
              <div>
                <label className="text-[10px] uppercase font-bold text-gray-500 mb-1 block">Orçamento Total (R$)</label>
                <input type="number" value={budgetForm.total} onChange={e => setBudgetForm({...budgetForm, total: parseInt(e.target.value) || 0})} className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-cyan-500 outline-none" />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-gray-500 mb-1 block">Valor Gasto (R$)</label>
                <input type="number" value={budgetForm.gasto} onChange={e => setBudgetForm({...budgetForm, gasto: parseInt(e.target.value) || 0})} className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-cyan-500 outline-none" />
              </div>
            </div>

            <button onClick={handleSaveBudget} className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-sm py-2.5 rounded-lg mt-2 transition-colors">
              Salvar Orçamento
            </button>
          </div>
        </div>
      )}
`;

content = content.replace(/(<\/div>\s*\r?\n\s*\);\r?\n\})\s*$/, `\n${budgetModalCode}\n$1`);
fs.writeFileSync('src/pages/Marketing.tsx', content, 'utf8');
console.log("Budget modal injected.");
