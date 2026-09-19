const fs = require('fs');
let content = fs.readFileSync('src/pages/BusinessPlan.tsx', 'utf8');

// Replace small card headers with massive brutalist headers
// Example: h4 className="text-[#CCFF00] text-[10px] lg:text-xs font-bold uppercase tracking-widest...
content = content.replace(/<h4 className="text-\[\#CCFF00\] text-\[10px\] lg:text-xs font-bold/g, '<h4 className="text-[#CCFF00] text-xl lg:text-3xl font-black');
content = content.replace(/<h4 className="text-black text-\[10px\] font-bold/g, '<h4 className="text-black text-2xl lg:text-3xl font-black');

// For "1. O Exército do ABC", etc. inside the Playbook block
content = content.replace(/<h5 className="text-white text-sm font-bold flex items-center gap-2">/g, '<h5 className="text-[#CCFF00] text-xl md:text-2xl font-black flex items-center gap-2 uppercase tracking-tighter">');
content = content.replace(/<span className="w-2 h-2 rounded-none bg-\[\#CCFF00\]" \/>/g, '<span className="w-4 h-4 rounded-none bg-[#CCFF00] mr-2" />'); // Bigger square bullet

// For the main sections like "Estratégia e Crescimento"
content = content.replace(/<h2 className="text-4xl font-black tracking-tight text-white">/g, '<h2 className="text-5xl lg:text-7xl font-black tracking-tighter uppercase text-white leading-none">');

fs.writeFileSync('src/pages/BusinessPlan.tsx', content);
