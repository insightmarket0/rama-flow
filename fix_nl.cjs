const fs = require('fs');
let content = fs.readFileSync('src/pages/Marketing.tsx', 'utf-8');

content = content.replace(/Upside<\\/th>\\\\n\\s*<th/, 'Upside</th>\\n                      <th');
content = content.replace(/{partner.upside}<\\/td>\\\\n\\s*<td/, '{partner.upside}</td>\\n                        <td');

fs.writeFileSync('src/pages/Marketing.tsx', content, 'utf-8');
