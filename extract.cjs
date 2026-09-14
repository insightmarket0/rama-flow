const fs = require('fs');
let content = fs.readFileSync('src/pages/Marketing.tsx', 'utf-8');

const tab0Regex = /\\{\\/\\* TAB 0: COCKPIT EXECUTIVO \\*\\/\\}([\\s\\S]*?)\\{\\/\\* TAB 1: CREATIVE STUDIO \\(Master-Detail \\/ Notion Style\\) \\*\\/\\}/;
const match0 = content.match(tab0Regex);
if (match0) {
    let block = match0[1];
    let instaRegex = /\\{\\/\\* INSTAGRAM COMPACTO \\*\\/\\}[\\s\\S]*?\\{\\/\\* TIKTOK COMPACTO \\*\\/\\}/;
    let tikTokRegex = /\\{\\/\\* TIKTOK COMPACTO \\*\\/\\}[\\s\\S]*?<\\/ResponsiveContainer>\\s*<\\/div>\\s*<\\/div>/;
    
    let instaMatch = block.match(instaRegex);
    let tikTokMatch = block.match(tikTokRegex);
    
    fs.writeFileSync('insta.txt', instaMatch[0].replace('{/* TIKTOK COMPACTO */}', ''), 'utf-8');
    fs.writeFileSync('tiktok.txt', tikTokMatch[0], 'utf-8');
    console.log('Saved insta.txt and tiktok.txt');
}
