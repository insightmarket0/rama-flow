const fs = require('fs');
let oldContent = fs.readFileSync('old_marketing.tsx', 'utf16le');
let currentContent = fs.readFileSync('src/pages/Marketing.tsx', 'utf-8');

const startIdx = oldContent.indexOf('{/* TAB 4:');
const endIdx = oldContent.indexOf('{/* Pain', startIdx);

if (startIdx !== -1 && endIdx !== -1) {
    let orcamentoBlock = oldContent.substring(startIdx, endIdx);
    
    // Find Modals start
    const modalIdx = currentContent.indexOf('{/* Modals para');
    if (modalIdx !== -1) {
        currentContent = currentContent.substring(0, modalIdx) + orcamentoBlock + '\n\n      ' + currentContent.substring(modalIdx);
        fs.writeFileSync('src/pages/Marketing.tsx', currentContent, 'utf-8');
        console.log('Restored Orcamento tab!');
    } else {
        console.log('Could not find modals');
    }
} else {
    console.log('Could not find boundaries. Start: ' + startIdx + ', End: ' + endIdx);
}
