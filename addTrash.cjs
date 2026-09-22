const fs = require('fs');
let content = fs.readFileSync('src/pages/MuralAjustes.tsx', 'utf-8');

content = content.replace(
  /<div className="p-5 border-b border-white\/5 flex items-center gap-3">\s*<Activity className="h-4 w-4 text-\[#00FF00\]" \/>\s*<h3 className="text-white font-bold text-xs tracking-widest uppercase">Feed de Auditoria<\/h3>\s*<\/div>/m,
  `<div className="p-5 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Activity className="h-4 w-4 text-[#00FF00]" />
              <h3 className="text-white font-bold text-xs tracking-widest uppercase">Feed de Auditoria</h3>
            </div>
            <button onClick={handleClearHistory} className="text-gray-500 hover:text-red-400 transition-colors bg-white/5 hover:bg-white/10 p-1.5 rounded-md" title="Limpar Histórico">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>`
);

fs.writeFileSync('src/pages/MuralAjustes.tsx', content, 'utf-8');
console.log('Added trash button to audit sidebar.');
