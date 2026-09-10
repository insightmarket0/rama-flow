const fs = require('fs');
let content = fs.readFileSync('src/pages/Marketing.tsx', 'utf8');

let sIdx = content.indexOf('{/* 2. Pipeline de Aprova');
let eIdx = content.indexOf('{/* OVERLAY: BRAND VAULT */}');

if (sIdx !== -1 && eIdx !== -1) {
    let block = content.substring(sIdx, eIdx);
    
    // The original block ended right before BRAND VAULT with:
    //                   </div>
    //                 </div>
    //               </div>
    //             </div>
    //           </div>
    //         )}
    //       </div>
    //
    // Let's find the first `</div>` that belongs to the overall grid structure.
    // Actually, let's just do an indexOf for Escala de Criativo #04 and find its matching closing div.
    let innerIdx = block.indexOf('Escala de Criativo #04');
    let div1 = block.indexOf('</div>', innerIdx); 
    let div2 = block.indexOf('</div>', div1 + 6); 
    let div3 = block.indexOf('</div>', div2 + 6); 
    let div4 = block.indexOf('</div>', div3 + 6); 
    let div5 = block.indexOf('</div>', div4 + 6);
    
    // We want to replace from sIdx up to div5 + 6.
    let exactBlock = block.substring(0, div5 + 6);
    
    const newApprovalBlock = `
                  {/* 2. Pipeline de Aprovações (Corporate Workflow) */}
                  <div className="lg:col-span-5 bg-[#0a0a0a] border border-white/5 rounded-2xl p-5 flex flex-col relative overflow-hidden group">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <h3 className="text-white text-sm font-semibold tracking-tight">Aprovações Pendentes</h3>
                        <button onClick={() => setIsCreateApprovalModalOpen(true)} className="bg-white/5 hover:bg-white/10 text-gray-400 px-2 py-0.5 rounded text-[9px] font-bold tracking-widest uppercase transition-colors border border-white/5 flex items-center gap-1">Criar +</button>
                      </div>
                      <div className="px-2 py-0.5 bg-yellow-500/10 border border-yellow-500/20 rounded-full flex items-center gap-1.5">
                        <Clock className="w-3 h-3 text-yellow-500" />
                        <span className="text-[10px] text-yellow-500 font-bold uppercase tracking-widest">{approvals.length} Ações</span>
                      </div>
                    </div>
                    
                    <div className="space-y-3 mt-auto max-h-[180px] overflow-y-auto custom-scrollbar pr-1">
                      {approvals.length === 0 ? (
                        <div className="text-center py-8">
                          <CheckCircle2 className="w-8 h-8 text-emerald-500/50 mx-auto mb-2" />
                          <p className="text-gray-500 text-xs">Tudo aprovado! Nenhuma pendência.</p>
                        </div>
                      ) : approvals.map(app => (
                        <div key={app.id} className="bg-[#111] border border-white/5 rounded-xl p-3 flex flex-col gap-2 hover:border-white/10 transition-colors cursor-pointer" onClick={() => setApprovalDetails(app)}>
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="text-white text-xs font-bold">{app.title}</h4>
                              <span className="text-[10px] text-gray-500">{app.campaign}</span>
                            </div>
                            <span className="text-cyan-400 font-bold text-xs bg-cyan-400/10 px-1.5 py-0.5 rounded">R$ {app.amount.toLocaleString('pt-BR')}</span>
                          </div>
                          <div className="flex justify-between items-center mt-1 border-t border-white/5 pt-2">
                            <span className="text-[9px] text-gray-600 uppercase tracking-widest font-bold">Ver Detalhes</span>
                            <div className="flex gap-2">
                              <button onClick={(e) => { e.stopPropagation(); handleReject(app.id); }} className="text-[9px] font-bold px-2 py-1 bg-white/5 hover:bg-red-500/20 hover:text-red-400 rounded uppercase text-gray-400 transition-colors">Rejeitar</button>
                              <button onClick={(e) => { e.stopPropagation(); handleApprove(app.id, app.amount); }} className="text-[9px] font-bold px-2 py-1 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 rounded uppercase hover:bg-cyan-500 hover:text-white transition-colors">Aprovar</button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>`;
    
    let fullNewContent = content.substring(0, sIdx) + newApprovalBlock + content.substring(sIdx + exactBlock.length);
    
    const modalsCode = `
      {/* Modals para Aprovações */}
      {isCreateApprovalModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsCreateApprovalModalOpen(false)}></div>
          <div className="bg-[#111] border border-[#222] rounded-2xl p-6 relative z-10 w-full max-w-md shadow-2xl flex flex-col gap-4">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h3 className="text-white font-semibold">Nova Solicitação</h3>
              <button onClick={() => setIsCreateApprovalModalOpen(false)} className="text-gray-500 hover:text-white">x</button>
            </div>
            
            <div className="space-y-4 mt-2">
              <div>
                <label className="text-[10px] uppercase font-bold text-gray-500 mb-1 block">Título da Despesa</label>
                <input type="text" value={approvalForm.title} onChange={e => setApprovalForm({...approvalForm, title: e.target.value})} placeholder="Ex: Cachê Virgínia" className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-cyan-500 outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-500 mb-1 block">Campanha/Setor</label>
                  <input type="text" value={approvalForm.campaign} onChange={e => setApprovalForm({...approvalForm, campaign: e.target.value})} placeholder="Ex: Black Friday" className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-cyan-500 outline-none" />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-500 mb-1 block">Valor Solicitado (R$)</label>
                  <input type="number" value={approvalForm.amount} onChange={e => setApprovalForm({...approvalForm, amount: parseInt(e.target.value) || 0})} className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-cyan-500 outline-none" />
                </div>
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-gray-500 mb-1 block">Justificativa / Detalhes</label>
                <textarea value={approvalForm.description} onChange={e => setApprovalForm({...approvalForm, description: e.target.value})} rows="3" placeholder="Explique o motivo do orçamento extra..." className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-cyan-500 outline-none resize-none"></textarea>
              </div>
            </div>

            <button onClick={handleCreateApproval} className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-sm py-2.5 rounded-lg mt-2 transition-colors">
              Criar Solicitação
            </button>
          </div>
        </div>
      )}

      {approvalDetails && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setApprovalDetails(null)}></div>
          <div className="bg-[#111] border border-white/10 rounded-2xl p-6 relative z-10 w-full max-w-sm shadow-2xl flex flex-col gap-4">
            <div className="flex justify-between items-start border-b border-white/10 pb-4 mb-2">
              <div>
                <h3 className="text-white font-bold text-lg leading-tight">{approvalDetails.title}</h3>
                <span className="text-cyan-400 text-xs font-semibold uppercase tracking-widest">{approvalDetails.campaign}</span>
              </div>
              <button onClick={() => setApprovalDetails(null)} className="text-gray-500 hover:text-white p-1">x</button>
            </div>
            
            <div className="bg-black/50 p-4 rounded-xl border border-white/5 mb-2">
              <span className="text-[10px] uppercase font-bold text-gray-500 block mb-2">Justificativa</span>
              <p className="text-gray-300 text-sm leading-relaxed">{approvalDetails.description || 'Nenhum detalhe adicional fornecido.'}</p>
            </div>

            <div className="flex items-center justify-between bg-cyan-500/10 border border-cyan-500/20 p-4 rounded-xl">
              <span className="text-xs uppercase font-bold text-cyan-500">Valor Solicitado</span>
              <span className="text-xl font-bold text-white">R$ {approvalDetails.amount.toLocaleString('pt-BR')}</span>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-4">
              <button onClick={() => handleReject(approvalDetails.id)} className="w-full bg-transparent border border-white/10 hover:bg-red-500/20 hover:border-red-500/30 text-white hover:text-red-400 font-bold text-sm py-3 rounded-xl transition-colors">
                Rejeitar
              </button>
              <button onClick={() => handleApprove(approvalDetails.id, approvalDetails.amount)} className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-sm py-3 rounded-xl transition-colors">
                Aprovar & Lançar
              </button>
            </div>
            <p className="text-[10px] text-center text-gray-500 mt-2">
              Ao aprovar, o valor de R$ {approvalDetails.amount.toLocaleString('pt-BR')} será adicionado automaticamente ao "Gasto" do seu Orçamento atual.
            </p>
          </div>
        </div>
      )}
`;

    if (!fullNewContent.includes('isCreateApprovalModalOpen && (')) {
        fullNewContent = fullNewContent.replace(/({\/\* OVERLAY: BRAND VAULT \*\/})/, `\n${modalsCode}\n      $1`);
    }
    
    if (!fullNewContent.includes('CheckCircle2')) {
        fullNewContent = fullNewContent.replace(/(import .*? from "lucide-react";)/, `$1\nimport { CheckCircle2 } from "lucide-react";`);
    }
    
    fs.writeFileSync('src/pages/Marketing.tsx', fullNewContent, 'utf8');
    console.log("Success! Final Approvals applied perfectly.");
}
