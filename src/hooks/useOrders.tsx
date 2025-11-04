import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Json, Tables } from "@/integrations/supabase/types";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { generateInstallmentPlan } from "@/lib/installments";
import type { PostgrestError } from "@supabase/supabase-js";

export interface OrderItem {
  sku: string;
  description: string;
  quantity: number;
  unit_price: number;
}

export interface Order {
  id: string;
  order_number: string;
  invoice_number: string | null;
  supplier_id: string;
  payment_condition_id: string;
  total_value: number;
  freight: number;
  discount: number;
  taxes: number;
  order_date: string | null;
  status: string;
  items: OrderItem[];
  created_at: string;
  supplier?: {
    name: string;
  };
  payment_condition?: {
    name: string;
  };
}

export interface CreateOrderData {
  supplier_id: string;
  payment_condition_id: string;
  order_number?: string;
  invoice_number?: string;
  items: OrderItem[];
  freight: number;
  discount: number;
  taxes: number;
  order_date: string;
  installments_override?: {
    installmentNumber: number;
    value: number;
    due_date: string;
  }[];
}

export const useOrders = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const { data: orders, isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          supplier:suppliers(name),
          payment_condition:payment_conditions(name)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return (data ?? []).map((order) => ({
        ...order,
        items: (order.items as unknown as OrderItem[]) ?? [],
        freight: Number(order.freight ?? 0),
        discount: Number(order.discount ?? 0),
        taxes: Number((order as { taxes?: number | null }).taxes ?? 0),
        total_value: Number(order.total_value ?? 0),
        order_date: order.order_date ?? null,
        invoice_number: (order as { invoice_number?: string | null }).invoice_number ?? null,
      })) as Order[];
    },
  });

  const createOrder = useMutation({
    mutationFn: async (orderData: CreateOrderData) => {
      if (!user) throw new Error("Usuário não autenticado");

      // Calculate total value
      const itemsTotal = orderData.items.reduce(
        (sum, item) => sum + item.quantity * item.unit_price,
        0
      );
      const total_value = itemsTotal + orderData.freight + orderData.taxes - orderData.discount;

      const manualOrderNumber = orderData.order_number?.trim() || null;

      const getNextOrderNumber = async () => {
        const { data, error } = await supabase
          .from("orders")
          .select("order_number")
          .eq("user_id", user.id)
          .ilike("order_number", "#%")
          .order("order_number", { ascending: false })
          .limit(1);

        if (error) throw error;

        const latest = data?.[0]?.order_number ?? null;
        const numericMatch = latest?.match(/\d+/g);
        const numericString = numericMatch ? numericMatch[numericMatch.length - 1] : null;
        const numericValue = numericString ? parseInt(numericString, 10) : NaN;
        const nextValue = Number.isNaN(numericValue) ? 1 : numericValue + 1;

        return `#${String(nextValue).padStart(3, "0")}`;
      };

      let orderNumberToUse = manualOrderNumber || (await getNextOrderNumber());
      let createdOrder: Tables<"orders"> | null = null;
      let lastError: PostgrestError | null = null;

      for (let attempt = 0; attempt < 3; attempt++) {
        const { data, error: orderError } = await supabase
          .from("orders")
          .insert([{
            user_id: user.id,
            order_number: orderNumberToUse,
            invoice_number: orderData.invoice_number?.trim() || null,
            supplier_id: orderData.supplier_id,
            payment_condition_id: orderData.payment_condition_id,
            total_value,
            freight: orderData.freight,
            discount: orderData.discount,
            taxes: orderData.taxes,
            order_date: orderData.order_date || null,
            items: orderData.items.map((item) => ({
              sku: item.sku,
              description: item.description,
              quantity: item.quantity,
              unit_price: item.unit_price,
            })) as Json,
            status: "aberto",
          }])
          .select()
          .single();

        if (!orderError) {
          createdOrder = data;
          break;
        }

        lastError = orderError;

        if (orderError.code === "23505" && !manualOrderNumber) {
          orderNumberToUse = await getNextOrderNumber();
          continue;
        }

        throw orderError;
      }

      if (!createdOrder) {
        if (lastError) {
          throw lastError;
        }
        throw new Error("Não foi possível gerar um número de pedido único automaticamente.");
      }

      const order = createdOrder;

      // Get payment condition details
      const { data: paymentCondition, error: pcError } = await supabase
        .from("payment_conditions")
        .select("*")
        .eq("id", orderData.payment_condition_id)
        .single();

      if (pcError) throw pcError;

      const normalizedPaymentCondition = {
        ...paymentCondition,
        due_days: paymentCondition.due_days
          ? paymentCondition.due_days.map((day: number) => Number(day))
          : null,
      } as Tables<"payment_conditions">;

      const baseDate = orderData.order_date
        ? new Date(`${orderData.order_date}T00:00:00`)
        : new Date();
      const normalizedBaseDate = Number.isNaN(baseDate.getTime()) ? new Date() : baseDate;
      const plan =
        orderData.installments_override && orderData.installments_override.length > 0
          ? orderData.installments_override
              .filter((item) => item.due_date)
              .map((item) => {
                const parsed = new Date(`${item.due_date}T00:00:00`);
                return {
                  installmentNumber: item.installmentNumber,
                  value: item.value,
                  dueDate: Number.isNaN(parsed.getTime()) ? normalizedBaseDate : parsed,
                };
              })
          : generateInstallmentPlan(total_value, normalizedPaymentCondition, normalizedBaseDate);

      const installments = plan
        .filter((item) => item.value > 0)
        .map((item) => ({
          user_id: user.id,
          order_id: order.id,
          supplier_id: orderData.supplier_id,
          installment_number: item.installmentNumber,
          value: item.value,
          due_date: item.dueDate.toISOString().split("T")[0],
          status: "pendente",
        }));

      if (installments.length > 0) {
        const { error: installmentsError } = await supabase
          .from("installments")
          .insert(installments);

        if (installmentsError) throw installmentsError;
      }

      // If there are no installments (e.g., 0 total), nothing else to insert.

      return order;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["installments"] });
      queryClient.invalidateQueries({ queryKey: ["onboarding", "progress"] });
      toast({
        title: "Pedido criado com sucesso!",
        description: "As parcelas foram geradas automaticamente.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao criar pedido",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteOrder = useMutation({
    mutationFn: async (id: string) => {
      // Delete installments first
      const { error: installmentsError } = await supabase
        .from("installments")
        .delete()
        .eq("order_id", id);

      if (installmentsError) throw installmentsError;

      // Then delete order
      const { error } = await supabase.from("orders").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["installments"] });
      queryClient.invalidateQueries({ queryKey: ["onboarding", "progress"] });
      toast({
        title: "Pedido deletado com sucesso!",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao deletar pedido",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateOrderStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from("orders")
        .update({ status })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["onboarding", "progress"] });
      toast({
        title: "Status atualizado!",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao atualizar status",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    orders,
    isLoading,
    createOrder,
    deleteOrder,
    updateOrderStatus,
  };
};
