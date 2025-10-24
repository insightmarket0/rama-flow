import { LayoutDashboard, ShoppingCart, CreditCard, Wallet, Users, LogOut } from "lucide-react";
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
  { title: "Condições de Pagamento", url: "/condicoes", icon: CreditCard },
  { title: "Contas a Pagar", url: "/contas", icon: Wallet },
  { title: "Fornecedores", url: "/fornecedores", icon: Users },
];

export function AppSidebar() {
  const { signOut } = useAuth();

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border p-6">
        <div className="flex items-center gap-3">
          {/* Logo: coloque o arquivo em public/assets/rama-logo.png ou .svg */}
          <div className="flex items-center">
            <img
              src="/assets/logo.png"
              alt="RAMA"
              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
              className="h-10 w-auto max-w-[40px] object-contain"
            />
            <div className="ml-3">
              <h1 className="text-xl font-bold text-sidebar-foreground">RAMA</h1>
              <p className="text-xs text-sidebar-foreground/70">Gestão Financeira</p>
            </div>
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
