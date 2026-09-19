const fs = require('fs');
let bp = fs.readFileSync('src/pages/BusinessPlan.tsx', 'utf8');

const sIdx = bp.indexOf('Estrutura & Expansão');
const cardStart = bp.lastIndexOf('<div className="lg:col-span-12 bg-[#0a0a0a]', sIdx);

// The card ends right at the last `</div>` before `<section className="mt-8`.
const endBlock = bp.indexOf('<section className="mt-8 flex flex-col gap-6">', cardStart);
// Backtrack to the end of `</div>` that closes the grid
const cardEnd = bp.lastIndexOf('</div>', endBlock) + 6;

bp = bp.substring(0, cardStart) + bp.substring(cardEnd);
fs.writeFileSync('src/pages/BusinessPlan.tsx', bp);
console.log('Deleted');
