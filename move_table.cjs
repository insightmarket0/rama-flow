const fs = require('fs');
const file = 'src/pages/Marketing.tsx';
let content = fs.readFileSync(file, 'utf8');

const startStr = '{/* Tabela de Lead Quality / Parcerias (Esquerda, 8 colunas) */}';
const startIdx = content.indexOf(startStr);
const endStr = '{/* Social Media & TikTok Trackers (Compactos) */}';
const endIdx = content.indexOf(endStr);

if (startIdx !== -1 && endIdx !== -1) {
    const tableBlock = content.substring(startIdx, endIdx);
    
    // Remove it from cockpit
    content = content.substring(0, startIdx) + content.substring(endIdx);
    
    // Find CRM Tab
    const crmStr = '{/* TAB 2: CRM */}\n          {activeTab === "crm" && (\n            <div className="flex-1 bg-[#111] border border-[#222] rounded-lg overflow-hidden flex flex-col">';
    const crmIdx = content.indexOf('{/* TAB 2: CRM */}');
    
    // Wait, the CRM wrapper is `<div className="flex-1 bg-[#111] border border-[#222] rounded-lg overflow-hidden flex flex-col">`
    // I should change it to `<div className="flex-1 flex flex-col gap-4 overflow-hidden">` like I did before.
    
    const oldCrmWrapper = `<div className="flex-1 bg-[#111] border border-[#222] rounded-lg overflow-hidden flex flex-col">
              <div className="overflow-auto flex-1 custom-scrollbar">`;
              
    const newCrmWrapper = `<div className="flex-1 flex flex-col gap-4 overflow-hidden">
              
              ` + tableBlock.trim() + `
              
              {/* Tabela Principal CRM */}
              <div className="flex-1 bg-[#111] border border-[#222] rounded-lg overflow-hidden flex flex-col">
                <div className="overflow-auto flex-1 custom-scrollbar">`;

    content = content.replace(oldCrmWrapper, newCrmWrapper);
    
    // And add the extra closing div at the end of CRM
    const crmEnd = `                </table>
              </div>
            </div>
          )}`;
    const crmEndFix = `                </table>
              </div>
            </div>
            </div>
          )}`;
    content = content.replace(crmEnd, crmEndFix);

    fs.writeFileSync(file, content, 'utf8');
    console.log('Moved table to CRM!');
} else {
    console.log('Could not find table or end marker');
}
