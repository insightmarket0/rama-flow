const fs = require('fs');
let content = fs.readFileSync('src/pages/Marketing.tsx', 'utf8');

if (!content.includes('AreaChart')) {
    content = content.replace(
        'import React, { useState } from "react";', 
        'import React, { useState } from "react";\nimport { AreaChart, Area, ResponsiveContainer, YAxis } from "recharts";'
    );
    fs.writeFileSync('src/pages/Marketing.tsx', content, 'utf8');
    console.log("Injected recharts imports.");
}
