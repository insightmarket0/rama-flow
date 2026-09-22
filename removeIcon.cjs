const fs = require('fs');
let content = fs.readFileSync('src/pages/MuralAjustes.tsx', 'utf-8');

content = content.replace(
  '<LayoutGrid className="h-8 w-8 text-[#00FF00]" />',
  ''
);

fs.writeFileSync('src/pages/MuralAjustes.tsx', content, 'utf-8');
console.log('Removed LayoutGrid icon');
