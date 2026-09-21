const fs = require('fs');
let content = fs.readFileSync('src/pages/BusinessPlan.tsx', 'utf-8');

const startStr = '<div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 relative custom-scrollbar pb-6">';
const endStr = '<div className="bg-[#202c33] px-3 py-2 flex items-center gap-2 z-30 relative">';

const startIndex = content.indexOf(startStr);
const endIndex = content.indexOf(endStr);

if (startIndex !== -1 && endIndex !== -1) {
    const newChat = `<div className="flex-1 overflow-y-auto p-3.5 flex flex-col gap-3.5 relative custom-scrollbar pb-6">
                      <div className="absolute inset-0 opacity-[0.04] bg-[url('https://i.pinimg.com/originals/8c/98/99/8c98994518b575bfd8c949e91d20548b.jpg')] bg-repeat" />

                      <div className="flex justify-center my-1 relative z-10">
                        <span className="bg-[#182229] text-[#8696a0] text-[10px] font-medium px-3 py-1 rounded-lg shadow-sm">Hoje</span>
                      </div>

                      {/* Client */}
                      <div className="flex flex-col items-end self-end max-w-[90%] relative z-10">
                        <div className="bg-[#005c4b] text-[#e9edef] text-[12px] px-2.5 py-1.5 rounded-xl rounded-tr-sm shadow-sm relative">
                          Olá! Vi aquele Fogão Brastemp 4 bocas no TikTok de vocês. Ainda tem pronta entrega?
                          <span className="text-[#8696a0] text-[9px] ml-2 float-right mt-1.5">09:40</span>
                        </div>
                      </div>

                      {/* Store */}
                      <div className="flex flex-col items-start self-start max-w-[90%] relative z-10 mt-1">
                        <div className="bg-[#202c33] text-[#e9edef] text-[12px] px-2.5 py-1.5 rounded-xl rounded-tl-sm shadow-sm relative">
                          Olá! Bem-vindo(a) à RAMA FLOW. 🚀
                        </div>
                      </div>
                      <div className="flex flex-col items-start self-start max-w-[90%] relative z-10 mt-[-8px]">
                        <div className="bg-[#202c33] text-[#e9edef] text-[12px] px-2.5 py-1.5 rounded-xl rounded-tl-sm shadow-sm relative">
                          Temos sim! O <strong>Fogão Brastemp (R$ 1.299)</strong> está no nosso CD central. Se fecharmos agora, nosso Flex entrega <strong>hoje à tarde</strong>!
                          <span className="text-[#8696a0] text-[9px] ml-2 float-right mt-1.5">09:41</span>
                        </div>
                      </div>

                      {/* Client */}
                      <div className="flex flex-col items-end self-end max-w-[90%] relative z-10 mt-1">
                        <div className="bg-[#005c4b] text-[#e9edef] text-[12px] px-2.5 py-1.5 rounded-xl rounded-tr-sm shadow-sm relative">
                          Ótimo, vou querer. Mas me mudei para um apê novo e não tenho a mangueira, nem quem instale.
                          <span className="text-[#8696a0] text-[9px] ml-2 float-right mt-1.5">09:41</span>
                        </div>
                      </div>

                      {/* Store */}
                      <div className="flex flex-col items-start self-start max-w-[90%] relative z-10 mt-1">
                        <div className="bg-[#202c33] text-[#e9edef] text-[12px] px-2.5 py-1.5 rounded-xl rounded-tl-sm shadow-sm relative">
                          Fique tranquilo(a)! Ninguém fica sem cozinhar com a Rama. 😊
                        </div>
                      </div>
                      <div className="flex flex-col items-start self-start max-w-[90%] relative z-10 mt-[-8px]">
                        <div className="bg-[#202c33] text-[#e9edef] text-[12px] px-2.5 py-1.5 rounded-xl rounded-tl-sm shadow-sm relative">
                          Posso incluir o <strong>Kit Gás Premium</strong> (Mangueira de Cobre + Registro) por R$ 149,90 e já enviar nosso técnico amanhã cedo por apenas +R$ 90,00?
                          <span className="text-[#8696a0] text-[9px] ml-2 float-right mt-1.5">09:42</span>
                        </div>
                      </div>

                      {/* Client */}
                      <div className="flex flex-col items-end self-end max-w-[90%] relative z-10 mt-1">
                        <div className="bg-[#005c4b] text-[#e9edef] text-[12px] px-2.5 py-1.5 rounded-xl rounded-tr-sm shadow-sm relative">
                          Nossa, perfeito! Pode fechar o pacote completo então.
                          <span className="text-[#8696a0] text-[9px] ml-2 float-right mt-1.5">09:42</span>
                        </div>
                      </div>

                      {/* Store - Fatura */}
                      <div className="flex flex-col items-start self-start max-w-[95%] relative z-10 mt-1">
                        <div className="bg-[#202c33] p-1.5 rounded-xl rounded-tl-sm shadow-sm w-[260px] relative">
                          <div className="bg-[#0b141a] rounded-lg p-3 flex flex-col gap-2">
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-[#00a884] font-bold text-[10px] uppercase tracking-wider flex items-center gap-1.5">
                                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
                                Fatura RAMA
                              </span>
                            </div>
                            <div className="text-white font-black text-2xl mb-1">R$ 1.538,90</div>
                            
                            <div className="flex flex-col gap-1 text-[#8696a0] text-[10px] font-medium border-t border-white/5 pt-2">
                              <div className="flex justify-between"><span>Fogão Brastemp 4B</span><span className="text-white">1.299,00</span></div>
                              <div className="flex justify-between"><span>Kit Gás Premium</span><span className="text-white">149,90</span></div>
                              <div className="flex justify-between"><span>Instalação (Técnico)</span><span className="text-white">90,00</span></div>
                            </div>

                            <button className="w-full bg-[#00a884] hover:bg-[#008f6f] text-[#0b141a] font-bold py-2 rounded-md mt-2 text-[12px] transition-colors flex items-center justify-center gap-1.5 shadow-md">
                              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                              Pagar via PIX
                            </button>
                          </div>
                          <span className="text-[#8696a0] text-[9px] float-right mt-1.5 mr-1 mb-0.5">09:42</span>
                        </div>
                      </div>

                      <div className="flex flex-col items-start self-start max-w-[90%] relative z-10 mt-[-8px]">
                        <div className="bg-[#202c33] text-[#e9edef] text-[12px] px-2.5 py-1.5 rounded-xl rounded-tl-sm shadow-sm relative">
                          O técnico João chegará amanhã às 09:00 com o kit. E o fogão chega hoje até as 18h! 😉
                          <span className="text-[#8696a0] text-[9px] ml-2 float-right mt-1.5">09:43</span>
                        </div>
                      </div>
                    </div>
                    
                    `;

    content = content.substring(0, startIndex) + newChat + content.substring(endIndex);
    fs.writeFileSync('src/pages/BusinessPlan.tsx', content, 'utf-8');
    console.log('WhatsApp simulation upgraded!');
} else {
    console.log('Could not find chat bounds.');
}
