const fs = require('fs');
let content = fs.readFileSync('unify_cards.cjs', 'utf-8');

const targetBlock = '// Delete Scorecard table';
let idx = content.indexOf(targetBlock);
if (idx !== -1) {
    content = content.substring(0, idx) + // Delete Scorecard table
let startIdx = content.indexOf('{/* 3. Tabela de ROI de Influenciadores */}');
if (startIdx !== -1) {
    let endTab2 = content.indexOf('{/* TAB 4:', startIdx);
    if (endTab2 === -1) endTab2 = content.length;
    let closeIdx = content.lastIndexOf(')}', endTab2);
    if (closeIdx !== -1) {
        content = content.substring(0, startIdx) + '            </div>\\n          )}' + content.substring(closeIdx + 2);
    }
}
fs.writeFileSync('src/pages/Marketing.tsx', content, 'utf-8');
console.log('CRM Table fully unified!');
;
    fs.writeFileSync('unify_cards.cjs', content, 'utf-8');
    console.log('Patched unify_cards.cjs');
}
