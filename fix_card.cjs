const fs = require('fs');
let content = fs.readFileSync('src/pages/MeuDia.tsx', 'utf-8');

const oldCard = \              <div key={ticket.id} className="col-span-1 rounded-2xl p-5 flex flex-col justify-between bg-gradient-to-b from-[#18181A] to-[#111111] border border-white/5 shadow-xl relative group">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className={\\\px-2 py-0.5 rounded-lg text-[9px] font-bold uppercase tracking-widest border flex items-center gap-1.5 \\\\}>
                      {getMarketplaceLogo(ticket.marketplace)}
                      {ticket.marketplace}
                    </span>
                    <span className="text-gray-500 text-[9px] font-bold uppercase tracking-widest flex items-center gap-1">
                      <Tag className="h-2.5 w-2.5" /> {ticket.sku}
                    </span>
                  </div>
                  
                  <p className="text-gray-300 font-light text-sm leading-relaxed mb-4 line-clamp-3">
                    {ticket.description}
                  </p>
                </div>
                
                <button 
                  onClick={() => handleResolveAdjustment(ticket.id)}
                  className="w-full bg-white/5 hover:bg-[#00FF00] hover:text-black text-white px-4 py-2 rounded-lg font-bold text-xs transition-all flex items-center justify-center gap-2 group-hover:shadow-[0_0_15px_rgba(0,255,0,0.2)]"
                >
                  Marcar Resolvido <CheckCircle2 className="h-3 w-3" />
                </button>
              </div>\;

const newCard = \              <div 
                key={ticket.id} 
                onClick={() => setActiveChatTicket(ticket)}
                className="col-span-1 bg-[#111111] hover:bg-[#151515] rounded-[24px] p-3 flex items-center gap-4 border border-white/5 shadow-xl cursor-pointer transition-all group hover:border-white/10"
              >
                {/* 1. Squircle Aesthetic Icon (like Image 1) */}
                <div className="w-14 h-14 rounded-[20px] bg-white/5 flex flex-col items-center justify-center shrink-0 border border-white/10 group-hover:bg-white/10 transition-colors">
                  <MessageSquare className="w-5 h-5 text-gray-300 mb-0.5" />
                  <span className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">Chat</span>
                </div>
                
                {/* 2. Message Preview Content */}
                <div className="flex-1 overflow-hidden flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={\\\px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-widest border flex items-center gap-1 \\\\}>
                      {getMarketplaceLogo(ticket.marketplace)}
                      {ticket.marketplace}
                    </span>
                    <span className="text-gray-500 text-[9px] font-bold uppercase tracking-widest truncate">
                      {ticket.sku}
                    </span>
                  </div>
                  <p className="text-gray-300 font-medium text-xs leading-snug truncate">
                    {ticket.description}
                  </p>
                </div>
                
                {/* 3. Resolve Button */}
                <button 
                  onClick={(e) => { e.stopPropagation(); handleResolveAdjustment(ticket.id) }}
                  className="bg-white/5 hover:bg-[#00FF00] hover:text-black text-gray-400 w-12 h-12 rounded-[18px] transition-all flex items-center justify-center border border-transparent hover:border-[#00FF00]/50 shrink-0"
                  title="Marcar Resolvido"
                >
                  <CheckCircle2 className="h-5 w-5" />
                </button>
              </div>\;

content = content.replace(oldCard, newCard);
fs.writeFileSync('src/pages/MeuDia.tsx', content, 'utf-8');
