import { useState, useEffect, useCallback } from 'react';
import { serviceService } from '../services/serviceService';
import { activityService } from '../services/activityService';
import { useAuth } from '../context/AuthContext';

export function useServices() {
  const { company, user } = useAuth();
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchServices = useCallback(async () => {
    if (!company?.id) return;

    try {
      setLoading(true);
      setError(null);
      const data = await serviceService.getAll(company.id);
      setServices(data || []);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching services:', err);
    } finally {
      setLoading(false);
    }
  }, [company?.id]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const createService = async (serviceData: any) => {
    if (!company?.id || !user?.id) throw new Error('Missing company or user');

    const newService = await serviceService.create({
      ...serviceData,
      company_id: company.id,
      user_id: user.id,
    });

    setServices((prev) => [newService, ...prev]);

    await activityService.log({
      company_id: company.id,
      user_id: user.id,
      entity_type: 'service',
      entity_id: newService.id,
      action: 'create',
      details: { name: serviceData.name },
    });

    return newService;
  };

  const updateService = async (id: string, updates: any) => {
    if (!company?.id || !user?.id) throw new Error('Missing company or user');

    const updated = await serviceService.update(id, updates);
    setServices((prev) => prev.map((s) => (s.id === id ? updated : s)));

    await activityService.log({
      company_id: company.id,
      user_id: user.id,
      entity_type: 'service',
      entity_id: id,
      action: 'update',
      details: { updates },
    });

    return updated;
  };

  const deleteService = async (id: string) => {
    if (!company?.id || !user?.id) throw new Error('Missing company or user');

    await serviceService.delete(id);
    setServices((prev) => prev.filter((s) => s.id !== id));

    await activityService.log({
      company_id: company.id,
      user_id: user.id,
      entity_type: 'service',
      entity_id: id,
      action: 'delete',
      details: {},
    });
  };

  const getActiveServices = async () => {
    if (!company?.id) return [];
    return await serviceService.getActive(company.id);
  };

  const getStats = async () => {
    if (!company?.id) return null;
    return await serviceService.getStats(company.id);
  };

  return {
    services,
    loading,
    error,
    refresh: fetchServices,
    createService,
    updateService,
    deleteService,
    getActiveServices,
    getStats,
  };
}
