const fs = require('fs');
let content = fs.readFileSync('src/pages/Marketing.tsx', 'utf8');

let lines = content.split('\n');
lines.splice(1167, 0, '                </div>');
fs.writeFileSync('src/pages/Marketing.tsx', lines.join('\n'), 'utf8');
console.log("Added the missing </div> back to the modal!");
