const fs = require('fs');
let content = fs.readFileSync('src/pages/Marketing.tsx', 'utf8');

const startMarker = '<div className="lg:col-span-7 bg-[#0a0a0a] border border-white/5 rounded-2xl p-5 flex flex-col">';
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
                        <button onClick={handleEditSplit} className="bg-white/5 hover:bg-white/10 text-gray-400 px-2 py-0.5 rounded text-[9px] font-bold tracking-widest uppercase transition-colors border border-white/5 flex items-center gap-1">Lançar +</button>
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
    fs.writeFileSync('src/pages/Marketing.tsx', content, 'utf8');
    console.log("Success! Split card replaced.");
} else {
    console.log("Still could not find bounds.");
}
