import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { ThemeToggle } from "./ThemeToggle";
import { GlobalDialogs } from "./GlobalDialogs";
import { CommandMenu } from "./CommandMenu";
import { GlobalShortcuts } from "./GlobalShortcuts";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
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
              <div className="ml-auto flex items-center gap-2">
                <CommandMenu />
                <ThemeToggle />
              </div>
            </div>
          </header>
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
