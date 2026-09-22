const fs = require('fs');
let content = fs.readFileSync('src/pages/Lembretes.tsx', 'utf-8');

content = content.replace(
  'gap-6 mb-[44px] pt-0 shrink-0',
  'gap-6 mb-4 pt-0 shrink-0'
);

fs.writeFileSync('src/pages/Lembretes.tsx', content, 'utf-8');
console.log('Adjusted mb to mb-4 to move grid up');
