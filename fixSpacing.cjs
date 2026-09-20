const fs = require('fs');
let content = fs.readFileSync('src/pages/BusinessPlan.tsx', 'utf-8');

// 1. Remove that translate-x-1/4 to be completely safe from horizontal scrolling.
content = content.replace('translate-x-1/4 ', '');

// 2. Reduce paddings and gaps in the "metas" section.
// Visão / Missão / Diferencial cards have `p-6 lg:p-10`
content = content.replace(/p-6 lg:p-10/g, 'p-4 lg:p-6');

// text-[14rem] to text-[8rem]
content = content.replace(/text-\[14rem\]/g, 'text-[8rem]');

// text-4xl to text-2xl lg:text-3xl
content = content.replace(/text-4xl mb-6/g, 'text-2xl lg:text-3xl mb-4');

// mt-12 to mt-6
content = content.replace(/mt-12 relative/g, 'mt-6 relative');

// 3. For the Marketplaces section in "metas"
// It uses <div className="bg-[#111111] p-6 lg:p-8"> or something similar?
// Let's check:
