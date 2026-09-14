const fs = require('fs');
let currentLines = fs.readFileSync('src/pages/Marketing.tsx', 'utf-8').split('\n');
console.log('Total lines: ' + currentLines.length);
console.log('Lines 890-896:');
for (let i = 889; i < currentLines.length; i++) {
    console.log((i+1) + ': ' + currentLines[i]);
}
