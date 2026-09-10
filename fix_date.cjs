const fs = require('fs');
let content = fs.readFileSync('src/components/finance/PainelPagamentosHoje.tsx', 'utf8');

content = content.replace(
    'dueDate: new Date(`${i.due_date}T12:00:00`),',
    'dueDate: new Date(i.due_date.includes("T") ? i.due_date : `${i.due_date}T12:00:00`),'
);
content = content.replace(
    'dueDate: new Date(`${i.due_date}T12:00:00`),',
    'dueDate: new Date(i.due_date.includes("T") ? i.due_date : `${i.due_date}T12:00:00`),'
);

fs.writeFileSync('src/components/finance/PainelPagamentosHoje.tsx', content, 'utf8');
console.log("Improved date parsing");
