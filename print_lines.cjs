const fs = require('fs');
let currentLines = fs.readFileSync('src/pages/Marketing.tsx', 'utf-8').split('\n');
for (let i = 718; i < 728; i++) {
    console.log((i+1) + ': ' + currentLines[i]);
}
