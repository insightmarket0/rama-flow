const fs = require('fs');
let bp = fs.readFileSync('src/pages/BusinessPlan.tsx', 'utf8');
let metas = fs.readFileSync('src/pages/Metas.tsx', 'utf8');

const importRegex = /import\s+\{([^}]+)\}\s+from\s+['"]lucide-react['"];/s;
const metasImportsMatch = metas.match(importRegex);
let metasImports = metasImportsMatch ? metasImportsMatch[1].split(',').map(s=>s.trim()).filter(Boolean) : [];

let bpImportsMatch = bp.match(importRegex);
if(bpImportsMatch) {
  let bpImports = bpImportsMatch[1].split(',').map(s=>s.trim()).filter(Boolean);
  let newImports = Array.from(new Set([...bpImports, ...metasImports]));
  bp = bp.replace(importRegex, 'import { \n  ' + newImports.join(', ') + '\n} from \"lucide-react\";');
}

bp = bp.replace(
  'useState<\"estrategia\" | \"ecossistema\" | \"app\">',
  'useState<\"estrategia\" | \"metas\" | \"ecossistema\" | \"app\">'
);

const ecossistemaBtnRegex = /<button[^>]+onClick=\{\(\) => setActiveTab\(\"ecossistema\"\)\}[^>]*>.*?<\/button>/s;
const btnMatch = bp.match(ecossistemaBtnRegex);
if(btnMatch) {
  const newBtn = '<button onClick={() => setActiveTab(\"metas\")} className={\px-4 lg:px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all \}>Metas e Visão</button>';
  bp = bp.replace(ecossistemaBtnRegex, newBtn + '\n' + btnMatch[0]);
}

const metasContentRegex = /<div className=\"flex-1 space-y-8 p-4 md:p-8 pt-6 animate-in fade-in duration-500\">(.*)/s;
const metasContentMatch = metas.match(metasContentRegex);

if(metasContentMatch) {
  let innerContent = metasContentMatch[1];
  // remove the last two closing divs and return statement
  innerContent = innerContent.replace(/<\/div>\s*<\/div>\s*\);\s*}\s*$/s, '</div>');

  const marketplacesCode = '  const marketplaces = [\n    { name: \"Mercado Livre\", status: \"completed\", icon: ShoppingCart, color: \"text-yellow-500\" },\n    { name: \"Shopee\", status: \"completed\", icon: ShoppingCart, color: \"text-orange-500\" },\n    { name: \"Amazon\", status: \"completed\", icon: ShoppingCart, color: \"text-blue-500\" },\n    { name: \"Magalu\", status: \"completed\", icon: ShoppingCart, color: \"text-blue-600\" },\n    { name: \"TikTok\", status: \"pending\", icon: Smartphone, color: \"text-black dark:text-white\" },\n    { name: \"Site Próprio\", status: \"pending\", icon: Globe, color: \"text-primary\" },\n  ];\n  const completedCount = marketplaces.filter(m => m.status === \"completed\").length;\n  const progressPercentage = (completedCount / marketplaces.length) * 100;\n';

  bp = bp.replace('const [activeTab, setActiveTab]', marketplacesCode + '\n  const [activeTab, setActiveTab]');

  const newTabContent = '\n        {activeTab === \"metas\" && (\n          <div className=\"animate-in fade-in slide-in-from-bottom-4 duration-700 flex flex-col gap-8\">\n            ' + innerContent + '\n          </div>\n        )}\n';
  bp = bp.replace('{activeTab === \"estrategia\" &&', newTabContent + '        {activeTab === \"estrategia\" &&');
}

fs.writeFileSync('src/pages/BusinessPlan.tsx', bp);
