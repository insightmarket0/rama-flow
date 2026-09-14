const fs = require('fs');
let content = fs.readFileSync('src/pages/Marketing.tsx', 'utf-8');
const lines = content.split('\r\n').length > 1 ? content.split('\r\n') : content.split('\n');

// Delete line 832 (index 831)
lines.splice(832, 1);

fs.writeFileSync('src/pages/Marketing.tsx', lines.join('\n'), 'utf-8');
