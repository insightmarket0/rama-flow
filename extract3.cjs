const fs = require('fs');
let content = fs.readFileSync('src/pages/Marketing.tsx', 'utf-8');

const instaStart = content.indexOf('{/* INSTAGRAM COMPACTO */}');
const tiktokStart = content.indexOf('{/* TIKTOK COMPACTO */}');
const tiktokEnd = content.indexOf('</ResponsiveContainer>', tiktokStart);

if (instaStart !== -1 && tiktokStart !== -1 && tiktokEnd !== -1) {
    let insta = content.substring(instaStart, tiktokStart);
    // Find the end of the TikTok card (it has 3 closing divs after ResponsiveContainer)
    let endDiv = content.indexOf('</div>', tiktokEnd);
    endDiv = content.indexOf('</div>', endDiv + 1);
    endDiv = content.indexOf('</div>', endDiv + 1);
    
    let tiktok = content.substring(tiktokStart, endDiv + 6);
    fs.writeFileSync('insta.txt', insta, 'utf-8');
    fs.writeFileSync('tiktok.txt', tiktok, 'utf-8');
    console.log('Saved cards!');
} else {
    console.log('Could not find cards');
}
