import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { Calendar, Package, User } from "lucide-react";

export const MobileLayout = () => {
  const location = useLocation();

  const navItems = [
    {
      path: "/instalador",
      icon: Calendar,
      label: "Agenda",
    },
    {
      path: "/instalador/estoque",
      icon: Package,
      label: "Estoque",
    },
    {
      path: "/instalador/perfil",
      icon: User,
      label: "Perfil",
    },
  ];

  return (
    <div className="flex flex-col h-[100dvh] w-full bg-background overflow-hidden relative selection:bg-primary/30">
      
      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden bg-[#050505] pb-20 scroll-smooth">
        <Outlet />
      </main>

      {/* Floating Minimalist Navigation Pill */}
      <div className="fixed bottom-4 left-0 right-0 flex justify-center z-50 pointer-events-none px-4">
        <nav className="bg-[#111111]/90 backdrop-blur-xl border border-white/10 rounded-full flex items-center justify-center gap-4 px-6 py-2 shadow-[0_10px_40px_rgba(0,0,0,0.8)] pointer-events-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/instalador' && location.pathname.startsWith(item.path));
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className="relative flex flex-col items-center justify-center w-8 h-8 group"
              >
                {/* Active Indicator Dot */}
                {isActive && (
                  <div className="absolute -top-1 w-1 h-1 rounded-full bg-[#00FF00] shadow-[0_0_8px_#00FF00] transition-all duration-300" />
                )}
                
                <item.icon 
                  className={`transition-all duration-300 ${
                    isActive 
                      ? "text-white scale-110 w-5 h-5" 
                      : "text-gray-500 group-hover:text-gray-400 scale-100 w-4 h-4"
                  }`} 
                  strokeWidth={isActive ? 2.5 : 2}
                />
              </Link>
            );
          })}
        </nav>
      </div>

    </div>
  );
};
