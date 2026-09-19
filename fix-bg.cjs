const fs = require('fs');
let content = fs.readFileSync('src/pages/Marketing.tsx', 'utf8');

// Replace background
content = content.replace(
  /className="flex flex-col h-full w-full pl-24 bg-\[\#040809\] bg-\[radial-gradient[^"]+"/,
  'className="flex flex-col h-full w-full pl-24 bg-[#050505] font-sans pb-20 md:pb-0 overflow-hidden relative"'
);

// We can also apply some brutalist styles to the cards in the first row
// For instance bg-[#0a0a0a] -> bg-[#111111]
content = content.replace(/bg-\[\#0a0a0a\]/g, 'bg-[#111111] border-2 border-white/10 hover:border-white/30 rounded-none');
content = content.replace(/border-white\/5/g, 'border-white/10');
content = content.replace(/rounded-2xl/g, 'rounded-none');

fs.writeFileSync('src/pages/Marketing.tsx', content);
