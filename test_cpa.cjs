const fs = require('fs');
let content = fs.readFileSync('src/pages/Marketing.tsx', 'utf-8');
const count = (content.match(/CPA \\(Custo Acq\\.\\)/g) || []).length;
console.log('Number of CPA cards:', count);
