
const fs = require("fs");
let content = fs.readFileSync("src/pages/Marketing.tsx", "utf-8");

const headerRegex = /\{\s*id: "cockpit", label: "Visão Analítica", icon: PieChart\s*\},\s*/;
content = content.replace(headerRegex, "");

const tab0Regex = /\{\/\* TAB 0: COCKPIT EXECUTIVO \*\/\}[\s\S]*?\{\/\* TAB 1: CREATIVE STUDIO \(Master-Detail \/ Notion Style\) \*\/\}/;
const match0 = content.match(tab0Regex);
if (match0) {
    let block = match0[0];
    let instaRegex = /\{\/\* INSTAGRAM COMPACTO \*\/\}[\s\S]*?\{\/\* TIKTOK COMPACTO \*\/\}/;
    let tikTokRegex = /\{\/\* TIKTOK COMPACTO \*\/\}[\s\S]*?<\/ResponsiveContainer>\s*<\/div>\s*<\/div>/;
    
    let instaMatch = block.match(instaRegex);
    let tikTokMatch = block.match(tikTokRegex);
    
    if (instaMatch && tikTokMatch) {
        let insta = instaMatch[0].replace("{/* TIKTOK COMPACTO */}", "");
        let tiktok = tikTokMatch[0];
        
        content = content.replace(tab0Regex, "{/* TAB 1: CREATIVE STUDIO (Master-Detail / Notion Style) */}");
        
        let cpa1Regex = /<div className="bg-\[\#0a0a0a\] border border-white\/5 rounded-2xl p-3\.5 flex flex-col justify-between relative overflow-hidden group hover:border-white\/10 transition-colors">\s*<div className="flex justify-between mb-1\.5">\s*<span className="text-gray-500 text-\[10px\] font-medium tracking-widest uppercase">CPA \(Custo Acq\.\)<\/span>[\s\S]*?<\/div>\s*<\/div>/;
        content = content.replace(cpa1Regex, insta);
        content = content.replace(cpa1Regex, tiktok);
        
        let scalingRegex = /<div \s*onClick=\{[^\}]*setIsScalingActive[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/;
        content = content.replace(scalingRegex, "");
        
        content = content.replace("useState<\"orcamento\" | \"cockpit\" | \"roadmap\" | \"crm\" | \"performance\">(\"cockpit\")", "useState<\"orcamento\" | \"cockpit\" | \"roadmap\" | \"crm\" | \"performance\">(\"orcamento\")");
        
        fs.writeFileSync("src/pages/Marketing.tsx", content, "utf-8");
        console.log("Successfully injected social cards and removed CPAs/Scaling!");
    } else {
        console.log("Could not find social cards in TAB 0");
    }
} else {
    console.log("TAB 0 not found");
}

