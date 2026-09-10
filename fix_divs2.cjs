const fs = require('fs');
let content = fs.readFileSync('src/pages/Marketing.tsx', 'utf8');

let lines = content.split('\n');
lines.splice(377, 1); // remove the bad one

// Find the end cockpit )}
let lastCockpitIdx = -1;
for (let i = 0; i < lines.length; i++) {
    if (lines[i] && lines[i].includes('        )}')) {
        lastCockpitIdx = i;
    }
}
if (lastCockpitIdx !== -1) {
    lines.splice(lastCockpitIdx, 0, '          </div>');
    fs.writeFileSync('src/pages/Marketing.tsx', lines.join('\n'), 'utf8');
    console.log("Added to " + lastCockpitIdx);
}
