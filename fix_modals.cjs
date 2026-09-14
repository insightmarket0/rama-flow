
const fs = require("fs");
let content = fs.readFileSync("src/pages/MeuDia.tsx", "utf-8");

const startStr = "{/* MODAL DE CHAT DA DIVERG";
const endStr = "      )}";

while (content.includes(startStr)) {
    let startIdx = content.indexOf(startStr);
    let endIdx = content.indexOf(endStr, startIdx) + endStr.length;
    content = content.substring(0, startIdx - 6) + content.substring(endIdx);
}

// Now insert it ONLY at the very end of the file, before the last </div>
const modalCode = `
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
              <button onClick={(e) => { e.stopPropagation(); setActiveChatTicket(null); }} className="text-gray-400 hover:text-white bg-white/5 p-2 rounded-full transition-colors">
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
              <button className="w-10 h-10 bg-cyan-600 hover:bg-cyan-500 rounded-full flex items-center justify-center text-white transition-colors shrink-0">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
`;

const lastDivIdx = content.lastIndexOf("</div>");
content = content.substring(0, lastDivIdx) + modalCode + "\n    " + content.substring(lastDivIdx);

fs.writeFileSync("src/pages/MeuDia.tsx", content, "utf-8");

