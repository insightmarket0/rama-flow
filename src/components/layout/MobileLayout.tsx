import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { Home, CalendarDays, CreditCard, Settings, Wrench } from "lucide-react";

export const MobileLayout = () => {
  const location = useLocation();

  const navItems = [
    {
      path: "/instalador",
      icon: Home,
      label: "Home",
    },
    {
      path: "/instalador/servicos",
      icon: CalendarDays,
      label: "Agenda",
    },
    {
      path: "/instalador/estoque",
      icon: Wrench,
      label: "Estoque",
    },
    {
      path: "/instalador/perfil",
      icon: Settings,
      label: "Perfil",
    },
  ];

  return (
    <div className="flex flex-col h-[100dvh] w-full bg-[#F8F9FA] overflow-hidden relative font-sans text-gray-900 selection:bg-purple-200">
      
      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden bg-[#F8F9FA] pb-28 scroll-smooth">
        <Outlet />
      </main>

      {/* Floating Bottom Nav (Light Fintech style) */}
      <div className="fixed bottom-6 left-6 right-6 z-50 pointer-events-none">
        <div className="bg-white rounded-full px-6 py-4 flex justify-between items-center shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100 pointer-events-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/instalador' && location.pathname.startsWith(item.path));
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center gap-1 transition-colors ${isActive ? 'text-purple-600' : 'text-gray-400 hover:text-purple-400'}`}
              >
                <item.icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
                <span className={`text-[9px] ${isActive ? 'font-bold' : 'font-medium'}`}>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

    </div>
  );
};
