const fs = require('fs');
let content = fs.readFileSync('src/pages/Marketing.tsx', 'utf-8');
const insta = fs.readFileSync('insta.txt', 'utf-8');
const tiktok = fs.readFileSync('tiktok.txt', 'utf-8');

const cpaText = 'CPA (Custo Acq.)';
let cpaTextIdx = content.indexOf(cpaText);
if (cpaTextIdx !== -1) {
    let cpaStart = content.lastIndexOf('<div className="bg-[#0a0a0a]', cpaTextIdx);
    const paineis = content.indexOf('{/* Pain');
    
    if (cpaStart !== -1 && paineis !== -1) {
        let endOfScaling = content.lastIndexOf('</div>', paineis - 25);
        content = content.substring(0, cpaStart) + insta + '\\n' + tiktok + '\\n' + content.substring(endOfScaling + 6);
        fs.writeFileSync('src/pages/Marketing.tsx', content, 'utf-8');
        console.log('Injected successfully!');
    }
}
