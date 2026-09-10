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
    if (lines[lastCockpitIdx - 1].includes('</div>')) {
        lines.splice(lastCockpitIdx - 1, 1);
        fs.writeFileSync('src/pages/Marketing.tsx', lines.join('\n'), 'utf8');
        console.log("Removed extra </div> at end of cockpit!");
    } else {
        console.log("No div before )}: " + lines[lastCockpitIdx - 1]);
    }
}
