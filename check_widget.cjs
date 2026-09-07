const fs = require('fs');
const file = 'src/pages/Marketing.tsx';
let content = fs.readFileSync(file, 'utf8');

const widgetStart = content.indexOf('{/* Qualidade de Captação Widget */}');
const widgetEnd = content.indexOf('{/* Tabela Principal CRM */}');

if (widgetStart !== -1 && widgetEnd !== -1) {
    console.log("Wait, is it already there?");
} else {
    // Wait, let's just find the start and end of Qualidade de Captação in Cockpit
    const cockpitStart = content.indexOf('{/* Tabela de Lead Quality (Centro, 8 colunas) */}');
    const cockpitEnd = content.indexOf('{/* --- NOVA LINHA DO COCKPIT --- */}'); // Actually, what comes after it? 
}
