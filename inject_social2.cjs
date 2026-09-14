const fs = require('fs');
let content = fs.readFileSync('src/pages/Marketing.tsx', 'utf-8');
const insta = fs.readFileSync('insta.txt', 'utf-8');
const tiktok = fs.readFileSync('tiktok.txt', 'utf-8');

const cpaStart = content.indexOf('<div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-3.5 flex flex-col justify-between relative overflow-hidden group hover:border-white/10 transition-colors">\\r\\n                <div className="flex justify-between mb-1.5">\\r\\n                  <span className="text-gray-500 text-[10px] font-medium tracking-widest uppercase">CPA (Custo Acq.)</span>');

// If line endings are \n:
const cpaStart2 = content.indexOf('<div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-3.5 flex flex-col justify-between relative overflow-hidden group hover:border-white/10 transition-colors">\\n                <div className="flex justify-between mb-1.5">\\n                  <span className="text-gray-500 text-[10px] font-medium tracking-widest uppercase">CPA (Custo Acq.)</span>');

const cpaIdx = cpaStart !== -1 ? cpaStart : cpaStart2;

const paineis = content.indexOf('{/* Pain');

if (cpaIdx !== -1 && paineis !== -1) {
    let endOfScaling = content.lastIndexOf('</div>', paineis - 30);
    content = content.substring(0, cpaIdx) + insta + '\\n' + tiktok + '\\n' + content.substring(endOfScaling + 6);
    fs.writeFileSync('src/pages/Marketing.tsx', content, 'utf-8');
    console.log('Injected successfully!');
} else {
    console.log('Failed to find boundaries. cpaIdx:', cpaIdx, 'paineis:', paineis);
}
