const fs = require('fs');
let bp = fs.readFileSync('src/pages/BusinessPlan.tsx', 'utf8');

const sIdx = bp.indexOf('<div className="lg:col-span-12 bg-[#0a0a0a] border border-white/5 rounded-3xl p-8 relative overflow-hidden group">');
// Since it's inside a grid inside a section, let's find the closing div of this specific card.
// The card ends right before `</div>` which closes the grid `grid-cols-1 lg:grid-cols-12`, then `</section>` which closes the `Seção 2`.
// Wait, actually earlier I did:
/*
<section>
  <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
    <div className="lg:col-span-12 ...">
       ...
    </div>
  </div>
</section>
*/
// The user wants to remove the card "Estrutura & Expansão".
// The entire section "Seção 2: Análise de Mercado & Estratégia" seems to contain ONLY this card now because I previously deleted the other "col-span-4" card!
// Let's check what's inside "Seção 2".
