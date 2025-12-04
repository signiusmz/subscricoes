import { supabase } from '../lib/supabase';
import { Database } from '../types/database';

type AutomationFlow = Database['public']['Tables']['automation_flows']['Row'];
type AutomationFlowInsert = Database['public']['Tables']['automation_flows']['Insert'];
type AutomationFlowUpdate = Database['public']['Tables']['automation_flows']['Update'];

export const automationService = {
  async getAllFlows(companyId: string) {
    const { data, error } = await supabase
      .from('automation_flows')
      .select('*')
      .eq('company_id', companyId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getFlowById(id: string) {
    const { data, error } = await supabase
      .from('automation_flows')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async createFlow(flow: Omit<AutomationFlowInsert, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('automation_flows')
      .insert(flow)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateFlow(id: string, updates: AutomationFlowUpdate) {
    const { data, error } = await supabase
      .from('automation_flows')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteFlow(id: string) {
    const { error } = await supabase.from('automation_flows').delete().eq('id', id);

    if (error) throw error;
  },

  async toggleFlowStatus(id: string, isActive: boolean) {
    const { data, error } = await supabase
      .from('automation_flows')
      .update({ is_active: isActive })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getExecutions(flowId: string, limit: number = 50) {
    const { data, error } = await supabase
      .from('automation_flow_executions')
      .select('*')
      .eq('flow_id', flowId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  },

  async createExecution(
    flowId: string,
    companyId: string,
    triggerData: any
  ) {
    const { data, error } = await supabase
      .from('automation_flow_executions')
      .insert({
        flow_id: flowId,
        company_id: companyId,
        trigger_data: triggerData,
        status: 'pending',
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateExecutionStatus(
    id: string,
    status: string,
    executionLog?: any,
    errorMessage?: string
  ) {
    const updates: any = {
      status,
      completed_at: status === 'completed' || status === 'failed' ? new Date().toISOString() : null,
    };

    if (executionLog) {
      updates.execution_log = executionLog;
    }

    if (errorMessage) {
      updates.error_message = errorMessage;
    }

    const { data, error } = await supabase
      .from('automation_flow_executions')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};
