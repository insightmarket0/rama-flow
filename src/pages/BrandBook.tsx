import React from "react";
import { Asterisk, Sparkles, Sprout, HeartHandshake, Leaf, Circle } from "lucide-react";

export default function BrandBook() {
  return (
    <div className="w-full h-full bg-[#111111] flex flex-col animate-in fade-in duration-700 overflow-y-auto custom-scrollbar rounded-xl pb-20">
      <div className="max-w-[1400px] w-full min-h-[1600px] lg:min-h-[1800px] mx-auto flex flex-col p-4">
        
        {/* BENTO GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 grid-rows-[repeat(8,minmax(0,1fr))] gap-3 flex-1 min-h-0">

          {/* COLUNA 1 - LINHAS 1 E 2: Símbolo Verde Limão */}
          <div className="col-start-1 col-span-1 row-start-1 row-span-2 bg-[#D6F599] rounded-[2rem] flex flex-col p-6 lg:p-8 relative overflow-hidden group">
            <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex-1 flex items-center justify-center">
              <Asterisk className="w-24 h-24 lg:w-32 lg:h-32 text-[#1A2421] transition-transform duration-700 group-hover:rotate-45" strokeWidth={1} />
            </div>
            <div className="flex justify-between items-end mt-auto z-10">
              <span className="text-[#1A2421] text-xs lg:text-sm font-sans font-medium tracking-tight">Rama Brand Book</span>
              <span className="text-[#1A2421]/50 text-[8px] lg:text-[10px] font-mono uppercase tracking-widest">Guidelines</span>
            </div>
          </div>

          {/* COLUNA 2 - LINHA 1: Tipografia */}
          <div className="col-start-2 col-span-1 row-start-1 row-span-1 bg-[#F4F4F0] rounded-[2rem] p-6 flex flex-col justify-center relative overflow-hidden group">
            <h2 className="text-[#1A2421] text-3xl lg:text-4xl mb-2 transition-transform group-hover:scale-105" style={{ fontFamily: "'Playfair Display', serif" }}>
              Rama
            </h2>
            <div className="flex flex-wrap gap-1 text-[#1A2421]/60 font-serif text-[8px] lg:text-[10px] leading-tight max-w-[180px]">
              Aa Bb Cc Dd Ee Ff Gg Hh Ii Jj Kk Ll Mm Nn Oo Pp Qq Rr Ss Tt Uu Vv Ww Xx Yy Zz
            </div>
          </div>

          {/* COLUNA 3 - LINHA 1: Paleta de Cores */}
          <div className="col-start-3 col-span-1 row-start-1 row-span-1 bg-white rounded-[2rem] flex overflow-hidden">
            {/* Color 1 */}
            <div className="flex-1 bg-[#1A2421] h-full flex items-end p-3 lg:p-4 group">
              <div className="text-white/70 font-sans font-bold text-[8px] lg:text-[10px] opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0">
                <p>R 26</p><p>G 36</p><p>B 33</p>
              </div>
            </div>
            {/* Color 2 */}
            <div className="flex-1 bg-[#D6F599] h-full flex items-end p-3 lg:p-4 group">
              <div className="text-[#1A2421]/70 font-sans font-bold text-[8px] lg:text-[10px] opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0">
                <p>R 214</p><p>G 245</p><p>B 153</p>
              </div>
            </div>
            {/* Color 3 */}
            <div className="flex-1 bg-[#F4F4F0] h-full flex items-end p-3 lg:p-4 group">
              <div className="text-[#1A2421]/70 font-sans font-bold text-[8px] lg:text-[10px] opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0">
                <p>R 244</p><p>G 244</p><p>B 240</p>
              </div>
            </div>
          </div>

          {/* COLUNAS 2 E 3 - LINHAS 2 E 3: Logo Principal Centralizado */}
          <div className="col-start-2 col-span-2 row-start-2 row-span-2 bg-[#00FF00] rounded-[2rem] flex items-center justify-center relative overflow-hidden group">
            <div className="absolute w-[400px] h-[600px] border border-black/10 rounded-[100%] scale-110 opacity-20 pointer-events-none" />
            <div className="absolute w-[200px] h-[400px] border border-black/10 rounded-[100%] scale-90 opacity-20 pointer-events-none" />
            
            <div className="flex items-center gap-4 lg:gap-6 z-10 transition-transform duration-700 group-hover:scale-105">
              <Asterisk className="w-16 h-16 lg:w-20 lg:h-20 text-[#1A2421]" strokeWidth={1.5} />
              <h1 className="text-[#1A2421] text-5xl lg:text-7xl font-bold tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                RAMA <span className="text-[#1A2421] text-xl font-sans align-top ml-1">™</span>
              </h1>
            </div>
          </div>

          {/* COLUNA 1 - LINHAS 3 E 4: Poster / Vibe */}
          <div className="col-start-1 col-span-1 row-start-3 row-span-2 bg-[#24302A] rounded-[2rem] p-6 lg:p-8 flex flex-col justify-between relative overflow-hidden border border-white/5">
            <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-black/40 to-transparent pointer-events-none" />
            
            <h3 className="text-white text-3xl lg:text-4xl leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
              Resgate <br />
              <i className="text-[#D6F599]">suas</i> <br />
              raízes.
            </h3>

            <div className="mt-auto space-y-4">
              <div className="flex items-center gap-2 text-[#D6F599]">
                <Asterisk className="w-6 h-6 lg:w-8 lg:h-8" strokeWidth={1.5} />
                <span className="font-serif text-lg lg:text-xl tracking-widest uppercase font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>Rama</span>
              </div>
              <div className="h-[1px] w-full bg-[#D6F599]/30" />
              <p className="text-[7px] lg:text-[8px] text-[#D6F599]/80 font-bold uppercase tracking-widest leading-relaxed">
                O CUIDADO FAMILIAR E O RESPEITO AO BRASIL PROFUNDO EM CADA INTERAÇÃO.
              </p>
            </div>
          </div>

          {/* COLUNA 2 - LINHA 4: Posicionamento */}
          <div className="col-start-2 col-span-1 row-start-4 row-span-1 bg-gradient-to-r from-blue-500 to-[#00FF00] rounded-[2rem] p-6 shadow-xl flex flex-col justify-center relative overflow-hidden group">
            <h4 className="text-black text-[9px] lg:text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 relative z-10 mb-2">
               <HeartHandshake className="w-3 h-3 lg:w-4 lg:h-4" /> Posicionamento
            </h4>
            <p className="text-black/90 font-medium text-[11px] lg:text-xs leading-relaxed relative z-10">
               Marketplace focado em produtos <strong className="text-black">Curva A (Ticket Médio Alto)</strong> no nicho de utilidades domésticas e soluções integradas.
            </p>
            <p className="text-black/70 font-bold text-[10px] lg:text-[11px] mt-2 leading-relaxed relative z-10">
               Foco em oferecer o que os gigantes não entregam (ex: produto + instalação).
            </p>
          </div>

          {/* COLUNA 3 - LINHA 4: Slogans A/B */}
          <div className="col-start-3 col-span-1 row-start-4 row-span-1 bg-[#F4F4F0] rounded-[2rem] p-6 flex flex-col justify-center border border-[#1A2421]/5">
             <h4 className="text-[#1A2421] text-[9px] lg:text-[10px] font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
               <Sparkles className="w-3 h-3 lg:w-4 lg:h-4" /> Slogans (Teste A/B)
             </h4>
             <div className="flex flex-col gap-2">
               <div className="bg-white px-3 py-2 rounded-xl border border-black/5 text-[#1A2421]/80 text-[10px] lg:text-[11px] font-medium leading-tight">
                 "Quem tem boca vai a RAMA."
               </div>
               <div className="bg-white px-3 py-2 rounded-xl border border-black/5 text-[#1A2421]/80 text-[10px] lg:text-[11px] font-medium leading-tight">
                 "Todos os cliques levam à RAMA."
               </div>
               <div className="bg-white px-3 py-2 rounded-xl border border-black/5 text-[#1A2421]/80 text-[10px] lg:text-[11px] font-medium leading-tight">
                 "Para bom comprador, a RAMA basta."
               </div>
             </div>
          </div>

          {/* NOVA LINHA 5: DETALHAMENTO DE PÚBLICO E GEOLOCALIZAÇÃO (Ocupa 3 colunas) */}
          <div className="col-start-1 col-span-3 row-start-5 row-span-1 bg-[#1A2421] border border-white/5 rounded-[2rem] p-6 flex flex-col lg:flex-row gap-8 lg:items-center justify-between overflow-y-auto custom-scrollbar">
             
             {/* Esquerda: Geração e Classe */}
             <div className="flex flex-col gap-3 min-w-[250px]">
                <h4 className="text-[#D6F599] text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 mb-1">
                  <Asterisk className="w-4 h-4" /> Perfil de Público
                </h4>
                <div className="flex gap-2 flex-wrap">
                  <span className="bg-white/10 text-white text-[10px] uppercase font-bold px-3 py-1 rounded-full">Geração Z</span>
                  <span className="bg-white/10 text-white text-[10px] uppercase font-bold px-3 py-1 rounded-full">Geração X</span>
                  <span className="bg-white/10 text-white text-[10px] uppercase font-bold px-3 py-1 rounded-full">Millennials</span>
                </div>
                <div className="flex gap-2 flex-wrap mt-1">
                  <span className="bg-[#D6F599]/20 text-[#D6F599] border border-[#D6F599]/30 text-[10px] uppercase font-bold px-3 py-1 rounded-full">
                    Classe Social: Média para Cima
                  </span>
                  <span className="bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px] uppercase font-bold px-3 py-1 rounded-full">
                    Foco em Produtos Curva A
                  </span>
                </div>
             </div>

             {/* Meio: Bairros Santo André */}
             <div className="flex-1 border-l border-white/10 pl-6 lg:pl-8">
               <h4 className="text-white/60 text-[9px] font-bold uppercase tracking-widest mb-3">
                 Foco SP — Santo André (Bairros Nobres)
               </h4>
               <p className="text-white/80 text-xs leading-relaxed font-medium">
                 Jardim • Campestre • Vila Bastos • Vila Assunção • Vila Gilda • Valparaíso • Vila Alpina
               </p>
             </div>

             {/* Centro-Direita: Bairros SBC */}
             <div className="flex-1 border-l border-white/10 pl-6 lg:pl-8">
               <h4 className="text-white/60 text-[9px] font-bold uppercase tracking-widest mb-3">
                 Foco SP — São Bernardo do Campo
               </h4>
               <p className="text-white/80 text-xs leading-relaxed font-medium">
                 Jardim do Mar • Nova Petrópolis • Parque dos Pássaros • Jardim Chácara Inglesa • Rudge Ramos • Centro • Vila Euclides
               </p>
             </div>

             {/* Direita: Outros Segmentos */}
             <div className="flex-1 border-l border-white/10 pl-6 lg:pl-8">
               <h4 className="text-[#D6F599]/80 text-[9px] font-bold uppercase tracking-widest mb-3">
                 Segmentos & Estratégia
               </h4>
               <div className="flex flex-col gap-2">
                 <p className="text-white/80 text-xs leading-relaxed font-medium">
                   <strong className="text-white">Escritórios (Centros):</strong> Contato rápido e direto.
                 </p>
                 <p className="text-white/80 text-xs leading-relaxed font-medium">
                   <strong className="text-white">Clínicas:</strong> Em análise (Verificar viabilidade).
                 </p>
               </div>
             </div>
          </div>

          {/* LINHA 6 - COLUNAS 1 E 2: Manifesto & Estratégia B2B */}
          <div className="col-start-1 col-span-1 md:col-span-2 row-start-6 row-span-1 bg-gradient-to-tr from-[#161B19] to-[#1A2421] border border-white/5 rounded-[2rem] p-6 lg:p-8 flex flex-col justify-center relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-8 opacity-10">
               <Asterisk className="w-48 h-48 text-[#D6F599] -rotate-12" strokeWidth={1} />
             </div>
             <h4 className="text-[#D6F599] text-[10px] lg:text-xs font-bold uppercase tracking-widest flex items-center gap-2 relative z-10 mb-4">
               <Sparkles className="w-4 h-4" /> Manifesto & B2B
             </h4>
             <div className="space-y-4 relative z-10">
               <p className="text-white/90 text-sm lg:text-base leading-relaxed font-medium">
                 Criado por brasileiros para brasileiros. Buscamos ser um marketplace focado na <strong className="text-[#D6F599]">Curva A</strong> dos produtos, mirando no ticket médio mais alto. 
               </p>
               <p className="text-white/70 text-xs lg:text-sm leading-relaxed font-medium">
                 As referências sempre são as grandes dominantes, mas não competimos diretamente. <i className="text-white/50">"Não encontrou o seu produto no nosso site? Compre no Mercado Livre, receba seu pedido no mesmo dia."</i>
               </p>
               <div className="h-[1px] w-12 bg-[#D6F599]/30" />
               <p className="text-white/80 text-xs lg:text-sm leading-relaxed font-medium">
                 <strong className="text-white">Para Distribuidores:</strong> Oferecer o que o ML não oferece. Por que vender lá se dá para vender conosco com uma margem muito maior fazendo o mesmo esforço?
               </p>
             </div>
          </div>

          {/* LINHA 6 - COLUNA 3: Futuro & Experiência */}
          <div className="col-start-1 md:col-start-3 col-span-1 row-start-7 md:row-start-6 row-span-1 bg-[#D6F599] rounded-[2rem] p-6 flex flex-col justify-center relative overflow-hidden group">
             <h4 className="text-[#1A2421] text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 mb-4">
               <HeartHandshake className="w-4 h-4" /> Futuro & Experiência
             </h4>
             <ul className="space-y-3">
               <li className="flex items-start gap-2">
                 <div className="mt-1 w-1.5 h-1.5 rounded-full bg-[#1A2421] shrink-0" />
                 <p className="text-[#1A2421]/90 text-xs font-medium leading-relaxed">
                   Seremos parceiros dos fabricantes e distribuidores, ajudando em todos os sentidos: <strong>distribuição, sistema e marca (marketing).</strong>
                 </p>
               </li>
               <li className="flex items-start gap-2">
                 <div className="mt-1 w-1.5 h-1.5 rounded-full bg-[#1A2421] shrink-0" />
                 <p className="text-[#1A2421]/90 text-xs font-medium leading-relaxed">
                   Experiência impecável: <strong>devolução e troca sem precisar sair de casa.</strong>
                 </p>
               </li>
             </ul>
          </div>

          {/* LINHA 7 - COLUNAS 1 E 2: Estratégia de Conteúdo e Marketing */}
          <div className="col-start-1 col-span-1 md:col-span-2 row-start-8 md:row-start-7 row-span-1 bg-[#24302A] border border-[#D6F599]/20 rounded-[2rem] p-6 lg:p-8 flex flex-col justify-center relative overflow-hidden">
             <h4 className="text-[#D6F599] text-[10px] lg:text-xs font-bold uppercase tracking-widest flex items-center gap-2 mb-4">
               <Sparkles className="w-4 h-4" /> Conteúdo & Publicidade
             </h4>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-3">
                 <h5 className="text-white text-sm font-bold">Storytelling & Influência</h5>
                 <p className="text-white/70 text-xs leading-relaxed">
                   <strong>Mini-filmes e Estilo de Vida:</strong> Conversação natural, sem venda agressiva. Foco no desejo. <i>"Gostou? O link de todos os produtos do vídeo está na bio."</i>
                 </p>
                 <p className="text-white/70 text-xs leading-relaxed">
                   <strong>Rede de Influenciadores:</strong> Recebem produtos, geram Reels, e vendem via cupom (comissionado). O Instagram e TikTok serão abastecidos por esse ecossistema.
                 </p>
               </div>
               <div className="space-y-3">
                 <h5 className="text-white text-sm font-bold">Inclusão Geracional</h5>
                 <p className="text-white/70 text-xs leading-relaxed">
                   <strong>Geração X e Z:</strong> Foco em simplicidade absoluta. Mostrar um senhor comprando do seu jeito, fazendo pedidos até por áudio de WhatsApp.
                 </p>
                 <p className="text-white/70 text-xs leading-relaxed">
                   <strong>Facebook Ads:</strong> Canal chave para atingir o público mais velho com ticket médio alto.
                 </p>
               </div>
             </div>
          </div>

          {/* LINHA 7 - COLUNA 3: Operação Nuvemshop */}
          <div className="col-start-1 md:col-start-3 col-span-1 row-start-9 md:row-start-7 row-span-1 bg-[#F4F4F0] border border-[#1A2421]/10 rounded-[2rem] p-6 flex flex-col justify-center relative">
             <h4 className="text-[#1A2421] text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 mb-3">
               <HeartHandshake className="w-4 h-4" /> Operação & Serviço
             </h4>
             <p className="text-[#1A2421]/90 text-sm font-bold mb-2">Base: Nuvemshop</p>
             <p className="text-[#1A2421]/80 text-xs leading-relaxed mb-3">
               Nosso diferencial é a solução completa para o público final (venda + explicação + instalação).
             </p>
             <div className="bg-white p-3 rounded-xl border border-[#1A2421]/5 text-xs text-[#1A2421]/80 leading-relaxed font-medium">
               <strong>Foco SP e ABC:</strong> Garantir excelente entrega e forte divulgação da instalação. <br/><br/>
               <i>Cross-sell estratégico:</i> Oferecer serviços conjuntos, como a instalação de mangueiras com o utensílio.
             </div>
          </div>

          {/* LINHA 8 - FULL WIDTH: O Sistema Interno */}
          <div className="col-start-1 col-span-1 md:col-span-3 row-start-10 md:row-start-8 row-span-1 bg-gradient-to-r from-blue-600 to-indigo-800 rounded-[2rem] p-6 lg:p-8 flex flex-col md:flex-row items-center justify-between shadow-2xl relative overflow-hidden">
             <div className="absolute inset-0 bg-black/10" />
             <div className="md:w-1/3 relative z-10 mb-6 md:mb-0">
               <h4 className="text-white/80 text-[10px] lg:text-xs font-bold uppercase tracking-widest flex items-center gap-2 mb-2">
                 <Asterisk className="w-4 h-4" /> O Cérebro da Operação
               </h4>
               <h3 className="text-white text-2xl lg:text-3xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
                 Sistema Interno
               </h3>
               <p className="text-white/80 text-xs mt-2 font-medium">
                 Tudo que um dono de marketplace precisa em um único lugar.
               </p>
             </div>
             
             <div className="md:w-2/3 flex flex-wrap gap-3 relative z-10">
               <div className="flex-1 min-w-[200px] bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl">
                 <strong className="text-white block text-sm mb-1">Previsibilidade</strong>
                 <p className="text-white/70 text-xs">Visão clara de quais pedidos fazer ao fornecedor.</p>
               </div>
               <div className="flex-1 min-w-[200px] bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl">
                 <strong className="text-white block text-sm mb-1">Automação Financeira</strong>
                 <p className="text-white/70 text-xs">Pagar contas sozinho e conciliação exata de recebíveis dos marketplaces.</p>
               </div>
               <div className="flex-1 min-w-[200px] bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl">
                 <strong className="text-white block text-sm mb-1">Análise de Gargalos</strong>
                 <p className="text-white/70 text-xs">Dashboard inteligente para identificar e resolver gargalos logísticos e operacionais.</p>
               </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}
