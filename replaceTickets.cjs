const fs = require('fs');
let content = fs.readFileSync('src/pages/MuralAjustes.tsx', 'utf-8');

const newTicketsBlock = `
          {/* BRUTALIST TICKETS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">
            {filteredTickets.map((ticket) => {
              const isResolved = ticket.status === 'resolvido';
              const isCritical = ticket.priority === 'critico';
              
              const cardTheme = isResolved 
                ? "bg-[#0A0A0A] border-y-2 border-white/5 opacity-60"
                : isCritical 
                  ? "bg-[#00FF00] border-y-2 border-[#00FF00] shadow-[0_0_30px_rgba(0,255,0,0.15)]" 
                  : "bg-[#0A0A0A] border-y-2 border-[#00FF00]";
              
              const textColor = isCritical && !isResolved ? "text-black" : "text-white";
              const mutedColor = isCritical && !isResolved ? "text-black/70" : "text-gray-400";
              const pillTheme = isCritical && !isResolved ? "bg-black text-[#00FF00]" : "bg-white/10 text-white";
              const dividerTheme = isCritical && !isResolved ? "bg-black/20" : "bg-white/10";

              return (
                <div key={ticket.id} className={\`flex flex-col p-6 transition-all duration-300 hover:-translate-y-1 \${cardTheme}\`}>
                  
                  {/* CATEGORY PILL */}
                  <div className="flex justify-between items-start mb-6">
                    <div className={\`px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.2em] flex items-center gap-2 \${pillTheme}\`}>
                      {getMarketplaceLogo(ticket.marketplace, "h-3 w-3")}
                      {ticket.marketplace}
                    </div>
                  </div>

                  {/* TITLE / SKU */}
                  <div className="flex flex-col gap-3 mb-8 flex-1">
                    {ticket.sku && (
                      <h3 className={\`text-2xl md:text-3xl font-black uppercase tracking-tighter leading-none \${textColor} \${isResolved ? 'line-through opacity-50' : ''}\`}>
                        {ticket.sku}
                      </h3>
                    )}
                    <p className={\`text-sm md:text-base font-bold leading-snug \${mutedColor} \${isResolved ? 'line-through' : ''}\`}>
                      {ticket.description}
                    </p>
                  </div>

                  {/* DIVIDER */}
                  <div className={\`w-full h-px mb-5 \${dividerTheme}\`} />

                  {/* FOOTER */}
                  <div className="flex items-center justify-between">
                    <div className={\`text-[9px] font-black uppercase tracking-widest flex items-center gap-2 \${mutedColor}\`}>
                      {ticket.assignee_name ? (
                        <>
                          <span>HOJE</span>
                          <span className="mx-1">•</span>
                          <span>{ticket.assignee_name.split(' ')[0]}</span>
                        </>
                      ) : (
                        <span>NÃO ATRIBUÍDO</span>
                      )}
                    </div>

                    {/* ACTIONS */}
                    <div className="flex items-center gap-3">
                      <button onClick={() => handleDelete(ticket.id, ticket.sku)} className={\`p-1.5 hover:scale-110 transition-transform \${isCritical && !isResolved ? 'text-black/60 hover:text-black' : 'text-gray-500 hover:text-white'}\`} title="Excluir">
                        <Trash2 className="h-4 w-4" />
                      </button>
                      {(ticket.link || ticket.sku) && (
                        <a href={ticket.link || '#'} target="_blank" rel="noopener noreferrer" className={\`p-1.5 hover:scale-110 transition-transform \${isCritical && !isResolved ? 'text-black/60 hover:text-black' : 'text-gray-500 hover:text-white'}\`} title="Abrir Anúncio">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}

                      {!isResolved ? (
                        <button onClick={() => handleResolve(ticket.id, ticket.sku)} className={\`ml-2 h-10 w-10 flex items-center justify-center rounded-full transition-transform hover:scale-105 shadow-xl \${isCritical && !isResolved ? 'bg-black text-[#00FF00]' : 'bg-[#00FF00] text-black'}\`} title="Resolver">
                          <Check className="w-5 h-5 stroke-[3]" />
                        </button>
                      ) : (
                        <div className="ml-2 h-10 w-10 flex items-center justify-center rounded-full bg-white/5 text-gray-500" title="Resolvido">
                          <Check className="w-5 h-5 stroke-[3]" />
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              );
            })}
`;

const oldStart = '{/* GLASSMORPHISM TICKETS GRID */}';
const oldEnd = '{filteredTickets.length === 0 && (';

const startIndex = content.indexOf(oldStart);
const endIndex = content.indexOf(oldEnd);

if (startIndex !== -1 && endIndex !== -1) {
  content = content.substring(0, startIndex) + newTicketsBlock + content.substring(endIndex);
  fs.writeFileSync('src/pages/MuralAjustes.tsx', content, 'utf-8');
  console.log('Replaced ticket cards with brutalist version.');
} else {
  console.log('Could not find boundaries.');
}
