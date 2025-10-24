import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

export interface OrderItem {
  sku: string;
  description: string;
  quantity: number;
  unit_price: number;
}

export interface Order {
  id: string;
  order_number: string;
  supplier_id: string;
  payment_condition_id: string;
  total_value: number;
  freight: number;
  discount: number;
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
  items: OrderItem[];
  freight: number;
  discount: number;
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
      return data.map((order) => ({
        ...order,
        items: order.items as unknown as OrderItem[],
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
      const total_value = itemsTotal + orderData.freight - orderData.discount;

      // Generate order number
      const orderCount = orders?.length || 0;
      const order_number = `#${String(orderCount + 1).padStart(3, "0")}`;

      // Create order
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert([{
          user_id: user.id,
          order_number,
          supplier_id: orderData.supplier_id,
          payment_condition_id: orderData.payment_condition_id,
          total_value,
          freight: orderData.freight,
          discount: orderData.discount,
          items: orderData.items as any,
          status: "aberto",
        }])
        .select()
        .single();

      if (orderError) throw orderError;

      // Get payment condition details
      const { data: paymentCondition, error: pcError } = await supabase
        .from("payment_conditions")
        .select("*")
        .eq("id", orderData.payment_condition_id)
        .single();

      if (pcError) throw pcError;

      // Calculate installments
      const installments = [];
      const downPayment = (total_value * paymentCondition.down_payment_percent) / 100;
      const remainingValue = total_value - downPayment;
      const installmentValue = remainingValue / paymentCondition.installments;

      // Add down payment if exists
      if (downPayment > 0) {
        installments.push({
          user_id: user.id,
          order_id: order.id,
          supplier_id: orderData.supplier_id,
          installment_number: 0,
          value: downPayment,
          due_date: new Date().toISOString().split("T")[0],
          status: "pendente",
        });
      }

      // Add installments
      for (let i = 1; i <= paymentCondition.installments; i++) {
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + i * paymentCondition.interval_days);

        installments.push({
          user_id: user.id,
          order_id: order.id,
          supplier_id: orderData.supplier_id,
          installment_number: i,
          value: installmentValue,
          due_date: dueDate.toISOString().split("T")[0],
          status: "pendente",
        });
      }

      // Insert installments
      const { error: installmentsError } = await supabase
        .from("installments")
        .insert(installments);

      if (installmentsError) throw installmentsError;

      return order;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["installments"] });
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
