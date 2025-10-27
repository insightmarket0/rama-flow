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

export const getCurrentOrganizationId = async (): Promise<string | null> => {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;

  const meta = (data.user?.user_metadata ?? {}) as Record<string, unknown>;
  const candidate =
    (meta["organization_id"] as string | undefined) ||
    (meta["organizationId"] as string | undefined) ||
    (meta["org_id"] as string | undefined) ||
    null;

  return candidate ?? null;
};
