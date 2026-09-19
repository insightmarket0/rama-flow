
import fs from "fs";
let bp = fs.readFileSync("src/pages/BusinessPlan.tsx", "utf8");
let metas = fs.readFileSync("src/pages/Metas.tsx", "utf8");

const metasContentRegex = /<div className=\"flex-1 space-y-8 p-4 md:p-8 pt-6 animate-in fade-in duration-500\">(.*)/s;
const metasContentMatch = metas.match(metasContentRegex);
if(metasContentMatch) {
  let innerContent = metasContentMatch[1];
  innerContent = innerContent.replace(/<\/div>\s*<\/div>\s*\);\s*}\s*$/s, "</div>");
  
  const newTabContent = "\n        {activeTab === \"metas\" && (\n          <div className=\"animate-in fade-in slide-in-from-bottom-4 duration-700 flex flex-col gap-8\">\n            " + innerContent + "\n          </div>\n        )}";
  bp = bp.replace("{activeTab === \"estrategia\" &&", newTabContent + "\n\n        {activeTab === \"estrategia\" &&");
  fs.writeFileSync("src/pages/BusinessPlan.tsx", bp);
  console.log("Success");
}

