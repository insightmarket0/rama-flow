const fs = require('fs');
let content = fs.readFileSync('src/pages/BusinessPlan.tsx', 'utf-8');

const startStr = '{/* Seção 1: Resumo Executivo */}';
let startIndex = content.indexOf(startStr);
if (startIndex === -1) startIndex = content.indexOf('{/* Seǜo 1: Resumo Executivo */}');

if (startIndex !== -1) {
    const endStr = '</section>';
    const endIndex = content.indexOf(endStr, startIndex);
    
    if (endIndex !== -1) {
        const replacement = `          {/* Seção 1: Resumo Executivo Brutalista */}
            <section className="mt-4 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-4 border-white/20 shadow-2xl">
                
                {/* Card 1: VISÃO */}
                <div className="bg-[#CCFF00] p-6 lg:p-10 relative overflow-hidden group border-b-4 md:border-b-0 md:border-r-4 border-white/20 flex flex-col justify-between">
                  <div className="absolute -right-4 -bottom-10 text-[14rem] font-black text-black/10 leading-none pointer-events-none transition-transform duration-700 group-hover:scale-110">
                    1
                  </div>
                  <div>
                    <h3 className="text-black font-black uppercase tracking-tighter text-4xl mb-6 relative z-10 flex flex-col">
                      <span className="text-[11px] tracking-[0.4em] opacity-60 mb-2 font-bold">O FUTURO</span>
                      VISÃO
                    </h3>
                    <p className="text-black text-sm leading-relaxed font-bold relative z-10 max-w-[90%]">
                      Tornar-se a potência definitiva no varejo digital de utilidades e ferramentas em SP e ABC. Nosso foco é dominar os marketplaces e nosso ecossistema próprio através de entregas Same-Day (Flex), unindo a venda de produtos de alta demanda à execução de serviços.
                    </p>
                  </div>
                  <div className="mt-12 relative z-10">
                    <div className="w-16 h-1.5 bg-black" />
                  </div>
                </div>
                
                {/* Card 2: MISSÃO */}
                <div className="bg-[#050505] p-6 lg:p-10 relative overflow-hidden group border-b-4 md:border-b-0 md:border-r-4 border-white/20 flex flex-col justify-between">
                  <div className="absolute -right-4 -bottom-10 text-[14rem] font-black text-white/5 leading-none pointer-events-none transition-transform duration-700 group-hover:scale-110">
                    2
                  </div>
                  <div>
                    <h3 className="text-white font-black uppercase tracking-tighter text-4xl mb-6 relative z-10 flex flex-col">
                      <span className="text-[#CCFF00] text-[11px] tracking-[0.4em] mb-2 font-bold">O PROPÓSITO</span>
                      MISSÃO
                    </h3>
                    <p className="text-gray-300 text-sm leading-relaxed font-bold relative z-10 max-w-[90%]">
                      Resolver a dor do cliente de ponta a ponta com agilidade e segurança. Entregamos os melhores produtos e oferecemos a instalação (cross-sell) diretamente na casa do cliente, garantindo uma jornada impecável do WhatsApp à entrega.
                    </p>
                  </div>
                  <div className="mt-12 relative z-10">
                    <div className="w-16 h-1.5 bg-[#CCFF00]" />
                  </div>
                </div>
                
                {/* Card 3: DIFERENCIAL */}
                <div className="bg-[#111111] p-6 lg:p-10 relative overflow-hidden group flex flex-col justify-between">
                  <div className="absolute -right-4 -bottom-10 text-[14rem] font-black text-white/5 leading-none pointer-events-none transition-transform duration-700 group-hover:scale-110">
                    3
                  </div>
                  <div>
                    <h3 className="text-white font-black uppercase tracking-tighter text-4xl mb-6 relative z-10 flex flex-col">
                      <span className="text-[11px] tracking-[0.4em] opacity-60 mb-2 font-bold text-[#CCFF00]">A VANTAGEM</span>
                      DIFERENCIAL
                    </h3>
                    <p className="text-gray-300 text-sm leading-relaxed font-bold relative z-10 max-w-[90%]">
                      Ecossistema 100% integrado: logística própria ultrarrápida (Rama Flow), tecnologia interna de gestão (Rama System), IA humanizada no WhatsApp e Influenciadores locais. Nós não só vendemos, nós instalamos e fidelizamos.
                    </p>
                  </div>
                  <div className="mt-12 relative z-10">
                    <div className="w-16 h-1.5 bg-[#CCFF00]" />
                  </div>
                </div>
                
              </div>
            </section>`;
        
        content = content.substring(0, startIndex) + replacement + content.substring(endIndex + endStr.length);
        fs.writeFileSync('src/pages/BusinessPlan.tsx', content, 'utf-8');
        console.log('Replaced successfully');
    } else {
        console.log('End string not found');
    }
} else {
    console.log('Start string not found');
}
