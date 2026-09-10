const fs = require('fs');
let content = fs.readFileSync('src/pages/Marketing.tsx', 'utf8');
console.log("Modal exists:", content.includes('isSocialModalOpen &&'));
