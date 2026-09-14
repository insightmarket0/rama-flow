const fs = require('fs');
let content = fs.readFileSync('src/pages/Marketing.tsx', 'utf-8');
const lines = content.split('\n');
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes(')}')) {
        console.log(i + ': ' + lines[i]);
    }
}
