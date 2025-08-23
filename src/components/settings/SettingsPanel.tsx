import React, { useState } from 'react';
import { 
  Settings, 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Globe, 
  MessageSquare,
  Smartphone,
  QrCode,
  CheckCircle,
  XCircle,
  Plus,
  Trash2,
  Edit,
  Phone,
  Mail,
  Building,
  Wifi,
  WifiOff,
  RefreshCw,
  Download,
  Upload
} from 'lucide-react';

interface WhatsAppContact {
  id: string;
  name: string;
  phone: string;
  isActive: boolean;
  lastSeen?: string;
  profilePicture?: string;
}

interface WhatsAppSession {
  id: string;
  deviceName: string;
  isConnected: boolean;
  lastActivity: string;
  qrCode?: string;
  phoneNumber?: string;
}

const mockWhatsAppContacts: WhatsAppContact[] = [
  {
    id: '1',
    name: 'João Silva',
    phone: '+258841234567',
    isActive: true,
    lastSeen: '2024-03-15T10:30:00Z'
  },
  {
    id: '2',
    name: 'Maria Santos',
    phone: '+258859876543',
    isActive: true,
    lastSeen: '2024-03-15T09:15:00Z'
  },
  {
    id: '3',
    name: 'Carlos Mendes',
    phone: '+258865557777',
    isActive: false,
    lastSeen: '2024-03-10T14:20:00Z'
  }
];

export const SettingsPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [whatsappSession, setWhatsappSession] = useState<WhatsAppSession>({
    id: '1',
    deviceName: 'Signius Web',
    isConnected: false,
    lastActivity: '2024-03-15T10:30:00Z',
    qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='
  });
  const [whatsappContacts, setWhatsappContacts] = useState<WhatsAppContact[]>(mockWhatsAppContacts);
  const [showAddContactModal, setShowAddContactModal] = useState(false);
  const [editingContact, setEditingContact] = useState<WhatsAppContact | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const formatLastSeen = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Hoje';
    if (diffDays === 2) return 'Ontem';
    if (diffDays <= 7) return `${diffDays - 1} dias atrás`;
    return date.toLocaleDateString('pt-PT');
  };

  const handleConnectWhatsApp = async () => {
    setIsConnecting(true);
    
    // Simulate connection process
    setTimeout(() => {
      setWhatsappSession(prev => ({
        ...prev,
        isConnected: true,
        phoneNumber: '+258841234567',
        lastActivity: new Date().toISOString(),
        qrCode: undefined
      }));
      setIsConnecting(false);
      alert('WhatsApp conectado com sucesso!');
    }, 3000);
  };

  const handleDisconnectWhatsApp = () => {
    if (confirm('Tem certeza que deseja desconectar o WhatsApp?')) {
      setWhatsappSession(prev => ({
        ...prev,
        isConnected: false,
        phoneNumber: undefined,
        lastActivity: new Date().toISOString(),
        qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='
      }));
      alert('WhatsApp desconectado!');
    }
  };

  const handleRefreshQR = () => {
    setWhatsappSession(prev => ({
      ...prev,
      qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
      lastActivity: new Date().toISOString()
    }));
    alert('QR Code atualizado!');
  };

  const handleAddContact = () => {
    setShowAddContactModal(true);
  };

  const handleEditContact = (contact: WhatsAppContact) => {
    setEditingContact(contact);
    setShowAddContactModal(true);
  };

  const handleDeleteContact = (contactId: string) => {
    if (confirm('Tem certeza que deseja remover este contacto?')) {
      setWhatsappContacts(contacts => contacts.filter(c => c.id !== contactId));
      alert('Contacto removido com sucesso!');
    }
  };

  const handleSaveContact = (contactData: Partial<WhatsAppContact>) => {
    if (editingContact) {
      // Update existing contact
      setWhatsappContacts(contacts => contacts.map(c => 
        c.id === editingContact.id 
          ? { ...c, ...contactData }
          : c
      ));
      alert('Contacto atualizado com sucesso!');
    } else {
      // Add new contact
      const newContact: WhatsAppContact = {
        id: Date.now().toString(),
        name: contactData.name || '',
        phone: contactData.phone || '',
        isActive: true,
        lastSeen: new Date().toISOString()
      };
      setWhatsappContacts(contacts => [...contacts, newContact]);
      alert('Contacto adicionado com sucesso!');
    }
    setShowAddContactModal(false);
    setEditingContact(null);
  };

  const renderWhatsAppBusiness = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">WhatsApp Business</h3>
        <p className="text-gray-600">Configure e gerencie a integração com WhatsApp Business</p>
      </div>

      {/* Connection Status */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-md font-semibold text-gray-900 flex items-center gap-2">
            <MessageSquare className="text-green-600" size={20} />
            Status da Conexão
          </h4>
          <div className="flex items-center gap-2">
            {whatsappSession.isConnected ? (
              <>
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-600 font-medium">Conectado</span>
              </>
            ) : (
              <>
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-red-600 font-medium">Desconectado</span>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Smartphone size={16} className="text-gray-400" />
                <span className="text-sm text-gray-600">Dispositivo:</span>
                <span className="text-sm font-medium text-gray-900">{whatsappSession.deviceName}</span>
              </div>
              
              {whatsappSession.phoneNumber && (
                <div className="flex items-center gap-2">
                  <Phone size={16} className="text-gray-400" />
                  <span className="text-sm text-gray-600">Número:</span>
                  <span className="text-sm font-medium text-gray-900">{whatsappSession.phoneNumber}</span>
                </div>
              )}
              
              <div className="flex items-center gap-2">
                <RefreshCw size={16} className="text-gray-400" />
                <span className="text-sm text-gray-600">Última atividade:</span>
                <span className="text-sm font-medium text-gray-900">
                  {formatLastSeen(whatsappSession.lastActivity)}
                </span>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              {whatsappSession.isConnected ? (
                <button
                  onClick={handleDisconnectWhatsApp}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                >
                  <WifiOff size={16} />
                  Desconectar
                </button>
              ) : (
                <button
                  onClick={handleConnectWhatsApp}
                  disabled={isConnecting}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  {isConnecting ? (
                    <RefreshCw size={16} className="animate-spin" />
                  ) : (
                    <Wifi size={16} />
                  )}
                  {isConnecting ? 'Conectando...' : 'Conectar'}
                </button>
              )}
              
              {!whatsappSession.isConnected && (
                <button
                  onClick={handleRefreshQR}
                  className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                >
                  <RefreshCw size={16} />
                  Atualizar QR
                </button>
              )}
            </div>
          </div>

          {/* QR Code Section */}
          {!whatsappSession.isConnected && whatsappSession.qrCode && (
            <div className="flex flex-col items-center">
              <div className="bg-white p-4 rounded-lg border-2 border-gray-200 mb-4">
                <div className="w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                  <QrCode size={64} className="text-gray-400" />
                </div>
              </div>
              <p className="text-sm text-gray-600 text-center">
                Escaneie este código QR com o WhatsApp no seu telemóvel
              </p>
              <p className="text-xs text-gray-500 text-center mt-1">
                WhatsApp → Definições → Dispositivos ligados → Ligar dispositivo
              </p>
            </div>
          )}

          {/* Connected Status */}
          {whatsappSession.isConnected && (
            <div className="flex flex-col items-center justify-center">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle size={48} className="text-green-600" />
              </div>
              <p className="text-lg font-semibold text-green-600 mb-2">WhatsApp Conectado!</p>
              <p className="text-sm text-gray-600 text-center">
                Seu WhatsApp Business está conectado e pronto para enviar mensagens
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Contacts Management */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-md font-semibold text-gray-900 flex items-center gap-2">
            <User className="text-blue-600" size={20} />
            Gestão de Contactos
          </h4>
          <button
            onClick={handleAddContact}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus size={16} />
            Adicionar Contacto
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <User className="text-blue-600" size={20} />
              </div>
              <div>
                <p className="text-sm text-blue-600">Total Contactos</p>
                <p className="text-xl font-bold text-blue-900">{whatsappContacts.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-2 rounded-lg">
                <CheckCircle className="text-green-600" size={20} />
              </div>
              <div>
                <p className="text-sm text-green-600">Ativos</p>
                <p className="text-xl font-bold text-green-900">
                  {whatsappContacts.filter(c => c.isActive).length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="bg-gray-100 p-2 rounded-lg">
                <XCircle className="text-gray-600" size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Inativos</p>
                <p className="text-xl font-bold text-gray-900">
                  {whatsappContacts.filter(c => !c.isActive).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contacts Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contacto</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Telefone</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Última Atividade</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {whatsappContacts.map((contact) => (
                <tr key={contact.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                        <User size={16} className="text-gray-600" />
                      </div>
                      <span className="font-medium text-gray-900">{contact.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">{contact.phone}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {contact.lastSeen ? formatLastSeen(contact.lastSeen) : 'Nunca'}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      contact.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {contact.isActive ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditContact(contact)}
                        className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded"
                        title="Editar"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteContact(contact.id)}
                        className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded"
                        title="Remover"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Configuration Options */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Settings className="text-purple-600" size={20} />
          Configurações Avançadas
        </h4>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Mensagens Automáticas</p>
              <p className="text-sm text-gray-600">Enviar mensagens automáticas para lembretes</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Confirmação de Leitura</p>
              <p className="text-sm text-gray-600">Solicitar confirmação de leitura das mensagens</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Backup de Conversas</p>
              <p className="text-sm text-gray-600">Fazer backup automático das conversas</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Perfil do Utilizador</h3>
        <p className="text-gray-600">Gerencie as informações do seu perfil</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <form className="space-y-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center">
              <User size={32} className="text-gray-600" />
            </div>
            <div>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Alterar Foto
              </button>
              <p className="text-sm text-gray-500 mt-1">JPG, GIF ou PNG. Máximo 1MB.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nome</label>
              <input
                type="text"
                defaultValue="João Silva"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                defaultValue="joao@techsolutions.mz"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Telefone</label>
              <input
                type="text"
                defaultValue="+258 84 123 4567"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Função</label>
              <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option>Administrador</option>
                <option>Gestor</option>
                <option>Utilizador</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Guardar Alterações
            </button>
            <button
              type="button"
              className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const renderNotifications = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Notificações</h3>
        <p className="text-gray-600">Configure como e quando receber notificações</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="space-y-6">
          <div>
            <h4 className="text-md font-semibold text-gray-900 mb-4">Notificações por Email</h4>
            <div className="space-y-4">
              {[
                { label: 'Novos clientes', description: 'Quando um novo cliente é registado' },
                { label: 'Serviços a expirar', description: 'Lembretes de serviços próximos do vencimento' },
                { label: 'Pagamentos recebidos', description: 'Confirmações de pagamentos' },
                { label: 'Relatórios semanais', description: 'Resumo semanal de atividades' }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{item.label}</p>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked={index < 2} />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'profile', label: 'Perfil', icon: User },
    { id: 'notifications', label: 'Notificações', icon: Bell },
    { id: 'whatsapp', label: 'WhatsApp Business', icon: MessageSquare },
    { id: 'whatsapp', label: 'WhatsApp Business', icon: MessageSquare },
    { id: 'whatsapp', label: 'WhatsApp Business', icon: MessageSquare },
    { id: 'security', label: 'Segurança', icon: Shield },
    { id: 'appearance', label: 'Aparência', icon: Palette },
    { id: 'integrations', label: 'Integrações', icon: Globe }
  ];

  return (
    <div className="space-y-6">
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
      {activeTab === 'profile' && renderProfile()}
      {activeTab === 'notifications' && renderNotifications()}
      {activeTab === 'whatsapp' && renderWhatsAppBusiness()}
      {activeTab === 'security' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <p className="text-gray-600">Configurações de segurança em desenvolvimento...</p>
        </div>
      )}
      {activeTab === 'appearance' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <p className="text-gray-600">Configurações de aparência em desenvolvimento...</p>
        </div>
      )}
      {activeTab === 'integrations' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <p className="text-gray-600">Configurações de integrações em desenvolvimento...</p>
        </div>
      )}

      {/* Add/Edit Contact Modal */}
      {showAddContactModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {editingContact ? 'Editar Contacto' : 'Adicionar Contacto'}
            </h3>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const contactData = {
                name: formData.get('name') as string,
                phone: formData.get('phone') as string,
              };
              handleSaveContact(contactData);
            }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome
                </label>
                <input
                  type="text"
                  name="name"
                  defaultValue={editingContact?.name || ''}
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
                  defaultValue={editingContact?.phone || '+258'}
                  placeholder="+258841234567"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddContactModal(false);
                    setEditingContact(null);
                  }}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingContact ? 'Atualizar' : 'Adicionar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};