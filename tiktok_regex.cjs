const fs = require('fs');
let content = fs.readFileSync('src/pages/Marketing.tsx', 'utf8');

const newTiktokCard = `
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
                    </div>`;

let tiktokBlockRegex = /\{\/\* TIKTOK COMPACTO \*\/\}[\s\S]*?growth: "\+4%" \}\r?\n\s*\]\.map\(\(post, i\) => \([\s\S]*?\}\)\)\r?\n\s*<\/div>\r?\n\s*<\/div>\r?\n\s*<\/div>/;

if (tiktokBlockRegex.test(content)) {
    content = content.replace(tiktokBlockRegex, newTiktokCard);
    
    // Check if FaTiktok is imported
    if (!content.includes('FaTiktok')) {
        content = content.replace(/(import .*? from "lucide-react";)/, `$1\nimport { FaTiktok } from "react-icons/fa";`);
    }

    fs.writeFileSync('src/pages/Marketing.tsx', content, 'utf8');
    console.log("Success! TikTok matched.");
} else {
    console.log("Still failed to match.");
}
