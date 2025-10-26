import { PaymentConditionsPanel } from "@/components/payment-conditions/PaymentConditionsPanel";

const Condicoes = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-foreground">Condições de Pagamento</h1>
          <p className="text-muted-foreground">
            Gerencie todas as condições utilizadas nos pedidos de compra.
          </p>
        </div>
      </div>

      <PaymentConditionsPanel className="card-shadow" />
    </div>
  );
};

export default Condicoes;
