const fs = require('fs');
let content = fs.readFileSync('src/pages/Marketing.tsx', 'utf8');
let lines = content.split('\n');
for(let i=1150; i<=1180; i++) {
    if(lines[i] !== undefined) console.log(`${i+1}: ${lines[i]}`);
}
