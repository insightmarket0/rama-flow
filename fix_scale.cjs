const fs = require('fs');
const file = 'src/pages/Equipe.tsx';
let content = fs.readFileSync(file, 'utf8');

const target1 = 'justify-start w-full h-full pt-28 pb-32 overflow-y-auto custom-scrollbar';
const fix1 = 'justify-start w-full h-full pt-8 lg:pt-10 overflow-hidden';

const target2 = 'scale-[0.85] origin-top md:scale-90 lg:scale-95 xl:scale-100';
const fix2 = 'scale-[0.70] origin-top md:scale-[0.75] lg:scale-[0.80] xl:scale-[0.85]';

content = content.replace(target1, fix1).replace(target2, fix2);
fs.writeFileSync(file, content, 'utf8');
console.log('Fixed tree scale and padding');
