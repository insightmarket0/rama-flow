
const fs = require("fs");
let content = fs.readFileSync("src/pages/Marketing.tsx", "utf-8");

// 1. Remove TAB 0 from the headers
const headerIdx = content.indexOf("{ id: \"cockpit\", label: \"Visão Analítica\", icon: PieChart },");
if (headerIdx !== -1) {
    const endLine = content.indexOf("\\n", headerIdx);
    content = content.substring(0, headerIdx) + content.substring(endLine + 1);
}

// 2. Extract Instagram and TikTok WITHOUT extra closing divs
const instaStart = content.indexOf("{/* INSTAGRAM COMPACTO */}");
const tiktokStart = content.indexOf("{/* TIKTOK COMPACTO */}");
const tiktokEndRaw = content.indexOf("</ResponsiveContainer>", tiktokStart);

if (instaStart !== -1 && tiktokStart !== -1 && tiktokEndRaw !== -1) {
    let insta = content.substring(instaStart, tiktokStart);
    
    // Find the end of TikTok card cleanly (two closing divs after ResponsiveContainer)
    let endDiv1 = content.indexOf("</div>", tiktokEndRaw);
    let endDiv2 = content.indexOf("</div>", endDiv1 + 1);
    
    let tiktok = content.substring(tiktokStart, endDiv2 + 6);
    
    // 3. Remove TAB 0 content block completely
    const tab0Start = content.indexOf("{/* TAB 0: COCKPIT EXECUTIVO */}");
    const tab1Start = content.indexOf("{/* TAB 1: CREATIVE STUDIO (Master-Detail / Notion Style) */}");
    if (tab0Start !== -1 && tab1Start !== -1) {
        content = content.substring(0, tab0Start) + content.substring(tab1Start);
    }
    
    // 4. Find CPAs and Scaling in TAB 4
    const cpaTextIdx = content.indexOf("CPA (Custo Acq.)");
    if (cpaTextIdx !== -1) {
        let cpaStart = content.lastIndexOf("<div className=\"bg-[#0a0a0a]", cpaTextIdx);
        const paineis = content.indexOf("{/* Pain");
        
        if (cpaStart !== -1 && paineis !== -1) {
            // Find the end of Modo Scaling (which ends just before Painéis)
            // But wait, there is ONE closing div before Painéis that closes the grid!
            // Let us find the end of Modo Scaling safely by finding the </div></div></div> of scaling
            let scalingStart = content.indexOf("setIsScalingActive");
            let scalingBlockEnd = content.indexOf("</div>\\n                </div>\\n\\n            </div>", scalingStart);
            if (scalingBlockEnd !== -1) {
                // The replacement should be from cpaStart to scalingBlockEnd + 34 (which is before the closing grid div)
                let actualEnd = content.indexOf("</div>", scalingBlockEnd + 10);
                content = content.substring(0, cpaStart) + insta + tiktok + "\\n" + content.substring(actualEnd + 6);
            }
        }
    }
}

// Ensure activeTab default is orcamento
content = content.replace("useState<\"orcamento\" | \"cockpit\" | \"roadmap\" | \"crm\" | \"performance\">(\"cockpit\")", "useState<\"orcamento\" | \"cockpit\" | \"roadmap\" | \"crm\" | \"performance\">(\"orcamento\")");

fs.writeFileSync("src/pages/Marketing.tsx", content, "utf-8");
console.log("Successfully migrated social cards perfectly!");

