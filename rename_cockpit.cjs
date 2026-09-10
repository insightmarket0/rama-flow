const fs = require('fs');
let content = fs.readFileSync('src/pages/Marketing.tsx', 'utf8');

content = content.replace('{ id: "cockpit", label: "Cockpit Executivo" }', '{ id: "cockpit", label: "Visão Analítica" }');

fs.writeFileSync('src/pages/Marketing.tsx', content, 'utf8');
console.log("Renamed to Visão Analítica");
