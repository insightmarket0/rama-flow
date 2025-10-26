import { supabase } from "@/integrations/supabase/client";

export const getAuthenticatedUserId = async () => {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;

  const userId = data.user?.id;
  if (!userId) {
    throw new Error("Usuário não autenticado");
  }

  return userId;
};
