const fs = require('fs');
let content = fs.readFileSync('src/pages/BusinessPlan.tsx', 'utf-8');

const searchPoint = 'A RAMA entrega os produtos Curva A no mesmo dia (Prazo de 1 dia) em todo o ABC.</span>';
const startIndex = content.indexOf(searchPoint);

if (startIndex !== -1) {
    const endSectionToken = '</section>';
    const insertPoint = content.indexOf(endSectionToken, startIndex) + endSectionToken.length;
    
    const block = `

            {/* LINHA 8: REFERÊNCIAS */}
            <section className="bg-[#050505] border-4 border-white/20 p-6 lg:p-8 relative overflow-hidden group mt-6">
              <div className="flex flex-col gap-8 relative z-10">
                <div className="flex items-center gap-4 border-b-2 border-white/10 pb-4">
                  <div className="w-4 h-4 bg-[#CCFF00]" />
                  <h3 className="text-white text-2xl md:text-3xl font-black uppercase tracking-tighter">
                    Nossas <span className="text-[#CCFF00]">Referências</span>
                  </h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                  {/* Modelo de Negócios */}
                  <div className="flex flex-col gap-4">
                    <h4 className="text-white/50 text-[10px] font-black uppercase tracking-widest border-b border-white/10 pb-2 flex items-center gap-2">
                      <Target className="w-4 h-4 text-white/50" />
                      Formato de Negócios
                    </h4>
                    <div className="flex flex-col gap-3">
                      <div className="bg-white/5 p-4 border-l-4 border-[#CCFF00] hover:bg-white/10 transition-colors">
                        <span className="text-white font-bold text-lg block uppercase tracking-tight">Mercado Livre</span>
                        <span className="text-white/60 text-[11px] uppercase font-bold tracking-wider mt-1 block">Agilidade & Malha Logística</span>
                      </div>
                      <div className="bg-white/5 p-4 border-l-4 border-[#CCFF00] hover:bg-white/10 transition-colors">
                        <span className="text-white font-bold text-lg block uppercase tracking-tight">TikTok</span>
                        <span className="text-white/60 text-[11px] uppercase font-bold tracking-wider mt-1 block">Venda por Conteúdo Rápido</span>
                      </div>
                      <div className="bg-white/5 p-4 border-l-4 border-[#CCFF00] hover:bg-white/10 transition-colors">
                        <span className="text-white font-bold text-lg block uppercase tracking-tight">Marketplaces</span>
                        <span className="text-white/60 text-[11px] uppercase font-bold tracking-wider mt-1 block">Ecossistemas de Alto Crescimento</span>
                      </div>
                    </div>
                  </div>

                  {/* Marca e Influência */}
                  <div className="flex flex-col gap-4">
                    <h4 className="text-white/50 text-[10px] font-black uppercase tracking-widest border-b border-white/10 pb-2 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-white/50" />
                      Marca & Redes Sociais
                    </h4>
                    <div className="flex flex-col gap-3">
                      <div className="bg-[#CCFF00]/10 p-4 border-l-4 border-[#CCFF00] hover:bg-[#CCFF00]/20 transition-colors">
                        <span className="text-[#CCFF00] font-bold text-lg block uppercase tracking-tight">Tay Dantas</span>
                        <span className="text-white/80 text-[11px] uppercase font-bold tracking-wider mt-1 block">Vinci (Construção de Autoridade)</span>
                      </div>
                      <div className="bg-[#CCFF00]/10 p-4 border-l-4 border-[#CCFF00] hover:bg-[#CCFF00]/20 transition-colors">
                        <span className="text-[#CCFF00] font-bold text-lg block uppercase tracking-tight">Erich Shibata</span>
                        <span className="text-white/80 text-[11px] uppercase font-bold tracking-wider mt-1 block">Cimed (Identidade & Posicionamento)</span>
                      </div>
                    </div>
                  </div>

                  {/* Tráfego e Estratégia */}
                  <div className="flex flex-col gap-4">
                    <h4 className="text-white/50 text-[10px] font-black uppercase tracking-widest border-b border-white/10 pb-2 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-white/50" />
                      Estratégia & Tráfego
                    </h4>
                    <div className="flex flex-col gap-3 h-full">
                      <div className="bg-[#00FFFF]/10 p-4 border-l-4 border-[#00FFFF] hover:bg-[#00FFFF]/20 transition-colors h-full flex flex-col justify-center">
                        <span className="text-[#00FFFF] font-bold text-lg block uppercase tracking-tight">Rafael Kiso</span>
                        <span className="text-white/80 text-[11px] uppercase font-bold tracking-wider mt-2 block leading-relaxed">Especialista Absoluto em Tráfego Pago, Algoritmos e Distribuição Digital Estratégica.</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>`;
            
    content = content.substring(0, insertPoint) + block + content.substring(insertPoint);
    fs.writeFileSync('src/pages/BusinessPlan.tsx', content, 'utf-8');
    console.log('Added properly!');
} else {
    console.log('Not found string.');
}
