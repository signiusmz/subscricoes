import { supabase } from '../lib/supabase';
import { Database } from '../types/database';

type Client = Database['public']['Tables']['clients']['Row'];
type ClientInsert = Database['public']['Tables']['clients']['Insert'];
type ClientUpdate = Database['public']['Tables']['clients']['Update'];

export const clientService = {
  async getAll(companyId: string) {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('company_id', companyId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async create(client: Omit<ClientInsert, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('clients')
      .insert(client)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, updates: ClientUpdate) {
    const { data, error } = await supabase
      .from('clients')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase.from('clients').delete().eq('id', id);

    if (error) throw error;
  },

  async search(companyId: string, query: string) {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('company_id', companyId)
      .or(`name.ilike.%${query}%,email.ilike.%${query}%,phone.ilike.%${query}%`)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getBySegment(companyId: string, segment: string) {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('company_id', companyId)
      .eq('segment', segment)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getStats(companyId: string) {
    const { data: clients, error } = await supabase
      .from('clients')
      .select('status, segment')
      .eq('company_id', companyId);

    if (error) throw error;

    const stats = {
      total: clients?.length || 0,
      active: clients?.filter((c) => c.status === 'active').length || 0,
      inactive: clients?.filter((c) => c.status === 'inactive').length || 0,
      bySegment: {
        premium: clients?.filter((c) => c.segment === 'premium').length || 0,
        gold: clients?.filter((c) => c.segment === 'gold').length || 0,
        silver: clients?.filter((c) => c.segment === 'silver').length || 0,
        bronze: clients?.filter((c) => c.segment === 'bronze').length || 0,
      },
    };

    return stats;
  },
};
