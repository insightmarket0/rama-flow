
import fs from "fs";
let bp = fs.readFileSync("src/pages/Metas.tsx", "utf8");

const startIdx = bp.indexOf("<div className=\"flex flex-col justify-between bg-[#111111]/80 backdrop-blur-md border border-white/5 rounded-2xl p-8 shadow-2xl\">");
const endIdx = bp.indexOf("<div className=\"grid grid-cols-1 md:grid-cols-3 gap-6 mt-6\">", startIdx);

if (startIdx !== -1 && endIdx !== -1) {
  let blockToRemove = bp.substring(startIdx, endIdx);
  bp = bp.replace(blockToRemove, "");
  fs.writeFileSync("src/pages/Metas.tsx", bp);
  console.log("Removed from Metas.tsx");
} else {
  console.log("Not found in Metas.tsx");
}

