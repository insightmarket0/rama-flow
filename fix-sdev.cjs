const fs = require('fs');

let bb = fs.readFileSync('src/pages/BrandBook.tsx', 'utf8');
let sDev = fs.readFileSync('src/pages/SistemaDev.tsx', 'utf8');

bb = bb.replace(/\r\n/g, '\n');
sDev = sDev.replace(/\r\n/g, '\n');

// 1. Extract LINHA 9
const bCardStart = bb.indexOf('{/* LINHA 9');
// In BrandBook, LINHA 9 is the last card in the grid.
const bCardEndStr = '        </div>\n      </div>\n    </div>\n  );\n}';
const bCardEnd = bb.lastIndexOf(bCardEndStr);

if (bCardStart === -1 || bCardEnd === -1) {
    console.log("Failed to find bounds in BrandBook.tsx");
    process.exit(1);
}

const theCard = bb.substring(bCardStart, bCardEnd).trim();

// 2. Remove BOTH the BrandBook cards (from earlier) AND the LINHA 9 card.
// Wait, the user wants me to remove ALL of them?
// The user said: "agora remove essa parte da identidade de marca so deixa onde eu coloquei ja"
// And in this request: "esse card azul voce remove de la e coloca na magina desenvolvimento dev center rama system hub"
// So they want the BrandBook file to be COMPLETELY free of those cards.
const allCardsStart = bb.indexOf('{/* NOVA LINHA 5: DETALHAMENTO');
if (allCardsStart !== -1) {
    bb = bb.substring(0, allCardsStart) + bb.substring(bCardEnd);
}

fs.writeFileSync('src/pages/BrandBook.tsx', bb);

// 3. Inject it into SistemaDev.tsx
if (!sDev.includes('Asterisk')) {
    sDev = sDev.replace('import { Terminal', 'import { Asterisk, Terminal');
}

// Ensure we don't inject multiple times
if (!sDev.includes('O Cérebro da Operação') && !sDev.includes('{/* LINHA 9')) {
    const searchStr = '{activeTab === "visao-geral" && (';
    const tabStart = sDev.indexOf(searchStr);

    if (tabStart !== -1) {
        // Find the immediate next div which is the grid
        const gridStart = sDev.indexOf('<div className="grid grid-cols-1 md:grid-cols-3 gap-6">', tabStart);
        if (gridStart !== -1) {
            const prefix = sDev.substring(0, gridStart);
            const suffix = sDev.substring(gridStart);
            sDev = prefix + '<div className="space-y-6">\n          ' + theCard + '\n\n          ' + suffix;
            
            // We need to add a closing div for `<div className="space-y-6">`
            const nextTabStart = sDev.indexOf('{activeTab === "tarefas" && (');
            if (nextTabStart !== -1) {
                sDev = sDev.substring(0, nextTabStart) + '</div>\n        ' + sDev.substring(nextTabStart);
                console.log('Injected successfully');
            } else {
                console.log("Could not find tarefas tab");
            }
        } else {
            console.log("Could not find grid");
        }
    } else {
        console.log("Could not find visao-geral");
    }

    fs.writeFileSync('src/pages/SistemaDev.tsx', sDev);
} else {
    console.log('SistemaDev.tsx already has the card injected');
}
