const fs = require('fs');
let content = fs.readFileSync('src/pages/Marketing.tsx', 'utf-8');
const match = content.match(/\{\/\* 3\. Tabela de ROI de Influenciadores \*\/\}([\s\S]*?)\)\}/);
if (match) {
    console.log('Scorecard section ending:\n' + match[1].substring(match[1].length - 150));
}
