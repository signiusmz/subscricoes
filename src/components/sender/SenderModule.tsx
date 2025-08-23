import React, { useState, useEffect } from 'react';
import { MessageSquare, Mail, Smartphone, Settings, Wifi, WifiOff, QrCode, CheckCircle, AlertCircle, RefreshCw, Send, Eye, EyeOff } from 'lucide-react';

interface WhatsAppStatus {
  isConnected: boolean;
  phoneNumber?: string;
  lastSeen?: string;
  qrCode?: string;
}

interface SMTPConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  secure: boolean;
  fromName: string;
  fromEmail: string;
}

export const SenderModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState('whatsapp');
  const [whatsappStatus, setWhatsappStatus] = useState<WhatsAppStatus>({
    isConnected: false,
    qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='
  });
  const [smtpConfig, setSMTPConfig] = useState<SMTPConfig>({
    host: '',
    port: 587,
    username: '',
    password: '',
    secure: true,
    fromName: '',
    fromEmail: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  // Simulate QR code refresh
  const refreshQRCode = () => {
    setIsConnecting(true);
    setTimeout(() => {
      setWhatsappStatus(prev => ({
        ...prev,
        qrCode: `data:image/png;base64,${Math.random().toString(36).substring(7)}`
      }));
      setIsConnecting(false);
    }, 2000);
  };

  // Simulate WhatsApp connection
  const simulateConnection = () => {
    setTimeout(() => {
      setWhatsappStatus({
        isConnected: true,
        phoneNumber: '+258 84 123 4567',
        lastSeen: new Date().toISOString()
      });
    }, 5000);
  };

  // Test SMTP connection
  const testSMTPConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    
    // Simulate API call
    setTimeout(() => {
      if (smtpConfig.host && smtpConfig.username && smtpConfig.password) {
        setTestResult({
          success: true,
          message: 'Conexão SMTP estabelecida com sucesso!'
        });
      } else {
        setTestResult({
          success: false,
          message: 'Erro: Verifique as configurações SMTP'
        });
      }
      setIsTesting(false);
    }, 2000);
  };

  // Save SMTP configuration
  const saveSMTPConfig = () => {
    // Simulate save
    alert('Configurações SMTP salvas com sucesso!');
  };

  const tabs = [
    { id: 'whatsapp', label: 'WhatsApp', icon: MessageSquare },
  ];

  const renderWhatsAppTab = () => (
    <div className="space-y-6">
      {/* Status Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <MessageSquare className="text-green-600" size={24} />
            Status do WhatsApp
          </h3>
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
            whatsappStatus.isConnected 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {whatsappStatus.isConnected ? (
              <>
                <Wifi size={16} />
                Conectado
              </>
            ) : (
              <>
                <WifiOff size={16} />
                Desconectado
              </>
            )}
          </div>
        </div>

        {whatsappStatus.isConnected ? (
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
              <CheckCircle className="text-green-600" size={20} />
              <div>
                <p className="font-medium text-green-900">WhatsApp Conectado</p>
                <p className="text-sm text-green-700">Número: {whatsappStatus.phoneNumber}</p>
                <p className="text-sm text-green-700">
                  Última atividade: {whatsappStatus.lastSeen ? new Date(whatsappStatus.lastSeen).toLocaleString('pt-PT') : 'N/A'}
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button 
                onClick={() => setWhatsappStatus({ isConnected: false })}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Desconectar
              </button>
              <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                Testar Envio
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-yellow-50 rounded-lg">
              <AlertCircle className="text-yellow-600" size={20} />
              <div>
                <p className="font-medium text-yellow-900">WhatsApp Desconectado</p>
                <p className="text-sm text-yellow-700">Escaneie o código QR para conectar</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* QR Code Section */}
      {!whatsappStatus.isConnected && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <QrCode className="text-blue-600" size={24} />
              Código QR
            </h3>
            <button 
              onClick={refreshQRCode}
              disabled={isConnecting}
              className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={isConnecting ? 'animate-spin' : ''} size={16} />
              {isConnecting ? 'Gerando...' : 'Atualizar'}
            </button>
          </div>

          <div className="text-center">
            <div className="inline-block p-4 bg-gray-50 rounded-lg mb-4">
              {isConnecting ? (
                <div className="w-64 h-64 flex items-center justify-center">
                  <RefreshCw className="animate-spin text-gray-400" size={48} />
                </div>
              ) : (
                <div className="w-64 h-64 bg-white border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                  <QrCode className="text-gray-400" size={64} />
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <p className="font-medium text-gray-900">Como conectar:</p>
              <ol className="text-sm text-gray-600 space-y-1 text-left max-w-md mx-auto">
                <li>1. Abra o WhatsApp no seu telefone</li>
                <li>2. Toque em Menu (⋮) → Dispositivos conectados</li>
                <li>3. Toque em "Conectar um dispositivo"</li>
                <li>4. Escaneie este código QR</li>
              </ol>
            </div>

            <button 
              onClick={simulateConnection}
              className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Simular Conexão (Demo)
            </button>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-blue-50 rounded-xl border border-blue-200 p-6">
        <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
          <Smartphone className="text-blue-600" size={20} />
          Instruções Importantes
        </h4>
        <ul className="text-sm text-blue-800 space-y-2">
          <li>• Mantenha o WhatsApp Web sempre conectado para envio automático</li>
          <li>• O telefone deve estar conectado à internet</li>
          <li>• Recomendamos usar um número dedicado para o negócio</li>
          <li>• As mensagens serão enviadas através da API do WhatsApp Business</li>
        </ul>
      </div>
    </div>
  );

  const renderEmailTab = () => (
    <div className="space-y-6">
      {/* SMTP Configuration */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Settings className="text-blue-600" size={24} />
          Configuração SMTP
        </h3>

        <form onSubmit={(e) => { e.preventDefault(); saveSMTPConfig(); }} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Servidor SMTP *
              </label>
              <input
                type="text"
                value={smtpConfig.host}
                onChange={(e) => setSMTPConfig({...smtpConfig, host: e.target.value})}
                placeholder="smtp.gmail.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Porta *
              </label>
              <select
                value={smtpConfig.port}
                onChange={(e) => setSMTPConfig({...smtpConfig, port: Number(e.target.value)})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value={587}>587 (TLS)</option>
                <option value={465}>465 (SSL)</option>
                <option value={25}>25 (Não seguro)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome de Usuário *
              </label>
              <input
                type="text"
                value={smtpConfig.username}
                onChange={(e) => setSMTPConfig({...smtpConfig, username: e.target.value})}
                placeholder="seu@email.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Palavra-passe *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={smtpConfig.password}
                  onChange={(e) => setSMTPConfig({...smtpConfig, password: e.target.value})}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome do Remetente *
              </label>
              <input
                type="text"
                value={smtpConfig.fromName}
                onChange={(e) => setSMTPConfig({...smtpConfig, fromName: e.target.value})}
                placeholder="TechSolutions Lda"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email do Remetente *
              </label>
              <input
                type="email"
                value={smtpConfig.fromEmail}
                onChange={(e) => setSMTPConfig({...smtpConfig, fromEmail: e.target.value})}
                placeholder="noreply@techsolutions.mz"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="secure"
              checked={smtpConfig.secure}
              onChange={(e) => setSMTPConfig({...smtpConfig, secure: e.target.checked})}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="secure" className="text-sm text-gray-700">
              Usar conexão segura (TLS/SSL)
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={testSMTPConnection}
              disabled={isTesting}
              className="flex items-center gap-2 px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors disabled:opacity-50"
            >
              {isTesting ? (
                <RefreshCw className="animate-spin" size={16} />
              ) : (
                <Send size={16} />
              )}
              {isTesting ? 'Testando...' : 'Testar Conexão'}
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Salvar Configurações
            </button>
          </div>
        </form>

        {/* Test Result */}
        {testResult && (
          <div className={`mt-4 p-4 rounded-lg flex items-center gap-3 ${
            testResult.success 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {testResult.success ? (
              <CheckCircle className="text-green-600" size={20} />
            ) : (
              <AlertCircle className="text-red-600" size={20} />
            )}
            <p className="font-medium">{testResult.message}</p>
          </div>
        )}
      </div>


      {/* Instructions */}
      <div className="bg-yellow-50 rounded-xl border border-yellow-200 p-6">
        <h4 className="font-semibold text-yellow-900 mb-3 flex items-center gap-2">
          <AlertCircle className="text-yellow-600" size={20} />
          Instruções Importantes
        </h4>
        <ul className="text-sm text-yellow-800 space-y-2">
          <li>• Para Gmail, use uma "App Password" em vez da senha normal</li>
          <li>• Ative a autenticação de 2 fatores antes de gerar App Passwords</li>
          <li>• Teste sempre a configuração antes de usar em produção</li>
          <li>• Mantenha as credenciais seguras e não as compartilhe</li>
          <li>• Alguns provedores podem bloquear emails automáticos</li>
        </ul>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Configurações de Envio</h2>
        <p className="text-gray-600">Configure WhatsApp e Email para envio automático de mensagens</p>
      </div>

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

      {/* Content */}
      {activeTab === 'whatsapp' && renderWhatsAppTab()}
      {activeTab === 'email' && renderEmailTab()}
    </div>
  );
};