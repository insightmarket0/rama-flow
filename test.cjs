const fs = require('fs');
let content = fs.readFileSync('src/pages/BusinessPlan.tsx', 'utf-8');

const regex = /<\/section>\s*<\/div>\s*<\/div>\s*\)\}/;
// Wait, the structure is:
//           </section>
//       </div>
//     )}

const matches = [...content.matchAll(/<\/section>[\s\S]*?<\/div>[\s\S]*?\)\}/g)];
if (matches.length > 0) {
    // get the one before activeTab === "estrategia"
    const searchPart = '          </section>\r\n      </div>\r\n    )}';
    
    // Let's just find "</section>" and replace the very last one inside the metas block
}
