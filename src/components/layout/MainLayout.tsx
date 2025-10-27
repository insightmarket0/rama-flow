import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { ThemeToggle } from "./ThemeToggle";
import { GlobalDialogs } from "./GlobalDialogs";
import { CommandMenu } from "./CommandMenu";
import { GlobalShortcuts } from "./GlobalShortcuts";
import { QuickCreateMenu } from "./QuickCreateMenu";
import { GlobalAlerts } from "./GlobalAlerts";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const { user } = useAuth();
  const [fullName, setFullName] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

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
          .select("full_name")
          .eq("user_id", user.id)
          .single();

        if (!mounted) return;

        if (error) {
          // fallback to user metadata
          setFullName((user?.user_metadata as any)?.full_name ?? null);
        } else {
          setFullName((data as any)?.full_name ?? (user?.user_metadata as any)?.full_name ?? null);
        }
      } catch (err) {
        setFullName((user?.user_metadata as any)?.full_name ?? null);
      }
    };

    loadProfile();

    return () => {
      mounted = false;
    };
  }, [user]);

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

  const initials = () => {
    const name = fullName ?? (user?.user_metadata as any)?.full_name ?? user?.email ?? "Usuário";
    const parts = name.split(/\s+/).filter(Boolean);
    if (parts.length === 0) return "U";
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <SidebarProvider>
      <GlobalDialogs />
      <GlobalShortcuts />
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex flex-1 flex-col">
          <header className="sticky top-0 z-10 flex h-16 items-center border-b bg-card px-6">
            <div className="flex w-full items-center gap-3">
              <SidebarTrigger />
              {/* Greeting */}
              <div className="ml-4 hidden sm:flex items-center">
                <div className={`flex items-center gap-3 transition-all duration-300 ease-out ${
                  visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1'
                }`}>
                  <Avatar>
                    { (user?.user_metadata as any)?.avatar_url ? (
                      <AvatarImage src={(user?.user_metadata as any).avatar_url} alt={fullName ?? undefined} />
                    ) : (
                      <AvatarFallback>{initials()}</AvatarFallback>
                    )}
                  </Avatar>
                  <div className="leading-tight">
                    <div className="text-xs text-muted-foreground">{greeting()},</div>
                    <div className="text-sm font-semibold text-foreground">{fullName ?? user?.email?.split('@')[0] ?? 'Usuário'}</div>
                  </div>
                </div>
              </div>
              <div className="ml-auto flex items-center gap-2">
                <QuickCreateMenu />
                <CommandMenu />
                <ThemeToggle />
              </div>
            </div>
          </header>
          <main className="flex-1 p-6">
            <div className="space-y-6">
              <GlobalAlerts />
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
