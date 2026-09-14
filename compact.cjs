const fs = require('fs');
let content = fs.readFileSync('src/pages/Marketing.tsx', 'utf-8');

// 1. Remove the subtitle
content = content.replace(/<p className="text-gray-400 text-xs mt-0.5">Gestǜo integrada de campanhas, CRM e aquisiǜo.<\\/p>/, '');
content = content.replace(/<p className="text-gray-400 text-xs mt-0.5">Gest.*o integrada de campanhas, CRM e aquisi.*o.<\\/p>/, '');

// 2. Remove the "Visão Analítica" tab
content = content.replace(/\\{ id: "cockpit", label: "Vis.*o Anal.*tica" \\},\\s*/, '');

// 3. Compact margins
// In main container
content = content.replace(/<div className="p-4 md:p-5 max-w-\\[1400px\\] w-full mx-auto h-full flex flex-col gap-4 relative z-10">/, 
                          '<div className="p-2 md:p-3 max-w-[1400px] w-full mx-auto h-full flex flex-col gap-2 relative z-10">');

// In Orçamento tab
// "flex-1 overflow-y-auto pr-2 custom-scrollbar pb-6 mt-4" -> mt-2
content = content.replace(/<div className="flex-1 overflow-y-auto pr-2 custom-scrollbar pb-6 mt-4">/,
                          '<div className="flex-1 overflow-y-auto pr-2 custom-scrollbar pb-2 mt-1">');

// "mt-6 flex flex-col gap-6 max-w-full pb-4" -> "mt-3 flex flex-col gap-3 max-w-full pb-2"
content = content.replace(/<div className="mt-6 flex flex-col gap-6 max-w-full pb-4">/,
                          '<div className="mt-3 flex flex-col gap-3 max-w-full pb-2">');

fs.writeFileSync('src/pages/Marketing.tsx', content, 'utf-8');
console.log('Done compacting.');
