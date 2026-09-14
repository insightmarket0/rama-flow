const fs = require('fs');
let content = fs.readFileSync('src/pages/Marketing.tsx', 'utf-8');
const tab4End = content.indexOf('</div>\\n\\n            </div>\\n\\n              {/* Pain');
console.log('tab4End: ', tab4End);
