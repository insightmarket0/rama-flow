const fs = require('fs');
let content = fs.readFileSync('src/pages/Lembretes.tsx', 'utf-8');

// 1. Encontrar e remover o Módulo de Captura Rápida do header
const headerInputRegex = /\s*\{\/\* Módulo de Captura Rápida no Topo \(Stealth Input\) \*\/\}\s*<div className="w-full md:w-\[450px\]">\s*<form onSubmit=\{handleAddThought\} className="relative group">[\s\S]*?<\/form>\s*<\/div>/m;

// Como os acentos podem estar corrompidos no arquivo (ex: Mdulo), vou usar regex mais flexível ou substring manual.

// Vamos achar a parte do header input
const startIndex = content.indexOf('{/* M');
const topDivEnd = content.indexOf('</div>', content.indexOf('</form>', startIndex)) + 6;

// Precisamos ter cuidado para não pegar coisa errada.
const headerTopSnippet = content.substring(content.indexOf('w-full md:w-[450px]'), content.indexOf('</form>', content.indexOf('w-full md:w-[450px]')) + 7);
console.log('Found top snippet to remove:', headerTopSnippet != null);

// 2. Local para inserir
const ideiasAvulsasHeader = `Ideias Avulsas
              </h3>
              <span className="text-[9px] font-bold uppercase tracking-widest bg-white/5 border border-white/10 text-gray-500 px-2 py-1 rounded">
                {ideas.length} Notas
              </span>
            </div>`;

const integratedInput = `Ideias Avulsas
              </h3>
              <span className="text-[9px] font-bold uppercase tracking-widest bg-white/5 border border-white/10 text-gray-500 px-2 py-1 rounded">
                {ideas.length} Notas
              </span>
            </div>

            {/* Input Integrado */}
            <form onSubmit={handleAddThought} className="relative group mb-4 shrink-0">
              <div className="relative flex items-center bg-[#0A0A0A] border border-white/5 group-focus-within:border-[#00FF00]/40 rounded-xl overflow-hidden transition-all shadow-lg group-focus-within:shadow-[0_0_20px_rgba(0,255,0,0.05)]">
                <div className="pl-4">
                  <BrainCircuit className="h-4 w-4 text-gray-500 group-focus-within:text-[#00FF00] transition-colors" />
                </div>
                <input 
                  type="text" 
                  value={quickThought}
                  onChange={(e) => setQuickThought(e.target.value)}
                  placeholder="O que está na sua mente agora?"
                  className="w-full bg-transparent border-none text-white text-xs px-3 py-3 focus:outline-none placeholder:text-gray-600"
                />
                <button 
                  type="submit"
                  disabled={!quickThought.trim()}
                  className="pr-4 pl-2 text-gray-600 hover:text-[#00FF00] disabled:opacity-30 disabled:hover:text-gray-600 transition-colors"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </form>`;

if (content.includes('w-full md:w-[450px]')) {
  // Remover div inteiro do header
  content = content.replace(/\{\/\* Mdulo de Captura Rǭpida.*[\s\S]*?<\/form>\s*<\/div>/, '');
  content = content.replace(/\{\/\* Módulo de Captura Rápida.*[\s\S]*?<\/form>\s*<\/div>/, '');
  // Backup se não funcionar a regex com caracteres especiais:
  content = content.replace(/<div className="w-full md:w-\[450px\]">[\s\S]*?<\/form>\s*<\/div>/, '');
}

content = content.replace(ideiasAvulsasHeader, integratedInput);

fs.writeFileSync('src/pages/Lembretes.tsx', content, 'utf-8');
console.log('Moved input to Ideias Avulsas column');
