const fs = require('fs');

const scan = (file) => {
  if (!fs.existsSync(file)) return;
  const content = fs.readFileSync(file, 'utf-8');
  if (content.toLowerCase().includes('milh')) {
    console.log(`Found milh in ${file}`);
  }
  if (content.includes('5')) {
    const lines = content.split('\n');
    lines.forEach((l, i) => {
      if (l.includes('5 ') || l.includes('5.0') || l.includes('5m') || l.includes('5M') || l.includes('5 mil') || l.includes('5 Mil')) {
        console.log(`${file}:${i+1}: ${l.trim()}`);
      }
    });
  }
}

scan('src/pages/BusinessPlan.tsx');
scan('src/pages/DashboardFinanceiro.tsx');
scan('src/pages/ComparativoContas.tsx');
scan('src/pages/Dashboard.tsx');
scan('src/components/layout/AppSidebar.tsx');

