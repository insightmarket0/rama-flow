const fs = require('fs');
const file = 'src/pages/Marketing.tsx';
let content = fs.readFileSync(file, 'utf8');

const regex = /<span className="text-\[10px\] font-medium tracking-widest uppercase text-gray-500 mb-2 block">Top Posts \(Alcance\)<\/span>[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<\/div>/g;

const replaceWith = `<div className="mt-4 pt-4 border-t border-white/5">
                        <span className="text-[10px] font-medium tracking-widest uppercase text-gray-500 mb-3 block">Top Posts (Alcance)</span>
                        <div className="space-y-2.5">
                          {[
                            { title: "Bastidores da Instalação", views: "120K", growth: "+15%" },
                            { title: "Dica de Fixação", views: "95K", growth: "+8%" },
                            { title: "Nova Coleção", views: "88K", growth: "+5%" }
                          ].map((post, i) => (
                            <div key={i} className="flex items-center justify-between group cursor-pointer">
                              <div className="flex items-center gap-2.5">
                                <div className="w-7 h-7 bg-[#1a1a1a] rounded border border-white/5 flex items-center justify-center overflow-hidden shrink-0">
                                  <ImageIcon className="w-3.5 h-3.5 text-gray-600 group-hover:text-white transition-colors" />
                                </div>
                                <span className="text-xs text-gray-400 group-hover:text-gray-200 transition-colors truncate max-w-[120px]">{post.title}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] text-emerald-400 font-medium">{post.growth}</span>
                                <span className="text-xs font-semibold text-white">{post.views}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>`;

content = content.replace(regex, replaceWith);
fs.writeFileSync(file, content, 'utf8');
console.log('Done');
