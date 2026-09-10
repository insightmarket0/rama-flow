const fs = require('fs');
let content = fs.readFileSync('src/pages/Equipe.tsx', 'utf8');

// Rogerio's children
content = content.replace(/children: \["anderson"\]/, 'children: ["anderson", "alyson"]');

// Anderson's children
content = content.replace(/children: \["william", "alyson", "mara", "tecnico_gas"\]/, 'children: ["william", "mara", "tecnico_gas"]');

fs.writeFileSync('src/pages/Equipe.tsx', content, 'utf8');
console.log("Success");
