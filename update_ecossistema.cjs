const fs = require('fs');
let content = fs.readFileSync('src/pages/BusinessPlan.tsx', 'utf-8');

const startStr = '{/* Grid Principal do Ecossistema */}';
let startIndex = content.indexOf(startStr);

if (startIndex !== -1) {
    const endStr = '                {/* Card: Expediǜo (Rama Flow) */}';
    // Actually the easiest way to find the end is:
    const finalEndStr = '              </div>\n            </div>\n\n          </div>\n        )}';
    let endIndex = content.indexOf(finalEndStr, startIndex);
    
    if (endIndex !== -1) {
        const replacement = `              {/* Grid Principal do Ecossistema Brutalista */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 border-4 border-white/20 bg-[#050505] shadow-2xl relative mb-12">
                
                {/* LINHA DE DIVISÃO CENTRAL DESKTOP */}
                <div className="hidden lg:block absolute top-0 bottom-0 left-1/2 w-1 bg-white/20" />

                {/* --- COLUNA ESQUERDA --- */}
                <div className="flex flex-col border-b-4 lg:border-b-0 border-white/20">
                  {/* CABEÇALHO ESQUERDA */}
                  <div className="bg-[#CCFF00] p-4 lg:p-6 border-b-4 border-white/20 flex items-center justify-between">
                    <h3 className="text-black font-black uppercase tracking-tighter text-2xl lg:text-3xl">AQUISIÇÃO</h3>
                    <span className="text-black text-[10px] font-black uppercase tracking-[0.3em]">Client-Facing</span>
                  </div>

                  {/* ITEM 1 */}
                  <div className="p-6 lg:p-10 border-b-4 border-white/20 relative overflow-hidden group bg-[#111111]">
                    <div className="absolute -right-10 -bottom-10 text-[12rem] font-black text-white/5 pointer-events-none transition-transform duration-700 group-hover:scale-110">1</div>
                    <h4 className="text-white font-black text-3xl lg:text-4xl uppercase tracking-tighter mb-4 relative z-10 flex flex-col">
                      <span className="text-[#CCFF00] text-[11px] tracking-[0.4em] font-bold mb-2">MÁQUINA REGIONAL</span>
                      Marketing & Influenciadores
                    </h4>
                    <p className="text-gray-400 text-sm font-bold leading-relaxed mb-8 relative z-10 max-w-[90%]">
                      Nossa máquina de influência regional. Conteúdo em vídeo retroalimentando o TikTok/IG, Lives Commerce semanais focadas em alta conversão e pessoas reais ancorando a confiança da marca.
                    </p>
                    <div className="flex flex-wrap gap-2 relative z-10">
                      <span className="bg-white/5 text-white border-2 border-white/20 text-[10px] uppercase font-bold px-3 py-1.5">Influenciadores do ABC</span>
                      <span className="bg-white/5 text-white border-2 border-white/20 text-[10px] uppercase font-bold px-3 py-1.5">Live Commerce</span>
                      <span className="bg-white/5 text-white border-2 border-white/20 text-[10px] uppercase font-bold px-3 py-1.5">Conteúdo Viral</span>
                    </div>
                  </div>

                  {/* ITEM 2 */}
                  <div className="p-6 lg:p-10 border-b-4 border-white/20 relative overflow-hidden group bg-black">
                    <div className="absolute -right-10 -bottom-10 text-[12rem] font-black text-white/5 pointer-events-none transition-transform duration-700 group-hover:scale-110">2</div>
                    <h4 className="text-white font-black text-3xl lg:text-4xl uppercase tracking-tighter mb-4 relative z-10 flex flex-col">
                      <span className="text-yellow-400 text-[11px] tracking-[0.4em] font-bold mb-2">MOTOR DE VOLUME</span>
                      Ecossistema de Marketplaces
                    </h4>
                    <p className="text-gray-400 text-sm font-bold leading-relaxed mb-8 relative z-10 max-w-[90%]">
                      Nosso principal motor de volume. Múltiplas contas gerenciadas estrategicamente com foco agressivo em precificação, Ads e um catálogo de produtos Curva A de alta demanda.
                    </p>
                    <div className="flex flex-wrap gap-2 relative z-10">
                      <span className="bg-[#FFE600] text-black border-2 border-[#FFE600] text-[10px] uppercase font-black px-3 py-1.5">Mercado Livre</span>
                      <span className="bg-[#EE4D2D] text-white border-2 border-[#EE4D2D] text-[10px] uppercase font-black px-3 py-1.5">Shopee</span>
                      <span className="bg-[#FF9900] text-white border-2 border-[#FF9900] text-[10px] uppercase font-black px-3 py-1.5">Amazon</span>
                    </div>
                  </div>

                  {/* ITEM 3 */}
                  <div className="p-6 lg:p-10 relative overflow-hidden group bg-[#111111]">
                    <div className="absolute -right-10 -bottom-10 text-[12rem] font-black text-white/5 pointer-events-none transition-transform duration-700 group-hover:scale-110">3</div>
                    <h4 className="text-white font-black text-3xl lg:text-4xl uppercase tracking-tighter mb-4 relative z-10 flex flex-col">
                      <span className="text-blue-400 text-[11px] tracking-[0.4em] font-bold mb-2">CANAIS DIRETOS</span>
                      Nuvemshop & Whats
                    </h4>
                    <p className="text-gray-400 text-sm font-bold leading-relaxed mb-8 relative z-10 max-w-[90%]">
                      O canal para o público brasileiro: operação via WhatsApp. Copiloto de Inteligência Artificial para escala de atendimento humanizado e oferta de venda cruzada de produtos + serviços.
                    </p>
                    <div className="flex flex-wrap gap-2 relative z-10">
                      <span className="bg-white/5 text-white border-2 border-white/20 text-[10px] uppercase font-bold px-3 py-1.5">Copiloto IA</span>
                      <span className="bg-white/5 text-white border-2 border-white/20 text-[10px] uppercase font-bold px-3 py-1.5">Atendimento Humano</span>
                      <span className="bg-white/5 text-white border-2 border-white/20 text-[10px] uppercase font-bold px-3 py-1.5">Cross-Sell</span>
                    </div>
                  </div>
                </div>

                {/* --- COLUNA DIREITA --- */}
                <div className="flex flex-col bg-black">
                  {/* CABEÇALHO DIREITA */}
                  <div className="bg-white p-4 lg:p-6 border-b-4 border-white/20 flex items-center justify-between">
                    <h3 className="text-black font-black uppercase tracking-tighter text-2xl lg:text-3xl">OPERAÇÃO</h3>
                    <span className="text-black text-[10px] font-black uppercase tracking-[0.3em]">Back-End</span>
                  </div>

                  {/* ITEM 4 */}
                  <div className="p-6 lg:p-10 border-b-4 border-white/20 relative overflow-hidden group bg-black">
                    <div className="absolute -right-10 -bottom-10 text-[12rem] font-black text-white/5 pointer-events-none transition-transform duration-700 group-hover:scale-110">4</div>
                    <h4 className="text-white font-black text-3xl lg:text-4xl uppercase tracking-tighter mb-4 relative z-10 flex flex-col">
                      <span className="text-emerald-400 text-[11px] tracking-[0.4em] font-bold mb-2">O CÉREBRO</span>
                      Rama System Hub
                    </h4>
                    <p className="text-gray-400 text-sm font-bold leading-relaxed mb-8 relative z-10 max-w-[90%]">
                      Nosso sistema interno proprietário. Conciliação financeira automatizada, gestão preditiva de suprimentos (Bot de Compras), rastreio de gargalos e dashboard para tomada de decisão.
                    </p>
                    <div className="flex flex-wrap gap-2 relative z-10">
                      <span className="bg-white/5 text-white border-2 border-white/20 text-[10px] uppercase font-bold px-3 py-1.5">Conciliação Auto</span>
                      <span className="bg-white/5 text-white border-2 border-white/20 text-[10px] uppercase font-bold px-3 py-1.5">Bot Compras</span>
                      <span className="bg-white/5 text-white border-2 border-white/20 text-[10px] uppercase font-bold px-3 py-1.5">Previsibilidade</span>
                    </div>
                  </div>

                  {/* ITEM 5 */}
                  <div className="p-6 lg:p-10 relative overflow-hidden group bg-[#111111]">
                    <div className="absolute -right-10 -bottom-10 text-[12rem] font-black text-white/5 pointer-events-none transition-transform duration-700 group-hover:scale-110">5</div>
                    <h4 className="text-white font-black text-3xl lg:text-4xl uppercase tracking-tighter mb-4 relative z-10 flex flex-col">
                      <span className="text-[#CCFF00] text-[11px] tracking-[0.4em] font-bold mb-2">LOGÍSTICA</span>
                      Rama Flow (Same-Day)
                    </h4>
                    <p className="text-gray-400 text-sm font-bold leading-relaxed mb-8 relative z-10 max-w-[90%]">
                      O coração físico do negócio em SP/ABC. Expedição no mesmo dia (Flex), zero erros na separação, redução de custos com embalagens inteligentes e controle anti-fraude.
                    </p>
                    <div className="flex flex-wrap gap-2 relative z-10">
                      <span className="bg-white/5 text-white border-2 border-white/20 text-[10px] uppercase font-bold px-3 py-1.5">Same-Day Flex</span>
                      <span className="bg-white/5 text-white border-2 border-white/20 text-[10px] uppercase font-bold px-3 py-1.5">Zero Erros</span>
                      <span className="bg-white/5 text-white border-2 border-white/20 text-[10px] uppercase font-bold px-3 py-1.5">Radar Logístico</span>
                    </div>
                  </div>
                </div>

`;
        content = content.substring(0, startIndex) + replacement + content.substring(endIndex);
        fs.writeFileSync('src/pages/BusinessPlan.tsx', content, 'utf-8');
        console.log('Replaced successfully');
    } else {
        console.log('End string not found');
    }
} else {
    console.log('Start string not found');
}
