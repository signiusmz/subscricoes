import React, { useState, useEffect } from 'react';
import {
  Bell,
  FileText,
  Users,
  Activity,
  TrendingUp,
  CheckCircle,
  XCircle,
  Clock,
  MessageSquare,
  Mail,
  Calendar
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useReminders, useReminderSubscriptions, useReminderLogs } from '../../hooks/useReminders';
import { useClients } from '../../hooks/useClients';
import { RemindersFlowsManagement } from './RemindersFlowsManagement';
import { RemindersTemplates } from './RemindersTemplates';

type TabType = 'overview' | 'flows' | 'subscriptions' | 'logs';

export const RemindersPanel: React.FC = () => {
  const { user } = useAuth();
  const { flows, stats, loadStats } = useReminders(user?.company_id || '');
  const { subscriptions, loadSubscriptions } = useReminderSubscriptions();
  const { logs, loadLogs } = useReminderLogs({ limit: 50 });
  const { clients } = useClients(user?.company_id || '');

  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [selectedFlowId, setSelectedFlowId] = useState<string>('');

  useEffect(() => {
    if (user?.company_id) {
      loadStats();
      loadSubscriptions();
      loadLogs();
    }
  }, [user?.company_id]);

  const selectedFlow = flows.find(f => f.id === selectedFlowId);

  const getClientName = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    return client?.name || 'Cliente desconhecido';
  };

  const getFlowName = (flowId: string) => {
    const flow = flows.find(f => f.id === flowId);
    return flow?.name || 'Fluxo desconhecido';
  };

  const getStatusBadge = (status: string) => {
    const config = {
      sent: { bg: 'bg-green-100', text: 'text-green-800', label: 'Enviado', icon: CheckCircle },
      failed: { bg: 'bg-red-100', text: 'text-red-800', label: 'Falhou', icon: XCircle },
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pendente', icon: Clock },
      active: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Ativo', icon: CheckCircle },
      paused: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Pausado', icon: Clock },
      completed: { bg: 'bg-green-100', text: 'text-green-800', label: 'Completo', icon: CheckCircle },
      cancelled: { bg: 'bg-red-100', text: 'text-red-800', label: 'Cancelado', icon: XCircle }
    };

    const statusConfig = config[status as keyof typeof config] || config.pending;
    const Icon = statusConfig.icon;

    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusConfig.bg} ${statusConfig.text} flex items-center gap-1 w-fit`}>
        <Icon size={12} />
        {statusConfig.label}
      </span>
    );
  };

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total de Fluxos</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.total_flows || 0}</p>
              <p className="text-xs text-gray-500 mt-1">
                {stats?.active_flows || 0} ativos
              </p>
            </div>
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-blue-100 text-blue-600">
              <Bell size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Inscrições</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.total_subscriptions || 0}</p>
              <p className="text-xs text-gray-500 mt-1">
                {stats?.active_subscriptions || 0} ativas
              </p>
            </div>
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-green-100 text-green-600">
              <Users size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Lembretes Enviados</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.total_sent || 0}</p>
              <p className="text-xs text-red-500 mt-1">
                {stats?.total_failed || 0} falharam
              </p>
            </div>
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-emerald-100 text-emerald-600">
              <TrendingUp size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Taxa de Sucesso</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.success_rate || 0}%</p>
              <p className="text-xs text-gray-500 mt-1">dos envios</p>
            </div>
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-purple-100 text-purple-600">
              <CheckCircle size={24} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Fluxos Ativos</h3>
          <div className="space-y-3">
            {flows.filter(f => f.is_active).slice(0, 5).map((flow) => (
              <div key={flow.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Bell className="text-blue-600" size={20} />
                  <div>
                    <p className="font-medium text-gray-900">{flow.name}</p>
                    <p className="text-sm text-gray-500">
                      {flow.keywords.length} keywords • {flow.channels.length} canais
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSelectedFlowId(flow.id);
                    setActiveTab('flows');
                  }}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Ver
                </button>
              </div>
            ))}
            {flows.filter(f => f.is_active).length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Bell className="mx-auto mb-2 text-gray-400" size={32} />
                <p>Nenhum fluxo ativo</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Atividade Recente</h3>
          <div className="space-y-3">
            {logs.slice(0, 5).map((log) => (
              <div key={log.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  {log.channel === 'whatsapp' ? (
                    <MessageSquare className="text-green-600" size={20} />
                  ) : (
                    <Mail className="text-blue-600" size={20} />
                  )}
                  <div>
                    <p className="font-medium text-gray-900">{getClientName(log.client_id)}</p>
                    <p className="text-sm text-gray-500">{getFlowName(log.flow_id)}</p>
                  </div>
                </div>
                {getStatusBadge(log.status)}
              </div>
            ))}
            {logs.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Activity className="mx-auto mb-2 text-gray-400" size={32} />
                <p>Nenhuma atividade ainda</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderSubscriptions = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Clientes Inscritos</h3>
          <p className="text-sm text-gray-600">Clientes que recebem lembretes automáticos</p>
        </div>
        <select
          value={selectedFlowId}
          onChange={(e) => setSelectedFlowId(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Todos os fluxos</option>
          {flows.map((flow) => (
            <option key={flow.id} value={flow.id}>
              {flow.name}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fluxo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Enviados</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Próximo Lembrete</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {subscriptions
                .filter(sub => !selectedFlowId || sub.flow_id === selectedFlowId)
                .map((subscription) => (
                  <tr key={subscription.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {getClientName(subscription.client_id)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {getFlowName(subscription.flow_id)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {subscription.reminders_sent}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 flex items-center gap-2">
                        <Calendar size={14} />
                        {subscription.next_reminder_date
                          ? new Date(subscription.next_reminder_date).toLocaleDateString('pt-PT')
                          : '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(subscription.status)}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        {subscriptions.filter(sub => !selectedFlowId || sub.flow_id === selectedFlowId).length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Users className="mx-auto mb-2 text-gray-400" size={48} />
            <p>Nenhuma inscrição encontrada</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderLogs = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">Logs de Envio</h3>
        <p className="text-sm text-gray-600">Histórico completo de lembretes enviados</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data/Hora</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fluxo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Canal</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dias</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {new Date(log.created_at).toLocaleString('pt-PT')}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {getClientName(log.client_id)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {getFlowName(log.flow_id)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {log.channel === 'whatsapp' ? (
                        <MessageSquare className="text-green-600" size={16} />
                      ) : (
                        <Mail className="text-blue-600" size={16} />
                      )}
                      <span className="text-sm text-gray-900">
                        {log.channel === 'whatsapp' ? 'WhatsApp' : 'Email'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{log.days_after}d</div>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(log.status)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {logs.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Activity className="mx-auto mb-2 text-gray-400" size={48} />
            <p>Nenhum log encontrado</p>
          </div>
        )}
      </div>
    </div>
  );

  const tabs = [
    { id: 'overview', label: 'Visão Geral', icon: TrendingUp },
    { id: 'flows', label: 'Fluxos', icon: Bell },
    { id: 'subscriptions', label: 'Inscrições', icon: Users },
    { id: 'logs', label: 'Logs', icon: Activity }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Lembretes Automáticos</h1>
          <p className="text-gray-600">Gerencie lembretes automáticos para seus clientes</p>
        </div>
      </div>

      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {activeTab === 'overview' && renderOverview()}
      {activeTab === 'flows' && (
        <div className="space-y-6">
          <RemindersFlowsManagement />
          {selectedFlowId && selectedFlow && (
            <RemindersTemplates
              flowId={selectedFlowId}
              reminderDays={selectedFlow.reminder_days}
            />
          )}
        </div>
      )}
      {activeTab === 'subscriptions' && renderSubscriptions()}
      {activeTab === 'logs' && renderLogs()}
    </div>
  );
};
