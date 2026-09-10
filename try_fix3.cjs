const fs = require('fs');
let content = fs.readFileSync('src/pages/Marketing.tsx', 'utf8');

// I will just add back the div I removed on line 1014
let lines = content.split('\n');
lines.splice(1013, 0, '          </div>');
fs.writeFileSync('src/pages/Marketing.tsx', lines.join('\n'), 'utf8');
console.log("Added line 1014 back");
