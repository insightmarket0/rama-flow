const fs = require('fs');
let content = fs.readFileSync('src/pages/Marketing.tsx', 'utf8');

let startIdx = content.indexOf('{/* TIKTOK COMPACTO */}');
let endIdx = content.indexOf('{/* TAB 1: CREATIVE STUDIO');
if (startIdx !== -1 && endIdx !== -1) {
    console.log(content.substring(endIdx - 500, endIdx));
}
