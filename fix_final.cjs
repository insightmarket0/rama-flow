const fs = require('fs');
let currentLines = fs.readFileSync('src/pages/Marketing.tsx', 'utf-8').split('\n');

// We want to replace lines 719-727 with exactly the correct structure.
// Let's find exactly the block.
const block =             </div>



                    </div>
            </div>
          )}
      </div>
      </div>;

const newBlock =             </div>
          </div>
        )}
      </div>
    </div>;

const text = currentLines.join('\n');
const newText = text.replace(block, newBlock);
fs.writeFileSync('src/pages/Marketing.tsx', newText, 'utf-8');
console.log('Fixed extra divs!');
