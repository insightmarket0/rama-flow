const fs = require('fs');
let content = fs.readFileSync('src/pages/BusinessPlan.tsx', 'utf-8');

// 1. WhatsApp Header Name
const nameTarget = '<span className="text-[#e9edef] font-bold text-base whitespace-nowrap">Rama Flow</span>';
const nameReplace = '<span className="text-[#e9edef] font-bold text-base whitespace-nowrap">Luna - Club RM</span>';
content = content.replace(nameTarget, nameReplace);

// 2. WhatsApp Avatar Text
const avatarTarget = '<span className="text-[#CCFF00] font-black text-sm">RF</span>';
const avatarReplace = '<span className="text-[#CCFF00] font-black text-sm">L</span>';
content = content.replace(avatarTarget, avatarReplace);

// 3. Welcome Message in WhatsApp
const welcomeTarget = 'Olá! Bem-vindo(a) à RAMA FLOW. 🚀';
const welcomeReplace = 'Olá! Bem-vindo(a) à Luna - Club RM. 🚀';
content = content.replace(welcomeTarget, welcomeReplace);

fs.writeFileSync('src/pages/BusinessPlan.tsx', content, 'utf-8');
console.log('WhatsApp header updated to Luna - Club RM');
