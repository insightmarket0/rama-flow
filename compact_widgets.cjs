const fs = require('fs');
const file = 'src/pages/Marketing.tsx';
let content = fs.readFileSync(file, 'utf8');

// The user wants the Instagram and TikTok performance cards to be more compact.
// The main issue is w-1/3 aspect-[4/5], which makes the posts very tall.
content = content.replace(/w-1\/3 aspect-\[4\/5\]/g, 'flex-1 aspect-square max-w-[80px]');

// Reduce some padding or sizes inside the widgets if needed
// Actually, flex-1 aspect-square max-w-[80px] will make the posts nice little squares instead of giant rectangles.

fs.writeFileSync(file, content, 'utf8');
console.log('Done');
