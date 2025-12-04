import { useState, useEffect, useCallback } from 'react';
import { invoiceService } from '../services/invoiceService';
import { activityService } from '../services/activityService';
import { useAuth } from '../context/AuthContext';

export function useInvoices() {
  const { company, user } = useAuth();
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInvoices = useCallback(async () => {
    if (!company?.id) return;

    try {
      setLoading(true);
      setError(null);
      const data = await invoiceService.getAll(company.id);
      setInvoices(data || []);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching invoices:', err);
    } finally {
      setLoading(false);
    }
  }, [company?.id]);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  const createInvoice = async (invoiceData: any) => {
    if (!company?.id || !user?.id) throw new Error('Missing company or user');

    const invoiceNumber = await invoiceService.getNextInvoiceNumber(company.id);

    const newInvoice = await invoiceService.create({
      ...invoiceData,
      company_id: company.id,
      user_id: user.id,
      invoice_number: invoiceNumber,
    });

    setInvoices((prev) => [newInvoice, ...prev]);

    await activityService.log({
      company_id: company.id,
      user_id: user.id,
      entity_type: 'invoice',
      entity_id: newInvoice.id,
      action: 'create',
      details: { invoice_number: invoiceNumber },
    });

    return newInvoice;
  };

  const updateInvoice = async (id: string, updates: any) => {
    if (!company?.id || !user?.id) throw new Error('Missing company or user');

    const updated = await invoiceService.update(id, updates);
    setInvoices((prev) => prev.map((i) => (i.id === id ? updated : i)));

    await activityService.log({
      company_id: company.id,
      user_id: user.id,
      entity_type: 'invoice',
      entity_id: id,
      action: 'update',
      details: { updates },
    });

    return updated;
  };

  const deleteInvoice = async (id: string) => {
    if (!company?.id || !user?.id) throw new Error('Missing company or user');

    await invoiceService.delete(id);
    setInvoices((prev) => prev.filter((i) => i.id !== id));

    await activityService.log({
      company_id: company.id,
      user_id: user.id,
      entity_type: 'invoice',
      entity_id: id,
      action: 'delete',
      details: {},
    });
  };

  const getStats = async () => {
    if (!company?.id) return null;
    return await invoiceService.getStats(company.id);
  };

  return {
    invoices,
    loading,
    error,
    refresh: fetchInvoices,
    createInvoice,
    updateInvoice,
    deleteInvoice,
    getStats,
  };
}
