const fs = require('fs');
let content = fs.readFileSync('src/pages/Marketing.tsx', 'utf-8');

// Replace CRM Partners initial data
content = content.replace(
  /\{ id: 1, avatar: "https:\/\/i\.pravatar\.cc\/150\?u=1", name: "@tech_influencer"([^}]+)\}/,
  '{ id: 1, avatar: "https://i.pravatar.cc/150?u=1", name: "@tech_influencer", niche: "Tecnologia", status: "Postado", base: "R$ 500", seedingCost: "R$ 0", upside: "15%", tracking: "TECH15", roi: "R$ 4.250", roiColor: "text-emerald-500", whitelisted: true, cpa: "R$ 15,20", tier: "A", rightsExp: "120" }'
);
content = content.replace(
  /\{ id: 2, avatar: "https:\/\/i\.pravatar\.cc\/150\?u=2", name: "Maria Clara"([^}]+)\}/,
  '{ id: 2, avatar: "https://i.pravatar.cc/150?u=2", name: "Maria Clara", niche: "Lifestyle", status: "Aguardando Roteiro", base: "Permuta", seedingCost: "R$ 150", upside: "10%", tracking: "MARIA10", roi: "R$ 12.500", roiColor: "text-emerald-500", whitelisted: false, cpa: "R$ 8,50", tier: "C", rightsExp: "10" }'
);
content = content.replace(
  /\{ id: 3, avatar: "https:\/\/i\.pravatar\.cc\/150\?u=3", name: "Lucas Dev"([^}]+)\}/,
  '{ id: 3, avatar: "https://i.pravatar.cc/150?u=3", name: "Lucas Dev", niche: "Programação", status: "Aprovação Interna", base: "R$ 300", seedingCost: "R$ 50", upside: "R$ 50/venda", tracking: "UTM_LUCAS", roi: "R$ 2.100", roiColor: "text-emerald-500", whitelisted: true, cpa: "R$ 22,00", tier: "A", rightsExp: "60" }'
);
content = content.replace(
  /\{ id: 4, avatar: "https:\/\/i\.pravatar\.cc\/150\?u=4", name: "Revenda Sul"([^}]+)\}/,
  '{ id: 4, avatar: "https://i.pravatar.cc/150?u=4", name: "Revenda Sul", niche: "B2B", status: "Refação", base: "R$ 1.000", seedingCost: "R$ 0", upside: "20%", tracking: "REVENDASUL", roi: "R$ 0", roiColor: "text-gray-500", whitelisted: false, cpa: "-", tier: "B", rightsExp: "5" }'
);

// Replace crmForm definition
content = content.replace(
  /const \[crmForm, setCrmForm\] = useState\(\{ name: '', niche: '', status: 'Aguardando Roteiro', base: '', upside: '', tracking: '', roi: 'R\\$ 0', cpa: '-', tier: 'C', rightsExp: '', avatar: '' \}\);/,
  "const [crmForm, setCrmForm] = useState({ name: '', niche: '', status: 'Aguardando Roteiro', base: '', seedingCost: 'R$ 0', upside: '', tracking: '', roi: 'R$ 0', cpa: '-', tier: 'C', rightsExp: '', avatar: '' });"
);

// Replace handleAddCrm initialization
content = content.replace(
  /setCrmForm\(\{ name: '', niche: '', status: 'Aguardando Roteiro', base: 'Permuta', upside: '10%', tracking: '', roi: 'R\\$ 0', cpa: '-', tier: 'C', rightsExp: '30', avatar: https:\/\/i\.pravatar\.cc\/150\?u=\$\{Date\.now\(\)\} \}\);/,
  "setCrmForm({ name: '', niche: '', status: 'Aguardando Roteiro', base: 'Permuta', seedingCost: 'R$ 0', upside: '10%', tracking: '', roi: 'R$ 0', cpa: '-', tier: 'C', rightsExp: '30', avatar: https://i.pravatar.cc/150?u= });"
);

fs.writeFileSync('src/pages/Marketing.tsx', content, 'utf-8');
console.log('State updated');
