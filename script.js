const fs = require('fs');
const content = fs.readFileSync('src/pages/Marketing.tsx', 'utf-8');

// Find the cockpit block content we want to move
const cockpitBlockRegex = /\{\/\* INSTAGRAM COMPACTO \*\/\}([\s\S]*?)\{\/\* TIKTOK COMPACTO \*\/\}([\s\S]*?)<\/AreaChart>\s*<\/ResponsiveContainer>\s*<\/div>\s*<\/div>/;
const match = content.match(cockpitBlockRegex);
if (!match) {
    console.log('Block not found');
    process.exit(1);
}
const extractedBlock = '{/* INSTAGRAM COMPACTO */}' + match[1] + '{/* TIKTOK COMPACTO */}' + match[2] + '</AreaChart>\n                        </ResponsiveContainer>\n                      </div>\n                    </div>';

// Find the entire activeTab === "cockpit" block to remove
const cockpitTabRegex = /\{\/\* TAB 0: COCKPIT EXECUTIVO \*\/\}\s*\{activeTab === "cockpit" && \([\s\S]*?\{\/\* TIKTOK COMPACTO \*\/\}[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*\)\}\s*/;
let newContent = content.replace(cockpitTabRegex, '');

// Find where to inject it in Orcamento tab (before Painéis Corporativos)
const targetRegex = /(<\/div>\s*)(?=\{\/\* Pain?is Corporativos \*\/\})/;
const injection = <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">\n\n</div>\n\n;

newContent = newContent.replace(targetRegex, '' + injection);

// Also remove "cockpit" from TABS array
newContent = newContent.replace(/\{\s*id:\s*"cockpit",\s*label:\s*"Visuo Analtica"\s*\},\s*/, '');
// Change activeTab initial state to orcamento
newContent = newContent.replace(/useState<"orcamento" \| "cockpit" \| "roadmap" \| "crm" \| "performance">\\("cockpit"\\)/, 'useState<"orcamento" | "cockpit" | "roadmap" | "crm" | "performance">("orcamento")');

fs.writeFileSync('src/pages/Marketing.tsx', newContent, 'utf-8');
console.log('Done');
