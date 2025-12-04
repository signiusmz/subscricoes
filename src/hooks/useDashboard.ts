import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { clientService } from '../services/clientService';
import { serviceService } from '../services/serviceService';
import { subscriptionService } from '../services/subscriptionService';
import { invoiceService } from '../services/invoiceService';
import { activityService } from '../services/activityService';

export function useDashboard() {
  const { company } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = useCallback(async () => {
    if (!company?.id) return;

    try {
      setLoading(true);
      setError(null);

      const [clientStats, serviceStats, subscriptionStats, invoiceStats, activities] = await Promise.all([
        clientService.getStats(company.id),
        serviceService.getStats(company.id),
        subscriptionService.getStats(company.id),
        invoiceService.getStats(company.id),
        activityService.getRecent(company.id, 10),
      ]);

      setStats({
        clients: clientStats,
        services: serviceStats,
        subscriptions: subscriptionStats,
        invoices: invoiceStats,
      });

      setRecentActivity(activities || []);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  }, [company?.id]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return {
    stats,
    recentActivity,
    loading,
    error,
    refresh: fetchDashboardData,
  };
}
