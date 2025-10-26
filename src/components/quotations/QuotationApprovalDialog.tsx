import { useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { QuotationResponseWithSupplier } from "@/types/quotations";
import { getHighlights } from "@/lib/quotations";
import { formatCurrencyBRL } from "@/lib/format";
import { ScrollArea } from "@/components/ui/scroll-area";

interface QuotationApprovalDialogProps {
  responses: QuotationResponseWithSupplier[];
  onConfirm: (responseId: string, observacao?: string | null) => Promise<void> | void;
  trigger?: React.ReactNode;
  isLoading?: boolean;
  disabled?: boolean;
}

export const QuotationApprovalDialog = ({
  responses,
  onConfirm,
  trigger,
  isLoading,
  disabled,
}: QuotationApprovalDialogProps) => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [observacao, setObservacao] = useState<string>("");

  const eligibleResponses = useMemo(
    () => responses.filter((response) => response.status === "enviada" || response.status === "aprovada"),
    [responses],
  );

  const highlights = useMemo(() => getHighlights(eligibleResponses), [eligibleResponses]);

  const handleConfirm = async () => {
    if (!selected) return;
    await onConfirm(selected, observacao || null);
    setOpen(false);
    setObservacao("");
    setSelected(null);
  };

  return (
    <Dialog open={open} onOpenChange={(value) => {
      if (disabled) {
        setOpen(false);
        return;
      }
      setOpen(value);
      if (!value) {
        setObservacao("");
        setSelected(null);
      }
    }}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button disabled={disabled} variant="secondary">
            Aprovar fornecedor
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Selecionar fornecedor vencedor</DialogTitle>
          <DialogDescription>
            Escolha uma resposta enviada. Apenas uma resposta pode ser aprovada por cotação.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {eligibleResponses.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Nenhuma resposta enviada disponível. Atualize o status das respostas para "Enviada" para prosseguir.
            </p>
          ) : (
            <ScrollArea className="max-h-72 pr-4">
              <RadioGroup
                value={selected ?? undefined}
                onValueChange={(value) => setSelected(value)}
                className="space-y-3"
              >
                {eligibleResponses.map((response) => (
                  <div
                    key={response.id}
                    className="flex items-start gap-3 rounded-lg border border-border/50 bg-card/60 p-3"
                  >
                    <RadioGroupItem value={response.id} id={`approve-${response.id}`} className="mt-1" />
                    <div className="space-y-1">
                      <Label htmlFor={`approve-${response.id}`} className="text-base font-semibold">
                        {response.supplier?.name ?? "Fornecedor"}
                      </Label>
                      <div className="grid grid-cols-3 gap-3 text-sm">
                        <div>
                          <p className="text-muted-foreground">Valor total</p>
                          <p
                            className={
                              response.id === highlights.bestPriceId
                                ? "font-semibold text-emerald-600"
                                : "font-medium text-foreground"
                            }
                          >
                            {formatCurrencyBRL(response.valor_total)}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Prazo</p>
                          <p
                            className={
                              response.id === highlights.bestLeadTimeId
                                ? "font-semibold text-sky-600"
                                : "font-medium text-foreground"
                            }
                          >
                            {response.prazo_dias} dias
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Condição</p>
                          <p
                            className={
                              response.id === highlights.bestPaymentId
                                ? "italic text-muted-foreground"
                                : "font-medium text-foreground"
                            }
                          >
                            {response.condicao_pagamento || "-"}
                          </p>
                        </div>
                      </div>
                      {response.observacao ? (
                        <p className="text-xs text-muted-foreground">Observação: {response.observacao}</p>
                      ) : null}
                    </div>
                  </div>
                ))}
              </RadioGroup>
            </ScrollArea>
          )}
          <div className="space-y-2">
            <Label htmlFor="approval-observacao">Observação (opcional)</Label>
            <Textarea
              id="approval-observacao"
              placeholder="Registre um comentário interno"
              value={observacao}
              onChange={(event) => setObservacao(event.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={handleConfirm}
            disabled={!selected || isLoading || eligibleResponses.length === 0}
            className="bg-emerald-600 text-white hover:bg-emerald-600/90"
          >
            {isLoading ? "Aprovando..." : "Confirmar aprovação"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
