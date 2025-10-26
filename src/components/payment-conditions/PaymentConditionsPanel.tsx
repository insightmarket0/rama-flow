import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, CreditCard } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PaymentConditionDialog } from "@/components/payment-conditions/PaymentConditionDialog";
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
import { usePaymentConditions } from "@/hooks/usePaymentConditions";
import { EmptyState } from "@/components/layout/EmptyState";
import { Skeleton } from "@/components/ui/skeleton";
import type { Tables } from "@/integrations/supabase/types";
import { cn } from "@/lib/utils";

interface PaymentConditionsPanelProps {
  title?: string;
  className?: string;
  onCreateSuccess?: (condition: Tables<"payment_conditions">) => void;
  variant?: "card" | "flat";
}

export const PaymentConditionsPanel = ({
  title = "Condições Cadastradas",
  className,
  onCreateSuccess,
  variant = "card",
}: PaymentConditionsPanelProps) => {
  const { paymentConditions, isLoading, deletePaymentCondition } = usePaymentConditions();

  const headerAction = (
    <PaymentConditionDialog
      onSuccess={onCreateSuccess}
      trigger={
        <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <Plus className="h-4 w-4 mr-2" />
          Nova Condição
        </Button>
      }
    />
  );

  const content = isLoading ? (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Nº de Parcelas</TableHead>
          <TableHead>Intervalo (dias)</TableHead>
          <TableHead>Entrada (%)</TableHead>
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell colSpan={5}>
            <Skeleton className="h-12 w-full" />
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ) : paymentConditions && paymentConditions.length > 0 ? (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Nº de Parcelas</TableHead>
          <TableHead>Intervalo (dias)</TableHead>
          <TableHead>Entrada (%)</TableHead>
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {paymentConditions.map((condition) => (
          <TableRow key={condition.id}>
            <TableCell className="font-medium">{condition.name}</TableCell>
            <TableCell>{condition.installments}</TableCell>
            <TableCell>{condition.interval_days}</TableCell>
            <TableCell>{condition.down_payment_percent || 0}%</TableCell>
            <TableCell className="text-right">
              <div className="flex gap-2 justify-end">
                <PaymentConditionDialog
                  condition={condition}
                  onSuccess={onCreateSuccess}
                  trigger={
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                  }
                />
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
                        Tem certeza que deseja excluir a condição {condition.name}? Esta ação não pode ser desfeita.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={() => deletePaymentCondition.mutate(condition.id)}>
                        Excluir
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
  ) : (
    <EmptyState
      icon={<CreditCard className="h-6 w-6" />}
      title="Nenhuma condição cadastrada"
      description="Crie condições de pagamento para automatizar o cálculo das parcelas nos pedidos."
      action={
        <PaymentConditionDialog
          onSuccess={onCreateSuccess}
          trigger={
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nova condição
            </Button>
          }
        />
      }
    />
  );

  if (variant === "flat") {
    return (
      <div className={cn("space-y-4", className)}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          {headerAction}
        </div>
        {content}
      </div>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{title}</CardTitle>
        {headerAction}
      </CardHeader>
      <CardContent>{content}</CardContent>
    </Card>
  );
};
