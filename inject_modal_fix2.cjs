const fs = require('fs');
let content = fs.readFileSync('src/pages/Marketing.tsx', 'utf8');

// remove the badly placed modal
content = content.replace(/\{isSocialModalOpen && \([\s\S]*?\)\}\s*\r?\n\s*\);\r?\n\}/, ");\n}");

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
`;

// Inject before the last </div> before );
content = content.replace(/(<\/div>\s*\r?\n\s*\);\r?\n\})/, `\n${modalCode}\n$1`);
fs.writeFileSync('src/pages/Marketing.tsx', content, 'utf8');
console.log("Fixed");
