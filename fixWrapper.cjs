const fs = require('fs');
let content = fs.readFileSync('src/pages/Lembretes.tsx', 'utf-8');

content = content.replace(
  'className="flex-1 px-4 md:px-8 pb-4 md:pb-8 pt-2 md:pt-2 animate-in fade-in duration-500 max-w-[1400px] mx-auto w-full font-sans flex flex-col min-h-0 overflow-hidden"',
  'className="flex-1 w-full bg-transparent text-white px-4 pb-4 pt-2 animate-in fade-in duration-500 font-sans flex flex-col min-h-0 overflow-hidden gap-4"'
);

fs.writeFileSync('src/pages/Lembretes.tsx', content, 'utf-8');
console.log('Removed mx-auto and max-w to align with sidebar');
