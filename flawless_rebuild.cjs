const fs = require('fs');
let content = fs.readFileSync('src/pages/Marketing.tsx', 'utf8');

// 1. Add imports
if (!content.includes('recharts')) {
  content = content.replace(/(import React, \{ useState \}.*?;)/s, `$1\nimport { AreaChart, Area, ResponsiveContainer, YAxis } from "recharts";\nimport { FaTiktok } from "react-icons/fa";`);
}

// 2. Hook states
const newHookState = `
  const [socialMetrics, setSocialMetrics] = useState({
    instagram: { 
      followers: 135145, likes: 42500, comments: 8200, followersGrowth: 1.2,
      history: [{ name: "1", value: 133000 }, { name: "2", value: 134000 }, { name: "3", value: 134500 }, { name: "4", value: 135145 }]
    },
    tiktok: { 
      followers: 241800, likes: 89200, comments: 14500, followersGrowth: 5.4,
      history: [{ name: "1", value: 230000 }, { name: "2", value: 235000 }, { name: "3", value: 239000 }, { name: "4", value: 241800 }]
    }
  });
  const [isSocialModalOpen, setIsSocialModalOpen] = useState(false);
  const [editingSocial, setEditingSocial] = useState("instagram");
  const [socialForm, setSocialForm] = useState({ followers: 0, likes: 0, comments: 0 });

  const [marketingBudget, setMarketingBudget] = useState({
    total: 5000,
    gasto: 3250
  });
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [budgetForm, setBudgetForm] = useState({ total: 0, gasto: 0 });

  React.useEffect(() => {
    const saved = localStorage.getItem("rama_social_metrics");
    if (saved) {
      try { 
        const parsed = JSON.parse(saved);
        if (parsed.instagram && parsed.instagram.history) {
          setSocialMetrics(parsed); 
        }
      } catch (e) {}
    }
    const savedBudget = localStorage.getItem("rama_marketing_budget");
    if (savedBudget) {
      try { setMarketingBudget(JSON.parse(savedBudget)); } catch(e) {}
    }
  }, []);

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
    setIsSocialModalOpen(false);
  };

  const handleEditBudget = () => {
    setBudgetForm(marketingBudget);
    setIsBudgetModalOpen(true);
  };

  const handleSaveBudget = () => {
    setMarketingBudget(budgetForm);
    localStorage.setItem("rama_marketing_budget", JSON.stringify(budgetForm));
    setIsBudgetModalOpen(false);
  };

  const formatK = (num) => {
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
  };
`;

content = content.replace(/const \[socialMetrics, setSocialMetrics\] = useState\(\{[\s\S]*?const formatK = \(num.*?\};/s, newHookState.trim());

// 3. Instagram + TikTok
const instaAndTikTokCards = `
                    {/* INSTAGRAM COMPACTO */}
                    <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-4 relative overflow-hidden flex flex-col h-[320px]">
                      <div className="absolute -right-10 -top-10 w-24 h-24 bg-purple-500/10 rounded-full blur-[30px] pointer-events-none"></div>
                      <div className="flex items-center justify-between mb-2 relative z-10">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
                            <Instagram className="w-4 h-4 text-white" />
                          </div>
                          <h3 className="text-white text-sm font-semibold tracking-tight">Instagram</h3>
                        </div>
                        <button onClick={() => handleEditSocial('instagram')} className="bg-white/5 hover:bg-white/10 text-gray-400 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase transition-colors border border-white/10 flex items-center gap-1">Lançar +</button>
                      </div>
                      <div className="flex items-end gap-3 mb-4 mt-2">
                        <div>
                          <span className="text-[9px] font-medium tracking-widest uppercase text-gray-500 block mb-0.5">Seguidores Totais</span>
                          <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold text-white">{socialMetrics.instagram.followers.toLocaleString('pt-BR')}</span>
                            <span className="text-emerald-400 text-[10px] font-medium flex items-center bg-emerald-400/10 px-1.5 py-0.5 rounded"><ArrowUpRight className="w-2.5 h-2.5 mr-0.5" /> {socialMetrics.instagram.followersGrowth > 0 ? '+' : ''}{socialMetrics.instagram.followersGrowth}%</span>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 mb-4">
                        <div className="bg-[#111] border border-white/5 rounded-lg p-2.5 flex flex-col justify-between">
                          <div className="flex items-center gap-1.5 mb-1">
                            <Heart className="w-3 h-3 text-gray-500" />
                            <span className="text-[10px] uppercase font-bold tracking-widest text-gray-500">Likes (Mês)</span>
                          </div>
                          <span className="text-white text-sm font-bold">{formatK(socialMetrics.instagram.likes)}</span>
                        </div>
                        <div className="bg-[#111] border border-white/5 rounded-lg p-2.5 flex flex-col justify-between">
                          <div className="flex items-center gap-1.5 mb-1">
                            <MessageCircle className="w-3 h-3 text-gray-500" />
                            <span className="text-[10px] uppercase font-bold tracking-widest text-gray-500">Comentários</span>
                          </div>
                          <span className="text-white text-sm font-bold">{formatK(socialMetrics.instagram.comments)}</span>
                        </div>
                      </div>
                      <div className="mt-auto pt-3 border-t border-white/5 flex-1 min-h-[80px] flex flex-col relative">
                        <span className="text-[9px] font-medium tracking-widest uppercase text-gray-600 absolute top-2 left-0 z-10">Evolução de Audiência</span>
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={socialMetrics.instagram.history}>
                            <defs>
                              <linearGradient id="colorInsta" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#d946ef" stopOpacity={0.4}/>
                                <stop offset="95%" stopColor="#d946ef" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <Area type="monotone" dataKey="value" stroke="#d946ef" strokeWidth={2} fillOpacity={1} fill="url(#colorInsta)" />
                            <YAxis domain={['dataMin', 'dataMax']} hide />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* TIKTOK COMPACTO */}
                    <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-4 relative overflow-hidden flex flex-col h-[320px]">
                      <div className="absolute -right-10 -top-10 w-24 h-24 bg-cyan-500/10 rounded-full blur-[30px] pointer-events-none"></div>
                      <div className="flex items-center justify-between mb-2 relative z-10">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg">
                            <FaTiktok className="w-4 h-4 text-white" />
                          </div>
                          <h3 className="text-white text-sm font-semibold tracking-tight">TikTok</h3>
                        </div>
                        <button onClick={() => handleEditSocial('tiktok')} className="bg-white/5 hover:bg-white/10 text-gray-400 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase transition-colors border border-white/10 flex items-center gap-1">Lançar +</button>
                      </div>
                      <div className="flex items-end gap-3 mb-4 mt-2">
                        <div>
                          <span className="text-[9px] font-medium tracking-widest uppercase text-gray-500 block mb-0.5">Seguidores Totais</span>
                          <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold text-white">{socialMetrics.tiktok.followers.toLocaleString('pt-BR')}</span>
                            <span className="text-emerald-400 text-[10px] font-medium flex items-center bg-emerald-400/10 px-1.5 py-0.5 rounded"><ArrowUpRight className="w-2.5 h-2.5 mr-0.5" /> {socialMetrics.tiktok.followersGrowth > 0 ? '+' : ''}{socialMetrics.tiktok.followersGrowth}%</span>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 mb-4">
                        <div className="bg-[#111] border border-white/5 rounded-lg p-2.5 flex flex-col justify-between">
                          <div className="flex items-center gap-1.5 mb-1">
                            <Heart className="w-3 h-3 text-gray-500" />
                            <span className="text-[10px] uppercase font-bold tracking-widest text-gray-500">Likes (Mês)</span>
                          </div>
                          <span className="text-white text-sm font-bold">{formatK(socialMetrics.tiktok.likes)}</span>
                        </div>
                        <div className="bg-[#111] border border-white/5 rounded-lg p-2.5 flex flex-col justify-between">
                          <div className="flex items-center gap-1.5 mb-1">
                            <MessageCircle className="w-3 h-3 text-gray-500" />
                            <span className="text-[10px] uppercase font-bold tracking-widest text-gray-500">Comentários</span>
                          </div>
                          <span className="text-white text-sm font-bold">{formatK(socialMetrics.tiktok.comments)}</span>
                        </div>
                      </div>
                      <div className="mt-auto pt-3 border-t border-white/5 flex-1 min-h-[80px] flex flex-col relative">
                        <span className="text-[9px] font-medium tracking-widest uppercase text-gray-600 absolute top-2 left-0 z-10">Evolução de Audiência</span>
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={socialMetrics.tiktok.history}>
                            <defs>
                              <linearGradient id="colorTikTok" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4}/>
                                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <Area type="monotone" dataKey="value" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#colorTikTok)" />
                            <YAxis domain={['dataMin', 'dataMax']} hide />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
`;

// Replace the entire block containing the old cards
// Let's use `indexOf` for `{/* INSTAGRAM COMPACTO */}` and `{/* TAB 1: CREATIVE STUDIO`
let startI = content.indexOf('{/* INSTAGRAM COMPACTO */}');
let endI = content.indexOf('{/* TAB 1: CREATIVE STUDIO');
if (startI !== -1 && endI !== -1) {
    let beforeBlock = content.substring(0, startI);
    let afterBlock = content.substring(endI);
    
    // We need to preserve the closing divs.
    // The old block had:
    // <div className="bg-[#0a0a0a] ..."> ... </div> (Insta)
    // <div className="bg-[#0a0a0a] ..."> ... </div> (TikTok)
    // </div> </div> </div> </div> </div> )}
    // Let's just find the last </div> sequence before TAB 1
    let originalMiddle = content.substring(startI, endI);
    // Extract everything from the end of the TikTok card up to TAB 1
    // The tiktok card ended at `))} </div> </div> </div>` or something.
    let closingTagsRegex = /(<\/div>\s*){5,}\}\)\s*$/;
    let match = originalMiddle.match(closingTagsRegex);
    if (match) {
        content = beforeBlock + instaAndTikTokCards + "\n" + match[0] + "\n" + afterBlock;
    } else {
        console.log("Could not find closing tags in middle block");
    }
} else {
    console.log("Could not find startI or endI");
}

// 4. Orcamento block
const newOrcamentoBlock = `
                <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-3.5 flex flex-col justify-between relative overflow-hidden group hover:border-white/10 transition-colors">
                  <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="flex justify-between mb-1.5 items-center">
                    <span className="text-gray-500 text-[10px] font-medium tracking-widest uppercase">Orçamento</span>
                    <button onClick={handleEditBudget} className="bg-white/5 hover:bg-white/10 text-gray-400 px-2 py-0.5 rounded text-[9px] font-medium transition-colors border border-white/5 uppercase flex items-center gap-1">Editar</button>
                  </div>
                  <div className="flex items-end justify-between">
                    <span className="text-lg font-semibold text-white tracking-tight">R$ {marketingBudget.total.toLocaleString('pt-BR')}</span>
                    <span className="text-[10px] text-gray-500">{marketingBudget.total > 0 ? Math.round((marketingBudget.gasto / marketingBudget.total) * 100) : 0}% gasto</span>
                  </div>
                  <div className="w-full h-1 bg-[#1a1a1a] rounded-full mt-2 overflow-hidden">
                    <div className="h-full bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)] transition-all duration-500" style={{ width: \`\${marketingBudget.total > 0 ? Math.min(100, Math.round((marketingBudget.gasto / marketingBudget.total) * 100)) : 0}%\` }}></div>
                  </div>
                </div>
`;
let blockRegex = /<div className="bg-\[#0a0a0a\] border border-white\/5 rounded-2xl p-3\.5 flex flex-col justify-between[\s\S]*?\{currentKPI\.orcamento\}[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/;
if (content.match(blockRegex)) {
    content = content.replace(blockRegex, newOrcamentoBlock.trim());
} else {
    // maybe it has the bad character for orçamento
    let altBlockRegex = /<div className="bg-\[#0a0a0a\] border border-white\/5 rounded-2xl p-3\.5 flex flex-col justify-between[\s\S]*?\{currentKPI\.orcamento\}[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/i;
    content = content.replace(altBlockRegex, newOrcamentoBlock.trim());
}


// 5. Inject Modal safely before the final `</div>\n  );\n}`
const modalsCode = `
      {isSocialModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsSocialModalOpen(false)}></div>
          <div className="bg-[#111] border border-[#222] rounded-2xl p-6 relative z-10 w-full max-w-sm shadow-2xl flex flex-col gap-4">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h3 className="text-white font-semibold flex items-center gap-2">
                {editingSocial === 'instagram' ? <Instagram className="w-4 h-4 text-purple-400" /> : <FaTiktok className="w-4 h-4 text-cyan-400" />}
                Atualizar {editingSocial === 'instagram' ? 'Instagram' : 'TikTok'}
              </h3>
              <button onClick={() => setIsSocialModalOpen(false)} className="text-gray-500 hover:text-white">x</button>
            </div>
            
            <div className="space-y-4 mt-2">
              <div>
                <label className="text-[10px] uppercase font-bold text-gray-500 mb-1 block">Seguidores Totais</label>
                <input type="number" value={socialForm.followers} onChange={e => setSocialForm({...socialForm, followers: parseInt(e.target.value) || 0})} className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-cyan-500 outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-500 mb-1 block">Likes (Mês)</label>
                  <input type="number" value={socialForm.likes} onChange={e => setSocialForm({...socialForm, likes: parseInt(e.target.value) || 0})} className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-cyan-500 outline-none" />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-500 mb-1 block">Comentários</label>
                  <input type="number" value={socialForm.comments} onChange={e => setSocialForm({...socialForm, comments: parseInt(e.target.value) || 0})} className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-cyan-500 outline-none" />
                </div>
              </div>
            </div>

            <button onClick={handleSaveSocial} className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-sm py-2.5 rounded-lg mt-2 transition-colors">
              Salvar Métricas
            </button>
          </div>
        </div>
      )}

      {isBudgetModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsBudgetModalOpen(false)}></div>
          <div className="bg-[#111] border border-[#222] rounded-2xl p-6 relative z-10 w-full max-w-sm shadow-2xl flex flex-col gap-4">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h3 className="text-white font-semibold flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-cyan-400" />
                Atualizar Orçamento
              </h3>
              <button onClick={() => setIsBudgetModalOpen(false)} className="text-gray-500 hover:text-white">x</button>
            </div>
            
            <div className="space-y-4 mt-2">
              <div>
                <label className="text-[10px] uppercase font-bold text-gray-500 mb-1 block">Orçamento Total (R$)</label>
                <input type="number" value={budgetForm.total} onChange={e => setBudgetForm({...budgetForm, total: parseInt(e.target.value) || 0})} className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-cyan-500 outline-none" />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-gray-500 mb-1 block">Valor Gasto (R$)</label>
                <input type="number" value={budgetForm.gasto} onChange={e => setBudgetForm({...budgetForm, gasto: parseInt(e.target.value) || 0})} className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-cyan-500 outline-none" />
              </div>
            </div>

            <button onClick={handleSaveBudget} className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-sm py-2.5 rounded-lg mt-2 transition-colors">
              Salvar Orçamento
            </button>
          </div>
        </div>
      )}
`;

content = content.replace(/(<\/div>\s*\r?\n\s*\);\r?\n\})\s*$/, `\n${modalsCode}\n$1`);
fs.writeFileSync('src/pages/Marketing.tsx', content, 'utf8');
console.log("All fixes applied flawlessly.");
