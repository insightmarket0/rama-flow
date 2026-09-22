const fs = require('fs');
let content = fs.readFileSync('src/pages/Lembretes.tsx', 'utf-8');

// Remove gap-4 from the wrapper flex-col
content = content.replace(
  'font-sans flex flex-col min-h-0 overflow-hidden gap-4"',
  'font-sans flex flex-col min-h-0 overflow-hidden"'
);

// Add mb-2 back to the header so it has exactly 8px of spacing total
content = content.replace(
  'gap-6 mb-0 pt-0 shrink-0',
  'gap-6 mb-2 pt-0 shrink-0'
);

fs.writeFileSync('src/pages/Lembretes.tsx', content, 'utf-8');
console.log('Removed gap-4 and set mb-2');
