import React, { useState } from 'react';
import {
  Plus,
  Edit,
  Trash2,
  MessageSquare,
  Mail,
  Calendar,
  Save,
  X,
  RefreshCw,
  Eye
} from 'lucide-react';
import { useReminderTemplates } from '../../hooks/useReminders';
import { ReminderTemplate } from '../../services/reminderService';
import { HTMLEditor } from '../common/HTMLEditor';

interface TemplatesProps {
  flowId: string;
  reminderDays: number[];
}

interface TemplateFormData {
  channel: 'whatsapp' | 'email';
  days_after: number;
  subject: string;
  content_text: string;
  content_html: string;
}

export const RemindersTemplates: React.FC<TemplatesProps> = ({ flowId, reminderDays }) => {
  const { templates, isLoading, createTemplate, updateTemplate, deleteTemplate } = useReminderTemplates(flowId);

  const [showModal, setShowModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<ReminderTemplate | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  const [formData, setFormData] = useState<TemplateFormData>({
    channel: 'whatsapp',
    days_after: reminderDays[0] || 7,
    subject: '',
    content_text: '',
    content_html: ''
  });

  const handleOpenModal = (template?: ReminderTemplate) => {
    if (template) {
      setEditingTemplate(template);
      setFormData({
        channel: template.channel,
        days_after: template.days_after,
        subject: template.subject || '',
        content_text: template.content_text || '',
        content_html: template.content_html || ''
      });
    } else {
      setEditingTemplate(null);
      setFormData({
        channel: 'whatsapp',
        days_after: reminderDays[0] || 7,
        subject: '',
        content_text: '',
        content_html: ''
      });
    }
    setShowModal(true);
    setPreviewMode(false);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingTemplate(null);
    setPreviewMode(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const templateData = {
        flow_id: flowId,
        channel: formData.channel,
        days_after: formData.days_after,
        subject: formData.channel === 'email' ? formData.subject : undefined,
        content_text: formData.channel === 'whatsapp' ? formData.content_text : undefined,
        content_html: formData.channel === 'email' ? formData.content_html : undefined
      };

      if (editingTemplate) {
        await updateTemplate(editingTemplate.id, templateData);
      } else {
        await createTemplate(templateData);
      }

      handleCloseModal();
    } catch (error) {
      console.error('Error saving template:', error);
      alert(error instanceof Error ? error.message : 'Erro ao salvar template');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (templateId: string) => {
    if (!confirm('Tem certeza que deseja deletar este template?')) return;

    try {
      await deleteTemplate(templateId);
    } catch (error) {
      console.error('Error deleting template:', error);
      alert('Erro ao deletar template');
    }
  };

  const getChannelIcon = (channel: string) => {
    return channel === 'whatsapp' ? (
      <MessageSquare size={20} className="text-green-600" />
    ) : (
      <Mail size={20} className="text-blue-600" />
    );
  };

  const getChannelColor = (channel: string) => {
    return channel === 'whatsapp'
      ? 'bg-green-50 border-green-200'
      : 'bg-blue-50 border-blue-200';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="animate-spin text-blue-600 mr-2" size={24} />
        <span className="text-gray-600">A carregar templates...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Templates</h3>
          <p className="text-sm text-gray-600">Crie mensagens personalizadas para cada canal e período</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus size={20} />
          Novo Template
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {templates.map((template) => (
          <div
            key={template.id}
            className={`rounded-xl shadow-sm border-2 p-6 ${getChannelColor(template.channel)}`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                {getChannelIcon(template.channel)}
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {template.channel === 'whatsapp' ? 'WhatsApp' : 'Email'}
                  </h4>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Calendar size={14} />
                    <span>{template.days_after} dias após atendimento</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => handleOpenModal(template)}
                  className="text-blue-600 hover:bg-blue-100 p-2 rounded-lg transition-colors"
                  title="Editar"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => handleDelete(template.id)}
                  className="text-red-600 hover:bg-red-100 p-2 rounded-lg transition-colors"
                  title="Deletar"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            {template.channel === 'email' && template.subject && (
              <div className="mb-3">
                <span className="text-xs font-medium text-gray-600">Assunto:</span>
                <p className="text-sm font-medium text-gray-900">{template.subject}</p>
              </div>
            )}

            <div className="bg-white rounded-lg p-3 border border-gray-200">
              {template.channel === 'whatsapp' ? (
                <p className="text-sm text-gray-700 whitespace-pre-wrap">
                  {template.content_text || 'Sem conteúdo'}
                </p>
              ) : (
                <div
                  className="text-sm text-gray-700 prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: template.content_html || 'Sem conteúdo' }}
                />
              )}
            </div>
          </div>
        ))}

        {templates.length === 0 && (
          <div className="col-span-full text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
            <MessageSquare className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-600 mb-4">Nenhum template criado ainda</p>
            <button
              onClick={() => handleOpenModal()}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
            >
              <Plus size={20} />
              Criar Primeiro Template
            </button>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingTemplate ? 'Editar Template' : 'Novo Template'}
              </h3>
              <div className="flex items-center gap-2">
                {formData.channel === 'email' && (
                  <button
                    type="button"
                    onClick={() => setPreviewMode(!previewMode)}
                    className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    <Eye size={16} />
                    {previewMode ? 'Editor' : 'Preview'}
                  </button>
                )}
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Canal *
                  </label>
                  <div className="flex gap-3">
                    <label className="flex-1 cursor-pointer">
                      <input
                        type="radio"
                        name="channel"
                        value="whatsapp"
                        checked={formData.channel === 'whatsapp'}
                        onChange={(e) => setFormData({ ...formData, channel: 'whatsapp' })}
                        className="sr-only"
                      />
                      <div className={`border-2 rounded-lg p-3 flex items-center justify-center gap-2 transition-colors ${
                        formData.channel === 'whatsapp'
                          ? 'border-green-600 bg-green-50'
                          : 'border-gray-300 hover:border-green-300'
                      }`}>
                        <MessageSquare size={20} className="text-green-600" />
                        <span className="font-medium">WhatsApp</span>
                      </div>
                    </label>
                    <label className="flex-1 cursor-pointer">
                      <input
                        type="radio"
                        name="channel"
                        value="email"
                        checked={formData.channel === 'email'}
                        onChange={(e) => setFormData({ ...formData, channel: 'email' })}
                        className="sr-only"
                      />
                      <div className={`border-2 rounded-lg p-3 flex items-center justify-center gap-2 transition-colors ${
                        formData.channel === 'email'
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-300 hover:border-blue-300'
                      }`}>
                        <Mail size={20} className="text-blue-600" />
                        <span className="font-medium">Email</span>
                      </div>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dias após Atendimento *
                  </label>
                  <select
                    value={formData.days_after}
                    onChange={(e) => setFormData({ ...formData, days_after: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    {reminderDays.map((day) => (
                      <option key={day} value={day}>
                        {day} dias
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {formData.channel === 'email' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assunto do Email *
                  </label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="Lembrete: Seu serviço precisa de atenção"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Conteúdo da Mensagem *
                </label>
                {formData.channel === 'whatsapp' ? (
                  <textarea
                    value={formData.content_text}
                    onChange={(e) => setFormData({ ...formData, content_text: e.target.value })}
                    rows={10}
                    placeholder="Olá {nome_cliente}! Passaram-se {dias} dias desde o último atendimento..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                    required
                  />
                ) : (
                  <>
                    {previewMode ? (
                      <div className="border-2 border-gray-300 rounded-lg p-6 bg-white min-h-[400px]">
                        <div
                          className="prose max-w-none"
                          dangerouslySetInnerHTML={{ __html: formData.content_html }}
                        />
                      </div>
                    ) : (
                      <HTMLEditor
                        value={formData.content_html}
                        onChange={(value) => setFormData({ ...formData, content_html: value })}
                      />
                    )}
                  </>
                )}
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800 mb-2">
                  <strong>Variáveis disponíveis:</strong>
                </p>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• <code className="bg-blue-100 px-2 py-0.5 rounded">{'{nome_cliente}'}</code> - Nome do cliente</li>
                  <li>• <code className="bg-blue-100 px-2 py-0.5 rounded">{'{dias}'}</code> - Dias desde o atendimento</li>
                  <li>• <code className="bg-blue-100 px-2 py-0.5 rounded">{'{servico}'}</code> - Nome do serviço</li>
                  <li>• <code className="bg-blue-100 px-2 py-0.5 rounded">{'{empresa}'}</code> - Nome da empresa</li>
                </ul>
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
                      {editingTemplate ? 'Atualizar' : 'Criar'} Template
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
