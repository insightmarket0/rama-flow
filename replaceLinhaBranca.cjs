const fs = require('fs');
let content = fs.readFileSync('src/pages/BusinessPlan.tsx', 'utf-8');

const targetStr = '<span className="text-white/50 text-[10px] font-black uppercase tracking-widest mb-1">Linha Branca</span>';
const newStr = '<span className="text-white/50 text-[10px] font-black uppercase tracking-widest mb-1">Eletrodomésticos</span>';

if (content.includes(targetStr)) {
    content = content.replace(targetStr, newStr);
    
    // Also change the paragraph text title just in case they want both changed
    const targetP = '<strong className="text-[#FF00FF]">Linha Branca & Fogões:</strong>';
    const newP = '<strong className="text-[#FF00FF]">Eletrodomésticos & Fogões:</strong>';
    content = content.replace(targetP, newP);
    
    fs.writeFileSync('src/pages/BusinessPlan.tsx', content, 'utf-8');
    console.log('Text replaced successfully!');
} else {
    console.log('Target string not found.');
}
