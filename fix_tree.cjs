const fs = require('fs');
const file = 'src/pages/Equipe.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  'justify-center w-full h-full pt-16">',
  'justify-start w-full h-full pt-8 pb-32 overflow-y-auto custom-scrollbar">'
);

fs.writeFileSync(file, content, 'utf8');
console.log('Done');
