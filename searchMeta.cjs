const fs = require('fs');

const scan = (file) => {
  if (!fs.existsSync(file)) return;
  const content = fs.readFileSync(file, 'utf-8');
  if (content.toLowerCase().includes('meta')) {
    const lines = content.split('\n');
    lines.forEach((l, i) => {
      if (l.toLowerCase().includes('meta')) {
        console.log(`${file}:${i+1}: ${l.trim()}`);
      }
    });
  }
}

const pages = fs.readdirSync('src/pages').map(f => 'src/pages/' + f).filter(f => fs.lstatSync(f).isFile());
pages.forEach(scan);

const comps = fs.readdirSync('src/components/finance').map(f => 'src/components/finance/' + f).filter(f => fs.lstatSync(f).isFile());
comps.forEach(scan);
