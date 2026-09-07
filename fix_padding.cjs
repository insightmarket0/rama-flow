const fs = require('fs');
const file = 'src/pages/Equipe.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace('justify-start w-full h-full pt-16 overflow-hidden', 'justify-start w-full h-full pt-4 overflow-hidden');

fs.writeFileSync(file, content, 'utf8');
console.log('Moved tree up');
