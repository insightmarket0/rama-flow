const fs = require('fs');
let content = fs.readFileSync('src/pages/Marketing.tsx', 'utf-8');

const badBlock = \                  </tbody>
                </table>
              </div>
            </div>
              </div>
            </div>
          )}\;

const goodBlock = \                  </tbody>
                </table>
              </div>
            </div>
              </div>
          )}\;

content = content.replace(badBlock, goodBlock);
fs.writeFileSync('src/pages/Marketing.tsx', content, 'utf-8');
console.log('Fixed extra div correctly');
