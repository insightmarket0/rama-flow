import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useQuotations, useQuotationDetail } from "@/hooks/useQuotations";
import { useQuotationResponses } from "@/hooks/useQuotationResponses";
import { useSuppliers } from "@/hooks/useSuppliers";
import { QuotationStatus } from "@/types/quotations";
import { QuotationStatusBadge } from "@/components/quotations/StatusBadges";
import { QuotationResponsesTable } from "@/components/quotations/QuotationResponsesTable";
import { QuotationResponseDialog } from "@/components/quotations/QuotationResponseDialog";
import { QuotationApprovalDialog } from "@/components/quotations/QuotationApprovalDialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Lock, Unlock } from "lucide-react";
import { cn } from "@/lib/utils";

const quotationSchema = z.object({
  titulo: z.string().min(3, "Informe um título").max(80, "Título muito longo"),
  descricao: z.string().max(1000).optional().or(z.literal("")),
  data_limite: z.string().optional(),
});

type QuotationFormValues = z.infer<typeof quotationSchema>;

const QuotationForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const { createQuotation, updateQuotation, updateQuotationStatus } = useQuotations();
  const { data: quotationDetail, isLoading: isLoadingQuotation } = useQuotationDetail(id);
  const { suppliers } = useSuppliers();

  const quotationStatus = quotationDetail?.status as QuotationStatus | undefined;
  const isApproved = quotationStatus === "aprovada";
  const isClosed = quotationStatus === "fechada";
  const readOnly = isApproved;

  const {
    responses,
    isLoading: isLoadingResponses,
    upsertResponse,
    deleteResponse,
    approveResponse,
    updateResponseStatus,
  } = useQuotationResponses(id ?? null);

  const form = useForm<QuotationFormValues>({
    resolver: zodResolver(quotationSchema),
    defaultValues: {
      titulo: "",
      descricao: "",
      data_limite: "",
    },
  });

  useEffect(() => {
    if (quotationDetail) {
      form.reset({
        titulo: quotationDetail.titulo,
        descricao: quotationDetail.descricao ?? "",
        data_limite: quotationDetail.data_limite ?? "",
      });
    }
  }, [quotationDetail, form]);

  const handleSubmit = async (values: QuotationFormValues) => {
    if (readOnly) return;

    if (isEditing && id) {
      await updateQuotation.mutateAsync({
        id,
        titulo: values.titulo,
        descricao: values.descricao || null,
        data_limite: values.data_limite || null,
      });
    } else {
      const created = await createQuotation.mutateAsync({
        titulo: values.titulo,
        descricao: values.descricao || null,
        data_limite: values.data_limite || null,
      });
      navigate(`/quotations/${created.id}/edit`);
    }
  };

  const handleClose = () => {
    if (!id) return;
    updateQuotationStatus.mutate({ id, status: isClosed ? "aberta" : "fechada" });
  };

  const handleApprove = async (responseId: string, observacao?: string | null) => {
    await approveResponse.mutateAsync({ responseId, observacao: observacao ?? undefined });
  };

  const title = isEditing ? "Editar cotação" : "Nova cotação";

  const isMutating = createQuotation.isPending || updateQuotation.isPending;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{title}</h1>
          {quotationDetail ? (
            <p className="flex items-center gap-2 text-muted-foreground">
              <span>Criada em {new Date(quotationDetail.created_at).toLocaleDateString("pt-BR")}</span>
              <QuotationStatusBadge status={quotationStatus ?? "aberta"} />
            </p>
          ) : (
            <p className="text-muted-foreground">Defina as informações principais e salve para adicionar fornecedores.</p>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {isEditing && id ? (
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={readOnly || updateQuotationStatus.isPending}
              className={cn(isClosed ? "border-indigo-500 text-indigo-600" : "")}
            >
              {updateQuotationStatus.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : isClosed ? (
                <><Unlock className="mr-2 h-4 w-4" /> Reabrir cotação</>
              ) : (
                <><Lock className="mr-2 h-4 w-4" /> Fechar cotação</>
              )}
            </Button>
          ) : null}
          {isEditing && id ? (
            <QuotationApprovalDialog
              responses={responses}
              onConfirm={handleApprove}
              disabled={readOnly || isClosed}
              isLoading={approveResponse.isPending}
            />
          ) : null}
        </div>
      </div>

      {readOnly ? (
        <Alert>
          <AlertTitle>Cotação aprovada</AlertTitle>
          <AlertDescription>
            Alterações não são permitidas após aprovação. Consulte os detalhes ou exporte a comparação.
          </AlertDescription>
        </Alert>
      ) : isClosed ? (
        <Alert>
          <AlertTitle>Cotação fechada</AlertTitle>
          <AlertDescription>
            Esta cotação está fechada para novas respostas. Reabra caso precise editar ou adicionar fornecedores.
          </AlertDescription>
        </Alert>
      ) : null}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <Card className="card-shadow">
            <CardHeader>
              <CardTitle>Informações da cotação</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="titulo"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Título</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={readOnly || isMutating} placeholder="Ex.: Limpeza – Outubro" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="descricao"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Textarea {...field} rows={4} disabled={readOnly || isMutating} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="data_limite"
                render={({ field }) => (
                  <FormItem className="md:w-64">
                    <FormLabel>Data limite (opcional)</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="date"
                        value={field.value ?? ""}
                        onChange={(event) => field.onChange(event.target.value)}
                        disabled={readOnly || isMutating}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => navigate(-1)}>
              Cancelar
            </Button>
            {!readOnly ? (
              <Button type="submit" disabled={isMutating}>
                {isMutating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Salvar
              </Button>
            ) : null}
          </div>
        </form>
      </Form>

      <Card className="card-shadow">
        <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Fornecedores &amp; respostas</CardTitle>
            <p className="text-sm text-muted-foreground">
              Compare valores, prazos e condições. Apenas respostas enviadas participam da aprovação.
            </p>
          </div>
          {isEditing && id ? (
            <QuotationResponseDialog
              quotationId={id}
              suppliers={suppliers ?? []}
              mutation={upsertResponse}
              disabled={readOnly || isClosed}
            />
          ) : null}
        </CardHeader>
        <CardContent>
          {!isEditing ? (
            <Alert>
              <AlertTitle>Salve a cotação primeiro</AlertTitle>
              <AlertDescription>
                Cadastre a cotação para liberar o registro das respostas de fornecedores.
              </AlertDescription>
            </Alert>
          ) : (
            <QuotationResponsesTable
              quotationId={id!}
              responses={responses}
              suppliers={suppliers ?? []}
              isLoading={isLoadingResponses || isLoadingQuotation}
              upsertMutation={upsertResponse}
              deleteMutation={deleteResponse}
              updateStatusMutation={updateResponseStatus}
              disabled={readOnly || isClosed}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default QuotationForm;
