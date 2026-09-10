const fs = require('fs');
let content = fs.readFileSync('src/pages/Marketing.tsx', 'utf8');
if (!content.includes('import { FaTiktok }')) {
    content = content.replace(
        'import React, { useState } from "react";',
        'import React, { useState } from "react";\nimport { FaTiktok } from "react-icons/fa";'
    );
    fs.writeFileSync('src/pages/Marketing.tsx', content, 'utf8');
    console.log("Injected FaTiktok import.");
}
