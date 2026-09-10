const fs = require('fs');
let content = fs.readFileSync('src/pages/Marketing.tsx', 'utf8');
let lines = content.split('\n');
let pIdx = -1;
for(let i=0; i<lines.length; i++) {
    if(lines[i].includes('Painéis Corporativos')) pIdx = i;
}
if(pIdx !== -1) {
    for(let j=pIdx; j<=pIdx+30; j++) {
        if(lines[j]) console.log(`${j}: ${lines[j]}`);
    }
}
