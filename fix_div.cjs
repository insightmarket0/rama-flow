const fs = require('fs');
let content = fs.readFileSync('src/pages/Marketing.tsx', 'utf8');

const scalingMarker = '<span className="text-gray-400 text-xs font-semibold">Pausado</span>';
let idx = content.indexOf(scalingMarker);
if (idx !== -1) {
    let endIdx = content.indexOf('</div>', idx);
    endIdx = content.indexOf('</div>', endIdx + 1);
    endIdx = content.indexOf('</div>', endIdx + 1);
    // this is the end of the new scaling card div.
    // I need to add one more </div> right after it to restore the layout.
    content = content.substring(0, endIdx + 6) + '\n                </div>' + content.substring(endIdx + 6);
    fs.writeFileSync('src/pages/Marketing.tsx', content, 'utf8');
    console.log("Success! Added missing div.");
}
