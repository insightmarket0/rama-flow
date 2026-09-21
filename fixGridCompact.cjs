const fs = require('fs');
let content = fs.readFileSync('src/pages/BusinessPlan.tsx', 'utf-8');

const regex = /<div className="grid grid-cols-2 md:grid-cols-3">.*?<\/div>\s*<\/section>/s;

const newGrid = `<div className="grid grid-cols-2 md:grid-cols-3">
            {marketplaces.map((mk, index) => (
              <div key={mk.name} className={\`p-4 md:p-5 flex items-center justify-between group \${index < marketplaces.length - 3 ? 'border-b-4 border-white/20' : ''} \${(index + 1) % 3 !== 0 ? 'border-r-4 border-white/20' : ''}\`}>
                <div className="flex items-center">
                  {mk.name === 'Mercado Livre' && <span className="bg-[#FFE600] text-black border-2 border-[#FFE600] text-[10px] md:text-xs uppercase font-black px-3 py-1.5">Mercado Livre</span>}
                  {mk.name === 'Shopee' && <span className="bg-[#EE4D2D] text-white border-2 border-[#EE4D2D] text-[10px] md:text-xs uppercase font-black px-3 py-1.5">Shopee</span>}
                  {mk.name === 'Amazon' && <span className="bg-[#FF9900] text-white border-2 border-[#FF9900] text-[10px] md:text-xs uppercase font-black px-3 py-1.5">Amazon</span>}
                  {mk.name === 'Magalu' && <span className="bg-[#0086FF] text-white border-2 border-[#0086FF] text-[10px] md:text-xs uppercase font-black px-3 py-1.5">Magalu</span>}
                  {mk.name === 'TikTok' && <span className="bg-white text-black border-2 border-white text-[10px] md:text-xs uppercase font-black px-3 py-1.5">TikTok Shop</span>}
                  {mk.name.includes('Site Pr') && <span className="bg-[#CCFF00] text-black border-2 border-[#CCFF00] text-[10px] md:text-xs uppercase font-black px-3 py-1.5">Site Próprio</span>}
                </div>
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold">
                  {mk.status === "completed" ? (
                    <span className="text-[#CCFF00]">ATIVO</span>
                  ) : (
                    <span className="text-orange-500">A FAZER</span>
                  )}
                </span>
              </div>
            ))}
          </div>
        </section>`;

if (regex.test(content)) {
    content = content.replace(regex, newGrid);
    fs.writeFileSync('src/pages/BusinessPlan.tsx', content, 'utf-8');
    console.log('Fixed grid layout');
} else {
    console.log('Regex failed');
}
