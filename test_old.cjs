const fs = require('fs');
let content = fs.readFileSync('old_marketing.tsx', 'utf-8');
const paineis = content.indexOf('{/* Pain');
const endOfScaling = content.lastIndexOf('</div>', paineis - 30);
console.log(content.substring(endOfScaling, paineis));
