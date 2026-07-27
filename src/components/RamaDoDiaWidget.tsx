import React, { useState, useEffect } from "react";
import { Sprout, Trees, Leaf } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export const RamaDoDiaWidget = () => {
  const { user } = useAuth();
  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    const calculateProgress = () => {
      const now = new Date();
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 8, 0, 0); // 08:00
      const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 18, 0, 0); // 18:00

      if (now < startOfDay) {
        setPercentage(0);
      } else if (now > endOfDay) {
        setPercentage(100);
      } else {
        const totalDuration = endOfDay.getTime() - startOfDay.getTime();
        const currentElapsed = now.getTime() - startOfDay.getTime();
        setPercentage(Math.round((currentElapsed / totalDuration) * 100));
      }
    };

    calculateProgress();
    const interval = setInterval(calculateProgress, 60000);
    return () => clearInterval(interval);
  }, []);
  
  let PlantIcon = Sprout;
  if (percentage >= 100) PlantIcon = Trees;
  else if (percentage >= 50) PlantIcon = Leaf;

  return (
    <div className="absolute bottom-4 right-4 flex flex-col items-center justify-center p-2 bg-transparent pointer-events-none opacity-90 z-10">
      
      {/* Center Graphic & Curve */}
      <div className="relative z-10 flex flex-col items-center w-full justify-center">
        
        {/* Plant Icon */}
        <div className="relative flex items-center justify-center">
          <PlantIcon 
            className="w-14 h-14 text-[#00FF00] relative z-10 drop-shadow-[0_0_10px_rgba(0,255,0,0.5)] transform transition-all duration-1000" 
            strokeWidth={1.5} 
            fill="currentColor" 
          />
        </div>

        {/* Beautiful Shallow SVG Curve under the plant */}
        <svg className="w-28 h-8 overflow-visible mt-1" viewBox="0 0 160 40">
          {/* Track Background */}
          <path 
            d="M 15 15 Q 80 45 145 15" 
            fill="none" 
            stroke="rgba(0,255,0,0.1)" 
            strokeWidth="5" 
            strokeLinecap="round" 
          />
          {/* Active Progress */}
          <path 
            d="M 15 15 Q 80 45 145 15" 
            fill="none" 
            stroke="#00FF00" 
            strokeWidth="5" 
            strokeLinecap="round"
            pathLength="100"
            strokeDasharray="100"
            strokeDashoffset={100 - percentage}
            className="transition-all duration-1000 ease-in-out drop-shadow-[0_0_5px_rgba(0,255,0,0.6)]" 
          />
        </svg>

      </div>

      {/* Bottom Text Area */}
      <div className="relative z-10 flex flex-col items-center mt-1">
        <h2 className="text-white text-xl font-extrabold tracking-tight leading-none" style={{ fontVariantNumeric: 'tabular-nums' }}>
          {percentage}%
        </h2>
        <span className="text-[#00FF00]/70 text-[8px] uppercase tracking-[0.2em] font-bold mt-1">
          A Rama do Dia
        </span>
      </div>

    </div>
  );
};
