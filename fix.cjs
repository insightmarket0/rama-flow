const fs = require('fs');
let content = fs.readFileSync('src/pages/BusinessPlan.tsx', 'utf-8');

// The replacement I made didn't close the activeTab === "ecossistema" block properly.
// I need to add `</div></div></div>)}` before `{activeTab === "app" && (`

content = content.replace(
    '{activeTab === "app" && (',
    '              </div>\n            </div>\n          </div>\n        )}\n\n        {activeTab === "app" && ('
);

fs.writeFileSync('src/pages/BusinessPlan.tsx', content, 'utf-8');
console.log('Fixed syntax error');
