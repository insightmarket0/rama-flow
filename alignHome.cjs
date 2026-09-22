const fs = require('fs');
let content = fs.readFileSync('src/pages/Lembretes.tsx', 'utf-8');

// The header div has mb-5
content = content.replace(
  '<div className="flex flex-col md:flex-row md:items-baseline justify-between gap-6 mb-5 pt-0 shrink-0">',
  '<div className="flex flex-col md:flex-row md:items-baseline justify-between gap-6 mb-[44px] pt-0 shrink-0">'
);

fs.writeFileSync('src/pages/Lembretes.tsx', content, 'utf-8');
console.log('Adjusted mb to align with Home icon');
