const fs = require('fs');

let content = fs.readFileSync('src/pages/MuralAjustes.tsx', 'utf-8');

// Change neon color everywhere
content = content.replace(/#00FF00/g, '#CCFF00');

// Header
content = content.replace(
  '<h2 className="text-2xl font-light tracking-tight text-white flex items-center gap-2 mb-1">',
  '<h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white flex items-center gap-4 mb-2">'
);
content = content.replace(
  '<AlertCircle className="h-5 w-5 text-[#CCFF00] drop-shadow-[0_0_10px_rgba(0,255,0,0.3)]" />',
  '<AlertCircle className="h-10 w-10 text-[#CCFF00]" />'
);
content = content.replace(
  '<p className="text-gray-500 font-medium text-[9px] tracking-widest uppercase">',
  '<p className="text-[#CCFF00] font-bold text-xs tracking-[0.3em] uppercase bg-white/5 inline-block px-3 py-1 border border-white/10">'
);

// Tabs
content = content.replace(
  'rounded-md text-[10px] font-bold uppercase tracking-wider whitespace-nowrap transition-all flex items-center gap-2',
  'rounded-none text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all flex items-center gap-2'
);
content = content.replace(
  "isActive \n                  ? 'bg-white/10 text-white border-b-2 border-[#CCFF00]' \n                  : 'text-gray-500 hover:text-gray-300 hover:bg-white/5 border-b-2 border-transparent'",
  "isActive ? 'bg-[#CCFF00] text-black border-2 border-[#CCFF00]' : 'text-gray-500 hover:text-white bg-[#111111] border-2 border-white/10 hover:border-white/30'"
);
// Fix tab badge
content = content.replace(
  'px-1.5 py-0.5 rounded-full text-[9px] font-bold ${isActive ? \'bg-[#CCFF00]/20 text-[#CCFF00]\' : \'bg-white/5 text-gray-500\'}',
  'px-2 py-0.5 rounded-none text-[10px] font-black border ${isActive ? \'bg-black text-[#CCFF00] border-black\' : \'bg-black text-white border-white/10\'}'
);

// Search and Button
content = content.replace(
  'rounded-lg text-xs text-white focus:outline-none focus:border-[#CCFF00]/50 focus:shadow-[0_0_10px_rgba(0,255,0,0.1)]',
  'rounded-none text-xs text-white focus:outline-none focus:border-[#CCFF00] border-2 border-white/10'
);
content = content.replace(
  'rounded-md text-xs font-bold transition-all shadow-[0_0_15px_rgba(0,255,0,0.3)] hover:shadow-[0_0_20px_rgba(0,255,0,0.4)]',
  'rounded-none text-xs font-black uppercase tracking-widest transition-all border-2 border-[#CCFF00] hover:bg-black hover:text-[#CCFF00]'
);

// Ticket Card
// Original Card: bg-[#111111]/80 backdrop-blur-sm rounded-xl p-4 flex flex-col justify-between transition-all duration-300 group
content = content.replace(
  /bg-\[#111111\]\/80 backdrop-blur-sm rounded-xl p-4 flex flex-col justify-between transition-all duration-300 group/g,
  'bg-[#050505] rounded-none p-5 flex flex-col justify-between transition-all duration-300 group border-2 border-white/10 hover:border-white/30 hover:bg-[#111111]'
);
content = content.replace(
  /border-x border-b border-white\/5 border-t-2/g,
  'border-2'
);
// Remove getMarketplaceCardStyle dynamic classes (which added gradients and borders) - we will keep it solid brutalist
content = content.replace(
  /\`border-x border-b border-white\/5 border-t-2 \$\{getMarketplaceCardStyle\(ticket\.marketplace\)\}\`/g,
  '""' // Removing the dynamic card styles entirely to favor the solid classes above
);

// Fix priority dot in card
content = content.replace(
  'rounded-full shrink-0 ${ticket.priority === \'critico\' ? \'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)] animate-pulse\' : \'bg-[#CCFF00] shadow-[0_0_8px_rgba(0,255,0,0.6)]\'}',
  'rounded-none shrink-0 ${ticket.priority === \'critico\' ? \'bg-red-500 animate-pulse w-2 h-2\' : \'bg-[#CCFF00] w-2 h-2\'}'
);

// Card SKU & Desc
content = content.replace(
  '<span className="text-gray-500 font-medium text-[9px] uppercase">SKU</span>',
  '<span className="bg-[#CCFF00] text-black px-1.5 py-0.5 font-black text-[9px] uppercase">SKU</span>'
);
content = content.replace(
  '<span className={isResolved ? "line-through text-gray-500" : ""}>{ticket.description}</span>',
  '<span className={isResolved ? "line-through text-gray-500 font-bold" : "text-white font-bold"}>{ticket.description}</span>'
);

// Feed de Auditoria (Right Sidebar)
content = content.replace(
  'w-full xl:w-[320px] shrink-0 bg-[#070707] border border-white/5 rounded-2xl flex flex-col h-full shadow-2xl overflow-hidden',
  'w-full xl:w-[350px] shrink-0 bg-[#050505] border-2 border-white/10 rounded-none flex flex-col h-full overflow-hidden'
);
content = content.replace(
  '<h3 className="text-white font-bold text-xs tracking-widest uppercase">Feed de Auditoria</h3>',
  '<h3 className="text-[#CCFF00] font-black text-sm tracking-widest uppercase">Audit Log</h3>'
);
content = content.replace(
  'bg-[#0a0a0a]/50',
  'bg-[#111111]'
);
content = content.replace(
  'w-2 h-2 rounded-full',
  'w-2 h-2 rounded-none'
);
content = content.replace(
  'text-[11px] text-gray-400',
  'text-[10px] text-gray-400 font-mono'
);
content = content.replace(
  '<span className={`text-[9px] font-bold uppercase tracking-wider block mb-1.5 w-fit px-2 py-0.5 rounded ${isCritical ? \'bg-red-500/10 text-red-400\' : \'bg-white/5 text-gray-500\'}`}>',
  '<span className={`text-[9px] font-black uppercase tracking-widest block mb-1.5 w-fit px-2 py-0.5 border-2 rounded-none ${isCritical ? \'bg-red-500/10 text-red-400 border-red-500/30\' : \'bg-white/5 text-gray-300 border-white/10\'}`}>'
);

// Remove shadow classes completely
content = content.replace(/shadow-\[0_0_[0-9]+px_rgba\([^)]+\)\]/g, '');

fs.writeFileSync('src/pages/MuralAjustes.tsx', content, 'utf-8');
console.log('MuralAjustes Brutalized');
