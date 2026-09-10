const fs = require('fs');
let content = fs.readFileSync('src/components/layout/MainLayout.tsx', 'utf8');

// fix double update
content = content.replace(/\.update\(\{ full_name: editName \}\)\s*\n\s*\.update\(\{ full_name: editName, role: editRole \}\)/, ".update({ full_name: editName, role: editRole })");

fs.writeFileSync('src/components/layout/MainLayout.tsx', content, 'utf8');
console.log("Fixed double update");
