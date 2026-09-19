const fs = require('fs');
let bp = fs.readFileSync('src/pages/BusinessPlan.tsx', 'utf8');

const sIdx = bp.indexOf('Estrutura & Expansão');
// We want to delete the whole card block containing this.
// Usually, it's a `<div className="lg:col-span-12 ...">` right before it.
const cardStart = bp.lastIndexOf('<div className="lg:col-span-12', sIdx);

// It ends before the injected BrandBook cards...
// The card ends right before `</div>\n              </div>\n            </section>` maybe?
// Let's just find the closing tag.
// If it's a `<div className="lg:col-span-12 bg-[#0a0a0a] border border-white/5 rounded-3xl p-8 relative overflow-hidden group">`
// It probably ends right before:
// `{/* LINHA 6 - FULL WIDTH: Manifesto e B2B */}` or whatever I injected.
// Let's find what is right after `sIdx`.
const nextCard = bp.indexOf('LINHA 6', sIdx) > -1 ? bp.indexOf('LINHA 6', sIdx) : bp.indexOf('LINHA', sIdx);

console.log(cardStart, nextCard);

let cardEnd = nextCard;
if (nextCard !== -1) {
    // Backtrack to find the closing div of the card
    cardEnd = bp.lastIndexOf('</div>', nextCard); // Wait, there might be multiple nested divs.
}

bp = bp.substring(0, cardStart) + bp.substring(nextCard);
fs.writeFileSync('src/pages/BusinessPlan.tsx', bp);
console.log('Removed');
