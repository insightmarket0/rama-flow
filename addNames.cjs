const fs = require('fs');
let content = fs.readFileSync('src/pages/MuralAjustes.tsx', 'utf-8');

const oldSelect = `                    <SelectContent className="bg-[#111] border-white/10 text-white rounded-xl">
                      <SelectItem value="livre" className="hover:bg-white/10">Livre</SelectItem>
                      <SelectItem value="Rogrio" className="hover:bg-white/10">Rogrio</SelectItem>
                      <SelectItem value="Anderson" className="hover:bg-white/10">Anderson</SelectItem>
                    </SelectContent>`;

const newSelect = `                    <SelectContent className="bg-[#111] border-white/10 text-white rounded-xl">
                      <SelectItem value="livre" className="hover:bg-white/10">Livre</SelectItem>
                      <SelectItem value="Rogério" className="hover:bg-white/10">Rogério</SelectItem>
                      <SelectItem value="Anderson" className="hover:bg-white/10">Anderson</SelectItem>
                      <SelectItem value="Alyson" className="hover:bg-white/10">Alyson</SelectItem>
                      <SelectItem value="William" className="hover:bg-white/10">William</SelectItem>
                    </SelectContent>`;

content = content.replace(oldSelect, newSelect);
fs.writeFileSync('src/pages/MuralAjustes.tsx', content, 'utf-8');
console.log('Added names.');
