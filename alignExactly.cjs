const fs = require('fs');
let content = fs.readFileSync('src/pages/MuralAjustes.tsx', 'utf-8');

// 1. Change wrapper padding from pt-2 to pt-1
content = content.replace(
  'className="flex-1 w-full bg-transparent min-h-[calc(100vh-64px)] text-white overflow-hidden font-sans flex flex-col xl:flex-row px-4 pb-4 pt-2 gap-4"',
  'className="flex-1 w-full bg-transparent min-h-[calc(100vh-64px)] text-white overflow-hidden font-sans flex flex-col xl:flex-row px-4 pb-4 pt-1 gap-4"'
);

// 2. Change mb-8 to mb-6 on the header
content = content.replace(
  'className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 pt-0"',
  'className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-6 pt-0"'
);

fs.writeFileSync('src/pages/MuralAjustes.tsx', content, 'utf-8');
console.log('Adjusted margins for perfect alignment.');
