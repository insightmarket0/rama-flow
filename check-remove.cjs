const fs = require('fs');
let bp = fs.readFileSync('src/pages/BusinessPlan.tsx', 'utf8');

const sIdx = bp.indexOf('Estrutura & Expansão');
const cardStart = bp.lastIndexOf('<div className="lg:col-span-12 bg-[#0a0a0a]', sIdx);

// Since I injected the BrandBook cards right after this card, the next thing is `{/* NOVA LINHA 5` or similar.
const nextCard = bp.indexOf('{/* NOVA LINHA', sIdx) > -1 ? bp.indexOf('{/* NOVA LINHA', sIdx) : bp.indexOf('{/* LINHA', sIdx);

// The card block ends right before the injection.
// But we need to make sure we don't delete too much or too little.
// The BrandBook cards were injected inside `BusinessPlan.tsx` into a specific place.
console.log(bp.substring(cardStart, nextCard));
