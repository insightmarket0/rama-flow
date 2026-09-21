const fs = require('fs');
let content = fs.readFileSync('src/pages/BusinessPlan.tsx', 'utf-8');

// Insert </div> before {/* --- COLUNA DIREITA --- */}
content = content.replace(
  /\{\/\* --- COLUNA DIREITA --- \*\/\}/,
  '</div>\n                  {/* --- COLUNA DIREITA --- */}'
);

fs.writeFileSync('src/pages/BusinessPlan.tsx', content, 'utf-8');
console.log('Fixed structure 2');
