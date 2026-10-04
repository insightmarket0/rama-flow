import React from "react";
import { Package, Plus, Minus, AlertTriangle } from "lucide-react";
import { useEstoqueStore } from "../../store/useEstoqueStore";

export default function InstaladorEstoque() {
  const estoque = useEstoqueStore(state => state.itens);
  const atualizarQuantidade = useEstoqueStore(state => state.atualizarQuantidade);

  const updateQtd = (id: string, delta: number, currentQtd: number) => {
    const newQtd = Math.max(0, currentQtd + delta);
    atualizarQuantidade(id, newQtd);
  };

  const hasLowStock = estoque.some(item => item.quantidade <= item.minimo);

  return (
    <div className="flex flex-col min-h-[100dvh] bg-[#F8F9FA] text-[#1A1C1E] selection:bg-purple-200">
      
      <main className="flex-1 px-6 pt-6 pb-40 flex flex-col gap-4">
        {estoque.map((item) => {
          const isLow = item.quantidade <= item.minimo;
          const maxQtd = item.minimo * 3; 
          const fillPercentage = Math.min(100, (item.quantidade / maxQtd) * 100);

          return (
            <div key={item.id} className="bg-white rounded-3xl p-5 flex flex-col gap-4 shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <span className="text-[15px] font-bold text-[#1A1C1E]">
                    {item.nome}
                  </span>
                  
                  {isLow ? (
                    <span className="text-red-500 bg-red-50 px-2 py-0.5 rounded-full w-fit flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest mt-1">
                      <AlertTriangle className="w-3 h-3" /> Reposição
                    </span>
                  ) : (
                    <span className="text-green-600 bg-green-50 px-2 py-0.5 rounded-full w-fit flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest mt-1">
                      Estável
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => updateQtd(item.id, -1, item.quantidade)}
                    className="w-10 h-10 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors active:scale-95"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <span className={`text-xl font-black w-6 text-center ${isLow ? 'text-red-600' : 'text-[#1A1C1E]'}`}>
                    {item.quantidade}
                  </span>
                  <button 
                    onClick={() => updateQtd(item.id, 1, item.quantidade)}
                    className="w-10 h-10 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors active:scale-95"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Progress Bar (Visual Indicator) */}
              <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${isLow ? 'bg-red-500' : 'bg-purple-500'}`}
                  style={{ width: `${fillPercentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </main>

      {/* Modern FAB - Floating above the bottom nav */}
      <div className="fixed bottom-28 left-0 right-0 px-6 z-40 pointer-events-none flex justify-center">
        <button 
          className={`pointer-events-auto w-full h-14 rounded-2xl font-bold text-sm flex justify-center items-center gap-3 shadow-lg transition-all duration-300 active:scale-95 ${
            hasLowStock 
              ? 'bg-white text-red-500 border border-red-100 hover:bg-red-50' 
              : 'bg-white text-purple-600 border border-purple-100 hover:bg-purple-50'
          }`}
        >
          <Package className="w-5 h-5" />
          {hasLowStock ? 'Solicitar Reposição Urgente' : 'Solicitar Reposição'}
        </button>
      </div>

    </div>
  );
}
