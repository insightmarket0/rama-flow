const fs = require('fs');
let content = fs.readFileSync('src/pages/BusinessPlan.tsx', 'utf-8');

// Change pb-10 to pb-0 on the main container
content = content.replace(
  'selection:text-black pb-10">',
  'selection:text-black pb-0">'
);

fs.writeFileSync('src/pages/BusinessPlan.tsx', content, 'utf-8');
console.log('Removed pb-10');
