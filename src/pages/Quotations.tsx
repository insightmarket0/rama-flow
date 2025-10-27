import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
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
import { formatCurrencyBRL } from "@/lib/format";
import { QuotationStatusBadge } from "@/components/quotations/StatusBadges";
import { useQuotations } from "@/hooks/useQuotations";
import { QuotationStatus } from "@/types/quotations";
import { EmptyState } from "@/components/layout/EmptyState";
import { ClipboardList, Plus, Trash2 } from "lucide-react";

const statusFilters: Array<{ label: string; value: QuotationStatus | "todos" }> = [
  { label: "Todos", value: "todos" },
  { label: "Aberta", value: "aberta" },
  { label: "Fechada", value: "fechada" },
  { label: "Aprovada", value: "aprovada" },
];

const formatDate = (value?: string | null) => {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("pt-BR");
};

const Quotations = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<QuotationStatus | "todos">("todos");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const { quotations, isLoading, isFetching, deleteQuotation } = useQuotations({
    status,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
  });

  const isFiltering = useMemo(() => Boolean(startDate || endDate || (status && status !== "todos")), [
    startDate,
    endDate,
    status,
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Cotações</h1>
          <p className="mt-1 text-muted-foreground">
            Registre e compare propostas de fornecedores em um painel consolidado.
          </p>
        </div>
        <Button className="bg-accent text-accent-foreground hover:bg-accent/90" onClick={() => navigate("/quotations/new") }>
          <Plus className="mr-2 h-4 w-4" />
          Nova cotação
        </Button>
      </div>

      <Card className="card-shadow">
        <CardHeader className="space-y-4">
          <CardTitle>Filtro rápido</CardTitle>
          <div className="grid gap-4 md:grid-cols-4">
            <Select value={status} onValueChange={(value) => setStatus(value as QuotationStatus | "todos") }>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {statusFilters.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="date"
              value={startDate}
              onChange={(event) => setStartDate(event.target.value)}
              placeholder="Data inicial"
            />
            <Input
              type="date"
              value={endDate}
              onChange={(event) => setEndDate(event.target.value)}
              placeholder="Data final"
            />
            {isFiltering ? (
              <Button variant="outline" onClick={() => {
                setStatus("todos");
                setStartDate("");
                setEndDate("");
              }}>
                Limpar filtros
              </Button>
            ) : (
              <div />
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isLoading || isFetching ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Criada em</TableHead>
                  <TableHead>Fornecedores</TableHead>
                  <TableHead>Melhor oferta</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.from({ length: 3 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-12" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="ml-auto h-8 w-24" /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : quotations.length === 0 ? (
            <EmptyState
              icon={<ClipboardList className="h-6 w-6" />}
              title="Nenhuma cotação registrada"
              description="Crie uma nova cotação para iniciar a comparação entre fornecedores."
              action={
                <Button onClick={() => navigate("/quotations/new") }>
                  <Plus className="mr-2 h-4 w-4" />
                  Nova cotação
                </Button>
              }
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Criada em</TableHead>
                  <TableHead>Fornecedores</TableHead>
                  <TableHead>Melhor oferta</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {quotations.map((quotation) => {
                  const isDeleting = deleteQuotation.isPending && deleteQuotation.variables === quotation.id;

                  return (
                    <TableRow key={quotation.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">{quotation.titulo}</TableCell>
                      <TableCell>{formatDate(quotation.created_at)}</TableCell>
                      <TableCell>{quotation.responsesCount}</TableCell>
                      <TableCell>
                        {quotation.bestOfferValue !== null && quotation.bestOfferValue !== undefined
                          ? formatCurrencyBRL(quotation.bestOfferValue)
                          : "—"}
                      </TableCell>
                      <TableCell>
                        <QuotationStatusBadge status={quotation.status as QuotationStatus} />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => navigate(`/quotations/${quotation.id}`)}>
                            Ver detalhes
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                                <Trash2 className="mr-1 h-4 w-4" />
                                Excluir
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Excluir cotação</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Essa ação removerá a cotação e todas as respostas de fornecedores vinculadas. Essa operação
                                  não pode ser desfeita.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  disabled={isDeleting}
                                  onClick={() => deleteQuotation.mutate(quotation.id)}
                                >
                                  {isDeleting ? "Excluindo..." : "Excluir"}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Quotations;
