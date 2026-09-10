const fs = require('fs');
let content = fs.readFileSync('src/pages/Marketing.tsx', 'utf8');

// I will remove the `</div>\n\n              {/* Painéis Corporativos */}`
// and just put back `              {/* Painéis Corporativos */}`
let oldStr = "</div>\n\n              {/* Pain";
let idx = content.indexOf(oldStr);
if (idx !== -1) {
    // Actually, because of encoding, let's use regex
    content = content.replace(/<\/div>\s*\{\/\* Pain.*?Corporativos \*\/\}/, '{/* Painéis Corporativos */}');
    fs.writeFileSync('src/pages/Marketing.tsx', content, 'utf8');
    console.log("Removed the bad </div> before Painéis Corporativos!");
} else {
    console.log("Not found with oldStr, trying regex anyway");
    content = content.replace(/<\/div>\s*\{\/\* Pain.*?Corporativos \*\/\}/, '{/* Painéis Corporativos */}');
    fs.writeFileSync('src/pages/Marketing.tsx', content, 'utf8');
}
