const fs = require('fs');
let sidebarContent = fs.readFileSync('src/components/layout/AppSidebar.tsx', 'utf8');

if (!sidebarContent.includes("FileText")) {
  // Wait, we know it doesn't include the import, but it includes the usage.
}
// Just add FileText to the import list from lucide-react
sidebarContent = sidebarContent.replace("import { \n  Zap,", "import { \n  FileText,\n  Zap,");
fs.writeFileSync('src/components/layout/AppSidebar.tsx', sidebarContent, 'utf8');
console.log("Added FileText to imports");
