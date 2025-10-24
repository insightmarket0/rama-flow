export const OPEN_ORDER_DIALOG_EVENT = "open-order-dialog";
export const OPEN_SUPPLIER_DIALOG_EVENT = "open-supplier-dialog";
export const OPEN_PAYMENT_CONDITION_DIALOG_EVENT = "open-payment-condition-dialog";

export const dispatchAppEvent = (eventName: string) => {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new CustomEvent(eventName));
};
