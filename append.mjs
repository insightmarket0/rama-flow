import fs from 'fs';
let bp = fs.readFileSync('src/pages/BusinessPlan.tsx', 'utf8');
let metas = fs.readFileSync('src/pages/Metas.tsx', 'utf8');

const metasContentRegex = /<div className="flex-1 space-y-8 p-4 md:p-8 pt-6 animate-in fade-in duration-500">(.*)/s;
const metasContentMatch = metas.match(metasContentRegex);
if(metasContentMatch) {
  let innerContent = metasContentMatch[1];
  innerContent = innerContent.replace(/<\/div>\s*<\/div>\s*\);\s*}\s*$/s, '</div>');
  
  const marketplacesCode = "\n  const marketplaces = [\n    { name: 'Mercado Livre', status: 'completed', icon: ShoppingCart, color: 'text-yellow-500' },\n    { name: 'Shopee', status: 'completed', icon: ShoppingCart, color: 'text-orange-500' },\n    { name: 'Amazon', status: 'completed', icon: ShoppingCart, color: 'text-blue-500' },\n    { name: 'Magalu', status: 'completed', icon: ShoppingCart, color: 'text-blue-600' },\n    { name: 'TikTok', status: 'pending', icon: Smartphone, color: 'text-black dark:text-white' },\n    { name: 'Site Próprio', status: 'pending', icon: Globe, color: 'text-primary' },\n  ];\n  const completedCount = marketplaces.filter(m => m.status === 'completed').length;\n  const progressPercentage = (completedCount / marketplaces.length) * 100;\n";
  bp = bp.replace('const [activeTab, setActiveTab]', marketplacesCode + '\n  const [activeTab, setActiveTab]');
  
  const newTabContent = "\n        {activeTab === 'metas' && (\n          <div className='animate-in fade-in slide-in-from-bottom-4 duration-700 flex flex-col gap-8'>\n            " + innerContent + "\n          </div>\n        )}\n";
  bp = bp.replace('{activeTab === "estrategia" &&', newTabContent + '        {activeTab === "estrategia" &&');
  fs.writeFileSync('src/pages/BusinessPlan.tsx', bp);
  console.log('Merged successfully.');
} else {
  console.log('regex failed');
}
