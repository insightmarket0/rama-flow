const fs = require('fs');
let content = fs.readFileSync('src/pages/Marketing.tsx', 'utf8');

const hookUpdates = `
  const [isScalingActive, setIsScalingActive] = useState(false);
  const [isNewMonthPromptOpen, setIsNewMonthPromptOpen] = useState(false);
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

  const handleSplitChange = (key, newValue) => {
    const currentSplit = marketingBudget.budgetSplit || { trafego: 60, influenciadores: 25, seeding: 15 };
    const oldVal = currentSplit[key];
    let delta = newValue - oldVal;
    
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
`;

if (!content.includes('const handleCreateApproval = () => {')) {
    content = content.replace('export default function Marketing() {', 'export default function Marketing() {\n' + hookUpdates);
    fs.writeFileSync('src/pages/Marketing.tsx', content, 'utf8');
    console.log("Hooks REALLY injected correctly!");
} else {
    console.log("Hooks already exist!");
}
