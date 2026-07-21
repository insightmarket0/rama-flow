import { AppSidebar } from "./AppSidebar";
import { ThemeToggle } from "./ThemeToggle";
import { GlobalDialogs } from "./GlobalDialogs";
import { CommandMenu } from "./CommandMenu";
import { GlobalShortcuts } from "./GlobalShortcuts";
import { QuickCreateMenu } from "./QuickCreateMenu";
import { GlobalAlerts } from "./GlobalAlerts";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useLocation } from "react-router-dom";
import { ChevronDown, Bell, User as UserIcon, Settings } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const { user, signOut } = useAuth();
  const [fullName, setFullName] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [editName, setEditName] = useState("");
  const [editRole, setEditRole] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  
  const location = useLocation();
  const isHomePage = location.pathname === "/meu-dia" || location.pathname === "/";

  const safeMetadata = useMemo<Record<string, unknown>>(() => {
    if (user?.user_metadata && typeof user.user_metadata === "object" && !Array.isArray(user.user_metadata)) {
      return user.user_metadata as Record<string, unknown>;
    }
    return {};
  }, [user?.user_metadata]);

  const metadataString = useCallback(
    (key: string) => {
      const value = safeMetadata[key];
      return typeof value === "string" ? value : undefined;
    },
    [safeMetadata],
  );

  useEffect(() => {
    let mounted = true;

    const loadProfile = async () => {
      if (!user?.id) {
        setFullName(null);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("full_name, role")
          .eq("user_id", user.id)
          .single();

        if (!mounted) return;

        const metadataFullName = metadataString("full_name");
        const metadataRole = metadataString("role");

        if (error) {
          setFullName(metadataFullName ?? null);
          setRole(metadataRole ?? null);
          return;
        }

        const dbFullName =
          data && typeof data === "object" && "full_name" in data && typeof (data as Record<string, unknown>).full_name === "string"
            ? ((data as Record<string, unknown>).full_name as string)
            : undefined;
            
        const dbRole =
          data && typeof data === "object" && "role" in data && typeof (data as Record<string, unknown>).role === "string"
            ? ((data as Record<string, unknown>).role as string)
            : undefined;

        setFullName(metadataFullName ?? dbFullName ?? null);
        setRole(metadataRole ?? dbRole ?? null);
      } catch {
        setFullName(metadataString("full_name") ?? null);
        setRole(metadataString("role") ?? null);
      }
    };

    loadProfile();

    return () => {
      mounted = false;
    };
  }, [metadataString, user]);

  useEffect(() => {
    // small delay to trigger animation
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bom dia";
    if (hour < 18) return "Boa tarde";
    return "Boa noite";
  };

  const handleOpenProfile = () => {
    setEditName(fullName || user?.user_metadata?.name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || "");
    setEditRole(role || metadataString("role") || "");
    setIsProfileOpen(true);
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
      const { error: authError } = await supabase.auth.updateUser({
        data: { full_name: editName, name: editName, role: editRole }
      });
      if (authError) throw authError;

      const { error: dbError } = await supabase
        .from('profiles')
        .update({ full_name: editName })
        .eq('user_id', user.id);
        
      if (dbError) {
        console.warn("Erro ao atualizar profiles (ignorando):", dbError);
      }
      
      setFullName(editName);
      setRole(editRole);
      setIsProfileOpen(false);
      toast.success("Perfil atualizado com sucesso!");
    } catch (error: any) {
      toast.error("Erro ao atualizar perfil");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const initials = () => {
    const name = fullName ?? metadataString("full_name") ?? user?.email ?? "Usuário";
    const parts = name.split(/\s+/).filter(Boolean);
    if (parts.length === 0) return "U";
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const avatarUrl = metadataString("avatar_url");

  return (
    <>
      <GlobalDialogs />
      <GlobalShortcuts />
      <div className="flex min-h-screen w-full bg-background pl-24">
        <AppSidebar />
        <div className="flex flex-1 flex-col">
          {/* Header Condicional (Só no Início) - Flutuante para não empurrar o layout */}
          {isHomePage && (
            <div className="absolute top-6 left-32 z-50 flex items-center gap-4">
              {/* Pill de Notificações */}
                  <button className="flex items-center gap-3 bg-[#1C1C1E] hover:bg-[#252528] transition-colors border border-white/5 rounded-full px-4 py-2.5 shadow-lg">
                    <div className="relative">
                      <Bell className="h-4 w-4 text-gray-400" />
                    </div>
                    <span className="text-sm text-gray-400 font-medium">Notifications</span>
                    <div className="h-5 w-5 bg-[#FF5C5C] rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
                      6
                    </div>
                  </button>

                  {/* Pill do Perfil */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="flex items-center gap-4 bg-[#1C1C1E] hover:bg-[#252528] transition-colors border border-white/5 rounded-full pl-2 pr-4 py-2 shadow-lg group cursor-pointer outline-none">
                        <Avatar className="h-10 w-10 border-none ring-0">
                          { avatarUrl ? (
                            <AvatarImage src={avatarUrl} alt={fullName ?? undefined} />
                          ) : (
                            <AvatarFallback className="bg-[#FFB703] text-black font-bold text-sm">
                              {initials()}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        
                        <div className="flex flex-col items-start justify-center pr-2 text-left">
                          <span className="text-[10px] font-bold text-gray-400 tracking-wider uppercase mb-0.5">
                            {role ?? "Membro"}
                          </span>
                          <span className="text-sm font-semibold text-white tracking-wide leading-tight truncate max-w-[150px]">
                            {fullName ?? user?.email?.split('@')[0] ?? 'Fahema Yesmin'}
                          </span>
                        </div>

                        <ChevronDown className="h-4 w-4 text-gray-500 group-hover:text-white transition-colors ml-2" />
                      </button>
                    </DropdownMenuTrigger>
                    
                    <DropdownMenuContent align="end" className="w-56 bg-[#1C1C1E] border-white/10 text-white rounded-xl shadow-2xl p-2 z-[60]">
                      <DropdownMenuItem onSelect={handleOpenProfile} className="focus:bg-[#252528] focus:text-white cursor-pointer rounded-lg py-2.5">
                        <UserIcon className="mr-2 h-4 w-4 text-gray-400" />
                        <span>Meu Perfil</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
            </div>
          )}
          <main className="flex-1 p-6">
            <div key={location.pathname} className="space-y-6 animate-in fade-in slide-in-from-bottom-4 zoom-in-95 duration-300 ease-out">
              <GlobalAlerts />
              {children}
            </div>
          </main>
        </div>
      </div>
      
      <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
        <DialogContent className="bg-[#1C1C1E] border border-white/10 text-white sm:max-w-md z-[100]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-light">Meu <span className="font-bold">Perfil</span></DialogTitle>
            <DialogDescription className="text-gray-400">
              Atualize as informações da sua conta e como você é chamado pela equipe.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-5 py-4">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Nome de Exibição</label>
              <Input 
                value={editName} 
                onChange={(e) => setEditName(e.target.value)} 
                className="bg-[#111111] border-white/10 focus-visible:ring-[#00FF00] h-12 text-lg"
                placeholder="Ex: Anderson"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Profissão / Cargo</label>
              <Input 
                value={editRole} 
                onChange={(e) => setEditRole(e.target.value)} 
                className="bg-[#111111] border-white/10 focus-visible:ring-[#00FF00] h-12 text-lg"
                placeholder="Ex: Estratégia, Admin, Diretor..."
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-500">E-mail de Acesso</label>
              <Input 
                value={user?.email || ""} 
                disabled 
                className="bg-[#111111] border-white/10 opacity-50 h-12"
              />
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button variant="ghost" onClick={() => setIsProfileOpen(false)} className="hover:bg-white/5 text-gray-400 hover:text-white">
              Cancelar
            </Button>
            <Button onClick={handleSaveProfile} disabled={isSaving || !editName.trim()} className="bg-[#00FF00] text-black hover:bg-[#00FF00]/80 font-bold px-8">
              {isSaving ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
