const fs = require('fs');
let content = fs.readFileSync('src/pages/Lembretes.tsx', 'utf-8');

content = content.replace(
  '<span>Seu <span className="font-semibold text-[#00FF00]">Mundo</span>.</span>',
  '<span className="text-[#00FF00]">Seu <span className="font-semibold">Mundo</span>.</span>'
);

fs.writeFileSync('src/pages/Lembretes.tsx', content, 'utf-8');
console.log('Made Seu neon green too');
