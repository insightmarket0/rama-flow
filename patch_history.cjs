const fs = require('fs');
let content = fs.readFileSync('src/pages/Marketing.tsx', 'utf8');

const historyFallback = `
    const saved = localStorage.getItem("rama_social_metrics");
    if (saved) {
      try { 
        const parsed = JSON.parse(saved);
        if (parsed.instagram && (!parsed.instagram.history || parsed.instagram.history.length < 2)) {
          // Provide mock history if empty
          parsed.instagram.history = [
            { name: "Sem 1", value: 132000 },
            { name: "Sem 2", value: 133500 },
            { name: "Sem 3", value: 134200 },
            { name: "Sem 4", value: parsed.instagram.followers }
          ];
          parsed.tiktok.history = [
            { name: "Sem 1", value: 235000 },
            { name: "Sem 2", value: 238000 },
            { name: "Sem 3", value: 240500 },
            { name: "Sem 4", value: parsed.tiktok.followers }
          ];
        }
        setSocialMetrics(parsed); 
      } catch (e) {}
    }
`;

content = content.replace(/const saved = localStorage\.getItem\("rama_social_metrics"\);\s*if \(saved\) \{[\s\S]*?\}\s*\} catch \(e\) \{\}\s*\}/, historyFallback.trim());

fs.writeFileSync('src/pages/Marketing.tsx', content, 'utf8');
console.log("Mock history patched!");
