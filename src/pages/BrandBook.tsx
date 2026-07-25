import React from "react";
import { Asterisk, Sparkles, Sprout, HeartHandshake, Leaf, Circle } from "lucide-react";

export default function BrandBook() {
  return (
    <div className="w-full h-full bg-[#111111] flex flex-col animate-in fade-in duration-700 overflow-hidden rounded-xl">
      <div className="max-w-[1400px] w-full h-full mx-auto flex flex-col p-4">
        
        {/* BENTO GRID (3x4 perfeitamente alinhado) */}
        <div className="grid grid-cols-1 md:grid-cols-3 grid-rows-4 gap-3 flex-1 min-h-0">

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
          <div className="col-start-2 col-span-2 row-start-2 row-span-2 bg-[#1A2421] rounded-[2rem] flex items-center justify-center relative overflow-hidden group">
            <div className="absolute w-[400px] h-[600px] border border-white/5 rounded-[100%] scale-110 opacity-20 pointer-events-none" />
            <div className="absolute w-[200px] h-[400px] border border-white/5 rounded-[100%] scale-90 opacity-20 pointer-events-none" />
            
            <div className="flex items-center gap-4 lg:gap-6 z-10 transition-transform duration-700 group-hover:scale-105">
              <Asterisk className="w-16 h-16 lg:w-20 lg:h-20 text-[#D6F599]" strokeWidth={1.5} />
              <h1 className="text-white text-5xl lg:text-7xl font-bold tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                RAMA <span className="text-[#D6F599] text-xl font-sans align-top ml-1">™</span>
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

          {/* COLUNA 2 - LINHA 4: Essência */}
          <div className="col-start-2 col-span-1 row-start-4 row-span-1 bg-[#D6F599] rounded-[2rem] p-6 flex flex-col justify-center relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-[#1A2421]/5 rounded-full blur-xl pointer-events-none" />
            <h4 className="text-[#1A2421] text-[9px] lg:text-[10px] font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
               <HeartHandshake className="w-3 h-3 lg:w-4 lg:h-4" /> Essência
            </h4>
            <p className="text-[#1A2421] text-sm lg:text-lg leading-snug" style={{ fontFamily: "'Playfair Display', serif" }}>
              "Nós não vendemos apenas produtos; entregamos confiança."
            </p>
          </div>

          {/* COLUNA 3 - LINHA 4: Público-Alvo */}
          <div className="col-start-3 col-span-1 row-start-4 row-span-1 bg-[#F4F4F0] rounded-[2rem] p-6 flex flex-col justify-center border border-[#1A2421]/5">
             <h4 className="text-[#1A2421] text-[9px] lg:text-[10px] font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
               <Sprout className="w-3 h-3 lg:w-4 lg:h-4" /> O Público
             </h4>
             <p className="text-[#1A2421]/80 text-xs lg:text-sm leading-relaxed font-medium">
               O homem do interior e o Brasil raiz que buscam força na natureza. Nossa comunicação é simples, direta e com o respeito de uma conversa de balcão.
             </p>
          </div>

        </div>
      </div>
    </div>
  );
}
