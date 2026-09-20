const fs = require('fs');
let content = fs.readFileSync('src/pages/BusinessPlan.tsx', 'utf-8');

const startStr = '<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">';
const startIndex = content.indexOf(startStr);

if (startIndex !== -1) {
    const endStr = '      </div>\n    </div>\n  )}';
    const endIndex = content.indexOf(endStr, startIndex);
    
    if (endIndex !== -1) {
        const replacement = `      {/* Marketplaces Progress Brutalista */}
      <section className="bg-black border-4 border-white/20 rounded-none flex flex-col justify-between shadow-2xl relative overflow-hidden mb-8">
        
        {/* TOP: Cabeçalho */}
        <div className="p-8 lg:p-10 border-b-4 border-white/20 relative">
          <div className="absolute -right-10 -top-10 text-[10rem] font-black text-white/5 pointer-events-none">
            MKTP
          </div>
          <div className="flex items-center justify-between mb-4 relative z-10">
            <h3 className="text-white font-black uppercase tracking-tighter text-3xl md:text-5xl flex items-center gap-4">
              <span className="text-[#CCFF00]">/</span>
              Presença em Marketplaces
            </h3>
            <span className="bg-[#CCFF00] text-black text-xl font-black px-6 py-2 border-4 border-white/20">
              {Math.round(progressPercentage)}%
            </span>
          </div>
          <p className="text-gray-400 text-sm font-bold uppercase tracking-[0.3em] relative z-10">
            Expansão Multicanal (Status: {completedCount} de {marketplaces.length})
          </p>
        </div>

        {/* MIDDLE: Metas Próximos Passos */}
        <div className="flex flex-col sm:flex-row border-b-4 border-white/20">
          <div className="flex-1 bg-[#111111] border-r-0 sm:border-r-4 border-b-4 sm:border-b-0 border-white/20 p-6 flex flex-col justify-center">
            <p className="text-[#CCFF00] text-[10px] uppercase tracking-[0.3em] font-bold mb-2 flex items-center gap-2">
              <span className="w-2 h-2 bg-[#CCFF00] animate-pulse" />
              Meta: Outubro
            </p>
            <p className="text-white font-black uppercase text-2xl tracking-tighter">Site Próprio (D2C)</p>
          </div>
          <div className="flex-1 bg-[#050505] p-6 flex flex-col justify-center relative overflow-hidden group">
            <p className="text-[#CCFF00] text-[10px] uppercase tracking-[0.3em] font-bold mb-2 flex items-center gap-2 relative z-10">
              <span className="w-2 h-2 bg-[#CCFF00] animate-pulse" />
              Meta: Novembro
            </p>
            <p className="text-white font-black uppercase text-2xl tracking-tighter relative z-10">TikTok Shop</p>
          </div>
        </div>
        
        {/* BOTTOM: Progress Bar */}
        <div className="w-full bg-[#111111] h-6 border-b-4 border-white/20 relative">
          <div className="bg-[#CCFF00] h-full" style={{ width: \`\${progressPercentage}%\` }}></div>
        </div>
        
        {/* BOTTOM: Grid de Marketplaces */}
        <div className="grid grid-cols-2 md:grid-cols-3">
          {marketplaces.map((mk, index) => (
            <div key={mk.name} className={\`p-6 flex flex-col gap-4 group \${index < marketplaces.length - 3 ? 'border-b-4 border-white/20' : ''} \${(index + 1) % 3 !== 0 ? 'border-r-4 border-white/20' : ''}\`}>
              <div className="flex justify-between items-start">
                <mk.icon className={\`h-8 w-8 \${mk.color === 'text-primary' ? 'text-[#CCFF00]' : mk.color === 'text-black dark:text-white' ? 'text-white' : mk.color}\`} />
                <span className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold">
                  {mk.status === "completed" ? (
                    <span className="text-[#CCFF00] flex items-center gap-1">ATIVO</span>
                  ) : (
                    <span className="text-orange-500 flex items-center gap-1">A FAZER</span>
                  )}
                </span>
              </div>
              <span className="font-black text-white text-lg uppercase tracking-tighter">{mk.name}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )}`;
        
        content = content.substring(0, startIndex) + replacement + content.substring(endIndex + endStr.length);
        fs.writeFileSync('src/pages/BusinessPlan.tsx', content, 'utf-8');
        console.log('Replaced successfully');
    } else {
        console.log('End string not found');
    }
} else {
    console.log('Start string not found');
}
