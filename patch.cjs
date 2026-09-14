const fs = require('fs');
let content = fs.readFileSync('unify_cards.cjs', 'utf-8');
content = content.replace(
\const newEnding = \\\</div>
            </div>
          )}\\\;\,
\const newEnding = \\\</div>
          )}\\\;\
);
fs.writeFileSync('unify_cards.cjs', content, 'utf-8');
console.log('Fixed unify_cards.cjs');
