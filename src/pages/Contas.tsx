import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrencyBRL } from "@/lib/format";
import {
  useInstallments,
  InstallmentStatus,
  InstallmentFilters,
} from "@/hooks/useInstallments";
import { CheckCircle, Loader2, Wallet, Plus } from "lucide-react";
import { format, parseISO } from "date-fns";
import { EmptyState } from "@/components/layout/EmptyState";
import { dispatchAppEvent, OPEN_ORDER_DIALOG_EVENT } from "@/lib/events";

const statusLabels: Record<InstallmentStatus, string> = {
  pendente: "Pendente",
  atrasado: "Atrasado",
  pago: "Pago",
};

const getStatusVariant = (status: InstallmentStatus) => {
  switch (status) {
    case "pago":
      return "default";
    case "atrasado":
      return "destructive";
    default:
      return "secondary";
  }
};

const Contas = () => {
  const {
    installments,
    isLoading,
    isFetching,
    filters,
    updateFilters,
    resetFilters,
    markAsPaid,
  } = useInstallments();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Contas a Pagar</h1>
        <p className="text-muted-foreground mt-1">
          Acompanhe e gerencie seus pagamentos
        </p>
      </div>

      <Card className="card-shadow">
        <CardHeader>
          <CardTitle>Contas a Pagar</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="start-date">Data inicial</Label>
              <Input
                id="start-date"
                type="date"
                value={filters.startDate ?? ""}
                onChange={(event) =>
                  updateFilters({
                    startDate: event.target.value || null,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end-date">Data final</Label>
              <Input
                id="end-date"
                type="date"
                value={filters.endDate ?? ""}
                onChange={(event) =>
                  updateFilters({
                    endDate: event.target.value || null,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={filters.status}
                onValueChange={(value) =>
                  updateFilters({
                    status: value as InstallmentFilters["status"],
                  })
                }
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Todos os status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="pendente">Pendente</SelectItem>
                  <SelectItem value="atrasado">Atrasado</SelectItem>
                  <SelectItem value="pago">Pago</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button
                variant="outline"
                className="w-full sm:w-auto"
                onClick={resetFilters}
                disabled={
                  !filters.startDate &&
                  !filters.endDate &&
                  filters.status === "todos"
                }
              >
                Limpar filtros
              </Button>
            </div>
          </div>

          {isFetching && !isLoading ? (
            <p className="text-sm text-muted-foreground">Atualizando dados...</p>
          ) : null}

          {isLoading ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vencimento</TableHead>
                  <TableHead>Fornecedor</TableHead>
                  <TableHead>Pedido</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.from({ length: 4 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-32" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-16" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-20" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-16" />
                    </TableCell>
                    <TableCell className="text-right">
                      <Skeleton className="h-8 w-32 ml-auto" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : installments && installments.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vencimento</TableHead>
                  <TableHead>Fornecedor</TableHead>
                  <TableHead>Pedido</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {installments.map((installment) => {
                  const isUpdatingCurrent =
                    markAsPaid.isPending &&
                    markAsPaid.variables === installment.id;

                  return (
                    <TableRow key={installment.id}>
                      <TableCell className="font-medium">
                        {format(parseISO(installment.due_date), "dd/MM/yyyy")}
                      </TableCell>
                      <TableCell>{installment.supplier?.name ?? "-"}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span>{installment.order?.order_number ?? "-"}</span>
                          <span className="text-xs text-muted-foreground">
                            {installment.installment_number === 0
                              ? "Entrada"
                              : `Parcela ${installment.installment_number}`}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{formatCurrencyBRL(installment.value)}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(installment.status)}>
                          {statusLabels[installment.status]}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {installment.status !== "pago" ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => markAsPaid.mutate(installment.id)}
                            disabled={markAsPaid.isPending}
                          >
                            {isUpdatingCurrent ? (
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            ) : (
                              <CheckCircle className="h-4 w-4 mr-2" />
                            )}
                            Marcar como Pago
                          </Button>
                        ) : (
                          <span className="text-sm text-muted-foreground">
                            Pago em {" "}
                            {installment.paid_at
                              ? format(parseISO(installment.paid_at), "dd/MM/yyyy")
                              : "-"}
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <EmptyState
              icon={<Wallet className="h-6 w-6" />}
              title="Nenhuma parcela encontrada"
              description="Ajuste os filtros ou cadastre novos pedidos para gerar parcelas a pagar."
              action={
                <Button variant="secondary" onClick={() => dispatchAppEvent(OPEN_ORDER_DIALOG_EVENT)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Criar pedido
                </Button>
              }
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Contas;
