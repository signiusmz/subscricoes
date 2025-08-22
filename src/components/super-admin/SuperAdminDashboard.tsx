import React, { useState } from 'react';
import { Building, Users, CreditCard, TrendingUp, Plus, Edit, Trash2, Eye, Search, Filter, Settings, Shield, UserCheck, UserX, Mail, Phone, Calendar, Activity, BarChart3, AlertTriangle, CheckCircle, Clock, DollarSign } from 'lucide-react';
import { LogOut, User } from 'lucide-react';
import { Company, Plan, CompanySubscription } from '../../types';
import { useAuth } from '../../context/AuthContext';

const mockPlans: Plan[] = [
  {
    id: '1',
    name: 'Básico',
    price: 750,
    features: ['Até 100 clientes', 'Suporte por email', '1 utilizador'],
    maxClients: 100,
    maxUsers: 1,
    isActive: true
  },
  {
    id: '2',
    name: 'Profissional',
    price: 1500,
    features: ['Até 500 clientes', 'Suporte prioritário', '5 utilizadores'],
    maxClients: 500,
    maxUsers: 5,
    isActive: true
  },
  {
    id: '3',
    name: 'Empresarial',
    price: 3500,
    features: ['Clientes ilimitados', 'Suporte 24/7', 'Utilizadores ilimitados'],
    maxClients: -1,
    maxUsers: -1,
    isActive: true
  }
];

const mockCompanies: Company[] = [
  {
    id: '1',
    name: 'TechSolutions Lda',
    email: 'admin@techsolutions.mz',
    nuit: '400123456',
    address: 'Av. Julius Nyerere, 123, Maputo',
    plan: 'professional',
    planPrice: 1500,
    createdAt: '2024-01-15T00:00:00Z',
    isActive: true
  },
  {
    id: '2',
    name: 'Consultoria Maputo SA',
    email: 'info@consultoriamaputo.mz',
    nuit: '400987654',
    address: 'Rua da Paz, 456, Maputo',
    plan: 'basic',
    planPrice: 750,
    createdAt: '2024-02-01T00:00:00Z',
    isActive: true
  },
  {
    id: '3',
    name: 'Empresa Beira Lda',
    email: 'admin@empresabeira.mz',
    nuit: '400555666',
    address: 'Av. Eduardo Mondlane, 789, Beira',
    plan: 'enterprise',
    planPrice: 3500,
    createdAt: '2024-01-20T00:00:00Z',
    isActive: false
  }
];

const mockSubscriptions: CompanySubscription[] = [
  {
    id: '1',
    companyId: '1',
    planId: '2',
    status: 'active',
    startDate: '2024-01-15T00:00:00Z',
    endDate: '2024-12-15T00:00:00Z',
    autoRenew: true,
    paymentStatus: 'paid',
    lastPayment: '2024-01-15T00:00:00Z',
    nextPayment: '2024-02-15T00:00:00Z'
  },
  {
    id: '2',
    companyId: '2',
    planId: '1',
    status: 'active',
    startDate: '2024-02-01T00:00:00Z',
    endDate: '2025-01-01T00:00:00Z',
    autoRenew: false,
    paymentStatus: 'pending',
    nextPayment: '2024-03-01T00:00:00Z'
  },
  {
    id: '3',
    companyId: '3',
    planId: '3',
    status: 'suspended',
    startDate: '2024-01-20T00:00:00Z',
    endDate: '2024-12-20T00:00:00Z',
    autoRenew: true,
    paymentStatus: 'overdue',
    lastPayment: '2024-01-20T00:00:00Z',
    nextPayment: '2024-02-20T00:00:00Z'
  }
];

// Mock system users
const mockSystemUsers = [
  {
    id: '1',
    name: 'Super Admin',
    email: 'admin@signius.com',
    role: 'super_admin',
    companyId: null,
    companyName: 'Sistema',
    lastLogin: '2024-03-15T10:30:00Z',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    permissions: ['all']
  },
  {
    id: '2',
    name: 'João Silva',
    email: 'admin@techsolutions.mz',
    role: 'admin',
    companyId: '1',
    companyName: 'TechSolutions Lda',
    lastLogin: '2024-03-15T09:15:00Z',
    isActive: true,
    createdAt: '2024-01-15T00:00:00Z',
    permissions: ['all_company']
  },
  {
    id: '3',
    name: 'Maria Santos',
    email: 'manager@techsolutions.mz',
    role: 'manager',
    companyId: '1',
    companyName: 'TechSolutions Lda',
    lastLogin: '2024-03-14T16:45:00Z',
    isActive: true,
    createdAt: '2024-01-20T00:00:00Z',
    permissions: ['clients', 'services', 'reports']
  },
  {
    id: '4',
    name: 'Carlos Mendes',
    email: 'user@techsolutions.mz',
    role: 'user',
    companyId: '1',
    companyName: 'TechSolutions Lda',
    lastLogin: '2024-03-10T14:20:00Z',
    isActive: false,
    createdAt: '2024-02-01T00:00:00Z',
    permissions: ['clients']
  },
  {
    id: '5',
    name: 'Ana Costa',
    email: 'admin@consultoriamaputo.mz',
    role: 'admin',
    companyId: '2',
    companyName: 'Consultoria Maputo SA',
    lastLogin: '2024-03-15T08:30:00Z',
    isActive: true,
    createdAt: '2024-02-01T00:00:00Z',
    permissions: ['all_company']
  }
];

// Mock system statistics
const mockSystemStats = {
  totalUsers: mockSystemUsers.length,
  activeUsers: mockSystemUsers.filter(u => u.isActive).length,
  totalLogins: 1247,
  systemUptime: '99.9%',
  storageUsed: '2.3 GB',
  apiCalls: 45678,
  errorRate: '0.1%',
  avgResponseTime: '120ms'
};

export const SuperAdminDashboard: React.FC = () => {
  const { superAdmin, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddPlanModal, setShowAddPlanModal] = useState(false);
  const [showAddCompanyModal, setShowAddCompanyModal] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [users, setUsers] = useState(mockSystemUsers);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-PT');
  };

  const getStatusBadge = (status: string, type: 'company' | 'subscription' | 'payment' = 'company') => {
    if (type === 'company') {
      return (
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
          status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {status ? 'Ativa' : 'Inativa'}
        </span>
      );
    } else if (type === 'subscription') {
      const statusConfig = {
        active: { bg: 'bg-green-100', text: 'text-green-800', label: 'Ativa' },
        cancelled: { bg: 'bg-red-100', text: 'text-red-800', label: 'Cancelada' },
        expired: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Expirada' },
        suspended: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Suspensa' }
      };
      const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.active;
      return (
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${config.bg} ${config.text}`}>
          {config.label}
        </span>
      );
    } else {
      const statusConfig = {
        paid: { bg: 'bg-green-100', text: 'text-green-800', label: 'Pago' },
        pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pendente' },
        overdue: { bg: 'bg-red-100', text: 'text-red-800', label: 'Em Atraso' }
      };
      const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
      return (
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${config.bg} ${config.text}`}>
          {config.label}
        </span>
      );
    }
  };

  const getPlanName = (planId: string) => {
    const plan = mockPlans.find(p => p.id === planId);
    return plan ? plan.name : 'Plano não encontrado';
  };

  const getCompanyName = (companyId: string) => {
    const company = mockCompanies.find(c => c.id === companyId);
    return company ? company.name : 'Empresa não encontrada';
  };

  const getRoleLabel = (role: string) => {
    const roles = {
      super_admin: 'Super Admin',
      admin: 'Administrador',
      manager: 'Gestor',
      user: 'Utilizador'
    };
    return roles[role as keyof typeof roles] || role;
  };

  const getRoleBadge = (role: string) => {
    const roleConfig = {
      super_admin: { bg: 'bg-purple-100', text: 'text-purple-800' },
      admin: { bg: 'bg-blue-100', text: 'text-blue-800' },
      manager: { bg: 'bg-green-100', text: 'text-green-800' },
      user: { bg: 'bg-gray-100', text: 'text-gray-800' }
    };
    const config = roleConfig[role as keyof typeof roleConfig] || roleConfig.user;
    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${config.bg} ${config.text}`}>
        {getRoleLabel(role)}
      </span>
    );
  };

  const formatLastLogin = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Hoje';
    if (diffDays === 2) return 'Ontem';
    if (diffDays <= 7) return `${diffDays - 1} dias atrás`;
    return formatDate(dateString);
  };

  const handleAddUser = () => {
    setShowAddUserModal(true);
  };

  const handleEditUser = (user: any) => {
    setEditingUser(user);
    setShowAddUserModal(true);
  };

  const handleDeleteUser = (userId: string) => {
    if (userId === '1') {
      alert('Não é possível eliminar o Super Admin principal!');
      return;
    }
    
    if (confirm('Tem certeza que deseja eliminar este utilizador?')) {
      setUsers(users.filter(u => u.id !== userId));
      alert('Utilizador eliminado com sucesso!');
    }
  };

  const handleToggleUserStatus = (userId: string) => {
    if (userId === '1') {
      alert('Não é possível desativar o Super Admin principal!');
      return;
    }
    
    setUsers(users.map(u => 
      u.id === userId 
        ? { ...u, isActive: !u.isActive }
        : u
    ));
    alert('Status do utilizador atualizado!');
  };

  const handleSaveUser = (userData: any) => {
    if (editingUser) {
      // Update existing user
      setUsers(users.map(u => 
        u.id === editingUser.id 
          ? { ...u, ...userData }
          : u
      ));
      alert('Utilizador atualizado com sucesso!');
    } else {
      // Add new user
      const newUser = {
        id: Date.now().toString(),
        name: userData.name,
        email: userData.email,
        role: userData.role,
        companyId: userData.companyId || null,
        companyName: userData.companyId ? getCompanyName(userData.companyId) : 'Sistema',
        lastLogin: new Date().toISOString(),
        isActive: true,
        createdAt: new Date().toISOString(),
        permissions: userData.role === 'super_admin' ? ['all'] : userData.permissions || []
      };
      setUsers([...users, newUser]);
      alert('Utilizador adicionado com sucesso!');
    }
    setShowAddUserModal(false);
    setEditingUser(null);
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Empresas</p>
              <p className="text-2xl font-bold text-gray-900">{mockCompanies.length}</p>
            </div>
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-blue-100 text-blue-600">
              <Building size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Empresas Ativas</p>
              <p className="text-2xl font-bold text-gray-900">
                {mockCompanies.filter(c => c.isActive).length}
              </p>
            </div>
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-green-100 text-green-600">
              <Users size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Receita Mensal</p>
              <p className="text-2xl font-bold text-gray-900">
                {mockSubscriptions
                  .filter(s => s.status === 'active')
                  .reduce((total, sub) => {
                    const plan = mockPlans.find(p => p.id === sub.planId);
                    return total + (plan?.price || 0);
                  }, 0)
                  .toLocaleString()} MT
              </p>
            </div>
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-emerald-100 text-emerald-600">
              <CreditCard size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Crescimento</p>
              <p className="text-2xl font-bold text-gray-900">+15.7%</p>
            </div>
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-purple-100 text-purple-600">
              <TrendingUp size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Utilizadores Ativos</p>
              <p className="text-2xl font-bold text-gray-900">{mockSystemStats.activeUsers}</p>
            </div>
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-indigo-100 text-indigo-600">
              <UserCheck size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Uptime Sistema</p>
              <p className="text-2xl font-bold text-gray-900">{mockSystemStats.systemUptime}</p>
            </div>
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-green-100 text-green-600">
              <Activity size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Chamadas API</p>
              <p className="text-2xl font-bold text-gray-900">{mockSystemStats.apiCalls.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-orange-100 text-orange-600">
              <BarChart3 size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Armazenamento</p>
              <p className="text-2xl font-bold text-gray-900">{mockSystemStats.storageUsed}</p>
            </div>
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-cyan-100 text-cyan-600">
              <Settings size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Empresas Recentes</h3>
          <div className="space-y-3">
            {mockCompanies.slice(0, 5).map((company) => (
              <div key={company.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{company.name}</p>
                  <p className="text-sm text-gray-500">{company.email}</p>
                </div>
                {getStatusBadge(company.isActive, 'company')}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Pagamentos Pendentes</h3>
          <div className="space-y-3">
            {mockSubscriptions
              .filter(s => s.paymentStatus === 'pending' || s.paymentStatus === 'overdue')
              .slice(0, 5)
              .map((subscription) => (
                <div key={subscription.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{getCompanyName(subscription.companyId)}</p>
                    <p className="text-sm text-gray-500">{getPlanName(subscription.planId)}</p>
                  </div>
                  {getStatusBadge(subscription.paymentStatus, 'payment')}
                </div>
              ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Utilizadores Recentes</h3>
          <div className="space-y-3">
            {mockSystemUsers.slice(0, 5).map((user) => (
              <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.companyName}</p>
                </div>
                <div className="text-right">
                  {getRoleBadge(user.role)}
                  <p className="text-xs text-gray-500 mt-1">{formatLastLogin(user.lastLogin)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* System Health */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Estado do Sistema</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <CheckCircle className="text-green-500" size={24} />
            </div>
            <p className="text-sm text-gray-600">Uptime</p>
            <p className="text-lg font-bold text-green-600">{mockSystemStats.systemUptime}</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Clock className="text-blue-500" size={24} />
            </div>
            <p className="text-sm text-gray-600">Tempo Resposta</p>
            <p className="text-lg font-bold text-blue-600">{mockSystemStats.avgResponseTime}</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <AlertTriangle className="text-yellow-500" size={24} />
            </div>
            <p className="text-sm text-gray-600">Taxa de Erro</p>
            <p className="text-lg font-bold text-yellow-600">{mockSystemStats.errorRate}</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Activity className="text-purple-500" size={24} />
            </div>
            <p className="text-sm text-gray-600">Total Logins</p>
            <p className="text-lg font-bold text-purple-600">{mockSystemStats.totalLogins.toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCompanies = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Gestão de Empresas</h3>
        <button 
          onClick={() => setShowAddCompanyModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus size={20} />
          Nova Empresa
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Pesquisar empresas..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Empresa</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Plano</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Criada em</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {mockCompanies
                .filter(company => 
                  company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  company.email.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((company) => (
                  <tr key={company.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{company.name}</div>
                        <div className="text-sm text-gray-500">{company.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm text-gray-900 capitalize">{company.plan}</div>
                        <div className="text-sm text-gray-500">{company.planPrice} MT/mês</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {formatDate(company.createdAt)}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(company.isActive, 'company')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded">
                          <Eye size={16} />
                        </button>
                        <button className="text-green-600 hover:text-green-900 p-1 hover:bg-green-50 rounded">
                          <Edit size={16} />
                        </button>
                        <button className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded">
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
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Gestão de Utilizadores do Sistema</h3>
        <button 
          onClick={handleAddUser}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus size={20} />
          Novo Utilizador
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Utilizadores</p>
              <p className="text-2xl font-bold text-gray-900">{users.length}</p>
            </div>
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-blue-100 text-blue-600">
              <Users size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Utilizadores Ativos</p>
              <p className="text-2xl font-bold text-gray-900">
                {users.filter(u => u.isActive).length}
              </p>
            </div>
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-green-100 text-green-600">
              <UserCheck size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Super Admins</p>
              <p className="text-2xl font-bold text-gray-900">
                {users.filter(u => u.role === 'super_admin').length}
              </p>
            </div>
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-purple-100 text-purple-600">
              <Shield size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Utilizadores Inativos</p>
              <p className="text-2xl font-bold text-gray-900">
                {users.filter(u => !u.isActive).length}
              </p>
            </div>
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-red-100 text-red-600">
              <UserX size={24} />
            </div>
          </div>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Pesquisar utilizadores..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Utilizador</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Empresa</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Função</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Último Login</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users
                .filter(user => 
                  user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  user.companyName.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center bg-gray-400">
                          <Users size={20} className="text-white" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500 flex items-center gap-1">
                            <Mail size={12} />
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{user.companyName}</td>
                    <td className="px-6 py-4">
                      {getRoleBadge(user.role)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="flex items-center gap-1">
                        <Clock size={12} />
                        {formatLastLogin(user.lastLogin)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(user.isActive, 'company')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleEditUser(user)}
                          className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded"
                          title="Editar"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => handleToggleUserStatus(user.id)}
                          className="text-orange-600 hover:text-orange-900 p-1 hover:bg-orange-50 rounded"
                          title={user.isActive ? "Desativar" : "Ativar"}
                        >
                          {user.isActive ? <UserX size={16} /> : <UserCheck size={16} />}
                        </button>
                        <button 
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded"
                          title="Eliminar"
                          disabled={user.id === '1'}
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
    </div>
  );

  const renderPlans = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Gestão de Planos</h3>
        <button 
          onClick={() => setShowAddPlanModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus size={20} />
          Novo Plano
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {mockPlans.map((plan) => (
          <div key={plan.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="text-lg font-semibold text-gray-900">{plan.name}</h4>
                <p className="text-2xl font-bold text-blue-600">{plan.price} MT<span className="text-sm text-gray-500">/mês</span></p>
              </div>
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                plan.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {plan.isActive ? 'Ativo' : 'Inativo'}
              </span>
            </div>
            
            <ul className="space-y-2 mb-6">
              {plan.features.map((feature, index) => (
                <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                  {feature}
                </li>
              ))}
            </ul>
            
            <div className="flex gap-2">
              <button className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors text-sm">
                Editar
              </button>
              <button className={`flex-1 py-2 px-3 rounded-lg transition-colors text-sm ${
                plan.isActive 
                  ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                  : 'bg-green-100 text-green-700 hover:bg-green-200'
              }`}>
                {plan.isActive ? 'Desativar' : 'Ativar'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSubscriptions = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Gestão de Subscrições</h3>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Empresa</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Plano</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Período</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pagamento</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {mockSubscriptions.map((subscription) => (
                <tr key={subscription.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {getCompanyName(subscription.companyId)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {getPlanName(subscription.planId)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {formatDate(subscription.startDate)} - {formatDate(subscription.endDate)}
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(subscription.status, 'subscription')}
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(subscription.paymentStatus, 'payment')}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded">
                        <Eye size={16} />
                      </button>
                      <button className="text-green-600 hover:text-green-900 p-1 hover:bg-green-50 rounded">
                        <Edit size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'overview', label: 'Visão Geral' },
    { id: 'companies', label: 'Empresas' },
    { id: 'users', label: 'Utilizadores' },
    { id: 'plans', label: 'Planos' },
    { id: 'subscriptions', label: 'Subscrições' }
  ];

  return (
    <div className="space-y-6">
      {/* Header with User Info */}
      <div className="flex justify-between items-center bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Painel Super Admin - Signius</h1>
          <p className="text-gray-600">Gestão completa da plataforma Signius</p>
        </div>
        
        {/* User Profile Section */}
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">{superAdmin?.name}</p>
            <p className="text-xs text-gray-500">{superAdmin?.email}</p>
            <p className="text-xs text-purple-600 font-medium">Super Administrador</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center bg-purple-600">
              <User size={20} className="text-white" />
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-2 px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
              title="Sair do Sistema"
            >
              <LogOut size={18} />
              <span className="text-sm font-medium">Sair</span>
            </button>
          </div>
        </div>
      </div>


      {/* Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      {activeTab === 'overview' && renderOverview()}
      {activeTab === 'companies' && renderCompanies()}
      {activeTab === 'users' && renderUsers()}
      {activeTab === 'plans' && renderPlans()}
      {activeTab === 'subscriptions' && renderSubscriptions()}

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {editingUser ? 'Editar Utilizador' : 'Novo Utilizador'}
            </h3>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const userData = {
                name: formData.get('name') as string,
                email: formData.get('email') as string,
                role: formData.get('role') as string,
                companyId: formData.get('companyId') as string || null,
                permissions: Array.from(formData.getAll('permissions')) as string[]
              };
              handleSaveUser(userData);
            }} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    name="name"
                    defaultValue={editingUser?.name || ''}
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
                    defaultValue={editingUser?.email || ''}
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
                    defaultValue={editingUser?.role || 'user'}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="user">Utilizador</option>
                    <option value="manager">Gestor</option>
                    <option value="admin">Administrador</option>
                    <option value="super_admin">Super Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Empresa
                  </label>
                  <select
                    name="companyId"
                    defaultValue={editingUser?.companyId || ''}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Sistema (Super Admin)</option>
                    {mockCompanies.map((company) => (
                      <option key={company.id} value={company.id}>
                        {company.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {!editingUser && (
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
                    setEditingUser(null);
                  }}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingUser ? 'Atualizar' : 'Adicionar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};