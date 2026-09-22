const fs = require('fs');
let content = fs.readFileSync('src/pages/Lembretes.tsx', 'utf-8');

content = content.replace(
  'gap-6 mb-2 pt-0 shrink-0',
  'gap-6 mb-3 pt-0 shrink-0'
);

fs.writeFileSync('src/pages/Lembretes.tsx', content, 'utf-8');
console.log('Adjusted mb from 2 to 3');
