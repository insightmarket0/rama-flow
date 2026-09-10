const fs = require('fs');
let content = fs.readFileSync('src/pages/Marketing.tsx', 'utf8');
let lines = content.split('\n');
let modalIdx = -1;
for(let i=0; i<lines.length; i++) {
    if(lines[i].includes('Modals para')) modalIdx = i;
}
if(modalIdx !== -1) {
    for(let j=modalIdx-15; j<=modalIdx; j++) {
        if(lines[j]) console.log(`${j}: ${lines[j]}`);
    }
}
