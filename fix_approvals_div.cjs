const fs = require('fs');
let content = fs.readFileSync('src/pages/Marketing.tsx', 'utf8');

// The new block ends with:
//                     </div>
//                   </div>
// I will change it to end with:
//                     </div>
const searchString = `                        </div>
                      ))}
                    </div>
                  </div>`;
                  
const replaceString = `                        </div>
                      ))}
                    </div>`;

content = content.replace(searchString, replaceString);

fs.writeFileSync('src/pages/Marketing.tsx', content, 'utf8');
console.log("Removed the extra </div> from Approvals block.");
