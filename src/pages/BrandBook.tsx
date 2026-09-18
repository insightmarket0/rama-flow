import React from "react";
import { Asterisk, Sparkles, Sprout, HeartHandshake, Leaf, Circle } from "lucide-react";

export default function BrandBook() {
  return (
    <div className="w-full h-full bg-[#111111] flex flex-col animate-in fade-in duration-700 overflow-y-auto custom-scrollbar rounded-xl pb-20">
      <div className="max-w-[1400px] w-full min-h-[1600px] lg:min-h-[1800px] mx-auto flex flex-col p-4">
        
        {/* BENTO GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 auto-rows-[minmax(220px,auto)] gap-3 flex-1 min-h-0">

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

          {/* NOVA LINHA 5: DETALHAMENTO DE PÚBLICO E GEOLOCALIZAÇÃO */}
          <div className="md:col-span-3 bg-[#1A2421] border border-white/5 rounded-[2rem] p-6 flex flex-col lg:flex-row gap-8 lg:items-center justify-between overflow-y-auto custom-scrollbar">
             
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
          <div className="md:col-span-2 bg-gradient-to-tr from-[#161B19] to-[#1A2421] border border-white/5 rounded-[2rem] p-6 lg:p-8 flex flex-col justify-center relative overflow-hidden group">
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
          <div className="md:col-span-1 bg-[#D6F599] rounded-[2rem] p-6 flex flex-col justify-center relative overflow-hidden group">
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

          {/* LINHA 7 - FULL WIDTH: O Motor de Marketing, Influência e Lives */}
          <div className="md:col-span-3 row-span-2 bg-[#24302A] border border-[#D6F599]/30 rounded-[2rem] p-6 lg:p-8 flex flex-col relative overflow-hidden group">
             <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-[#D6F599]/5 blur-3xl pointer-events-none" />
             <h4 className="text-[#D6F599] text-[10px] lg:text-xs font-bold uppercase tracking-widest flex items-center gap-2 mb-6 relative z-10">
               <Sparkles className="w-4 h-4" /> Playbook de Marca & Influência (Padrão Shopee/ML)
             </h4>
             
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
               
               {/* Coluna A: O Programa de Influenciadores */}
               <div className="space-y-4">
                 <h5 className="text-white text-sm font-bold flex items-center gap-2">
                   <span className="w-2 h-2 rounded-full bg-[#D6F599]" /> 1. O Exército do ABC
                 </h5>
                 <p className="text-white/70 text-xs leading-relaxed">
                   <strong>Perfil:</strong> 4 blogueiras com alto engajamento + 1 profissional técnico para produtos sérios. Precisam ser da região do ABC e ter fit com nossos produtos.
                 </p>
                 <p className="text-white/70 text-xs leading-relaxed">
                   <strong>Acordo e Entregáveis:</strong> Cache de R$ 100 + comissão por venda (cupom/link). Recebem 5 produtos em uma <i>Caixa Personalizada RAMA</i>. Em troca, entregam 3 vídeos diferentes por produto.
                 </p>
                 <p className="text-white/70 text-xs leading-relaxed">
                   <strong>Gestão (O Funil):</strong> Todos recebem um Script Guia. Controle estrito de prazos: quando foi pago, quando chega o produto, dias das postagens e Collabs.
                 </p>
               </div>

               {/* Coluna B: Conteúdo e Live Commerce */}
               <div className="space-y-4">
                 <h5 className="text-white text-sm font-bold flex items-center gap-2">
                   <span className="w-2 h-2 rounded-full bg-[#D6F599]" /> 2. Formatos e Lives
                 </h5>
                 <p className="text-white/70 text-xs leading-relaxed">
                   <strong>A Máquina de Vídeos:</strong> O conteúdo dos influencers retroalimentará nosso TikTok e Instagram. 
                 </p>
                 <p className="text-white/70 text-xs leading-relaxed">
                   <strong>Mini-filmes e Estilo de Vida:</strong> Vídeos de conversação (ex: estilo David Ludolf) sem venda forçada. Termina com: <i>"Gostou? Link na bio."</i>
                 </p>
                 <p className="text-white/70 text-xs leading-relaxed">
                   <strong>Live Commerce:</strong> Apresentador fixo guiado por roteiro (Sábados/Domingos). O cenário é real: fundo com o estoque físico ou área de embalagem rolando ao vivo para gerar autoridade.
                 </p>
               </div>

               {/* Coluna C: Personas e a Grande Promessa */}
               <div className="space-y-4">
                 <h5 className="text-white text-sm font-bold flex items-center gap-2">
                   <span className="w-2 h-2 rounded-full bg-[#D6F599]" /> 3. Personas & Promessa
                 </h5>
                 <p className="text-white/70 text-xs leading-relaxed">
                   <strong>As Faces da Marca:</strong> Para o público mais velho e tradicional (Facebook), o rosto do <strong>Rogério</strong> (passa credibilidade e confiança). Para o público jovem, um novo comunicador ágil.
                 </p>
                 <p className="text-[#D6F599] text-xs font-bold leading-relaxed mt-4 p-3 bg-white/5 rounded-xl border border-[#D6F599]/20">
                   A Promessa Inquebrável:<br/>
                   <span className="text-white font-medium">O influencer divulga, o cliente compra. A RAMA entrega os produtos Curva A no mesmo dia (Prazo de 1 dia) em todo o ABC.</span>
                 </p>
               </div>

             </div>
          </div>

          {/* LINHA 8 - FULL WIDTH: Operação, Nuvemshop & Whats Marketplace */}
          <div className="md:col-span-3 bg-[#F4F4F0] border border-[#1A2421]/10 rounded-[2rem] p-6 lg:p-8 flex flex-col relative group">
             <h4 className="text-[#1A2421] text-[10px] lg:text-xs font-bold uppercase tracking-widest flex items-center gap-2 mb-6">
               <HeartHandshake className="w-4 h-4" /> Operação: Nuvemshop & Whats Marketplace
             </h4>
             
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               {/* Coluna 1: O Whats Marketplace */}
               <div className="space-y-3">
                 <h5 className="text-[#1A2421] text-sm font-bold">O Whats Marketplace</h5>
                 <p className="text-[#1A2421]/80 text-xs leading-relaxed">
                   <strong>Onde o brasileiro está:</strong> Teremos a base na Nuvemshop, mas a operação vai fluir 100% pelo WhatsApp. Tudo altamente personalizável para cada cliente.
                 </p>
                 <p className="text-[#1A2421]/80 text-xs leading-relaxed">
                   Início regional focado na grande São Paulo e ABC, usando a proximidade como nossa maior arma.
                 </p>
               </div>

               {/* Coluna 2: Tecnologia + Humanização */}
               <div className="space-y-3">
                 <h5 className="text-[#1A2421] text-sm font-bold">Tecnologia Humanizada</h5>
                 <p className="text-[#1A2421]/80 text-xs leading-relaxed">
                   <strong>Copiloto de IA + Toque Humano:</strong> A Inteligência Artificial lê o cliente e já gera a resposta perfeita (adaptando o linguajar para criar conexão e respeito). O atendente humano apenas revisa, dá o 'OK' e envia.
                 </p>
                 <p className="text-[#1A2421]/80 text-xs leading-relaxed">
                   <strong>Escala Absoluta:</strong> Com esse sistema, um único atendente gerencia múltiplas conversas simultâneas com agilidade extrema, sem nunca perder o calor humano. Faremos marketing forte em cima disso.
                 </p>
               </div>

               {/* Coluna 3: A Oferta & Instalação */}
               <div className="space-y-3">
                 <h5 className="text-[#1A2421] text-sm font-bold">Oferta & Logística</h5>
                 <p className="text-[#1A2421]/80 text-xs leading-relaxed">
                   <strong>Produtos Curva A:</strong> Começamos forte com a Curva A da RAMA (comissão em cima). 
                 </p>
                 <div className="bg-white p-3 rounded-xl border border-[#1A2421]/5 text-[#1A2421]/90 text-xs leading-relaxed">
                   <strong>Frete Grátis</strong> (já incluído no valor).<br/>
                   <strong>Instalação SP e ABC:</strong> Venda de serviço cruzado (Cross-sell), como oferecer a mangueira instalada junto com o produto.
                 </div>
               </div>
             </div>
          </div>

          {/* LINHA 9 - FULL WIDTH: O Sistema Interno */}
          <div className="md:col-span-3 row-span-2 bg-gradient-to-r from-blue-600 to-indigo-800 rounded-[2rem] p-6 lg:p-8 flex flex-col md:flex-row items-center justify-between shadow-2xl relative overflow-hidden">
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
