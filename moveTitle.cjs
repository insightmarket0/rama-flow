const fs = require('fs');

// 1. Remove from DashboardFinanceiro.tsx
let dashboard = fs.readFileSync('src/pages/DashboardFinanceiro.tsx', 'utf-8');
dashboard = dashboard.replace(
  '<h1 className="text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase text-white/80">\n            Faturamento e Lucros\n          </h1>',
  ''
);
fs.writeFileSync('src/pages/DashboardFinanceiro.tsx', dashboard, 'utf-8');

// 2. Add to RevenueChart.tsx
let revChart = fs.readFileSync('src/components/finance/RevenueChart.tsx', 'utf-8');
revChart = revChart.replace(
  'Evoluǜo Mensal',
  'Faturamento e Lucros'
);
revChart = revChart.replace(
  'Evolução Mensal',
  'Faturamento e Lucros'
);
fs.writeFileSync('src/components/finance/RevenueChart.tsx', revChart, 'utf-8');

// 3. Add to MarketplaceShareChart.tsx (since they screenshotted this one specifically)
let shareChart = fs.readFileSync('src/components/finance/MarketplaceShareChart.tsx', 'utf-8');
shareChart = shareChart.replace(
  'Faturamento por Canal',
  'Faturamento e Lucros'
);
fs.writeFileSync('src/components/finance/MarketplaceShareChart.tsx', shareChart, 'utf-8');

console.log('Moved the title.');
