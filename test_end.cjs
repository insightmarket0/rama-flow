const fs = require('fs');
let content = fs.readFileSync('src/pages/Marketing.tsx', 'utf-8');
const lines = content.split('\n');
for (let i = 955; i < 975; i++) {
    if (lines[i]) console.log(i + ': ' + lines[i]);
}
