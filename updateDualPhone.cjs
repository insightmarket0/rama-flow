const fs = require('fs');
let content = fs.readFileSync('src/pages/BusinessPlan.tsx', 'utf-8');

const regex = /\{\/\* Simula.*?\*\/}\s*<div className="relative w-\[340px\] h-\[720px\] bg-black rounded-\[3rem\] border-\[8px\] border-\[#1A1A1A\] shadow-2xl overflow-hidden flex flex-col ring-1 ring-white\/10">(.*?)<\/div>\s*<\/div>\s*\)\}\s*\{activeTab === "ecossistema"/s;

const match = content.match(regex);
if (match) {
    const phone1Content = match[1];

    const newPhones = `{/* Simulação dos Celulares */}
              <div className="flex flex-col xl:flex-row gap-8 xl:gap-16 items-center justify-center w-full">
                
                {/* CELULAR 1: App */}
                <div className="flex flex-col gap-4 items-center">
                  <span className="text-[#CCFF00] font-black tracking-widest uppercase text-sm">Escala D2C (Site)</span>
                  <div className="relative w-[340px] h-[720px] bg-black rounded-[3rem] border-[8px] border-[#1A1A1A] shadow-2xl overflow-hidden flex flex-col ring-1 ring-white/10 shrink-0">
                    ${phone1Content}
                  </div>
                </div>

                {/* CELULAR 2: WhatsApp */}
                <div className="flex flex-col gap-4 items-center">
                  <span className="text-[#00a884] font-black tracking-widest uppercase text-sm">Cross-sell (Atendimento)</span>
                  <div className="relative w-[340px] h-[720px] bg-[#0b141a] rounded-[3rem] border-[8px] border-[#1A1A1A] shadow-2xl overflow-hidden flex flex-col ring-1 ring-white/10 shrink-0">
                    
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
                      <ArrowLeft className="text-[#8696a0] w-5 h-5" />
                      <div className="w-10 h-10 rounded-full bg-[#CCFF00] flex items-center justify-center shrink-0">
                        <span className="text-black font-black text-sm">RF</span>
                      </div>
                      <div className="flex flex-col flex-1 leading-tight">
                        <div className="flex items-center gap-1">
                          <span className="text-white font-bold text-base">Rama Flow</span>
                          <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#00a884]" fill="currentColor"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-1.9 14.7L6 12.6l1.5-1.5 2.6 2.6 6.4-6.4 1.5 1.5-7.9 7.9z"/></svg>
                        </div>
                        <span className="text-[#8696a0] text-xs">Atendimento Oficial</span>
                      </div>
                      <MoreVertical className="text-[#8696a0] w-5 h-5 shrink-0" />
                    </div>

                    {/* Chat Area */}
                    <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 relative custom-scrollbar">
                      <div className="absolute inset-0 opacity-[0.03] bg-[url('https://i.pinimg.com/originals/8c/98/99/8c98994518b575bfd8c949e91d20548b.jpg')] bg-repeat" />

                      <div className="flex justify-center my-2 relative z-10">
                        <span className="bg-[#182229] text-[#8696a0] text-[11px] px-3 py-1 rounded-lg shadow-sm">Hoje</span>
                      </div>

                      {/* User Message 1 */}
                      <div className="flex flex-col items-end self-end max-w-[85%] relative z-10">
                        <div className="bg-[#005c4b] text-[#e9edef] text-[13px] px-3 py-2 rounded-xl rounded-tr-sm shadow-sm">
                          Olá! Comprei um fogão novo no site de vocês.
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end self-end max-w-[85%] relative z-10 mt-[-8px]">
                        <div className="bg-[#005c4b] text-[#e9edef] text-[13px] px-3 py-2 rounded-xl rounded-tr-sm shadow-sm">
                          Preciso do kit de gás e ver como funciona a instalação.
                          <span className="text-[#8696a0] text-[10px] ml-2 float-right mt-1">09:41</span>
                        </div>
                      </div>

                      {/* Bot Message 1 */}
                      <div className="flex flex-col items-start self-start max-w-[85%] relative z-10 mt-2">
                        <div className="bg-[#202c33] text-[#e9edef] text-[13px] px-3 py-2 rounded-xl rounded-tl-sm shadow-sm">
                          Olá! Bem-vindo(a) à RAMA FLOW. 🚀<br/><br/>
                          Temos o Kit Premium (Mangueira Flexível de Cobre + Registro de Segurança) por <strong>R$ 149,90</strong>.
                        </div>
                      </div>

                      <div className="flex flex-col items-start self-start max-w-[85%] relative z-10 mt-[-8px]">
                        <div className="bg-[#202c33] text-[#e9edef] text-[13px] px-3 py-2 rounded-xl rounded-tl-sm shadow-sm">
                          Quer que eu já agende a instalação com um de nossos técnicos para amanhã de manhã por +R$ 90,00?
                          <span className="text-[#8696a0] text-[10px] ml-2 float-right mt-1">09:42</span>
                        </div>
                      </div>

                      {/* User Message 2 */}
                      <div className="flex flex-col items-end self-end max-w-[85%] relative z-10 mt-2">
                        <div className="bg-[#005c4b] text-[#e9edef] text-[13px] px-3 py-2 rounded-xl rounded-tr-sm shadow-sm">
                          Nossa, perfeito! Pode fechar com a instalação então.
                          <span className="text-[#8696a0] text-[10px] ml-2 float-right mt-1">09:42</span>
                        </div>
                      </div>

                      {/* Bot Message 2 */}
                      <div className="flex flex-col items-start self-start max-w-[85%] relative z-10 mt-2">
                        <div className="bg-[#202c33] text-[#e9edef] text-[13px] px-3 py-2 rounded-xl rounded-tl-sm shadow-sm">
                          Tudo certo! O técnico João chegará amanhã entre 09:00 e 11:00. O kit já vai com ele.
                        </div>
                      </div>

                      <div className="flex flex-col items-start self-start max-w-[85%] relative z-10 mt-[-8px]">
                        <div className="bg-[#202c33] text-[#e9edef] text-[13px] p-1.5 rounded-xl rounded-tl-sm shadow-sm w-[240px]">
                          <div className="bg-[#0b141a] rounded-lg p-3 flex flex-col gap-2">
                            <div className="flex justify-between items-center">
                              <span className="text-[#00a884] font-bold text-[11px] uppercase tracking-wider">Fatura RAMA</span>
                              <ShoppingCart className="w-4 h-4 text-[#8696a0]" />
                            </div>
                            <div className="text-white font-black text-2xl">R$ 239,90</div>
                            <div className="text-[#8696a0] text-[10px] leading-tight">Kit Gás (149,90) + Instalação (90,00)</div>
                            <button className="w-full bg-[#00a884] hover:bg-[#008f6f] text-[#0b141a] font-bold py-1.5 rounded-md mt-2 text-xs transition-colors">
                              Pagar Agora
                            </button>
                          </div>
                          <span className="text-[#8696a0] text-[10px] float-right mt-1 mr-1 mb-0.5">09:42</span>
                        </div>
                      </div>
                    </div>

                    {/* WhatsApp Input */}
                    <div className="bg-[#202c33] px-3 py-2 flex items-center gap-2 z-30">
                      <svg viewBox="0 0 24 24" className="w-6 h-6 text-[#8696a0]" fill="currentColor"><path d="M11.999 14.942c2.001 0 3.531-1.53 3.531-3.531V4.35c0-2.001-1.53-3.531-3.531-3.531S8.469 2.349 8.469 4.35v7.061c0 2.001 1.53 3.531 3.531 3.531z"/><path d="M17.634 11.411c0 3.116-2.529 5.644-5.644 5.644s-5.645-2.528-5.645-5.644H4.559c0 3.829 2.915 6.98 6.574 7.481v3.91h2.72v-3.91c3.659-.501 6.574-3.652 6.574-7.481h-1.793z"/></svg>
                      <div className="flex-1 bg-[#2a3942] rounded-full flex items-center px-4 py-2">
                        <span className="text-[#8696a0] text-[13px]">Mensagem</span>
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
          {activeTab === "ecossistema"`;

    content = content.replace(regex, newPhones);
    fs.writeFileSync('src/pages/BusinessPlan.tsx', content, 'utf-8');
    console.log('Dual phones layout applied!');
} else {
    console.log('Regex failed');
}
