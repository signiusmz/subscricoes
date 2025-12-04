import { supabase } from '../lib/supabase';
import { Database } from '../types/database';

type Payment = Database['public']['Tables']['payments']['Row'];
type PaymentInsert = Database['public']['Tables']['payments']['Insert'];

export const paymentService = {
  async getAll(companyId: string) {
    const { data, error } = await supabase
      .from('payments')
      .select(`
        *,
        invoices(
          *,
          clients(*)
        )
      `)
      .eq('invoices.company_id', companyId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('payments')
      .select(`
        *,
        invoices(
          *,
          clients(*)
        )
      `)
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async getByInvoiceId(invoiceId: string) {
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('invoice_id', invoiceId)
      .order('created_at', { ascending: false});

    if (error) throw error;
    return data;
  },

  async create(payment: Omit<PaymentInsert, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('payments')
      .insert(payment)
      .select()
      .single();

    if (error) throw error;

    if (data && payment.status === 'completed') {
      await supabase
        .from('invoices')
        .update({
          status: 'paid',
          paid_date: payment.payment_date,
          payment_method: payment.payment_method,
        })
        .eq('id', payment.invoice_id);
    }

    return data;
  },

  async updateStatus(id: string, status: string) {
    const { data, error } = await supabase
      .from('payments')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getStats(companyId: string) {
    const { data: payments, error } = await supabase
      .from('payments')
      .select(`
        status,
        amount,
        payment_method,
        invoices!inner(company_id)
      `)
      .eq('invoices.company_id', companyId);

    if (error) throw error;

    const stats = {
      total: payments?.length || 0,
      completed: payments?.filter((p) => p.status === 'completed').length || 0,
      pending: payments?.filter((p) => p.status === 'pending').length || 0,
      failed: payments?.filter((p) => p.status === 'failed').length || 0,
      totalAmount: payments
        ?.filter((p) => p.status === 'completed')
        .reduce((sum, p) => sum + Number(p.amount), 0) || 0,
      byMethod: {
        mpesa: payments?.filter((p) => p.payment_method === 'mpesa' && p.status === 'completed').length || 0,
        bank: payments?.filter((p) => p.payment_method === 'bank_transfer' && p.status === 'completed').length || 0,
        cash: payments?.filter((p) => p.payment_method === 'cash' && p.status === 'completed').length || 0,
      },
    };

    return stats;
  },
};
