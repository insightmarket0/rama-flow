import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tables } from "@/integrations/supabase/types";
import {
  QuotationResponseWithSupplier,
  ResponseStatus,
  UpsertQuotationResponseInput,
} from "@/types/quotations";
import { UseMutationResult } from "@tanstack/react-query";
import { formatCurrencyBRL } from "@/lib/format";
import { QuotationResponseDialog } from "@/components/quotations/QuotationResponseDialog";
import { ResponseStatusBadge } from "@/components/quotations/StatusBadges";
import { MoreHorizontal } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface QuotationResponsesTableProps {
  quotationId: string;
  responses: QuotationResponseWithSupplier[];
  suppliers?: Tables<"suppliers">[];
  isLoading: boolean;
  upsertMutation: UseMutationResult<string, Error, UpsertQuotationResponseInput>;
  deleteMutation: UseMutationResult<void, Error, string>;
  updateStatusMutation: UseMutationResult<void, Error, { responseId: string; status: ResponseStatus }>;
  disabled?: boolean;
}

const statusOptions: ResponseStatus[] = ["rascunho", "enviada"];

export const QuotationResponsesTable = ({
  quotationId,
  responses,
  suppliers,
  isLoading,
  upsertMutation,
  deleteMutation,
  updateStatusMutation,
  disabled,
}: QuotationResponsesTableProps) => {
  if (isLoading) {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Fornecedor</TableHead>
            <TableHead>Valor Total</TableHead>
            <TableHead>Prazo (dias)</TableHead>
            <TableHead>Condição</TableHead>
            <TableHead>Observações</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell colSpan={7}>
              <Skeleton className="h-10 w-full" />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
  }

  if (!responses.length) {
    return (
      <div className="rounded-md border border-dashed border-muted p-6 text-center text-sm text-muted-foreground">
        Nenhuma resposta registrada ainda — adicione fornecedores para iniciar a comparação.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Fornecedor</TableHead>
          <TableHead>Valor Total</TableHead>
          <TableHead>Prazo (dias)</TableHead>
          <TableHead>Condição</TableHead>
          <TableHead>Observações</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {responses.map((response) => (
          <TableRow key={response.id}>
            <TableCell className="font-medium">{response.supplier?.name ?? "Fornecedor removido"}</TableCell>
            <TableCell>{formatCurrencyBRL(response.valor_total)}</TableCell>
            <TableCell>{response.prazo_dias}</TableCell>
            <TableCell>{response.condicao_pagamento ?? "-"}</TableCell>
            <TableCell className="max-w-xs whitespace-pre-line text-sm text-muted-foreground">
              {response.observacao ?? "-"}
            </TableCell>
            <TableCell>
              {response.status === "aprovada" ? (
                <ResponseStatusBadge status={response.status} />
              ) : (
                <Select
                  value={response.status}
                  onValueChange={(value) =>
                    updateStatusMutation.mutate({ responseId: response.id, status: value as ResponseStatus })
                  }
                  disabled={disabled || updateStatusMutation.isPending}
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status === "rascunho" ? "Rascunho" : "Enviada"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </TableCell>
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" disabled={disabled}>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <QuotationResponseDialog
                    quotationId={quotationId}
                    response={response}
                    suppliers={suppliers}
                    mutation={upsertMutation}
                    disabled={disabled || response.status === "aprovada"}
                    trigger={<DropdownMenuItem>Editar</DropdownMenuItem>}
                  />
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <DropdownMenuItem disabled={response.status === "aprovada" || disabled}>
                        <span className="text-destructive">Excluir</span>
                      </DropdownMenuItem>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Remover resposta</AlertDialogTitle>
                        <AlertDialogDescription>
                          Deseja remover a resposta de {response.supplier?.name ?? "fornecedor"}? Essa ação não pode ser
                          desfeita.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-destructive text-white hover:bg-destructive/90"
                          disabled={deleteMutation.isPending}
                          onClick={() => deleteMutation.mutate(response.id)}
                        >
                          Excluir
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
