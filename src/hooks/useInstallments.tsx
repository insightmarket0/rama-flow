import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { useToast } from "@/hooks/use-toast";

export type InstallmentStatus = "pendente" | "atrasado" | "pago";

export interface InstallmentWithRelations extends Tables<"installments"> {
  supplier?: {
    name: string;
  };
  order?: {
    order_number: string;
  };
  status: InstallmentStatus;
}

export interface InstallmentFilters {
  status: InstallmentStatus | "todos";
  startDate: string | null;
  endDate: string | null;
}

const defaultFilters: InstallmentFilters = {
  status: "todos",
  startDate: null,
  endDate: null,
};

export const useInstallments = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [filters, setFilters] = useState<InstallmentFilters>(defaultFilters);

  const { data: installments, isLoading, isFetching } = useQuery({
    queryKey: ["installments", filters],
    queryFn: async () => {
      const today = new Date();
      const todayISO = today.toISOString().split("T")[0];

      // Automatically mark overdue installments as "atrasado"
      const { error: overdueError } = await supabase
        .from("installments")
        .update({
          status: "atrasado",
          updated_at: new Date().toISOString(),
        })
        .lt("due_date", todayISO)
        .eq("status", "pendente");

      if (overdueError) {
        throw overdueError;
      }

      let query = supabase
        .from("installments")
        .select(`
          *,
          supplier:suppliers(name),
          order:orders(order_number)
        `)
        .order("due_date", { ascending: true });

      if (filters.status !== "todos") {
        query = query.eq("status", filters.status);
      }

      if (filters.startDate) {
        query = query.gte("due_date", filters.startDate);
      }

      if (filters.endDate) {
        query = query.lte("due_date", filters.endDate);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      return (data || []).map((item) => {
        const status = item.status as InstallmentStatus | null;
        const baseStatus = (status ?? "pendente") as InstallmentStatus;
        const normalizedStatus: InstallmentStatus =
          baseStatus === "pago"
            ? "pago"
            : item.due_date < todayISO
            ? "atrasado"
            : baseStatus === "atrasado"
            ? "atrasado"
            : "pendente";

        return {
          ...item,
          status: normalizedStatus,
        } as InstallmentWithRelations;
      });
    },
  });

  const updateFilters = useCallback(
    (newFilters: Partial<InstallmentFilters>) => {
      setFilters((prev) => ({
        ...prev,
        ...newFilters,
      }));
    },
    []
  );

  const resetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const markAsPaid = useMutation({
    mutationFn: async (id: string) => {
      const timestamp = new Date().toISOString();

      const { error } = await supabase
        .from("installments")
        .update({
          status: "pago",
          paid_at: timestamp,
          updated_at: timestamp,
        })
        .eq("id", id);

      if (error) {
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["installments"] });
      toast({
        title: "Parcela atualizada",
        description: "Status marcado como pago.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao atualizar parcela",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    installments,
    isLoading,
    isFetching,
    filters,
    updateFilters,
    resetFilters,
    markAsPaid,
  };
};
