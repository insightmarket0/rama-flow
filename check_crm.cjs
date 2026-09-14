const fs = require('fs');
let content = fs.readFileSync('src/pages/Marketing.tsx', 'utf-8');
const match = content.match(/\{\/\* TAB 2: CRM \*\/\}([\s\S]*?)\{\/\* Modals/);
if (match) {
    let block = match[1];
    let lines = block.split('\n');
    console.log('Lines between CRM and Modals: ' + lines.length);
    if (lines.length > 50) {
        console.log('Starts with:');
        for (let i = 0; i < 10; i++) console.log(lines[i]);
        console.log('Ends with:');
        for (let i = lines.length - 10; i < lines.length; i++) console.log(lines[i]);
    }
}
