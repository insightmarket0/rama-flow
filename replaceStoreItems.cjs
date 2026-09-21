const fs = require('fs');
let content = fs.readFileSync('src/pages/BusinessPlan.tsx', 'utf-8');

const startStr = '<div className="px-4 grid grid-cols-2 gap-3 mt-2">';
const endStr = '</div>\n  </div>\n)}';

let startIndex = content.indexOf(startStr);
let endIndex = content.indexOf(endStr, startIndex);

if (startIndex !== -1 && endIndex !== -1) {
    const newGrid = `<div className="px-4 grid grid-cols-2 gap-3 mt-2 pb-6">
      {/* Product 1 */}
      <div className="bg-[#0a0a0a] rounded-2xl p-1.5 border border-white/10 flex flex-col group hover:border-[#CCFF00]/50 transition-colors shadow-lg">
        <div className="w-full h-28 bg-[#1a1a1a] rounded-xl mb-2 overflow-hidden relative group-hover:opacity-90 transition-opacity">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?q=80&w=300&auto=format&fit=crop')] bg-cover bg-center opacity-80" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          <div className="absolute top-1.5 left-1.5 bg-[#CCFF00] text-black text-[8px] font-black px-1.5 py-0.5 rounded-sm uppercase tracking-wider">PREMIUM</div>
        </div>
        <div className="px-1 flex flex-col flex-1">
          <span className="text-white text-[10px] font-bold leading-snug line-clamp-2">Kit Premium de Gás Encanado + Registro de Segurança</span>
          <div className="mt-auto pt-2 flex items-center justify-between pb-1">
            <span className="text-[#CCFF00] font-black text-xs">R$ 149,90</span>
          </div>
        </div>
      </div>
      
      {/* Product 2 */}
      <div className="bg-[#0a0a0a] rounded-2xl p-1.5 border border-white/10 flex flex-col group hover:border-[#CCFF00]/50 transition-colors shadow-lg">
        <div className="w-full h-28 bg-[#1a1a1a] rounded-xl mb-2 overflow-hidden relative group-hover:opacity-90 transition-opacity">
           <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=300&auto=format&fit=crop')] bg-cover bg-center opacity-90" />
           <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
           <div className="absolute top-1.5 left-1.5 bg-black/50 backdrop-blur-sm text-white border border-white/10 text-[8px] font-black px-1.5 py-0.5 rounded-sm uppercase tracking-wider">CURVA A</div>
        </div>
        <div className="px-1 flex flex-col flex-1">
          <span className="text-white text-[10px] font-bold leading-snug line-clamp-2">Fogão Brastemp 4 Bocas Inox c/ Timer</span>
          <div className="mt-auto pt-2 flex items-center justify-between pb-1">
            <span className="text-[#CCFF00] font-black text-xs">R$ 1.299,00</span>
          </div>
        </div>
      </div>

      {/* Product 3 */}
      <div className="bg-[#0a0a0a] rounded-2xl p-1.5 border border-white/10 flex flex-col group hover:border-[#CCFF00]/50 transition-colors shadow-lg">
        <div className="w-full h-28 bg-[#1a1a1a] rounded-xl mb-2 overflow-hidden relative group-hover:opacity-90 transition-opacity">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1584286595398-a59f2afddaca?q=80&w=300&auto=format&fit=crop')] bg-cover bg-center opacity-80" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          <div className="absolute top-1.5 left-1.5 bg-[#FF00FF] text-white text-[8px] font-black px-1.5 py-0.5 rounded-sm uppercase tracking-wider">15% OFF</div>
        </div>
        <div className="px-1 flex flex-col flex-1">
          <span className="text-white text-[10px] font-bold leading-snug line-clamp-2">Kit Básico Mangueira Cobre 1.2m</span>
          <div className="mt-auto pt-2 flex items-center justify-between pb-1">
            <span className="text-[#CCFF00] font-black text-xs">R$ 89,90</span>
            <span className="text-white/40 text-[9px] line-through">R$ 105</span>
          </div>
        </div>
      </div>
      
      {/* Product 4 */}
      <div className="bg-[#0a0a0a] rounded-2xl p-1.5 border border-white/10 flex flex-col group hover:border-[#CCFF00]/50 transition-colors shadow-lg">
        <div className="w-full h-28 bg-[#1a1a1a] rounded-xl mb-2 overflow-hidden relative group-hover:opacity-90 transition-opacity">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=300&auto=format&fit=crop')] bg-cover bg-center opacity-80" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          <div className="absolute top-1.5 left-1.5 bg-[#00FFFF] text-black text-[8px] font-black px-1.5 py-0.5 rounded-sm uppercase tracking-wider">SERVIÇO</div>
        </div>
        <div className="px-1 flex flex-col flex-1">
          <span className="text-white text-[10px] font-bold leading-snug line-clamp-2">Instalação Técnica Especializada e Segura</span>
          <div className="mt-auto pt-2 flex items-center justify-between pb-1">
            <span className="text-[#CCFF00] font-black text-xs">R$ 90,00</span>
          </div>
        </div>
      </div>
    `;

    content = content.substring(0, startIndex) + newGrid + content.substring(endIndex);
    fs.writeFileSync('src/pages/BusinessPlan.tsx', content, 'utf-8');
    console.log('Store items upgraded!');
} else {
    console.log('Target string not found.');
}
