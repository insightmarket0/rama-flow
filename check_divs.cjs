const fs = require('fs');
let content = fs.readFileSync('src/pages/Marketing.tsx', 'utf8');

let startIndex = content.indexOf('{activeTab === "cockpit" && (');
let cockpitBlock = content.substring(startIndex, content.indexOf(')}', startIndex));
console.log("Cockpit length:", cockpitBlock.length);
let divBalance = 0;
for (let i = 0; i < cockpitBlock.length; i++) {
    if (cockpitBlock.substr(i, 4) === '<div') divBalance++;
    if (cockpitBlock.substr(i, 5) === '</div') divBalance--;
}
console.log("Div balance inside cockpit:", divBalance);
