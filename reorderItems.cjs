const fs = require('fs');
let content = fs.readFileSync('src/pages/BusinessPlan.tsx', 'utf-8');

// Extract the three items using a regex
const regex = /\{\/\* ITEM 1 \*\/\}(.*?)\{\/\* ITEM 2 \*\/\}(.*?)\{\/\* ITEM 3 \*\/\}(.*?)(?=\s*\{\/\* --- COLUNA DIREITA --- \*\/\})/s;
const match = content.match(regex);

if (match) {
    let item1 = match[1]; // Marketing
    let item2 = match[2]; // Ecossistema
    let item3 = match[3]; // Nuvemshop

    // We want the order to be:
    // New Item 1: Ecossistema
    // New Item 2: Nuvemshop
    // New Item 3: Marketing

    let newItem1 = item2;
    let newItem2 = item3;
    let newItem3 = item1;

    // 1. Update the background colors
    // Item 1: bg-[#111111]
    newItem1 = newItem1.replace(/bg-black/, 'bg-[#111111]');
    // Item 2: bg-black
    newItem2 = newItem2.replace(/bg-\[#111111\]/, 'bg-black');
    // Item 3: bg-[#111111]
    newItem3 = newItem3.replace(/bg-\[#111111\]/, 'bg-[#111111]'); // Already has it, but just in case

    // 2. Update the watermark numbers
    // Note: The watermarks are inside <div className="absolute -right-10 -bottom-10 text-[12rem] font-black text-white/5 pointer-events-none transition-transform duration-700 group-hover:scale-110">X</div>
    newItem1 = newItem1.replace(/>2<\/div>/, '>1</div>');
    newItem2 = newItem2.replace(/>3<\/div>/, '>2</div>');
    newItem3 = newItem3.replace(/>1<\/div>/, '>3</div>');

    // 3. Update bottom borders
    // Item 1 and Item 2 need border-b-4
    if (!newItem1.includes('border-b-4')) {
        newItem1 = newItem1.replace(/relative overflow-hidden/, 'border-b-4 border-white/20 relative overflow-hidden');
    }
    if (!newItem2.includes('border-b-4')) {
        newItem2 = newItem2.replace(/relative overflow-hidden/, 'border-b-4 border-white/20 relative overflow-hidden');
    }
    
    // Item 3 should NOT have border-b-4
    newItem3 = newItem3.replace(/border-b-4 border-white\/20\s+/, '');

    // Reconstruct the block
    const newBlock = `\n                    {/* ITEM 1 */}` + newItem1 + 
                     `{/* ITEM 2 */}` + newItem2 + 
                     `{/* ITEM 3 */}` + newItem3;

    content = content.replace(regex, newBlock);
    fs.writeFileSync('src/pages/BusinessPlan.tsx', content, 'utf-8');
    console.log('Reordered successfully!');
} else {
    console.log('Regex failed');
}
