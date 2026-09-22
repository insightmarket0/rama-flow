const fs = require('fs');
let content = fs.readFileSync('src/pages/MuralAjustes.tsx', 'utf-8');

// Change wrapper to pt-2
content = content.replace(
  'className="flex-1 w-full bg-transparent min-h-[calc(100vh-64px)] text-white overflow-hidden font-sans flex flex-col xl:flex-row px-4 pb-4 pt-1 gap-4"',
  'className="flex-1 w-full bg-transparent min-h-[calc(100vh-64px)] text-white overflow-hidden font-sans flex flex-col xl:flex-row px-4 pb-4 pt-2 gap-4"'
);

// Change mb-6 to mb-5
content = content.replace(
  'className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-6 pt-0"',
  'className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-5 pt-0"'
);

fs.writeFileSync('src/pages/MuralAjustes.tsx', content, 'utf-8');
console.log('Adjusted for pixel perfect alignment.');
