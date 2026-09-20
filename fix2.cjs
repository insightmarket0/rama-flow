const fs = require('fs');
let content = fs.readFileSync('src/pages/BusinessPlan.tsx', 'utf-8');

// Find where "Radar Logístico</span>\n                    </div>\n                  </div>\n                </div>\n\n" is
// and just replace the rest up to "app" tab.

const startStr = 'Radar Logstico</span>\n                    </div>\n                  </div>\n                </div>\n\n';
let startIndex = content.indexOf('Radar Log');
if (startIndex !== -1) {
    // Find the end of the col-direita div
    const endStr = '{activeTab === "app" && (';
    let endIndex = content.indexOf(endStr, startIndex);
    
    if (endIndex !== -1) {
        // The block should end with closing the main grid, then the wrapper div, then the condition.
        const replacement = `Radar Logístico</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        )}

        `;
        content = content.substring(0, startIndex) + replacement + content.substring(endIndex);
        fs.writeFileSync('src/pages/BusinessPlan.tsx', content, 'utf-8');
        console.log('Fixed duplicate closing tags');
    }
}
