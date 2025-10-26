import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { quotationStatusLabel, responseStatusLabel } from "@/lib/quotations";
import { QuotationStatus, ResponseStatus } from "@/types/quotations";

interface StatusBadgeProps {
  status: QuotationStatus;
}

const quotationStatusStyles: Record<QuotationStatus, string> = {
  aberta: "bg-orange-500/15 text-orange-600 border-transparent",
  fechada: "bg-slate-500/10 text-slate-600 border-transparent",
  aprovada: "bg-emerald-500/15 text-emerald-600 border-transparent",
};

export const QuotationStatusBadge = ({ status }: StatusBadgeProps) => (
  <Badge className={cn("uppercase tracking-wide", quotationStatusStyles[status])}>
    {quotationStatusLabel[status] ?? status}
  </Badge>
);

const responseStatusStyles: Record<ResponseStatus, string> = {
  rascunho: "bg-slate-500/10 text-slate-600 border-transparent",
  enviada: "bg-blue-500/10 text-blue-600 border-transparent",
  aprovada: "bg-emerald-500/15 text-emerald-600 border-transparent",
};

interface ResponseBadgeProps {
  status: ResponseStatus;
}

export const ResponseStatusBadge = ({ status }: ResponseBadgeProps) => (
  <Badge className={cn("uppercase tracking-wide", responseStatusStyles[status])}>
    {responseStatusLabel[status] ?? status}
  </Badge>
);
