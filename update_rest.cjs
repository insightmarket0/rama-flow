const fs = require('fs');
let content = fs.readFileSync('src/pages/Marketing.tsx', 'utf8');

let scalingCard = `                <div 
                  onClick={() => setIsScalingActive(!isScalingActive)}
                  className={\`bg-[#0a0a0a] border \${isScalingActive ? 'border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.15)]' : 'border-white/5'} rounded-2xl p-3.5 flex flex-col justify-between relative overflow-hidden cursor-pointer transition-all duration-300 group\`}
                >
                  <div className={\`absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent \${isScalingActive ? 'via-cyan-500' : 'via-white/10'} to-transparent transition-colors\`} ></div>
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-1.5">
                      <div className={\`p-1.5 rounded-lg \${isScalingActive ? 'bg-cyan-500/20' : 'bg-white/5'} transition-colors\`}>
                        <Flame className={\`w-4 h-4 \${isScalingActive ? 'text-cyan-400 drop-shadow-[0_0_5px_rgba(6,182,212,0.8)]' : 'text-gray-500'} transition-all\`} />
                      </div>
                      <span className={\`text-xs font-bold uppercase tracking-widest \${isScalingActive ? 'text-cyan-400' : 'text-gray-400'}\`}>Modo Scaling</span>
                    </div>
                    <div className={\`w-8 h-4 rounded-full flex items-center px-0.5 transition-colors \${isScalingActive ? 'bg-cyan-500' : 'bg-[#222]'}\`}>
                      <div className={\`w-3 h-3 bg-white rounded-full transition-transform \${isScalingActive ? 'translate-x-4' : 'translate-x-0'}\`}></div>
                    </div>
                  </div>
                  <div className="mt-auto">
                    {isScalingActive ? (
                      <div className="flex flex-col gap-1">
                        <span className="text-white text-xs font-semibold">Automação Ativa</span>
                        <p className="text-[9px] text-cyan-400/80 leading-tight">Injetando +20% de verba se o CPA &lt; R$ 15,00.</p>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-1">
                        <span className="text-gray-400 text-xs font-semibold">Pausado</span>
                        <p className="text-[9px] text-gray-600 leading-tight">Clique para ligar as regras de automação de campanhas.</p>
                      </div>
                    )}
                  </div>
                </div>`;
content = content.replace(/<div className="bg-gradient-to-br from-\[#111\] to-\[#0a0a0a\][\s\S]*?<\/div>\s*<\/div>\s*<\/div>/, scalingCard);

let orcCard = `                <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-3.5 flex flex-col justify-between relative overflow-hidden group hover:border-white/10 transition-colors cursor-pointer" onClick={handleEditBudget}>
                  <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="flex justify-between mb-1.5 items-center">
                    <span className="text-gray-500 text-[10px] font-medium tracking-widest uppercase">Orçamento ({getMonthName(marketingBudget.currentMonth)})</span>
                    <button className="bg-white/5 hover:bg-white/10 text-gray-400 px-2 py-0.5 rounded text-[9px] font-medium transition-colors border border-white/5 uppercase">Edit</button>
                  </div>
                  <div className="flex items-end justify-between mt-auto">
                    <span className="text-lg font-semibold text-white tracking-tight">R$ {marketingBudget.total.toLocaleString('pt-BR')}</span>
                    <span className="text-[10px] text-gray-400">{Math.round((marketingBudget.gasto/marketingBudget.total)*100 || 0)}% gasto</span>
                  </div>
                  <div className="w-full h-1 bg-[#1a1a1a] rounded-full mt-2 overflow-hidden relative">
                    <div className="h-full bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)] transition-all duration-500 relative z-10" style={{ width: \`\${Math.min((marketingBudget.gasto/marketingBudget.total)*100 || 0, 100)}%\` }}></div>
                  </div>
                </div>`;
content = content.replace(/<div className="bg-\[#0a0a0a\].*?currentKPI\.percentGasto\}%.*?<\/div>\s*<\/div>\s*<\/div>/, orcCard);

fs.writeFileSync('src/pages/Marketing.tsx', content, 'utf8');
console.log("Updated Scaling and Orcamento");
