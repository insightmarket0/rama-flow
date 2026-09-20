const fs = require('fs');
let content = fs.readFileSync('src/pages/BusinessPlan.tsx', 'utf-8');

const startStr = '{/* Card: Sistema de Pedidos */}';
let startIndex = content.indexOf(startStr);

if (startIndex !== -1) {
    const endStr = '                {/* Card: Sistema Interno */}';
    const endIndex = content.indexOf(endStr, startIndex);
    
    if (endIndex !== -1) {
        content = content.substring(0, startIndex) + content.substring(endIndex);
        fs.writeFileSync('src/pages/BusinessPlan.tsx', content, 'utf-8');
        console.log('Replaced successfully');
    } else {
        console.log('End string not found');
    }
} else {
    console.log('Start string not found');
}
