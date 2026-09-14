const fs = require('fs');
let content = fs.readFileSync('src/components/layout/AppSidebar.tsx', 'utf-8');

// 1. Add Avatar import
if (!content.includes('import { Avatar')) {
    content = content.replace('import { useAuth } from "@/hooks/useAuth";', 'import { useAuth } from "@/hooks/useAuth";\\nimport { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";');
}

// 2. Change <aside> layout
content = content.replace(
    '<aside className="fixed left-0 top-0 h-screen w-24 flex flex-col items-center py-6 z-50">',
    '<aside className="fixed left-3 top-3 bottom-3 w-[72px] flex flex-col z-50">'
);

// 3. Move Logo and Pill Dock into a single container
content = content.replace(
    /\{\/\* Logo Solta no Topo \*\/\}[\\s\\S]*?\{\/\* Pill Dock \(A C[ǭ]psula\) \*\/\}\\s*<div className="bg-\\[#1C1C1E\\] border border-white\\/5 rounded-\\[40px\\] p-2\\.5 flex flex-col items-center gap-3 shadow-2xl relative">/,
    \{/* Sidebar Continua */}
        <div className="bg-[#111] border border-[#222] w-full h-full rounded-[40px] py-6 flex flex-col items-center shadow-2xl relative">
          {/* Logo no Topo */}
          <div className="mb-6 flex flex-col items-center justify-center group cursor-pointer hover:scale-110 transition-transform duration-300">
            <Sparkles className={\\\h-7 w-7 transition-colors \\\\} />
          </div>
          
          <div className="flex-1 flex flex-col items-center gap-2 overflow-y-auto custom-scrollbar w-full px-2">\
);

// 4. Change rounded-full to rounded-2xl for all icons
content = content.replace(/rounded-full flex items-center justify-center transition-all duration-300 relative/g, 'rounded-[18px] flex items-center justify-center transition-all duration-300 relative');

// 5. Replace bottom section
content = content.replace(
    /\{\/\* Separador \*\/\}[\\s\\S]*?<\/aside>/,
    \</div>
          
          {/* Fundo da Sidebar (Avatar e Logout) */}
          <div className="mt-auto pt-4 flex flex-col items-center gap-3 w-full px-2">
            <button 
              onClick={signOut}
              className="h-10 w-10 rounded-[18px] flex items-center justify-center text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
              title="Sair"
            >
              <LogOut className="h-4 w-4" />
            </button>
            
            <Avatar className="h-10 w-10 border-2 border-[#222] rounded-full mt-1">
              <AvatarImage src={user?.user_metadata?.avatar_url || (user?.email?.includes('mara') ? '/mara.png' : user?.email?.includes('rogerio') ? '/rogerio.png' : undefined)} />
              <AvatarFallback className="bg-[#333] text-white text-xs font-bold">
                {user?.email?.charAt(0).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </aside>\
);

fs.writeFileSync('src/components/layout/AppSidebar.tsx', content, 'utf-8');
console.log('Sidebar layout updated.');
