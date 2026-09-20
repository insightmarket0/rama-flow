const fs = require('fs');
let content = fs.readFileSync('src/pages/BusinessPlan.tsx', 'utf-8');

// The cards have `flex flex-col justify-between`
// We'll replace it with `flex flex-col justify-start`
content = content.replace(/border-white\/20 flex flex-col justify-between/g, 'border-white/20 flex flex-col justify-start');

fs.writeFileSync('src/pages/BusinessPlan.tsx', content, 'utf-8');
console.log('Removed justify-between');
