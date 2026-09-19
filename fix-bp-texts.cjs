const fs = require('fs');
let content = fs.readFileSync('src/pages/BusinessPlan.tsx', 'utf8');

// Header of the "Perfil de Público" and "Foco SP" etc
content = content.replace(/text-\[10px\] font-bold uppercase tracking-widest/g, 'text-xl md:text-2xl font-black uppercase tracking-tighter');
content = content.replace(/text-\[9px\] font-bold uppercase tracking-widest/g, 'text-lg md:text-xl font-black uppercase tracking-tighter');

// Badges
content = content.replace(/text-\[10px\] uppercase font-bold px-3 py-1/g, 'text-sm md:text-base uppercase font-black px-4 py-2 border-2 border-white/20');
content = content.replace(/border-4 border-\[\#CCFF00\] text-\[10px\] uppercase font-bold px-3 py-1/g, 'border-2 border-[#CCFF00] text-sm md:text-base uppercase font-black px-4 py-2');

// Text sizing for paragraphs in the grid
content = content.replace(/text-xs lg:text-sm/g, 'text-base lg:text-lg');
content = content.replace(/text-sm lg:text-base/g, 'text-lg lg:text-xl');

// Increase borders of grids
content = content.replace(/border-l border-white\/10/g, 'border-l-4 border-white/10');
content = content.replace(/border border-blue-500\/30/g, 'border-2 border-blue-500');

// Playbook grid contents (formatos & lives)
content = content.replace(/text-\[10px\] leading-relaxed/g, 'text-base leading-relaxed font-bold');

fs.writeFileSync('src/pages/BusinessPlan.tsx', content);
