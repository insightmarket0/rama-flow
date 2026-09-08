const fs = require('fs');
const file = 'src/pages/MeuDia.tsx';
let content = fs.readFileSync(file, 'utf8');

const s1 = '        {(user?.email === "mara@hotmail.com" || currentUserName.startsWith(';
const s2 = '          {/* 4. Card de Desempenho R'; // Rápido might have accents

const startIndex = content.indexOf(s1);
const endIndex = content.indexOf(s2);

if (startIndex !== -1 && endIndex !== -1) {
  // Extract the original condition string for Rogério to reuse it precisely
  const rogerioCondMatch = content.substring(startIndex, startIndex + 200).match(/currentUserName\.startsWith\([^)]+\)/);
  const rogerioCond = rogerioCondMatch ? rogerioCondMatch[0] : 'currentUserName.startsWith("Rogério")';

  const replacement = `        {/* TOP COMPONENT */}
        {(user?.email === "livia@hotmail.com" || ${rogerioCond}) ? (
          <PainelPagamentosHoje />
        ) : (
          announcements.length > 0 && (
            <div className="col-span-1 md:col-span-2 bg-[#111111] border-l-4 border-[#00FF00] rounded-2xl p-5 group relative shadow-lg h-fit">
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[#00FF00] font-bold tracking-tighter text-xl uppercase flex items-center gap-2">
                  <Megaphone className="h-5 w-5" strokeWidth={3} />
                  Mural
                </h3>
                <span className="text-[#00FF00] text-[10px] font-bold tracking-widest uppercase border border-[#00FF00]/20 px-2 py-0.5 rounded-full">
                  Prioridade
                </span>
              </div>
              
              <div className="space-y-3">
                {announcements.map(ann => (
                  <div key={ann.id} className="bg-black/30 rounded-xl p-4 border border-white/5 hover:bg-black/50 transition-colors">
                    <div>
                      <div className="flex items-center gap-2 mb-2 text-gray-400 font-bold text-[10px] uppercase tracking-wider">
                        <span>{ann.creator.full_name}</span>
                        {ann.is_pinned && <AlertTriangle className="h-3 w-3 text-amber-500" />}
                      </div>
                      <h4 className="text-white font-extrabold text-lg mb-1 leading-tight tracking-tight">
                        {ann.title}
                      </h4>
                    </div>
                    
                    <div className="flex items-end justify-between gap-4 mt-1">
                      <p className="text-gray-400 font-medium text-xs mb-0">
                        {ann.content}
                      </p>
                      <button 
                        onClick={() => handleAcknowledge(ann.id)}
                        className="bg-[#00FF00]/10 text-[#00FF00] border border-[#00FF00]/20 px-4 py-1.5 rounded-lg font-bold text-xs flex items-center gap-2 hover:bg-[#00FF00]/20 transition-colors w-fit shrink-0 mb-1"
                      >
                        Estou Ciente <CheckCircle2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          )
        )}

        {/* MIDDLE COMPONENT: Radar Logístico / ExpedicaoTracker for everyone */}
        <ExpedicaoTracker />

        {/* BOTTOM COMPONENT */}
        {(user?.email === "mara@hotmail.com" || ${rogerioCond}) ? (
          <MuralExpedicao user={user} />
        ) : (
          <>
            {adjustments.length > 0 && adjustments.map((adj, idx) => (
              <div key={adj.id} className="col-span-1 bg-[#111] border border-white/5 rounded-2xl p-5 flex flex-col justify-between hover:border-white/20 transition-colors group shadow-lg">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <Activity className="h-5 w-5 text-gray-500" />
                    <span className="bg-white/5 text-gray-300 text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border border-white/10">
                      {adj.marketplace}
                    </span>
                  </div>
                  <h4 className="text-white text-lg font-light tracking-tight leading-tight mb-2">
                    Ajuste: {adj.sku}
                  </h4>
                  <p className="text-gray-500 text-xs font-medium line-clamp-2">
                    {adj.description}
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t border-white/5">
                  <button 
                    onClick={() => handleResolveAdjustment(adj.id)}
                    className="text-[#00FF00] font-bold text-xs flex items-center gap-2 hover:gap-3 transition-all"
                  >
                    RESOLVER AGORA <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </>
        )}
\n`;

  content = content.substring(0, startIndex) + replacement + content.substring(endIndex);
  fs.writeFileSync(file, content, 'utf8');
  console.log('Replaced grid section!');
} else {
  console.log('Could not find markers: ' + startIndex + ' ' + endIndex);
}
