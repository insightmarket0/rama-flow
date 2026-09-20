const fs = require('fs');
let content = fs.readFileSync('src/pages/BusinessPlan.tsx', 'utf-8');

// Replace "Playbook de Marca & Influência (Padrão Shopee/ML)" or similar due to encoding
const regex1 = /Playbook de Marca & Influ.*?\s*\(Padr.*? Shopee\/ML\)/i;
content = content.replace(regex1, 'Marca & Influência');

// Replace "Opera.*?: Nuvemshop & Whats Marketplace" due to encoding
const regex2 = /Opera.*?:\s*Nuvemshop & Whats Marketplace/i;
content = content.replace(regex2, 'Nuvemshop & Whats Marketplace');

fs.writeFileSync('src/pages/BusinessPlan.tsx', content, 'utf-8');
console.log('Removed text');
