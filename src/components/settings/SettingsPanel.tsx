import React, { useState } from 'react';
import { 
  User, 
  Building, 
  Shield, 
  Bell, 
  Palette, 
  Globe, 
  Save,
  Edit,
  Camera,
  Upload,
  MessageSquare,
  Mail,
  Smartphone,
  Server,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  QrCode,
  Wifi,
  WifiOff
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface WhatsAppConfig {
  phoneNumber: string;
  isConnected: boolean;
  qrCode?: string;
  lastConnected?: string;
}

interface EmailConfig {
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  smtpPassword: string;
  smtpSecure: boolean;
  fromName: string;
  fromEmail: string;
  isConfigured: boolean;
}

export const SettingsPanel: React.FC = () => {
  const { user, company, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(user?.profilePhoto || null);
  
  // WhatsApp state
  const [whatsappConfig, setWhatsappConfig] = useState<WhatsAppConfig>({
    phoneNumber: '+258 84 123 4567',
    isConnected: false,
    qrCode: undefined,
    lastConnected: undefined
  });
  
  // Email state
  const [emailConfig, setEmailConfig] = useState<EmailConfig>({
    smtpHost: '',
    smtpPort: 587,
    smtpUser: '',
    smtpPassword: '',
    smtpSecure: true,
    fromName: company?.name || '',
    fromEmail: '',
    isConfigured: false
  });

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('A imagem deve ter no máximo 5MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setProfilePhoto(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setProfilePhoto(null);
  };

  const handleUpdateProfile = (profileData: any) => {
    updateUser({ ...profileData, profilePhoto });
    alert('Perfil atualizado com sucesso!');
  };

  const handleWhatsAppConnect = () => {
    if (whatsappConfig.isConnected) {
      // Disconnect
      setWhatsappConfig(prev => ({
        ...prev,
        isConnected: false,
        qrCode: undefined,
        lastConnected: undefined
      }));
      alert('WhatsApp desconectado com sucesso!');
    } else {
      // Generate QR Code (simulate)
      const mockQrCode = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2ZmZiIvPgogIDx0ZXh0IHg9IjEwMCIgeT0iMTAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXNpemU9IjE0IiBmaWxsPSIjMzMzIj5RUiBDb2RlPC90ZXh0Pgo8L3N2Zz4K';
      
      setWhatsappConfig(prev => ({
        ...prev,
        qrCode: mockQrCode
      }));
      
      // Simulate connection after 3 seconds
      setTimeout(() => {
        setWhatsappConfig(prev => ({
          ...prev,
          isConnected: true,
          qrCode: undefined,
          lastConnected: new Date().toISOString()
        }));
        alert('WhatsApp conectado com sucesso!');
      }, 3000);
    }
  };

  const handleEmailTest = () => {
    if (!emailConfig.smtpHost || !emailConfig.smtpUser || !emailConfig.fromEmail) {
      alert('Por favor, preencha todos os campos obrigatórios');
      return;
    }
    
    // Simulate email test
    setTimeout(() => {
      setEmailConfig(prev => ({ ...prev, isConfigured: true }));
      alert('Configuração de email testada com sucesso! Email de teste enviado.');
    }, 1000);
  };

  const handleSaveEmailConfig = () => {
    if (!emailConfig.smtpHost || !emailConfig.smtpUser || !emailConfig.fromEmail) {
      alert('Por favor, preencha todos os campos obrigatórios');
      return;
    }
    
    setEmailConfig(prev => ({ ...prev, isConfigured: true }));
    alert('Configurações de email salvas com sucesso!');
  };

  const tabs = [
    { id: 'profile', label: 'Perfil', icon: User },
    { id: 'company', label: 'Empresa', icon: Building },
    { id: 'whatsapp', label: 'WhatsApp', icon: MessageSquare },
    { id: 'email', label: 'E-mail', icon: Mail },
    { id: 'security', label: 'Segurança', icon: Shield },
    { id: 'notifications', label: 'Notificações', icon: Bell },
    { id: 'appearance', label: 'Aparência', icon: Palette },
    { id: 'system', label: 'Sistema', icon: Globe }
  ];

  const renderProfile = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Informações do Perfil</h3>
        
        <form onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          const profileData = {
            name: formData.get('name') as string,
            email: formData.get('email') as string,
            phone: formData.get('phone') as string,
          };
          handleUpdateProfile(profileData);
        }} className="space-y-6">
          
          {/* Profile Photo Section */}
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                {profilePhoto ? (
                  <img 
                    src={profilePhoto} 
                    alt="Profile Preview" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User size={32} className="text-gray-400" />
                )}
              </div>
              <div className="absolute -bottom-2 -right-2">
                <label className="bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors inline-flex">
                  <Camera size={16} />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-gray-900 mb-2">Foto de Perfil</h4>
              <p className="text-sm text-gray-600 mb-3">
                Formatos aceites: JPG, PNG, GIF (máx. 5MB)
              </p>
              <div className="flex gap-2">
                <label className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors flex items-center gap-1">
                  <Upload size={14} />
                  Carregar Foto
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>
                {profilePhoto && (
                  <button
                    type="button"
                    onClick={removePhoto}
                    className="text-sm bg-red-100 text-red-700 px-3 py-1 rounded-lg hover:bg-red-200 transition-colors"
                  >
                    Remover
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome Completo
              </label>
              <input
                type="text"
                name="name"
                defaultValue={user?.name || ''}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                defaultValue={user?.email || ''}
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
                defaultValue={user?.phone || ''}
                placeholder="+258 84 123 4567"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Save size={16} />
              Salvar Alterações
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const renderWhatsApp = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Configurações do WhatsApp</h3>
        <p className="text-gray-600 mb-6">
          Configure a integração do WhatsApp para envio automático de mensagens aos clientes.
        </p>
      </div>

      {/* Connection Status */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              whatsappConfig.isConnected ? 'bg-green-100' : 'bg-red-100'
            }`}>
              {whatsappConfig.isConnected ? (
                <Wifi className="text-green-600" size={24} />
              ) : (
                <WifiOff className="text-red-600" size={24} />
              )}
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Status da Conexão</h4>
              <p className={`text-sm ${
                whatsappConfig.isConnected ? 'text-green-600' : 'text-red-600'
              }`}>
                {whatsappConfig.isConnected ? 'Conectado' : 'Desconectado'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {whatsappConfig.isConnected ? (
              <CheckCircle className="text-green-500" size={20} />
            ) : (
              <XCircle className="text-red-500" size={20} />
            )}
          </div>
        </div>

        {whatsappConfig.isConnected && whatsappConfig.lastConnected && (
          <div className="text-sm text-gray-600">
            Última conexão: {new Date(whatsappConfig.lastConnected).toLocaleString('pt-PT')}
          </div>
        )}
      </div>

      {/* Phone Number Configuration */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h4 className="font-semibold text-gray-900 mb-4">Número do WhatsApp</h4>
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Número de Telefone
            </label>
            <input
              type="text"
              value={whatsappConfig.phoneNumber}
              onChange={(e) => setWhatsappConfig(prev => ({ ...prev, phoneNumber: e.target.value }))}
              placeholder="+258 84 123 4567"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              Digite o número com código do país (ex: +258 84 123 4567)
            </p>
          </div>
        </div>
      </div>

      {/* QR Code Section */}
      {whatsappConfig.qrCode && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
          <h4 className="font-semibold text-gray-900 mb-4">Escaneie o QR Code</h4>
          <div className="flex justify-center mb-4">
            <div className="w-48 h-48 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
              <img src={whatsappConfig.qrCode} alt="QR Code" className="w-40 h-40" />
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Abra o WhatsApp no seu telefone e escaneie este código para conectar
          </p>
          <div className="flex items-center justify-center gap-2 text-blue-600">
            <QrCode size={16} />
            <span className="text-sm">Aguardando conexão...</span>
          </div>
        </div>
      )}

      {/* Connection Button */}
      <div className="flex justify-center">
        <button
          onClick={handleWhatsAppConnect}
          className={`px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2 ${
            whatsappConfig.isConnected
              ? 'bg-red-600 text-white hover:bg-red-700'
              : 'bg-green-600 text-white hover:bg-green-700'
          }`}
        >
          <Smartphone size={16} />
          {whatsappConfig.isConnected ? 'Desconectar WhatsApp' : 'Conectar WhatsApp'}
        </button>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h4 className="font-semibold text-blue-900 mb-3">Como conectar:</h4>
        <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800">
          <li>Digite o número do WhatsApp da sua empresa</li>
          <li>Clique em "Conectar WhatsApp"</li>
          <li>Escaneie o QR Code com o WhatsApp do seu telefone</li>
          <li>Aguarde a confirmação da conexão</li>
        </ol>
      </div>
    </div>
  );

  const renderEmail = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Configurações de E-mail</h3>
        <p className="text-gray-600 mb-6">
          Configure o servidor SMTP para envio automático de emails do sistema.
        </p>
      </div>

      {/* Configuration Status */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              emailConfig.isConfigured ? 'bg-green-100' : 'bg-yellow-100'
            }`}>
              <Server className={emailConfig.isConfigured ? 'text-green-600' : 'text-yellow-600'} size={24} />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Status da Configuração</h4>
              <p className={`text-sm ${
                emailConfig.isConfigured ? 'text-green-600' : 'text-yellow-600'
              }`}>
                {emailConfig.isConfigured ? 'Configurado' : 'Não configurado'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {emailConfig.isConfigured ? (
              <CheckCircle className="text-green-500" size={20} />
            ) : (
              <XCircle className="text-yellow-500" size={20} />
            )}
          </div>
        </div>
      </div>

      {/* SMTP Configuration */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h4 className="font-semibold text-gray-900 mb-4">Configurações SMTP</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Servidor SMTP *
            </label>
            <input
              type="text"
              value={emailConfig.smtpHost}
              onChange={(e) => setEmailConfig(prev => ({ ...prev, smtpHost: e.target.value }))}
              placeholder="smtp.gmail.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Porta SMTP *
            </label>
            <input
              type="number"
              value={emailConfig.smtpPort}
              onChange={(e) => setEmailConfig(prev => ({ ...prev, smtpPort: parseInt(e.target.value) }))}
              placeholder="587"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Usuário SMTP *
            </label>
            <input
              type="text"
              value={emailConfig.smtpUser}
              onChange={(e) => setEmailConfig(prev => ({ ...prev, smtpUser: e.target.value }))}
              placeholder="seu@email.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Senha SMTP *
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={emailConfig.smtpPassword}
                onChange={(e) => setEmailConfig(prev => ({ ...prev, smtpPassword: e.target.value }))}
                placeholder="••••••••"
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="smtpSecure"
                checked={emailConfig.smtpSecure}
                onChange={(e) => setEmailConfig(prev => ({ ...prev, smtpSecure: e.target.checked }))}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="smtpSecure" className="text-sm text-gray-700">
                Usar conexão segura (TLS/SSL)
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Sender Information */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h4 className="font-semibold text-gray-900 mb-4">Informações do Remetente</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome a Apresentar *
            </label>
            <input
              type="text"
              value={emailConfig.fromName}
              onChange={(e) => setEmailConfig(prev => ({ ...prev, fromName: e.target.value }))}
              placeholder="Nome da Empresa"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              Nome que aparecerá como remetente dos emails
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email do Remetente *
            </label>
            <input
              type="email"
              value={emailConfig.fromEmail}
              onChange={(e) => setEmailConfig(prev => ({ ...prev, fromEmail: e.target.value }))}
              placeholder="noreply@empresa.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              Endereço de email que aparecerá como remetente
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 justify-end">
        <button
          onClick={handleEmailTest}
          className="border border-blue-600 text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-2"
        >
          <Mail size={16} />
          Testar Configuração
        </button>
        <button
          onClick={handleSaveEmailConfig}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Save size={16} />
          Salvar Configurações
        </button>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h4 className="font-semibold text-blue-900 mb-3">Configurações comuns:</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
          <div>
            <strong>Gmail:</strong>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li>Servidor: smtp.gmail.com</li>
              <li>Porta: 587</li>
              <li>Seguro: Sim</li>
            </ul>
          </div>
          <div>
            <strong>Outlook:</strong>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li>Servidor: smtp-mail.outlook.com</li>
              <li>Porta: 587</li>
              <li>Seguro: Sim</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCompany = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Informações da Empresa</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome da Empresa
            </label>
            <input
              type="text"
              defaultValue={company?.name || ''}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              readOnly
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email da Empresa
            </label>
            <input
              type="email"
              defaultValue={company?.email || ''}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              readOnly
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              NUIT
            </label>
            <input
              type="text"
              defaultValue={company?.nuit || ''}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              readOnly
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Plano Atual
            </label>
            <input
              type="text"
              defaultValue={company?.plan || ''}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent capitalize"
              readOnly
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Endereço
            </label>
            <input
              type="text"
              defaultValue={company?.address || ''}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              readOnly
            />
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Nota:</strong> Para alterar as informações da empresa, entre em contacto com o suporte.
          </p>
        </div>
      </div>
    </div>
  );

  const renderSecurity = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Configurações de Segurança</h3>
        
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h4 className="font-semibold text-gray-900 mb-4">Alterar Palavra-passe</h4>
            
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Palavra-passe Atual
                </label>
                <input
                  type="password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nova Palavra-passe
                </label>
                <input
                  type="password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmar Nova Palavra-passe
                </label>
                <input
                  type="password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Alterar Palavra-passe
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotifications = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Preferências de Notificação</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Notificações por Email</h4>
              <p className="text-sm text-gray-600">Receber notificações importantes por email</p>
            </div>
            <input type="checkbox" defaultChecked className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
          </div>

          <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Lembretes de Renovação</h4>
              <p className="text-sm text-gray-600">Alertas sobre serviços próximos do vencimento</p>
            </div>
            <input type="checkbox" defaultChecked className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
          </div>

          <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Relatórios Semanais</h4>
              <p className="text-sm text-gray-600">Resumo semanal das atividades</p>
            </div>
            <input type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
          </div>
        </div>
      </div>
    </div>
  );

  const renderAppearance = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Aparência</h3>
        
        <div className="space-y-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Tema</h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="border-2 border-blue-600 rounded-lg p-4 cursor-pointer">
                <div className="w-full h-20 bg-white border rounded mb-2"></div>
                <p className="text-sm text-center">Claro</p>
              </div>
              <div className="border-2 border-gray-300 rounded-lg p-4 cursor-pointer">
                <div className="w-full h-20 bg-gray-800 rounded mb-2"></div>
                <p className="text-sm text-center">Escuro</p>
              </div>
              <div className="border-2 border-gray-300 rounded-lg p-4 cursor-pointer">
                <div className="w-full h-20 bg-gradient-to-br from-white to-gray-800 rounded mb-2"></div>
                <p className="text-sm text-center">Automático</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSystem = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Configurações do Sistema</h3>
        
        <div className="space-y-4">
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h4 className="font-semibold text-gray-900 mb-4">Informações do Sistema</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Versão:</span>
                <span className="ml-2 font-medium">1.0.0</span>
              </div>
              <div>
                <span className="text-gray-600">Última Atualização:</span>
                <span className="ml-2 font-medium">15/03/2024</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Configurações</h2>
        
        {/* Navigation Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2 whitespace-nowrap ${
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
      <div className="bg-gray-50 rounded-xl p-6">
        {activeTab === 'profile' && renderProfile()}
        {activeTab === 'company' && renderCompany()}
        {activeTab === 'whatsapp' && renderWhatsApp()}
        {activeTab === 'email' && renderEmail()}
        {activeTab === 'security' && renderSecurity()}
        {activeTab === 'notifications' && renderNotifications()}
        {activeTab === 'appearance' && renderAppearance()}
        {activeTab === 'system' && renderSystem()}
      </div>
    </div>
  );
};