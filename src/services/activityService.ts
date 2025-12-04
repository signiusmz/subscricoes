import { supabase } from '../lib/supabase';
import { Database } from '../types/database';

type ActivityLog = Database['public']['Tables']['activity_logs']['Insert'];

export const activityService = {
  async log(activity: Omit<ActivityLog, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('activity_logs')
      .insert(activity)
      .select()
      .single();

    if (error) {
      console.error('Error logging activity:', error);
      return null;
    }
    return data;
  },

  async getRecent(companyId: string, limit: number = 50) {
    const { data, error } = await supabase
      .from('activity_logs')
      .select('*')
      .eq('company_id', companyId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  },

  async getByEntity(entityType: string, entityId: string, limit: number = 50) {
    const { data, error } = await supabase
      .from('activity_logs')
      .select('*')
      .eq('entity_type', entityType)
      .eq('entity_id', entityId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  },

  async getByUser(userId: string, limit: number = 50) {
    const { data, error } = await supabase
      .from('activity_logs')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  },
};
