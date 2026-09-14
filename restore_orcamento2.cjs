const fs = require('fs');
let oldLines = fs.readFileSync('old_marketing.tsx', 'utf16le').split('\n');
let currentLines = fs.readFileSync('src/pages/Marketing.tsx', 'utf-8').split('\n');

let startIdx = -1;
let endIdx = -1;

for (let i = 0; i < oldLines.length; i++) {
    if (oldLines[i].includes('{/* TAB 4:')) startIdx = i;
    if (startIdx !== -1 && oldLines[i].includes('{/* Pain')) {
        endIdx = i;
        break;
    }
}

if (startIdx !== -1 && endIdx !== -1) {
    let orcamentoBlock = oldLines.slice(startIdx, endIdx).join('\n');
    
    let modalIdx = -1;
    for (let i = 0; i < currentLines.length; i++) {
        if (currentLines[i].includes('{/* Modals para')) {
            modalIdx = i;
            break;
        }
    }
    
    if (modalIdx !== -1) {
        currentLines.splice(modalIdx, 0, orcamentoBlock + '\n\n');
        fs.writeFileSync('src/pages/Marketing.tsx', currentLines.join('\n'), 'utf-8');
        console.log('Restored Orcamento tab properly!');
    } else {
        console.log('Could not find modals line');
    }
} else {
    console.log('Could not find boundaries. Start: ' + startIdx + ', End: ' + endIdx);
}
