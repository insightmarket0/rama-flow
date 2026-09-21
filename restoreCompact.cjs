const fs = require('fs');
let content = fs.readFileSync('src/pages/ComparativoContas.tsx', 'utf-8');

// 1. Root Layout & Header Alignment
content = content.replace(
  '<div className="flex-1 flex flex-col xl:flex-row gap-6 p-6 h-[calc(100vh-64px)] overflow-y-auto">',
  '<div className="flex-1 flex flex-col xl:flex-row gap-4 p-4 pt-2 h-[calc(100vh-64px)] overflow-y-auto overflow-x-hidden">'
);
content = content.replace(
  '<div className="flex-1 flex flex-col gap-6 max-w-7xl mx-auto w-full">',
  '<div className="flex-1 flex flex-col gap-4 max-w-7xl mx-auto w-full">'
);
content = content.replace(
  '<div className="flex flex-col gap-2">',
  '<div className="flex flex-col gap-1 -mt-2">'
);
content = content.replace(
  '<p className="text-cyan-400 font-bold text-[10px] tracking-[0.2em] uppercase flex items-center gap-2">',
  '<p className="text-[#00FF00] font-bold text-[10px] tracking-[0.2em] uppercase flex items-center gap-2">'
);
content = content.replace(
  '<h1 className="text-2xl font-light text-white mt-1">Comparativo de Contas</h1>',
  '<h1 className="text-xl font-light text-white mt-1">Comparativo de Contas</h1>'
);

// 2. Chart Layout
content = content.replace(
  '<Card className="bg-[#111111]/80 backdrop-blur-sm border-white/5 rounded-3xl overflow-hidden flex-1 min-h-[400px] flex flex-col">',
  '<Card className="bg-[#111111]/80 backdrop-blur-sm border-white/5 rounded-3xl overflow-hidden flex-1 min-h-[250px] flex flex-col">'
);
content = content.replace(
  '<CardHeader className="border-b border-white/5 bg-white/[0.02] py-4">',
  '<CardHeader className="border-b border-white/5 bg-white/[0.02] py-3">'
);
content = content.replace(
  '<CardTitle className="text-base font-light text-white">Projeção de Saídas</CardTitle>',
  '<CardTitle className="text-sm font-light text-white">Projeção de Saídas</CardTitle>'
);
content = content.replace(
  '<div className="bg-white/5 px-3 py-1 rounded-full text-xs text-gray-400 font-medium tracking-wide">',
  '<div className="bg-white/5 px-2 py-1 rounded-full text-[10px] text-gray-400 font-medium tracking-wide">'
);
content = content.replace(
  '<CardContent className="p-6 flex-1 flex flex-col">',
  '<CardContent className="p-4 flex-1 flex flex-col">'
);
content = content.replace(
  '<div className="flex-1 min-h-[300px]">',
  '<div className="flex-1 min-h-[200px]">'
);

// 3. Calendar Area Layout
content = content.replace(
  '<div className="w-full xl:w-[350px] flex-shrink-0 flex flex-col gap-6 pt-[68px]">',
  '<div className="w-full xl:w-[320px] flex-shrink-0 flex flex-col gap-4 xl:pt-[52px]">'
);
content = content.replace(
  '<Card className="bg-transparent border-0 shadow-none overflow-hidden flex-1 flex flex-col min-h-[450px]">',
  '<Card className="bg-transparent border-0 shadow-none overflow-hidden flex-1 flex flex-col min-h-[350px]">'
);
content = content.replace(
  '<div className="flex-1 p-5 overflow-y-auto max-h-[350px] scrollbar-thin scrollbar-thumb-white/10">',
  '<div className="flex-1 p-4 overflow-y-auto max-h-[250px] scrollbar-thin scrollbar-thumb-white/10">'
);

fs.writeFileSync('src/pages/ComparativoContas.tsx', content, 'utf-8');
console.log('Restored compact layout and alignment.');
