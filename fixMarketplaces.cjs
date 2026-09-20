const fs = require('fs');
let content = fs.readFileSync('src/pages/BusinessPlan.tsx', 'utf-8');

const regex = /<span className="bg-\[#FFE600\] text-black border-2 border-\[#FFE600\] text-\[10px\] uppercase font-black px-3 py-1\.5">Mercado Livre<\/span>\s*<span className="bg-\[#EE4D2D\] text-white border-2 border-\[#EE4D2D\] text-\[10px\] uppercase font-black px-3 py-1\.5">Shopee<\/span>\s*<span className="bg-\[#FF9900\] text-white border-2 border-\[#FF9900\] text-\[10px\] uppercase font-black px-3 py-1\.5">Amazon<\/span>/;

const replacement = `<span className="bg-[#FFE600] text-black border-2 border-[#FFE600] text-[10px] uppercase font-black px-3 py-1.5">Mercado Livre</span>
                      <span className="bg-[#EE4D2D] text-white border-2 border-[#EE4D2D] text-[10px] uppercase font-black px-3 py-1.5">Shopee</span>
                      <span className="bg-[#FF9900] text-white border-2 border-[#FF9900] text-[10px] uppercase font-black px-3 py-1.5">Amazon</span>
                      <span className="bg-[#0086FF] text-white border-2 border-[#0086FF] text-[10px] uppercase font-black px-3 py-1.5">Magalu</span>
                      <span className="bg-white text-black border-2 border-white text-[10px] uppercase font-black px-3 py-1.5">TikTok Shop</span>`;

if (regex.test(content)) {
    content = content.replace(regex, replacement);
    fs.writeFileSync('src/pages/BusinessPlan.tsx', content, 'utf-8');
    console.log('Fixed marketplaces');
} else {
    console.log('Regex did not match');
}
