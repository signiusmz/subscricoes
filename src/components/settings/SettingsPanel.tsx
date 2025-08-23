import React, { useState } from 'react';
import { Save, Building, User, Bell, CreditCard, Shield, Smartphone, Mail, MessageSquare, Key, Globe, Edit, Users, Plus, Trash2, UserCheck, UserX, Phone, Eye, Download } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

// Mock users data
const mockUsers = [
  {
    id: '1',
    name: 'João Silva',
    email: 'joao@techsolutions.mz',
    phone: '+258 84 123 4567',
    role: 'admin',
    isActive: true,
    createdAt: '2024-01-15',
    lastLogin: '2024-03-15T10:30:00Z'
  },
  {
    id: '2',
    name: 'Maria Santos',
    email: 'maria@techsolutions.mz',
    phone: '+258 85 987 6543',
    role: 'manager',
    isActive: true,
    createdAt: '2024-02-01',
    lastLogin: '2024-03-14T15:45:00Z'
  },
  {
    id: '3',
    name: 'Carlos Mendes',
    email: 'carlos@techsolutions.mz',
    phone: '+258 86 555 7777',
    role: 'user',
    isActive: false,
    createdAt: '2024-02-15',
    lastLogin: '2024-03-10T09:20:00Z'
  }
];

const roleLabels = {
  admin: 'Administrador',
  manager: 'Gestor',
  user: 'Utilizador'
};

export const SettingsPanel: React.FC = () => {
  const { user, company } = useAuth();
  const [activeTab, setActiveTab] = useState('company');
  const [isLoading, setIsLoading] = useState(false);
  const [isEditingCompany, setIsEditingCompany] = useState(false);
  const [isEditingUser, setIsEditingUser] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [editingUserData, setEditingUserData] = useState<any>(null);
  const [users, setUsers] = useState(mockUsers);
  const [companyLogo, setCompanyLogo] = useState<string | null>(null);

  const [companySettings, setCompanySettings] = useState({
    name: company?.name || '',
    email: company?.email || '',
    nuit: company?.nuit || '',
    address: company?.address || '',
    phone: '+258 84 123 4567',
    website: 'https://techsolutions.mz'
  });

  const [userSettings, setUserSettings] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '+258 84 987 6543',
    role: user?.role || 'admin'
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailReminders: true,
    smsReminders: false,
    whatsappReminders: true,
    npsRequests: true,
    systemAlerts: true,
    marketingEmails: false
  });

  const [integrationSettings, setIntegrationSettings] = useState({
    mpesaEnabled: false,
    mpesaApiKey: '',
    emailProvider: 'smtp',
    smtpHost: 'smtp.gmail.com',
    smtpPort: '587',
    smtpUser: '',
    smtpPassword: '',
    smsProvider: 'twilio',
    twilioSid: '',
    twilioToken: '',
    whatsappToken: ''
  });

  const handleSave = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    setIsEditingCompany(false);
    alert('Configurações salvas com sucesso!');
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        alert('O arquivo deve ter no máximo 2MB');
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        alert('Por favor, selecione apenas arquivos de imagem');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setCompanyLogo(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCancelEdit = () => {
    setIsEditingCompany(false);
    // Reset form to original values
    setCompanySettings({
      name: company?.name || '',
      email: company?.email || '',
      nuit: company?.nuit || '',
      address: company?.address || '',
      phone: '+258 84 123 4567',
      website: 'https://techsolutions.mz'
    });
  };

  const handleCancelUserEdit = () => {
    setIsEditingUser(false);
    // Reset form to original values
    setUserSettings({
      name: user?.name || '',
      email: user?.email || '',
      phone: '+258 84 987 6543',
      role: user?.role || 'admin'
    });
  };

  const handleAddUser = () => {
    setEditingUserData(null);
    setShowAddUserModal(true);
  };

  const handleEditUserInModal = (userData: any) => {
    setEditingUserData(userData);
    setShowAddUserModal(true);
  };

  const handleDeleteUser = (userId: string) => {
    if (userId === user?.id) {
      alert('Não pode eliminar o seu próprio utilizador!');
      return;
    }
    
    if (confirm('Tem certeza que deseja eliminar este utilizador?')) {
      setUsers(users.filter(u => u.id !== userId));
      alert('Utilizador eliminado com sucesso!');
    }
  };

  const handleToggleUserStatus = (userId: string) => {
    if (userId === user?.id) {
      alert('Não pode desativar o seu próprio utilizador!');
      return;
    }
    
    setUsers(users.map(u => 
      u.id === userId 
        ? { ...u, isActive: !u.isActive }
        : u
    ));
    alert('Status do utilizador atualizado!');
  };

  const handleSaveUserModal = (userData: any) => {
    if (editingUserData) {
      // Update existing user
      setUsers(users.map(u => 
        u.id === editingUserData.id 
          ? { ...u, ...userData }
          : u
      ));
      alert('Utilizador atualizado com sucesso!');
    } else {
      // Add new user
      const newUser = {
        id: Date.now().toString(),
        ...userData,
        isActive: true,
        createdAt: new Date().toISOString().split('T')[0],
        lastLogin: new Date().toISOString()
      };
      setUsers([...users, newUser]);
      alert('Utilizador adicionado com sucesso!');
    }
    setShowAddUserModal(false);
    setEditingUserData(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-PT');
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-PT');
  };

  const getStatusBadge = (isActive: boolean) => {
    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
        isActive
          ? 'bg-green-100 text-green-800'
          : 'bg-red-100 text-red-800'
      }`}>
        {isActive ? 'Ativo' : 'Inativo'}
      </span>
    );
  };

  const getRoleBadge = (role: string) => {
    const roleConfig = {
      admin: { bg: 'bg-purple-100', text: 'text-purple-800' },
      manager: { bg: 'bg-blue-100', text: 'text-blue-800' },
      user: { bg: 'bg-gray-100', text: 'text-gray-800' }
    };
    
    const config = roleConfig[role as keyof typeof roleConfig] || roleConfig.user;
    
    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${config.bg} ${config.text}`}>
        {roleLabels[role as keyof typeof roleLabels]}
      </span>
    );
  };

  const tabs = [
    { id: 'company', label: 'Empresa', icon: Building },
    { id: 'user', label: 'Utilizador', icon: User },
  ];

  const renderCompanySettings = () => (
    <div className="space-y-6">
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Informações da Empresa</h3>
          {!isEditingCompany ? (
            <button
              onClick={() => setIsEditingCompany(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Edit size={16} />
              Editar
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleCancelEdit}
                className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Save size={16} />
                )}
                {isLoading ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          )}
        </div>

        {/* Company Data - Only show when editing */}
        {isEditingCompany && (
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            {/* Logo Upload Section */}
            <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
              <h4 className="text-md font-medium text-gray-900 mb-3">Logotipo da Empresa</h4>
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-white">
                  {companyLogo ? (
                    <img 
                      src={companyLogo} 
                      alt="Logo da empresa" 
                      className="w-full h-full object-contain rounded-lg"
                    />
                  ) : (
                    <Building className="text-gray-400" size={32} />
                  )}
                </div>
                <div>
                  <input
                    type="file"
                    id="logo-upload"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                  <label
                    htmlFor="logo-upload"
                    className="inline-block px-4 py-2 rounded-lg border border-blue-300 text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors cursor-pointer"
                  >
                    {companyLogo ? 'Alterar Logo' : 'Carregar Logo'}
                  </label>
                  <p className="text-xs text-gray-500 mt-1">
                    PNG, JPG até 2MB. Recomendado: 200x200px
                  </p>
                  {companyLogo && (
                    <button
                      onClick={() => setCompanyLogo(null)}
                      className="text-red-600 text-xs hover:text-red-700 mt-1 block"
                    >
                      Remover logo
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nome da Empresa</label>
                <input
                  type="text"
                  value={companySettings.name}
                  onChange={(e) => setCompanySettings({...companySettings, name: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={companySettings.email}
                  onChange={(e) => setCompanySettings({...companySettings, email: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">NUIT</label>
                <input
                  type="text"
                  value={companySettings.nuit}
                  onChange={(e) => setCompanySettings({...companySettings, nuit: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Telefone</label>
                <input
                  type="text"
                  value={companySettings.phone}
                  onChange={(e) => setCompanySettings({...companySettings, phone: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Endereço</label>
                <input
                  type="text"
                  value={companySettings.address}
                  onChange={(e) => setCompanySettings({...companySettings, address: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                <input
                  type="url"
                  value={companySettings.website}
                  onChange={(e) => setCompanySettings({...companySettings, website: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Separator Line */}
      <div className="border-t border-gray-200"></div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Plano e Utilização</h3>
        
        {/* Current Plan Card */}
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 w-12 h-12 rounded-full flex items-center justify-center">
                <Building className="text-white" size={24} />
              </div>
              <div>
                <h4 className="text-xl font-bold text-blue-900 capitalize">Plano {company?.plan}</h4>
                <p className="text-blue-700 font-medium">{company?.planPrice} MT/mês</p>
              </div>
            </div>
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
              Ativo
            </span>
          </div>
          
          {/* Plan Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4 border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <Users className="text-blue-600" size={16} />
                <span className="text-sm font-medium text-gray-700">Clientes</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-gray-900">45</span>
                <span className="text-sm text-gray-500">
                  / {company?.plan === 'basic' ? '100' : company?.plan === 'professional' ? '500' : '∞'}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ 
                    width: company?.plan === 'basic' ? '45%' : 
                           company?.plan === 'professional' ? '9%' : '100%' 
                  }}
                ></div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <User className="text-blue-600" size={16} />
                <span className="text-sm font-medium text-gray-700">Utilizadores</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-gray-900">3</span>
                <span className="text-sm text-gray-500">
                  / {company?.plan === 'basic' ? '1' : company?.plan === 'professional' ? '5' : '∞'}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ 
                    width: company?.plan === 'basic' ? '100%' : 
                           company?.plan === 'professional' ? '60%' : '100%' 
                  }}
                ></div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <Mail className="text-blue-600" size={16} />
                <span className="text-sm font-medium text-gray-700">Emails/Mês</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-gray-900">1,247</span>
                <span className="text-sm text-gray-500">
                  / {company?.plan === 'basic' ? '1,000' : company?.plan === 'professional' ? '5,000' : '∞'}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-orange-500 h-2 rounded-full" 
                  style={{ 
                    width: company?.plan === 'basic' ? '100%' : 
                           company?.plan === 'professional' ? '25%' : '100%' 
                  }}
                ></div>
              </div>
            </div>
          </div>
          
          {/* Plan Features */}
          <div className="mb-6">
            <h5 className="font-semibold text-gray-900 mb-3">Funcionalidades Incluídas</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {(() => {
                const features = {
                  basic: [
                    'Gestão de até 100 clientes',
                    'Suporte por email',
                    '1 utilizador',
                    'Relatórios básicos',
                    '1,000 emails/mês'
                  ],
                  professional: [
                    'Gestão de até 500 clientes',
                    'Suporte prioritário',
                    'Até 5 utilizadores',
                    'Relatórios avançados',
                    '5,000 emails/mês',
                    'Integrações básicas',
                    'Automações de fluxo'
                  ],
                  enterprise: [
                    'Clientes ilimitados',
                    'Suporte 24/7',
                    'Utilizadores ilimitados',
                    'Relatórios personalizados',
                    'Emails ilimitados',
                    'Todas as integrações',
                    'Automações avançadas',
                    'API personalizada'
                  ]
                };
                
                return features[company?.plan as keyof typeof features]?.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-gray-700">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    {feature}
                  </div>
                ));
              })()}
            </div>
          </div>
          
          {/* Upgrade Section */}
          {company?.plan !== 'enterprise' && (
            <div className="border-t border-blue-200 pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="font-semibold text-gray-900">
                    Upgrade para {company?.plan === 'basic' ? 'Profissional' : 'Empresarial'}
                  </h5>
                  <p className="text-sm text-gray-600">
                    {company?.plan === 'basic' 
                      ? 'Mais clientes, utilizadores e funcionalidades avançadas'
                      : 'Recursos ilimitados e suporte premium'
                    }
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-green-600">
                    {company?.plan === 'basic' ? '1,500' : '3,500'} MT/mês
                  </p>
                  <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium">
                    Fazer Upgrade
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Billing History */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-semibold text-gray-900">Histórico de Pagamentos</h4>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              Ver todos
            </button>
          </div>
          <div className="space-y-3">
            {[
              { date: '01/12/2024', amount: company?.planPrice, status: 'Pago', method: 'M-Pesa' },
              { date: '01/11/2024', amount: company?.planPrice, status: 'Pago', method: 'Transferência' },
              { date: '01/10/2024', amount: company?.planPrice, status: 'Pago', method: 'M-Pesa' }
            ].map((payment, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{payment.date}</p>
                    <p className="text-xs text-gray-500">{payment.method}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{payment.amount} MT</p>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">
                    {payment.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderUserSettings = () => (
    <div className="space-y-6">
      {/* Current User Settings */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Informações do Utilizador</h3>
        {/* My Profile Section */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Meu Perfil</h3>
            {!isEditingUser ? (
              <button
                onClick={() => setIsEditingUser(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Edit size={16} />
                Editar
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleCancelUserEdit}
                  className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    setIsEditingUser(false);
                    alert('Perfil atualizado com sucesso!');
                  }}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  <Save size={16} />
                  Salvar
                </button>
              </div>
            )}
          </div>

          {/* User Data - Only show when editing */}
          {isEditingUser && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nome</label>
                <input
                  type="text"
                  value={userSettings.name}
                  onChange={(e) => setUserSettings({...userSettings, name: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={userSettings.email}
                  onChange={(e) => setUserSettings({...userSettings, email: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Telefone</label>
                <input
                  type="text"
                  value={userSettings.phone}
                  onChange={(e) => setUserSettings({...userSettings, phone: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Função</label>
                <select
                  value={userSettings.role}
                  onChange={(e) => setUserSettings({...userSettings, role: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="admin">Administrador</option>
                  <option value="manager">Gestor</option>
                  <option value="user">Utilizador</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Separator Line */}
        <div className="border-t border-gray-200"></div>

        {/* Users Management Section */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Gestão de Utilizadores</h3>
              <p className="text-gray-600 text-sm mt-1">Gerir utilizadores e permissões do sistema</p>
            </div>
            <button 
              onClick={handleAddUser}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus size={20} />
              Novo Utilizador
            </button>
          </div>

          {/* Users Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Users className="text-blue-600" size={20} />
                </div>
                <div>
                  <p className="text-sm text-blue-600">Total</p>
                  <p className="text-xl font-bold text-blue-900">{users.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <UserCheck className="text-green-600" size={20} />
                </div>
                <div>
                  <p className="text-sm text-green-600">Ativos</p>
                  <p className="text-xl font-bold text-green-900">
                    {users.filter(u => u.isActive).length}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="bg-red-100 p-2 rounded-lg">
                  <UserX className="text-red-600" size={20} />
                </div>
                <div>
                  <p className="text-sm text-red-600">Inativos</p>
                  <p className="text-xl font-bold text-red-900">
                    {users.filter(u => !u.isActive).length}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <Shield className="text-purple-600" size={20} />
                </div>
                <div>
                  <p className="text-sm text-purple-600">Admins</p>
                  <p className="text-xl font-bold text-purple-900">
                    {users.filter(u => u.role === 'admin').length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Users Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Utilizador
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contacto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Função
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Último Login
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((userData) => (
                  <tr key={userData.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="bg-gray-400 w-10 h-10 rounded-full flex items-center justify-center">
                          <User size={20} className="text-white" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{userData.name}</div>
                          <div className="text-sm text-gray-500">
                            Criado em {formatDate(userData.createdAt)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm space-y-1">
                        <div className="flex items-center gap-2 text-gray-900">
                          <Mail size={12} />
                          {userData.email}
                        </div>
                        <div className="flex items-center gap-2 text-gray-500">
                          <Phone size={12} />
                          {userData.phone}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getRoleBadge(userData.role)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(userData.isActive)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatDateTime(userData.lastLogin)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleEditUserInModal(userData)}
                          className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded"
                          title="Editar"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => handleToggleUserStatus(userData.id)}
                          className="text-orange-600 hover:text-orange-900 p-1 hover:bg-orange-50 rounded"
                          title={userData.isActive ? "Desativar" : "Ativar"}
                        >
                          {userData.isActive ? <UserX size={16} /> : <UserCheck size={16} />}
                        </button>
                        <button 
                          onClick={() => handleDeleteUser(userData.id)}
                          className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded"
                          title="Eliminar"
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

        {/* Add/Edit User Modal */}
        {showAddUserModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {editingUserData ? 'Editar Utilizador' : 'Novo Utilizador'}
              </h3>
              
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const userData = {
                  name: formData.get('name') as string,
                  email: formData.get('email') as string,
                  phone: formData.get('phone') as string,
                  role: formData.get('role') as string,
                };
                handleSaveUserModal(userData);
              }} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nome Completo
                    </label>
                    <input
                      type="text"
                      name="name"
                      defaultValue={editingUserData?.name || ''}
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
                      defaultValue={editingUserData?.email || ''}
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
                      defaultValue={editingUserData?.phone || '+258 '}
                      placeholder="+258 84 123 4567"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Função
                    </label>
                    <select
                      name="role"
                      defaultValue={editingUserData?.role || 'user'}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="user">Utilizador</option>
                      <option value="manager">Gestor</option>
                      <option value="admin">Administrador</option>
                    </select>
                  </div>
                </div>

                {!editingUserData && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Palavra-passe Temporária
                    </label>
                    <input
                      type="password"
                      name="password"
                      placeholder="Será enviada por email"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                )}
                
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddUserModal(false);
                      setEditingUserData(null);
                    }}
                    className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {editingUserData ? 'Atualizar' : 'Adicionar'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Preferências de Notificação</h3>
        <div className="space-y-4">
          {[
            { key: 'emailReminders', label: 'Lembretes por Email', icon: Mail },
            { key: 'smsReminders', label: 'Lembretes por SMS', icon: Smartphone },
            { key: 'whatsappReminders', label: 'Lembretes por WhatsApp', icon: MessageSquare },
            { key: 'npsRequests', label: 'Solicitações de NPS', icon: Bell },
            { key: 'systemAlerts', label: 'Alertas do Sistema', icon: Shield },
            { key: 'marketingEmails', label: 'Emails de Marketing', icon: Mail }
          ].map((setting) => {
            const Icon = setting.icon;
            return (
              <div key={setting.key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <Icon className="text-gray-600" size={20} />
                  <span className="font-medium text-gray-900">{setting.label}</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notificationSettings[setting.key as keyof typeof notificationSettings]}
                    onChange={(e) => setNotificationSettings({
                      ...notificationSettings,
                      [setting.key]: e.target.checked
                    })}
                    className="sr-only peer"
                    placeholder="+258 84 123 4567"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderIntegrationSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">M-Pesa Integration</h3>
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <CreditCard className="text-green-600" size={24} />
              <div>
                <h4 className="font-semibold text-green-900">M-Pesa Payments</h4>
                <p className="text-green-700 text-sm">Aceitar pagamentos via M-Pesa</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={integrationSettings.mpesaEnabled}
                onChange={(e) => setIntegrationSettings({
                  ...integrationSettings,
                  mpesaEnabled: e.target.checked
                })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
            </label>
          </div>
          {integrationSettings.mpesaEnabled && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">API Key</label>
              <input
                type="password"
                value={integrationSettings.mpesaApiKey}
                onChange={(e) => setIntegrationSettings({
                  ...integrationSettings,
                  mpesaApiKey: e.target.value
                })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Insira sua API Key do M-Pesa"
              />
            </div>
          )}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Configurações de Email</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Servidor SMTP</label>
            <input
              type="text"
              value={integrationSettings.smtpHost}
              onChange={(e) => setIntegrationSettings({
                ...integrationSettings,
                smtpHost: e.target.value
              })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Porta</label>
            <input
              type="text"
              value={integrationSettings.smtpPort}
              onChange={(e) => setIntegrationSettings({
                ...integrationSettings,
                smtpPort: e.target.value
              })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Utilizador</label>
            <input
              type="text"
              value={integrationSettings.smtpUser}
              onChange={(e) => setIntegrationSettings({
                ...integrationSettings,
                smtpUser: e.target.value
              })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Palavra-passe</label>
            <input
              type="password"
              value={integrationSettings.smtpPassword}
              onChange={(e) => setIntegrationSettings({
                ...integrationSettings,
                smtpPassword: e.target.value
              })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Configurações de SMS/WhatsApp</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Twilio SID</label>
            <input
              type="text"
              value={integrationSettings.twilioSid}
              onChange={(e) => setIntegrationSettings({
                ...integrationSettings,
                twilioSid: e.target.value
              })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Twilio Token</label>
            <input
              type="password"
              value={integrationSettings.twilioToken}
              onChange={(e) => setIntegrationSettings({
                ...integrationSettings,
                twilioToken: e.target.value
              })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">WhatsApp Token</label>
            <input
              type="password"
              value={integrationSettings.whatsappToken}
              onChange={(e) => setIntegrationSettings({
                ...integrationSettings,
                whatsappToken: e.target.value
              })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Configurações de Segurança</h3>
        <div className="space-y-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Key className="text-yellow-600" size={24} />
              <div>
                <h4 className="font-semibold text-yellow-900">Autenticação de Dois Fatores</h4>
                <p className="text-yellow-700 text-sm">Adicione uma camada extra de segurança</p>
              </div>
            </div>
            <button className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors">
              Ativar 2FA
            </button>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="text-red-600" size={24} />
              <div>
                <h4 className="font-semibold text-red-900">Sessões Ativas</h4>
                <p className="text-red-700 text-sm">Gerir dispositivos conectados</p>
              </div>
            </div>
            <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
              Ver Sessões
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'company':
        return renderCompanySettings();
      case 'user':
        return renderUserSettings();
      default:
        return renderCompanySettings();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Configurações</h2>
          <p className="text-gray-600 mt-1">Gerir configurações da empresa e integrações</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-64">
          <nav className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};