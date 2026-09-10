const fs = require('fs');
let content = fs.readFileSync('src/pages/Marketing.tsx', 'utf8');

const hookUpdates = `
  const [isScalingActive, setIsScalingActive] = useState(false);
`;

if (!content.includes('const [isScalingActive')) {
    content = content.replace('const handleEditBudget = () => {', hookUpdates + '\n  const handleEditBudget = () => {');
}

// Find the Modo Scaling card block
const startMatch = content.match(/<div className="bg-\[#0a0a0a\] border border-white\/5 rounded-2xl p-4 flex flex-col justify-center relative overflow-hidden group cursor-pointer hover:border-cyan-500\/50 transition-colors">[\s\S]*?<Flame className="w-3\.5 h-3\.5[\s\S]*?Modo Scaling[\s\S]*?<\/div>\s*<\/div>/);

if (startMatch) {
    const oldCard = startMatch[0];
    
    const newCard = `
                <div 
                  onClick={() => setIsScalingActive(!isScalingActive)}
                  className={\`bg-[#0a0a0a] border \${isScalingActive ? 'border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.15)]' : 'border-white/5'} rounded-2xl p-3.5 flex flex-col justify-between relative overflow-hidden cursor-pointer transition-all duration-300\`}
                >
                  <div className={\`absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent \${isScalingActive ? 'via-cyan-500' : 'via-white/10'} to-transparent transition-colors\`} ></div>
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-1.5">
                      <div className={\`p-1.5 rounded-lg \${isScalingActive ? 'bg-cyan-500/20' : 'bg-white/5'} transition-colors\`}>
                        <Flame className={\`w-4 h-4 \${isScalingActive ? 'text-cyan-400 drop-shadow-[0_0_5px_rgba(6,182,212,0.8)]' : 'text-gray-500'} transition-all\`} />
                      </div>
                      <span className={\`text-xs font-bold uppercase tracking-widest \${isScalingActive ? 'text-cyan-400' : 'text-gray-400'}\`}>Modo Scaling</span>
                    </div>
                    {/* Toggle Switch */}
                    <div className={\`w-8 h-4 rounded-full flex items-center px-0.5 transition-colors \${isScalingActive ? 'bg-cyan-500' : 'bg-[#222]'}\`}>
                      <div className={\`w-3 h-3 bg-white rounded-full transition-transform \${isScalingActive ? 'translate-x-4' : 'translate-x-0'}\`}></div>
                    </div>
                  </div>
                  <div className="mt-auto">
                    {isScalingActive ? (
                      <div className="flex flex-col gap-1">
                        <span className="text-white text-xs font-semibold">Ativo e Monitorando</span>
                        <p className="text-[9px] text-cyan-400/80 leading-tight">Injeção de +20% no orçamento diário se o CPA da campanha for &lt; R$ 15,00.</p>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-1">
                        <span className="text-gray-400 text-xs font-semibold">Pausado</span>
                        <p className="text-[9px] text-gray-600 leading-tight">Clique para ativar a injeção automática de verba em campanhas vencedoras.</p>
                      </div>
                    )}
                  </div>
                </div>`;
                
    content = content.replace(oldCard, newCard.trim());
    fs.writeFileSync('src/pages/Marketing.tsx', content, 'utf8');
    console.log("Success! Modo Scaling transformed.");
} else {
    console.log("Could not find Modo Scaling card to replace.");
}
