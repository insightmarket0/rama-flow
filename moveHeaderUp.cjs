const fs = require('fs');
let content = fs.readFileSync('src/pages/MuralAjustes.tsx', 'utf-8');
content = content.replace(
  'className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 pt-4"',
  'className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 -mt-2"'
);
fs.writeFileSync('src/pages/MuralAjustes.tsx', content, 'utf-8');
console.log('Moved header up.');
