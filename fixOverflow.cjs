const fs = require('fs');
let content = fs.readFileSync('src/pages/BusinessPlan.tsx', 'utf-8');

// Replace w-[105%] with w-full
content = content.replace(/w-\[105\%\]/g, 'w-full');

// Also, the user asked to make the page "compact".
// We already replaced some p-6 lg:p-10 with p-4 lg:p-6, but let's change max-w-[1600px] to max-w-[1200px]
// to make the content narrower and more compact horizontally.
content = content.replace(/max-w-\[1600px\]/g, 'max-w-[1200px]');

fs.writeFileSync('src/pages/BusinessPlan.tsx', content, 'utf-8');
console.log('Fixed compact and overflow');
