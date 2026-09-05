import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PurchasePaymentTab } from "@/components/purchases/PurchasePaymentTab";
import { OrderManagementTab } from "@/components/purchases/OrderManagementTab";
import { PaymentConditionsTab } from "@/components/purchases/PaymentConditionsTab";
import { OrderDialog } from "@/components/purchases/OrderDialog";
import { SupplierManagementTab } from "@/components/purchases/SupplierManagementTab";
import { useOrders } from "@/hooks/useOrders";
import { useInstallments } from "@/hooks/useInstallments";
import { usePaymentConditions } from "@/hooks/usePaymentConditions";
import { useSuppliers } from "@/hooks/useSuppliers";

export default function PedidosCompras() {
  const [activeTab, setActiveTab] = useState("payments");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<any>(null);

  const { orders = [], isLoading: loadingOrders, deleteOrder, updateOrderStatus } = useOrders();
  const { installments = [], isLoading: loadingInstallments, markAsPaid } = useInstallments();
  const { paymentConditions = [], isLoading: loadingConditions, createPaymentCondition, updatePaymentCondition, deletePaymentCondition } = usePaymentConditions();
  const { suppliers = [], isLoading: loadingSuppliers, createSupplier, updateSupplier, deleteSupplier } = useSuppliers();

  const handleEditOrder = (order: any) => {
    setEditingOrder(order);
    setDialogOpen(true);
  };

  const handleCreateOrder = () => {
    setEditingOrder(null);
    setDialogOpen(true);
  };

  const handleDeleteOrder = async (id: string) => {
    if (confirm("Tem certeza que deseja remover este pedido? As parcelas geradas também serão removidas.")) {
      await deleteOrder.mutateAsync(id);
    }
  };

  return (
    <>
      <div className="animate-in fade-in duration-700 pb-10 w-full">
        <div className="mb-3">
          <p className="text-gray-500 font-medium text-xs tracking-widest uppercase">
            Gestão de Pedidos e Suprimentos
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full mb-6 gap-4">
            <TabsList className="grid w-full grid-cols-3 sm:w-[500px] bg-[#111111]/80 backdrop-blur-sm border border-white/5 rounded-lg p-1 h-9">
              <TabsTrigger value="payments" className="rounded-md data-[state=active]:bg-white/10 data-[state=active]:text-white text-[11px] h-full transition-all">
                Contas a Pagar
              </TabsTrigger>
              <TabsTrigger value="management" className="rounded-md data-[state=active]:bg-white/10 data-[state=active]:text-white text-[11px] h-full transition-all">
                Gestão de Pedidos
              </TabsTrigger>
              <TabsTrigger value="suppliers" className="rounded-md data-[state=active]:bg-white/10 data-[state=active]:text-white text-[11px] h-full transition-all">
                Fornecedores
              </TabsTrigger>
            </TabsList>

            {activeTab === "payments" && (
              <Button 
                onClick={handleCreateOrder}
                className="bg-[#00FF00] text-black hover:bg-[#00FF00]/80 shadow-[0_0_15px_rgba(0,255,0,0.2)] font-semibold rounded-full px-6 h-9"
              >
                + Novo Pedido
              </Button>
            )}
          </div>

          <TabsContent value="management" className="space-y-6 mt-6">
            <OrderManagementTab 
              orders={orders}
              loadingOrders={loadingOrders}
              onNew={handleCreateOrder}
              onEdit={handleEditOrder}
              onDelete={handleDeleteOrder}
              onUpdateStatus={updateOrderStatus.mutateAsync}
              paymentConditions={paymentConditions}
              loadingConditions={loadingConditions}
              onCreateCondition={createPaymentCondition.mutateAsync}
              onUpdateCondition={updatePaymentCondition.mutateAsync}
              onDeleteCondition={deletePaymentCondition.mutateAsync}
            />
          </TabsContent>

          <TabsContent value="payments" className="space-y-6 mt-6">
            <PurchasePaymentTab 
              installments={installments}
              loadingInstallments={loadingInstallments}
              markAsPaid={markAsPaid}
              orders={orders}
              onNew={handleCreateOrder}
            />
          </TabsContent>
          
          <TabsContent value="suppliers" className="space-y-6 mt-6">
            <SupplierManagementTab 
              suppliers={suppliers}
              loadingSuppliers={loadingSuppliers}
              orders={orders}
              onCreate={createSupplier.mutateAsync}
              onUpdate={updateSupplier.mutateAsync}
              onDelete={deleteSupplier.mutateAsync}
            />
          </TabsContent>
        </Tabs>
      </div>

      <OrderDialog 
        open={dialogOpen} 
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setEditingOrder(null);
        }}
        orderToEdit={editingOrder}
        suppliers={suppliers}
        paymentConditions={paymentConditions}
      />
    </>
  );
}
