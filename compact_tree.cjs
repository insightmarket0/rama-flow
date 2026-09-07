const fs = require('fs');
const file = 'src/pages/Equipe.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Change org-tree CSS padding and line height
content = content.replace('padding: 20px 40px 0 40px;', 'padding: 15px 15px 0 15px;');
content = content.replace(/height: 20px;/g, 'height: 15px;');

// 2. Modify Card Dimensions and padding
content = content.replace(
  'rounded-[1.5rem] p-5 cursor-pointer shadow-2xl relative overflow-hidden text-left min-w-[280px] max-w-[320px]',
  'rounded-[1.25rem] p-4 cursor-pointer shadow-2xl relative overflow-hidden text-left min-w-[240px] max-w-[260px]'
);

// 3. Avatar size in card
content = content.replace(
  'gap-4 mb-4',
  'gap-3 mb-3'
);
content = content.replace(
  'w-12 h-12 rounded-2xl',
  'w-10 h-10 rounded-xl'
);
content = content.replace(
  'w-6 h-6 ',
  'w-5 h-5 '
);

// 4. Text sizes in card
content = content.replace(
  'text-xl font-medium text-white tracking-tight leading-tight',
  'text-lg font-medium text-white tracking-tight leading-tight'
);
content = content.replace(
  'text-[11px] text-gray-400 mt-0.5',
  'text-[10px] text-gray-400'
);
content = content.replace(
  'text-[10px] font-bold uppercase tracking-[0.1em] px-2.5 py-1',
  'text-[9px] font-bold uppercase tracking-[0.1em] px-2 py-1'
);
content = content.replace(
  'mt-4 pt-3 border-t border-white/5 text-center',
  'mt-3 pt-2.5 border-t border-white/5 text-center'
);

fs.writeFileSync(file, content, 'utf8');
console.log('Done');
