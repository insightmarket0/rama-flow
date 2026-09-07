const fs = require('fs');
const file = 'src/pages/Equipe.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace('pt-8 lg:pt-10 overflow-hidden', 'pt-16 overflow-hidden');

fs.writeFileSync(file, content, 'utf8');
console.log('Fixed tree scale and padding');
