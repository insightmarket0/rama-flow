const fs = require('fs');
let content = fs.readFileSync('src/pages/BusinessPlan.tsx', 'utf-8');

// Find the number of <div and </div in the file
const divCount = (content.match(/<div/g) || []).length;
const closeDivCount = (content.match(/<\/div>/g) || []).length;
console.log('<div> count: ' + divCount);
console.log('</div> count: ' + closeDivCount);
