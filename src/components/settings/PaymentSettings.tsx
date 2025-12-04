import React, { useState, useEffect } from 'react';
import { CreditCard, Save, AlertCircle, CheckCircle, Eye, EyeOff, RefreshCw, Edit2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { MPGSService } from '../../utils/mpgsService';

export const PaymentSettings: React.FC = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isTesting, setIsTesting] = useState(false);

  const [settings, setSettings] = useState({
    merchantId: '',
    apiUsername: '',
    apiPassword: '',
    gatewayUrl: 'https://gateway.mastercard.com',
    environment: 'production' as 'test' | 'production',
    isActive: true
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setIsLoading(true);

      const { data, error } = await supabase
        .from('payment_settings')
        .select('*')
        .eq('provider', 'mpgs')
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setSettings({
          merchantId: data.merchant_id || '',
          apiUsername: data.api_username || '',
          apiPassword: data.api_password || '',
          gatewayUrl: data.gateway_url || 'https://gateway.mastercard.com',
          environment: data.environment || 'production',
          isActive: data.is_active ?? true
        });
      } else {
        const envSettings = {
          merchantId: import.meta.env.VITE_MPGS_MERCHANT_ID || '',
          apiUsername: import.meta.env.VITE_MPGS_API_USERNAME || '',
          apiPassword: import.meta.env.VITE_MPGS_API_PASSWORD || '',
          gatewayUrl: import.meta.env.VITE_MPGS_GATEWAY_URL || 'https://gateway.mastercard.com',
          environment: (import.meta.env.VITE_MPGS_ENVIRONMENT || 'production') as 'test' | 'production',
          isActive: true
        };
        setSettings(envSettings);

        if (envSettings.merchantId && envSettings.apiUsername && envSettings.apiPassword) {
          setIsEditing(false);
        } else {
          setIsEditing(true);
        }
      }
    } catch (error) {
      console.error('Error loading payment settings:', error);
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
      if (!MPGSService.validateConfig(settings)) {
        throw new Error('Todos os campos são obrigatórios');
      }

      const { data: existing, error: fetchError } = await supabase
        .from('payment_settings')
        .select('id')
        .eq('provider', 'mpgs')
        .maybeSingle();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      const payload = {
        provider: 'mpgs',
        merchant_id: settings.merchantId,
        api_username: settings.apiUsername,
        api_password: settings.apiPassword,
        gateway_url: settings.gatewayUrl,
        environment: settings.environment,
        is_active: settings.isActive,
        updated_at: new Date().toISOString()
      };

      if (existing) {
        const { error: updateError } = await supabase
          .from('payment_settings')
          .update(payload)
          .eq('id', existing.id);

        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from('payment_settings')
          .insert(payload);

        if (insertError) throw insertError;
      }

      setSuccessMessage('Configurações salvas com sucesso!');
      setIsEditing(false);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error saving payment settings:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Erro ao salvar configurações');
    } finally {
      setIsSaving(false);
    }
  };

  const testConnection = async () => {
    setIsTesting(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      if (!MPGSService.validateConfig(settings)) {
        throw new Error('Configure as credenciais antes de testar');
      }

      const mpgsService = new MPGSService(settings);
      const isValid = await mpgsService.testConnection();

      if (isValid) {
        setSuccessMessage('Conexão estabelecida com sucesso!');
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        throw new Error('Falha na conexão. Verifique as credenciais.');
      }
    } catch (error) {
      console.error('Connection test failed:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Erro ao testar conexão');
    } finally {
      setIsTesting(false);
    }
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

  const maskValue = (value: string) => {
    if (!value) return '';
    return '•'.repeat(value.length);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <CreditCard className="text-blue-600" size={24} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Configurações de Pagamento Global</h3>
            <p className="text-gray-600">Configure as credenciais MPGS para processar pagamentos de subscrições</p>
          </div>
        </div>
        {!isEditing && settings.merchantId && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Edit2 size={16} />
            Editar
          </button>
        )}
      </div>

      <div className="mb-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
        <div className="flex items-start gap-2">
          <CheckCircle className="text-purple-600 mt-0.5" size={16} />
          <div className="text-sm text-purple-800">
            <strong>Pagamentos Recorrentes Automáticos:</strong> Todos os planos são subscrições mensais cobradas automaticamente através do MPGS.
            Os utilizadores do sistema usam este método apenas para pagar suas mensalidades ao sistema.
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
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-2">
            <AlertCircle className="text-yellow-600 mt-0.5" size={16} />
            <div className="text-sm text-yellow-800">
              <strong>Importante:</strong> Estas credenciais são sensíveis. Mantenha-as seguras e não as compartilhe.
              Configure as credenciais de produção fornecidas pela MasterCard Payment Gateway Services.
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ambiente
          </label>
          <select
            value={settings.environment}
            onChange={(e) => setSettings({ ...settings, environment: e.target.value as 'test' | 'production' })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={!isEditing}
          >
            <option value="test">Teste (Test Gateway)</option>
            <option value="production">Produção (Production Gateway)</option>
          </select>
          <p className="text-xs text-gray-500 mt-1">
            Selecione "Teste" para desenvolvimento e "Produção" para ambiente real
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Merchant ID *
          </label>
          <input
            type="text"
            value={isEditing ? settings.merchantId : maskValue(settings.merchantId)}
            onChange={(e) => setSettings({ ...settings, merchantId: e.target.value })}
            placeholder="Digite o Merchant ID"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
            disabled={!isEditing}
          />
          <p className="text-xs text-gray-500 mt-1">
            ID do comerciante fornecido pela MPGS
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            API Username *
          </label>
          <input
            type="text"
            value={isEditing ? settings.apiUsername : maskValue(settings.apiUsername)}
            onChange={(e) => setSettings({ ...settings, apiUsername: e.target.value })}
            placeholder="merchant.[seu_merchant_id]"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
            disabled={!isEditing}
          />
          <p className="text-xs text-gray-500 mt-1">
            Formato: merchant.[MerchantID]
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            API Password *
          </label>
          <div className="relative">
            <input
              type={showPassword && isEditing ? 'text' : 'password'}
              value={isEditing ? settings.apiPassword : maskValue(settings.apiPassword)}
              onChange={(e) => setSettings({ ...settings, apiPassword: e.target.value })}
              placeholder="Digite o API Password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
              required
              disabled={!isEditing}
            />
            {isEditing && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Password de autenticação da API gerado no Merchant Administration
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Gateway URL
          </label>
          <input
            type="url"
            value={settings.gatewayUrl}
            onChange={(e) => setSettings({ ...settings, gatewayUrl: e.target.value })}
            placeholder="https://gateway.mastercard.com"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={!isEditing}
          />
          <p className="text-xs text-gray-500 mt-1">
            URL do gateway (padrão: https://gateway.mastercard.com para produção)
          </p>
        </div>

        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
          <input
            type="checkbox"
            id="isActive"
            checked={settings.isActive}
            onChange={(e) => setSettings({ ...settings, isActive: e.target.checked })}
            className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            disabled={!isEditing}
          />
          <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
            Ativar método de pagamento MPGS
          </label>
        </div>

        {isEditing && (
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={testConnection}
              disabled={isTesting || !settings.merchantId || !settings.apiUsername || !settings.apiPassword}
              className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isTesting ? (
                <>
                  <RefreshCw className="animate-spin" size={16} />
                  Testando...
                </>
              ) : (
                <>
                  <CheckCircle size={16} />
                  Testar Conexão
                </>
              )}
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">Como obter as credenciais</h4>
          <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
            <li>Acesse o Merchant Administration Portal da MPGS</li>
            <li>Vá em Admin → Integration Settings</li>
            <li>Ative a autenticação e gere um novo API Password</li>
            <li>Copie o Merchant ID, Username e Password</li>
            <li>Cole as credenciais nos campos acima e salve</li>
          </ol>
        </div>

        {settings.merchantId && settings.apiUsername && settings.apiPassword && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-medium text-green-900 mb-2">Configuração Atual (JSON)</h4>
            <div className="bg-white rounded border border-green-300 p-3 mt-2">
              <pre className="text-xs text-gray-800 overflow-x-auto">
{JSON.stringify({
  merchant_id: isEditing ? settings.merchantId : maskValue(settings.merchantId),
  api_password: isEditing ? settings.apiPassword : maskValue(settings.apiPassword),
  api_username: isEditing ? settings.apiUsername : maskValue(settings.apiUsername)
}, null, 2)}
              </pre>
            </div>
            <p className="text-xs text-green-700 mt-2">
              ✓ Credenciais configuradas e prontas para uso
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
