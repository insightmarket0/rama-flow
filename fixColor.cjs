const fs = require('fs');

let content = fs.readFileSync('src/pages/MuralAjustes.tsx', 'utf-8');

// Change neon yellow-green to pure fluorescent green
content = content.replace(/#CCFF00/g, '#00FF00');

fs.writeFileSync('src/pages/MuralAjustes.tsx', content, 'utf-8');
console.log('Fixed color to #00FF00');
