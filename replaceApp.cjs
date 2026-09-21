const fs = require('fs');
let content = fs.readFileSync('src/pages/BusinessPlan.tsx', 'utf-8');

const regex = /\{\s*activeTab\s*===\s*"app"\s*&&\s*\([\s\S]*?\}\s*\)\s*\}/;

const match = content.match(regex);
if (match) {
    const block = match[0];
    // Find the original phone content
    const phoneStartIndex = block.indexOf('<div className="relative w-[340px] h-[720px]');
    let phoneContent = '';
    
    if (phoneStartIndex !== -1) {
       let temp = block.substring(phoneStartIndex);
       // The phone ends at the last </div> before the end of the block
       phoneContent = temp.substring(0, temp.lastIndexOf('</div>', temp.lastIndexOf('</div>', temp.lastIndexOf('}') - 1) - 1) + 6);
    }
    
    const newBlock = `{activeTab === "app" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 flex flex-col items-center">
              <div className="text-center mb-12">
                <h2 className="text-white text-3xl font-black tracking-tight">O Futuro do E-commerce</h2>
                <p className="text-gray-400 font-black max-w-lg mt-2 mx-auto">
                  Simulação da nossa futura plataforma proprietária: uma experiência nativa de compra rápida somada ao poder do atendimento consultivo via WhatsApp.
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
                  ` + phoneContent + `
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
                    
                    {/* Notch */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-[#1A1A1A] rounded-b-3xl z-50" />
      
                    {/* Status Bar */}
                    <div className="absolute top-0 w-full h-12 flex justify-between items-center px-6 z-40 text-white/70 text-[10px] font-bold pt-2">
                      <span>9:42</span>
                      <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-none border-4 border-white/70" />
                        <div className="w-3 h-3 rounded-none border-4 border-white/70" />
                        <div className="w-4 h-3 bg-white/70 rounded-[2px]" />
                      </div>
                    </div>

                    {/* WhatsApp Header */}
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

                    {/* Chat Area */}
                    <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 relative custom-scrollbar pb-6">
                      <div className="absolute inset-0 opacity-[0.04] bg-[url('https://i.pinimg.com/originals/8c/98/99/8c98994518b575bfd8c949e91d20548b.jpg')] bg-repeat" />

                      <div className="flex justify-center my-2 relative z-10">
                        <span className="bg-[#182229] text-[#8696a0] text-[11px] px-3 py-1 rounded-lg shadow-sm">Hoje</span>
                      </div>

                      {/* User Message 1 */}
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

                      {/* Bot Message 1 */}
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

                      {/* User Message 2 */}
                      <div className="flex flex-col items-end self-end max-w-[85%] relative z-10 mt-2">
                        <div className="bg-[#005c4b] text-[#e9edef] text-[13px] px-3 py-2 rounded-xl rounded-tr-sm shadow-sm relative">
                          Nossa, perfeito! Pode fechar com a instalação então.
                          <span className="text-[#8696a0] text-[10px] ml-2 float-right mt-1">09:42</span>
                        </div>
                      </div>

                      {/* Bot Message 2 */}
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

                    {/* WhatsApp Input */}
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
          )}`;

    content = content.replace(regex, newBlock);
    fs.writeFileSync('src/pages/BusinessPlan.tsx', content, 'utf-8');
    console.log('Regex dual phone successful!');
} else {
    console.log('Regex did not match the activeTab === app block');
}
