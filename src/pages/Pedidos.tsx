import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, ShoppingCart } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useOrders } from "@/hooks/useOrders";
import { Skeleton } from "@/components/ui/skeleton";
import { dispatchAppEvent, OPEN_ORDER_DIALOG_EVENT } from "@/lib/events";
import { formatCurrencyBRL } from "@/lib/format";
import { EmptyState } from "@/components/layout/EmptyState";
import { PaymentConditionsPanel } from "@/components/payment-conditions/PaymentConditionsPanel";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

const Pedidos = () => {
  const { orders, isLoading, deleteOrder, updateOrderStatus } = useOrders();
  const [supplierFilter, setSupplierFilter] = useState<string>("todos");
  const [statusFilter, setStatusFilter] = useState<string>("todos");
  const [periodFilter, setPeriodFilter] = useState<"todos" | "mesAtual">("todos");
  const [searchTerm, setSearchTerm] = useState("");

  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "faturado":
        return "default";
      case "aberto":
        return "secondary";
      default:
        return "outline";
    }
  };

  const supplierOptions = useMemo(() => {
    if (!orders) return [];
    const unique = Array.from(
      new Map(
        orders
          .filter((order) => order.supplier_id && order.supplier?.name)
          .map((order) => [order.supplier_id, order.supplier?.name || "Fornecedor"])
      ).entries(),
    );
    return unique.map(([id, name]) => ({ id, name: name as string }));
  }, [orders]);

  const filteredOrders = useMemo(() => {
    if (!orders) return [];
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    return orders.filter((order) => {
      const matchesSupplier =
        supplierFilter === "todos" || order.supplier_id === supplierFilter;

      const matchesStatus =
        statusFilter === "todos" || order.status === statusFilter;

      const matchesSearch =
        searchTerm.trim().length === 0 ||
        order.order_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.supplier?.name?.toLowerCase().includes(searchTerm.toLowerCase());

      let matchesPeriod = true;
      if (periodFilter === "mesAtual") {
        const orderDate = order.order_date ? new Date(order.order_date) : null;
        if (!orderDate || Number.isNaN(orderDate.getTime())) {
          matchesPeriod = false;
        } else {
          matchesPeriod =
            orderDate.getMonth() === currentMonth &&
            orderDate.getFullYear() === currentYear;
        }
      }

      return matchesSupplier && matchesStatus && matchesSearch && matchesPeriod;
    });
  }, [orders, supplierFilter, statusFilter, searchTerm, periodFilter]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Pedidos de Compra</h1>
          <p className="text-muted-foreground mt-1">Gerencie seus pedidos e fornecedores</p>
        </div>
        <Button
          className="bg-accent hover:bg-accent/90 text-accent-foreground"
          onClick={() => dispatchAppEvent(OPEN_ORDER_DIALOG_EVENT)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Pedido
        </Button>
      </div>

      <Card className="card-shadow">
        <CardHeader>
          <CardTitle>Lista de Pedidos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Buscar</label>
              <Input
                placeholder="Pedido, fornecedor..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Fornecedor</label>
              <Select value={supplierFilter} onValueChange={setSupplierFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  {supplierOptions.map((supplier) => (
                    <SelectItem key={supplier.id} value={supplier.id}>
                      {supplier.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="aberto">Aberto</SelectItem>
                  <SelectItem value="faturado">Faturado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Período</label>
              <Select value={periodFilter} onValueChange={(value) => setPeriodFilter(value as "todos" | "mesAtual")}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os períodos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os períodos</SelectItem>
                  <SelectItem value="mesAtual">Somente mês atual</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {isLoading ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nº do Pedido</TableHead>
                  <TableHead>Fornecedor</TableHead>
                  <TableHead>Valor Total</TableHead>
                  <TableHead>Condição</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.from({ length: 3 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-24 ml-auto" /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : filteredOrders.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nº do Pedido</TableHead>
                  <TableHead>Fornecedor</TableHead>
                  <TableHead>Valor Total</TableHead>
                  <TableHead>Condição</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.order_number}</TableCell>
                    <TableCell>{order.supplier?.name || "N/A"}</TableCell>
                    <TableCell>{formatCurrencyBRL(order.total_value)}</TableCell>
                    <TableCell>{order.payment_condition?.name || "N/A"}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(order.status)}>
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        {order.status === "aberto" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              updateOrderStatus.mutate({
                                id: order.id,
                                status: "faturado",
                              })
                            }
                          >
                            Faturar
                          </Button>
                        )}
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja deletar este pedido? Esta ação não pode ser desfeita e todas as parcelas relacionadas serão removidas.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={() => deleteOrder.mutate(order.id)}>
                                Deletar
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : orders && orders.length > 0 ? (
            <EmptyState
              icon={<ShoppingCart className="h-6 w-6" />}
              title="Nenhum pedido encontrado"
              description="Ajuste os filtros para ver outros pedidos."
              action={
                <Button variant="outline" onClick={() => {
                  setSupplierFilter("todos");
                  setStatusFilter("todos");
                  setPeriodFilter("todos");
                  setSearchTerm("");
                }}>
                  Limpar filtros
                </Button>
              }
            />
          ) : (
            <EmptyState
              icon={<ShoppingCart className="h-6 w-6" />}
              title="Nenhum pedido ainda"
              description="Crie seu primeiro pedido de compra para gerar automaticamente as parcelas a pagar."
              action={
                <Button onClick={() => dispatchAppEvent(OPEN_ORDER_DIALOG_EVENT)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Criar pedido
                </Button>
              }
            />
          )}
        </CardContent>
      </Card>

      <PaymentConditionsPanel className="card-shadow" title="Condições de Pagamento" />
    </div>
  );
};

export default Pedidos;
