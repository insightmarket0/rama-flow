const fs = require('fs');
let content = fs.readFileSync('src/pages/Marketing.tsx', 'utf8');

if (content.charCodeAt(0) === 0xFEFF || content.charCodeAt(0) === 65533) {
  content = content.substring(1);
}
// check for any weird character at the start
content = content.replace(/^[^a-zA-Z]+/, '');
content = "import " + content.replace(/^import\s+/, "");

fs.writeFileSync('src/pages/Marketing.tsx', content, 'utf8');
