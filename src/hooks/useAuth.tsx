import { useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const syncProfile = async (currentUser: User) => {
      if (!currentUser?.email) return;
      try {
        const { data } = await supabase.from('profiles').select('full_name').eq('user_id', currentUser.id).single();
        if (!data || !data.full_name || data.full_name === 'Usuário') {
          let name = currentUser.email.split('@')[0];
          if (name.toLowerCase() === 'ander' || name.toLowerCase() === 'anderson') name = 'Anderson';
          if (name.toLowerCase() === 'will' || name.toLowerCase() === 'william') name = 'Will';
          const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);
          await supabase.from('profiles').upsert({ user_id: currentUser.id, full_name: capitalizedName });
        }
      } catch (e) {
        // Ignorar erros de RLS silenciosamente
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) syncProfile(session.user);
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) syncProfile(session.user);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    } finally {
      setUser(null);
      setSession(null);
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = "/auth";
    }
  };

  return { user, session, loading, signOut };
};
