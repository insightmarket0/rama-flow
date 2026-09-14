const fs = require('fs');
let content = fs.readFileSync('src/pages/Marketing.tsx', 'utf-8');

// 1. Remove TAB 0 from the headers
const headerIdx = content.indexOf('{ id: "cockpit", label: "Visão Analítica", icon: PieChart },');
if (headerIdx !== -1) {
    const endLine = content.indexOf('\\n', headerIdx);
    content = content.substring(0, headerIdx) + content.substring(endLine + 1);
}

// 2. Remove TAB 0 content block completely
const tab0Start = content.indexOf('{/* TAB 0: COCKPIT EXECUTIVO */}');
const tab1Start = content.indexOf('{/* TAB 1: CREATIVE STUDIO (Master-Detail / Notion Style) */}');
if (tab0Start !== -1 && tab1Start !== -1) {
    content = content.substring(0, tab0Start) + content.substring(tab1Start);
}

// Ensure activeTab default is orcamento
content = content.replace('useState<"orcamento" | "cockpit" | "roadmap" | "crm" | "performance">("cockpit")', 'useState<"orcamento" | "cockpit" | "roadmap" | "crm" | "performance">("orcamento")');

fs.writeFileSync('src/pages/Marketing.tsx', content, 'utf-8');
console.log('Removed TAB 0!');
