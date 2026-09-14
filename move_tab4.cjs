const fs = require('fs');
let content = fs.readFileSync('src/pages/Marketing.tsx', 'utf-8');

// Find TAB 4 block at the bottom
const tab4Regex = /\{\/\* TAB 4: OR[\s\S]*?(?=\{\/\* Modals para Aprovações \*\/\})/;
const match = content.match(tab4Regex);

if (match) {
    let tab4Block = match[0];
    // Remove it from the bottom
    content = content.replace(tab4Regex, '');
    
    // Inject it right after TAB 2: CRM
    // TAB 2 CRM ends at:
    //             </div>
    //           )}
    const target = /<\/div>\s*<\/div>\s*<\/div>\s*\)\}\s*<\/div>\s*<\/div>/;
    
    // Wait, the structure is:
    /*
          )}
      </div>

      </div>
    */
    content = content.replace(
      /\n          \)\}\n      <\/div>\n\n      <\/div>/, 
      '\n          )}\n\n' + tab4Block + '\n      </div>\n\n      </div>'
    );
    
    fs.writeFileSync('src/pages/Marketing.tsx', content, 'utf-8');
    console.log('Moved Tab 4 to correct position!');
} else {
    console.log('Tab 4 not found at bottom');
}
