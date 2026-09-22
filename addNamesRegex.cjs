const fs = require('fs');
let content = fs.readFileSync('src/pages/MuralAjustes.tsx', 'utf-8');

const regex = /<SelectItem value="Anderson" className="hover:bg-white\/10">Anderson<\/SelectItem>/;
const replacement = `<SelectItem value="Anderson" className="hover:bg-white/10">Anderson</SelectItem>
                      <SelectItem value="Alyson" className="hover:bg-white/10">Alyson</SelectItem>
                      <SelectItem value="William" className="hover:bg-white/10">William</SelectItem>`;

if (regex.test(content)) {
  content = content.replace(regex, replacement);
  fs.writeFileSync('src/pages/MuralAjustes.tsx', content, 'utf-8');
  console.log('Added names using regex.');
} else {
  console.log('Could not find Anderson string.');
}
