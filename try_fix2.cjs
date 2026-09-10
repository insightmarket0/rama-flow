const fs = require('fs');
let content = fs.readFileSync('src/pages/Marketing.tsx', 'utf8');

// I will remove ONE </div> from lines 1011 to 1014
let lines = content.split('\n');
lines.splice(1013, 1); // Remove line 1014
fs.writeFileSync('src/pages/Marketing.tsx', lines.join('\n'), 'utf8');
console.log("Removed line 1014");
