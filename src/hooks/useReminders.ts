import { useState, useEffect } from 'react';
import { ReminderService, ReminderFlow, ReminderTemplate, ReminderSubscription, ReminderLog, ReminderStats } from '../services/reminderService';

export const useReminders = (companyId: string) => {
  const [flows, setFlows] = useState<ReminderFlow[]>([]);
  const [stats, setStats] = useState<ReminderStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (companyId) {
      loadFlows();
      loadStats();
    }
  }, [companyId]);

  const loadFlows = async () => {
    try {
      setIsLoading(true);
      const data = await ReminderService.getFlows(companyId);
      setFlows(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading flows');
      console.error('Error loading flows:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const data = await ReminderService.getStats(companyId);
      setStats(data);
    } catch (err) {
      console.error('Error loading stats:', err);
    }
  };

  const createFlow = async (flow: Omit<ReminderFlow, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const newFlow = await ReminderService.createFlow(flow);
      setFlows([newFlow, ...flows]);
      await loadStats();
      return newFlow;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error creating flow');
      throw err;
    }
  };

  const updateFlow = async (flowId: string, updates: Partial<ReminderFlow>) => {
    try {
      const updatedFlow = await ReminderService.updateFlow(flowId, updates);
      setFlows(flows.map(f => f.id === flowId ? updatedFlow : f));
      await loadStats();
      return updatedFlow;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error updating flow');
      throw err;
    }
  };

  const deleteFlow = async (flowId: string) => {
    try {
      await ReminderService.deleteFlow(flowId);
      setFlows(flows.filter(f => f.id !== flowId));
      await loadStats();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error deleting flow');
      throw err;
    }
  };

  const autoSubscribeClients = async (flowId: string) => {
    try {
      const count = await ReminderService.autoSubscribeClientsByKeywords(flowId, companyId);
      await loadStats();
      return count;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error auto-subscribing clients');
      throw err;
    }
  };

  return {
    flows,
    stats,
    isLoading,
    error,
    loadFlows,
    loadStats,
    createFlow,
    updateFlow,
    deleteFlow,
    autoSubscribeClients
  };
};

export const useReminderTemplates = (flowId: string) => {
  const [templates, setTemplates] = useState<ReminderTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (flowId) {
      loadTemplates();
    }
  }, [flowId]);

  const loadTemplates = async () => {
    try {
      setIsLoading(true);
      const data = await ReminderService.getTemplates(flowId);
      setTemplates(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading templates');
      console.error('Error loading templates:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const createTemplate = async (template: Omit<ReminderTemplate, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const newTemplate = await ReminderService.createTemplate(template);
      setTemplates([...templates, newTemplate]);
      return newTemplate;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error creating template');
      throw err;
    }
  };

  const updateTemplate = async (templateId: string, updates: Partial<ReminderTemplate>) => {
    try {
      const updatedTemplate = await ReminderService.updateTemplate(templateId, updates);
      setTemplates(templates.map(t => t.id === templateId ? updatedTemplate : t));
      return updatedTemplate;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error updating template');
      throw err;
    }
  };

  const deleteTemplate = async (templateId: string) => {
    try {
      await ReminderService.deleteTemplate(templateId);
      setTemplates(templates.filter(t => t.id !== templateId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error deleting template');
      throw err;
    }
  };

  return {
    templates,
    isLoading,
    error,
    loadTemplates,
    createTemplate,
    updateTemplate,
    deleteTemplate
  };
};

export const useReminderSubscriptions = (flowId?: string, clientId?: string) => {
  const [subscriptions, setSubscriptions] = useState<ReminderSubscription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSubscriptions();
  }, [flowId, clientId]);

  const loadSubscriptions = async () => {
    try {
      setIsLoading(true);
      const data = await ReminderService.getSubscriptions(flowId, clientId);
      setSubscriptions(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading subscriptions');
      console.error('Error loading subscriptions:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const createSubscription = async (
    subscription: Omit<ReminderSubscription, 'id' | 'created_at' | 'updated_at' | 'reminders_sent'>
  ) => {
    try {
      const newSubscription = await ReminderService.createSubscription(subscription);
      setSubscriptions([newSubscription, ...subscriptions]);
      return newSubscription;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error creating subscription');
      throw err;
    }
  };

  const updateSubscription = async (subscriptionId: string, updates: Partial<ReminderSubscription>) => {
    try {
      const updatedSubscription = await ReminderService.updateSubscription(subscriptionId, updates);
      setSubscriptions(subscriptions.map(s => s.id === subscriptionId ? updatedSubscription : s));
      return updatedSubscription;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error updating subscription');
      throw err;
    }
  };

  const deleteSubscription = async (subscriptionId: string) => {
    try {
      await ReminderService.deleteSubscription(subscriptionId);
      setSubscriptions(subscriptions.filter(s => s.id !== subscriptionId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error deleting subscription');
      throw err;
    }
  };

  return {
    subscriptions,
    isLoading,
    error,
    loadSubscriptions,
    createSubscription,
    updateSubscription,
    deleteSubscription
  };
};

export const useReminderLogs = (filters?: {
  flowId?: string;
  clientId?: string;
  status?: 'sent' | 'failed' | 'pending';
  limit?: number;
}) => {
  const [logs, setLogs] = useState<ReminderLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadLogs();
  }, [filters?.flowId, filters?.clientId, filters?.status]);

  const loadLogs = async () => {
    try {
      setIsLoading(true);
      const data = await ReminderService.getLogs(filters);
      setLogs(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading logs');
      console.error('Error loading logs:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    logs,
    isLoading,
    error,
    loadLogs
  };
};
