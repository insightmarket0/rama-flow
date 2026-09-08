const fs = require('fs');
let content = fs.readFileSync('src/pages/Marketing.tsx', 'utf8');

// Replace using a more generic regex for the span
content = content.replace(/(<span className="text-\[10px\] text-gray-500">.*?7 dias<\/span>)/, `$1\n                        <button onClick={() => handleEditSocial('instagram')} className="bg-white/5 hover:bg-white/10 text-gray-400 px-2 py-1 rounded text-[9px] font-medium transition-colors border border-white/5 ml-2">Atualizar</button>`);

content = content.replace(/(<span className="text-\[10px\] text-gray-500">.*?7 dias<\/span>)/, `$1\n                        <button onClick={() => handleEditSocial('tiktok')} className="bg-white/5 hover:bg-white/10 text-gray-400 px-2 py-1 rounded text-[9px] font-medium transition-colors border border-white/5 ml-2">Atualizar</button>`);

fs.writeFileSync('src/pages/Marketing.tsx', content, 'utf8');
console.log("Done patching buttons.");
