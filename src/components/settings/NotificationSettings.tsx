import React, { useState, useEffect } from 'react';
import { Mail, MessageSquare, Save, AlertCircle, CheckCircle, Eye, EyeOff, RefreshCw, Edit2, Send } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { EmailService } from '../../services/emailService';
import { WhatsAppService } from '../../services/whatsappService';

export const NotificationSettings: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showSecrets, setShowSecrets] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isTesting, setIsTesting] = useState<'email' | 'whatsapp' | null>(null);

  const [testEmail, setTestEmail] = useState('dkeventoslda@gmail.com');
  const [testPhone, setTestPhone] = useState('258842828600');

  const [settings, setSettings] = useState({
    mailjetApiKey: '',
    mailjetSecretKey: '',
    mailjetApiUrl: 'https://api.mailjet.com/v3.1',
    whatsappApiKey: '',
    whatsappApiUrl: 'https://api.360messenger.com/v2',
    fromEmail: 'noreply@dzumuka.com',
    fromName: 'DZUMUKA',
    isActive: true
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setIsLoading(true);

      const { data, error } = await supabase
        .from('notification_settings')
        .select('*')
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setSettings({
          mailjetApiKey: data.smtp_user || '',
          mailjetSecretKey: data.smtp_password || '',
          mailjetApiUrl: data.smtp_host || 'https://api.mailjet.com/v3.1',
          whatsappApiKey: data.whatsapp_api_key || '',
          whatsappApiUrl: data.whatsapp_api_url || 'https://api.360messenger.com/v2',
          fromEmail: data.smtp_from_email || 'noreply@dzumuka.com',
          fromName: data.smtp_from_name || 'DZUMUKA',
          isActive: data.is_active ?? true
        });
      } else {
        const envSettings = {
          mailjetApiKey: import.meta.env.VITE_MAILJET_API_KEY || '',
          mailjetSecretKey: import.meta.env.VITE_MAILJET_SECRET_KEY || '',
          mailjetApiUrl: import.meta.env.VITE_MAILJET_API_URL || 'https://api.mailjet.com/v3.1',
          whatsappApiKey: import.meta.env.VITE_360MESSENGER_API_KEY || '',
          whatsappApiUrl: import.meta.env.VITE_360MESSENGER_API_URL || 'https://api.360messenger.com/v2',
          fromEmail: 'noreply@dzumuka.com',
          fromName: 'DZUMUKA',
          isActive: true
        };
        setSettings(envSettings);

        if (envSettings.mailjetApiKey && envSettings.whatsappApiKey) {
          setIsEditing(false);
        } else {
          setIsEditing(true);
        }
      }
    } catch (error) {
      console.error('Error loading notification settings:', error);
      setErrorMessage('Erro ao carregar configurações');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      if (!settings.mailjetApiKey || !settings.mailjetSecretKey || !settings.whatsappApiKey) {
        throw new Error('Todos os campos obrigatórios devem ser preenchidos');
      }

      const { data: existing, error: fetchError } = await supabase
        .from('notification_settings')
        .select('id')
        .maybeSingle();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      const payload = {
        smtp_user: settings.mailjetApiKey,
        smtp_password: settings.mailjetSecretKey,
        smtp_host: settings.mailjetApiUrl,
        smtp_from_email: settings.fromEmail,
        smtp_from_name: settings.fromName,
        whatsapp_api_key: settings.whatsappApiKey,
        whatsapp_api_url: settings.whatsappApiUrl,
        is_active: settings.isActive,
        updated_at: new Date().toISOString()
      };

      if (existing) {
        const { error: updateError } = await supabase
          .from('notification_settings')
          .update(payload)
          .eq('id', existing.id);

        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from('notification_settings')
          .insert(payload);

        if (insertError) throw insertError;
      }

      setSuccessMessage('Configurações salvas com sucesso!');
      setIsEditing(false);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error saving notification settings:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Erro ao salvar configurações');
    } finally {
      setIsSaving(false);
    }
  };

  const testEmailConnection = async () => {
    setIsTesting('email');
    setErrorMessage('');
    setSuccessMessage('');

    try {
      if (!settings.mailjetApiKey || !settings.mailjetSecretKey) {
        throw new Error('Configure as credenciais do Mailjet antes de testar');
      }

      const emailService = new EmailService({
        apiKey: settings.mailjetApiKey,
        secretKey: settings.mailjetSecretKey,
        apiUrl: settings.mailjetApiUrl
      });

      const isValid = await emailService.testConnection(testEmail);

      if (isValid) {
        setSuccessMessage(`Email de teste enviado com sucesso para ${testEmail}!`);
        setTimeout(() => setSuccessMessage(''), 5000);
      } else {
        throw new Error('Falha no envio. Verifique as credenciais.');
      }
    } catch (error) {
      console.error('Email test failed:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Erro ao testar email');
    } finally {
      setIsTesting(null);
    }
  };

  const testWhatsAppConnection = async () => {
    setIsTesting('whatsapp');
    setErrorMessage('');
    setSuccessMessage('');

    try {
      if (!settings.whatsappApiKey) {
        throw new Error('Configure as credenciais do 360Messenger antes de testar');
      }

      const whatsappService = new WhatsAppService({
        apiKey: settings.whatsappApiKey,
        apiUrl: settings.whatsappApiUrl
      });

      const isValid = await whatsappService.testConnection(testPhone);

      if (isValid) {
        setSuccessMessage(`Mensagem de teste enviada com sucesso para ${testPhone}!`);
        setTimeout(() => setSuccessMessage(''), 5000);
      } else {
        throw new Error('Falha no envio. Verifique as credenciais.');
      }
    } catch (error) {
      console.error('WhatsApp test failed:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Erro ao testar WhatsApp');
    } finally {
      setIsTesting(null);
    }
  };

  const maskValue = (value: string) => {
    if (!value) return '';
    return '•'.repeat(value.length);
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="animate-spin text-blue-600 mr-2" size={24} />
          <span className="text-gray-600">A carregar configurações...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Mail className="text-green-600" size={24} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Configurações de Notificações</h3>
              <p className="text-gray-600">Configure SMTP e WhatsApp para notificações globais do sistema</p>
            </div>
          </div>
          {!isEditing && settings.mailjetApiKey && (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Edit2 size={16} />
              Editar
            </button>
          )}
        </div>

        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-2">
            <CheckCircle className="text-blue-600 mt-0.5" size={16} />
            <div className="text-sm text-blue-800">
              <strong>Notificações Centralizadas:</strong> Todos os clientes do sistema usam estas configurações para enviar notificações aos seus clientes.
              Configure o motor de email (Mailjet) e WhatsApp (360Messenger) para o sistema completo.
            </div>
          </div>
        </div>

        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
            <CheckCircle className="text-green-500" size={20} />
            <span className="text-sm text-green-700">{successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
            <AlertCircle className="text-red-500" size={20} />
            <span className="text-sm text-red-700">{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Mail size={20} className="text-green-600" />
              Configurações Mailjet (SMTP)
            </h4>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  API Key *
                </label>
                <input
                  type="text"
                  value={isEditing ? settings.mailjetApiKey : maskValue(settings.mailjetApiKey)}
                  onChange={(e) => setSettings({ ...settings, mailjetApiKey: e.target.value })}
                  placeholder="Digite a API Key do Mailjet"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                  disabled={!isEditing}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Secret Key *
                </label>
                <div className="relative">
                  <input
                    type={showSecrets && isEditing ? 'text' : 'password'}
                    value={isEditing ? settings.mailjetSecretKey : maskValue(settings.mailjetSecretKey)}
                    onChange={(e) => setSettings({ ...settings, mailjetSecretKey: e.target.value })}
                    placeholder="Digite a Secret Key do Mailjet"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent pr-12"
                    required
                    disabled={!isEditing}
                  />
                  {isEditing && (
                    <button
                      type="button"
                      onClick={() => setShowSecrets(!showSecrets)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showSecrets ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    From Email
                  </label>
                  <input
                    type="email"
                    value={settings.fromEmail}
                    onChange={(e) => setSettings({ ...settings, fromEmail: e.target.value })}
                    placeholder="noreply@dzumuka.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    disabled={!isEditing}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    From Name
                  </label>
                  <input
                    type="text"
                    value={settings.fromName}
                    onChange={(e) => setSettings({ ...settings, fromName: e.target.value })}
                    placeholder="DZUMUKA"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <MessageSquare size={20} className="text-green-600" />
              Configurações 360Messenger (WhatsApp)
            </h4>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  API Key *
                </label>
                <input
                  type="text"
                  value={isEditing ? settings.whatsappApiKey : maskValue(settings.whatsappApiKey)}
                  onChange={(e) => setSettings({ ...settings, whatsappApiKey: e.target.value })}
                  placeholder="Digite a API Key do 360Messenger"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                  disabled={!isEditing}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  API URL
                </label>
                <input
                  type="url"
                  value={settings.whatsappApiUrl}
                  onChange={(e) => setSettings({ ...settings, whatsappApiUrl: e.target.value })}
                  placeholder="https://api.360messenger.com/v2"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  disabled={!isEditing}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
            <input
              type="checkbox"
              id="isActive"
              checked={settings.isActive}
              onChange={(e) => setSettings({ ...settings, isActive: e.target.checked })}
              className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
              disabled={!isEditing}
            />
            <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
              Ativar notificações automáticas
            </label>
          </div>

          {isEditing && (
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={isSaving}
                className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSaving ? (
                  <>
                    <RefreshCw className="animate-spin" size={16} />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    Salvar Configurações
                  </>
                )}
              </button>
            </div>
          )}
        </form>
      </div>

      {settings.mailjetApiKey && settings.whatsappApiKey && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Mail size={20} className="text-green-600" />
              Testar Email (Mailjet)
            </h4>
            <div className="space-y-3">
              <input
                type="email"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                placeholder="Email de teste"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <button
                onClick={testEmailConnection}
                disabled={isTesting === 'email'}
                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isTesting === 'email' ? (
                  <>
                    <RefreshCw className="animate-spin" size={16} />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    Enviar Email de Teste
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <MessageSquare size={20} className="text-green-600" />
              Testar WhatsApp (360Messenger)
            </h4>
            <div className="space-y-3">
              <input
                type="tel"
                value={testPhone}
                onChange={(e) => setTestPhone(e.target.value)}
                placeholder="Número de teste (258XXXXXXXXX)"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <button
                onClick={testWhatsAppConnection}
                disabled={isTesting === 'whatsapp'}
                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isTesting === 'whatsapp' ? (
                  <>
                    <RefreshCw className="animate-spin" size={16} />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    Enviar Mensagem de Teste
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {settings.mailjetApiKey && settings.whatsappApiKey && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h4 className="font-semibold text-gray-900 mb-3">Configuração Atual (JSON)</h4>
          <div className="bg-gray-50 rounded border border-gray-300 p-4">
            <pre className="text-xs text-gray-800 overflow-x-auto">
{JSON.stringify({
  mailjet: {
    api_key: isEditing ? settings.mailjetApiKey : maskValue(settings.mailjetApiKey),
    secret_key: isEditing ? settings.mailjetSecretKey : maskValue(settings.mailjetSecretKey),
    api_url: settings.mailjetApiUrl,
    from_email: settings.fromEmail,
    from_name: settings.fromName
  },
  whatsapp_360messenger: {
    api_key: isEditing ? settings.whatsappApiKey : maskValue(settings.whatsappApiKey),
    api_url: settings.whatsappApiUrl
  },
  is_active: settings.isActive
}, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
