import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { 
  Zap, 
  Target, 
  Megaphone, 
  ClipboardList, 
  CheckSquare, 
  BookOpen, 
  LineChart, 
  LayoutDashboard, 
  Trophy, 
  ShoppingCart, 
  Wallet, 
  Calendar, 
  CalendarPlus,
  Users,
  LogOut,
  Sparkles,
  Home,
  MessageCircle,
  Package,
  AlertTriangle,
  Wrench,
  Heart,
  DollarSign
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

// Grupos da Nova Sidebar Minimalista
const NAV_GROUPS = [
  {
    id: "home",
    icon: Home,
    title: "Início",
    mainLink: "/meu-dia",
    subItems: [] // Sem sub-itens, clica direto
  },

  {
    id: "operacao",
    icon: Zap,
    title: "Operação",
    subItems: [
      { title: "Mural de Ajustes", url: "/mural-ajustes", icon: ClipboardList },
      { title: "Mural de Alinhamento", url: "/mural-alinhamento", icon: Megaphone },
      { title: "Workspace Pessoal", url: "/lembretes", icon: CheckSquare },
    ]
  },
  {
    id: "comercial",
    icon: ShoppingCart,
    title: "Comercial",
    subItems: [
      { title: "Dashboard Pedidos", url: "/dashboard", icon: LayoutDashboard },
      { title: "Contas Fixas (Novo)", url: "/contas-fixas", icon: CalendarPlus },
      { title: "Cotações", url: "/quotations", icon: ClipboardList },
      { title: "Fornecedores", url: "/fornecedores", icon: Users },
      { title: "Contas a Pagar", url: "/contas", icon: Wallet },
    ]
  },
  {
    id: "expedicao",
    icon: Package,
    title: "Expedição",
    subItems: [
      { title: "Portal de Expedição", url: "/expedicao", icon: LayoutDashboard },
      { title: "Central de Compras", url: "/suprimentos", icon: ShoppingCart },
    ]
  },
  {
    id: "marketing",
    icon: Megaphone,
    title: "Marketing & Growth",
    mainLink: "/marketing",
    subItems: [
      { title: "Dashboard Marketing", url: "/marketing", icon: Megaphone },
    ]
  },
  {
    id: "gestao",
    icon: LineChart,
    title: "Gestão",
    subItems: [
      { title: "Metas e Visão", url: "/metas", icon: Target },
      { title: "Playbooks (SOPs)", url: "/playbooks", icon: BookOpen },
      { title: "Identidade da Marca", url: "/brand-book", icon: Heart },
    ]
  },
  {
    id: "equipe",
    icon: Users,
    title: "Equipe",
    subItems: [
      { title: "Dashboard Financeiro", url: "/dashboard-financeiro", icon: LineChart },
      { title: "Gestão de Equipe", url: "/equipe", icon: Users },
    ]
  }
];

export function AppSidebar() {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const [hoveredGroup, setHoveredGroup] = useState<string | null>(null);
  const [pendingPurchases, setPendingPurchases] = useState(0);

  useEffect(() => {
    const checkPending = async () => {
      try {
        const { count, error } = await supabase
          .from('supply_requests')
          .select('*', { count: 'exact', head: true })
          .or('status.eq.pendente,status.is.null');
        
        if (error) {
          // Fallback para visualização se a tabela não existir
          setPendingPurchases(1);
        } else {
          setPendingPurchases(count || 0);
        }
      } catch (err) {
        setPendingPurchases(1);
        console.error(err);
      }
    };
    checkPending();
    
    const channel = supabase.channel('supply_sidebar').on('postgres_changes', {
      event: '*', schema: 'public', table: 'supply_requests'
    }, checkPending).subscribe();
    
    return () => { supabase.removeChannel(channel); };
  }, []);
  
  const isMarketing = location.pathname === '/marketing' || location.pathname === '/brand-book';

  const filteredNavGroups = NAV_GROUPS.map(group => {
    let modifiedGroup = { ...group };

    if (group.id === "equipe") {
      if (user?.email !== "livia@hotmail.com" && user?.email !== "rogerio@ramaflow.com" && user?.email !== "suporte.ramamagazine@gmail.com") {
        modifiedGroup.subItems = modifiedGroup.subItems.filter(item => item.url !== "/dashboard-financeiro");
      }
    }

    if (user?.email === "mara@hotmail.com") {
      if (!["home", "gestao", "expedicao", "operacao"].includes(group.id)) {
        return null;
      }
      if (group.id === "operacao") {
        modifiedGroup.subItems = modifiedGroup.subItems.filter(
          item => item.url !== "/mural-ajustes" && item.url !== "/mural-alinhamento"
        );
      }
    }

    return modifiedGroup;
  }).filter(Boolean) as typeof NAV_GROUPS;

  if (user?.email === "mara@hotmail.com") {
    const maraOrder = ["home", "expedicao", "operacao", "gestao"];
    filteredNavGroups.sort((a, b) => {
      let idxA = maraOrder.indexOf(a.id);
      let idxB = maraOrder.indexOf(b.id);
      if (idxA === -1) idxA = 999;
      if (idxB === -1) idxB = 999;
      return idxA - idxB;
    });
  }

  // Helper para checar se algum sub-item do grupo está ativo
  const isGroupActive = (group: typeof NAV_GROUPS[0]) => {
    if (group.mainLink === location.pathname) return true;
    return group.subItems.some(item => location.pathname === item.url);
  };

  return (
    <>
      {/* Container Principal da Sidebar (Fixo à esquerda) */}
      <aside className="fixed left-0 top-0 h-screen w-24 flex flex-col items-center py-6 z-50">
        
        {/* Logo Solta no Topo */}
        <div className="mb-8 flex flex-col items-center justify-center group cursor-pointer hover:scale-110 transition-transform duration-300">
          <Sparkles className={`h-8 w-8 transition-colors ${isMarketing ? 'text-cyan-400 group-hover:text-cyan-300 drop-shadow-[0_0_10px_rgba(6,182,212,0.3)]' : 'text-primary group-hover:text-white'}`} />
        </div>

        {/* Pill Dock (A Cápsula) */}
        <div className="bg-[#1C1C1E] border border-white/5 rounded-[40px] p-2.5 flex flex-col items-center gap-3 shadow-2xl relative">
          
          {filteredNavGroups.map((group) => {
            const active = isGroupActive(group);
            const Icon = group.icon;

            return (
              <div 
                key={group.id}
                className="relative flex items-center group"
                onMouseEnter={() => setHoveredGroup(group.id)}
                onMouseLeave={() => setHoveredGroup(null)}
              >
                {/* Botão Principal da Cápsula */}
                {group.subItems.length <= 1 ? (
                  // Link direto (Home ou Único Item)
                  <NavLink
                    to={group.subItems.length === 1 ? group.subItems[0].url : group.mainLink!}
                    title={group.title}
                    className={`h-12 w-12 rounded-full flex items-center justify-center transition-all duration-300 relative ${
                      active 
                        ? group.special 
                          ? "bg-[#00FF00] text-black shadow-[0_0_20px_rgba(0,255,0,0.5)]" 
                          : isMarketing 
                            ? "bg-cyan-500 text-black shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                            : "bg-primary text-black shadow-[0_0_15px_rgba(34,197,94,0.4)]" 
                        : group.special 
                          ? isMarketing
                            ? "text-cyan-400 hover:bg-cyan-500/20 bg-cyan-500/10"
                            : "text-[#00FF00] hover:bg-[#00FF00]/20 bg-[#00FF00]/10" 
                          : "text-gray-400 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <Icon className={`h-5 w-5 ${active ? 'fill-black' : ''}`} />
                    {group.special && !active && (
                      <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-[#1C1C1E] animate-bounce" />
                    )}
                  </NavLink>
                ) : (
                  // Botão que abre menu (Outros)
                  <button
                    className={`h-12 w-12 rounded-full flex items-center justify-center transition-all duration-300 relative ${
                      active 
                        ? isMarketing
                          ? "bg-cyan-500 text-black shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                          : "bg-primary text-black shadow-[0_0_15px_rgba(34,197,94,0.4)]" 
                        : "text-gray-400 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <Icon className={`h-5 w-5 ${active ? 'fill-black' : ''}`} />
                    {group.id === "comercial" && pendingPurchases > 0 && (
                      <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-[#1C1C1E] animate-bounce" />
                    )}
                  </button>
                )}

                {group.subItems.length > 1 && hoveredGroup === group.id && (
                  <div className="absolute left-10 top-1/2 -translate-y-1/2 pl-6 py-12 z-50">
                    <div className="bg-[#0a0a0a]/95 backdrop-blur-2xl border border-white/10 rounded-2xl p-2 w-64 shadow-[0_0_40px_rgba(0,0,0,0.9)] animate-in fade-in slide-in-from-left-2 duration-200">
                      <div className="px-3 py-2 mb-2 border-b border-white/5 flex items-center gap-2">
                        <span className={`h-1.5 w-1.5 rounded-full ${isMarketing ? 'bg-cyan-400 shadow-[0_0_5px_rgba(6,182,212,0.5)]' : 'bg-[#00FF00] shadow-[0_0_5px_rgba(0,255,0,0.5)]'}`}></span>
                        <span className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">
                          {group.title}
                        </span>
                      </div>
                      <div className="flex flex-col gap-1">
                        {group.subItems.map((sub) => (
                          <NavLink
                            key={sub.url}
                            to={sub.url}
                            className={({ isActive }) =>
                              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group border relative ${
                                isActive
                                  ? isMarketing
                                    ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20 shadow-[0_0_10px_rgba(6,182,212,0.05)]"
                                    : "bg-[#00FF00]/10 text-[#00FF00] border-[#00FF00]/20 shadow-[0_0_10px_rgba(0,255,0,0.05)]"
                                  : "border-transparent text-gray-400 hover:bg-white/5 hover:border-white/5 hover:text-white"
                              }`
                            }
                          >
                            {({ isActive }) => (
                              <>
                                <sub.icon className={`h-4 w-4 ${isActive ? (isMarketing ? "drop-shadow-[0_0_5px_rgba(6,182,212,0.5)]" : "drop-shadow-[0_0_5px_rgba(0,255,0,0.5)]") : (isMarketing ? "group-hover:text-cyan-400" : "group-hover:text-[#00FF00]")} transition-colors`} />
                                {sub.title}
                                {sub.url === "/suprimentos" && pendingPurchases > 0 && (
                                  <span className="ml-auto flex items-center justify-center min-w-[20px] h-5 rounded-full bg-red-500 text-white text-[10px] font-bold px-1.5 shadow-[0_0_10px_rgba(239,68,68,0.5)] animate-pulse">
                                    {pendingPurchases}
                                  </span>
                                )}
                              </>
                            )}
                          </NavLink>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* Separador */}
          <div className="w-8 h-px bg-white/10 my-1" />

          {/* Botão de Sair (Logout) no fundo da pílula */}
          <button 
            onClick={signOut}
            className="h-12 w-12 rounded-full flex items-center justify-center text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
            title="Sair"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </aside>
    </>
  );
}
