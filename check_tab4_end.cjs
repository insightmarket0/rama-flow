const fs = require('fs');
let content = fs.readFileSync('src/pages/Marketing.tsx', 'utf8');
let lines = content.split('\n');

let tab4Start = -1;
for(let i=0; i<lines.length; i++) {
    if(lines[i].includes('TAB 4: OR')) tab4Start = i;
}

if(tab4Start !== -1) {
    for(let i=tab4Start; i<lines.length; i++) {
        if (lines[i].includes('  );')) {
            console.log("Found end at " + i);
            for(let j=i-15; j<=i; j++) {
                if(lines[j]) console.log(`${j}: ${lines[j]}`);
            }
            break;
        }
    }
}
