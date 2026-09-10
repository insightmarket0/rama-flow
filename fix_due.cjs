const fs = require('fs');
let content = fs.readFileSync('src/components/finance/PainelPagamentosHoje.tsx', 'utf8');
content = content.replace('if (raw.due_day === todayDay) {', 'if (Number(raw.due_day) === todayDay) {');
fs.writeFileSync('src/components/finance/PainelPagamentosHoje.tsx', content, 'utf8');
console.log("Fixed due_day check.");
