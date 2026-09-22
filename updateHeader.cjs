const fs = require('fs');
let content = fs.readFileSync('src/pages/Lembretes.tsx', 'utf-8');

// The block to replace
const oldHeaderRegex = /\{\/\* Header Intimista \*\/\}\s*<div className="mb-6 border-b border-white\/5 pb-6 pt-0 flex flex-col md:flex-row md:items-end justify-between gap-6 shrink-0">\s*<div>\s*<div className="mb-2">\s*<h1 className="text-3xl md:text-4xl font-light text-white tracking-tight flex items-center gap-2">\s*Seu <span className="font-semibold text-\[#00FF00\]">Mundo<\/span>\.\s*<\/h1>\s*<\/div>\s*<p className="text-gray-500 mt-2 text-sm max-w-xl leading-relaxed">\s*Um espa.+o totalmente seu\. Organize sua agenda, checklist do dia a dia e rascunhos mentais\.\s*<\/p>\s*<\/div>\s*<\/div>/m;

// If it doesn't match, I will use replace with string indexOf
const startIndex = content.indexOf('{/* Header Intimista */}');
const endIndex = content.indexOf('</div>', content.indexOf('</div>', content.indexOf('</div>', startIndex) + 6) + 6) + 6;

const oldHeader = content.substring(startIndex, endIndex);

const newHeader = `{/* Header Intimista */}
        <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-6 mb-5 pt-0 shrink-0">
          <h1 className="text-3xl font-light text-white tracking-tight flex items-baseline gap-3">
            <span>Seu <span className="font-semibold text-[#00FF00]">Mundo</span>.</span>
            <span className="text-gray-500 text-sm font-normal tracking-normal hidden md:inline-block">Um espaço totalmente seu. Organize sua agenda, checklist do dia a dia e rascunhos mentais.</span>
          </h1>
        </div>`;

if(oldHeader.includes('Um espa')) {
   content = content.replace(oldHeader, newHeader);
   fs.writeFileSync('src/pages/Lembretes.tsx', content, 'utf-8');
   console.log('Replaced header.');
} else {
   console.log('Could not find header precisely.');
}
