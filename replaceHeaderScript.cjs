const fs = require('fs');
let content = fs.readFileSync('src/pages/MuralAjustes.tsx', 'utf-8');

const oldBlock = `{/* MINIMALIST HEADER */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-5 pt-0">
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-light text-white flex items-center gap-3">
                <LayoutGrid className="h-8 w-8 text-[#00FF00]" />
                Mural de Ajustes
              </h1>
              <p className="text-xs font-medium tracking-[0.2em] uppercase text-[#00FF00]">
                Correção de Erros e Otimização
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 group-focus-within:text-[#00FF00] transition-colors" />
                <input 
                  type="text" 
                  placeholder="Buscar SKU ou tarefa..." 
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="pl-10 pr-4 py-2.5 bg-white/[0.02] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-[#00FF00]/50 focus:bg-white/[0.05] transition-all w-64 md:w-80"
                />
              </div>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-[#00FF00] hover:bg-[#00FF00]/80 text-black px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-[0_0_15px_rgba(204,255,0,0.2)] hover:shadow-[0_0_20px_rgba(204,255,0,0.4)] flex items-center gap-2"
              >
                <Plus className="h-4 w-4" /> Novo Ticket
              </button>
            </div>
          </div>
  
          {/* MINIMALIST TABS */}
          <div className="flex flex-wrap gap-2 mb-6">`;

const newBlock = `{/* MINIMALIST HEADER */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-5 pt-0">
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-light text-white flex items-center gap-3">
                <LayoutGrid className="h-8 w-8 text-[#00FF00]" />
                Mural de Ajustes
              </h1>
              <p className="text-xs font-medium tracking-[0.2em] uppercase text-[#00FF00]">
                Correção de Erros e Otimização
              </p>
            </div>
          </div>
  
          {/* MINIMALIST TABS E ACTIONS */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
            <div className="flex flex-wrap gap-2">`;

// Fix encoding issues using string replacement but allowing variations.
// It's safer to use substrings instead of exact match for the whole block.
