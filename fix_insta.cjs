const fs = require('fs');
let content = fs.readFileSync('src/pages/Marketing.tsx', 'utf8');

// 1. Remove all the messed up "Atualizar" buttons
content = content.replace(/<button onClick=\{\(\) => handleEditSocial\('.*?'\)\}.*?>Atualizar<\/button>/g, '');

// 2. Fix the "ltimos 7 dias" with weird chars to "Últimos 7 dias"
content = content.replace(/.altimos 7 dias/g, 'Últimos 7 dias');
content = content.replace(/.sltimos 7 dias/g, 'Últimos 7 dias');
content = content.replace(/ltimos 7 dias/g, 'Últimos 7 dias');

// 3. Add the button properly to Instagram
content = content.replace(
  /(<h3 className="text-white text-sm font-semibold tracking-tight">Instagram<\/h3>\s*<\/div>)\s*<span className="text-\[10px\] text-gray-500">Últimos 7 dias<\/span>/,
  `$1\n                        <div className="flex items-center gap-2"><span className="text-[10px] text-gray-500">Últimos 7 dias</span><button onClick={() => handleEditSocial('instagram')} className="bg-white/5 hover:bg-white/10 text-gray-400 px-2 py-1 rounded text-[9px] font-medium transition-colors border border-white/5">Atualizar</button></div>`
);

// 4. Add the button properly to TikTok
content = content.replace(
  /(<h3 className="text-white text-sm font-semibold tracking-tight">TikTok<\/h3>\s*<\/div>)\s*<span className="text-\[10px\] text-gray-500">Últimos 7 dias<\/span>/,
  `$1\n                        <div className="flex items-center gap-2"><span className="text-[10px] text-gray-500">Últimos 7 dias</span><button onClick={() => handleEditSocial('tiktok')} className="bg-white/5 hover:bg-white/10 text-gray-400 px-2 py-1 rounded text-[9px] font-medium transition-colors border border-white/5">Atualizar</button></div>`
);

fs.writeFileSync('src/pages/Marketing.tsx', content, 'utf8');
console.log("Done");
