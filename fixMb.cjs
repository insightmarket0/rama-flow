const fs = require('fs');
let content = fs.readFileSync('src/pages/BusinessPlan.tsx', 'utf-8');

// Replace the mb-8 on the Marketplaces section
content = content.replace(
  'relative overflow-hidden mb-8">',
  'relative overflow-hidden mb-0">'
);

// There might also be a `<div className="pb-10">` at the very end of the page?
// But let's start with removing the mb-8.

fs.writeFileSync('src/pages/BusinessPlan.tsx', content, 'utf-8');
console.log('Removed mb-8');
