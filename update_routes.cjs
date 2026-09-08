const fs = require('fs');

// 1. Add route to App.tsx
let appContent = fs.readFileSync('src/App.tsx', 'utf8');
const importStr = "import Fornecedores from './pages/Fornecedores';\nimport BusinessPlan from './pages/BusinessPlan';\n";
appContent = appContent.replace("import Fornecedores from './pages/Fornecedores';\n", importStr);

const routeStr = `            <Route
              path="/business-plan"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <BusinessPlan />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            {/* Rotas Mobile do Instalador`;

appContent = appContent.replace("            {/* Rotas Mobile do Instalador", routeStr);
fs.writeFileSync('src/App.tsx', appContent, 'utf8');

// 2. Add link to AppSidebar.tsx
let sidebarContent = fs.readFileSync('src/components/layout/AppSidebar.tsx', 'utf8');
const linkStr = `        { title: "Business Plan", url: "/business-plan", icon: FileText },
        { title: "Metas e Vis\\u01DDo", url: "/metas", icon: Target },`;

// First add FileText to imports if not there
if (!sidebarContent.includes("FileText")) {
  sidebarContent = sidebarContent.replace("Target, BookOpen", "Target, BookOpen, FileText");
}

sidebarContent = sidebarContent.replace('{ title: "Metas e Vis\\u01DDo", url: "/metas", icon: Target },', linkStr);
// The exact string might not have unicode escape but actual string
const linkStrReal = `        { title: "Business Plan", url: "/business-plan", icon: FileText },
        { title: "Metas e Visão", url: "/metas", icon: Target },`;
sidebarContent = sidebarContent.replace('{ title: "Metas e Visão", url: "/metas", icon: Target },', linkStrReal);

fs.writeFileSync('src/components/layout/AppSidebar.tsx', sidebarContent, 'utf8');
console.log('App and AppSidebar updated');
