const fs = require('fs');
let bp = fs.readFileSync('src/pages/BusinessPlan.tsx', 'utf8');

const sIdx = bp.indexOf('{/* Seção 1: Resumo Executivo */}');
const eIdx = bp.indexOf('</section>', sIdx) + 10;
const sec1 = bp.substring(sIdx, eIdx);

// Remove it from its original place
bp = bp.substring(0, sIdx) + bp.substring(eIdx);

// Find the metas tab
// Look for `{activeTab === "metas" && (`
const metasTab = bp.indexOf('{activeTab === "metas" && (');
// Find the header inside it
// <p className="text-gray-400 text-sm font-medium max-w-3xl leading-relaxed">
//   ...
// </p>
// </div>
// Let's just find the first `</div>` that closes the header block.
// Wait, the header block is:
/*
        <div className="flex flex-col space-y-3 mb-8">
          <div className="flex items-center gap-4">
            ...
          </div>
          <p className="...">...</p>
        </div>
*/
const pEnd = bp.indexOf('</p>', metasTab);
const headerEnd = bp.indexOf('</div>', pEnd) + 6;

// Insert sec1 there
bp = bp.substring(0, headerEnd) + '\n\n          ' + sec1 + bp.substring(headerEnd);

fs.writeFileSync('src/pages/BusinessPlan.tsx', bp);
console.log('Moved');
