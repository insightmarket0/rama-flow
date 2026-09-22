const fs = require('fs');
let content = fs.readFileSync('src/pages/Lembretes.tsx', 'utf-8');

const regex = /<h3 className="text-xl font-bold text-white flex items-center gap-2">\s*<Lightbulb className="h-5 w-5 text-\[#00FF00\]" \/>\s*Ideias Avulsas\s*<\/h3>\s*<span className="text-\[9px\] font-bold uppercase tracking-widest bg-white\/5 border border-white\/10 text-gray-500 px-2 py-1 rounded">\s*\{ideas\.length\} Notas\s*<\/span>\s*<\/div>/;

const integratedInput = `<h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-[#00FF00]" />
                Ideias Avulsas
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

content = content.replace(regex, integratedInput);
fs.writeFileSync('src/pages/Lembretes.tsx', content, 'utf-8');
console.log('Inserted input via regex.');
