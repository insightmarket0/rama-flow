const fs = require('fs');
let content = fs.readFileSync('src/components/finance/PainelPagamentosHoje.tsx', 'utf8');

// Replace the hack
content = content.replace(
    'if (!alreadyExists && Number(raw.amount || 0) !== 5000) {',
    'if (!alreadyExists) {'
);
content = content.replace(
    'const val = Number(i.value || (i.recurring_expense as any)?.amount || 0);\n        return val !== 5000;',
    'return true;'
);

fs.writeFileSync('src/components/finance/PainelPagamentosHoje.tsx', content, 'utf8');
console.log("Removed 5000 hack.");
