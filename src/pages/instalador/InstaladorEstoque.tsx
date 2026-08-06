import React, { useState } from "react";
import { Package, Plus, Minus, AlertTriangle, ArrowRight } from "lucide-react";

const INITIAL_ESTOQUE = [
  { id: 1, nome: "Kit Gás 1 Metro", qtd: 5, minimo: 2 },
  { id: 2, nome: "Kit Gás 2 Metros", qtd: 3, minimo: 2 },
  { id: 3, nome: "Registro Baixa Pressão", qtd: 1, minimo: 2 },
  { id: 4, nome: "Mangueira Avulsa (m)", qtd: 15, minimo: 5 },
  { id: 5, nome: "Abraçadeira", qtd: 30, minimo: 10 },
];

export default function InstaladorEstoque() {
  const [estoque, setEstoque] = useState(INITIAL_ESTOQUE);

  const updateQtd = (id: number, delta: number) => {
    setEstoque(estoque.map(item => {
      if (item.id === id) {
        const newQtd = Math.max(0, item.qtd + delta);
        return { ...item, qtd: newQtd };
      }
      return item;
    }));
  };

  const hasLowStock = estoque.some(item => item.qtd <= item.minimo);

  return (
    <div className="flex flex-col min-h-[100dvh] bg-[#050505] text-white selection:bg-[#00FF00]/30">
      
      {/* Minimal Header */}
      <header className="sticky top-0 z-50 bg-[#050505]/80 backdrop-blur-xl pt-4 pb-4 px-6 flex flex-col gap-1 border-b border-white/5">
        <h1 className="text-3xl font-extrabold tracking-tight">Estoque da Van</h1>
        <p className="text-gray-400 text-sm">Controle de materiais no veículo.</p>
      </header>

      <main className="flex-1 px-6 py-4 flex flex-col gap-2 pb-32">
        {estoque.map((item) => {
          const isLow = item.qtd <= item.minimo;
          // Calcula a porcentagem para uma barrinha visual sutil (assumindo que o dobro do mínimo é um "estoque cheio")
          const maxQtd = item.minimo * 3; 
          const fillPercentage = Math.min(100, (item.qtd / maxQtd) * 100);

          return (
            <div key={item.id} className="flex flex-col gap-3 py-4 border-b border-white/5 group">
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-0.5">
                  <span className={`text-base font-semibold ${isLow ? 'text-red-500' : 'text-gray-100'}`}>
                    {item.nome}
                  </span>
                  
                  {isLow ? (
                    <span className="text-red-500 flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest mt-1">
                      <AlertTriangle className="w-3 h-3" /> Reposição Necessária
                    </span>
                  ) : (
                    <span className="text-gray-500 text-[9px] font-bold uppercase tracking-widest mt-1">
                      Nível Estável
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => updateQtd(item.id, -1)}
                    className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 transition-colors active:scale-90"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className={`text-xl font-bold w-6 text-center ${isLow ? 'text-red-500' : 'text-white'}`}>
                    {item.qtd}
                  </span>
                  <button 
                    onClick={() => updateQtd(item.id, 1)}
                    className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 transition-colors active:scale-90"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Progress Bar (Visual Indicator) */}
              <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${isLow ? 'bg-red-500' : 'bg-gray-600'}`}
                  style={{ width: `${fillPercentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </main>

      {/* Modern FAB - Floating at the bottom */}
      <div className="fixed bottom-[72px] left-0 right-0 px-6 z-40 pointer-events-none flex justify-center">
        <button 
          className={`pointer-events-auto w-full h-14 rounded-full font-bold text-sm tracking-widest uppercase flex justify-center items-center gap-3 shadow-2xl transition-all duration-500 active:scale-95 ${
            hasLowStock 
              ? 'bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.3)]' 
              : 'bg-[#111111] text-white border border-white/10 hover:bg-white/5'
          }`}
        >
          <Package className={`w-5 h-5 ${hasLowStock ? 'text-white' : 'text-[#00FF00]'}`} />
          {hasLowStock ? 'Solicitar Reposição Urgente' : 'Solicitar Reposição'}
          <ArrowRight className={`w-5 h-5 ${hasLowStock ? 'opacity-100' : 'opacity-50'}`} />
        </button>
      </div>

    </div>
  );
}
