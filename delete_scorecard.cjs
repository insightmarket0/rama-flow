const fs = require('fs');
let content = fs.readFileSync('src/pages/Marketing.tsx', 'utf-8');

let start = content.indexOf('{/* 3. Tabela de ROI de Influenciadores */}');
if (start !== -1) {
    let tabEnd = content.indexOf('          {/* TAB 4:', start);
    if (tabEnd !== -1) {
        // Find the </div>\n          )} before 	abEnd
        let endIdx = content.lastIndexOf('            </div>\\n          )}', tabEnd);
        if (endIdx !== -1) {
            content = content.substring(0, start) + content.substring(endIdx);
            fs.writeFileSync('src/pages/Marketing.tsx', content, 'utf-8');
            console.log('Deleted Scorecard table completely.');
        } else {
            console.log('Could not find closing of tab 2');
        }
    } else {
        console.log('Could not find TAB 4');
    }
}
