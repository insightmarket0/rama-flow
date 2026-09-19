const fs = require('fs');
let content = fs.readFileSync('src/pages/BusinessPlan.tsx', 'utf8');

// 1. Backgrounds & Layout
content = content.replace(/bg-transparent/g, 'bg-[#050505] selection:bg-[#CCFF00] selection:text-black');
content = content.replace(/<div className="absolute top-0 right-0[^>]+><\/div>/g, '');
content = content.replace(/<div className="absolute top-1\/2 left-0[^>]+><\/div>/g, '');

// 2. Headings & Colors
// "Business <span className="...">Plan.</span>" -> "SISTEMA DE\n<span className="text-[#CCFF00]">BUSINESS PLAN</span>" style
content = content.replace(
  /<h1 className="text-4xl md:text-5xl font-light text-white tracking-tighter">[\s\S]*?<\/h1>/m,
  `<h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none text-white">
            BUSINESS<br />
            <span className="text-[#CCFF00]">PLAN.</span>
          </h1>`
);

content = content.replace(/font-light/g, 'font-black');
content = content.replace(/text-indigo-400/g, 'text-[#CCFF00]');
content = content.replace(/text-purple-500/g, 'text-[#CCFF00]');
content = content.replace(/text-\[\#00FF00\]/g, 'text-[#CCFF00]');
content = content.replace(/bg-\[\#00FF00\]/g, 'bg-[#CCFF00]');
content = content.replace(/from-indigo-500\/10 via-purple-500\/5/g, '');
content = content.replace(/from-cyan-500\/10 via-blue-500\/5/g, '');

// 3. Borders & Rounding
content = content.replace(/rounded-xl/g, 'rounded-none');
content = content.replace(/rounded-2xl/g, 'rounded-none');
content = content.replace(/rounded-3xl/g, 'rounded-none');
content = content.replace(/rounded-lg/g, 'rounded-none');
content = content.replace(/rounded-full/g, 'rounded-none');
content = content.replace(/border border-white\/5/g, 'border-2 border-white/10');
content = content.replace(/border border-white\/10/g, 'border-2 border-white/10');
content = content.replace(/border border-\[\#222\]/g, 'border-2 border-[#222]');

// 4. Cards Backgrounds
content = content.replace(/bg-\[\#0a0a0a\]/g, 'bg-[#111111]');
content = content.replace(/bg-\[\#111\]/g, 'bg-[#111111]');
content = content.replace(/bg-\[\#161616\]/g, 'bg-[#111111]');
content = content.replace(/bg-black\/40/g, 'bg-[#111111]');
content = content.replace(/bg-black\/50/g, 'bg-[#111111]');

// 5. Buttons & Badges
content = content.replace(/px-4 lg:px-6 py-2 rounded-none text-xs font-bold uppercase tracking-wider transition-all bg-white\/10 text-white shadow-sm/g, 'px-4 lg:px-6 py-2 rounded-none text-xs font-black uppercase tracking-widest transition-all bg-[#CCFF00] text-black');

// Update inactive tabs
content = content.replace(/text-gray-500 hover:text-gray-300/g, 'text-gray-400 hover:text-white hover:bg-white/10');

// "Baixar PDF" button
content = content.replace(/bg-white\/5 hover:bg-white\/10 text-white border-2 border-white\/10 px-5 py-2.5 rounded-none font-bold text-xs tracking-widest uppercase transition-all flex items-center gap-2/g, 'bg-transparent hover:bg-[#CCFF00] text-white hover:text-black border-2 border-white/10 hover:border-[#CCFF00] px-5 py-2.5 rounded-none font-black text-xs tracking-widest uppercase transition-all flex items-center gap-2');

// Tab container border
content = content.replace(/flex bg-\[\#111111\] border-2 border-white\/10 p-1 rounded-none/g, 'flex bg-[#111111] border-2 border-white/10 p-1 rounded-none gap-1');

// Typography adjustments inside components
content = content.replace(/text-sm font-medium/g, 'text-sm font-bold');
content = content.replace(/text-xs font-medium/g, 'text-xs font-bold uppercase tracking-widest');

fs.writeFileSync('src/pages/BusinessPlan.tsx', content);
console.log('Business Plan updated to Brutalist style!');
