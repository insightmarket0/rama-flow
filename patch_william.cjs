const fs = require('fs');
let content = fs.readFileSync('src/components/layout/AppSidebar.tsx', 'utf8');

const target = `    if (user?.email === "mara@hotmail.com") {
      if (!["home", "gestao", "expedicao", "operacao"].includes(group.id)) {
        return null;
      }
      if (group.id === "operacao") {
        modifiedGroup.subItems = modifiedGroup.subItems.filter(
          item => item.url !== "/mural-ajustes" && item.url !== "/mural-alinhamento"
        );
      }
    }

    return modifiedGroup;`;

const replacement = `    if (user?.email === "mara@hotmail.com") {
      if (!["home", "gestao", "expedicao", "operacao"].includes(group.id)) {
        return null;
      }
      if (group.id === "operacao") {
        modifiedGroup.subItems = modifiedGroup.subItems.filter(
          item => item.url !== "/mural-ajustes" && item.url !== "/mural-alinhamento"
        );
      }
    }

    if (user?.email === "william@rama.com") {
      if (!["home", "operacao", "marketing", "gestao"].includes(group.id)) {
        return null;
      }
    }

    return modifiedGroup;`;

if (content.includes(target)) {
    content = content.replace(target, replacement);
    fs.writeFileSync('src/components/layout/AppSidebar.tsx', content, 'utf8');
    console.log("Success");
} else {
    console.log("Target not found!");
}
