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

// Ensure budgetSplit in defaults
content = content.replace(/let currentData = \{ currentMonth: getCurrentMonthStr\(\), total: 5000, gasto: 3250, vendas: 0, vendasGrowth: 0, history: \[\] \};/g, 'let currentData = { currentMonth: getCurrentMonthStr(), total: 5000, gasto: 3250, vendas: 0, vendasGrowth: 0, budgetSplit: { trafego: 60, influenciadores: 25, seeding: 15 }, history: [] };');


// Replace Split card
const startMarker = '{/* 1. Distribuição de Verba (Burn Rate & Split) */}';
const startMarker2 = '{/* 1. Distribui';
let startIdx = content.indexOf(startMarker);
if (startIdx === -1) {
    let altMatch = content.match(/\{\/\* 1\. Distribui[\s\S]*?\*\/\}/);
    if (altMatch) startIdx = altMatch.index;
}

const endMarker = '{/* 2. Meta vs Realizado */}';
let endIdx = content.indexOf(endMarker);

if (startIdx !== -1 && endIdx !== -1) {
    const oldBlock = content.substring(startIdx, endIdx);
    
    const newSplitCard = `
                  {/* 1. Divisão do Orçamento (Onde investimos) */}
                  <div className="lg:col-span-7 bg-[#0a0a0a] border border-white/5 rounded-2xl p-5 flex flex-col relative overflow-hidden group">
                    <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="flex items-center justify-between mb-6 relative z-10">
                      <div className="flex items-center gap-2">
                        <h3 className="text-white text-sm font-semibold tracking-tight">Divisão do Orçamento</h3>
                        <button onClick={handleEditSplit} className="bg-white/5 hover:bg-white/10 text-gray-400 px-2 py-0.5 rounded text-[9px] font-medium transition-colors border border-white/5 uppercase flex items-center gap-1">Lançar +</button>
                      </div>
                      <span className="text-xs text-gray-500 font-medium tracking-widest uppercase">{getMonthName(marketingBudget.currentMonth)}</span>
                    </div>
                    
                    <div className="space-y-5 mt-auto relative z-10">
                      <div>
                        <div className="flex justify-between text-xs mb-1.5">
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.8)]"></span>
                            <span className="text-gray-300 font-medium">Tráfego Pago (Meta/TikTok)</span>
                          </div>
                          <span className="text-white font-bold">{marketingBudget.budgetSplit?.trafego || 0}%</span>
                        </div>
                        <div className="w-full h-2 bg-[#1a1a1a] rounded-full overflow-hidden">
                          <div className="h-full bg-cyan-500 transition-all duration-500" style={{ width: \`\${marketingBudget.budgetSplit?.trafego || 0}%\` }}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-xs mb-1.5">
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.8)]"></span>
                            <span className="text-gray-300 font-medium">Cachê (Influenciadores)</span>
                          </div>
                          <span className="text-white font-bold">{marketingBudget.budgetSplit?.influenciadores || 0}%</span>
                        </div>
                        <div className="w-full h-2 bg-[#1a1a1a] rounded-full overflow-hidden">
                          <div className="h-full bg-purple-500 transition-all duration-500" style={{ width: \`\${marketingBudget.budgetSplit?.influenciadores || 0}%\` }}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-xs mb-1.5">
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.8)]"></span>
                            <span className="text-gray-300 font-medium">Envio de Produtos (Seeding)</span>
                          </div>
                          <span className="text-white font-bold">{marketingBudget.budgetSplit?.seeding || 0}%</span>
                        </div>
                        <div className="w-full h-2 bg-[#1a1a1a] rounded-full overflow-hidden">
                          <div className="h-full bg-orange-500 transition-all duration-500" style={{ width: \`\${marketingBudget.budgetSplit?.seeding || 0}%\` }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  `;
    
    content = content.replace(oldBlock, newSplitCard + '\n                  ');
} else {
    console.log("Could not find start or end index for Split card");
}

const splitModal = `
      {isSplitModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsSplitModalOpen(false)}></div>
          <div className="bg-[#111] border border-[#222] rounded-2xl p-6 relative z-10 w-full max-w-sm shadow-2xl flex flex-col gap-4">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h3 className="text-white font-semibold">
                Divisão do Orçamento (%)
              </h3>
              <button onClick={() => setIsSplitModalOpen(false)} className="text-gray-500 hover:text-white">x</button>
            </div>
            
            <div className="space-y-4 mt-2">
              <div>
                <label className="text-[10px] uppercase font-bold text-gray-500 mb-1 flex items-center gap-2">
                  <span className="w-2 h-2 rounded bg-cyan-500"></span> Tráfego Pago
                </label>
                <input type="number" value={splitForm.trafego} onChange={e => setSplitForm({...splitForm, trafego: parseInt(e.target.value) || 0})} className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-cyan-500 outline-none" />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-gray-500 mb-1 flex items-center gap-2">
                  <span className="w-2 h-2 rounded bg-purple-500"></span> Influenciadores
                </label>
                <input type="number" value={splitForm.influenciadores} onChange={e => setSplitForm({...splitForm, influenciadores: parseInt(e.target.value) || 0})} className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-cyan-500 outline-none" />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-gray-500 mb-1 flex items-center gap-2">
                  <span className="w-2 h-2 rounded bg-orange-500"></span> Envio de Produtos
                </label>
                <input type="number" value={splitForm.seeding} onChange={e => setSplitForm({...splitForm, seeding: parseInt(e.target.value) || 0})} className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-cyan-500 outline-none" />
              </div>
              
              {(splitForm.trafego + splitForm.influenciadores + splitForm.seeding !== 100) && (
                <p className="text-[10px] text-yellow-500 bg-yellow-500/10 p-2 rounded border border-yellow-500/20">Atenção: A soma dos valores é diferente de 100%.</p>
              )}
            </div>

            <button onClick={handleSaveSplit} className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-sm py-2.5 rounded-lg mt-2 transition-colors">
              Salvar Divisão
            </button>
          </div>
        </div>
      )}
`;

if (!content.includes('isSplitModalOpen && (')) {
    content = content.replace(/(<\/div>\s*\r?\n\s*\);\r?\n\})\s*$/, `\n${splitModal}\n$1`);
}

fs.writeFileSync('src/pages/Marketing.tsx', content, 'utf8');
console.log("Success! Split card updated.");
