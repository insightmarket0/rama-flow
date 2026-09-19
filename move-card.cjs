const fs = require('fs');

let bb = fs.readFileSync('src/pages/BrandBook.tsx', 'utf8');
let sDev = fs.readFileSync('src/pages/SistemaDev.tsx', 'utf8');

bb = bb.replace(/\r\n/g, '\n');
sDev = sDev.replace(/\r\n/g, '\n');

// 1. Extract LINHA 9
const bCardStart = bb.indexOf('{/* LINHA 9');
if (bCardStart === -1) {
    console.log("Could not find LINHA 9 in BrandBook.tsx");
    process.exit(1);
}

// Find the end of the block. It's the end of the file or just the last closing tag.
const bCardEnd = bb.lastIndexOf('        </div>\n      </div>\n    </div>\n  );\n}');

if (bCardEnd === -1) {
    console.log("Could not find end of LINHA 9 in BrandBook.tsx");
    process.exit(1);
}

const theCard = bb.substring(bCardStart, bCardEnd).trim();

// 2. Remove it from BrandBook.tsx
bb = bb.substring(0, bCardStart) + bb.substring(bCardEnd);
fs.writeFileSync('src/pages/BrandBook.tsx', bb);
console.log('Removed from BrandBook');

// 3. Inject it into SistemaDev.tsx
// Add Asterisk to lucide-react imports if missing
if (!sDev.includes('Asterisk')) {
    sDev = sDev.replace('import { Terminal', 'import { Asterisk, Terminal');
}

// Find activeTab === "visao-geral"
const tabStart = sDev.indexOf('{activeTab === "visao-geral" && (\n          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">');

if (tabStart !== -1) {
    const injection = '{activeTab === "visao-geral" && (\n        <div className="space-y-6">\n          ' + theCard + '\n\n          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">';
    sDev = sDev.replace('{activeTab === "visao-geral" && (\n          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">', injection);
    
    // We need to add a closing div for `<div className="space-y-6">` at the end of the visao-geral block.
    // The visao-geral block ends right before `{activeTab === "tarefas" && (`
    const nextTabStart = sDev.indexOf('{activeTab === "tarefas" && (');
    if (nextTabStart !== -1) {
        // Insert `</div>\n` right before `        {activeTab === "tarefas" && (`
        sDev = sDev.substring(0, nextTabStart) + '</div>\n        ' + sDev.substring(nextTabStart);
    }
}

fs.writeFileSync('src/pages/SistemaDev.tsx', sDev);
console.log('Injected into SistemaDev');
