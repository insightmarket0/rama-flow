const fs = require('fs');
let content = fs.readFileSync('src/pages/MuralAjustes.tsx', 'utf-8');

// Fix root padding
content = content.replace(
  'className="flex-1 w-full bg-transparent min-h-[calc(100vh-64px)] text-white overflow-hidden font-sans flex flex-col xl:flex-row p-4 gap-4"',
  'className="flex-1 w-full bg-transparent min-h-[calc(100vh-64px)] text-white overflow-hidden font-sans flex flex-col xl:flex-row px-4 pb-4 pt-2 gap-4"'
);

// Fix the clipping margin
content = content.replace(
  'className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 -mt-2"',
  'className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 pt-0"'
);

fs.writeFileSync('src/pages/MuralAjustes.tsx', content, 'utf-8');
console.log('Fixed cropping and aligned.');
