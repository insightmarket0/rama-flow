const fs = require('fs');
let content = fs.readFileSync('src/pages/Marketing.tsx', 'utf8');

// 1. Add hook states inside the component
const hookCode = `
  const [socialMetrics, setSocialMetrics] = useState({
    instagram: { followers: 135145, likes: 42500, comments: 8200, followersGrowth: 1.2 },
    tiktok: { followers: 241800, likes: 89200, comments: 14500, followersGrowth: 5.4 }
  });
  const [isSocialModalOpen, setIsSocialModalOpen] = useState(false);
  const [editingSocial, setEditingSocial] = useState("instagram");
  const [socialForm, setSocialForm] = useState({ followers: 0, likes: 0, comments: 0 });

  React.useEffect(() => {
    const saved = localStorage.getItem("rama_social_metrics");
    if (saved) {
      try { setSocialMetrics(JSON.parse(saved)); } catch (e) {}
    }
  }, []);

  const handleEditSocial = (platform) => {
    setEditingSocial(platform);
    setSocialForm(socialMetrics[platform]);
    setIsSocialModalOpen(true);
  };

  const handleSaveSocial = () => {
    const oldFollowers = socialMetrics[editingSocial].followers;
    let growth = 0;
    if (oldFollowers > 0 && socialForm.followers !== oldFollowers) {
      growth = (((socialForm.followers - oldFollowers) / oldFollowers) * 100);
    } else {
      growth = socialMetrics[editingSocial].followersGrowth; // keep old if no change
    }
    const updated = {
      ...socialMetrics,
      [editingSocial]: {
        ...socialForm,
        followersGrowth: parseFloat(Number(growth).toFixed(1))
      }
    };
    setSocialMetrics(updated);
    localStorage.setItem("rama_social_metrics", JSON.stringify(updated));
    setIsSocialModalOpen(false);
  };

  const formatK = (num) => {
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
  };
`;

content = content.replace(/(export default function Marketing\(\) \{)/, `$1\n${hookCode}`);

// 2. Add Modal to the bottom
const modalCode = `
      {isSocialModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsSocialModalOpen(false)}></div>
          <div className="bg-[#111] border border-[#222] rounded-2xl p-6 relative z-10 w-full max-w-sm shadow-2xl flex flex-col gap-4">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h3 className="text-white font-semibold flex items-center gap-2">
                {editingSocial === 'instagram' ? <Instagram className="w-4 h-4 text-purple-400" /> : <PlayCircle className="w-4 h-4 text-cyan-400" />}
                Atualizar {editingSocial === 'instagram' ? 'Instagram' : 'TikTok'}
              </h3>
              <button onClick={() => setIsSocialModalOpen(false)} className="text-gray-500 hover:text-white"><X className="w-4 h-4" /></button>
            </div>
            
            <div className="space-y-4 mt-2">
              <div>
                <label className="text-[10px] uppercase font-bold text-gray-500 mb-1 block">Seguidores</label>
                <input type="number" value={socialForm.followers} onChange={e => setSocialForm({...socialForm, followers: parseInt(e.target.value) || 0})} className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-cyan-500 outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-500 mb-1 block">Likes</label>
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
`;

content = content.replace(/(<\/div>\s*)$/, `${modalCode}\n$1`);

// 3. Replace Instagram card static values
content = content.replace(/135\.145/, `{socialMetrics.instagram.followers.toLocaleString('pt-BR')}`);
content = content.replace(/1\.2%/, `{socialMetrics.instagram.followersGrowth > 0 ? '+' : ''}{socialMetrics.instagram.followersGrowth}%`);
content = content.replace(/>42\.5K</, `>{formatK(socialMetrics.instagram.likes)}<`);
content = content.replace(/>8\.2K</, `>{formatK(socialMetrics.instagram.comments)}<`);

// 4. Replace TikTok card static values
content = content.replace(/241\.800/, `{socialMetrics.tiktok.followers.toLocaleString('pt-BR')}`);
content = content.replace(/5\.4%/, `{socialMetrics.tiktok.followersGrowth > 0 ? '+' : ''}{socialMetrics.tiktok.followersGrowth}%`);
content = content.replace(/>89\.2K</, `>{formatK(socialMetrics.tiktok.likes)}<`);
content = content.replace(/>14\.5K</, `>{formatK(socialMetrics.tiktok.comments)}<`);

// 5. Add "Atualizar" buttons next to "Últimos 7 dias"
content = content.replace(/(<span className="text-\[10px\] text-gray-500">Últimos 7 dias<\/span>)/g, `$1\n                        <button onClick={() => handleEditSocial( 'INSTA_OR_TIK' )} className="bg-white/5 hover:bg-white/10 text-gray-400 px-2 py-1 rounded text-[9px] font-medium transition-colors border border-white/5 ml-2">Atualizar</button>`);

// Fix the 'INSTA_OR_TIK' manually
content = content.replace(/handleEditSocial\( 'INSTA_OR_TIK' \)/, `handleEditSocial('instagram')`);
content = content.replace(/handleEditSocial\( 'INSTA_OR_TIK' \)/, `handleEditSocial('tiktok')`);

// add Edit2 import if missing, but we don't strictly need the icon since it's just text "Atualizar"
fs.writeFileSync('src/pages/Marketing.tsx', content, 'utf8');
console.log("Done patching.");
