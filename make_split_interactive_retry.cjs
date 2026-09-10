const fs = require('fs');
let content = fs.readFileSync('src/pages/Marketing.tsx', 'utf8');

const startMarker = '<div className="lg:col-span-7 bg-[#0a0a0a] border border-white/5 rounded-2xl p-5 flex flex-col relative overflow-hidden group">';
let startIdx = content.indexOf(startMarker);
const endMarker = '{/* 2.';
let endIdx = content.indexOf(endMarker, startIdx);

if (startIdx !== -1 && endIdx !== -1) {
    const oldBlock = content.substring(startIdx, endIdx);
    
    const newSplitCard = `
                  <div className="lg:col-span-7 bg-[#0a0a0a] border border-white/5 rounded-2xl p-5 flex flex-col relative overflow-hidden group">
                    <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="flex items-center justify-between mb-6 relative z-10">
                      <div className="flex items-center gap-2">
                        <h3 className="text-white text-sm font-semibold tracking-tight">Divisão do Orçamento (Onde investimos)</h3>
                        <span className="bg-white/5 text-gray-400 px-2 py-0.5 rounded text-[9px] font-bold tracking-widest uppercase border border-white/5">Interativo</span>
                      </div>
                      <span className="text-xs text-gray-500 font-medium tracking-widest uppercase">{getMonthName(marketingBudget.currentMonth)}</span>
                    </div>
                    
                    <div className="space-y-6 mt-auto relative z-10">
                      <div>
                        <div className="flex justify-between text-xs mb-2">
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.8)]"></span>
                            <span className="text-gray-300 font-medium">Tráfego Pago (Meta/TikTok)</span>
                          </div>
                          <span className="text-white font-bold text-sm">{marketingBudget.budgetSplit?.trafego || 0}%</span>
                        </div>
                        <div className="relative w-full h-3 bg-[#1a1a1a] rounded-full overflow-hidden hover:bg-[#222] transition-colors cursor-ew-resize">
                          <div className="h-full bg-cyan-500 transition-all duration-75 pointer-events-none" style={{ width: \`\${marketingBudget.budgetSplit?.trafego || 0}%\` }}></div>
                          <input 
                            type="range" min="0" max="100" 
                            value={marketingBudget.budgetSplit?.trafego || 0}
                            onChange={(e) => handleSplitChange('trafego', parseInt(e.target.value))}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize m-0 p-0"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-xs mb-2">
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.8)]"></span>
                            <span className="text-gray-300 font-medium">Cachê (Influenciadores)</span>
                          </div>
                          <span className="text-white font-bold text-sm">{marketingBudget.budgetSplit?.influenciadores || 0}%</span>
                        </div>
                        <div className="relative w-full h-3 bg-[#1a1a1a] rounded-full overflow-hidden hover:bg-[#222] transition-colors cursor-ew-resize">
                          <div className="h-full bg-purple-500 transition-all duration-75 pointer-events-none" style={{ width: \`\${marketingBudget.budgetSplit?.influenciadores || 0}%\` }}></div>
                          <input 
                            type="range" min="0" max="100" 
                            value={marketingBudget.budgetSplit?.influenciadores || 0}
                            onChange={(e) => handleSplitChange('influenciadores', parseInt(e.target.value))}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize m-0 p-0"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-xs mb-2">
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.8)]"></span>
                            <span className="text-gray-300 font-medium">Envio de Produtos (Seeding)</span>
                          </div>
                          <span className="text-white font-bold text-sm">{marketingBudget.budgetSplit?.seeding || 0}%</span>
                        </div>
                        <div className="relative w-full h-3 bg-[#1a1a1a] rounded-full overflow-hidden hover:bg-[#222] transition-colors cursor-ew-resize">
                          <div className="h-full bg-orange-500 transition-all duration-75 pointer-events-none" style={{ width: \`\${marketingBudget.budgetSplit?.seeding || 0}%\` }}></div>
                          <input 
                            type="range" min="0" max="100" 
                            value={marketingBudget.budgetSplit?.seeding || 0}
                            onChange={(e) => handleSplitChange('seeding', parseInt(e.target.value))}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize m-0 p-0"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
`;
    content = content.replace(oldBlock, newSplitCard + '\n                  ');

    // And remove isSplitModalOpen modal since it's not needed anymore
    // but just to be safe, we can leave it since it won't be opened without the button.
    
    // Also, make sure handleSplitChange is actually available
    const splitLogic = `
  const handleSplitChange = (key, newValue) => {
    const currentSplit = marketingBudget.budgetSplit || { trafego: 60, influenciadores: 25, seeding: 15 };
    const oldVal = currentSplit[key];
    let delta = newValue - oldVal;
    
    if (newValue > 100) newValue = 100;
    if (newValue < 0) newValue = 0;
    
    const others = ['trafego', 'influenciadores', 'seeding'].filter(k => k !== key);
    const otherTotal = currentSplit[others[0]] + currentSplit[others[1]];

    let newForm = { ...currentSplit, [key]: newValue };

    if (otherTotal === 0) {
       const remainder = 100 - newValue;
       newForm[others[0]] = Math.round(remainder / 2);
       newForm[others[1]] = remainder - newForm[others[0]];
    } else {
       const remainder = 100 - newValue;
       let val0 = Math.round((currentSplit[others[0]] / otherTotal) * remainder);
       let val1 = remainder - val0;
       newForm[others[0]] = val0;
       newForm[others[1]] = val1;
    }
    
    const updated = { ...marketingBudget, budgetSplit: newForm };
    setMarketingBudget(updated);
    localStorage.setItem("rama_marketing_budget", JSON.stringify(updated));
  };
`;
    if (!content.includes('const handleSplitChange')) {
        content = content.replace('const handleEditSplit = () => {', splitLogic + '\n  const handleEditSplit = () => {');
    }

    fs.writeFileSync('src/pages/Marketing.tsx', content, 'utf8');
    console.log("Success! Replaced correctly.");
} else {
    console.log("Failed to find bounds.");
}
