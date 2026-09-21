const fs = require('fs');
let content = fs.readFileSync('src/pages/BusinessPlan.tsx', 'utf-8');

content = content.replace(
  '<div className="p-8 lg:p-12 relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b-4 border-white/20">',
  '<div className="p-6 lg:p-8 relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b-4 border-white/20">'
);

fs.writeFileSync('src/pages/BusinessPlan.tsx', content, 'utf-8');
console.log('Fixed padding');
