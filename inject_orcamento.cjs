const fs = require('fs');
let content = fs.readFileSync('src/pages/Marketing.tsx', 'utf8');

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
                </div>\n`;

// Insert it right before Vendas do Site inside TAB 4
let searchStr = `<div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-3.5 flex flex-col justify-between \nrelative overflow-hidden group hover:border-white/10 transition-colors">\n                    <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan-500/30 \nto-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>\n                    <div className="flex justify-between mb-1.5 items-center">\n                      <span className="text-gray-500 text-[10px] font-medium tracking-widest uppercase">Vendas do \nSite</span>`;
// actually because of formatting, just regex:
content = content.replace(/(<div className="bg-\[#0a0a0a\][^>]+>\s*<div[^>]+><\/div>\s*<div className="flex justify-between mb-1\.5 items-center">\s*<span[^>]+>Vendas do)/, orcCard + '\n$1');

fs.writeFileSync('src/pages/Marketing.tsx', content, 'utf8');
console.log("Injected Orçamento card!");
