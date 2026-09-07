const fs = require('fs');
const file = 'src/pages/Marketing.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Fix missing CRM closing div
const crmEnd = `                </table>
              </div>
            </div>
          )}`;
const crmEndFix = `                </table>
              </div>
            </div>
            </div>
          )}`;
content = content.replace(crmEnd, crmEndFix);

// 2. Move Radar Logístico and Termômetro to Performance
const blockStart = content.indexOf('{/* Radar Logístico (Esquerda, 4 colunas) */}');
const blockEnd = content.indexOf('{/* --- NOVA LINHA DO COCKPIT --- */}');

const radarAndTerm = content.substring(blockStart, blockEnd);

content = content.substring(0, blockStart) + content.substring(blockEnd);

const perfStart = content.indexOf('{/* TAB 3: PERFORMANCE */}\n          {activeTab === "performance" && (\n            <div className="flex-1 flex flex-col gap-3 min-h-0">');
if (perfStart !== -1) {
  const insertPos = perfStart + '{/* TAB 3: PERFORMANCE */}\n          {activeTab === "performance" && (\n            <div className="flex-1 flex flex-col gap-3 min-h-0">'.length;
  const wrapped = `\n              <div className="grid grid-cols-12 gap-4 shrink-0 mb-3">\n` + radarAndTerm + `\n              </div>\n`;
  content = content.substring(0, insertPos) + wrapped + content.substring(insertPos);
}

// 3. Make Instagram compact and duplicate to TikTok
const instaStart = content.indexOf('{/* Social Media Tracker (Direita, 4 colunas) */}');
const instaEndRegex = /<span className="text-\[10px\] font-medium tracking-widest uppercase text-gray-500 mb-2 block">Top Posts \(Alcance\)<\/span>[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<\/div>/;
const match = instaEndRegex.exec(content);

if (match) {
  const instaEndIdx = match.index + match[0].length;
  let instaBlock = content.substring(instaStart, instaEndIdx);
  
  // Compact Top Posts
  const topPostsRegex = /<span className="text-\[10px\] font-medium tracking-widest uppercase text-gray-500 mb-2 block">Top Posts \(Alcance\)<\/span>[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<\/div>/;
  const sleekTopPosts = `<div className="mt-4 pt-4 border-t border-white/5">
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
  
  instaBlock = instaBlock.replace(topPostsRegex, sleekTopPosts);
  instaBlock = instaBlock.replace('lg:col-span-4', 'lg:col-span-6');
  
  let tiktokBlock = instaBlock
    .replace('{/* Social Media Tracker (Direita, 4 colunas) */}', '{/* TikTok Tracker */}')
    .replace('Instagram Performance', 'TikTok Performance')
    .replace('<Instagram ', '<PlayCircle ')
    .replace('from-purple-500 to-pink-500', 'from-cyan-500 to-blue-500')
    .replace('bg-purple-500/10', 'bg-cyan-500/10')
    .replace('135.145', '241.800')
    .replace('42.5K', '89.2K')
    .replace('8.2K', '14.5K');
    
  content = content.substring(0, instaStart) + instaBlock + '\n' + tiktokBlock + content.substring(instaEndIdx);
}

fs.writeFileSync(file, content, 'utf8');
console.log('Marketing.tsx reconstructed!');
