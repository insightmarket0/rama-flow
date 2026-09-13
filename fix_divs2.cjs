const fs = require('fs');
let content = fs.readFileSync('src/pages/Marketing.tsx', 'utf-8');
const lines = content.split('\n');

// We want to remove the two extra </div>
// Let's print lines 830 to 840 to see exactly which ones to remove.
for(let i=828; i<=838; i++) {
  console.log(i + ': ' + lines[i]);
}
