import React, { useState } from 'react';
import { 
  Settings, 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Database,
  MessageSquare,
  Phone,
  QrCode,
  Wifi,
  WifiOff,
  RefreshCw,
  X,
  CheckCircle,
  AlertCircle,
  Clock,
  Info
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface WhatsAppConfig {
  phoneNumber: string;
  isConnected: boolean;
  lastConnection?: string;
  sessionId?: string;
}

export const SettingsPanel: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [showQRModal, setShowQRModal] = useState(false);
  const [qrCode, setQrCode] = useState('');
  const [qrTimeout, setQrTimeout] = useState(60);
  const [isConnecting, setIsConnecting] = useState(false);
  
  // WhatsApp configuration state
  const [whatsappConfig, setWhatsappConfig] = useState<WhatsAppConfig>({
    phoneNumber: '',
    isConnected: false,
    lastConnection: undefined,
    sessionId: undefined
  });

  // Form states
  const [phoneNumber, setPhoneNumber] = useState(whatsappConfig.phoneNumber);
  const [phoneError, setPhoneError] = useState('');

  // Check if user has permission to access WhatsApp settings
  const hasWhatsAppPermission = user?.role === 'admin' || user?.role === 'manager';

  // Phone number validation
  const validatePhoneNumber = (phone: string): boolean => {
    // International format validation: +[country code] ([area code]) [number]
    const phoneRegex = /^\+\d{1,3}\s?\(\d{2,3}\)\s?\d{4,5}-?\d{4}$/;
    const simpleRegex = /^\+\d{10,15}$/;
    
    return phoneRegex.test(phone) || simpleRegex.test(phone.replace(/\s/g, ''));
  };

  const handlePhoneChange = (value: string) => {
    setPhoneNumber(value);
    
    if (value && !validatePhoneNumber(value)) {
      setPhoneError('Formato inválido. Use: +55 (11) 99999-9999 ou +5511999999999');
    } else {
      setPhoneError('');
    }
  };

  const generateQRCode = async () => {
    if (!phoneNumber || phoneError) {
      alert('Por favor, insira um número de WhatsApp válido primeiro.');
      return;
    }

    setIsConnecting(true);
    setShowQRModal(true);
    setQrTimeout(60);

    try {
      // Simulate QR code generation (in real implementation, this would call WhatsApp Web.js)
      const mockQRCode = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==`;
      setQrCode(mockQRCode);

      // Start countdown timer
      const timer = setInterval(() => {
        setQrTimeout((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setShowQRModal(false);
            setIsConnecting(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Simulate connection after 10 seconds (for demo)
      setTimeout(() => {
        setWhatsappConfig({
          phoneNumber,
          isConnected: true,
          lastConnection: new Date().toISOString(),
          sessionId: `session_${Date.now()}`
        });
        setShowQRModal(false);
        setIsConnecting(false);
        clearInterval(timer);
        alert('WhatsApp conectado com sucesso!');
      }, 10000);

    } catch (error) {
      console.error('Erro ao gerar QR code:', error);
      setIsConnecting(false);
      setShowQRModal(false);
      alert('Erro ao conectar com WhatsApp. Tente novamente.');
    }
  };

  const handleDisconnect = () => {
    if (confirm('Tem certeza que deseja desconectar o WhatsApp?')) {
      setWhatsappConfig({
        phoneNumber: whatsappConfig.phoneNumber,
        isConnected: false,
        lastConnection: whatsappConfig.lastConnection,
        sessionId: undefined
      });
      alert('WhatsApp desconectado com sucesso!');
    }
  };

  const handleSaveWhatsAppConfig = () => {
    if (phoneError) {
      alert('Por favor, corrija os erros antes de salvar.');
      return;
    }

    setWhatsappConfig(prev => ({
      ...prev,
      phoneNumber
    }));
    
    alert('Configurações do WhatsApp salvas com sucesso!');
  };

  const formatLastConnection = (dateString?: string) => {
    if (!dateString) return 'Nunca conectado';
    
    const date = new Date(dateString);
    return date.toLocaleString('pt-PT');
  };

  const tabs = [
    { id: 'profile', label: 'Perfil', icon: User },
    { id: 'notifications', label: 'Notificações', icon: Bell },
    { id: 'security', label: 'Segurança', icon: Shield },
    { id: 'appearance', label: 'Aparência', icon: Palette },
    { id: 'data', label: 'Dados', icon: Database },
    ...(hasWhatsAppPermission ? [{ id: 'whatsapp', label: 'WhatsApp', icon: MessageSquare }] : [])
  ];

  const renderWhatsAppSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Integração WhatsApp Business</h3>
        <p className="text-gray-600">Configure a integração com WhatsApp para envio automático de mensagens.</p>
      </div>

      {/* Connection Status Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-md font-semibold text-gray-900 flex items-center gap-2">
            <Wifi className="text-blue-600" size={20} />
            Status da Conexão
          </h4>
          <div className="flex items-center gap-2">
            {whatsappConfig.isConnected ? (
              <>
                <CheckCircle className="text-green-600" size={20} />
                <span className="px-3 py-1 text-sm font-semibold rounded-full bg-green-100 text-green-800">
                  Conectado
                </span>
              </>
            ) : (
              <>
                <WifiOff className="text-red-600" size={20} />
                <span className="px-3 py-1 text-sm font-semibold rounded-full bg-red-100 text-red-800">
                  Desconectado
                </span>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-600">Número Configurado</p>
            <p className="font-medium text-gray-900">
              {whatsappConfig.phoneNumber || 'Não configurado'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Última Conexão</p>
            <p className="font-medium text-gray-900 flex items-center gap-1">
              <Clock size={14} />
              {formatLastConnection(whatsappConfig.lastConnection)}
            </p>
          </div>
        </div>

        {whatsappConfig.isConnected && (
          <button
            onClick={handleDisconnect}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
          >
            <X size={16} />
            Desconectar WhatsApp
          </button>
        )}
      </div>

      {/* Phone Configuration */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Phone className="text-green-600" size={20} />
          Configuração do Número
        </h4>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Número WhatsApp Business
              <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => handlePhoneChange(e.target.value)}
              placeholder="+55 (11) 99999-9999"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                phoneError ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
            />
            {phoneError && (
              <div className="mt-2 flex items-center gap-2 text-red-600 text-sm">
                <AlertCircle size={16} />
                {phoneError}
              </div>
            )}
            <div className="mt-2 flex items-start gap-2 text-blue-600 text-sm">
              <Info size={16} className="mt-0.5 flex-shrink-0" />
              <div>
                <p>Formatos aceitos:</p>
                <ul className="list-disc list-inside ml-2 text-xs">
                  <li>+55 (11) 99999-9999</li>
                  <li>+5511999999999</li>
                  <li>+1 (555) 123-4567</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleSaveWhatsAppConfig}
              disabled={!!phoneError || !phoneNumber}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Salvar Configurações
            </button>
          </div>
        </div>
      </div>

      {/* Connection Setup */}
      {!whatsappConfig.isConnected && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <QrCode className="text-purple-600" size={20} />
            Conectar WhatsApp
          </h4>

          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Info className="text-blue-600 mt-0.5" size={20} />
                <div>
                  <h5 className="font-medium text-blue-900 mb-1">Como conectar:</h5>
                  <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                    <li>Configure o número WhatsApp Business acima</li>
                    <li>Clique em "Conectar WhatsApp" para gerar o QR code</li>
                    <li>Abra o WhatsApp Business no seu celular</li>
                    <li>Vá em Configurações → Dispositivos conectados</li>
                    <li>Escaneie o QR code exibido</li>
                  </ol>
                </div>
              </div>
            </div>

            <button
              onClick={generateQRCode}
              disabled={!phoneNumber || !!phoneError || isConnecting}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {isConnecting ? (
                <>
                  <RefreshCw className="animate-spin" size={20} />
                  Conectando...
                </>
              ) : (
                <>
                  <QrCode size={20} />
                  Conectar WhatsApp
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Usage Statistics */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h4 className="text-md font-semibold text-gray-900 mb-4">Estatísticas de Uso</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-gray-900">0</p>
            <p className="text-sm text-gray-600">Mensagens Enviadas</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-gray-900">0</p>
            <p className="text-sm text-gray-600">Mensagens Entregues</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-gray-900">0%</p>
            <p className="text-sm text-gray-600">Taxa de Entrega</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderProfileSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Configurações do Perfil</h3>
        <p className="text-gray-600">Gerir informações pessoais e preferências da conta.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h4 className="text-md font-semibold text-gray-900 mb-4">Informações Pessoais</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nome Completo</label>
            <input
              type="text"
              defaultValue={user?.name || ''}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              defaultValue={user?.email || ''}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Telefone</label>
            <input
              type="text"
              defaultValue={user?.phone || ''}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Função</label>
            <input
              type="text"
              value={user?.role === 'admin' ? 'Administrador' : user?.role === 'manager' ? 'Gestor' : 'Utilizador'}
              disabled
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
            />
          </div>
        </div>

        <div className="mt-6">
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Salvar Alterações
          </button>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Configurações de Notificações</h3>
        <p className="text-gray-600">Controlar como e quando receber notificações.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h4 className="text-md font-semibold text-gray-900 mb-4">Preferências de Notificação</h4>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Notificações por Email</p>
              <p className="text-sm text-gray-600">Receber notificações importantes por email</p>
            </div>
            <input type="checkbox" defaultChecked className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Lembretes de Renovação</p>
              <p className="text-sm text-gray-600">Alertas sobre serviços próximos do vencimento</p>
            </div>
            <input type="checkbox" defaultChecked className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Relatórios Semanais</p>
              <p className="text-sm text-gray-600">Resumo semanal das atividades</p>
            </div>
            <input type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
          </div>
        </div>

        <div className="mt-6">
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Salvar Preferências
          </button>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return renderProfileSettings();
      case 'notifications':
        return renderNotificationSettings();
      case 'whatsapp':
        return renderWhatsAppSettings();
      case 'security':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Configurações de Segurança</h3>
              <p className="text-gray-600">Gerir palavra-passe e configurações de segurança.</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <p className="text-gray-500">Configurações de segurança em desenvolvimento...</p>
            </div>
          </div>
        );
      case 'appearance':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Configurações de Aparência</h3>
              <p className="text-gray-600">Personalizar a aparência da interface.</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <p className="text-gray-500">Configurações de aparência em desenvolvimento...</p>
            </div>
          </div>
        );
      case 'data':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Configurações de Dados</h3>
              <p className="text-gray-600">Gerir dados e configurações de backup.</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <p className="text-gray-500">Configurações de dados em desenvolvimento...</p>
            </div>
          </div>
        );
      default:
        return renderProfileSettings();
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

      {/* QR Code Modal */}
      {showQRModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4">
            <div className="text-center">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Conectar WhatsApp</h3>
                <button
                  onClick={() => {
                    setShowQRModal(false);
                    setIsConnecting(false);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="mb-4">
                <div className="w-64 h-64 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center mx-auto mb-4">
                  {qrCode ? (
                    <img src={qrCode} alt="QR Code" className="w-full h-full object-contain" />
                  ) : (
                    <div className="text-center">
                      <QrCode className="mx-auto mb-2 text-gray-400" size={48} />
                      <p className="text-gray-500">Gerando QR Code...</p>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-center gap-2 mb-4">
                  <Clock className="text-orange-600" size={16} />
                  <span className="text-sm font-medium text-orange-600">
                    Expira em {qrTimeout}s
                  </span>
                </div>
              </div>

              <div className="text-left bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <h4 className="font-medium text-blue-900 mb-2">Instruções:</h4>
                <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                  <li>Abra o WhatsApp Business no seu celular</li>
                  <li>Toque em Configurações → Dispositivos conectados</li>
                  <li>Toque em "Conectar um dispositivo"</li>
                  <li>Escaneie este código QR</li>
                </ol>
              </div>

              <button
                onClick={generateQRCode}
                className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
              >
                <RefreshCw size={16} />
                Renovar QR Code
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};