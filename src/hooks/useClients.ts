import { useState, useEffect, useCallback } from 'react';
import { clientService } from '../services/clientService';
import { activityService } from '../services/activityService';
import { useAuth } from '../context/AuthContext';

export function useClients() {
  const { company, user } = useAuth();
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClients = useCallback(async () => {
    if (!company?.id) return;

    try {
      setLoading(true);
      setError(null);
      const data = await clientService.getAll(company.id);
      setClients(data || []);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching clients:', err);
    } finally {
      setLoading(false);
    }
  }, [company?.id]);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const createClient = async (clientData: any) => {
    if (!company?.id || !user?.id) throw new Error('Missing company or user');

    const newClient = await clientService.create({
      ...clientData,
      company_id: company.id,
      user_id: user.id,
    });

    setClients((prev) => [newClient, ...prev]);

    await activityService.log({
      company_id: company.id,
      user_id: user.id,
      entity_type: 'client',
      entity_id: newClient.id,
      action: 'create',
      details: { name: clientData.name },
    });

    return newClient;
  };

  const updateClient = async (id: string, updates: any) => {
    if (!company?.id || !user?.id) throw new Error('Missing company or user');

    const updated = await clientService.update(id, updates);
    setClients((prev) => prev.map((c) => (c.id === id ? updated : c)));

    await activityService.log({
      company_id: company.id,
      user_id: user.id,
      entity_type: 'client',
      entity_id: id,
      action: 'update',
      details: { updates },
    });

    return updated;
  };

  const deleteClient = async (id: string) => {
    if (!company?.id || !user?.id) throw new Error('Missing company or user');

    await clientService.delete(id);
    setClients((prev) => prev.filter((c) => c.id !== id));

    await activityService.log({
      company_id: company.id,
      user_id: user.id,
      entity_type: 'client',
      entity_id: id,
      action: 'delete',
      details: {},
    });
  };

  const searchClients = async (query: string) => {
    if (!company?.id) return [];
    const results = await clientService.search(company.id, query);
    return results;
  };

  const getStats = async () => {
    if (!company?.id) return null;
    return await clientService.getStats(company.id);
  };

  return {
    clients,
    loading,
    error,
    refresh: fetchClients,
    createClient,
    updateClient,
    deleteClient,
    searchClients,
    getStats,
  };
}
