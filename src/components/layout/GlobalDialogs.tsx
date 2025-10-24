import { OrderDialog } from "@/components/orders/OrderDialog";
import { PaymentConditionDialog } from "@/components/payment-conditions/PaymentConditionDialog";
import { SupplierDialog } from "@/components/suppliers/SupplierDialog";

export const GlobalDialogs = () => (
  <>
    <OrderDialog enableGlobalOpen />
    <SupplierDialog listenForGlobalOpen />
    <PaymentConditionDialog listenForGlobalOpen />
  </>
);
