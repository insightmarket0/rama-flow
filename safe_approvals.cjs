const fs = require('fs');
let content = fs.readFileSync('src/pages/Marketing.tsx', 'utf8');

let sIdx = content.indexOf('{/* 2. Pipeline de Aprova');
let eIdx = content.indexOf('                </div>\n\n              </div>\n\n            </div>\n          </div>\n        )}\n      </div>');

if (sIdx !== -1 && eIdx !== -1) {
    let oldBlock = content.substring(sIdx, eIdx);
    
    // Check how many divs are in oldBlock vs our new one.
    // oldBlock ends right before the closing tags of the grid.
    
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
                  </div>
`;
    content = content.replace(oldBlock, newApprovalBlock);
    
    // Check if CheckCircle2 is imported
    if (!content.includes('CheckCircle2')) {
        content = content.replace(/(import .*? from "lucide-react";)/, `$1\nimport { CheckCircle2 } from "lucide-react";`);
    }

    fs.writeFileSync('src/pages/Marketing.tsx', content, 'utf8');
    console.log("Success! Approvals block replaced safely.");
} else {
    console.log("Could not find Approvals bounds.");
}
