import React from "react";
import ArtDemandBoard from "@/components/marketing/ArtDemandBoard";

export default function DemandasArtes() {
  return (
    <div className="flex flex-col h-full w-full pl-24 bg-[#040809] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#071618] via-[#040809] to-[#020404] font-sans pb-20 md:pb-0 overflow-hidden relative">
      <div className="p-4 md:p-5 max-w-[1400px] w-full mx-auto h-full flex flex-col gap-1 relative z-10">
        
        {/* Header Compacto Premium */}
        <div className="flex items-center justify-between shrink-0 mb-[-10px]">
          <div>
            <h1 className="text-xl font-semibold text-white tracking-tight flex items-center gap-2">
              DEMANDAS DE <span className="text-cyan-400 font-light">ARTES</span>
            </h1>
            <p className="text-gray-400 text-xs mt-0.5">Gestão de criativos, campanhas e aprovações de design.</p>
          </div>
        </div>

        {/* Board */}
        <div className="flex-1 overflow-hidden flex flex-col min-h-0">
          <ArtDemandBoard />
        </div>
      </div>
    </div>
  );
}
