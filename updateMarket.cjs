const fs = require('fs');
let content = fs.readFileSync('src/pages/BusinessPlan.tsx', 'utf-8');

const regex = /<h3 className="text-white text-2xl md:text-3xl font-black uppercase tracking-tighter mb-4 flex items-center gap-2">\s*O Tamanho do <span className="text-\[#CCFF00\]">Mercado<\/span>\s*<\/h3>\s*<div className="space-y-4">\s*<p className="text-white\/80 text-xs md:text-sm leading-relaxed font-medium">\s*<strong className="text-\[#CCFF00\]">Marketplace Nacional:<\/strong>[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*\{\/\* Indicadores Visuais \*\/}\s*<div className="flex flex-col sm:flex-row gap-6 lg:gap-12 shrink-0">\s*\{\/\* Bloco 1: Marketplace \*\/}\s*<div className="border-l-4 border-\[#CCFF00\] pl-5 flex flex-col justify-center">\s*<span className="text-white\/50 text-\[10px\] font-black uppercase tracking-widest mb-1">Marketplace Brasil<\/span>\s*<span className="text-\[#CCFF00\] text-4xl lg:text-5xl font-black tracking-tighter leading-none mb-1">R\$ 204 BI<\/span>\s*<span className="text-white\/80 text-\[10px\] uppercase font-bold tracking-widest">Faturamento Anual<\/span>\s*<\/div>\s*\{\/\* Bloco 2: Farmácia \*\/}\s*<div className="border-l-4 border-\[#00FFFF\] pl-5 flex flex-col justify-center">\s*<span className="text-white\/50 text-\[10px\] font-black uppercase tracking-widest mb-1">Setor Farmacêutico<\/span>\s*<span className="text-\[#00FFFF\] text-4xl lg:text-5xl font-black tracking-tighter leading-none mb-1">R\$ 160 BI<\/span>\s*<span className="text-white\/80 text-\[10px\] uppercase font-bold tracking-widest">Volume de Mercado<\/span>\s*<\/div>\s*<\/div>/;

const newSection = `<h3 className="text-white text-2xl md:text-3xl font-black uppercase tracking-tighter mb-4 flex items-center gap-2">
                 O Tamanho do <span className="text-[#CCFF00]">Mercado</span>
               </h3>
               <div className="space-y-4">
                 <p className="text-white/80 text-xs md:text-sm leading-relaxed font-medium">
                   <strong className="text-[#CCFF00]">Marketplace Nacional:</strong> O setor de marketplaces no Brasil é a infraestrutura central do varejo digital, registrando um faturamento de <strong className="text-white">R$ 204,3 bilhões no último ano</strong>. Nossa operação foi estruturada matematicamente para processar e escalar vendas dentro desse ecossistema, garantindo eficiência logística e alta taxa de conversão.
                 </p>
                 <p className="text-white/80 text-xs md:text-sm leading-relaxed font-medium mb-4">
                   <strong className="text-[#FF00FF]">Linha Branca & Fogões:</strong> O mercado brasileiro de eletrodomésticos de cozinha movimenta aproximadamente <strong className="text-white">R$ 145 bilhões anuais</strong>. O segmento de fogões e cooktops é o segundo maior pilar da linha branca, respondendo por <strong className="text-white">17% de todas as vendas e buscas</strong> no país.
                 </p>

                 <div className="flex flex-col gap-3">
                   {/* Toggles */}
                   <div className="flex flex-wrap gap-2">
                     <button 
                       onClick={() => setActiveMarketVision("farma")}
                       className={\`px-3 py-1.5 text-[10px] font-black uppercase tracking-widest border-2 transition-colors \${
                         activeMarketVision === "farma" ? "bg-[#00FFFF] text-black border-[#00FFFF]" : "bg-transparent text-white/50 border-white/20 hover:text-white"
                       }\`}
                     >
                       O Múltiplo Alcance
                     </button>
                     <button 
                       onClick={() => setActiveMarketVision("atendimento")}
                       className={\`flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest border-2 transition-colors \${
                         activeMarketVision === "atendimento" ? "bg-[#00FFFF] text-black border-[#00FFFF]" : "bg-transparent text-white/50 border-white/20 hover:text-white"
                       }\`}
                     >
                       <MessageCircle className="w-3.5 h-3.5" /> Atendimento "Abrasileirado"
                     </button>
                   </div>

                   {/* Conteúdo Expansivo */}
                   <div className="min-h-[72px]">
                     {activeMarketVision === "farma" ? (
                       <p className="text-white/80 text-xs md:text-sm leading-relaxed font-medium animate-in fade-in zoom-in-95 duration-200">
                         O mercado farmacêutico alcançou <strong className="text-white">R$ 160,7 bilhões anuais</strong> (com o digital superando R$ 20 bi), e vai muito além dos remédios. Nossa máquina já possui altíssima tração e previsibilidade em <strong className="text-white">cosméticos elitizados</strong> e <strong className="text-white">fraldas</strong>. O objetivo estratégico é acoplar essa recorrência diária à nossa operação, dominando toda a esteira de saúde, higiene e beleza.
                       </p>
                     ) : (
                       <p className="text-white/80 text-xs md:text-sm leading-relaxed font-medium animate-in fade-in zoom-in-95 duration-200">
                         Nosso grande diferencial será o <strong className="text-white">Farmacêutico Online</strong>. Um atendimento humano, caloroso e ágil, focado na indicação de medicamentos sem receita — ou no atendimento rápido para quem já possui a prescrição. Isso gera uma consolidação e fidelização brutal de clientes que as redes tradicionais frias não entregam.
                       </p>
                     )}
                   </div>
                 </div>
               </div>
             </div>

             {/* Indicadores Visuais */}
             <div className="flex flex-col xl:flex-row gap-6 lg:gap-8 shrink-0 flex-wrap">
               {/* Bloco 1: Marketplace */}
               <div className="border-l-4 border-[#CCFF00] pl-4 flex flex-col justify-center">
                 <span className="text-white/50 text-[10px] font-black uppercase tracking-widest mb-1">Marketplace Brasil</span>
                 <span className="text-[#CCFF00] text-3xl lg:text-4xl font-black tracking-tighter leading-none mb-1">R$ 204 BI</span>
                 <span className="text-white/80 text-[10px] uppercase font-bold tracking-widest">Faturamento Anual</span>
               </div>
               
               {/* Bloco 2: Linha Branca */}
               <div className="border-l-4 border-[#FF00FF] pl-4 flex flex-col justify-center">
                 <span className="text-white/50 text-[10px] font-black uppercase tracking-widest mb-1">Linha Branca</span>
                 <span className="text-[#FF00FF] text-3xl lg:text-4xl font-black tracking-tighter leading-none mb-1">R$ 145 BI</span>
                 <span className="text-white/80 text-[10px] uppercase font-bold tracking-widest">Volume Cozinha</span>
               </div>

               {/* Bloco 3: Farmácia */}
               <div className="border-l-4 border-[#00FFFF] pl-4 flex flex-col justify-center">
                 <span className="text-white/50 text-[10px] font-black uppercase tracking-widest mb-1">Setor Farmacêutico</span>
                 <span className="text-[#00FFFF] text-3xl lg:text-4xl font-black tracking-tighter leading-none mb-1">R$ 160 BI</span>
                 <span className="text-white/80 text-[10px] uppercase font-bold tracking-widest">Volume de Mercado</span>
               </div>
             </div>`;

if (content.match(regex)) {
    content = content.replace(regex, newSection);
    fs.writeFileSync('src/pages/BusinessPlan.tsx', content, 'utf-8');
    console.log('Successfully updated the market section.');
} else {
    console.log('Regex did not match.');
}
