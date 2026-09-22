const fs = require('fs');
let content = fs.readFileSync('src/pages/MuralAjustes.tsx', 'utf-8');

const startStr = '{/* MINIMALIST HEADER */}';
const endStr = '{/* BRUTALIST TICKETS GRID (COMPACT) */}';

let headerSection = content.substring(content.indexOf(startStr), content.indexOf(endStr));

const newHeaderSection = `{/* MINIMALIST HEADER */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-5 pt-0">
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-light text-white flex items-center gap-3">
                <LayoutGrid className="h-8 w-8 text-[#00FF00]" />
                Mural de Ajustes
              </h1>
              <p className="text-xs font-medium tracking-[0.2em] uppercase text-[#00FF00]">
                Correção de Erros e Otimização
              </p>
            </div>
          </div>
  
          {/* MINIMALIST TABS E ACTIONS */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
            <div className="flex flex-wrap gap-2">
              {['Todos', 'Shopee', 'Mercado Livre', 'Amazon', 'Geral'].map((m) => {
                const count = m === 'Todos' ? tickets.length : tickets.filter(t => (t.marketplace || '').toLowerCase() === m.toLowerCase()).length;
                const isActive = filter === m.toLowerCase();
                return (
                  <button 
                    key={m}
                    onClick={() => setFilter(m.toLowerCase())}
                    className={\`px-4 py-2 flex items-center gap-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border \${
                      isActive 
                        ? 'bg-white/10 text-white border-white/20' 
                        : 'bg-transparent border-transparent text-gray-500 hover:text-gray-300 hover:bg-white/5'
                    }\`}
                  >
                    {m !== 'Todos' && getMarketplaceLogo(m, "h-3.5 w-3.5 opacity-70")}
                    {m}
                    <span className={\`px-2 py-0.5 rounded-full text-[10px] \${isActive ? 'bg-[#00FF00] text-black' : 'bg-white/10 text-gray-400'}\`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-[#00FF00] hover:bg-[#CCFF00] text-black px-6 py-2.5 font-black text-xs uppercase tracking-widest transition-transform hover:scale-105 flex items-center gap-2 border-2 border-[#00FF00] shadow-[0_0_20px_rgba(0,255,0,0.15)]"
            >
              <Plus className="h-4 w-4 stroke-[3]" /> NOVO TICKET
            </button>
          </div>
          
          `;

content = content.replace(headerSection, newHeaderSection);
fs.writeFileSync('src/pages/MuralAjustes.tsx', content, 'utf-8');
console.log('Replaced header section');
