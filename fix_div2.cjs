const fs = require('fs');
let content = fs.readFileSync('src/pages/Marketing.tsx', 'utf-8');

content = content.replace(
  /<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*\)\}\s*<\/div>\s*<\/div>/,
  '</div>\n            </div>\n              </div>\n          )}\n      </div>\n\n      </div>'
);

fs.writeFileSync('src/pages/Marketing.tsx', content, 'utf-8');
console.log('Fixed extra div with regex');
