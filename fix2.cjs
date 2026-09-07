const fs = require('fs');
const file = 'src/pages/Marketing.tsx';
let content = fs.readFileSync(file, 'utf8');

const targetStr = `                  </div>
                </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 1: CREATIVE STUDIO (Master-Detail / Notion Style) */}`;

const fixedStr = `                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 1: CREATIVE STUDIO (Master-Detail / Notion Style) */}`;

content = content.replace(targetStr, fixedStr);
fs.writeFileSync(file, content, 'utf8');
console.log('Fixed extra divs!');
