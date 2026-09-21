const fs = require('fs');
let content = fs.readFileSync('src/pages/BusinessPlan.tsx', 'utf-8');

// Top header padding
content = content.replace(
  '<div className="p-6 lg:p-8 relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b-4 border-white/20">',
  '<div className="p-4 md:p-5 relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b-4 border-white/20">'
);

// Middle "Meta: Outubro" and "Novembro" paddings
content = content.replace(
  'border-b-4 sm:border-b-0 border-white/20 p-6 flex flex-col',
  'border-b-4 sm:border-b-0 border-white/20 p-4 md:p-5 flex flex-col'
);
content = content.replace(
  'bg-[#050505] p-6 flex flex-col justify-center relative overflow-hidden group',
  'bg-[#050505] p-4 md:p-5 flex flex-col justify-center relative overflow-hidden group'
);

fs.writeFileSync('src/pages/BusinessPlan.tsx', content, 'utf-8');
console.log('Padding compressed');
