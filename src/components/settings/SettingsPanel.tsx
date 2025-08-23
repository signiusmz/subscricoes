import React, { useState } from 'react';
import { 
  Settings, 
  User, 
  Building, 
  Shield, 
  Bell, 
  Palette, 
  Globe, 
  Save,
  Eye,
  EyeOff,
  Mail,
  Server,
  Lock,
  TestTube,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface EmailSettings {
  smtpHost: string;
  smtpPort: number;
  smtpSecurity: 'none' | 'tls' | 'ssl';
  smtpUsername: string;
  smtpPassword: string;
  fromEmail: string;
  fromName: string;
  replyToEmail: string;
  isEnabled: boolean;
}

export const SettingsPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [emailSettings, setEmailSettings] = useState<EmailSettings>({
    smtpHost: '',
    smtpPort: 587,
    smtpSecurity: 'tls',
    smtpUsername: '',
    smtpPassword: '',
    fromEmail: '',
    fromName: '',
    replyToEmail: '',
    isEnabled: false
  });
  const [testEmailStatus, setTestEmailStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');

  const handleEmailSettingsChange = (field: keyof EmailSettings, value: any) => {
    setEmailSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTestEmail = async () => {
    setTestEmailStatus('testing');
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate success/failure based on settings
      if (emailSettings.smtpHost && emailSettings.smtpUsername && emailSettings.fromEmail) {
        setTestEmailStatus('success');
        setTimeout(() => setTestEmailStatus('idle'), 3000);
      } else {
        throw new Error('Configurações incompletas');
      }
    } catch (error) {
      setTestEmailStatus('error');
      setTimeout(() => setTestEmailStatus('idle'), 3000);
    }
  };

  const handleSaveEmailSettings = () => {
    // Save email settings
    console.log('Saving email settings:', emailSettings);
    alert('Configurações de email salvas com sucesso!');
  };

  const tabs = [
    { id: 'profile', label: 'Perfil', icon: User },
    { id: 'company', label: 'Empresa', icon: Building },
    { id: 'email', label: 'Email', icon: Mail },
    { id: 'security', label: 'Segurança', icon: Shield },
    { id: 'notifications', label: 'Notificações', icon: Bell },
    { id: 'appearance', label: 'Aparência', icon: Palette },
    { id: 'system', label: 'Sistema', icon: Settings }
  ];

  const renderEmailSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Configurações de Email</h3>
        <p className="text-gray-600">Configure o servidor SMTP para envio de emails automáticos</p>
      </div>

      {/* Email Status */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-md font-semibold text-gray-900 flex items-center gap-2">
            <Server size={18} className="text-blue-600" />
            Status do Serviço
          </h4>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={emailSettings.isEnabled}
                onChange={(e) => handleEmailSettingsChange('isEnabled', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="text-sm font-medium text-gray-700">Ativar envio de emails</span>
            </label>
          </div>
        </div>
        
        <div className={`p-4 rounded-lg ${emailSettings.isEnabled ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'}`}>
          <div className="flex items-center gap-2">
            {emailSettings.isEnabled ? (
              <CheckCircle className="text-green-600" size={16} />
            ) : (
              <AlertCircle className="text-gray-500" size={16} />
            )}
            <span className={`text-sm font-medium ${emailSettings.isEnabled ? 'text-green-800' : 'text-gray-600'}`}>
              {emailSettings.isEnabled ? 'Serviço de email ativado' : 'Serviço de email desativado'}
            </span>
          </div>
        </div>
      </div>

      {/* SMTP Configuration */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Server size={18} className="text-green-600" />
          Configurações do Servidor SMTP
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Servidor SMTP *
            </label>
            <input
              type="text"
              value={emailSettings.smtpHost}
              onChange={(e) => handleEmailSettingsChange('smtpHost', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="smtp.gmail.com"
              disabled={!emailSettings.isEnabled}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Porta SMTP *
            </label>
            <input
              type="number"
              value={emailSettings.smtpPort}
              onChange={(e) => handleEmailSettingsChange('smtpPort', parseInt(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="587"
              disabled={!emailSettings.isEnabled}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Segurança *
            </label>
            <select
              value={emailSettings.smtpSecurity}
              onChange={(e) => handleEmailSettingsChange('smtpSecurity', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={!emailSettings.isEnabled}
            >
              <option value="none">Nenhuma</option>
              <option value="tls">TLS</option>
              <option value="ssl">SSL</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome de Usuário *
            </label>
            <input
              type="text"
              value={emailSettings.smtpUsername}
              onChange={(e) => handleEmailSettingsChange('smtpUsername', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="seu@email.com"
              disabled={!emailSettings.isEnabled}
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Palavra-passe *
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={emailSettings.smtpPassword}
                onChange={(e) => handleEmailSettingsChange('smtpPassword', e.target.value)}
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="••••••••••••"
                disabled={!emailSettings.isEnabled}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                disabled={!emailSettings.isEnabled}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Email Identity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Mail size={18} className="text-purple-600" />
          Identidade do Email
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email do Remetente *
            </label>
            <input
              type="email"
              value={emailSettings.fromEmail}
              onChange={(e) => handleEmailSettingsChange('fromEmail', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="noreply@suaempresa.com"
              disabled={!emailSettings.isEnabled}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome do Remetente *
            </label>
            <input
              type="text"
              value={emailSettings.fromName}
              onChange={(e) => handleEmailSettingsChange('fromName', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Sua Empresa"
              disabled={!emailSettings.isEnabled}
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email de Resposta
            </label>
            <input
              type="email"
              value={emailSettings.replyToEmail}
              onChange={(e) => handleEmailSettingsChange('replyToEmail', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="suporte@suaempresa.com"
              disabled={!emailSettings.isEnabled}
            />
            <p className="text-xs text-gray-500 mt-1">
              Email para onde as respostas serão direcionadas (opcional)
            </p>
          </div>
        </div>
      </div>

      {/* Test Email */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <TestTube size={18} className="text-orange-600" />
          Teste de Configuração
        </h4>
        
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-700 mb-1">Testar configurações de email</p>
            <p className="text-xs text-gray-500">Enviar um email de teste para verificar se as configurações estão corretas</p>
          </div>
          
          <button
            onClick={handleTestEmail}
            disabled={!emailSettings.isEnabled || testEmailStatus === 'testing'}
            className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
              testEmailStatus === 'success' 
                ? 'bg-green-100 text-green-700 border border-green-300'
                : testEmailStatus === 'error'
                ? 'bg-red-100 text-red-700 border border-red-300'
                : emailSettings.isEnabled
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            {testEmailStatus === 'testing' && (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            )}
            {testEmailStatus === 'success' && <CheckCircle size={16} />}
            {testEmailStatus === 'error' && <AlertCircle size={16} />}
            {testEmailStatus === 'idle' && <TestTube size={16} />}
            
            {testEmailStatus === 'testing' ? 'Testando...' :
             testEmailStatus === 'success' ? 'Teste OK!' :
             testEmailStatus === 'error' ? 'Erro no Teste' :
             'Testar Email'}
          </button>
        </div>
        
        {testEmailStatus === 'success' && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800">✅ Email de teste enviado com sucesso! Verifique sua caixa de entrada.</p>
          </div>
        )}
        
        {testEmailStatus === 'error' && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">❌ Falha ao enviar email de teste. Verifique as configurações SMTP.</p>
          </div>
        )}
      </div>

      {/* Common SMTP Providers */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Globe size={18} className="text-indigo-600" />
          Configurações Comuns de Provedores
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
            <h5 className="font-semibold text-gray-900 mb-2">Gmail</h5>
            <div className="text-xs text-gray-600 space-y-1">
              <p><strong>Host:</strong> smtp.gmail.com</p>
              <p><strong>Porta:</strong> 587</p>
              <p><strong>Segurança:</strong> TLS</p>
            </div>
          </div>
          
          <div className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
            <h5 className="font-semibold text-gray-900 mb-2">Outlook</h5>
            <div className="text-xs text-gray-600 space-y-1">
              <p><strong>Host:</strong> smtp-mail.outlook.com</p>
              <p><strong>Porta:</strong> 587</p>
              <p><strong>Segurança:</strong> TLS</p>
            </div>
          </div>
          
          <div className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
            <h5 className="font-semibold text-gray-900 mb-2">Yahoo</h5>
            <div className="text-xs text-gray-600 space-y-1">
              <p><strong>Host:</strong> smtp.mail.yahoo.com</p>
              <p><strong>Porta:</strong> 587</p>
              <p><strong>Segurança:</strong> TLS</p>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSaveEmailSettings}
          disabled={!emailSettings.isEnabled}
          className={`px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2 ${
            emailSettings.isEnabled
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          <Save size={20} />
          Salvar Configurações
        </button>
      </div>
    </div>
  );

  const renderProfileSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Configurações do Perfil</h3>
        <p className="text-gray-600">Gerir informações pessoais e preferências da conta</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h4 className="text-md font-semibold text-gray-900 mb-4">Informações Pessoais</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nome Completo</label>
            <input
              type="text"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              defaultValue="João Silva"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              defaultValue="joao@techsolutions.mz"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Telefone</label>
            <input
              type="text"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              defaultValue="+258 84 123 4567"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Cargo</label>
            <input
              type="text"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              defaultValue="Administrador"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h4 className="text-md font-semibold text-gray-900 mb-4">Alterar Palavra-passe</h4>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Palavra-passe Atual</label>
            <input
              type="password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nova Palavra-passe</label>
            <input
              type="password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Confirmar Nova Palavra-passe</label>
            <input
              type="password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderCompanySettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Configurações da Empresa</h3>
        <p className="text-gray-600">Gerir informações e configurações da empresa</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h4 className="text-md font-semibold text-gray-900 mb-4">Informações da Empresa</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nome da Empresa</label>
            <input
              type="text"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              defaultValue="TechSolutions Lda"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">NUIT</label>
            <input
              type="text"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              defaultValue="400123456"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Endereço</label>
            <input
              type="text"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              defaultValue="Av. Julius Nyerere, 123, Maputo"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email da Empresa</label>
            <input
              type="email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              defaultValue="info@techsolutions.mz"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Telefone da Empresa</label>
            <input
              type="text"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              defaultValue="+258 21 123 456"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return renderProfileSettings();
      case 'company':
        return renderCompanySettings();
      case 'email':
        return renderEmailSettings();
      case 'security':
        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Configurações de Segurança</h3>
            <p className="text-gray-600">Em desenvolvimento...</p>
          </div>
        );
      case 'notifications':
        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Configurações de Notificações</h3>
            <p className="text-gray-600">Em desenvolvimento...</p>
          </div>
        );
      case 'appearance':
        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Configurações de Aparência</h3>
            <p className="text-gray-600">Em desenvolvimento...</p>
          </div>
        );
      case 'system':
        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Configurações do Sistema</h3>
            <p className="text-gray-600">Em desenvolvimento...</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Configurações</h2>
        
        {/* Navigation Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
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
      </div>

      {/* Content */}
      {renderContent()}

      {/* Save Button */}
      {activeTab !== 'email' && (
        <div className="flex justify-end">
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2">
            <Save size={20} />
            Salvar Alterações
          </button>
        </div>
      )}
    </div>
  );
};