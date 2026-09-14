const fs = require('fs');
let content = fs.readFileSync('src/pages/Marketing.tsx', 'utf-8');

// 1. Update CRM_PARTNERS
content = content.replace(
    'const CRM_PARTNERS = [',
    'const CRM_PARTNERS = ['
).replace(
    'base: "R$ 500", upside: "15%", tracking: "TECH15", roi: "R$ 4.250", roiColor: "text-emerald-500", whitelisted: true, cpa: "R$ 15,20", tier: "A", rightsExp: "120" }',
    'base: "R$ 500", upside: "15%", tracking: "TECH15", roi: "R$ 4.250", roiColor: "text-emerald-500", whitelisted: true, cpa: "R$ 15,20", tier: "A", rightsExp: "120", seeding: "R$ 150 (1 kit)" }'
).replace(
    'base: "Permuta", upside: "10%", tracking: "MARIA10", roi: "R$ 0", roiColor: "text-gray-500", whitelisted: false, cpa: "-", tier: "C", rightsExp: "10" }',
    'base: "Permuta", upside: "10%", tracking: "MARIA10", roi: "R$ 0", roiColor: "text-gray-500", whitelisted: false, cpa: "-", tier: "C", rightsExp: "10", seeding: "R$ 0" }'
).replace(
    'base: "R$ 300", upside: "R$ 50/venda", tracking: "UTM_LUCAS", roi: "R$ 2.100", roiColor: "text-emerald-500", whitelisted: true, cpa: "R$ 22,00", tier: "A", rightsExp: "60" }',
    'base: "R$ 300", upside: "R$ 50/venda", tracking: "UTM_LUCAS", roi: "R$ 2.100", roiColor: "text-emerald-500", whitelisted: true, cpa: "R$ 22,00", tier: "A", rightsExp: "60", seeding: "R$ 450 (3 kits)" }'
).replace(
    'base: "R$ 1.000", upside: "20%", tracking: "REVENDASUL", roi: "R$ 0", roiColor: "text-gray-500", whitelisted: false, cpa: "-", tier: "B", rightsExp: "5" }',
    'base: "R$ 1.000", upside: "20%", tracking: "REVENDASUL", roi: "R$ 0", roiColor: "text-gray-500", whitelisted: false, cpa: "-", tier: "B", rightsExp: "5", seeding: "R$ 0" }'
);

// 2. Update Table Headers
content = content.replace(
    /<th className="px-4 py-2.5 text-\[10px\] uppercase font-semibold text-gray-400">Upside \(Comiss.*o\)<\/th>/,
    '<th className="px-4 py-2.5 text-[10px] uppercase font-semibold text-gray-400">Upside</th>\\n                      <th className="px-4 py-2.5 text-[10px] uppercase font-semibold text-gray-400">Custo (Seeding)</th>'
);
content = content.replace(
    '<th className="px-4 py-2.5 text-[10px] uppercase font-semibold text-gray-400 text-right">ROI</th>',
    '<th className="px-4 py-2.5 text-[10px] uppercase font-semibold text-gray-400 text-right">Receita (Cupom) / eCPA</th>'
);

// 3. Update Table Rows
content = content.replace(
    '<td className="px-4 py-2 text-xs text-gray-300">{partner.upside}</td>',
    '<td className="px-4 py-2 text-xs text-gray-300">{partner.upside}</td>\\n                        <td className="px-4 py-2 text-xs text-gray-300">{partner.seeding}</td>'
);

// 4. Remove Scorecard table
let start = content.indexOf('{/* 3. Tabela de ROI de Influenciadores */}');
if (start !== -1) {
    let end = content.indexOf('</div>\\n            </div>\\n          )}', start);
    if (end !== -1) {
        content = content.substring(0, start) + content.substring(end);
    }
}

fs.writeFileSync('src/pages/Marketing.tsx', content, 'utf-8');
console.log('CRM unified');
