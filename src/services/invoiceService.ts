import { supabase } from '../lib/supabase';
import { Database } from '../types/database';

type Invoice = Database['public']['Tables']['invoices']['Row'];
type InvoiceInsert = Database['public']['Tables']['invoices']['Insert'];
type InvoiceUpdate = Database['public']['Tables']['invoices']['Update'];

export const invoiceService = {
  async getAll(companyId: string) {
    const { data, error } = await supabase
      .from('invoices')
      .select(`
        *,
        clients(*)
      `)
      .eq('company_id', companyId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('invoices')
      .select(`
        *,
        clients(*),
        payments(*)
      `)
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async getByClientId(clientId: string) {
    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async create(invoice: Omit<InvoiceInsert, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('invoices')
      .insert(invoice)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, updates: InvoiceUpdate) {
    const { data, error } = await supabase
      .from('invoices')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase.from('invoices').delete().eq('id', id);

    if (error) throw error;
  },

  async getNextInvoiceNumber(companyId: string) {
    const { data, error } = await supabase
      .from('invoices')
      .select('invoice_number')
      .eq('company_id', companyId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') throw error;

    if (!data) {
      return 'INV-1000';
    }

    const lastNumber = parseInt(data.invoice_number.split('-')[1] || '1000');
    return `INV-${lastNumber + 1}`;
  },

  async getPending(companyId: string) {
    const { data, error } = await supabase
      .from('invoices')
      .select(`
        *,
        clients(*)
      `)
      .eq('company_id', companyId)
      .eq('status', 'pending')
      .order('due_date');

    if (error) throw error;
    return data;
  },

  async getOverdue(companyId: string) {
    const today = new Date().toISOString().split('T')[0];

    const { data, error } = await supabase
      .from('invoices')
      .select(`
        *,
        clients(*)
      `)
      .eq('company_id', companyId)
      .eq('status', 'pending')
      .lt('due_date', today)
      .order('due_date');

    if (error) throw error;
    return data;
  },

  async getStats(companyId: string) {
    const { data: invoices, error } = await supabase
      .from('invoices')
      .select('status, total_amount')
      .eq('company_id', companyId);

    if (error) throw error;

    const stats = {
      total: invoices?.length || 0,
      pending: invoices?.filter((i) => i.status === 'pending').length || 0,
      paid: invoices?.filter((i) => i.status === 'paid').length || 0,
      overdue: invoices?.filter((i) => i.status === 'overdue').length || 0,
      totalAmount: invoices?.reduce((sum, i) => sum + Number(i.total_amount), 0) || 0,
      paidAmount: invoices
        ?.filter((i) => i.status === 'paid')
        .reduce((sum, i) => sum + Number(i.total_amount), 0) || 0,
      pendingAmount: invoices
        ?.filter((i) => i.status === 'pending')
        .reduce((sum, i) => sum + Number(i.total_amount), 0) || 0,
    };

    return stats;
  },
};
