const fs = require('fs');

let content = fs.readFileSync('src/components/finance/FinancialStats.tsx', 'utf-8');

// Change goal from 5,000,000 to 3,000,000
content = content.replace('const metaAno = 5000000;', 'const metaAno = 3000000;');

fs.writeFileSync('src/components/finance/FinancialStats.tsx', content, 'utf-8');
console.log('Goal updated to 3,000,000');
