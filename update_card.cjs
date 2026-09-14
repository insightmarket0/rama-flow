const fs = require('fs');
let content = fs.readFileSync('src/pages/MeuDia.tsx', 'utf-8');

if (!content.includes('import { MessageSquare')) {
    content = content.replace('import { ', 'import { MessageSquare, X, Send, ');
}

const statePos = content.indexOf('const [adjustments, setAdjustments] = useState');
const newStates = \const [activeChatTicket, setActiveChatTicket] = useState<any>(null);
  \;
content = content.substring(0, statePos) + newStates + content.substring(statePos);

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
                  <MessageSquare className="w-5 h-5 text-gray-300 mb-1" />
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
                  <p className="text-gray-300 font-medium text-sm leading-snug truncate">
                    {ticket.description}
                  </p>
                </div>
                
                {/* 3. Resolve Button */}
                <button 
                  onClick={(e) => { e.stopPropagation(); handleResolveAdjustment(ticket.id) }}
                  className="bg-white/5 hover:bg-[#00FF00] hover:text-black text-gray-400 px-4 py-4 rounded-[18px] transition-all flex items-center justify-center border border-transparent hover:border-[#00FF00]/50"
                  title="Marcar Resolvido"
                >
                  <CheckCircle2 className="h-5 w-5" />
                </button>
              </div>\;

content = content.replace(oldCard, newCard);

const chatModalCode = \
      {/* MODAL DE CHAT DA DIVERGÊNCIA */}
      {activeChatTicket && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0a0a0a] border border-[#222] rounded-[32px] w-full max-w-lg overflow-hidden flex flex-col shadow-2xl h-[600px] animate-in zoom-in-95 duration-200">
            {/* Header do Chat */}
            <div className="p-4 border-b border-[#222] flex justify-between items-center bg-[#111]">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-[16px] bg-white/5 flex items-center justify-center border border-white/10">
                  {getMarketplaceLogo(activeChatTicket.marketplace)}
                </div>
                <div>
                  <h2 className="text-white font-bold text-sm">{activeChatTicket.marketplace}</h2>
                  <p className="text-[10px] text-gray-400 font-mono tracking-widest">{activeChatTicket.sku}</p>
                </div>
              </div>
              <button onClick={() => setActiveChatTicket(null)} className="text-gray-400 hover:text-white bg-white/5 p-2 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Mensagens */}
            <div className="flex-1 p-5 overflow-y-auto custom-scrollbar flex flex-col gap-4">
              <div className="flex justify-center mb-2">
                <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Início da Conversa</span>
              </div>
              
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-[12px] bg-red-500/10 flex items-center justify-center border border-red-500/20 shrink-0">
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                </div>
                <div className="bg-[#1a1a1a] border border-[#333] rounded-2xl rounded-tl-sm p-3 max-w-[85%]">
                  <p className="text-gray-300 text-sm">{activeChatTicket.description}</p>
                  <span className="text-[9px] text-gray-500 mt-1 block">Sistema • Agora</span>
                </div>
              </div>
            </div>
            
            {/* Input do Chat */}
            <div className="p-4 border-t border-[#222] bg-[#111] flex gap-2">
              <input 
                type="text" 
                placeholder="Digite sua mensagem para a equipe..." 
                className="flex-1 bg-black border border-[#333] rounded-full px-4 text-sm text-white focus:outline-none focus:border-cyan-500"
              />
              <button className="w-10 h-10 bg-cyan-600 hover:bg-cyan-500 rounded-full flex items-center justify-center text-white transition-colors">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
\;

const lastDivIdx = content.lastIndexOf('</div>');
content = content.substring(0, lastDivIdx) + chatModalCode + '\\n    ' + content.substring(lastDivIdx);

fs.writeFileSync('src/pages/MeuDia.tsx', content, 'utf-8');
console.log('Done');
