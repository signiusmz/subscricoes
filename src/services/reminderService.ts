import { supabase } from '../lib/supabase';

export interface ReminderFlow {
  id: string;
  company_id: string;
  name: string;
  description?: string;
  keywords: string[];
  service_id?: string;
  channels: ('whatsapp' | 'email')[];
  reminder_days: number[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ReminderTemplate {
  id: string;
  flow_id: string;
  channel: 'whatsapp' | 'email';
  days_after: number;
  subject?: string;
  content_text?: string;
  content_html?: string;
  created_at: string;
  updated_at: string;
}

export interface ReminderSubscription {
  id: string;
  flow_id: string;
  client_id: string;
  service_id?: string;
  subscribed_at: string;
  last_reminder_date?: string;
  next_reminder_date?: string;
  reminders_sent: number;
  status: 'active' | 'paused' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export interface ReminderLog {
  id: string;
  subscription_id: string;
  flow_id: string;
  client_id: string;
  template_id?: string;
  channel: 'whatsapp' | 'email';
  days_after: number;
  status: 'sent' | 'failed' | 'pending';
  sent_at?: string;
  error_message?: string;
  created_at: string;
}

export interface ReminderStats {
  total_flows: number;
  active_flows: number;
  total_subscriptions: number;
  active_subscriptions: number;
  total_sent: number;
  total_failed: number;
  success_rate: number;
}

export class ReminderService {
  static async getFlows(companyId: string): Promise<ReminderFlow[]> {
    const { data, error } = await supabase
      .from('reminder_flows')
      .select('*')
      .eq('company_id', companyId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async getFlowById(flowId: string): Promise<ReminderFlow | null> {
    const { data, error } = await supabase
      .from('reminder_flows')
      .select('*')
      .eq('id', flowId)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  static async createFlow(flow: Omit<ReminderFlow, 'id' | 'created_at' | 'updated_at'>): Promise<ReminderFlow> {
    const { data, error } = await supabase
      .from('reminder_flows')
      .insert(flow)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateFlow(flowId: string, updates: Partial<ReminderFlow>): Promise<ReminderFlow> {
    const { data, error } = await supabase
      .from('reminder_flows')
      .update(updates)
      .eq('id', flowId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async deleteFlow(flowId: string): Promise<void> {
    const { error } = await supabase
      .from('reminder_flows')
      .delete()
      .eq('id', flowId);

    if (error) throw error;
  }

  static async getTemplates(flowId: string): Promise<ReminderTemplate[]> {
    const { data, error } = await supabase
      .from('reminder_templates')
      .select('*')
      .eq('flow_id', flowId)
      .order('days_after', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  static async createTemplate(template: Omit<ReminderTemplate, 'id' | 'created_at' | 'updated_at'>): Promise<ReminderTemplate> {
    const { data, error } = await supabase
      .from('reminder_templates')
      .insert(template)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateTemplate(templateId: string, updates: Partial<ReminderTemplate>): Promise<ReminderTemplate> {
    const { data, error } = await supabase
      .from('reminder_templates')
      .update(updates)
      .eq('id', templateId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async deleteTemplate(templateId: string): Promise<void> {
    const { error } = await supabase
      .from('reminder_templates')
      .delete()
      .eq('id', templateId);

    if (error) throw error;
  }

  static async getSubscriptions(flowId?: string, clientId?: string): Promise<ReminderSubscription[]> {
    let query = supabase
      .from('reminder_subscriptions')
      .select('*');

    if (flowId) {
      query = query.eq('flow_id', flowId);
    }

    if (clientId) {
      query = query.eq('client_id', clientId);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async createSubscription(
    subscription: Omit<ReminderSubscription, 'id' | 'created_at' | 'updated_at' | 'reminders_sent'>
  ): Promise<ReminderSubscription> {
    const { data, error } = await supabase
      .from('reminder_subscriptions')
      .insert(subscription)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateSubscription(
    subscriptionId: string,
    updates: Partial<ReminderSubscription>
  ): Promise<ReminderSubscription> {
    const { data, error } = await supabase
      .from('reminder_subscriptions')
      .update(updates)
      .eq('id', subscriptionId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async deleteSubscription(subscriptionId: string): Promise<void> {
    const { error } = await supabase
      .from('reminder_subscriptions')
      .delete()
      .eq('id', subscriptionId);

    if (error) throw error;
  }

  static async subscribeClientToFlow(
    flowId: string,
    clientId: string,
    serviceId?: string
  ): Promise<ReminderSubscription> {
    const flow = await this.getFlowById(flowId);
    if (!flow) throw new Error('Flow not found');

    const firstReminderDay = Math.min(...flow.reminder_days);
    const nextReminderDate = new Date();
    nextReminderDate.setDate(nextReminderDate.getDate() + firstReminderDay);

    return this.createSubscription({
      flow_id: flowId,
      client_id: clientId,
      service_id: serviceId,
      subscribed_at: new Date().toISOString(),
      next_reminder_date: nextReminderDate.toISOString(),
      status: 'active'
    });
  }

  static async getLogs(filters?: {
    flowId?: string;
    clientId?: string;
    status?: 'sent' | 'failed' | 'pending';
    limit?: number;
  }): Promise<ReminderLog[]> {
    let query = supabase
      .from('reminder_logs')
      .select('*');

    if (filters?.flowId) {
      query = query.eq('flow_id', filters.flowId);
    }

    if (filters?.clientId) {
      query = query.eq('client_id', filters.clientId);
    }

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    query = query.order('created_at', { ascending: false });

    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  }

  static async createLog(log: Omit<ReminderLog, 'id' | 'created_at'>): Promise<ReminderLog> {
    const { data, error } = await supabase
      .from('reminder_logs')
      .insert(log)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getStats(companyId: string): Promise<ReminderStats> {
    const [flows, subscriptions, logs] = await Promise.all([
      this.getFlows(companyId),
      supabase
        .from('reminder_subscriptions')
        .select('*, flow:reminder_flows!inner(company_id)')
        .eq('flow.company_id', companyId),
      supabase
        .from('reminder_logs')
        .select('*, flow:reminder_flows!inner(company_id)')
        .eq('flow.company_id', companyId)
    ]);

    const activeFlows = flows.filter(f => f.is_active).length;
    const allSubscriptions = subscriptions.data || [];
    const activeSubscriptions = allSubscriptions.filter(s => s.status === 'active').length;
    const allLogs = logs.data || [];
    const sentLogs = allLogs.filter(l => l.status === 'sent').length;
    const failedLogs = allLogs.filter(l => l.status === 'failed').length;
    const successRate = allLogs.length > 0 ? (sentLogs / allLogs.length) * 100 : 0;

    return {
      total_flows: flows.length,
      active_flows: activeFlows,
      total_subscriptions: allSubscriptions.length,
      active_subscriptions: activeSubscriptions,
      total_sent: sentLogs,
      total_failed: failedLogs,
      success_rate: Math.round(successRate * 10) / 10
    };
  }

  static async autoSubscribeClientsByKeywords(
    flowId: string,
    companyId: string
  ): Promise<number> {
    const flow = await this.getFlowById(flowId);
    if (!flow || !flow.keywords.length) return 0;

    const { data: clients, error } = await supabase
      .from('clients')
      .select('id, name, notes')
      .eq('company_id', companyId);

    if (error) throw error;
    if (!clients) return 0;

    const keywords = flow.keywords.map(k => k.toLowerCase());
    let subscribed = 0;

    for (const client of clients) {
      const searchText = `${client.name} ${client.notes || ''}`.toLowerCase();
      const hasKeyword = keywords.some(keyword => searchText.includes(keyword));

      if (hasKeyword) {
        try {
          const existing = await supabase
            .from('reminder_subscriptions')
            .select('id')
            .eq('flow_id', flowId)
            .eq('client_id', client.id)
            .maybeSingle();

          if (!existing.data) {
            await this.subscribeClientToFlow(flowId, client.id, flow.service_id);
            subscribed++;
          }
        } catch (err) {
          console.error(`Error subscribing client ${client.id}:`, err);
        }
      }
    }

    return subscribed;
  }

  static async processScheduledReminders(): Promise<void> {
    const { data: pendingSubscriptions, error } = await supabase
      .from('reminder_subscriptions')
      .select('*, flow:reminder_flows(*), client:clients(*)')
      .eq('status', 'active')
      .lte('next_reminder_date', new Date().toISOString());

    if (error) throw error;
    if (!pendingSubscriptions?.length) return;

    for (const subscription of pendingSubscriptions) {
      try {
        const templates = await this.getTemplates(subscription.flow_id);
        const flow = subscription.flow as unknown as ReminderFlow;

        for (const channel of flow.channels) {
          const template = templates.find(
            t => t.channel === channel && t.days_after === flow.reminder_days[subscription.reminders_sent]
          );

          if (template) {
            await this.createLog({
              subscription_id: subscription.id,
              flow_id: subscription.flow_id,
              client_id: subscription.client_id,
              template_id: template.id,
              channel: channel,
              days_after: template.days_after,
              status: 'pending'
            });
          }
        }

        const nextIndex = subscription.reminders_sent + 1;
        if (nextIndex < flow.reminder_days.length) {
          const nextReminderDate = new Date();
          nextReminderDate.setDate(nextReminderDate.getDate() + flow.reminder_days[nextIndex]);

          await this.updateSubscription(subscription.id, {
            last_reminder_date: new Date().toISOString(),
            next_reminder_date: nextReminderDate.toISOString(),
            reminders_sent: nextIndex
          });
        } else {
          await this.updateSubscription(subscription.id, {
            last_reminder_date: new Date().toISOString(),
            status: 'completed'
          });
        }
      } catch (err) {
        console.error(`Error processing subscription ${subscription.id}:`, err);
      }
    }
  }
}
