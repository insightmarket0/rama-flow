const fs = require('fs');
let content = fs.readFileSync('C:/Users/ander/.gemini/antigravity/brain/6884f943-9acc-4e8e-9d0d-93e4aa66340c/scratch/Marketing.tsx', 'utf8');

console.log("TAB 0 index: " + content.indexOf('{/* TAB 0: COCKPIT EXECUTIVO */}'));
console.log("TAB 1 index: " + content.indexOf('{/* TAB 1: CREATIVE STUDIO'));
console.log("TAB 2 index: " + content.indexOf('{/* TAB 2: CRM'));
console.log("TAB 4 index: " + content.indexOf('{/* TAB 4: OR'));
console.log("Painéis index: " + content.indexOf('{/* Pain'));

