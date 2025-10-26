import { LayoutDashboard, ShoppingCart, Wallet, Users, LogOut, Calendar, ClipboardList } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";

const menuItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Pedidos de Compra", url: "/pedidos", icon: ShoppingCart },
  { title: "Contas a Pagar", url: "/contas", icon: Wallet },
  { title: "Contas Fixas", url: "/contas-fixas", icon: Calendar },
  { title: "Cotações", url: "/quotations", icon: ClipboardList },
  { title: "Fornecedores", url: "/fornecedores", icon: Users },
];

export function AppSidebar() {
  const { signOut } = useAuth();

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border p-6 bg-gradient-to-br from-accent/10 via-transparent to-primary/5">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 bg-accent/20 blur-xl rounded-full" />
            <img
              src="/assets/logo.png"
              alt="RAMA"
              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
              className="relative h-14 w-auto object-contain"
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-wide text-sidebar-foreground">RAMA</h1>
            <p className="text-xs font-medium text-accent">Gestão Financeira</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url}
                      className={({ isActive }) => 
                        isActive ? "bg-sidebar-accent" : ""
                      }
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={signOut}>
              <LogOut className="h-4 w-4" />
              <span>Sair</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
