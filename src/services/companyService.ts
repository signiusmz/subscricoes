import { supabase } from '../lib/supabase';
import { Database } from '../types/database';

type Company = Database['public']['Tables']['companies']['Row'];
type CompanyUpdate = Database['public']['Tables']['companies']['Update'];
type CompanySettings = Database['public']['Tables']['company_settings']['Row'];
type CompanySettingsUpdate = Database['public']['Tables']['company_settings']['Update'];

export const companyService = {
  async getById(id: string) {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async update(id: string, updates: CompanyUpdate) {
    const { data, error } = await supabase
      .from('companies')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getSettings(companyId: string) {
    const { data, error } = await supabase
      .from('company_settings')
      .select('*')
      .eq('company_id', companyId)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async updateSettings(companyId: string, settings: CompanySettingsUpdate) {
    const { data, error } = await supabase
      .from('company_settings')
      .update(settings)
      .eq('company_id', companyId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getAllCompanies() {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getCompanyStats() {
    const { data: companies, error } = await supabase
      .from('companies')
      .select('status, plan, monthly_payment');

    if (error) throw error;

    const stats = {
      total: companies?.length || 0,
      active: companies?.filter((c) => c.status === 'active').length || 0,
      trial: companies?.filter((c) => c.status === 'trial').length || 0,
      suspended: companies?.filter((c) => c.status === 'suspended').length || 0,
      cancelled: companies?.filter((c) => c.status === 'cancelled').length || 0,
      totalRevenue: companies
        ?.filter((c) => c.status === 'active')
        .reduce((sum, c) => sum + Number(c.monthly_payment || 0), 0) || 0,
    };

    return stats;
  },

  async cancelSubscription(companyId: string) {
    const now = new Date().toISOString();

    const { data, error } = await supabase
      .from('companies')
      .update({
        status: 'cancelled',
        subscription_ends_at: now
      })
      .eq('id', companyId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};
