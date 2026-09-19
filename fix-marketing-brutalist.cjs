const fs = require('fs');
let content = fs.readFileSync('src/pages/Marketing.tsx', 'utf8');

// Update section titles in the cards from gray text to heavy bright green or white
content = content.replace(/text-\[10px\] font-medium tracking-widest uppercase text-gray-500/g, 'text-[11px] font-black tracking-widest uppercase text-white');

// Update buttons from thin/rounded to brutalist thick/square
// e.g. bg-white/5 hover:bg-white/10 text-gray-400 px-3 py-1 rounded-full text-[9px] font-medium transition-colors border border-white/5 uppercase
content = content.replace(/rounded-full text-\[9px\] font-medium transition-colors border border-white\/5/g, 'rounded-none text-[10px] font-bold transition-colors border-2 border-white/20 hover:border-[#CCFF00] hover:text-[#CCFF00]');
content = content.replace(/rounded-full text-\[10px\] font-bold tracking-widest uppercase transition-colors border border-white\/10/g, 'rounded-none text-[10px] font-black tracking-widest uppercase transition-colors border-2 border-white/20 hover:border-[#CCFF00] hover:text-[#CCFF00]');
content = content.replace(/rounded-full text-\[10px\] font-medium transition-colors border border-white\/5/g, 'rounded-none text-[10px] font-bold transition-colors border-2 border-white/20 hover:border-[#CCFF00] hover:text-[#CCFF00]');

// Update internal background of smaller cards (like inside instagram/tiktok metrics)
// bg-[#111] border border-white/5 rounded-lg -> bg-black border-2 border-white/10 rounded-none
content = content.replace(/bg-\[\#111\] border border-white\/5 rounded-lg/g, 'bg-black border-2 border-white/10 rounded-none');

fs.writeFileSync('src/pages/Marketing.tsx', content);
