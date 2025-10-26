import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Search, LayoutDashboard, ShoppingCart, CreditCard, Wallet, Users, LogOut, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import {
  dispatchAppEvent,
  OPEN_ORDER_DIALOG_EVENT,
  OPEN_PAYMENT_CONDITION_DIALOG_EVENT,
  OPEN_SUPPLIER_DIALOG_EVENT,
} from "@/lib/events";
import { isTypingEvent } from "@/lib/keyboard";
import { useAuth } from "@/hooks/useAuth";

export const CommandMenu = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut } = useAuth();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented) return;

      if ((event.key === "k" || event.key === "K") && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen((prev) => !prev);
        return;
      }

      if (event.key === "/" && !event.metaKey && !event.ctrlKey && !event.altKey && !event.shiftKey) {
        if (isTypingEvent(event)) return;
        event.preventDefault();
        setOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleNavigate = (path: string) => {
    setOpen(false);
    if (location.pathname !== path) {
      navigate(path);
    }
  };

  const handleAction = (action: () => void) => {
    setOpen(false);
    action();
  };

  return (
    <>
      <Button
        variant="outline"
        className="hidden h-9 items-center gap-2 rounded-full border-border/60 px-3 text-sm text-muted-foreground hover:text-foreground md:flex"
        onClick={() => setOpen(true)}
      >
        <Search className="h-4 w-4" />
        <span className="text-sm">Buscar ou abrir…</span>
        <kbd className="rounded bg-muted px-1 py-0.5 text-[10px] font-semibold text-muted-foreground">/</kbd>
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={() => setOpen(true)}
      >
        <Search className="h-5 w-5" />
        <span className="sr-only">Abrir busca ou ações</span>
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Busque páginas ou ações..." />
        <CommandList>
          <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>

          <CommandGroup heading="Ações rápidas">
            <CommandItem onSelect={() => handleAction(() => dispatchAppEvent(OPEN_ORDER_DIALOG_EVENT))}>
              <ShoppingCart className="mr-2 h-4 w-4" />
              Novo pedido
              <CommandShortcut>N</CommandShortcut>
            </CommandItem>
            <CommandItem onSelect={() => handleAction(() => dispatchAppEvent(OPEN_SUPPLIER_DIALOG_EVENT))}>
              <Users className="mr-2 h-4 w-4" />
              Novo fornecedor
            </CommandItem>
            <CommandItem onSelect={() => handleAction(() => dispatchAppEvent(OPEN_PAYMENT_CONDITION_DIALOG_EVENT))}>
              <CreditCard className="mr-2 h-4 w-4" />
              Nova condição de pagamento
            </CommandItem>
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Navegação">
            <CommandItem onSelect={() => handleNavigate("/dashboard")}>
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Dashboard
            </CommandItem>
            <CommandItem onSelect={() => handleNavigate("/pedidos")}>
              <ShoppingCart className="mr-2 h-4 w-4" />
              Pedidos de compra
            </CommandItem>
            <CommandItem onSelect={() => handleNavigate("/contas")}>
              <Wallet className="mr-2 h-4 w-4" />
              Contas a pagar
            </CommandItem>
            <CommandItem onSelect={() => handleNavigate("/contas-fixas")}>
              <Calendar className="mr-2 h-4 w-4" />
              Contas fixas
            </CommandItem>
            <CommandItem onSelect={() => handleNavigate("/fornecedores")}>
              <Users className="mr-2 h-4 w-4" />
              Fornecedores
            </CommandItem>
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Sessão">
            <CommandItem
              onSelect={() =>
                handleAction(() => {
                  signOut();
                })
              }
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sair da conta
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
};
