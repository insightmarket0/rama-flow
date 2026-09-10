const fs = require('fs');
let content = fs.readFileSync('src/pages/Marketing.tsx', 'utf8');

// The place we can safely inject ALL new hooks is right before:
// const [activeTab, setActiveTab] = useState<"orcamento" | "cockpit" | "roadmap" | "crm" | "performance">("cockpit");

let allHooks = `
  // --- BUDGET & SALES STATES ---
  const getCurrentMonthStr = () => {
    const months = ['janeiro', 'fevereiro', 'marco', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
    return months[new Date().getMonth()];
  };

  const getMonthName = (monthStr) => {
    if (!monthStr) return "";
    const map = {
      janeiro: 'Janeiro', fevereiro: 'Fevereiro', marco: 'Março',
      abril: 'Abril', maio: 'Maio', junho: 'Junho',
      julho: 'Julho', agosto: 'Agosto', setembro: 'Setembro',
      outubro: 'Outubro', novembro: 'Novembro', dezembro: 'Dezembro'
    };
    return map[monthStr] || monthStr;
  };

  const [marketingBudget, setMarketingBudget] = useState(() => {
    const saved = localStorage.getItem("rama_marketing_budget");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.currentMonth !== getCurrentMonthStr()) {
        parsed.needsMonthUpdate = true;
      }
      return parsed;
    }
    return {
      currentMonth: getCurrentMonthStr(),
      total: 150000,
      gasto: 87540,
      vendas: 450000,
      vendasGrowth: 15,
      history: [],
      budgetSplit: { trafego: 52, cache: 48, seeding: 0 }
    };
  });

  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [budgetForm, setBudgetForm] = useState({ total: 0, gasto: 0 });
  
  // NOTE: isNewMonthPromptOpen and isScalingActive were already injected by inject_hooks_final.cjs!
  // Let's NOT duplicate them if they exist! Wait, inject_hooks_final injected them!
  // Let's just define the handlers for Budget!

  const handleEditBudget = () => {
    setBudgetForm({ total: marketingBudget.total, gasto: marketingBudget.gasto });
    setIsBudgetModalOpen(true);
  };

  const handleSaveBudget = () => {
    const updated = { ...marketingBudget, total: budgetForm.total, gasto: budgetForm.gasto };
    setMarketingBudget(updated);
    localStorage.setItem("rama_marketing_budget", JSON.stringify(updated));
    setIsBudgetModalOpen(false);
  };

  const handleConfirmNewMonth = (keepSameBudget) => {
    const newHistory = [...(marketingBudget.history || [])];
    if (marketingBudget.total > 0 || marketingBudget.gasto > 0) {
      newHistory.push({
        month: marketingBudget.currentMonth,
        total: marketingBudget.total,
        gasto: marketingBudget.gasto
      });
    }
    const updated = {
      ...marketingBudget,
      currentMonth: getCurrentMonthStr(),
      total: keepSameBudget ? marketingBudget.total : 0,
      gasto: 0,
      history: newHistory
    };
    delete updated.needsMonthUpdate;
    setMarketingBudget(updated);
    localStorage.setItem("rama_marketing_budget", JSON.stringify(updated));
    // The state setter for isNewMonthPromptOpen is already defined!
    setIsNewMonthPromptOpen(false);
    if (!keepSameBudget) {
      setBudgetForm({ total: 0, gasto: 0 });
      setIsBudgetModalOpen(true);
    }
  };
`;

// Insert the code right before activeTab
if (!content.includes('const handleEditBudget = () => {')) {
    content = content.replace('const [activeTab, setActiveTab]', allHooks + '\n  const [activeTab, setActiveTab]');
}

// NOW WE INJECT THE MODALS!
let modalsHTML = `
      {/* Modals */}
      {isBudgetModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsBudgetModalOpen(false)}></div>
          <div className="bg-[#111] border border-[#222] rounded-2xl p-6 relative z-10 w-full max-w-md shadow-2xl flex flex-col gap-4 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h3 className="text-white font-semibold flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-cyan-400" />
                Orçamento: <span className="capitalize text-cyan-400">{getMonthName(marketingBudget.currentMonth)}</span>
              </h3>
              <button onClick={() => setIsBudgetModalOpen(false)} className="text-gray-500 hover:text-white">x</button>
            </div>
            <div className="space-y-4 mt-2">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-500 mb-1 block">Orçamento (R$)</label>
                  <input type="number" value={budgetForm.total} onChange={e => setBudgetForm({...budgetForm, total: parseInt(e.target.value) || 0})} className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-cyan-500 outline-none" />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-500 mb-1 block">Já Gasto (R$)</label>
                  <input type="number" value={budgetForm.gasto} onChange={e => setBudgetForm({...budgetForm, gasto: parseInt(e.target.value) || 0})} className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-cyan-500 outline-none" />
                </div>
              </div>
            </div>
            <button onClick={handleSaveBudget} className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-sm py-2.5 rounded-lg mt-2 transition-colors">
              Salvar Mês Atual
            </button>
            {marketingBudget.history && marketingBudget.history.length > 0 && (
              <div className="mt-4 pt-4 border-t border-white/10">
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-3 block">Histórico de Meses Anteriores</span>
                <div className="space-y-2">
                  {[...marketingBudget.history].reverse().map((h, i) => (
                    <div key={i} className="flex items-center justify-between bg-black/50 border border-white/5 p-2 rounded-lg">
                      <span className="text-xs font-medium text-gray-300 capitalize">{getMonthName(h.month)}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-gray-400">Gasto: <span className="text-white font-semibold">R$ {h.gasto.toLocaleString('pt-BR')}</span></span>
                        <span className="text-[10px] text-gray-500 bg-white/5 px-1.5 py-0.5 rounded">de R$ {h.total.toLocaleString('pt-BR')}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {isNewMonthPromptOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm"></div>
          <div className="bg-[#111] border border-cyan-500/30 rounded-2xl p-6 relative z-10 w-full max-w-sm shadow-2xl flex flex-col gap-4 text-center">
            <div className="w-12 h-12 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
              <DollarSign className="w-6 h-6 text-cyan-400" />
            </div>
            <h3 className="text-white text-lg font-bold">Novo Mês Detectado!</h3>
            <p className="text-sm text-gray-400">
              Estamos em <strong className="text-cyan-400 capitalize">{getMonthName(getCurrentMonthStr())}</strong>. O mês anterior foi encerrado e salvo no histórico.
            </p>
            <p className="text-xs text-gray-500 bg-white/5 p-3 rounded-lg">
              Você deseja manter o mesmo orçamento de <strong>R$ {marketingBudget.total.toLocaleString('pt-BR')}</strong> para este novo mês, ou deseja definir um novo valor?
            </p>
            <div className="flex flex-col gap-2 mt-4">
              <button onClick={() => handleConfirmNewMonth(true)} className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-sm py-2.5 rounded-lg transition-colors">
                Manter Orçamento
              </button>
              <button onClick={() => handleConfirmNewMonth(false)} className="w-full bg-white/5 hover:bg-white/10 text-white font-bold text-sm py-2.5 rounded-lg transition-colors border border-white/10">
                Definir Novo Orçamento
              </button>
            </div>
          </div>
        </div>
      )}
`;

if (!content.includes('isBudgetModalOpen && (')) {
    content = content.replace('    </div>\n  );\n}', modalsHTML + '\n    </div>\n  );\n}');
}

fs.writeFileSync('src/pages/Marketing.tsx', content, 'utf8');
console.log("Injected marketingBudget, handlers, and Modals!");
