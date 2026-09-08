const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const replacement = 'const Fornecedores = lazy(() => import("./pages/Fornecedores"));\nconst BusinessPlan = lazy(() => import("./pages/BusinessPlan"));';
content = content.replace('const Fornecedores = lazy(() => import("./pages/Fornecedores"));', replacement);

fs.writeFileSync('src/App.tsx', content, 'utf8');
