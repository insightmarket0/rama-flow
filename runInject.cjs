const fs = require('fs');
let content = fs.readFileSync('src/pages/BusinessPlan.tsx', 'utf-8');

const marker = 'A FAZER';
const markerIndex = content.indexOf(marker);
if (markerIndex !== -1) {
    const endSectionIndex = content.indexOf('</section>', markerIndex);
    if (endSectionIndex !== -1) {
        const insertPoint = endSectionIndex + '</section>'.length;
        
        const newBlock = `
          
        {/* EXPANSÃO GEOGRÁFICA E MICRO-DISTRIBUIÇÃO */}
        <section className="bg-[#111111] border-4 border-white/20 p-6 lg:p-10 shadow-2xl relative overflow-hidden group mt-8">
          <div className="absolute -right-4 -bottom-10 text-[14rem] font-black text-white/5 leading-none pointer-events-none transition-transform duration-700 group-hover:scale-110">
            SUL
          </div>
          <div className="flex flex-col gap-6 relative z-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-4 border-white/20 pb-4">
              <h3 className="text-white font-black uppercase tracking-tighter text-3xl md:text-5xl flex items-center gap-4">
                <span className="text-[#CCFF00]">//</span>
                Expansão Territorial
              </h3>
            </div>
            <p className="text-gray-400 text-sm font-bold uppercase tracking-[0.2em] mb-4">
              Projeto de Escala Nacional via Micro-Distribuição e Contas Regionais
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-4 border-white/20">
              {/* Fase 1: SP/ABC */}
              <div className="bg-[#050505] p-6 border-b-4 md:border-b-0 md:border-r-4 border-white/20 hover:bg-white/5 transition-colors">
                <span className="text-white/50 text-[10px] font-black uppercase tracking-widest mb-2 block">Fase 01 - Operação Atual</span>
                <h4 className="text-white font-black text-2xl uppercase tracking-tighter mb-2">Matriz SP / ABC</h4>
                <p className="text-gray-400 text-xs leading-relaxed font-bold">
                  Consolidação do ecossistema completo. Centro logístico principal, atendimento próprio e foco em entregas hiper-rápidas na região metropolitana.
                </p>
                <div className="mt-4 bg-[#CCFF00]/10 border border-[#CCFF00]/30 text-[#CCFF00] text-[10px] uppercase font-black px-3 py-1.5 inline-block">Dominância Estabelecida</div>
              </div>

              {/* Fase 2: Curitiba / Sul */}
              <div className="bg-[#111111] p-6 border-b-4 md:border-b-0 md:border-r-4 border-white/20 hover:bg-white/5 transition-colors">
                <span className="text-[#CCFF00] text-[10px] font-black uppercase tracking-widest mb-2 block animate-pulse">Fase 02 - Próximo Alvo</span>
                <h4 className="text-white font-black text-2xl uppercase tracking-tighter mb-2">Região Sul (Curitiba)</h4>
                <p className="text-white text-xs leading-relaxed font-bold">
                  Segunda conta estadual com <strong>parceiro operador local</strong> que cuida de toda a logística. A RAMA atua como distribuidora matriz, <span className="text-[#CCFF00]">lucrando direto na fonte (fornecimento)</span> e garantindo escalabilidade para o Sul sem inchar a operação interna.
                </p>
                <div className="mt-4 bg-orange-500/10 border border-orange-500/30 text-orange-500 text-[10px] uppercase font-black px-3 py-1.5 inline-block">Em Planejamento</div>
              </div>

              {/* Fase 3: Nordeste */}
              <div className="bg-[#050505] p-6 hover:bg-white/5 transition-colors">
                <span className="text-white/30 text-[10px] font-black uppercase tracking-widest mb-2 block">Fase 03 - Visão de Longo Prazo</span>
                <h4 className="text-white/80 font-black text-2xl uppercase tracking-tighter mb-2">Região Nordeste</h4>
                <p className="text-gray-500 text-xs leading-relaxed font-bold">
                  Após estabelecer com sucesso o modelo de distribuição e logística descentralizada no Sul, replicaremos a estrutura abrindo o próximo polo operacional para atingir e dominar a região Nordeste.
                </p>
                <div className="mt-4 bg-white/5 border border-white/10 text-white/40 text-[10px] uppercase font-black px-3 py-1.5 inline-block">Futuro</div>
              </div>
            </div>
          </div>
        </section>`;
        
        content = content.substring(0, insertPoint) + newBlock + content.substring(insertPoint);
        fs.writeFileSync('src/pages/BusinessPlan.tsx', content, 'utf-8');
        console.log('Success');
    }
}
