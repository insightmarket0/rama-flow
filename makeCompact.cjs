const fs = require('fs');
let content = fs.readFileSync('src/pages/MuralAjustes.tsx', 'utf-8');

const newCompactBlock = `
          {/* BRUTALIST TICKETS GRID (COMPACT) */}
          <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4">
            {filteredTickets.map((ticket) => {
              const isResolved = ticket.status === 'resolvido';
              const isCritical = ticket.priority === 'critico';
              
              const cardTheme = isResolved 
                ? "bg-[#0A0A0A] border-y-2 border-white/5 opacity-60"
                : isCritical 
                  ? "bg-[#00FF00] border-y-2 border-[#00FF00] shadow-[0_0_20px_rgba(0,255,0,0.15)]" 
                  : "bg-[#0A0A0A] border-y-2 border-[#00FF00]";
              
              const textColor = isCritical && !isResolved ? "text-black" : "text-white";
              const mutedColor = isCritical && !isResolved ? "text-black/70" : "text-gray-400";
              const pillTheme = isCritical && !isResolved ? "bg-black text-[#00FF00]" : "bg-white/10 text-white";
              const dividerTheme = isCritical && !isResolved ? "bg-black/20" : "bg-white/10";

              return (
                <div key={ticket.id} className={\`flex flex-col p-4 transition-all duration-300 hover:-translate-y-1 \${cardTheme}\`}>
                  
                  {/* CATEGORY PILL */}
                  <div className="flex justify-between items-start mb-4">
                    <div className={\`px-2 py-1 text-[8px] font-black uppercase tracking-[0.2em] flex items-center gap-1.5 \${pillTheme}\`}>
                      {getMarketplaceLogo(ticket.marketplace, "h-2.5 w-2.5")}
                      {ticket.marketplace}
                    </div>
                  </div>

                  {/* TITLE / SKU */}
                  <div className="flex flex-col gap-1.5 flex-1">
                    {ticket.sku && (
                      <h3 className={\`text-lg md:text-xl font-black uppercase tracking-tighter leading-none \${textColor} \${isResolved ? 'line-through opacity-50' : ''}\`}>
                        {ticket.sku}
                      </h3>
                    )}
                    <p className={\`text-xs font-bold leading-snug \${mutedColor} \${isResolved ? 'line-through' : ''}\`}>
                      {ticket.description}
                    </p>
                  </div>

                  {/* DIVIDER */}
                  <div className={\`w-full h-px my-4 \${dividerTheme}\`} />

                  {/* FOOTER */}
                  <div className="flex items-center justify-between mt-auto">
                    <div className={\`text-[8px] font-black uppercase tracking-widest flex items-center gap-1.5 \${mutedColor}\`}>
                      {ticket.assignee_name ? (
                        <>
                          <span>HOJE</span>
                          <span className="mx-0.5">•</span>
                          <span>{ticket.assignee_name.split(' ')[0]}</span>
                        </>
                      ) : (
                        <span>NÃO ATRIBUÍDO</span>
                      )}
                    </div>

                    {/* ACTIONS */}
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleDelete(ticket.id, ticket.sku)} className={\`p-1.5 hover:scale-110 transition-transform \${isCritical && !isResolved ? 'text-black/60 hover:text-black' : 'text-gray-500 hover:text-white'}\`} title="Excluir">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                      {(ticket.link || ticket.sku) && (
                        <a href={ticket.link || '#'} target="_blank" rel="noopener noreferrer" className={\`p-1.5 hover:scale-110 transition-transform \${isCritical && !isResolved ? 'text-black/60 hover:text-black' : 'text-gray-500 hover:text-white'}\`} title="Abrir Anúncio">
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      )}

                      {!isResolved ? (
                        <button onClick={() => handleResolve(ticket.id, ticket.sku)} className={\`ml-1.5 h-8 w-8 flex items-center justify-center rounded-full transition-transform hover:scale-105 shadow-xl \${isCritical && !isResolved ? 'bg-black text-[#00FF00]' : 'bg-[#00FF00] text-black'}\`} title="Resolver">
                          <Check className="w-4 h-4 stroke-[3]" />
                        </button>
                      ) : (
                        <div className="ml-1.5 h-8 w-8 flex items-center justify-center rounded-full bg-white/5 text-gray-500" title="Resolvido">
                          <Check className="w-4 h-4 stroke-[3]" />
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              );
            })}
`;

const startIndex = content.indexOf('{/* BRUTALIST TICKETS GRID */}');
const endIndex = content.indexOf('{filteredTickets.length === 0 && (');

if (startIndex !== -1 && endIndex !== -1) {
  content = content.substring(0, startIndex) + newCompactBlock + content.substring(endIndex);
  fs.writeFileSync('src/pages/MuralAjustes.tsx', content, 'utf-8');
  console.log('Made ticket cards more compact.');
} else {
  console.log('Could not find boundaries.');
}
