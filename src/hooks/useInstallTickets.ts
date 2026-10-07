import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";

export type InstallTicket = {
  id: string;
  displayId?: string;
  customerName: string;
  whatsapp: string;
  address: string;
  orderType: string;
  product?: string;
  serviceRequested: string;
  price: string;
  paymentMethod: string;
  scheduledDate: string;
  scheduledTime?: string;
  technician: string;
  status: 'pending' | 'in_progress' | 'completed';
  createdAt?: string;
};

const mapFromDB = (dbTicket: any): InstallTicket => ({
  id: dbTicket.id,
  displayId: dbTicket.display_id,
  customerName: dbTicket.customer_name,
  whatsapp: dbTicket.whatsapp,
  address: dbTicket.address,
  orderType: dbTicket.order_type,
  product: dbTicket.product,
  serviceRequested: dbTicket.service_requested,
  price: dbTicket.price,
  paymentMethod: dbTicket.payment_method,
  scheduledDate: dbTicket.scheduled_date,
  scheduledTime: dbTicket.scheduled_time,
  technician: dbTicket.technician,
  status: dbTicket.status,
  createdAt: dbTicket.created_at,
});

const mapToDB = (ticket: any): any => ({
  display_id: ticket.displayId || ticket.id,
  customer_name: ticket.customerName,
  whatsapp: ticket.whatsapp,
  address: ticket.address,
  order_type: ticket.orderType,
  product: ticket.product,
  service_requested: ticket.serviceRequested,
  price: ticket.price,
  payment_method: ticket.paymentMethod,
  scheduled_date: ticket.scheduledDate,
  scheduled_time: ticket.scheduledTime,
  technician: ticket.technician,
  status: ticket.status,
});

export const useInstallTickets = () => {
  const queryClient = useQueryClient();

  const { data: tickets = [], isLoading } = useQuery({
    queryKey: ["install-tickets"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("install_tickets")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return (data || []).map(mapFromDB);
    },
  });

  useEffect(() => {
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'install_tickets'
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ["install-tickets"] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const addTicket = useMutation({
    mutationFn: async (ticket: Omit<InstallTicket, "id" | "createdAt">) => {
      const dbPayload = mapToDB(ticket);
      const { data, error } = await supabase
        .from("install_tickets")
        .insert([dbPayload])
        .select()
        .single();
      
      if (error) throw error;
      return mapFromDB(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["install-tickets"] });
    },
    onError: (error) => {
      console.error("Erro ao adicionar agendamento:", error);
    }
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: InstallTicket["status"] }) => {
      const { data, error } = await supabase
        .from("install_tickets")
        .update({ status })
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      return mapFromDB(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["install-tickets"] });
    }
  });

  const updatePrice = useMutation({
    mutationFn: async ({ id, price }: { id: string; price: string }) => {
      const { data, error } = await supabase
        .from("install_tickets")
        .update({ price })
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      return mapFromDB(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["install-tickets"] });
    }
  });

  const deleteTicket = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("install_tickets")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["install-tickets"] });
    }
  });

  return {
    tickets,
    isLoading,
    addTicket: addTicket.mutateAsync,
    updateStatus: updateStatus.mutateAsync,
    updatePrice: updatePrice.mutateAsync,
    deleteTicket: deleteTicket.mutateAsync
  };
};
