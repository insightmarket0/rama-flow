const fs = require('fs');
let content = fs.readFileSync('src/pages/Marketing.tsx', 'utf-8');

const bad = `                  </tbody>
                </table>
              </div>
            </div>
              </div>
            </div>
          )}
      </div>

      </div>`;

const good = `                  </tbody>
                </table>
              </div>
            </div>
              </div>
          )}
      </div>

      </div>`;

content = content.replace(bad, good);
fs.writeFileSync('src/pages/Marketing.tsx', content, 'utf-8');
console.log('Fixed extra div');
