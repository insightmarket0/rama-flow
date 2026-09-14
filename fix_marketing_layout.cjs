const fs = require('fs');
let content = fs.readFileSync('src/pages/Marketing.tsx', 'utf-8');

// 1. Remove TAB 0 from the headers
const headerIdx = content.indexOf('{ id: "cockpit", label: "Visão Analítica", icon: PieChart },');
if (headerIdx !== -1) {
    const endLine = content.indexOf('\\n', headerIdx);
    content = content.substring(0, headerIdx) + content.substring(endLine + 1);
}

// 2. Extract Instagram and TikTok
const instaStart = content.indexOf('{/* INSTAGRAM COMPACTO */}');
const tiktokStart = content.indexOf('{/* TIKTOK COMPACTO */}');
const tiktokEnd = content.indexOf('</ResponsiveContainer>\\n                      </div>\\n                    </div>', tiktokStart);

if (instaStart !== -1 && tiktokStart !== -1 && tiktokEnd !== -1) {
    const instaBlock = content.substring(instaStart, tiktokStart);
    const tiktokBlock = content.substring(tiktokStart, tiktokEnd + 85); // roughly to include the divs
    
    // 3. Remove TAB 0 content block completely
    const tab0Start = content.indexOf('{/* TAB 0: COCKPIT EXECUTIVO */}');
    const tab1Start = content.indexOf('{/* TAB 1: CREATIVE STUDIO (Master-Detail / Notion Style) */}');
    if (tab0Start !== -1 && tab1Start !== -1) {
        content = content.substring(0, tab0Start) + content.substring(tab1Start);
    }
    
    // 4. Replace CPAs and Scaling in TAB 4
    const cpaStart = content.indexOf('<div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-3.5 flex flex-col justify-between relative overflow-hidden group hover:border-white/10 transition-colors">\\n                <div className="flex justify-between mb-1.5">\\n                  <span className="text-gray-500 text-[10px] font-medium tracking-widest uppercase">CPA (Custo Acq.)</span>');
    const tab4End = content.indexOf('</div>\\n\\n            </div>\\n\\n              {/* Pain');
    
    if (cpaStart !== -1 && tab4End !== -1) {
        // Insert Insta and TikTok instead of CPAs and Scaling
        content = content.substring(0, cpaStart) + instaBlock + tiktokBlock + '\\n                ' + content.substring(tab4End);
    }
}

// Ensure activeTab default is orcamento
content = content.replace('useState<"orcamento" | "cockpit" | "roadmap" | "crm" | "performance">("cockpit")', 'useState<"orcamento" | "cockpit" | "roadmap" | "crm" | "performance">("orcamento")');

fs.writeFileSync('src/pages/Marketing.tsx', content, 'utf-8');
console.log('Restored layout!');
