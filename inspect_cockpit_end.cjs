const fs = require('fs');
let content = fs.readFileSync('src/pages/Marketing.tsx', 'utf8');

let lines = content.split('\n');

// Find the last cockpit )}
let lastCockpitIdx = -1;
for (let i = 0; i < lines.length; i++) {
    if (lines[i] && lines[i].includes('        )}')) {
        lastCockpitIdx = i;
    }
}
if (lastCockpitIdx !== -1) {
    console.log("Lines before ):");
    for(let i=lastCockpitIdx-5; i<=lastCockpitIdx+2; i++) {
        if(lines[i] !== undefined) console.log(`${i+1}: ${lines[i]}`);
    }
}
