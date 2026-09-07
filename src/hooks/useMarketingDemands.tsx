import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface MarketingDemand {
  id: string;
  created_at: string;
  user_id: string;
  title: string;
  description: string | null;
  status: "backlog" | "in_progress" | "review" | "adjustment" | "approved";
  priority: "low" | "medium" | "high";
  cover_image: string | null;
  comments_count: number;
  attachments_count: number;
  due_date: string | null;
  creator_name?: string;
  creator_avatar?: string;
  comments?: any[];
}

export type MarketingDemandInsert = Omit<MarketingDemand, "id" | "created_at" | "user_id" | "comments_count" | "attachments_count" | "creator_name" | "creator_avatar" | "comments">;
export type MarketingDemandUpdate = Partial<MarketingDemandInsert>;

export const useMarketingDemands = () => {
  const queryClient = useQueryClient();

  const { data: demands = [], isLoading } = useQuery({
    queryKey: ["marketing_demands"],
    queryFn: async () => {
      // Busca as demandas
      const { data, error } = await supabase
        .from("marketing_demands")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) {
        if (error.code === '42P01') return [];
        throw error;
      }

      // Busca os perfis para pegar os nomes
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, full_name");

      // Anexa o nome do criador à demanda
      return (data as MarketingDemand[]).map(demand => {
        const profile = profiles?.find(p => p.user_id === demand.user_id);
        const name = profile?.full_name || "Usuário";
        let avatar = "";
        if (name.toLowerCase().includes("mara")) avatar = "/mara.png";
        else if (name.toLowerCase().includes("rogério") || name.toLowerCase().includes("rogerio")) avatar = "/rogerio.png";
        else if (name.toLowerCase().includes("lívia") || name.toLowerCase().includes("livia")) avatar = "/livia.png";
        else avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;

        return {
          ...demand,
          creator_name: name,
          creator_avatar: avatar
        };
      });
    },
  });

  const createDemand = useMutation({
    mutationFn: async (demand: MarketingDemandInsert) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      const { data, error } = await supabase
        .from("marketing_demands")
        .insert({ ...demand, user_id: user.id })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["marketing_demands"] });
      toast.success("Demanda criada com sucesso!");
    },
    onError: (error) => {
      toast.error("Erro ao criar demanda: " + error.message);
    },
  });

  const updateDemand = useMutation({
    mutationFn: async ({ id, ...updates }: MarketingDemandUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from("marketing_demands")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["marketing_demands"] });
    },
    onError: (error) => {
      toast.error("Erro ao atualizar demanda: " + error.message);
    },
  });

  const deleteDemand = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("marketing_demands")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["marketing_demands"] });
      toast.success("Demanda removida com sucesso!");
    },
    onError: (error) => {
      toast.error("Erro ao remover demanda: " + error.message);
    },
  });

  const uploadImage = useMutation({
    mutationFn: async ({ file, demandId }: { file: File, demandId: string }) => {
      const fileExt = file.name.split('.').pop();
      const fileName = `${demandId}-${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('marketing_demands')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('marketing_demands')
        .getPublicUrl(filePath);

      const { data, error } = await supabase
        .from("marketing_demands")
        .update({ cover_image: publicUrl })
        .eq("id", demandId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["marketing_demands"] });
      toast.success("Arte anexada com sucesso!");
    },
    onError: (error) => {
      toast.error("Erro ao anexar arte: " + error.message);
    },
  });

  const addComment = useMutation({
    mutationFn: async ({ demandId, text, userName, userAvatar }: { demandId: string, text: string, userName: string, userAvatar: string }) => {
      const demand = demands.find(d => d.id === demandId);
      if (!demand) throw new Error("Demand not found");
      
      const newComment = {
        id: Math.random().toString(36).substring(7),
        text,
        user_name: userName,
        user_avatar: userAvatar,
        created_at: new Date().toISOString()
      };
      
      const updatedComments = [...(demand.comments || []), newComment];
      
      const { data, error } = await supabase
        .from("marketing_demands")
        .update({ 
          comments: updatedComments,
          comments_count: updatedComments.length 
        })
        .eq("id", demandId)
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["marketing_demands"] });
    },
    onError: (error) => {
      toast.error("Erro ao adicionar comentário: " + error.message);
    }
  });

  return {
    demands,
    isLoading,
    createDemand,
    updateDemand,
    deleteDemand,
    uploadImage,
    addComment
  };
};
