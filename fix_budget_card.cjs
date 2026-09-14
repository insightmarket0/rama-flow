const fs = require('fs');
let content = fs.readFileSync('src/pages/Marketing.tsx', 'utf-8');

const budgetCardRegex = /<div className="bg-\\[#0a0a0a\\] border border-white\\/5 rounded-2xl p-3\\.5 flex flex-col justify-between relative overflow-hidden group hover:border-white\\/10 transition-colors cursor-pointer" onClick=\{handleEditBudget\}>[\\s\\S]*?<div className="h-full bg-cyan-500 shadow-\\[0_0_10px_rgba\\(6,182,212,0\\.5\\)\\] transition-all duration-500 relative z-10" style=\{\{ width: \\\$\\{Math\\.min\\(\\(marketingBudget\\.gasto\\/marketingBudget\\.total\\)\\*100 \\|\\| 0, 100\\)\\}\\%\ \\}\\}\\><\\/div>\\s*<\\/div>\\s*<\\/div>/;

const newBudgetCard = \              <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-3.5 flex flex-col justify-between relative overflow-hidden group hover:border-white/10 transition-colors">
                  <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="flex justify-between mb-1.5 items-center">
                    <span className="text-gray-500 text-[10px] font-medium tracking-widest uppercase">Orçamento ({getMonthName(marketingBudget.currentMonth)})</span>
                    <button onClick={handleEditBudget} className="bg-white/5 hover:bg-white/10 text-gray-400 px-2 py-0.5 rounded text-[9px] font-medium transition-colors border border-white/5 uppercase">Edit</button>
                  </div>
                  <div className="flex items-end justify-between mt-auto">
                    <span className="text-lg font-semibold text-white tracking-tight">R$ {marketingBudget.total.toLocaleString('pt-BR')}</span>
                    <span className="text-[10px] text-gray-400">{Math.round((marketingBudget.gasto/marketingBudget.total)*100 || 0)}% gasto</span>
                  </div>
                  <div className="w-full h-1 bg-[#1a1a1a] rounded-full mt-2 overflow-hidden relative">
                    <div className="h-full bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)] transition-all duration-500 relative z-10" style={{ width: \\\\\\%\\\ }}></div>
                  </div>
                  
                  <div className="mt-3 flex flex-col border-t border-white/5 pt-2">
                    <button 
                      onClick={() => setIsHistoryExpanded(!isHistoryExpanded)} 
                      className="text-[9px] font-bold text-gray-500 hover:text-cyan-400 transition-colors uppercase tracking-widest mx-auto"
                    >
                      {isHistoryExpanded ? "ESCONDER HISTÓRICO" : "VER HISTÓRICO"}
                    </button>
                    
                    {isHistoryExpanded && (
                      <div className="mt-3 space-y-2 max-h-32 overflow-y-auto custom-scrollbar pr-1">
                        {!marketingBudget.history || marketingBudget.history.length === 0 ? (
                          <p className="text-[10px] text-gray-600 text-center py-2">Nenhum histórico salvo.</p>
                        ) : (
                          marketingBudget.history.map((h, i) => (
                            <div key={i} className="flex justify-between items-center bg-[#111] p-2 rounded-lg border border-white/5">
                              <span className="text-[10px] font-bold text-gray-400 capitalize">{h.month}</span>
                              <div className="text-right">
                                <div className="text-[10px] font-medium text-white">R$ {h.total.toLocaleString('pt-BR')}</div>
                                <div className="text-[8px] text-gray-500">{Math.round((h.gasto/h.total)*100 || 0)}% gasto</div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                </div>\;

content = content.replace(budgetCardRegex, newBudgetCard);

// Also fix grid-cols-4 to grid-cols-2
content = content.replace('<div className="grid grid-cols-4 gap-3 shrink-0">', '<div className="grid grid-cols-2 gap-3 shrink-0">');

// Also inject the social media cards (Instagram and TikTok) that were missing!
// We can just add them after the Painéis Corporativos end.
// Wait, Painéis Corporativos is further down inside activeTab === "orcamento"!

fs.writeFileSync('src/pages/Marketing.tsx', content, 'utf-8');
console.log('Fixed budget card');
