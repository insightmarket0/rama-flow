const fs = require('fs');
let content = fs.readFileSync('src/pages/MuralAjustes.tsx', 'utf-8');

// Replace DialogContent padding and rounding
content = content.replace(
  'DialogContent className="bg-[#111111]/95 backdrop-blur-md border-white/10 text-white max-w-md rounded-3xl p-6 shadow-2xl"',
  'DialogContent className="bg-[#111111]/95 backdrop-blur-md border-white/10 text-white max-w-md rounded-2xl p-5 shadow-2xl"'
);

// Replace DialogHeader margin
content = content.replace(
  'DialogHeader className="mb-6"',
  'DialogHeader className="mb-4"'
);

// Replace form spacing
content = content.replace(
  '<form onSubmit={handleCreateTicket} className="space-y-4">',
  '<form onSubmit={handleCreateTicket} className="space-y-3">'
);

// Replace gap-4 with gap-3 for grid layout
content = content.replace(
  '<div className="grid grid-cols-2 gap-4">',
  '<div className="grid grid-cols-2 gap-3">'
);
content = content.replace(
  '<div className="grid grid-cols-2 gap-4">',
  '<div className="grid grid-cols-2 gap-3">'
);

// Replace h-11 with h-9 and rounded-xl with rounded-lg in SelectTrigger and inputs
content = content.replace(/rounded-xl focus:ring-1 focus:ring-\[#00FF00\]\/50 h-11/g, 'rounded-lg focus:ring-1 focus:ring-[#00FF00]/50 h-9');
content = content.replace(/rounded-xl px-4 h-11/g, 'rounded-lg px-3 h-9');

// SelectContent rounded-xl -> rounded-lg
content = content.replace(/SelectContent className="bg-\[#111\] border-white\/10 text-white rounded-xl"/g, 'SelectContent className="bg-[#111] border-white/10 text-white rounded-lg"');

// Textarea 
content = content.replace(
  'rounded-xl p-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#00FF00]/50 min-h-[100px] resize-none',
  'rounded-lg p-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#00FF00]/50 min-h-[80px] resize-none'
);

// Footer spacing and styling
content = content.replace(
  '<div className="flex items-center justify-between pt-4 mt-4">',
  '<div className="flex items-center justify-between pt-2 mt-2">'
);
content = content.replace(
  'p-1 rounded-xl border border-white/5',
  'p-1 rounded-lg border border-white/5'
);
content = content.replace(
  'bg-[#00FF00] hover:bg-[#00FF00]/80 text-black px-6 py-2 rounded-xl text-xs font-bold transition-all shadow-[0_0_15px_rgba(204,255,0,0.2)] uppercase tracking-wider',
  'bg-[#00FF00] hover:bg-[#00FF00]/80 text-black px-5 py-2 rounded-lg text-xs font-bold transition-all shadow-[0_0_15px_rgba(204,255,0,0.2)] uppercase tracking-wider'
);

fs.writeFileSync('src/pages/MuralAjustes.tsx', content, 'utf-8');
console.log('Made modal compact.');
