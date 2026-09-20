const fs = require('fs');
let content = fs.readFileSync('src/pages/BusinessPlan.tsx', 'utf-8');

// Reverse spacing
content = content.replace(/p-4 lg:p-6/g, 'p-6 lg:p-10');
content = content.replace(/text-\[8rem\]/g, 'text-[14rem]');
content = content.replace(/text-2xl lg:text-3xl mb-4/g, 'text-4xl mb-6');
content = content.replace(/mt-6 relative/g, 'mt-12 relative');

// Reverse overflow/widths
content = content.replace(/max-w-\[1200px\]/g, 'max-w-[1600px]');
content = content.replace(
  'className="absolute top-[85px] left-0 z-50 w-full bg-[#111111] border-2 border-[#CCFF00] p-5 shadow-2xl animate-in fade-in zoom-in-95 duration-200"',
  'className="absolute top-[85px] left-0 z-50 w-[105%] bg-[#111111] border-2 border-[#CCFF00] p-5 shadow-2xl animate-in fade-in zoom-in-95 duration-200"'
);

// Reverse translate
content = content.replace(
  'className="absolute top-0 right-0 w-[800px] h-[600px] bg-gradient-to-br  to-transparent rounded-none blur-[120px] pointer-events-none -translate-y-1/2 transition-all duration-1000"',
  'className="absolute top-0 right-0 w-[800px] h-[600px] bg-gradient-to-br  to-transparent rounded-none blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/4 transition-all duration-1000"'
);

fs.writeFileSync('src/pages/BusinessPlan.tsx', content, 'utf-8');
console.log('Reverted changes');
