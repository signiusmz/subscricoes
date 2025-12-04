import React, { useState } from 'react';
import {
  Settings,
  Building,
  Save,
  Crown,
  Users,
  CheckCircle,
  ArrowRight,
  TrendingUp,
  Shield,
  Zap,
  BarChart3,
  Smartphone,
  Globe,
  MapPin,
  Mail,
  Phone,
  FileText,
  Calendar,
  Star,
  Award,
  Upload,
  Calculator,
  User
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { TaxManagement } from '../billing/TaxManagement';
import { UsersTable } from '../users/UsersTable';

interface CompanySettings {
  name: string;
  email: string;
  phone: string;
  address: string;
  nuit: string;
  website?: string;
  timezone: string;
  currency: string;
}

const plans = [
  {
    id: 'basic',
    name: 'Básico',
    price: 750,
    originalPrice: 1000,
    discount: '25% OFF',
    description: 'Ideal para pequenas empresas',
    maxClients: 100,
    maxUsers: 1,
    features: [
      'Até 100 clientes',
      'Gestão básica de serviços',
      'Notificações por email',
      '1 utilizador',
      'Suporte por email',
      'Relatórios básicos'
    ],
    icon: Users,
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-600'
  },
  {
    id: 'professional',
    name: 'Profissional',
    price: 1500,
    originalPrice: 2000,
    discount: '25% OFF',
    description: 'Para empresas em crescimento',
    maxClients: 500,
    maxUsers: 5,
    popular: true,
    features: [
      'Até 500 clientes',
      'Gestão avançada de serviços',
      'Notificações por email e WhatsApp',
      '5 utilizadores',
      'Suporte prioritário',
      'Relatórios detalhados',
      'Fluxos personalizados',
      'Portal do cliente'
    ],
    icon: BarChart3,
    color: 'from-green-500 to-green-600',
    bgColor: 'bg-green-50',
    textColor: 'text-green-600'
  },
  {
    id: 'enterprise',
    name: 'Empresarial',
    price: 3500,
    originalPrice: 4500,
    discount: '22% OFF',
    description: 'Para grandes empresas',
    maxClients: 'unlimited',
    maxUsers: 'unlimited',
    features: [
      'Clientes ilimitados',
      'Todas as funcionalidades',
      'Notificações multi-canal',
      'Utilizadores ilimitados',
      'Suporte 24/7',
      'Relatórios avançados',
      'API completa',
      'Pagamento com cartão',
      'Gestor dedicado',
      'Backup automático',
      'SLA garantido'
    ],
    icon: Crown,
    color: 'from-purple-500 to-purple-600',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-600'
  }
];

export const SettingsPanel: React.FC = () => {
  const { user, company, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'company' | 'taxes' | 'users'>('company');
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showCompanyEdit, setShowCompanyEdit] = useState(false);
  const [companyLogo, setCompanyLogo] = useState<string | null>(null);
  
  const [companySettings, setCompanySettings] = useState<CompanySettings>({
    name: company?.name || '',
    email: company?.email || '',
    phone: '+258 21 000 000',
    address: company?.address || '',
    nuit: company?.nuit || '',
    website: 'https://suaempresa.mz',
    timezone: 'Africa/Maputo',
    currency: 'MZN'
  });

  const currentPlan = plans.find(p => p.id === company?.plan) || plans[0];
  const nextPlan = plans.find(p => p.price > currentPlan.price);
  
  // Mock usage data
  const usageData = {
    clients: 0,
    users: 1,
    storage: 0.1, // GB
    apiCalls: 0
  };

  const getUsagePercentage = (current: number, max: number | string) => {
    if (max === 'unlimited') return 0;
    return Math.min((current / (max as number)) * 100, 100);
  };

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return 'text-red-600 bg-red-100';
    if (percentage >= 70) return 'text-orange-600 bg-orange-100';
    return 'text-green-600 bg-green-100';
  };

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
    setShowCompanyEdit(false);
    alert('Configurações da empresa atualizadas com sucesso!');
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert('A imagem deve ter no máximo 5MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setCompanyLogo(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setCompanyLogo(null);
  };

  const handleUpgradeSuccess = (planId: string, transactionId: string) => {
    // Update company plan in context
    if (company) {
      const updatedCompany = {
        ...company,
        plan: planId as 'basic' | 'professional' | 'enterprise',
        planPrice: planId === 'basic' ? 750 : planId === 'professional' ? 1500 : 3500,
        isTrialActive: false,
        trialEndDate: undefined
      };
      
      // Update localStorage
      localStorage.setItem('company', JSON.stringify(updatedCompany));
      
      // Force page reload to update context
      window.location.reload();
    }
    
    setShowUpgradeModal(false);
    alert(`Plano atualizado para ${planId} com sucesso! ID da transação: ${transactionId}`);
  };

  const tabs = [
    { id: 'company', label: 'Empresa', icon: Building },
    { id: 'taxes', label: 'Impostos', icon: Calculator },
    { id: 'users', label: 'Utilizadores', icon: User }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Configurações</h2>
        <p className="text-gray-600">Gerir informações da empresa e configurações do sistema</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex gap-2 p-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon size={18} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'taxes' && (
        <TaxManagement />
      )}

      {activeTab === 'users' && (
        <UsersTable />
      )}

      {activeTab === 'company' && (
        <>
      {/* Company Settings Content */}

      {/* Current Plan Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className={`bg-gradient-to-r ${currentPlan.color} p-6 text-white`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <currentPlan.icon size={32} className="text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">Plano {currentPlan.name}</h3>
                <p className="text-white text-opacity-90">{currentPlan.description}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-3xl font-bold">{currentPlan.price.toLocaleString()} MT</span>
                  <span className="text-white text-opacity-75">/mês</span>
                  {currentPlan.originalPrice && (
                    <span className="text-sm line-through text-white text-opacity-60 ml-2">
                      {currentPlan.originalPrice.toLocaleString()} MT
                    </span>
                  )}
                </div>
              </div>
            </div>
            {company?.isTrialActive && (
              <div className="text-center">
                <div className="bg-white bg-opacity-20 rounded-lg p-3">
                  <p className="text-sm text-white text-opacity-90">Trial Ativo</p>
                  <p className="text-2xl font-bold">
                    {company.trialEndDate ? 
                      Math.max(0, Math.ceil((new Date(company.trialEndDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))) 
                      : 0
                    } dias
                  </p>
                  <p className="text-xs text-white text-opacity-75">restantes</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Usage Statistics */}
        <div className="p-6 border-b border-gray-200">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Uso Atual</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Clients Usage */}
            <div className="text-center">
              <div className="relative w-20 h-20 mx-auto mb-3">
                <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="3"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="3"
                    strokeDasharray={`${getUsagePercentage(usageData.clients, currentPlan.maxClients)}, 100`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-bold text-gray-900">
                    {Math.round(getUsagePercentage(usageData.clients, currentPlan.maxClients))}%
                  </span>
                </div>
              </div>
              <p className="text-sm font-medium text-gray-900">Clientes</p>
              <p className="text-xs text-gray-500">
                {usageData.clients} / {currentPlan.maxClients === 'unlimited' ? '∞' : currentPlan.maxClients}
              </p>
            </div>

            {/* Users Usage */}
            <div className="text-center">
              <div className="relative w-20 h-20 mx-auto mb-3">
                <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="3"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="3"
                    strokeDasharray={`${getUsagePercentage(usageData.users, currentPlan.maxUsers)}, 100`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-bold text-gray-900">
                    {Math.round(getUsagePercentage(usageData.users, currentPlan.maxUsers))}%
                  </span>
                </div>
              </div>
              <p className="text-sm font-medium text-gray-900">Utilizadores</p>
              <p className="text-xs text-gray-500">
                {usageData.users} / {currentPlan.maxUsers === 'unlimited' ? '∞' : currentPlan.maxUsers}
              </p>
            </div>

            {/* Storage Usage */}
            <div className="text-center">
              <div className="relative w-20 h-20 mx-auto mb-3">
                <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="3"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="3"
                    strokeDasharray="23, 100"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-bold text-gray-900">23%</span>
                </div>
              </div>
              <p className="text-sm font-medium text-gray-900">Armazenamento</p>
              <p className="text-xs text-gray-500">{usageData.storage} GB / 10 GB</p>
            </div>

            {/* API Calls */}
            <div className="text-center">
              <div className="relative w-20 h-20 mx-auto mb-3">
                <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="3"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#8b5cf6"
                    strokeWidth="3"
                    strokeDasharray="12.5, 100"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-bold text-gray-900">13%</span>
                </div>
              </div>
              <p className="text-sm font-medium text-gray-900">API Calls</p>
              <p className="text-xs text-gray-500">{usageData.apiCalls.toLocaleString()} / 10K</p>
            </div>
          </div>
        </div>

        {/* Plan Features */}
        <div className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Funcionalidades do Seu Plano</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {currentPlan.features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2">
                <CheckCircle className="text-green-500 flex-shrink-0" size={16} />
                <span className="text-sm text-gray-700">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Upgrade Section */}
      {nextPlan && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border-2 border-blue-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <TrendingUp className="text-white" size={32} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Pronto para Crescer?</h3>
                <p className="text-gray-600">Desbloqueie mais funcionalidades com o plano {nextPlan.name}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold mb-2">
                {nextPlan.discount}
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {nextPlan.price.toLocaleString()} MT
                <span className="text-sm text-gray-500 font-normal">/mês</span>
              </div>
              {nextPlan.originalPrice && (
                <div className="text-sm text-gray-500 line-through">
                  {nextPlan.originalPrice.toLocaleString()} MT/mês
                </div>
              )}
            </div>
          </div>

          {/* Benefits Comparison */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Award className="text-blue-600" size={18} />
                Benefícios Adicionais
              </h4>
              <div className="space-y-2">
                {nextPlan.features.filter(f => !currentPlan.features.includes(f)).map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-700 font-medium">{feature}</span>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">NOVO</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <BarChart3 className="text-purple-600" size={18} />
                Limites Aumentados
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-gray-200">
                  <span className="text-sm text-gray-700">Clientes</span>
                  <div className="text-right">
                    <span className="text-sm text-gray-500">{currentPlan.maxClients} →</span>
                    <span className="text-sm font-bold text-green-600 ml-1">
                      {nextPlan.maxClients === 'unlimited' ? '∞' : nextPlan.maxClients}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-gray-200">
                  <span className="text-sm text-gray-700">Utilizadores</span>
                  <div className="text-right">
                    <span className="text-sm text-gray-500">{currentPlan.maxUsers} →</span>
                    <span className="text-sm font-bold text-green-600 ml-1">
                      {nextPlan.maxUsers === 'unlimited' ? '∞' : nextPlan.maxUsers}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-gray-200">
                  <span className="text-sm text-gray-700">Armazenamento</span>
                  <div className="text-right">
                    <span className="text-sm text-gray-500">10 GB →</span>
                    <span className="text-sm font-bold text-green-600 ml-1">100 GB</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <button
              onClick={() => setShowUpgradeModal(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all flex items-center gap-3 shadow-lg"
            >
              <Crown size={20} />
              Fazer Upgrade para {nextPlan.name}
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Company Information */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Building className="text-blue-600" size={24} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Informações da Empresa</h3>
              <p className="text-gray-600">Dados principais da sua organização</p>
            </div>
          </div>
          <button
            onClick={() => setShowCompanyEdit(!showCompanyEdit)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Settings size={16} />
            {showCompanyEdit ? 'Cancelar' : 'Editar'}
          </button>
        </div>

        {!showCompanyEdit ? (
          /* Company Info Display */
          <div className="space-y-6">
            {/* Logo Section */}
            <div className="flex items-center gap-6 p-6 bg-gray-50 rounded-lg">
              <div className="w-24 h-24 bg-white rounded-lg border-2 border-gray-200 flex items-center justify-center overflow-hidden">
                {companyLogo ? (
                  <img 
                    src={companyLogo} 
                    alt="Logo da Empresa" 
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <Building className="text-gray-400" size={32} />
                )}
              </div>
              <div>
                <h4 className="text-xl font-bold text-gray-900">{companySettings.name}</h4>
                <p className="text-gray-600">{companySettings.email}</p>
                <p className="text-sm text-gray-500">NUIT: {companySettings.nuit}</p>
              </div>
            </div>

            {/* Company Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <Phone className="text-gray-400" size={20} />
                  <div>
                    <p className="text-sm text-gray-600">Telefone</p>
                    <p className="font-medium text-gray-900">{companySettings.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <Globe className="text-gray-400" size={20} />
                  <div>
                    <p className="text-sm text-gray-600">Website</p>
                    <p className="font-medium text-gray-900">{companySettings.website || 'Não definido'}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <MapPin className="text-gray-400" size={20} />
                  <div>
                    <p className="text-sm text-gray-600">Endereço</p>
                    <p className="font-medium text-gray-900">{companySettings.address}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <Calendar className="text-gray-400" size={20} />
                  <div>
                    <p className="text-sm text-gray-600">Fuso Horário</p>
                    <p className="font-medium text-gray-900">
                      {companySettings.timezone === 'Africa/Maputo' ? 'África/Maputo (CAT)' : 
                       companySettings.timezone === 'UTC' ? 'UTC' : 'Europa/Lisboa'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Company Edit Form */
          <form onSubmit={handleSaveCompany} className="space-y-6">
            {/* Logo Upload Section */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Building size={18} className="text-blue-600" />
                Logotipo da Empresa
              </h4>
              <div className="flex items-center gap-6">
                <div className="w-32 h-32 bg-white rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
                  {companyLogo ? (
                    <img 
                      src={companyLogo} 
                      alt="Logo Preview" 
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="text-center">
                      <Building className="text-gray-400 mx-auto mb-2" size={32} />
                      <p className="text-xs text-gray-500">Logo da Empresa</p>
                    </div>
                  )}
                </div>
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <label className="bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-700 transition-colors flex items-center gap-2">
                      <Upload size={16} />
                      Carregar Logo
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                      />
                    </label>
                    {companyLogo && (
                      <button
                        type="button"
                        onClick={removeLogo}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                      >
                        Remover
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">
                    Formatos aceites: JPG, PNG, GIF (máx. 5MB)<br />
                    Recomendado: 200x200px ou proporção quadrada
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Building size={16} className="text-gray-400" />
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
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Mail size={16} className="text-gray-400" />
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
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Phone size={16} className="text-gray-400" />
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
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <FileText size={16} className="text-gray-400" />
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
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <MapPin size={16} className="text-gray-400" />
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
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Globe size={16} className="text-gray-400" />
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
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Calendar size={16} className="text-gray-400" />
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
            
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setShowCompanyEdit(false)}
                className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-semibold"
              >
                <Save size={16} />
                Salvar Alterações
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Plan History */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Calendar className="text-gray-600" size={20} />
          Histórico do Plano
        </h3>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="text-green-600" size={20} />
              </div>
              <div>
                <p className="font-medium text-green-900">Plano {currentPlan.name} Ativo</p>
                <p className="text-sm text-green-700">
                  {company?.isTrialActive ? 'Trial ativo' : 'Subscrição paga'} • 
                  Desde {company?.createdAt ? new Date(company.createdAt).toLocaleDateString('pt-PT') : 'N/A'}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-green-900">{currentPlan.price.toLocaleString()} MT</p>
              <p className="text-sm text-green-700">por mês</p>
            </div>
          </div>
          
          {company?.isTrialActive && (
            <div className="flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Star className="text-yellow-600" size={20} />
                </div>
                <div>
                  <p className="font-medium text-yellow-900">Trial Gratuito</p>
                  <p className="text-sm text-yellow-700">
                    Expira em {company.trialEndDate ? 
                      Math.max(0, Math.ceil((new Date(company.trialEndDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))) 
                      : 0
                    } dias
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-yellow-900">0 MT</p>
                <p className="text-sm text-yellow-700">grátis</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-t-2xl relative">
              <button
                onClick={() => setShowUpgradeModal(false)}
                className="absolute top-4 right-4 text-white hover:text-gray-200 p-2"
              >
                ×
              </button>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Crown size={32} className="text-white" />
                </div>
                <h2 className="text-3xl font-bold mb-2">Escolha o Plano Ideal</h2>
                <p className="text-blue-100 text-lg">
                  Desbloqueie todo o potencial do Signius com recursos avançados
                </p>
              </div>
            </div>

            {/* Trial Benefits */}
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 m-6">
              <div className="flex items-center gap-3 mb-3">
                <Zap className="text-yellow-600" size={24} />
                <h3 className="text-lg font-semibold text-yellow-800">Oferta Especial de Upgrade!</h3>
              </div>
              <div className="grid md:grid-cols-3 gap-4 text-sm text-yellow-700">
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-yellow-600" />
                  <span>Desconto especial para clientes trial</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-yellow-600" />
                  <span>Sem compromisso de permanência</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-yellow-600" />
                  <span>Suporte completo incluído</span>
                </div>
              </div>
            </div>

            {/* Plans Grid */}
            <div className="p-6">
              <div className="grid md:grid-cols-3 gap-6">
                {plans.map((plan) => {
                  const Icon = plan.icon;
                  const isCurrentPlan = company?.plan === plan.id;
                  
                  return (
                    <div
                      key={plan.id}
                      className={`relative border-2 rounded-xl p-6 transition-all hover:shadow-lg ${
                        plan.popular 
                          ? 'border-green-500 shadow-lg scale-105' 
                          : 'border-gray-200 hover:border-blue-300'
                      } ${isCurrentPlan ? 'opacity-50' : ''}`}
                    >
                      {plan.popular && (
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                          <span className="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                            Mais Popular
                          </span>
                        </div>
                      )}
                      
                      {plan.discount && (
                        <div className="absolute -top-2 -right-2">
                          <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                            {plan.discount}
                          </span>
                        </div>
                      )}

                      <div className="text-center mb-6">
                        <div className={`w-16 h-16 ${plan.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}>
                          <Icon size={32} className={plan.textColor} />
                        </div>
                        
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                        <p className="text-gray-600 text-sm mb-4">{plan.description}</p>
                        
                        <div className="mb-4">
                          {plan.originalPrice && (
                            <div className="text-sm text-gray-500 line-through mb-1">
                              {plan.originalPrice.toLocaleString()} MT/mês
                            </div>
                          )}
                          <div className="text-4xl font-bold text-gray-900">
                            {plan.price.toLocaleString()}
                            <span className="text-lg text-gray-500 font-normal"> MT/mês</span>
                          </div>
                        </div>
                      </div>

                      <ul className="space-y-3 mb-8">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-center gap-3">
                            <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
                            <span className="text-sm text-gray-700">{feature}</span>
                          </li>
                        ))}
                      </ul>

                      <button
                        onClick={() => {
                          if (!isCurrentPlan) {
                            handleUpgradeSuccess(plan.id, `DEMO_${Date.now()}`);
                          }
                        }}
                        disabled={isCurrentPlan}
                        className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
                          isCurrentPlan
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : plan.popular
                            ? 'bg-green-600 text-white hover:bg-green-700'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                      >
                        {isCurrentPlan ? 'Plano Atual' : 'Escolher Plano'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Security & Support */}
            <div className="bg-gray-50 p-6 rounded-b-2xl">
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div className="flex flex-col items-center gap-2">
                  <Shield className="text-green-600" size={24} />
                  <h4 className="font-semibold text-gray-900">Seguro & Confiável</h4>
                  <p className="text-sm text-gray-600">Dados protegidos com criptografia</p>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <CreditCard className="text-blue-600" size={24} />
                  <h4 className="font-semibold text-gray-900">Visa/MasterCard</h4>
                  <p className="text-sm text-gray-600">Pagamento seguro com cartão</p>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <Users className="text-purple-600" size={24} />
                  <h4 className="font-semibold text-gray-900">Suporte Dedicado</h4>
                  <p className="text-sm text-gray-600">Equipe pronta para ajudar</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
        </>
      )}
    </div>
  );
};