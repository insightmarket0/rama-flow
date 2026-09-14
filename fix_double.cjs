const fs = require('fs');
let content = fs.readFileSync('src/pages/Marketing.tsx', 'utf-8');

const target = '                    </div>\n            </div>\n          )}\n      </div>\n\n      </div>\n\n      {/* Modals para Aprovações */}';
content = content.replace(target, '                    </div>\n            </div>\n\n      {/* Modals para Aprovações */}');

fs.writeFileSync('src/pages/Marketing.tsx', content, 'utf-8');
console.log('Fixed double closing!');
