const fs = require('fs');
let content = fs.readFileSync('src/pages/Marketing.tsx', 'utf8');

let cpaCard = `                <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-3.5 flex flex-col justify-between relative overflow-hidden group hover:border-white/10 transition-colors">
                  <div className="flex justify-between mb-1.5">
                    <span className="text-gray-500 text-[10px] font-medium tracking-widest uppercase">CPA (Custo Acq.)</span>
                    <Activity className="w-3.5 h-3.5 text-gray-600" />
                  </div>
                  <div className="flex items-center gap-2 mt-auto">
                    <span className="text-lg font-semibold text-white tracking-tight">{currentKPI?.cpa || "R$ 12,50"}</span>
                    <span className="flex items-center text-[10px] font-medium px-1.5 py-0.5 rounded-full border text-emerald-400 bg-emerald-400/10 border-emerald-400/20">
                      <ArrowDownRight className="w-2.5 h-2.5 mr-0.5" /> 8%
                    </span>
                  </div>
                </div>\n`;

// Insert it right before Modo Scaling inside TAB 4
content = content.replace(/(<div\s+onClick=\{\(\) => setIsScalingActive\(!isScalingActive\)\})/, cpaCard + '\n$1');

fs.writeFileSync('src/pages/Marketing.tsx', content, 'utf8');
console.log("Injected CPA card!");
