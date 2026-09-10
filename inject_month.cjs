const fs = require('fs');
let content = fs.readFileSync('src/pages/Marketing.tsx', 'utf8');

const getMonthCode = `
  const getMonthName = (monthStr) => {
    if (!monthStr) return "Setembro de 2026";
    const [m, y] = monthStr.split('/');
    const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    return \`\${months[parseInt(m)-1]} de \${y}\`;
  };
`;

if (!content.includes('const getMonthName')) {
    content = content.replace('const handleEditBudget = () => {', getMonthCode + '\n  const handleEditBudget = () => {');
    fs.writeFileSync('src/pages/Marketing.tsx', content, 'utf8');
    console.log("Injected getMonthName!");
}
