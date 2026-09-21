const fs = require('fs');
let content = fs.readFileSync('src/pages/BusinessPlan.tsx', 'utf-8');

// Find the stray </div> before {/* ITEM 3 */}
content = content.replace('</div>{/* ITEM 3 */}', '{/* ITEM 3 */}');

// Find the end of ITEM 3 and add the </div> back
content = content.replace(
  '</div>\n  \n                    \n  \n                  {/* --- COLUNA DIREITA --- */}',
  '</div>\n                  </div>\n  \n                  {/* --- COLUNA DIREITA --- */}'
);

fs.writeFileSync('src/pages/BusinessPlan.tsx', content, 'utf-8');
console.log('Fixed structure');
