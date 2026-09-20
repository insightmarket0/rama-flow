const fs = require('fs');
let content = fs.readFileSync('src/pages/BusinessPlan.tsx', 'utf-8');

const toReplace = `              </div>
            </div>

          </div>
        )}`;

const replacement = `              </div>
            </div>
        )}`;

content = content.replace(toReplace, replacement);
fs.writeFileSync('src/pages/BusinessPlan.tsx', content, 'utf-8');
console.log('Fixed extra div');
