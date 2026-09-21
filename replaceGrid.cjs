const fs = require('fs');
let content = fs.readFileSync('src/pages/BusinessPlan.tsx', 'utf-8');

// 1. Remove unnecessary spacing in the PRESENÇA EM MARKETPLACES header
content = content.replace(
  '<div className="p-8 lg:p-12 relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b-4 border-white/20">',
  '<div className="p-6 relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b-4 border-white/20">'
);

// 2. Replace the 2x3 grid with the new tag format
const gridRegex = /\{\/\* BOTTOM: Grid de Marketplaces \*\/\}.*?<\/div>\s*<\/section>/s;

const newTags = `{/* BOTTOM: Tags de Marketplaces */}
          <div className="p-6 bg-[#050505] flex flex-wrap gap-3">
            <span className="bg-[#FFE600] text-black border-2 border-[#FFE600] text-xs md:text-sm uppercase font-black px-5 py-2.5">Mercado Livre</span>
            <span className="bg-[#EE4D2D] text-white border-2 border-[#EE4D2D] text-xs md:text-sm uppercase font-black px-5 py-2.5">Shopee</span>
            <span className="bg-[#FF9900] text-white border-2 border-[#FF9900] text-xs md:text-sm uppercase font-black px-5 py-2.5">Amazon</span>
            <span className="bg-[#0086FF] text-white border-2 border-[#0086FF] text-xs md:text-sm uppercase font-black px-5 py-2.5">Magalu</span>
            <span className="bg-white text-black border-2 border-white text-xs md:text-sm uppercase font-black px-5 py-2.5">TikTok Shop</span>
            <span className="bg-[#CCFF00] text-black border-2 border-[#CCFF00] text-xs md:text-sm uppercase font-black px-5 py-2.5">Site Próprio</span>
          </div>
        </section>`;

if (gridRegex.test(content)) {
    content = content.replace(gridRegex, newTags);
    fs.writeFileSync('src/pages/BusinessPlan.tsx', content, 'utf-8');
    console.log('Replaced grid with tags');
} else {
    console.log('Could not find the grid');
}
