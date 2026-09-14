const fs = require('fs');
let content = fs.readFileSync('src/pages/Marketing.tsx', 'utf-8');

const cockpitBlockRegex = /\{\/\* INSTAGRAM COMPACTO \*\/\}([\s\S]*?)\{\/\* TIKTOK COMPACTO \*\/\}([\s\S]*?)<\/AreaChart>\s*<\/ResponsiveContainer>\s*<\/div>\s*<\/div>/;
const match = content.match(cockpitBlockRegex);
if (!match) {
    console.log('Block not found');
} else {
    console.log('Found social block!');
}

const cockpitTabRegex = /\{\/\* TAB 0: COCKPIT EXECUTIVO \*\/\}\s*\{activeTab === "cockpit" && \([\s\S]*?\{\/\* TIKTOK COMPACTO \*\/\}[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*\)\}\s*/;
if (content.match(cockpitTabRegex)) {
    console.log('Found cockpit tab exactly!');
} else {
    console.log('Did not find cockpit tab match!');
}
