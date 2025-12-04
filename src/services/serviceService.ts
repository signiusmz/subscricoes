import { supabase } from '../lib/supabase';
import { Database } from '../types/database';

type Service = Database['public']['Tables']['services']['Row'];
type ServiceInsert = Database['public']['Tables']['services']['Insert'];
type ServiceUpdate = Database['public']['Tables']['services']['Update'];

export const serviceService = {
  async getAll(companyId: string) {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('company_id', companyId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async create(service: Omit<ServiceInsert, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('services')
      .insert(service)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, updates: ServiceUpdate) {
    const { data, error } = await supabase
      .from('services')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase.from('services').delete().eq('id', id);

    if (error) throw error;
  },

  async getActive(companyId: string) {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('company_id', companyId)
      .eq('is_active', true)
      .order('name');

    if (error) throw error;
    return data;
  },

  async getByCategory(companyId: string, category: string) {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('company_id', companyId)
      .eq('category', category)
      .order('name');

    if (error) throw error;
    return data;
  },

  async getStats(companyId: string) {
    const { data: services, error } = await supabase
      .from('services')
      .select('is_active, billing_type, price')
      .eq('company_id', companyId);

    if (error) throw error;

    const stats = {
      total: services?.length || 0,
      active: services?.filter((s) => s.is_active).length || 0,
      inactive: services?.filter((s) => !s.is_active).length || 0,
      totalRevenue: services?.reduce((sum, s) => sum + Number(s.price), 0) || 0,
    };

    return stats;
  },
};
