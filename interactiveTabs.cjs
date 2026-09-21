const fs = require('fs');
let content = fs.readFileSync('src/pages/BusinessPlan.tsx', 'utf-8');

// 1. Add state
const stateInsertion = 'const [activeMarketVision, setActiveMarketVision] = useState<"farma" | "atendimento">("farma");';
if (content.includes(stateInsertion) && !content.includes('activeD2CTab')) {
    content = content.replace(stateInsertion, stateInsertion + '\n  const [activeD2CTab, setActiveD2CTab] = useState<"video" | "store">("video");');
}

// 2. Replace the middle content of Celular 1
const videoContentStart = '<div className="relative flex-1 bg-[#111111] overflow-hidden group cursor-pointer">';
const videoContentEnd = '{/* VS Badge */}'; // Wait, I need to replace just the middle part and the nav bar

// Let's find the exact bounds of the inner content.
// The inner content is: `<div className="relative flex-1 bg-[#111111] overflow-hidden group cursor-pointer">`
// up to just before `<div className="h-16 bg-[#000000] flex justify-around items-center px-2 z-40 relative">`
const contentToReplaceStart = `<div className="relative flex-1 bg-[#111111] overflow-hidden group cursor-pointer">`;
const contentToReplaceEnd = `<div className="h-16 bg-[#000000] flex justify-around items-center px-2 z-40 relative">`;

let startIndex = content.indexOf(contentToReplaceStart);
let endIndex = content.indexOf(contentToReplaceEnd);

if (startIndex !== -1 && endIndex !== -1) {
    const originalVideoContent = content.substring(startIndex, endIndex);

    const storeContent = `
{activeD2CTab === "video" ? (
  <div className="relative flex-1 bg-[#111111] overflow-hidden group cursor-pointer">
    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1540569014015-19a7be504e3a?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center opacity-80" />
    <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/90" />
    
    <div className="absolute bottom-0 left-0 w-full p-4 pb-20 flex justify-between items-end">
      <div className="flex-1 pr-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#CCFF00] to-indigo-500 p-0.5">
            <div className="w-full h-full bg-black rounded-full flex items-center justify-center text-white font-bold text-xs shadow-lg">RF</div>
          </div>
          <div className="flex flex-col">
              <span className="text-white font-bold text-sm drop-shadow-md">@ramaflow</span>
              <span className="text-[#CCFF00] text-[9px] font-bold uppercase tracking-wider">Patrocinado</span>
          </div>
        </div>
        <p className="text-white text-sm font-medium mb-4 drop-shadow-md leading-snug">
          Testei o <span className="font-bold">Kit de Instalação de Gás com Válvula de Segurança</span> da Rama Flow. Olha a facilidade e a economia! 🚀🔥
        </p>
        <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl p-2.5 flex gap-3 items-center cursor-pointer hover:bg-white/10 transition-colors shadow-2xl">
          <div className="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center border border-white/5">
            <svg viewBox="0 0 24 24" className="text-[#CCFF00] w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
          </div>
          <div className="flex-1">
            <h4 className="text-white text-xs font-bold leading-tight">Kit Mangueira + Registro</h4>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-[#CCFF00] font-black text-sm">R$ 89,90</span>
              <span className="text-white/40 text-[10px] line-through">R$ 120</span>
            </div>
          </div>
          <button className="bg-[#CCFF00] text-black w-8 h-8 rounded-full flex items-center justify-center hover:bg-yellow-400 transition-colors shrink-0 shadow-md">
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-5 items-center mb-4">
        <div className="flex flex-col items-center gap-1">
          <div className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors">
            <svg viewBox="0 0 24 24" className="w-7 h-7 text-white drop-shadow-md" fill="white" stroke="currentColor" strokeWidth="1"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
          </div>
          <span className="text-white text-[11px] font-bold drop-shadow-md">12.4k</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <div className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors">
            <svg viewBox="0 0 24 24" className="w-7 h-7 text-white drop-shadow-md" fill="white" stroke="none" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
          </div>
          <span className="text-white text-[11px] font-bold drop-shadow-md">842</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <div className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors">
            <svg viewBox="0 0 24 24" className="w-7 h-7 text-white drop-shadow-md" fill="white" stroke="none"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" stroke="white" strokeWidth="2"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" stroke="white" strokeWidth="2"></line></svg>
          </div>
          <span className="text-white text-[11px] font-bold drop-shadow-md">2k</span>
        </div>
      </div>
    </div>

    <div className="absolute top-1/3 left-4 right-16 space-y-3 pointer-events-none opacity-95">
       <div className="bg-black/50 backdrop-blur-lg p-2.5 rounded-2xl rounded-tl-sm border border-white/10 w-fit animate-pulse shadow-xl flex items-center gap-2">
         <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-[10px] text-white font-bold">J</div>
         <div>
           <span className="text-white/60 text-[10px] font-bold block mb-0.5">João M.</span>
           <p className="text-white text-xs font-medium">Produto top! Chegou no mesmo dia.</p>
         </div>
       </div>
       <div className="bg-black/50 backdrop-blur-lg p-2.5 rounded-2xl rounded-tl-sm border border-white/10 w-fit ml-8 animate-pulse delay-150 shadow-xl flex items-center gap-2">
         <div className="w-6 h-6 rounded-full bg-pink-500 flex items-center justify-center text-[10px] text-white font-bold">M</div>
         <div>
           <span className="text-white/60 text-[10px] font-bold block mb-0.5">Marcia T.</span>
           <p className="text-white text-xs font-medium">Excelente, técnico super educado!</p>
         </div>
       </div>
    </div>
  </div>
) : (
  <div className="relative flex-1 bg-[#050505] overflow-y-auto custom-scrollbar flex flex-col pb-6">
    <div className="sticky top-0 w-full bg-black/80 backdrop-blur-xl border-b border-white/5 z-20 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#CCFF00] to-indigo-500 p-[1.5px]">
          <div className="w-full h-full bg-black rounded-full flex items-center justify-center text-white font-bold text-[9px]">RF</div>
        </div>
        <span className="text-white font-bold text-xs uppercase tracking-widest">Loja Oficial</span>
      </div>
      <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center">
        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
      </div>
    </div>
    
    <div className="p-4 flex gap-2 overflow-x-auto custom-scrollbar pb-2">
      <div className="px-3 py-1.5 bg-[#CCFF00] text-black rounded-full text-[10px] font-bold whitespace-nowrap">Kits de Gás</div>
      <div className="px-3 py-1.5 bg-white/10 text-white rounded-full text-[10px] font-medium whitespace-nowrap">Fogões</div>
      <div className="px-3 py-1.5 bg-white/10 text-white rounded-full text-[10px] font-medium whitespace-nowrap">Peças</div>
    </div>

    <div className="px-4 grid grid-cols-2 gap-3 mt-2">
      {/* Product 1 */}
      <div className="bg-[#111111] rounded-2xl p-2 border border-white/5 flex flex-col group">
        <div className="w-full h-28 bg-[#1a1a1a] rounded-xl flex items-center justify-center mb-2 overflow-hidden relative">
          <svg viewBox="0 0 24 24" className="w-10 h-10 text-white/20" fill="none" stroke="currentColor" strokeWidth="1"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg>
          <div className="absolute top-1 left-1 bg-[#CCFF00] text-black text-[8px] font-bold px-1.5 py-0.5 rounded-sm">KITS</div>
        </div>
        <span className="text-white text-[10px] font-bold leading-tight line-clamp-2">Kit Premium de Gás Encanado + Registro</span>
        <div className="mt-auto pt-2 flex items-center justify-between">
          <span className="text-[#CCFF00] font-black text-xs">R$ 149,90</span>
        </div>
      </div>
      
      {/* Product 2 */}
      <div className="bg-[#111111] rounded-2xl p-2 border border-white/5 flex flex-col group">
        <div className="w-full h-28 bg-[#1a1a1a] rounded-xl flex items-center justify-center mb-2 overflow-hidden relative">
           <svg viewBox="0 0 24 24" className="w-10 h-10 text-white/20" fill="none" stroke="currentColor" strokeWidth="1"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><circle cx="12" cy="14" r="4"></circle><line x1="12" y1="6" x2="12.01" y2="6"></line></svg>
        </div>
        <span className="text-white text-[10px] font-bold leading-tight line-clamp-2">Fogão Brastemp 4 Bocas Inox c/ Timer</span>
        <div className="mt-auto pt-2 flex items-center justify-between">
          <span className="text-[#CCFF00] font-black text-xs">R$ 1.299,00</span>
        </div>
      </div>

      {/* Product 3 */}
      <div className="bg-[#111111] rounded-2xl p-2 border border-white/5 flex flex-col group">
        <div className="w-full h-28 bg-[#1a1a1a] rounded-xl flex items-center justify-center mb-2 overflow-hidden relative">
          <svg viewBox="0 0 24 24" className="w-10 h-10 text-white/20" fill="none" stroke="currentColor" strokeWidth="1"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg>
          <div className="absolute top-1 left-1 bg-red-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-sm">15% OFF</div>
        </div>
        <span className="text-white text-[10px] font-bold leading-tight line-clamp-2">Kit Básico Mangueira Cobre 1.2m</span>
        <div className="mt-auto pt-2 flex items-center justify-between">
          <span className="text-[#CCFF00] font-black text-xs">R$ 89,90</span>
        </div>
      </div>
      
      {/* Product 4 */}
      <div className="bg-[#111111] rounded-2xl p-2 border border-white/5 flex flex-col group">
        <div className="w-full h-28 bg-[#1a1a1a] rounded-xl flex items-center justify-center mb-2 overflow-hidden relative">
          <svg viewBox="0 0 24 24" className="w-10 h-10 text-white/20" fill="none" stroke="currentColor" strokeWidth="1"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
        </div>
        <span className="text-white text-[10px] font-bold leading-tight line-clamp-2">Serviço de Instalação Especializada</span>
        <div className="mt-auto pt-2 flex items-center justify-between">
          <span className="text-[#CCFF00] font-black text-xs">R$ 90,00</span>
        </div>
      </div>
    </div>
  </div>
)}
`;

    content = content.substring(0, startIndex) + storeContent + content.substring(endIndex);
}

// 3. Update the Nav Bar buttons to have onClick
const navBarStart = '<div className="h-16 bg-[#000000] flex justify-around items-center px-2 z-40 relative">';
const navBarEnd = '</div>\n                  </div>\n                </div>\n\n                {/* VS Badge */}'; // bounds of nav bar + parent divs

const oldNavBar = `<div className="h-16 bg-[#000000] flex justify-around items-center px-2 z-40 relative">
                      <div className="flex flex-col items-center gap-1 text-white cursor-pointer transition-colors">
                        <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor" stroke="currentColor" strokeWidth="1"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                        <span className="text-[9px] font-bold">Início</span>
                      </div>
                      <div className="flex flex-col items-center gap-1 text-white/50 cursor-pointer hover:text-white transition-colors">
                        <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
                        <span className="text-[9px] font-medium">Loja</span>
                      </div>`;

const newNavBar = `<div className="h-16 bg-[#000000] flex justify-around items-center px-2 z-40 relative">
                      <div onClick={() => setActiveD2CTab("video")} className={\`flex flex-col items-center gap-1 cursor-pointer transition-colors \${activeD2CTab === "video" ? "text-white" : "text-white/50 hover:text-white"}\`}>
                        <svg viewBox="0 0 24 24" className="w-6 h-6" fill={activeD2CTab === "video" ? "currentColor" : "none"} stroke="currentColor" strokeWidth={activeD2CTab === "video" ? "1" : "2"}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                        <span className={\`text-[9px] \${activeD2CTab === "video" ? "font-bold" : "font-medium"}\`}>Início</span>
                      </div>
                      <div onClick={() => setActiveD2CTab("store")} className={\`flex flex-col items-center gap-1 cursor-pointer transition-colors \${activeD2CTab === "store" ? "text-white" : "text-white/50 hover:text-white"}\`}>
                        <svg viewBox="0 0 24 24" className="w-6 h-6" fill={activeD2CTab === "store" ? "currentColor" : "none"} stroke="currentColor" strokeWidth={activeD2CTab === "store" ? "1" : "2"}><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
                        <span className={\`text-[9px] \${activeD2CTab === "store" ? "font-bold" : "font-medium"}\`}>Loja</span>
                      </div>`;

if (content.includes(oldNavBar)) {
    content = content.replace(oldNavBar, newNavBar);
}

fs.writeFileSync('src/pages/BusinessPlan.tsx', content, 'utf-8');
console.log('Finished updating Celular 1 interactive tabs.');
