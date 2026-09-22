const fs = require('fs');
let content = fs.readFileSync('src/pages/Lembretes.tsx', 'utf-8');

const regex = /<h1 className="text-3xl font-light text-white tracking-tight flex items-baseline gap-3">\s*<span>Seu <span className="font-semibold text-\[#00FF00\]">Mundo<\/span>\.<\/span>\s*<span className="text-gray-500 text-sm font-normal tracking-normal hidden md:inline-block">Um espa.+o totalmente seu\. Organize sua agenda, checklist do dia a dia e rascunhos mentais\.<\/span>\s*<\/h1>/m;

const newH1 = `<h1 className="text-3xl font-light text-white tracking-tight flex items-center gap-4">
            <span>Seu <span className="font-semibold text-[#00FF00]">Mundo</span>.</span>
            <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-gray-500 border-l border-[#00FF00]/30 pl-4 hidden xl:inline-block mt-1">Um espaço totalmente seu. Organize sua agenda, checklist e rascunhos mentais.</span>
          </h1>`;

content = content.replace(regex, newH1);

// Also change the wrapper flex from items-baseline to items-center
content = content.replace(
  '<div className="flex flex-col md:flex-row md:items-baseline justify-between gap-6 mb-[44px] pt-0 shrink-0">',
  '<div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-[44px] pt-0 shrink-0">'
);

fs.writeFileSync('src/pages/Lembretes.tsx', content, 'utf-8');
console.log('Updated synergy');
