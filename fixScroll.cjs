const fs = require('fs');
let content = fs.readFileSync('src/pages/BusinessPlan.tsx', 'utf-8');

// Remove translate-x-1/4
content = content.replace(/translate-x-1\/4/g, '');

fs.writeFileSync('src/pages/BusinessPlan.tsx', content, 'utf-8');
console.log('Removed translate-x-1/4');
