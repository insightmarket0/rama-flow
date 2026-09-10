const fs = require('fs');
let content = fs.readFileSync('src/pages/Marketing.tsx', 'utf8');

// Find all occurrences of "const [isNewMonthPromptOpen, setIsNewMonthPromptOpen] = useState(false);"
const duplicate = "  const [isNewMonthPromptOpen, setIsNewMonthPromptOpen] = useState(false);\n";
let firstIndex = content.indexOf(duplicate);
if (firstIndex !== -1) {
    let secondIndex = content.indexOf(duplicate, firstIndex + 1);
    if (secondIndex !== -1) {
        // remove the second one
        content = content.substring(0, secondIndex) + content.substring(secondIndex + duplicate.length);
        fs.writeFileSync('src/pages/Marketing.tsx', content, 'utf8');
        console.log("Removed duplicate isNewMonthPromptOpen");
    } else {
        console.log("Only one found?");
    }
}
