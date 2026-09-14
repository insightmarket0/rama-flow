const fs = require('fs');
let content = fs.readFileSync('src/pages/Marketing.tsx', 'utf-8');
const target = '                      </div>\\n                    </div>\\n                  </div>\\n\\n\\n            </div>\\n\\n              {/* Pain';
const replacement = '                      </div>\\n                    </div>\\n\\n              {/* Pain';
content = content.replace(target, replacement);
fs.writeFileSync('src/pages/Marketing.tsx', content, 'utf-8');
