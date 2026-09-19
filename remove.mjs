
import fs from "fs";
let bp = fs.readFileSync("src/pages/BusinessPlan.tsx", "utf8");

// change lg:col-span-8 to 12
bp = bp.replace(/lg:col-span-8/g, "lg:col-span-12");

// remove the lg:col-span-4 block
const startIdx = bp.indexOf("<div className=\"lg:col-span-4 flex flex-col gap-4\">");
const endIdx = bp.indexOf("</section>", startIdx);

// The div finishes before the </section>. We can just replace the specific strings.
let blockToRemove = bp.substring(startIdx, endIdx);
// Find the exact closing tag. It has 4 nested divs, wait.
// It"s safer to just replace by regex.
const regex = /<div className=\"lg:col-span-4 flex flex-col gap-4\">[\s\S]*?Abertura de Novo CD<\/span>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/div>/;

bp = bp.replace(regex, "");

fs.writeFileSync("src/pages/BusinessPlan.tsx", bp);
console.log("Removed");

