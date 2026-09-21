const fs = require('fs');
const files = fs.readdirSync('src/pages').map(f => 'src/pages/' + f);
files.forEach(f => {
  if(!fs.lstatSync(f).isFile()) return;
  const content = fs.readFileSync(f, 'utf8');
  if(content.toLowerCase().includes('meta')) {
    console.log(`Found meta in ${f}`);
  }
});
