const fs = require('fs');
let content = fs.readFileSync('C:/Users/ander/.gemini/antigravity/brain/6884f943-9acc-4e8e-9d0d-93e4aa66340c/scratch/Marketing.tsx', 'utf8');

console.log(content.substring(content.indexOf('{/* TAB 0: COCKPIT EXECUTIVO */}'), content.indexOf('{/* TAB 0: COCKPIT EXECUTIVO */}') + 500));
