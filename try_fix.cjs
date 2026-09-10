const fs = require('fs');
let content = fs.readFileSync('src/pages/Marketing.tsx', 'utf8');

// I will just remove the extra </div> on line 1018.
let lines = content.split('\n');
lines.splice(1017, 1); // Remove line 1018 (0-indexed 1017)
// Let's also remove one extra </div> before )} if needed.
// Wait, let's just let Prettier or a JSX parser fix it, or I can just trial and error.
fs.writeFileSync('src/pages/Marketing.tsx', lines.join('\n'), 'utf8');
console.log("Removed one extra div.");
