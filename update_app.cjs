const fs = require('fs');
let content = fs.readFileSync('src/pages/BusinessPlan.tsx', 'utf8');

// 1. Add "app" to the activeTab state
content = content.replace(
  'useState<"estrategia" | "ecossistema">("estrategia");',
  'useState<"estrategia" | "ecossistema" | "app">("estrategia");'
);

// 2. Add the button to the tabs
const newTabs = `<button 
              onClick={() => setActiveTab("estrategia")}
              className={\`px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all \${
                activeTab === "estrategia" ? "bg-white/10 text-white shadow-sm" : "text-gray-500 hover:text-gray-300"
              }\`}
            >
              Plano Diretor
            </button>
            <button 
              onClick={() => setActiveTab("ecossistema")}
              className={\`px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all \${
                activeTab === "ecossistema" ? "bg-white/10 text-white shadow-sm" : "text-gray-500 hover:text-gray-300"
              }\`}
            >
              Ecossistema Operacional
            </button>
            <button 
              onClick={() => setActiveTab("app")}
              className={\`px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all \${
                activeTab === "app" ? "bg-white/10 text-white shadow-sm" : "text-gray-500 hover:text-gray-300"
              }\`}
            >
              Visão App (Futuro)
            </button>`;

content = content.replace(
  /<button[\s\S]*?>\s*Plano Diretor\s*<\/button>\s*<button[\s\S]*?>\s*Ecossistema Operacional\s*<\/button>/,
  newTabs
);

// 3. Add the App Tab Content at the end of the tabs
const appTabContent = `        {activeTab === "app" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 flex flex-col items-center pb-20">
            <div className="text-center mb-8">
              <h2 className="text-white text-3xl font-light tracking-tight">O Futuro do E-commerce</h2>
              <p className="text-gray-400 font-light max-w-lg mt-2">
                Simulação da nossa futura plataforma proprietária: uma experiência nativa de compra guiada por 
                conteúdo, vídeos curtos (TikTok-style) e muita prova social.
              </p>
            </div>

            {/* Simulação do Celular */}
            <div className="relative w-[340px] h-[720px] bg-black rounded-[3rem] border-[8px] border-[#1A1A1A] shadow-2xl overflow-hidden flex flex-col ring-1 ring-white/10">
              
              {/* Notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-[#1A1A1A] rounded-b-3xl z-50" />

              {/* Status Bar */}
              <div className="absolute top-0 w-full h-12 flex justify-between items-center px-6 z-40 text-white text-[10px] font-medium pt-2">
                <span>9:41</span>
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full border border-white/50" />
                  <div className="w-3 h-3 rounded-full border border-white/50" />
                  <div className="w-4 h-3 bg-white/80 rounded-[2px]" />
                </div>
              </div>

              {/* Feed de Vídeo (TikTok Style) */}
              <div className="relative flex-1 bg-[#111] overflow-hidden group cursor-pointer">
                
                {/* Vídeo / Imagem de Fundo Simulando o Feed */}
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1540569014015-19a7be504e3a?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center opacity-60 mix-blend-luminosity" />
                
                {/* Gradientes para Leitura */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/90" />

                {/* Overlays do Feed */}
                <div className="absolute bottom-0 left-0 w-full p-4 pb-20 flex justify-between items-end">
                  
                  {/* Info do Produto (Esquerda) */}
                  <div className="flex-1 pr-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-xs">
                        RF
                      </div>
                      <span className="text-white font-medium text-sm drop-shadow-md">@ramaflow</span>
                      <span className="bg-white/20 text-white text-[9px] px-1.5 py-0.5 rounded-sm backdrop-blur-sm">Patrocinado</span>
                    </div>
                    <p className="text-white text-sm font-light mb-3 drop-shadow-md line-clamp-2">
                      Testei o Kit de Instalação de Gás com Válvula de Segurança da Rama Flow. Olha a facilidade e a economia! 🔥🛠️
                    </p>
                    
                    {/* Card do Produto Linkado */}
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-3 flex gap-3 items-center cursor-pointer hover:bg-white/20 transition-colors">
                      <div className="w-12 h-12 bg-black/40 rounded-lg flex items-center justify-center">
                        <Box className="text-[#00FF00] w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-white text-xs font-bold leading-tight">Kit Mangueira + Registro</h4>
                        <div className="flex items-center gap-1 mt-1">
                          <span className="text-[#00FF00] font-bold text-sm">R$ 89,90</span>
                          <span className="text-gray-400 text-[10px] line-through">R$ 120</span>
                        </div>
                      </div>
                      <div className="bg-[#00FF00] text-black w-8 h-8 rounded-full flex items-center justify-center">
                        <ShoppingCart className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  {/* Interações (Direita) */}
                  <div className="flex flex-col items-center gap-4 pb-4">
                    <div className="flex flex-col items-center gap-1 group/btn">
                      <div className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/10 group-hover/btn:bg-white/20">
                        <Heart className="w-5 h-5 text-white" fill="white" />
                      </div>
                      <span className="text-white text-[10px] font-bold">12.4k</span>
                    </div>
                    
                    <div className="flex flex-col items-center gap-1 group/btn">
                      <div className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/10 group-hover/btn:bg-white/20">
                        <MessageCircle className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-white text-[10px] font-bold">842</span>
                    </div>

                    <div className="flex flex-col items-center gap-1 group/btn">
                      <div className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/10 group-hover/btn:bg-white/20">
                        <Share2 className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-white text-[10px] font-bold">Compartilhar</span>
                    </div>
                  </div>

                </div>

                {/* Reviews Overlay Flutuante (Simulando comentários pulando na tela) */}
                <div className="absolute top-1/4 left-4 right-16 space-y-2 pointer-events-none opacity-80">
                   <div className="bg-black/60 backdrop-blur-md p-2 rounded-xl border border-white/10 w-fit animate-pulse">
                     <span className="text-white text-[10px] font-bold">João M.</span>
                     <p className="text-gray-200 text-xs">Produto top! Chegou no mesmo dia.</p>
                   </div>
                   <div className="bg-black/60 backdrop-blur-md p-2 rounded-xl border border-white/10 w-fit ml-8 animate-pulse delay-150">
                     <span className="text-white text-[10px] font-bold">Marcia T.</span>
                     <p className="text-gray-200 text-xs">Excelente, técnico super educado.</p>
                   </div>
                </div>

              </div>

              {/* Barra de Navegação Inferior (App) */}
              <div className="h-16 bg-[#111] border-t border-white/10 flex justify-around items-center px-2 z-40">
                <div className="flex flex-col items-center gap-1 text-gray-500 cursor-pointer hover:text-white transition-colors">
                  <Home className="w-5 h-5" />
                  <span className="text-[8px] font-bold uppercase tracking-wider">Início</span>
                </div>
                <div className="flex flex-col items-center gap-1 text-gray-500 cursor-pointer hover:text-white transition-colors">
                  <Search className="w-5 h-5" />
                  <span className="text-[8px] font-bold uppercase tracking-wider">Buscar</span>
                </div>
                <div className="flex flex-col items-center gap-1 text-[#00FF00] cursor-pointer">
                  <div className="w-10 h-8 rounded-xl bg-white flex items-center justify-center relative shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                    <div className="absolute -left-1 w-1 h-3 bg-[#00FF00] rounded-l-sm" />
                    <div className="absolute -right-1 w-1 h-3 bg-red-500 rounded-r-sm" />
                    <Play className="w-4 h-4 text-black" fill="black" />
                  </div>
                </div>
                <div className="flex flex-col items-center gap-1 text-gray-500 cursor-pointer hover:text-white transition-colors">
                  <ShoppingCart className="w-5 h-5 relative" />
                  <div className="absolute top-3 right-6 w-1.5 h-1.5 bg-[#00FF00] rounded-full" />
                  <span className="text-[8px] font-bold uppercase tracking-wider">Carrinho</span>
                </div>
                <div className="flex flex-col items-center gap-1 text-gray-500 cursor-pointer hover:text-white transition-colors">
                  <User className="w-5 h-5" />
                  <span className="text-[8px] font-bold uppercase tracking-wider">Perfil</span>
                </div>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}
`;

// Replace the end of the ecossistema tab
content = content.replace(
  '          </div>\n        )}\n\n      </div>\n    </div>\n  );\n}',
  '          </div>\n        )}\n\n' + appTabContent
);

// We need to add Heart, Share2, Play, Search, User, Home, MessageCircle, etc to lucide-react import
const extraIcons = ["Heart", "MessageCircle", "Share2", "Play", "Search", "User", "Home", "ShoppingCart"];
extraIcons.forEach(icon => {
  if (!content.includes(icon + ",")) {
     content = content.replace("Briefcase,", icon + ",\n  Briefcase,");
  }
});

fs.writeFileSync('src/pages/BusinessPlan.tsx', content, 'utf8');
