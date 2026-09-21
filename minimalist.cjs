const fs = require('fs');

let content = fs.readFileSync('src/pages/MuralAjustes.tsx', 'utf-8');

// 1. Thinner borders and cleaner lines
content = content.replace(/border-4 border-white\/20/g, 'border-b border-white/10'); // Header underline
content = content.replace(/border-4/g, 'border'); // Reduce other borders
content = content.replace(/border-white\/20/g, 'border-white/10'); // Softer borders

// 2. Thinner buttons and minimalist aesthetics
content = content.replace(
  'bg-[#CCFF00] hover:bg-white text-black px-8 py-4 font-black uppercase tracking-widest text-lg md:text-xl transition-colors shrink-0 flex items-center justify-center gap-3',
  'bg-transparent border border-[#CCFF00] text-[#CCFF00] hover:bg-[#CCFF00] hover:text-black px-6 py-3 font-bold uppercase tracking-widest text-sm transition-colors shrink-0 flex items-center justify-center gap-2'
);
content = content.replace('<Plus className="h-6 w-6 stroke-[3]" /> NOVO TICKET', '<Plus className="h-4 w-4" /> NOVO TICKET');

// 3. Tabs: from heavy blocks to minimalist lines
content = content.replace(
  '<div className="flex flex-wrap gap-0 border border-white/10 mb-8 bg-[#111]">',
  '<div className="flex flex-wrap gap-4 mb-10">'
);
content = content.replace(
  /className=\`flex-1 min-w-\[120px\] p-4 flex flex-col items-center justify-center gap-2 border-r border-white\/10 last:border-r-0 transition-colors \$\{/g,
  'className={`px-6 py-3 flex items-center justify-center gap-3 border transition-all rounded-full ${'
);
content = content.replace(
  /isActive \? 'bg-\[#CCFF00\] text-black' : 'hover:bg-white\/10 text-white'/g,
  'isActive ? \'border-[#CCFF00] text-[#CCFF00] bg-[#CCFF00]/10\' : \'border-white/10 text-white/50 hover:text-white hover:border-white/30\''
);

// Tab Badges
content = content.replace(
  /<span className=\{\`text-\[10px\] font-black px-2 py-0\.5 \$\{isActive \? 'bg-black text-\[#CCFF00\]' : 'bg-white\/20 text-white'\}\`\}>/g,
  '<span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isActive ? \'bg-[#CCFF00] text-black\' : \'bg-white/10 text-white\'}`}>'
);

// 4. Ticket Cards: From heavy bordered blocks to minimalist cards
content = content.replace(
  /className=\`flex flex-col border \$\{isResolved \? 'border-white\/10 opacity-50' : isCritical \? 'border-red-500' : 'border-\[#CCFF00\]'\} bg-\[#111\]\`>/g,
  'className={`flex flex-col border rounded-xl overflow-hidden transition-all hover:border-white/30 ${isResolved ? \'border-white/5 opacity-50\' : isCritical ? \'border-red-500/50 hover:border-red-500\' : \'border-white/10 hover:border-[#CCFF00]/50\'} bg-transparent`}>'
);
content = content.replace(
  /className=\`p-4 border-b \$\{isResolved \? 'border-white\/10' : isCritical \? 'border-red-500 bg-red-500\/10' : 'border-\[#CCFF00\] bg-\[#CCFF00\]\/10'\} flex justify-between items-center\`>/g,
  'className={`p-4 border-b flex justify-between items-center ${isResolved ? \'border-white/5 bg-white/[0.02]\' : isCritical ? \'border-red-500/20 bg-red-500/5\' : \'border-white/5 bg-white/[0.02]\'}`}>'
);

content = content.replace(/border-t border-white\/10 bg-\[#050505\]/g, 'border-t border-white/5 bg-transparent');

// Resolve buttons inside card
content = content.replace(
  'p-2 bg-[#CCFF00] text-black hover:bg-white transition-colors font-black flex items-center gap-2 text-[10px] uppercase tracking-widest',
  'px-4 py-2 bg-transparent border border-[#CCFF00] text-[#CCFF00] hover:bg-[#CCFF00] hover:text-black transition-colors font-bold flex items-center gap-2 text-[10px] uppercase tracking-widest rounded-md'
);
content = content.replace(
  'p-2 bg-white/20 text-white/50 font-black flex items-center gap-2 text-[10px] uppercase tracking-widest',
  'px-4 py-2 bg-white/5 border border-white/10 text-white/50 font-bold flex items-center gap-2 text-[10px] uppercase tracking-widest rounded-md'
);

// 5. Audit Sidebar
content = content.replace(
  'w-full xl:w-[400px] shrink-0 flex flex-col border border-white/10 bg-[#111]',
  'w-full xl:w-[350px] shrink-0 flex flex-col border-l border-white/10 bg-transparent'
);
content = content.replace(
  'p-6 border-b border-white/10 bg-[#050505]',
  'p-6 border-b border-white/10 bg-transparent'
);
content = content.replace(
  '<h3 className="text-2xl font-black uppercase tracking-tighter text-[#CCFF00]">AUDITORIA</h3>',
  '<h3 className="text-sm font-bold uppercase tracking-widest text-[#CCFF00] flex items-center gap-2"><Activity className="w-4 h-4" /> AUDITORIA</h3>'
);

// Fix Activity icon import if it's missing (it was removed in brutalist, I will re-add it)
if (!content.includes('Activity,')) {
  content = content.replace('AlertCircle, Plus', 'AlertCircle, Plus, Activity');
}

fs.writeFileSync('src/pages/MuralAjustes.tsx', content, 'utf-8');
console.log('Minimalist refinement complete!');
