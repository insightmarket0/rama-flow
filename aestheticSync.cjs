const fs = require('fs');
let content = fs.readFileSync('src/pages/ComparativoContas.tsx', 'utf-8');

// Colors
content = content.replace(/#00FF00/g, '#CCFF00');

// Typography and Layout changes
// 1. Header
content = content.replace('<h1 className="text-xl font-light text-white mt-1">Comparativo de Contas</h1>', '<h1 className="text-3xl font-black text-white mt-1 uppercase tracking-tighter">Comparativo de Contas</h1>');

// 2. Cards (Top KPI)
// Remove rounded-2xl and glassmorphism
content = content.replace(/bg-\[#111111\]\/80 backdrop-blur-sm border-\[#CCFF00\]\/30 shadow-\[0_0_20px_rgba\(0,255,0,0\.05\)\] rounded-2xl/g, 'bg-[#050505] border-2 border-[#CCFF00]/30 rounded-none shadow-2xl relative overflow-hidden group');
content = content.replace(/bg-\[#111111\]\/80 backdrop-blur-sm border-white\/5 rounded-2xl/g, 'bg-[#111111] border-2 border-white/10 rounded-none hover:border-white/20 transition-colors shadow-xl');

// Add brutalist accents to the cards
// "Para Pagar Hoje"
content = content.replace('<div className="text-3xl font-light text-white tracking-tight">', '<div className="text-4xl font-black text-white tracking-tighter mt-2">');
content = content.replace('<div className="text-2xl font-light text-cyan-400 tracking-tight">', '<div className="text-3xl font-black text-cyan-400 tracking-tighter mt-2">');
content = content.replace('<div className="text-2xl font-light text-[#CCFF00] tracking-tight">', '<div className="text-3xl font-black text-[#CCFF00] tracking-tighter mt-2">');

// 3. Chart Container
content = content.replace('bg-[#111111]/80 backdrop-blur-sm border-white/5 rounded-3xl overflow-hidden flex-1 min-h-[250px] flex flex-col', 'bg-[#050505] border-2 border-white/10 rounded-none overflow-hidden flex-1 min-h-[250px] flex flex-col shadow-2xl relative');
content = content.replace('border-b border-white/5 bg-white/[0.02] py-3', 'border-b-2 border-white/10 bg-[#111111] py-4 px-6');
content = content.replace('<CardTitle className="text-sm font-light text-white">Projeção de Saídas</CardTitle>', '<CardTitle className="text-lg font-black text-white uppercase tracking-tighter flex items-center gap-2"><span className="w-2 h-2 bg-[#CCFF00]"></span>Projeção de Saídas</CardTitle>');
content = content.replace('bg-white/5 px-2 py-1 rounded-full text-[10px]', 'bg-[#CCFF00] text-black px-3 py-1 rounded-none text-[10px] font-black uppercase');

// 4. Calendar Right Column
content = content.replace('bg-transparent border-0 shadow-none overflow-hidden flex-1 flex flex-col min-h-[350px]', 'bg-[#050505] border-2 border-white/10 rounded-none overflow-hidden flex-1 flex flex-col min-h-[350px] shadow-2xl');
content = content.replace('<CardHeader className="pb-4 px-0">', '<CardHeader className="pb-4 pt-4 px-5 border-b-2 border-white/10 bg-[#111111]">');
content = content.replace('<CardTitle className="text-lg font-light text-white flex items-center gap-2">', '<CardTitle className="text-lg font-black text-white uppercase tracking-tighter flex items-center gap-2">');
content = content.replace('bg-[#1A1A1D] border border-white/5 rounded-2xl shadow-2xl overflow-hidden', 'bg-transparent flex-1 flex flex-col overflow-hidden');
content = content.replace('bg-gradient-to-b from-black/20 to-transparent border-b border-white/5', 'bg-black border-b-2 border-white/10 p-5');

// Fix Calendar inner styling
content = content.replace('rounded-full transition-colors flex items-center justify-center', 'rounded-none transition-colors flex items-center justify-center font-bold');
content = content.replace('bg-[#CCFF00]/10 text-[#CCFF00] hover:bg-[#CCFF00]/20 hover:text-[#CCFF00] font-bold rounded-full', 'bg-[#CCFF00] text-black hover:bg-[#CCFF00] hover:text-black font-black rounded-none');

// 5. Calendar Bills list
content = content.replace('bg-white/[0.02] border border-white/5 p-3.5 rounded-2xl', 'bg-[#111111] border-l-4 border-l-[#CCFF00] border-t border-b border-r border-white/5 p-4 rounded-none');
content = content.replace('<h4 className="text-sm font-light text-gray-400 mb-4 flex items-center justify-between">', '<h4 className="text-xs font-black text-white uppercase tracking-widest mb-4 flex items-center justify-between border-b border-white/10 pb-2">');

fs.writeFileSync('src/pages/ComparativoContas.tsx', content, 'utf-8');
console.log('Aesthetic sync complete!');
