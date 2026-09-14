const fs = require('fs');
let content = fs.readFileSync('src/pages/Marketing.tsx', 'utf-8');

const instaStart = content.indexOf('{/* INSTAGRAM COMPACTO */}');
const tiktokStart = content.indexOf('{/* TIKTOK COMPACTO */}');
const tiktokEnd = content.indexOf('</ResponsiveContainer>\\n                      </div>\\n                    </div>', tiktokStart);

if (instaStart !== -1 && tiktokStart !== -1 && tiktokEnd !== -1) {
    let insta = content.substring(instaStart, tiktokStart);
    let tiktok = content.substring(tiktokStart, tiktokEnd + 85);
    fs.writeFileSync('insta.txt', insta, 'utf-8');
    fs.writeFileSync('tiktok.txt', tiktok, 'utf-8');
    console.log('Saved cards!');
} else {
    console.log('Could not find cards');
}
