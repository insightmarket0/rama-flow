const fs = require('fs');
let content = fs.readFileSync('src/pages/Marketing.tsx', 'utf8');

const hookUpdates = `
  const [approvals, setApprovals] = useState([
    { id: 1, title: 'Cachê Extra: Virgínia', campaign: 'Campanha Black Friday', amount: 15000, description: 'Cachê adicional aprovado em reunião com diretoria para fechar 3 stories e 1 reel.' },
    { id: 2, title: 'Boost Meta Ads', campaign: 'Escala de Criativo #04', amount: 5000, description: 'Injeção de verba para escalar criativo validado com ROAS > 4.' }
  ]);
  const [isCreateApprovalModalOpen, setIsCreateApprovalModalOpen] = useState(false);
  const [approvalForm, setApprovalForm] = useState({ title: '', campaign: '', amount: 0, description: '' });
  const [approvalDetails, setApprovalDetails] = useState(null);

  React.useEffect(() => {
    const savedApprovals = localStorage.getItem("rama_approvals");
    if (savedApprovals) {
      try { setApprovals(JSON.parse(savedApprovals)); } catch(e){}
    }
  }, []);

  const handleCreateApproval = () => {
    const newApproval = { ...approvalForm, id: Date.now() };
    const updated = [...approvals, newApproval];
    setApprovals(updated);
    localStorage.setItem("rama_approvals", JSON.stringify(updated));
    setIsCreateApprovalModalOpen(false);
    setApprovalForm({ title: '', campaign: '', amount: 0, description: '' });
  };

  const handleApprove = (id, amount) => {
    const updated = approvals.filter(a => a.id !== id);
    setApprovals(updated);
    localStorage.setItem("rama_approvals", JSON.stringify(updated));
    
    // Add to spent budget
    const updatedBudget = { ...marketingBudget, gasto: marketingBudget.gasto + amount };
    setMarketingBudget(updatedBudget);
    localStorage.setItem("rama_marketing_budget", JSON.stringify(updatedBudget));
    setApprovalDetails(null);
  };

  const handleReject = (id) => {
    const updated = approvals.filter(a => a.id !== id);
    setApprovals(updated);
    localStorage.setItem("rama_approvals", JSON.stringify(updated));
    setApprovalDetails(null);
  };
`;

if (!content.includes('handleCreateApproval')) {
    content = content.replace('const handleEditBudget = () => {', hookUpdates + '\n  const handleEditBudget = () => {');
}

// Find block by indexOf
const startMarker = '{/* 2. Pipeline de Aprova';
let startIdx = content.indexOf(startMarker);
if (startIdx === -1) {
    console.log("Could not find start marker");
} else {
    let endMarker = '{/* KPIs & Performance (Dashboard Style) */}';
    let endIdx = content.indexOf(endMarker);
    if (endIdx === -1) {
        console.log("Could not find end marker");
    } else {
        // Backtrack to find the exact closing tag of the Pipeline block before KPIs.
        // It's probably easier to just replace from blockStartLine to blockEndLine.
        let blockToReplace = content.substring(startIdx, endIdx);
        
        // Wait, blockToReplace includes some `</div>`s that close the wrapping flex container!
        // The structure is:
        // {/* 2. Pipeline de Aprovações (Corporate Workflow) */}
        // <div className="lg:col-span-5 bg-[#0a0a0a] ...">
        //   ...
        // </div>
        // </div> <-- Closes `grid grid-cols-1 lg:grid-cols-12 gap-4`
        // </div> <-- Closes `mt-6 flex flex-col gap-6` (wait, does it?)
        // Let's print out the last 200 chars of blockToReplace to see the closing divs
        console.log("Block ending:\n", blockToReplace.substring(blockToReplace.length - 200));
        
        // Actually, we ONLY want to replace the `lg:col-span-5` div.
        let cardStart = content.indexOf('<div className="lg:col-span-5 bg-[#0a0a0a]', startIdx);
        // Find where the card ends. It ends when `</div>` is followed by another `</div>` that closes the grid.
        let currentIdx = cardStart;
        let divs = 0;
        let cardEnd = -1;
        
        // Let's do something simpler: replace until we hit `Escala de Criativo #04` and its closing tags
        let innerText = 'Escala de Criativo #04';
        let innerIdx = content.indexOf(innerText, startIdx);
        if (innerIdx !== -1) {
            let div1 = content.indexOf('</div>', innerIdx); // closes <div className="flex justify-between items-start">
            let div2 = content.indexOf('</div>', div1 + 6); // closes <div className="bg-[#111] ...">
            let div3 = content.indexOf('</div>', div2 + 6); // closes <div className="space-y-3 mt-auto ...">
            let div4 = content.indexOf('</div>', div3 + 6); // closes <div className="lg:col-span-5 bg-[#0a0a0a] ...">
            
            let exactBlockToReplace = content.substring(startIdx, div4 + 6);
            
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
                  
            content = content.replace(exactBlockToReplace, newApprovalBlock.trim());
            console.log("Success! Replaced exact block.");
            
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

            if (!content.includes('isCreateApprovalModalOpen && (')) {
                content = content.replace(/(<\/div>\s*\r?\n\s*\);\r?\n\})\s*$/, `\n${modalsCode}\n$1`);
            }
            
            // Check if CheckCircle2 is imported
            if (!content.includes('CheckCircle2')) {
                content = content.replace(/(import .*? from "lucide-react";)/, `$1\nimport { CheckCircle2 } from "lucide-react";`);
            }
            
            fs.writeFileSync('src/pages/Marketing.tsx', content, 'utf8');
        } else {
            console.log("Could not find innerText");
        }
    }
}
