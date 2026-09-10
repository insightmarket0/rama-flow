const fs = require('fs');
let content = fs.readFileSync('src/pages/Marketing.tsx', 'utf8');

const newOrcamentoBlock = `
                <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-3.5 flex flex-col justify-between relative overflow-hidden group hover:border-white/10 transition-colors">
                  <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="flex justify-between mb-1.5 items-center">
                    <span className="text-gray-500 text-[10px] font-medium tracking-widest uppercase">Orçamento</span>
                    <button onClick={handleEditBudget} className="bg-white/5 hover:bg-white/10 text-gray-400 px-2 py-0.5 rounded text-[9px] font-medium transition-colors border border-white/5 uppercase flex items-center gap-1">Editar</button>
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

let blockRegex = /<div className="bg-\[#0a0a0a\] border border-white\/5 rounded-2xl p-3\.5 flex flex-col justify-between[\s\S]*?\{currentKPI\.orcamento\}[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/;

if (content.match(blockRegex)) {
    content = content.replace(blockRegex, newOrcamentoBlock.trim());
    fs.writeFileSync('src/pages/Marketing.tsx', content, 'utf8');
    console.log("Success");
} else {
    console.log("Regex didn't match");
}
