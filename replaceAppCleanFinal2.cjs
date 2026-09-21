const fs = require('fs');
let content = fs.readFileSync('src/pages/BusinessPlan.tsx', 'utf-8');

const startStr = '{activeTab === "app" && (';
const startIndex = content.lastIndexOf(startStr); // get the real content
const remaining = content.substring(startIndex);
const endMatch = remaining.match(/\n\s*\{activeTab === "ecossistema" && \(/);

if (startIndex !== -1 && endMatch) {
    const endIndex = startIndex + endMatch.index;

    const newAppTab = `{activeTab === "app" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 flex flex-col items-center">
              <div className="text-center mb-12">
                <h2 className="text-white text-3xl font-black tracking-tight">O Futuro do E-commerce</h2>
                <p className="text-gray-400 font-black max-w-lg mt-2 mx-auto">
                  Simulação da nossa futura plataforma proprietária: uma experiência nativa de compra guiada somada ao poder do atendimento consultivo via WhatsApp.
                </p>
              </div>
  
              {/* Simulação dos Celulares */}
              <div className="flex flex-col xl:flex-row gap-12 xl:gap-20 items-center justify-center w-full max-w-[1200px] mx-auto pb-10">
                
                {/* CELULAR 1: App */}
                <div className="flex flex-col gap-4 items-center">
                  <div className="flex flex-col items-center gap-1 text-center">
                    <span className="text-[#CCFF00] font-black tracking-widest uppercase text-sm flex items-center gap-2"><div className="w-2 h-2 bg-[#CCFF00] rounded-full animate-pulse"/> D2C: Compra Rápida</span>
                    <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Escala & Autoatendimento</span>
                  </div>
                  
                  <div className="relative w-[340px] h-[720px] bg-black rounded-[3rem] border-[8px] border-[#1A1A1A] shadow-2xl overflow-hidden flex flex-col ring-1 ring-white/10 shrink-0">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-[#1A1A1A] rounded-b-3xl z-50" />
                    <div className="absolute top-0 w-full h-12 flex justify-between items-center px-6 z-40 text-white text-[10px] font-bold pt-2">
                      <span>9:41</span>
                      <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-none border-4 border-white/100" />
                        <div className="w-3 h-3 rounded-none border-4 border-white/100" />
                        <div className="w-4 h-3 bg-white/80 rounded-[2px]" />
                      </div>
                    </div>
                    <div className="relative flex-1 bg-[#111111] overflow-hidden group cursor-pointer">
                      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1540569014015-19a7be504e3a?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center opacity-60 mix-blend-luminosity" />
                      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/90" />
                      <div className="absolute bottom-0 left-0 w-full p-4 pb-20 flex justify-between items-end">
                        <div className="flex-1 pr-4">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 rounded-none bg-indigo-500 flex items-center justify-center text-white font-bold text-xs shadow-lg">RF</div>
                            <span className="text-white font-bold text-sm drop-shadow-md">@ramaflow</span>
                            <span className="bg-white/20 text-white text-[9px] px-1.5 py-0.5 rounded-sm backdrop-blur-sm">Patrocinado</span>
                          </div>
                          <p className="text-white text-sm font-black mb-3 drop-shadow-md line-clamp-2">
                            Testei o Kit de Instalação de Gás com Válvula de Segurança da Rama Flow. Olha a facilidade e a economia!
                          </p>
                          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-none p-3 flex gap-3 items-center cursor-pointer hover:bg-white/20 transition-colors shadow-lg">
                            <div className="w-12 h-12 bg-[#111111] rounded-none flex items-center justify-center border-4 border-white/10">
                              <svg viewBox="0 0 24 24" className="text-[#CCFF00] w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                            </div>
                            <div className="flex-1">
                              <h4 className="text-white text-xs font-bold leading-tight">Kit Mangueira + Registro</h4>
                              <div className="flex items-center gap-1 mt-1">
                                <span className="text-[#CCFF00] font-bold text-sm">R$ 89,90</span>
                                <span className="text-white/50 text-[10px] line-through">R$ 120</span>
                              </div>
                            </div>
                            <button className="bg-[#CCFF00] text-black w-8 h-8 flex items-center justify-center hover:bg-yellow-400 transition-colors shrink-0 shadow-md">
                              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                            </button>
                          </div>
                        </div>
                        <div className="flex flex-col gap-4 items-center mb-2">
                          <div className="flex flex-col items-center gap-1">
                            <div className="w-10 h-10 rounded-none bg-black/40 backdrop-blur-sm flex items-center justify-center border-2 border-white/20 hover:bg-white/10 transition-colors">
                              <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="white" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                            </div>
                            <span className="text-white text-[10px] font-bold drop-shadow-md">12.4k</span>
                          </div>
                          <div className="flex flex-col items-center gap-1">
                            <div className="w-10 h-10 rounded-none bg-black/40 backdrop-blur-sm flex items-center justify-center border-2 border-white/20 hover:bg-white/10 transition-colors">
                              <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                            </div>
                            <span className="text-white text-[10px] font-bold drop-shadow-md">842</span>
                          </div>
                          <div className="flex flex-col items-center gap-1">
                            <div className="w-10 h-10 rounded-none bg-black/40 backdrop-blur-sm flex items-center justify-center border-2 border-white/20 hover:bg-white/10 transition-colors">
                              <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
                            </div>
                            <span className="text-white text-[10px] font-bold drop-shadow-md">2k</span>
                          </div>
                        </div>
                      </div>
                      <div className="absolute top-1/4 left-4 right-16 space-y-3 pointer-events-none opacity-90">
                         <div className="bg-black/60 backdrop-blur-md p-2.5 rounded-none border-4 border-white/10 w-fit animate-pulse shadow-lg">
                           <span className="text-white text-[10px] font-bold block mb-0.5">João M.</span>
                           <p className="text-gray-200 text-xs font-black">Produto top! Chegou no mesmo dia.</p>
                         </div>
                         <div className="bg-black/60 backdrop-blur-md p-2.5 rounded-none border-4 border-white/10 w-fit ml-8 animate-pulse delay-150 shadow-lg">
                           <span className="text-white text-[10px] font-bold block mb-0.5">Marcia T.</span>
                           <p className="text-gray-200 text-xs font-black">Excelente, técnico super educado!</p>
                         </div>
                      </div>
                    </div>
                    <div className="h-16 bg-[#111111] border-t border-white/10 flex justify-around items-center px-2 z-40 relative">
                      <div className="flex flex-col items-center gap-1 text-gray-500 cursor-pointer hover:text-white transition-colors">
                        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                        <span className="text-[8px] font-bold uppercase tracking-wider">Início</span>
                      </div>
                      <div className="flex flex-col items-center gap-1 text-gray-500 cursor-pointer hover:text-white transition-colors">
                        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                        <span className="text-[8px] font-bold uppercase tracking-wider">Buscar</span>
                      </div>
                      <div className="flex flex-col items-center gap-1 text-[#CCFF00] cursor-pointer -mt-4">
                        <div className="w-12 h-10 rounded-none bg-white flex items-center justify-center relative shadow-[0_0_20px_rgba(255,255,255,0.4)]">
                          <div className="absolute -left-1 w-1 h-4 bg-[#CCFF00] rounded-l-sm" />
                          <div className="absolute -right-1 w-1 h-4 bg-red-500 rounded-r-sm" />
                          <svg viewBox="0 0 24 24" className="w-5 h-5 text-black ml-0.5" fill="black"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                        </div>
                      </div>
                      <div className="flex flex-col items-center gap-1 text-gray-500 cursor-pointer hover:text-white transition-colors">
                        <div className="relative">
                           <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                           <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#CCFF00] rounded-none animate-ping" />
                        </div>
                        <span className="text-[8px] font-bold uppercase tracking-wider">Carrinho</span>
                      </div>
                      <div className="flex flex-col items-center gap-1 text-gray-500 cursor-pointer hover:text-white transition-colors">
                        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                        <span className="text-[8px] font-bold uppercase tracking-wider">Perfil</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* VS Badge */}
                <div className="hidden xl:flex flex-col gap-3 items-center">
                   <div className="w-[2px] h-32 bg-gradient-to-b from-transparent via-white/20 to-transparent" />
                   <div className="w-12 h-12 rounded-full bg-[#111] border-2 border-white/20 flex items-center justify-center z-10 shrink-0">
                     <span className="text-white/40 font-black text-xs">+</span>
                   </div>
                   <div className="w-[2px] h-32 bg-gradient-to-b from-transparent via-white/20 to-transparent" />
                </div>

                {/* CELULAR 2: WhatsApp */}
                <div className="flex flex-col gap-4 items-center">
                  <div className="flex flex-col items-center gap-1 text-center">
                    <span className="text-[#00a884] font-black tracking-widest uppercase text-sm flex items-center gap-2"><div className="w-2 h-2 bg-[#00a884] rounded-full animate-pulse"/> WhatsApp Copilot</span>
                    <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Cross-Sell & Consultivo</span>
                  </div>
                  <div className="relative w-[340px] h-[720px] bg-[#0b141a] rounded-[3rem] border-[8px] border-[#1A1A1A] shadow-2xl overflow-hidden flex flex-col ring-1 ring-white/10 shrink-0 font-sans">
                    
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-[#1A1A1A] rounded-b-3xl z-50" />
      
                    <div className="absolute top-0 w-full h-12 flex justify-between items-center px-6 z-40 text-white/70 text-[10px] font-bold pt-2">
                      <span>9:42</span>
                      <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-none border-4 border-white/70" />
                        <div className="w-3 h-3 rounded-none border-4 border-white/70" />
                        <div className="w-4 h-3 bg-white/70 rounded-[2px]" />
                      </div>
                    </div>

                    <div className="bg-[#202c33] w-full pt-12 pb-3 px-4 flex items-center gap-3 z-30 shadow-sm relative">
                      <svg viewBox="0 0 24 24" className="text-[#8696a0] w-6 h-6 shrink-0" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                      <div className="w-10 h-10 rounded-full bg-black border border-white/10 flex items-center justify-center shrink-0">
                        <span className="text-[#CCFF00] font-black text-sm">RF</span>
                      </div>
                      <div className="flex flex-col flex-1 leading-tight">
                        <div className="flex items-center gap-1">
                          <span className="text-[#e9edef] font-bold text-base whitespace-nowrap">Rama Flow</span>
                          <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#00a884] shrink-0" fill="currentColor"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-1.9 14.7L6 12.6l1.5-1.5 2.6 2.6 6.4-6.4 1.5 1.5-7.9 7.9z"/></svg>
                        </div>
                        <span className="text-[#8696a0] text-[11px] whitespace-nowrap">Atendimento Oficial</span>
                      </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 relative custom-scrollbar pb-6">
                      <div className="absolute inset-0 opacity-[0.04] bg-[url('https://i.pinimg.com/originals/8c/98/99/8c98994518b575bfd8c949e91d20548b.jpg')] bg-repeat" />

                      <div className="flex justify-center my-2 relative z-10">
                        <span className="bg-[#182229] text-[#8696a0] text-[11px] px-3 py-1 rounded-lg shadow-sm">Hoje</span>
                      </div>

                      <div className="flex flex-col items-end self-end max-w-[85%] relative z-10">
                        <div className="bg-[#005c4b] text-[#e9edef] text-[13px] px-3 py-2 rounded-xl rounded-tr-sm shadow-sm relative">
                          Olá! Comprei um fogão novo no site de vocês.
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end self-end max-w-[85%] relative z-10 mt-[-8px]">
                        <div className="bg-[#005c4b] text-[#e9edef] text-[13px] px-3 py-2 rounded-xl rounded-tr-sm shadow-sm relative">
                          Preciso do kit de gás e queria ver como funciona a instalação.
                          <span className="text-[#8696a0] text-[10px] ml-2 float-right mt-1">09:41</span>
                        </div>
                      </div>

                      <div className="flex flex-col items-start self-start max-w-[85%] relative z-10 mt-2">
                        <div className="bg-[#202c33] text-[#e9edef] text-[13px] px-3 py-2 rounded-xl rounded-tl-sm shadow-sm relative">
                          Olá! Bem-vindo(a) à RAMA FLOW. 🚀<br/><br/>
                          Temos o Kit Premium (Mangueira Flexível de Cobre + Registro de Segurança) por <strong>R$ 149,90</strong>.
                        </div>
                      </div>

                      <div className="flex flex-col items-start self-start max-w-[85%] relative z-10 mt-[-8px]">
                        <div className="bg-[#202c33] text-[#e9edef] text-[13px] px-3 py-2 rounded-xl rounded-tl-sm shadow-sm relative">
                          Quer que eu já agende a instalação com um de nossos técnicos para amanhã de manhã por +R$ 90,00?
                          <span className="text-[#8696a0] text-[10px] ml-2 float-right mt-1">09:42</span>
                        </div>
                      </div>

                      <div className="flex flex-col items-end self-end max-w-[85%] relative z-10 mt-2">
                        <div className="bg-[#005c4b] text-[#e9edef] text-[13px] px-3 py-2 rounded-xl rounded-tr-sm shadow-sm relative">
                          Nossa, perfeito! Pode fechar com a instalação então.
                          <span className="text-[#8696a0] text-[10px] ml-2 float-right mt-1">09:42</span>
                        </div>
                      </div>

                      <div className="flex flex-col items-start self-start max-w-[85%] relative z-10 mt-2">
                        <div className="bg-[#202c33] text-[#e9edef] text-[13px] px-3 py-2 rounded-xl rounded-tl-sm shadow-sm relative">
                          Tudo certo! O técnico João chegará amanhã entre 09:00 e 11:00. O kit já vai com ele.
                        </div>
                      </div>

                      <div className="flex flex-col items-start self-start max-w-[85%] relative z-10 mt-[-8px]">
                        <div className="bg-[#202c33] p-1.5 rounded-xl rounded-tl-sm shadow-sm w-[240px] relative">
                          <div className="bg-[#0b141a] rounded-lg p-3 flex flex-col gap-2">
                            <div className="flex justify-between items-center">
                              <span className="text-[#00a884] font-bold text-[11px] uppercase tracking-wider">Fatura RAMA</span>
                              <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#8696a0]" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
                            </div>
                            <div className="text-white font-black text-2xl">R$ 239,90</div>
                            <div className="text-[#8696a0] text-[11px] leading-tight font-medium">Kit Gás (149,90)<br/>+ Instalação (90,00)</div>
                            <button className="w-full bg-[#00a884] hover:bg-[#008f6f] text-[#0b141a] font-bold py-2 rounded-md mt-2 text-[13px] transition-colors flex items-center justify-center gap-1">
                              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                              Pagar Agora
                            </button>
                          </div>
                          <span className="text-[#8696a0] text-[10px] float-right mt-1.5 mr-1 mb-0.5">09:42</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-[#202c33] px-3 py-2 flex items-center gap-2 z-30 relative">
                      <svg viewBox="0 0 24 24" className="w-6 h-6 text-[#8696a0] shrink-0" fill="currentColor"><path d="M11.999 14.942c2.001 0 3.531-1.53 3.531-3.531V4.35c0-2.001-1.53-3.531-3.531-3.531S8.469 2.349 8.469 4.35v7.061c0 2.001 1.53 3.531 3.531 3.531z"/><path d="M17.634 11.411c0 3.116-2.529 5.644-5.644 5.644s-5.645-2.528-5.645-5.644H4.559c0 3.829 2.915 6.98 6.574 7.481v3.91h2.72v-3.91c3.659-.501 6.574-3.652 6.574-7.481h-1.793z"/></svg>
                      <div className="flex-1 bg-[#2a3942] rounded-full flex items-center px-4 py-2.5">
                        <span className="text-[#8696a0] text-[14px]">Mensagem</span>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-[#00a884] flex items-center justify-center shrink-0">
                        <svg viewBox="0 0 24 24" className="w-5 h-5 text-black" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          )}
`;

    content = content.substring(0, startIndex) + newAppTab + content.substring(endIndex);
    fs.writeFileSync('src/pages/BusinessPlan.tsx', content, 'utf-8');
    console.log('App tab fully replaced with hardcoded clean JSX.');
} else {
    console.log('Indexes missed: ' + startIndex + ' ' + (endMatch ? endMatch.index : 'no match'));
}
