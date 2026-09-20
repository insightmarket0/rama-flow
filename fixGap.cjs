const fs = require('fs');
let content = fs.readFileSync('src/pages/BusinessPlan.tsx', 'utf-8');

// Replace the mb-8 of the title container
content = content.replace(
  'className="flex flex-col space-y-3 mb-8"',
  'className="flex flex-col space-y-3"'
);

// Replace the mt-4 of the section
content = content.replace(
  '<section className="mt-4 mb-8">',
  '<section className="mb-8">'
);

fs.writeFileSync('src/pages/BusinessPlan.tsx', content, 'utf-8');
console.log('Fixed gap');
