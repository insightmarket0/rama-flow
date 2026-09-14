
const fs = require("fs");
let content = fs.readFileSync("src/pages/Marketing.tsx", "utf-8");

let start = content.indexOf("{/* 3. Tabela de ROI de Influenciadores */}");
let tabEnd = content.indexOf("          {/* TAB 4:");
if (start !== -1 && tabEnd !== -1) {
    let before = content.substring(0, start);
    let after = content.substring(tabEnd);
    
    // We need to keep the closing tags of TAB 2:
    //             </div>
    //           )}
    
    content = before + "            </div>\\n          )}\\n\\n" + after;
    fs.writeFileSync("src/pages/Marketing.tsx", content, "utf-8");
    console.log("Deleted Scorecard.");
}

