const fs = require('fs');
const file = 'src/pages/Marketing.tsx';
let content = fs.readFileSync(file, 'utf8');

const regex = /\{\/\* Social Media Tracker \(Direita, 4 colunas\) \*\/\}[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<\/div>/;

const sleekTrackers = `                {/* Social Media & TikTok Trackers (Compactos) */}
                <div className="col-span-12 lg:col-span-8 flex flex-col gap-4 mt-2">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* INSTAGRAM COMPACTO */}
                    <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-4 relative overflow-hidden flex flex-col">
                      <div className="absolute -right-10 -top-10 w-24 h-24 bg-purple-500/10 rounded-full blur-[30px] pointer-events-none"></div>
                      <div className="flex items-center justify-between mb-4 relative z-10">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
                            <Instagram className="w-4 h-4 text-white" />
                          </div>
                          <h3 className="text-white text-sm font-semibold tracking-tight">Instagram</h3>
                        </div>
                        <span className="text-[10px] text-gray-500">Últimos 7 dias</span>
                      </div>
                      
                      <div className="flex items-end gap-3 mb-4">
                        <div>
                          <span className="text-[9px] font-medium tracking-widest uppercase text-gray-500 block mb-0.5">Seguidores</span>
                          <div className="flex items-center gap-2">
                            <span className="text-xl font-bold text-white">135.145</span>
                            <span className="text-emerald-400 text-[10px] font-medium flex items-center bg-emerald-400/10 px-1.5 py-0.5 rounded"><ArrowUpRight className="w-2.5 h-2.5 mr-0.5" /> 1.2%</span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 mb-4">
                        <div className="bg-[#111] border border-white/5 rounded-lg p-2 flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <Heart className="w-3 h-3 text-gray-500" />
                            <span className="text-[10px] text-gray-400">Likes</span>
                          </div>
                          <span className="text-white text-xs font-medium">42.5K</span>
                        </div>
                        <div className="bg-[#111] border border-white/5 rounded-lg p-2 flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <MessageCircle className="w-3 h-3 text-gray-500" />
                            <span className="text-[10px] text-gray-400">Coment.</span>
                          </div>
                          <span className="text-white text-xs font-medium">8.2K</span>
                        </div>
                      </div>

                      <div className="mt-auto pt-3 border-t border-white/5">
                        <span className="text-[9px] font-medium tracking-widest uppercase text-gray-500 mb-2 block">Top Posts (Alcance)</span>
                        <div className="space-y-2">
                          {[
                            { title: "Bastidores da Instalação", views: "120K", growth: "+15%" },
                            { title: "Dica de Fixação", views: "95K", growth: "+8%" }
                          ].map((post, i) => (
                            <div key={i} className="flex items-center justify-between group cursor-pointer hover:bg-white/5 p-1 -mx-1 rounded transition-colors">
                              <div className="flex items-center gap-2.5">
                                <div className="w-6 h-6 bg-[#1a1a1a] rounded border border-white/5 flex items-center justify-center shrink-0">
                                  <ImageIcon className="w-3 h-3 text-gray-600 group-hover:text-white transition-colors" />
                                </div>
                                <span className="text-[11px] text-gray-400 group-hover:text-gray-200 transition-colors truncate max-w-[100px]">{post.title}</span>
                              </div>
                              <span className="text-[10px] font-semibold text-white">{post.views}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* TIKTOK COMPACTO */}
                    <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-4 relative overflow-hidden flex flex-col">
                      <div className="absolute -right-10 -top-10 w-24 h-24 bg-cyan-500/10 rounded-full blur-[30px] pointer-events-none"></div>
                      <div className="flex items-center justify-between mb-4 relative z-10">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg">
                            <PlayCircle className="w-4 h-4 text-white" />
                          </div>
                          <h3 className="text-white text-sm font-semibold tracking-tight">TikTok</h3>
                        </div>
                        <span className="text-[10px] text-gray-500">Últimos 7 dias</span>
                      </div>
                      
                      <div className="flex items-end gap-3 mb-4">
                        <div>
                          <span className="text-[9px] font-medium tracking-widest uppercase text-gray-500 block mb-0.5">Seguidores</span>
                          <div className="flex items-center gap-2">
                            <span className="text-xl font-bold text-white">241.800</span>
                            <span className="text-emerald-400 text-[10px] font-medium flex items-center bg-emerald-400/10 px-1.5 py-0.5 rounded"><ArrowUpRight className="w-2.5 h-2.5 mr-0.5" /> 5.4%</span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 mb-4">
                        <div className="bg-[#111] border border-white/5 rounded-lg p-2 flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <Heart className="w-3 h-3 text-gray-500" />
                            <span className="text-[10px] text-gray-400">Likes</span>
                          </div>
                          <span className="text-white text-xs font-medium">89.2K</span>
                        </div>
                        <div className="bg-[#111] border border-white/5 rounded-lg p-2 flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <MessageCircle className="w-3 h-3 text-gray-500" />
                            <span className="text-[10px] text-gray-400">Coment.</span>
                          </div>
                          <span className="text-white text-xs font-medium">14.5K</span>
                        </div>
                      </div>

                      <div className="mt-auto pt-3 border-t border-white/5">
                        <span className="text-[9px] font-medium tracking-widest uppercase text-gray-500 mb-2 block">Top Videos (Views)</span>
                        <div className="space-y-2">
                          {[
                            { title: "Review da Cadeira", views: "340K", growth: "+15%" },
                            { title: "Como montar em 5 min", views: "210K", growth: "+8%" }
                          ].map((post, i) => (
                            <div key={i} className="flex items-center justify-between group cursor-pointer hover:bg-white/5 p-1 -mx-1 rounded transition-colors">
                              <div className="flex items-center gap-2.5">
                                <div className="w-6 h-6 bg-[#1a1a1a] rounded border border-white/5 flex items-center justify-center shrink-0">
                                  <FileVideo className="w-3 h-3 text-gray-600 group-hover:text-white transition-colors" />
                                </div>
                                <span className="text-[11px] text-gray-400 group-hover:text-gray-200 transition-colors truncate max-w-[100px]">{post.title}</span>
                              </div>
                              <span className="text-[10px] font-semibold text-white">{post.views}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>`;

content = content.replace(regex, sleekTrackers);
fs.writeFileSync(file, content, 'utf8');
console.log('Trackers compacted!');
