const fs = require('fs');

let content = fs.readFileSync('src/pages/MuralAjustes.tsx', 'utf-8');

// Fix Tabs Style
content = content.replace(
  /\n\s*isActive \n\s*\? 'bg-white\/10 text-white border-b-2 border-\[#CCFF00\]' \n\s*: 'text-gray-500 hover:text-gray-300 hover:bg-white\/5 border-b-2 border-transparent'\n\s*\}/g,
  "\n                isActive ? 'bg-[#CCFF00] text-black border-2 border-[#CCFF00]' : 'text-gray-500 hover:text-white bg-[#111111] border-2 border-white/10 hover:border-white/30'\n              }"
);

fs.writeFileSync('src/pages/MuralAjustes.tsx', content, 'utf-8');
console.log('Fixed tabs!');
