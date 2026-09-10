const fs = require('fs');
let content = fs.readFileSync('src/pages/Marketing.tsx', 'utf8');
let openCount = (content.match(/<div/g) || []).length;
let closeCount = (content.match(/<\/div/g) || []).length;
console.log(`Open: ${openCount}, Close: ${closeCount}`);
