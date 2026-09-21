const fs = require('fs');
let content = fs.readFileSync('src/pages/BusinessPlan.tsx', 'utf-8');

const regex = /<span className="font-black text-white text-lg uppercase tracking-tighter">\{mk\.name\}<\/span>/s;

const replacement = `{mk.name === 'Mercado Livre' && <span className="bg-[#FFE600] text-black border-2 border-[#FFE600] text-[10px] md:text-xs uppercase font-black px-3 py-1.5 self-start w-fit">Mercado Livre</span>}
                {mk.name === 'Shopee' && <span className="bg-[#EE4D2D] text-white border-2 border-[#EE4D2D] text-[10px] md:text-xs uppercase font-black px-3 py-1.5 self-start w-fit">Shopee</span>}
                {mk.name === 'Amazon' && <span className="bg-[#FF9900] text-white border-2 border-[#FF9900] text-[10px] md:text-xs uppercase font-black px-3 py-1.5 self-start w-fit">Amazon</span>}
                {mk.name === 'Magalu' && <span className="bg-[#0086FF] text-white border-2 border-[#0086FF] text-[10px] md:text-xs uppercase font-black px-3 py-1.5 self-start w-fit">Magalu</span>}
                {mk.name === 'TikTok' && <span className="bg-white text-black border-2 border-white text-[10px] md:text-xs uppercase font-black px-3 py-1.5 self-start w-fit">TikTok Shop</span>}
                {mk.name === 'Site Próprio' && <span className="bg-[#CCFF00] text-black border-2 border-[#CCFF00] text-[10px] md:text-xs uppercase font-black px-3 py-1.5 self-start w-fit">Site Próprio</span>}`;

if (regex.test(content)) {
    content = content.replace(regex, replacement);
    fs.writeFileSync('src/pages/BusinessPlan.tsx', content, 'utf-8');
    console.log('Replaced text with tags inside grid');
} else {
    console.log('Regex failed');
}
