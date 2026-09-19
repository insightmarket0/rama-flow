const fs = require('fs');

let bp = fs.readFileSync('src/pages/BusinessPlan.tsx', 'utf8');
let metas = fs.readFileSync('src/pages/Metas.tsx', 'utf8');
let bb = fs.readFileSync('src/pages/BrandBook.tsx', 'utf8');

bp = bp.replace(/\r\n/g, '\n');
metas = metas.replace(/\r\n/g, '\n');
bb = bb.replace(/\r\n/g, '\n');

// 1. Get BrandBook Cards
const bbStart = bb.indexOf('{/* NOVA LINHA 5: DETALHAMENTO');
const bbEnd = bb.indexOf('{/* LINHA 9');
const bbCards = bb.substring(bbStart, bbEnd);

// 2. Extract Metas Content
const mStartStr = '<div className="flex-1 space-y-8 p-4 md:p-8 pt-6 animate-in fade-in duration-500">';
const mStart = metas.indexOf(mStartStr);
const mEndStr = '  );\n}';
const mEnd = metas.lastIndexOf(mEndStr);

// metasInner is the exact content to put inside the metas tab
let metasInner = metas.substring(mStart + mStartStr.length, mEnd).trim();
// we need to remove the last closing div from metasInner because the wrapper will be closed by the tab div
metasInner = metasInner.substring(0, metasInner.lastIndexOf('</div>')).trim();

// 3. Fix BP Imports
bp = bp.replace(
  'import { \n  Briefcase, Target, TrendingUp, Users, DollarSign, ArrowRight, \n  ShieldCheck, Zap, Globe, ShoppingBag, Box, Server, Paintbrush, \n  Network, Code2, Layers, Cpu, Fingerprint, Heart, MessageCircle, \n  Share2, Play, Search, User, Home, ShoppingCart\n} from "lucide-react";',
  'import { \n  Briefcase, Target, TrendingUp, Users, DollarSign, ArrowRight, \n  ShieldCheck, Zap, Globe, ShoppingBag, Box, Server, Paintbrush, \n  Network, Code2, Layers, Cpu, Fingerprint, Heart, MessageCircle, \n  Share2, Play, Search, User, Home, ShoppingCart, CheckCircle2, CircleDashed, Rocket, Store, Video, Smartphone, Asterisk, Sparkles, Sprout, HeartHandshake, Leaf, Circle\n} from "lucide-react";'
);

// 4. Fix BP State and Add Array
bp = bp.replace(
  'const [activeTab, setActiveTab] = useState<"estrategia" | "ecossistema" | "app">("estrategia");',
  'const marketplaces = [\n    { name: "Mercado Livre", status: "completed", icon: ShoppingCart, color: "text-yellow-500" },\n    { name: "Shopee", status: "completed", icon: ShoppingCart, color: "text-orange-500" },\n    { name: "Amazon", status: "completed", icon: ShoppingCart, color: "text-blue-500" },\n    { name: "Magalu", status: "completed", icon: ShoppingCart, color: "text-blue-600" },\n    { name: "TikTok", status: "pending", icon: Smartphone, color: "text-black dark:text-white" },\n    { name: "Site Próprio", status: "pending", icon: Globe, color: "text-primary" },\n  ];\n  const completedCount = marketplaces.filter(m => m.status === "completed").length;\n  const progressPercentage = (completedCount / marketplaces.length) * 100;\n  const [activeTab, setActiveTab] = useState<"estrategia" | "metas" | "ecossistema" | "app">("estrategia");'
);

// 5. Add Button
bp = bp.replace(
  '<button \n              onClick={() => setActiveTab("ecossistema")}',
  '<button \n              onClick={() => setActiveTab("metas")}\n              className={`px-4 lg:px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${activeTab === "metas" ? "bg-white/10 text-white shadow-sm" : "text-gray-500 hover:text-gray-300"}`}\n            >\n              Metas & Visão\n            </button>\n            <button \n              onClick={() => setActiveTab("ecossistema")}'
);

// 6. Inject Metas tab block before estrategia tab
bp = bp.replace(
  '{activeTab === "estrategia" && (',
  '{activeTab === "metas" && (\n          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 flex flex-col gap-8">\n            ' + metasInner + '\n          </div>\n        )}\n\n        {activeTab === "estrategia" && ('
);

// 7. Remove Mapeamento Corporativo tag
const mapStart = bp.indexOf('<div className="flex items-center gap-3 mb-2">');
const mapEnd = bp.indexOf('</div>\n          <h1 className="text-4xl md:text-5xl font-light text-white tracking-tighter">');
if (mapStart !== -1 && mapEnd !== -1) {
  bp = bp.substring(0, mapStart) + bp.substring(mapEnd + 7);
}

// 8. Remove the 2 cards and expand grid from 8 to 12 in the estrategia tab
bp = bp.replace('lg:col-span-8 bg-[#0a0a0a]', 'lg:col-span-12 bg-[#0a0a0a]');

const card4Start = bp.indexOf('<div className="lg:col-span-4 flex flex-col gap-4">');
const card4EndStr = '</div>\n                \n              </div>\n            </section>';
const card4End = bp.indexOf(card4EndStr, card4Start);
if (card4Start !== -1 && card4End !== -1) {
  bp = bp.substring(0, card4Start) + bp.substring(card4End + 6); // skip the extra </div>
}

// 9. Inject BrandBook cards at the end of activeTab === "estrategia" block
const endSectionIdx = bp.indexOf('</section>\n          </div>\n        )}');
if (endSectionIdx !== -1) {
  const injection = '\n            <section className="mt-8 flex flex-col gap-6">\n              ' + bbCards + '\n            </section>\n  ';
  bp = bp.substring(0, endSectionIdx) + injection + bp.substring(endSectionIdx);
}

fs.writeFileSync('src/pages/BusinessPlan.tsx', bp);
console.log('Safe fix applied successfully!');
