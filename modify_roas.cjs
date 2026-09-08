const fs = require('fs');
let content = fs.readFileSync('src/pages/Marketing.tsx', 'utf8');

// Replace KPI data
content = content.replace(/roas: "3\.8x",/, 'vendasSite: "R$ 0,00",');
content = content.replace(/roasTrend: 12,/, 'vendasTrend: 0,');
content = content.replace(/roas: "5\.2x",/, 'vendasSite: "R$ 0,00",');
content = content.replace(/roasTrend: 25,/, 'vendasTrend: 0,');

// Replace HTML
content = content.replace(
  /<span className="text-gray-500 text-\[10px\] font-medium tracking-widest uppercase">ROAS<\/span>/,
  '<span className="text-gray-500 text-[10px] font-medium tracking-widest uppercase">Vendas do Site</span>'
);

content = content.replace(
  /<Target className="w-3\.5 h-3\.5 text-gray-600" \/>/,
  '<ShoppingBag className="w-3.5 h-3.5 text-cyan-600" />'
);

content = content.replace(
  /\{currentKPI\.roas\}/,
  '{currentKPI.vendasSite}'
);

content = content.replace(
  /\{currentKPI\.roasTrend\}%/,
  '{currentKPI.vendasTrend}%'
);

fs.writeFileSync('src/pages/Marketing.tsx', content, 'utf8');
console.log("Done");
