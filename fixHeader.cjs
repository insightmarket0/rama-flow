const fs = require('fs');
let content = fs.readFileSync('src/pages/BusinessPlan.tsx', 'utf-8');

const toReplace = `              <div className="flex items-center justify-between">
                <h2 className="text-white text-2xl font-black tracking-tight flex items-center gap-3">
                  <Network className="w-6 h-6 text-cyan-400" /> Arquitetura do Negcio
                </h2>
                <span className="text-cyan-500 text-xs font-bold uppercase tracking-widest border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 rounded-none">
                  Integraǜo Macro
                </span>
              </div>`;

// Wait, the encoding of Arquitetura do Negócio could be weird, so let's do a substring replace based on index
const startStr = '              <div className="flex items-center justify-between">\n                <h2 className="text-white text-2xl font-black tracking-tight flex items-center gap-3">';
let startIndex = content.indexOf(startStr);
if (startIndex !== -1) {
    const endStr = '              </div>\n  \n                            {/* Grid Principal do Ecossistema Brutalista */}';
    let endIndex = content.indexOf('              </div>', startIndex);
    
    if (endIndex !== -1) {
        const replacement = `              <div className="flex items-center justify-between mb-6 border-b-4 border-white/20 pb-4">
                <h2 className="text-white text-3xl font-black uppercase tracking-tighter flex items-center gap-4">
                  <span className="w-5 h-5 bg-[#CCFF00]"></span>
                  ARQUITETURA DO NEGÓCIO
                </h2>
                <span className="bg-white text-black text-[10px] font-black uppercase tracking-[0.3em] px-4 py-2 border-2 border-transparent">
                  INTEGRAÇÃO MACRO
                </span>
              </div>`;
        
        content = content.substring(0, startIndex) + replacement + content.substring(endIndex + 20);
        fs.writeFileSync('src/pages/BusinessPlan.tsx', content, 'utf-8');
        console.log('Fixed header');
    }
} else {
    console.log('Start string not found');
}
