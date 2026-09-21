const fs = require('fs');

const scanAndReplace = (file) => {
  if (!fs.existsSync(file)) return;
  if (fs.lstatSync(file).isDirectory()) return;
  const content = fs.readFileSync(file, 'utf-8');
  if (content.match(/5 milh[oõ]es/i) || content.match(/5\s?mi\b/i) || content.includes('5.000.000') || content.match(/5[\s]+milh[oõ]es/i) || content.match(/cinco milh[oõ]es/i)) {
    console.log(`Found 5 million in ${file}`);
  }
}

fs.readdirSync('src/pages').forEach(f => scanAndReplace('src/pages/' + f));
fs.readdirSync('src/components/finance').forEach(f => scanAndReplace('src/components/finance/' + f));
