const fs = require('fs');
let content = fs.readFileSync('src/pages/Marketing.tsx', 'utf8');

// I will just remove one `</div>` from line 943!
let lines = content.split('\n');
lines.splice(942, 1);
fs.writeFileSync('src/pages/Marketing.tsx', lines.join('\n'), 'utf8');
console.log("Removed a div at line 943");
