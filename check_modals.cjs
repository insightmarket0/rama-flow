const fs = require('fs');
let currentLines = fs.readFileSync('src/pages/Marketing.tsx', 'utf-8').split('\n');
console.log('Lines before Modals:');
for (let i = 640; i < 650; i++) {
    console.log((i+1) + ': ' + currentLines[i]);
}
