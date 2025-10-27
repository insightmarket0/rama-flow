import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { QuotationStatusBadge, ResponseStatusBadge } from "@/components/quotations/StatusBadges";
import { useQuotationDetail, useQuotations } from "@/hooks/useQuotations";
import { useQuotationResponses } from "@/hooks/useQuotationResponses";
import { getHighlights, paymentScore } from "@/lib/quotations";
import { formatCurrencyBRL } from "@/lib/format";
import { QuotationApprovalDialog } from "@/components/quotations/QuotationApprovalDialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Loader2, ArrowLeft, FileDown, Lock, Unlock } from "lucide-react";
import { QuotationResponseWithSupplier, QuotationStatus } from "@/types/quotations";

const getBestPaymentLabel = (responses: QuotationResponseWithSupplier[], bestId?: string) => {
  if (!bestId) return null;
  const target = responses.find((response) => response.id === bestId);
  if (!target) return null;
  return target.condicao_pagamento || "-";
};

const getBestLeadTime = (responses: QuotationResponseWithSupplier[], bestId?: string) => {
  if (!bestId) return null;
  const target = responses.find((response) => response.id === bestId);
  if (!target) return null;
  return `${target.prazo_dias} dias`; 
};

const QuotationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: quotation, isLoading } = useQuotationDetail(id);
  const { updateQuotationStatus } = useQuotations();
  const { approveResponse } = useQuotationResponses(id ?? null);

  const responses = quotation?.responses ?? [];
  const highlights = getHighlights(responses);

  const bestPrice = responses.find((response) => response.id === highlights.bestPriceId);
  const bestLeadTime = getBestLeadTime(responses, highlights.bestLeadTimeId);
  const bestPayment = getBestPaymentLabel(responses, highlights.bestPaymentId);

  const isClosed = quotation?.status === "fechada";
  const isApproved = quotation?.status === "aprovada";

  const handleApprove = async (responseId: string, observacao?: string | null) => {
    await approveResponse.mutateAsync({ responseId, observacao: observacao ?? undefined });
  };

  const handleStatusToggle = () => {
    if (!quotation) return;
    const nextStatus: QuotationStatus = quotation.status === "fechada" ? "aberta" : "fechada";
    updateQuotationStatus.mutate({ id: quotation.id, status: nextStatus });
  };

  if (isLoading || !quotation) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <button
            className="flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4" /> Voltar
          </button>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-foreground">{quotation.titulo}</h1>
            <QuotationStatusBadge status={quotation.status as QuotationStatus} />
          </div>
          {quotation.descricao ? (
            <p className="text-muted-foreground">{quotation.descricao}</p>
          ) : null}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {!isApproved ? (
            <Button
              variant="outline"
              onClick={handleStatusToggle}
              disabled={updateQuotationStatus.isPending}
            >
              {updateQuotationStatus.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : isClosed ? (
                <Unlock className="mr-2 h-4 w-4" />
              ) : (
                <Lock className="mr-2 h-4 w-4" />
              )}
              {isClosed ? "Reabrir" : "Fechar"}
            </Button>
          ) : null}
          {!isApproved ? (
            <QuotationApprovalDialog
              responses={responses}
              onConfirm={handleApprove}
              disabled={approveResponse.isPending || isClosed}
              isLoading={approveResponse.isPending}
              trigger={
                <Button className="bg-emerald-600 text-white hover:bg-emerald-600/90">
                  Aprovar fornecedor
                </Button>
              }
            />
          ) : null}
          <Button variant="outline" disabled>
            <FileDown className="mr-2 h-4 w-4" /> Exportar PDF
          </Button>
          <Button variant="secondary" onClick={() => navigate(`/quotations/${quotation.id}/edit`)}>
            Editar
          </Button>
        </div>
      </div>

      {isApproved ? (
        <Alert>
          <AlertTitle>Cotação aprovada</AlertTitle>
          <AlertDescription>
            A cotação foi aprovada. Utilize o comparativo abaixo para registrar o histórico ou exportar as informações.
          </AlertDescription>
        </Alert>
      ) : isClosed ? (
        <Alert>
          <AlertTitle>Cotação fechada</AlertTitle>
          <AlertDescription>
            Nenhuma nova resposta pode ser registrada enquanto a cotação estiver fechada.
          </AlertDescription>
        </Alert>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <Card className="card-shadow">
          <CardHeader>
            <CardTitle>Tabela de comparação</CardTitle>
          </CardHeader>
          <CardContent>
            {responses.length === 0 ? (
              <div className="rounded-md border border-dashed border-muted p-6 text-center text-sm text-muted-foreground">
                Nenhuma resposta cadastrada. Utilize o botão "Editar" para adicionar fornecedores e comparar ofertas.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fornecedor</TableHead>
                    <TableHead>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger className="text-left">Valor total</TooltipTrigger>
                          <TooltipContent>
                            <p>Menor valor recebe destaque em verde.</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableHead>
                    <TableHead>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger className="text-left">Prazo (dias)</TooltipTrigger>
                          <TooltipContent>
                            <p>Menor prazo recebe destaque em azul.</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableHead>
                    <TableHead>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger className="text-left">Condição</TooltipTrigger>
                          <TooltipContent>
                            <p>Mais curta: à vista &lt; 30 &lt; 30/60 &lt; 30/60/90.</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableHead>
                    <TableHead>Observações</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {responses.map((response) => {
                    const isBestPrice = response.id === highlights.bestPriceId;
                    const isBestLead = response.id === highlights.bestLeadTimeId;
                    const isBestPayment = response.id === highlights.bestPaymentId;
                    return (
                      <TableRow key={response.id}>
                        <TableCell className="font-semibold">{response.supplier?.name ?? "Fornecedor"}</TableCell>
                        <TableCell
                          className={cn(
                            "font-medium",
                            isBestPrice ? "bg-emerald-500/10 text-emerald-700" : "",
                          )}
                        >
                          {formatCurrencyBRL(response.valor_total)}
                        </TableCell>
                        <TableCell
                          className={cn(
                            "font-medium",
                            isBestLead ? "bg-sky-500/10 text-sky-700" : "",
                          )}
                        >
                          {response.prazo_dias}
                        </TableCell>
                        <TableCell
                          className={cn(
                            "font-medium",
                            isBestPayment ? "italic bg-slate-500/10 text-slate-700" : "",
                          )}
                        >
                          {response.condicao_pagamento ?? "-"}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {response.observacao ?? "-"}
                        </TableCell>
                        <TableCell>
                          <ResponseStatusBadge status={response.status} />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
        <Card className="card-shadow">
          <CardHeader>
            <CardTitle>Resumo rápido</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Menor valor</p>
              <p className="text-lg font-semibold">
                {bestPrice ? formatCurrencyBRL(bestPrice.valor_total) : "—"}
              </p>
              <p className="text-xs text-muted-foreground">
                {bestPrice ? bestPrice.supplier?.name : "Aguardando respostas"}
              </p>
            </div>
            <Separator />
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Melhor prazo</p>
              <p className="text-lg font-semibold">{bestLeadTime ?? "—"}</p>
            </div>
            <Separator />
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Condição mais curta</p>
              <p className="text-lg font-semibold">{bestPayment ?? "—"}</p>
            </div>
            <Separator />
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Ranking por valor total</p>
              <div className="space-y-2">
                {[...responses]
                  .sort((a, b) => {
                    if (a.valor_total === b.valor_total) {
                      if (a.prazo_dias === b.prazo_dias) {
                        return paymentScore(a.condicao_pagamento) - paymentScore(b.condicao_pagamento);
                      }
                      return a.prazo_dias - b.prazo_dias;
                    }
                    return a.valor_total - b.valor_total;
                  })
                  .slice(0, 5)
                  .map((response, index) => (
                    <div key={response.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="w-6 justify-center">
                          {index + 1}
                        </Badge>
                        <span className="text-sm font-medium">{response.supplier?.name ?? "Fornecedor"}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {formatCurrencyBRL(response.valor_total)}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QuotationDetail;
