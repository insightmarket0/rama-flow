const fs = require('fs');
let content = fs.readFileSync('unify_cards.cjs', 'utf-8');

// replace the scorecardRegex with string manipulation
const targetBlock = // Delete Scorecard table
const scorecardRegex = /\\{\\/\\* 3\\. Tabela de ROI de Influenciadores \\*\\/\\}\\s*<div className="bg-\\[#0a0a0a\\] border border-white\\/5 rounded-2xl overflow-hidden flex flex-col">[\\s\\S]*?<\\/div>\\s*<\\/div>\\s*<\\/div>\\s*<\\/div>\\s*\\)\\}/;

const newEnding = \\\</div>
          )}\\\;

content = content.replace(scorecardRegex, newEnding);;

const newTarget = // Delete Scorecard table
let startIdx = content.indexOf('{/* 3. Tabela de ROI de Influenciadores */}');
if (startIdx !== -1) {
    let endTab2 = content.indexOf('{/* TAB 4: OR', startIdx);
    if (endTab2 === -1) endTab2 = content.length;
    // Find the last )} before TAB 4
    let closeIdx = content.lastIndexOf(')}', endTab2);
    if (closeIdx !== -1) {
        content = content.substring(0, startIdx) + '            </div>\\n          )}' + content.substring(closeIdx + 2);
    }
};

content = content.replace(targetBlock, newTarget);
fs.writeFileSync('unify_cards.cjs', content, 'utf-8');
console.log('Fixed unify_cards to be safe');
