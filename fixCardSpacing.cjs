const fs = require('fs');
let content = fs.readFileSync('src/pages/BusinessPlan.tsx', 'utf-8');

// Replace mt-12 with mt-6
content = content.replace(/mt-12 relative z-10/g, 'mt-6 relative z-10');

// Replace p-6 lg:p-10 with p-6 lg:p-8 in those specific cards
// They have class: p-6 lg:p-10 relative overflow-hidden group
content = content.replace(/p-6 lg:p-10 relative overflow-hidden group/g, 'p-6 lg:p-8 relative overflow-hidden group');

// Also, the text text-4xl mb-6 can be changed to text-3xl lg:text-4xl mb-4 to save a little space
content = content.replace(/text-4xl mb-6 relative/g, 'text-3xl lg:text-4xl mb-4 relative');

fs.writeFileSync('src/pages/BusinessPlan.tsx', content, 'utf-8');
console.log('Fixed card spacing');
