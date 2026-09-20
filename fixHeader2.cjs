const fs = require('fs');
let content = fs.readFileSync('src/pages/BusinessPlan.tsx', 'utf-8');

const regex = /<div className="flex items-center justify-between">\s*<h2 className="text-white text-2xl font-black tracking-tight flex items-center gap-3">\s*<Network className="w-6 h-6 text-cyan-400" \/> Arquitetura do Neg.*?\s*<\/h2>\s*<span className="text-cyan-500 text-xs font-bold uppercase tracking-widest border border-cyan-500\/20 bg-cyan-500\/10 px-3 py-1 rounded-none">\s*Integra.*?\s*<\/span>\s*<\/div>/g;

const replacement = `<div className="flex items-center justify-between mb-6 border-b-4 border-white/20 pb-4">
                <h2 className="text-white text-3xl font-black uppercase tracking-tighter flex items-center gap-4">
                  <span className="w-5 h-5 bg-[#CCFF00]"></span>
                  ARQUITETURA DO NEGÓCIO
                </h2>
                <span className="bg-white text-black text-[10px] font-black uppercase tracking-[0.3em] px-4 py-2 border-2 border-transparent">
                  INTEGRAÇÃO MACRO
                </span>
              </div>`;

if (regex.test(content)) {
    content = content.replace(regex, replacement);
    fs.writeFileSync('src/pages/BusinessPlan.tsx', content, 'utf-8');
    console.log('Fixed header');
} else {
    console.log('Regex did not match');
}
