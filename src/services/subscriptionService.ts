import { supabase } from '../lib/supabase';
import { Database } from '../types/database';

type Subscription = Database['public']['Tables']['subscriptions']['Row'];
type SubscriptionInsert = Database['public']['Tables']['subscriptions']['Insert'];
type SubscriptionUpdate = Database['public']['Tables']['subscriptions']['Update'];

export const subscriptionService = {
  async getAll(companyId: string) {
    const { data, error } = await supabase
      .from('subscriptions')
      .select(`
        *,
        clients(*),
        services(*)
      `)
      .eq('clients.company_id', companyId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('subscriptions')
      .select(`
        *,
        clients(*),
        services(*)
      `)
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async getByClientId(clientId: string) {
    const { data, error } = await supabase
      .from('subscriptions')
      .select(`
        *,
        services(*)
      `)
      .eq('client_id', clientId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async create(subscription: Omit<SubscriptionInsert, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('subscriptions')
      .insert(subscription)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, updates: SubscriptionUpdate) {
    const { data, error } = await supabase
      .from('subscriptions')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase.from('subscriptions').delete().eq('id', id);

    if (error) throw error;
  },

  async getActive(companyId: string) {
    const { data, error } = await supabase
      .from('subscriptions')
      .select(`
        *,
        clients(*),
        services(*)
      `)
      .eq('clients.company_id', companyId)
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getExpiring(companyId: string, daysAhead: number = 30) {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + daysAhead);

    const { data, error } = await supabase
      .from('subscriptions')
      .select(`
        *,
        clients(*),
        services(*)
      `)
      .eq('clients.company_id', companyId)
      .eq('status', 'active')
      .lte('end_date', futureDate.toISOString())
      .order('end_date');

    if (error) throw error;
    return data;
  },

  async getStats(companyId: string) {
    const { data: subscriptions, error } = await supabase
      .from('subscriptions')
      .select(`
        status,
        services(price)
      `)
      .eq('clients.company_id', companyId);

    if (error) throw error;

    const stats = {
      total: subscriptions?.length || 0,
      active: subscriptions?.filter((s) => s.status === 'active').length || 0,
      expired: subscriptions?.filter((s) => s.status === 'expired').length || 0,
      cancelled: subscriptions?.filter((s) => s.status === 'cancelled').length || 0,
      monthlyRevenue: subscriptions
        ?.filter((s) => s.status === 'active')
        .reduce((sum, s: any) => sum + Number(s.services?.price || 0), 0) || 0,
    };

    return stats;
  },
};
