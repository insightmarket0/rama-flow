const fs = require('fs');
const file = 'src/pages/Marketing.tsx';
let content = fs.readFileSync(file, 'utf8');

const startIndex = content.indexOf('{/* Social Media Tracker');
if (startIndex === -1) {
  console.log('Could not find start');
  process.exit(1);
}

const matchStr = '              </div>\n            </div>\n          )}\n          {/* TAB 1: CREATIVE STUDIO';
const endIndex = content.indexOf(matchStr);
if (endIndex === -1) {
  console.log('Could not find end');
  process.exit(1);
}

const blockStart = startIndex;
const blockEnd = endIndex; // Right before the </div> that closes the grid

const instaBlock = content.slice(blockStart, blockEnd);

const newInstaBlock = instaBlock.replace('lg:col-span-4', 'lg:col-span-6');

let newTikTokBlock = newInstaBlock
  .replace('{/* Social Media Tracker (Direita, 4 colunas) */}', '{/* TikTok Tracker */}')
  .replace('Instagram Performance', 'TikTok Performance')
  .replace('<Instagram ', '<PlayCircle ')
  .replace('from-purple-500 to-pink-500', 'from-cyan-500 to-blue-500')
  .replace('bg-purple-500/10', 'bg-cyan-500/10')
  .replace('135.145', '241.800')
  .replace('42.5K', '89.2K')
  .replace('8.2K', '14.5K');

const finalContent = content.slice(0, blockStart) + newInstaBlock + newTikTokBlock + content.slice(blockEnd);

fs.writeFileSync(file, finalContent, 'utf8');
console.log('Done');
