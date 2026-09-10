const fs = require('fs');
let content = fs.readFileSync('src/pages/Marketing.tsx', 'utf8');

// 1. Add </div> before Painéis Corporativos
content = content.replace(/\{\/\* Pain.*?Corporativos \*\/\}/, '</div>\n\n              {/* Painéis Corporativos */}');

// 2. We will just use the AST div counter logic to remove the first redundant </div> at the end of TAB 4.
// Let's just find the last 4 divs before )} in TAB 4.
let lines = content.split('\n');
let tab4End = -1;
for(let i=0; i<lines.length; i++) {
    if (lines[i] && lines[i].includes('        )}')) {
        tab4End = i;
        break;
    }
}
// Delete the first </div> we see right before tab4End.
if (tab4End !== -1) {
    for(let i=tab4End-1; i>0; i--) {
        if(lines[i].includes('</div>')) {
            lines.splice(i, 1);
            console.log("Deleted redundant div at line " + (i+1));
            break;
        }
    }
}
fs.writeFileSync('src/pages/Marketing.tsx', lines.join('\n'), 'utf8');
console.log("Grid fixed and balanced!");
