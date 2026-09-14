const fs = require('fs');
let content = fs.readFileSync('src/pages/Marketing.tsx', 'utf-8');
const insta = fs.readFileSync('insta.txt', 'utf-8');
const tiktok = fs.readFileSync('tiktok.txt', 'utf-8');

// The first CPA starts here:
const cpaStart = content.indexOf('<div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-3.5 flex flex-col justify-between relative overflow-hidden group hover:border-white/10 transition-colors">\\n                <div className="flex justify-between mb-1.5">\\n                  <span className="text-gray-500 text-[10px] font-medium tracking-widest uppercase">CPA (Custo Acq.)</span>');

// Modo Scaling ends right before: </div>\n\n            </div>\n\n              {/* Painéis Corporativos */}
// Let's find "Painéis Corporativos"
const paineis = content.indexOf('{/* Painéis Corporativos */}');
if (cpaStart !== -1 && paineis !== -1) {
    // We want to delete from cpaStart up to the div that closes the grid.
    // Let's find the closing div of the grid just before paineis.
    let endOfScaling = content.lastIndexOf('</div>', paineis - 20); // this is the end of Modo Scaling card
    // The structure is: Modo Scaling Card -> </div> closing grid -> {/* Painéis */}
    // Let's replace cpaStart to endOfScaling + 6
    content = content.substring(0, cpaStart) + insta + '\\n' + tiktok + content.substring(endOfScaling + 6);
    
    fs.writeFileSync('src/pages/Marketing.tsx', content, 'utf-8');
    console.log('Injected social cards into TAB 4!');
} else {
    console.log('Could not find CPA or Painéis boundaries');
}
