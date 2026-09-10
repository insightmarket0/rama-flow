const fs = require('fs');
let content = fs.readFileSync('src/pages/Marketing.tsx', 'utf8');

// 1. Update socialMetrics to include history arrays
const oldSocialMetrics = `const [socialMetrics, setSocialMetrics] = useState({
    instagram: { followers: 135145, likes: 42500, comments: 8200, followersGrowth: 1.2 },
    tiktok: { followers: 241800, likes: 89200, comments: 14500, followersGrowth: 5.4 }
  });`;

const newSocialMetrics = `const [socialMetrics, setSocialMetrics] = useState({
    instagram: { followers: 135145, likes: 42500, comments: 8200, followersGrowth: 1.2, history: [{name:"M-4", value: 120000}, {name:"M-3", value: 125000}, {name:"M-2", value: 130000}, {name:"M-1", value: 135145}] },
    tiktok: { followers: 241800, likes: 89200, comments: 14500, followersGrowth: 5.4, history: [{name:"M-4", value: 190000}, {name:"M-3", value: 210000}, {name:"M-2", value: 230000}, {name:"M-1", value: 241800}] }
  });`;

content = content.replace(oldSocialMetrics, newSocialMetrics);

// 2. Inject Social Modal JSX at the end, right before the closing tags
const socialModalCode = `
      {isSocialModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsSocialModalOpen(false)}></div>
          <div className="bg-[#111] border border-[#222] rounded-2xl p-6 relative z-10 w-full max-w-sm shadow-2xl flex flex-col gap-4">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h3 className="text-white font-semibold flex items-center gap-2 capitalize">
                {editingSocial === 'instagram' ? <Instagram className="w-4 h-4 text-purple-400" /> : <FaTiktok className="w-4 h-4 text-cyan-400" />}
                Editar {editingSocial}
              </h3>
              <button onClick={() => setIsSocialModalOpen(false)} className="text-gray-500 hover:text-white">x</button>
            </div>
            <div className="space-y-4 mt-2">
              <div>
                <label className="text-[10px] uppercase font-bold text-gray-500 mb-1 block">Seguidores</label>
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
`;

if (!content.includes('isSocialModalOpen && (')) {
    content = content.replace('    </div>\n  );\n}', socialModalCode + '\n    </div>\n  );\n}');
}

fs.writeFileSync('src/pages/Marketing.tsx', content, 'utf8');
console.log("Updated social metrics and injected modal!");
