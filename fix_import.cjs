const fs = require('fs');
let content = fs.readFileSync('src/pages/Marketing.tsx', 'utf8');

if (!content.includes('import { FaTiktok }')) {
    content = 'import { FaTiktok } from "react-icons/fa";\n' + content;
    fs.writeFileSync('src/pages/Marketing.tsx', content, 'utf8');
    console.log("Import injected");
} else {
    console.log("Import already exists?");
}
