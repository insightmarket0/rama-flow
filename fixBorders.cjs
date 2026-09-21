const fs = require('fs');
let content = fs.readFileSync('src/pages/ComparativoContas.tsx', 'utf-8');

// Fix dynamic border for bills
content = content.replace(
  'className="flex flex-col gap-1.5 bg-[#111111] border-l-4 border-l-[#CCFF00] border-t border-b border-r border-white/5 p-4 rounded-none hover:bg-white/5 transition-colors"',
  'className={`flex flex-col gap-1.5 bg-[#111111] border-l-4 border-t border-b border-r border-white/5 p-4 rounded-none hover:bg-white/5 transition-colors ${bill.type === "var" ? "border-l-cyan-400" : "border-l-[#CCFF00]"}`}'
);

fs.writeFileSync('src/pages/ComparativoContas.tsx', content, 'utf-8');
console.log('Dynamic borders fixed!');
