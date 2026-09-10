const fs = require('fs');
let content = fs.readFileSync('src/pages/Marketing.tsx', 'utf8');

// The original file only has:
// const [socialMetrics, setSocialMetrics] = useState({...})
// We just insert our new state block after it.

const hookState = `
  const getCurrentMonthStr = () => {
    const d = new Date();
    return \`\${d.getMonth() + 1}/\${d.getFullYear()}\`;
  };

  const getMonthName = (monthStr) => {
    if (!monthStr) return "";
    const [m, y] = monthStr.split('/');
    const date = new Date(parseInt(y), parseInt(m) - 1, 1);
    return date.toLocaleString('pt-BR', { month: 'long', year: 'numeric' });
  };

  const [marketingBudget, setMarketingBudget] = useState({
    currentMonth: getCurrentMonthStr(),
    total: 5000,
    gasto: 3250,
    vendas: 0,
    vendasGrowth: 0,
    budgetSplit: { trafego: 60, influenciadores: 25, seeding: 15 },
    history: []
  });
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [isNewMonthPromptOpen, setIsNewMonthPromptOpen] = useState(false);
  const [budgetForm, setBudgetForm] = useState({ total: 0, gasto: 0 });
  const [isSalesModalOpen, setIsSalesModalOpen] = useState(false);
  const [salesForm, setSalesForm] = useState({ vendas: 0, vendasGrowth: 0 });
  const [isScalingActive, setIsScalingActive] = useState(false);

  const [approvals, setApprovals] = useState([
    { id: 1, title: 'Cachê Extra: Virgínia', campaign: 'Campanha Black Friday', amount: 15000, description: 'Cachê adicional aprovado em reunião com diretoria para fechar 3 stories e 1 reel.' },
    { id: 2, title: 'Boost Meta Ads', campaign: 'Escala de Criativo #04', amount: 5000, description: 'Injeção de verba para escalar criativo validado com ROAS > 4.' }
  ]);
  const [isCreateApprovalModalOpen, setIsCreateApprovalModalOpen] = useState(false);
  const [approvalForm, setApprovalForm] = useState({ title: '', campaign: '', amount: 0, description: '' });
  const [approvalDetails, setApprovalDetails] = useState(null);

  const handleEditSales = () => {
    setSalesForm({ vendas: marketingBudget.vendas || 0, vendasGrowth: marketingBudget.vendasGrowth || 0 });
    setIsSalesModalOpen(true);
  };

  const handleSaveSales = () => {
    const updated = { ...marketingBudget, vendas: salesForm.vendas, vendasGrowth: salesForm.vendasGrowth };
    setMarketingBudget(updated);
    localStorage.setItem("rama_marketing_budget", JSON.stringify(updated));
    setIsSalesModalOpen(false);
  };

  const handleSplitChange = (key, newValue) => {
    const currentSplit = marketingBudget.budgetSplit || { trafego: 60, influenciadores: 25, seeding: 15 };
    const oldVal = currentSplit[key];
    
    if (newValue > 100) newValue = 100;
    if (newValue < 0) newValue = 0;
    
    const others = ['trafego', 'influenciadores', 'seeding'].filter(k => k !== key);
    const otherTotal = currentSplit[others[0]] + currentSplit[others[1]];

    let newForm = { ...currentSplit, [key]: newValue };

    if (otherTotal === 0) {
       const remainder = 100 - newValue;
       newForm[others[0]] = Math.round(remainder / 2);
       newForm[others[1]] = remainder - newForm[others[0]];
    } else {
       const remainder = 100 - newValue;
       let val0 = Math.round((currentSplit[others[0]] / otherTotal) * remainder);
       let val1 = remainder - val0;
       newForm[others[0]] = val0;
       newForm[others[1]] = val1;
    }
    
    const updated = { ...marketingBudget, budgetSplit: newForm };
    setMarketingBudget(updated);
    localStorage.setItem("rama_marketing_budget", JSON.stringify(updated));
  };

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
    const newHistory = [...(marketingBudget.history || []), { 
      month: marketingBudget.currentMonth, 
      total: marketingBudget.total, 
      gasto: marketingBudget.gasto,
      vendas: marketingBudget.vendas || 0
    }];
    
    const updated = {
      currentMonth: getCurrentMonthStr(),
      total: keepSameBudget ? marketingBudget.total : 0,
      gasto: 0,
      vendas: 0,
      vendasGrowth: 0,
      budgetSplit: marketingBudget.budgetSplit,
      history: newHistory
    };
    
    setMarketingBudget(updated);
    localStorage.setItem("rama_marketing_budget", JSON.stringify(updated));
    setIsNewMonthPromptOpen(false);
    
    if (!keepSameBudget) {
      setBudgetForm({ total: 0, gasto: 0 });
      setIsBudgetModalOpen(true);
    }
  };

  const [isSocialModalOpen, setIsSocialModalOpen] = useState(false);
  const [editingSocial, setEditingSocial] = useState("instagram");
  const [socialForm, setSocialForm] = useState({ followers: 0, likes: 0, comments: 0 });

  const handleEditSocial = (platform) => {
    setEditingSocial(platform);
    setSocialForm({
      followers: socialMetrics[platform].followers,
      likes: socialMetrics[platform].likes,
      comments: socialMetrics[platform].comments
    });
    setIsSocialModalOpen(true);
  };

  const handleSaveSocial = () => {
    const oldFollowers = socialMetrics[editingSocial].followers;
    let growth = 0;
    if (oldFollowers > 0 && socialForm.followers !== oldFollowers) {
      growth = (((socialForm.followers - oldFollowers) / oldFollowers) * 100);
    } else {
      growth = socialMetrics[editingSocial].followersGrowth; 
    }
    const newHistory = [...socialMetrics[editingSocial].history, { name: "Novo", value: socialForm.followers }];
    if (newHistory.length > 10) newHistory.shift();

    const updated = {
      ...socialMetrics,
      [editingSocial]: {
        ...socialForm,
        followersGrowth: parseFloat(Number(growth).toFixed(1)),
        history: newHistory
      }
    };
    setSocialMetrics(updated);
    localStorage.setItem("rama_social_metrics", JSON.stringify(updated));
    setIsSocialModalOpen(true);
    // wait, modal false
    setIsSocialModalOpen(false);
  };
`;

let targetIdx = content.indexOf('const formatK = (num) => {');
if (targetIdx !== -1) {
    // We insert it right before formatK
    content = content.substring(0, targetIdx) + hookState + '\n\n  ' + content.substring(targetIdx);
}

// Then we update useEffect:
const useEffectUpdate = `
  React.useEffect(() => {
    const saved = localStorage.getItem("rama_social_metrics");
    if (saved) {
      try { 
        const parsed = JSON.parse(saved);
        if (parsed.instagram && parsed.instagram.history) setSocialMetrics(parsed); 
      } catch (e) {}
    }

    const savedBudget = localStorage.getItem("rama_marketing_budget");
    let currentData = { currentMonth: getCurrentMonthStr(), total: 5000, gasto: 3250, vendas: 0, vendasGrowth: 0, budgetSplit: { trafego: 60, influenciadores: 25, seeding: 15 }, history: [] };
    if (savedBudget) {
      try { 
        const parsed = JSON.parse(savedBudget);
        if (parsed.currentMonth) currentData = parsed;
      } catch(e) {}
    }

    const todayMonth = getCurrentMonthStr();
    if (currentData.currentMonth !== todayMonth) {
      setMarketingBudget(currentData);
      setIsNewMonthPromptOpen(true);
    } else {
      setMarketingBudget(currentData);
    }

    const savedApprovals = localStorage.getItem("rama_approvals");
    if (savedApprovals) {
      try { setApprovals(JSON.parse(savedApprovals)); } catch(e){}
    }
  }, []);
`;

// Replace existing useEffect if any
let ueStart = content.indexOf('React.useEffect(() => {');
let ueEnd = content.indexOf('}, []);', ueStart) + 7;
if (ueStart !== -1) {
    content = content.substring(0, ueStart) + useEffectUpdate + content.substring(ueEnd);
}

fs.writeFileSync('src/pages/Marketing.tsx', content, 'utf8');
