const fs = require('fs');
let content = fs.readFileSync('src/pages/Marketing.tsx', 'utf8');

content = content.replace(/\{\/\* Pain.*?Corporativos \*\/\}/, '</div>\n\n              {/* Painéis Corporativos */}');
fs.writeFileSync('src/pages/Marketing.tsx', content, 'utf8');
console.log("Added the missing div back!");
