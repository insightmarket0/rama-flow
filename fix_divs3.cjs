const fs = require('fs');
let content = fs.readFileSync('src/pages/Marketing.tsx', 'utf-8');
const target = \                  </div>

            </div>

              {/* Painéis Corporativos */}\;
const replacement = \                  </div>

              {/* Painéis Corporativos */}\;
content = content.replace(target, replacement);
fs.writeFileSync('src/pages/Marketing.tsx', content, 'utf-8');
