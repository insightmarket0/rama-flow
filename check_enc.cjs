const fs = require('fs');
let content = fs.readFileSync('src/pages/Marketing.tsx', 'utf8');
let match = content.match(/Gest.{1,5}o integrada/);
console.log("Current in file:", match ? match[0] : "Not found");
