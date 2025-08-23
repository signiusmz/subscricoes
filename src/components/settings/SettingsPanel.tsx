import React, { useState } from 'react';
import { 
  Settings, 
  User, 
  Building, 
  Bell, 
  Shield, 
  Palette, 
  Globe, 
  Database,
  Save,
  Eye,
  EyeOff,
  Upload,
  Camera,
  Mail,
  MessageSquare,
  Smartphone,
  Key,
  RefreshCw,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface NotificationSettings {
  emailEnabled: boolean;
  whatsappEnabled: boolean;
  smsEnabled: boolean;
  reminderDays: number[];
  npsAfterDays: number;
  birthdayReminders: boolean;
}

interface SMTPSettings {
  host: string;
  port: number;
  username: string;
  password: string;
  fromName: string;
  fromEmail: string;
  secure: boolean;
}

interface WhatsAppSettings {
  apiKey: string;
  phoneNumber: string;
  isConnected: boolean;
}

interface CompanySettings {
  name: string;
  email: string;
  phone: string;
  address: string;
  nuit: string;
  logo?: string;
  website?: string;
  timezone: string;
  currency: string;
}

export const SettingsPanel: React.FC = () => {
  const { user, company, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('company');

  const [companySettings, setCompanySettings] = useState<CompanySettings>({
    name: company?.name || '',
    email: company?.email || '',
    phone: '+258 21 123 456',
    address: company?.address || '',
    nuit: company?.nuit || '',
    website: 'https://techsolutions.mz',
    timezone: 'Africa/Maputo',
    currency: 'MZN'
  });

  const handleSaveCompany = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    
    const updatedSettings = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      address: formData.get('address') as string,
      nuit: formData.get('nuit') as string,
      website: formData.get('website') as string,
      timezone: formData.get('timezone') as string,
      currency: formData.get('currency') as string
    };
    
    setCompanySettings(updatedSettings);
    alert('Configurações da empresa atualizadas com sucesso!');
  };

  const renderCompany = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Informações da Empresa</h3>
        
        <form onSubmit={handleSaveCompany} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome da Empresa
              </label>
              <input
                type="text"
                name="name"
                value={companySettings.name}
                onChange={(e) => setCompanySettings({...companySettings, name: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email da Empresa
              </label>
              <input
                type="email"
                name="email"
                value={companySettings.email}
                onChange={(e) => setCompanySettings({...companySettings, email: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Telefone
              </label>
              <input
                type="text"
                name="phone"
                value={companySettings.phone}
                onChange={(e) => setCompanySettings({...companySettings, phone: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                NUIT
              </label>
              <input
                type="text"
                name="nuit"
                value={companySettings.nuit}
                onChange={(e) => setCompanySettings({...companySettings, nuit: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Endereço
              </label>
              <input
                type="text"
                name="address"
                value={companySettings.address}
                onChange={(e) => setCompanySettings({...companySettings, address: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Website
              </label>
              <input
                type="url"
                name="website"
                value={companySettings.website}
                onChange={(e) => setCompanySettings({...companySettings, website: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://suaempresa.mz"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fuso Horário
              </label>
              <select
                name="timezone"
                value={companySettings.timezone}
                onChange={(e) => setCompanySettings({...companySettings, timezone: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Africa/Maputo">África/Maputo (CAT)</option>
                <option value="UTC">UTC</option>
                <option value="Europe/Lisbon">Europa/Lisboa</option>
              </select>
            </div>
          </div>
          
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Save size={16} />
            Salvar Alterações
          </button>
        </form>
      </div>
    </div>
  );

  const tabs = [
    { id: 'company', label: 'Empresa', icon: Building }
  ];

  const renderIntegrations = () => (
    <div className="space-y-6">
      {/* SMTP Configuration */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Mail className="text-blue-600" size={20} />
          Configuração SMTP (Email)
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Servidor SMTP
            </label>
            <input
              type="text"
              value={smtpSettings.host}
              onChange={(e) => setSMTPSettings({...smtpSettings, host: e.target.value})}
              placeholder="smtp.gmail.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Porta
            </label>
            <select
              value={smtpSettings.port}
              onChange={(e) => setSMTPSettings({...smtpSettings, port: Number(e.target.value)})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value={587}>587 (TLS)</option>
              <option value={465}>465 (SSL)</option>
              <option value={25}>25 (Não seguro)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome de Usuário
            </label>
            <input
              type="text"
              value={smtpSettings.username}
              onChange={(e) => setSMTPSettings({...smtpSettings, username: e.target.value})}
              placeholder="seu@email.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Palavra-passe
            </label>
            <input
              type="password"
              value={smtpSettings.password}
              onChange={(e) => setSMTPSettings({...smtpSettings, password: e.target.value})}
              placeholder="••••••••"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome do Remetente
            </label>
            <input
              type="text"
              value={smtpSettings.fromName}
              onChange={(e) => setSMTPSettings({...smtpSettings, fromName: e.target.value})}
              placeholder="TechSolutions Lda"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email do Remetente
            </label>
            <input
              type="email"
              value={smtpSettings.fromEmail}
              onChange={(e) => setSMTPSettings({...smtpSettings, fromEmail: e.target.value})}
              placeholder="noreply@techsolutions.mz"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={handleTestSMTP}
            className="border border-blue-600 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-2"
          >
            <RefreshCw size={16} />
            Testar Conexão
          </button>
          <button
            onClick={handleSaveSMTP}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Save size={16} />
            Salvar SMTP
          </button>
        </div>
      </div>

      {/* WhatsApp Configuration */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <MessageSquare className="text-green-600" size={20} />
          Configuração WhatsApp Business
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              API Key
            </label>
            <input
              type="text"
              value={whatsappSettings.apiKey}
              onChange={(e) => setWhatsAppSettings({...whatsappSettings, apiKey: e.target.value})}
              placeholder="Sua API Key do WhatsApp Business"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Número de Telefone
            </label>
            <input
              type="text"
              value={whatsappSettings.phoneNumber}
              onChange={(e) => setWhatsAppSettings({...whatsappSettings, phoneNumber: e.target.value})}
              placeholder="+258 84 123 4567"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-4 mb-4">
          <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
            whatsappSettings.isConnected 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {whatsappSettings.isConnected ? (
              <>
                <CheckCircle size={16} />
                Conectado
              </>
            ) : (
              <>
                <AlertCircle size={16} />
                Desconectado
              </>
            )}
          </div>
        </div>
        
        <button
          onClick={handleConnectWhatsApp}
          disabled={whatsappSettings.isConnected}
          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <MessageSquare size={16} />
          {whatsappSettings.isConnected ? 'Conectado' : 'Conectar WhatsApp'}
        </button>
      </div>
    </div>
  );

  const renderSecurity = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Configurações de Segurança</h3>
        
        <div className="space-y-6">
          {/* Password Change */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Alterar Palavra-passe</h4>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Palavra-passe Atual
                </label>
                <input
                  type="password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="••••••••"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nova Palavra-passe
                  </label>
                  <input
                    type="password"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirmar Nova Palavra-passe
                  </label>
                  <input
                    type="password"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="••••••••"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Key size={16} />
                Alterar Palavra-passe
              </button>
            </form>
          </div>

          {/* Two Factor Authentication */}
          <div className="border-t border-gray-200 pt-6">
            <h4 className="font-medium text-gray-900 mb-3">Autenticação de Dois Fatores</h4>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">2FA via SMS</p>
                <p className="text-sm text-gray-600">Adicione uma camada extra de segurança</p>
              </div>
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                Ativar
              </button>
            </div>
          </div>

          {/* Session Management */}
          <div className="border-t border-gray-200 pt-6">
            <h4 className="font-medium text-gray-900 mb-3">Gestão de Sessões</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Sessão Atual</p>
                  <p className="text-sm text-gray-600">Chrome - Maputo, Moçambique</p>
                </div>
                <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                  Ativa
                </span>
              </div>
              <button className="text-red-600 hover:text-red-700 font-medium">
                Terminar todas as outras sessões
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Configurações</h2>
        <p className="text-gray-600">Gerir configurações da conta, empresa e integrações</p>
      </div>

      {/* Content */}
      {renderCompany()}
    </div>
  );
};