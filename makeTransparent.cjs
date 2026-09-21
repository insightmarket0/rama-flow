const fs = require('fs');

let content = fs.readFileSync('src/pages/MuralAjustes.tsx', 'utf-8');

// Change root div background to transparent to blend with the global app background
content = content.replace(
  'className="flex-1 w-full bg-[#050505] min-h-screen text-white overflow-hidden font-sans flex flex-col xl:flex-row p-4 gap-4"',
  'className="flex-1 w-full bg-transparent min-h-[calc(100vh-64px)] text-white overflow-hidden font-sans flex flex-col xl:flex-row p-4 gap-4"'
);

fs.writeFileSync('src/pages/MuralAjustes.tsx', content, 'utf-8');
console.log('Background is now transparent to blend perfectly.');
