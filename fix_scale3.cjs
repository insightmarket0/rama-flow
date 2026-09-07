const fs = require('fs');
const file = 'src/pages/Equipe.tsx';
let content = fs.readFileSync(file, 'utf8');

const target2 = 'scale-[0.70] origin-top md:scale-[0.75] lg:scale-[0.80] xl:scale-[0.85]';
const fix2 = 'scale-[0.75] origin-top md:scale-[0.80] lg:scale-[0.85] xl:scale-[0.90]';

content = content.replace(target2, fix2);
fs.writeFileSync(file, content, 'utf8');
console.log('Increased scale slightly');
