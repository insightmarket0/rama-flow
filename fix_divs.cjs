const fs = require('fs');
let content = fs.readFileSync('src/pages/Marketing.tsx', 'utf8');

// I will just add back the div before )}
let lines = content.split('\n');
let idx = lines.findIndex(l => l.includes('        )}'));
if (idx !== -1) {
    lines.splice(idx, 0, '          </div>');
    fs.writeFileSync('src/pages/Marketing.tsx', lines.join('\n'), 'utf8');
    console.log("Added missing div at line " + idx);
}
