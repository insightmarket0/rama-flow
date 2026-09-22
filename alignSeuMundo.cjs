const fs = require('fs');
let content = fs.readFileSync('src/pages/Lembretes.tsx', 'utf-8');

// Ajustar o padding superior do wrapper principal para pt-2 em todas as resolucoes
content = content.replace(
  'className="flex-1 p-4 md:p-8 pt-6 animate-in fade-in duration-500 max-w-[1400px] mx-auto w-full font-sans flex flex-col min-h-0 overflow-hidden"',
  'className="flex-1 px-4 md:px-8 pb-4 md:pb-8 pt-2 md:pt-2 animate-in fade-in duration-500 max-w-[1400px] mx-auto w-full font-sans flex flex-col min-h-0 overflow-hidden"'
);

// O header do Seu Mundo tem um <div className="mb-2"> em volta do H1, o que pode empurrá-lo um pouco se houver margins. 
// Vamos remover o mb-2 para garantir alinhamento perfeito (ou deixar como pt-0).
content = content.replace(
  '<div className="mb-2">\n              <h1 className="text-3xl',
  '<div className="mb-0 pt-0">\n              <h1 className="text-3xl'
);

// Header intimista container
content = content.replace(
  '<div className="mb-6 border-b border-white/5 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-6 shrink-0">',
  '<div className="mb-6 border-b border-white/5 pb-6 pt-0 flex flex-col md:flex-row md:items-end justify-between gap-6 shrink-0">'
);


fs.writeFileSync('src/pages/Lembretes.tsx', content, 'utf-8');
console.log('Aligned Seu Mundo title');
