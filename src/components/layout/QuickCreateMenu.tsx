import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ClipboardList, Plus, ShoppingCart, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { dispatchAppEvent, OPEN_ORDER_DIALOG_EVENT } from "@/lib/events";

export const QuickCreateMenu = () => {
  const navigate = useNavigate();

  const handleNewOrder = () => {
    dispatchAppEvent(OPEN_ORDER_DIALOG_EVENT);
  };

  const handleNewQuotation = () => {
    navigate("/quotations/new");
  };

  const handleNewSupplier = () => {
    navigate("/fornecedores");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="mr-2 h-4 w-4" />
          Novo registro
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuItem onSelect={handleNewOrder} className="cursor-pointer">
          <ShoppingCart className="mr-2 h-4 w-4 text-muted-foreground" />
          Pedido de compra
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={handleNewQuotation} className="cursor-pointer">
          <ClipboardList className="mr-2 h-4 w-4 text-muted-foreground" />
          Cotação com fornecedores
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={handleNewSupplier} className="cursor-pointer">
          <UserPlus className="mr-2 h-4 w-4 text-muted-foreground" />
          Fornecedor
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
