const fs = require('fs');
let content = fs.readFileSync('src/components/layout/AppSidebar.tsx', 'utf8');

const replacement = `
    if (user?.email === "william@rama.com") {
      if (!["home", "operacao", "marketing", "gestao"].includes(group.id)) {
        return null;
      }
    }

    return modifiedGroup;
  }).filter(Boolean) as typeof NAV_GROUPS;`;

content = content.replace(/return modifiedGroup;\s*\}\)\.filter\(Boolean\) as typeof NAV_GROUPS;/, replacement.trim() + "\n");
fs.writeFileSync('src/components/layout/AppSidebar.tsx', content, 'utf8');
console.log("Success");
