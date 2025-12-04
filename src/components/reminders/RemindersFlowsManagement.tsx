import React, { useState, useEffect } from 'react';
import {
  Plus,
  Edit,
  Trash2,
  Bell,
  CheckCircle,
  XCircle,
  Calendar,
  Hash,
  MessageSquare,
  Mail,
  Users,
  RefreshCw,
  Save,
  X
} from 'lucide-react';
import { useReminders } from '../../hooks/useReminders';
import { useAuth } from '../../context/AuthContext';
import { useServices } from '../../hooks/useServices';
import { ReminderFlow } from '../../services/reminderService';

interface FlowFormData {
  name: string;
  description: string;
  keywords: string[];
  service_id: string;
  channels: ('whatsapp' | 'email')[];
  reminder_days: number[];
  is_active: boolean;
}

export const RemindersFlowsManagement: React.FC = () => {
  const { user } = useAuth();
  const { flows, isLoading, createFlow, updateFlow, deleteFlow, autoSubscribeClients, loadFlows } = useReminders(user?.company_id || '');
  const { services, refresh } = useServices();

  const [showModal, setShowModal] = useState(false);
  const [editingFlow, setEditingFlow] = useState<ReminderFlow | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [keywordInput, setKeywordInput] = useState('');

  const [formData, setFormData] = useState<FlowFormData>({
    name: '',
    description: '',
    keywords: [],
    service_id: '',
    channels: ['whatsapp', 'email'],
    reminder_days: [7, 15, 30],
    is_active: true
  });

  useEffect(() => {
    refresh();
  }, []);

  const handleOpenModal = (flow?: ReminderFlow) => {
    if (flow) {
      setEditingFlow(flow);
      setFormData({
        name: flow.name,
        description: flow.description || '',
        keywords: flow.keywords,
        service_id: flow.service_id || '',
        channels: flow.channels,
        reminder_days: flow.reminder_days,
        is_active: flow.is_active
      });
    } else {
      setEditingFlow(null);
      setFormData({
        name: '',
        description: '',
        keywords: [],
        service_id: '',
        channels: ['whatsapp', 'email'],
        reminder_days: [7, 15, 30],
        is_active: true
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingFlow(null);
    setKeywordInput('');
  };

  const handleAddKeyword = () => {
    if (keywordInput.trim() && !formData.keywords.includes(keywordInput.trim())) {
      setFormData({
        ...formData,
        keywords: [...formData.keywords, keywordInput.trim()]
      });
      setKeywordInput('');
    }
  };

  const handleRemoveKeyword = (keyword: string) => {
    setFormData({
      ...formData,
      keywords: formData.keywords.filter(k => k !== keyword)
    });
  };

  const handleToggleChannel = (channel: 'whatsapp' | 'email') => {
    if (formData.channels.includes(channel)) {
      setFormData({
        ...formData,
        channels: formData.channels.filter(c => c !== channel)
      });
    } else {
      setFormData({
        ...formData,
        channels: [...formData.channels, channel]
      });
    }
  };

  const handleToggleDay = (day: number) => {
    if (formData.reminder_days.includes(day)) {
      setFormData({
        ...formData,
        reminder_days: formData.reminder_days.filter(d => d !== day)
      });
    } else {
      setFormData({
        ...formData,
        reminder_days: [...formData.reminder_days, day].sort((a, b) => a - b)
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!user?.company_id) throw new Error('Company ID not found');

      if (editingFlow) {
        await updateFlow(editingFlow.id, formData);
      } else {
        await createFlow({
          ...formData,
          company_id: user.company_id
        });
      }

      handleCloseModal();
    } catch (error) {
      console.error('Error saving flow:', error);
      alert(error instanceof Error ? error.message : 'Erro ao salvar fluxo');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (flowId: string) => {
    if (!confirm('Tem certeza que deseja deletar este fluxo?')) return;

    try {
      await deleteFlow(flowId);
    } catch (error) {
      console.error('Error deleting flow:', error);
      alert('Erro ao deletar fluxo');
    }
  };

  const handleAutoSubscribe = async (flowId: string) => {
    if (!confirm('Deseja inscrever automaticamente os clientes baseado nas keywords?')) return;

    try {
      const count = await autoSubscribeClients(flowId);
      alert(`${count} cliente(s) inscrito(s) com sucesso!`);
      loadFlows();
    } catch (error) {
      console.error('Error auto-subscribing:', error);
      alert('Erro ao inscrever clientes');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="animate-spin text-blue-600 mr-2" size={24} />
        <span className="text-gray-600">A carregar fluxos...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Fluxos de Lembretes</h3>
          <p className="text-sm text-gray-600">Gerencie os fluxos automáticos de lembretes</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus size={20} />
          Novo Fluxo
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {flows.map((flow) => (
          <div key={flow.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  flow.is_active ? 'bg-green-100' : 'bg-gray-100'
                }`}>
                  <Bell className={flow.is_active ? 'text-green-600' : 'text-gray-400'} size={20} />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{flow.name}</h4>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    flow.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {flow.is_active ? 'Ativo' : 'Inativo'}
                  </span>
                </div>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => handleOpenModal(flow)}
                  className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-colors"
                  title="Editar"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => handleDelete(flow.id)}
                  className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"
                  title="Deletar"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            {flow.description && (
              <p className="text-sm text-gray-600 mb-4">{flow.description}</p>
            )}

            <div className="space-y-3">
              <div>
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                  <Hash size={14} />
                  <span className="font-medium">Keywords:</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {flow.keywords.length > 0 ? flow.keywords.map((keyword, idx) => (
                    <span key={idx} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                      {keyword}
                    </span>
                  )) : (
                    <span className="text-xs text-gray-400">Nenhuma keyword</span>
                  )}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                  <Calendar size={14} />
                  <span className="font-medium">Dias:</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {flow.reminder_days.map((day) => (
                    <span key={day} className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded">
                      {day}d
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                  <MessageSquare size={14} />
                  <span className="font-medium">Canais:</span>
                </div>
                <div className="flex gap-2">
                  {flow.channels.includes('whatsapp') && (
                    <MessageSquare size={16} className="text-green-600" />
                  )}
                  {flow.channels.includes('email') && (
                    <Mail size={16} className="text-blue-600" />
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={() => handleAutoSubscribe(flow.id)}
              className="w-full mt-4 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 text-sm"
            >
              <Users size={16} />
              Auto-inscrever Clientes
            </button>
          </div>
        ))}

        {flows.length === 0 && (
          <div className="col-span-full text-center py-12">
            <Bell className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-600 mb-4">Nenhum fluxo criado ainda</p>
            <button
              onClick={() => handleOpenModal()}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
            >
              <Plus size={20} />
              Criar Primeiro Fluxo
            </button>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  {editingFlow ? 'Editar Fluxo' : 'Novo Fluxo'}
                </h3>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome do Fluxo *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descrição
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Keywords (para inscrição automática)
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={keywordInput}
                    onChange={(e) => setKeywordInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddKeyword())}
                    placeholder="Digite uma keyword e pressione Enter"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={handleAddKeyword}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus size={20} />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.keywords.map((keyword) => (
                    <span
                      key={keyword}
                      className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                    >
                      {keyword}
                      <button
                        type="button"
                        onClick={() => handleRemoveKeyword(keyword)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Serviço Associado
                </label>
                <select
                  value={formData.service_id}
                  onChange={(e) => setFormData({ ...formData, service_id: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Selecione um serviço (opcional)</option>
                  {services.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Canais de Envio *
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.channels.includes('whatsapp')}
                      onChange={() => handleToggleChannel('whatsapp')}
                      className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <MessageSquare size={20} className="text-green-600" />
                    <span>WhatsApp</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.channels.includes('email')}
                      onChange={() => handleToggleChannel('email')}
                      className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <Mail size={20} className="text-blue-600" />
                    <span>Email</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dias após Atendimento *
                </label>
                <div className="flex gap-4">
                  {[7, 15, 30].map((day) => (
                    <label key={day} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.reminder_days.includes(day)}
                        onChange={() => handleToggleDay(day)}
                        className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span>{day} dias</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
                  Fluxo Ativo
                </label>
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 border-2 border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="animate-spin" size={16} />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Save size={16} />
                      {editingFlow ? 'Atualizar' : 'Criar'} Fluxo
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
