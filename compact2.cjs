
const fs = require("fs");
let content = fs.readFileSync("src/pages/Marketing.tsx", "utf-8");

// Subtitle
let idx1 = content.indexOf("<p className=\"text-gray-400 text-xs mt-0.5\">Gest");
if (idx1 !== -1) {
    let end1 = content.indexOf("</p>", idx1);
    content = content.substring(0, idx1) + content.substring(end1 + 4);
}

// Visao Analitica Tab
let idx2 = content.indexOf("{ id: \"cockpit\", label: \"Vis");
if (idx2 !== -1) {
    let end2 = content.indexOf("},", idx2);
    content = content.substring(0, idx2) + content.substring(end2 + 2);
}

// Compact 1
content = content.replace(
    "<div className=\"p-4 md:p-5 max-w-[1400px] w-full mx-auto h-full flex flex-col gap-4 relative z-10\">",
    "<div className=\"p-2 md:p-3 max-w-[1400px] w-full mx-auto h-full flex flex-col gap-2 relative z-10\">"
);

// Compact 2
content = content.replace(
    "<div className=\"flex-1 overflow-y-auto pr-2 custom-scrollbar pb-6 mt-4\">",
    "<div className=\"flex-1 overflow-y-auto pr-2 custom-scrollbar pb-2 mt-1\">"
);

// Compact 3
content = content.replace(
    "<div className=\"mt-6 flex flex-col gap-6 max-w-full pb-4\">",
    "<div className=\"mt-3 flex flex-col gap-3 max-w-full pb-2\">"
);

fs.writeFileSync("src/pages/Marketing.tsx", content, "utf-8");
console.log("Compacted successfully");

