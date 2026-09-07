const fs = require('fs');
const file = 'src/pages/Marketing.tsx';
let content = fs.readFileSync(file, 'utf8');

const target = `                  </table>
                </div>
              </div>
            )}`;
const fix = `                  </table>
                </div>
              </div>
              </div>
            )}`;
content = content.replace(target, fix);
fs.writeFileSync(file, content, 'utf8');
console.log('Added closing div');
