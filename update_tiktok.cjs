const fs = require('fs');
let content = fs.readFileSync('src/pages/Marketing.tsx', 'utf8');

// 1. Add FaTiktok import if missing
if (!content.includes('FaTiktok')) {
  content = content.replace(/(import .*? from "lucide-react";)/, `$1\nimport { FaTiktok } from "react-icons/fa";`);
}

// 2. Replace the TikTok block
const tiktokCard = `
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

// Also replace the icon in the modal!
content = content.replace(/<PlayCircle className="w-4 h-4 text-cyan-400" \/>/, `<FaTiktok className="w-4 h-4 text-cyan-400" />`);

// Safely replace the old TIKTOK COMPACTO block
// I'll find its start and end
const startTag = '{/* TIKTOK COMPACTO */}';
const startIndex = content.indexOf(startTag);
if (startIndex !== -1) {
  // Let's find the closing div of the TikTok card.
  // The TikTok block ends exactly before `</div>\n                  </div>\n                </div>\n          </div>\n            </div>\n          )}\n\n          {/* TAB 1: CREATIVE STUDIO`
  const endTag = '{/* TAB 1: CREATIVE STUDIO';
  const endIndex = content.indexOf(endTag, startIndex);
  
  if (endIndex !== -1) {
     // I need to be careful not to delete the wrapping divs.
     // Let's do a substring replace
     const blockToReplace = content.substring(startIndex, endIndex);
     
     // Wait, the tiktok block starts with `{/* TIKTOK COMPACTO */}` and ends with a bunch of `</div>`.
     // Let's replace only the `<div className="bg-[#0a0a0a] ... flex-col"> ... </div>` part.
     const blockPart = blockToReplace.match(/\{\/\* TIKTOK COMPACTO \*\/\}[\s\S]*?<div className="mt-auto pt-3 border-t border-white\/5">[\s\S]*?<\/div>\s*<\/div>/);
     
     if (blockPart) {
         content = content.replace(blockPart[0], tiktokCard);
         fs.writeFileSync('src/pages/Marketing.tsx', content, 'utf8');
         console.log("Success");
     } else {
         console.log("Regex match failed for blockPart");
     }
  } else {
     console.log("endTag not found");
  }
} else {
  console.log("startTag not found");
}

