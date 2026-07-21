import { supabase } from './client';

export type InternalAnnouncement = {
  id: string;
  creator_id: string;
  title: string;
  content: string;
  is_pinned: boolean;
  created_at: string;
  // Campos populados pelo JOIN
  creator?: { full_name: string; avatar_url: string };
  acknowledgments?: AnnouncementAcknowledgment[];
  comments?: any[];
};

export type AnnouncementAcknowledgment = {
  id: string;
  announcement_id: string;
  user_id: string;
  acknowledged_at: string;
  user?: { full_name: string; avatar_url: string };
};

/**
 * Puxa todos os recados ordenando primeiro os fixados (is_pinned)
 * e depois pela data de criação. Traz junto o array de quem deu 'Ciente'.
 */
export async function getAnnouncements() {
  const { data, error } = await supabase
    .from('internal_announcements')
    .select(`
      *,
      creator:creator_id ( full_name, avatar_url ),
      acknowledgments:announcement_acknowledgments (
        id, user_id, acknowledged_at,
        user:user_id ( full_name, avatar_url )
      )
    `)
    .order('is_pinned', { ascending: false }) // Fixados primeiro (true antes de false)
    .order('created_at', { ascending: false }); // Mais recentes primeiro

  if (error) throw error;
  return data;
}

/**
 * Registra a leitura do usuário em um recado ("Ciente")
 */
export async function acknowledgeAnnouncement(announcementId: string, userId: string) {
  const { data, error } = await supabase
    .from('announcement_acknowledgments')
    .insert([
      {
        announcement_id: announcementId,
        user_id: userId
      }
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Criação de novo aviso (Uso restrito a gestores no frontend)
 */
export async function createAnnouncement(announcement: Omit<InternalAnnouncement, 'id' | 'created_at' | 'creator' | 'acknowledgments'>) {
  const { data, error } = await supabase
    .from('internal_announcements')
    .insert([announcement])
    .select()
    .single();

  if (error) throw error;
  return data as InternalAnnouncement;
}
