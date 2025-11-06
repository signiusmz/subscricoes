import React, { useState } from 'react';
import {
  FileText,
  Download,
  Eye,
  PenTool,
  CheckCircle,
  Clock,
  DollarSign,
  Calendar,
  User,
  Building,
  Mail,
  Phone,
  MapPin,
  Star,
  CreditCard,
  Receipt,
  AlertCircle,
  LogOut,
  Home,
  Settings,
  Bell,
  Search,
  Filter,
  Edit,
  X,
  Check
} from 'lucide-react';
import { PDFGenerator } from '../../utils/pdfGenerator';

interface ClientPortalInvoice {
  id: string;
  number: string;
  serviceName: string;
  amount: number;
  issueDate: string;
  dueDate: string;
  status: 'pending' | 'paid' | 'overdue';
  paidDate?: string;
}

const mockClientInvoices: ClientPortalInvoice[] = [
  {
    id: '1',
    number: 'FAC-2024-001',
    serviceName: 'Contabilidade Mensal',
    amount: 5000,
    issueDate: '2024-03-01',
    dueDate: '2024-03-31',
    status: 'paid',
    paidDate: '2024-03-25'
  },
  {
    id: '2',
    number: 'FAC-2024-004',
    serviceName: 'Contabilidade Mensal',
    amount: 5000,
    issueDate: '2024-04-01',
    dueDate: '2024-04-30',
    status: 'pending'
  }
];

const mockClientInfo = {
  companyName: 'Sua Empresa Lda',
  representative: 'Seu Nome',
  email: 'seu@email.com',
  phone: '+258 84 000 0000',
  nuit: '400000000',
  address: 'Endereço da sua empresa'
};

export const ClientPortal: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'paid' | 'overdue'>('all');
  const [clientInfo, setClientInfo] = useState(mockClientInfo);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editedInfo, setEditedInfo] = useState(mockClientInfo);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-PT');
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Rascunho' },
      sent: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Enviado' },
      signed: { bg: 'bg-green-100', text: 'text-green-800', label: 'Assinado' },
      cancelled: { bg: 'bg-red-100', text: 'text-red-800', label: 'Cancelado' },
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pendente' },
      paid: { bg: 'bg-green-100', text: 'text-green-800', label: 'Paga' },
      overdue: { bg: 'bg-red-100', text: 'text-red-800', label: 'Em Atraso' }
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const handleSaveProfile = () => {
    setClientInfo(editedInfo);
    setIsEditingProfile(false);
    alert('Dados atualizados com sucesso!');
  };

  const handleCancelEdit = () => {
    setEditedInfo(clientInfo);
    setIsEditingProfile(false);
  };


  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl p-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <Building className="text-white" size={32} />
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-2">Bem-vindo, {clientInfo.representative}!</h2>
            <p className="text-blue-100 text-lg">{clientInfo.companyName}</p>
            <p className="text-blue-200 text-sm">Portal do Cliente - TechSolutions Lda</p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Faturas Pagas</p>
              <p className="text-2xl font-bold text-gray-900">
                {mockClientInvoices.filter(i => i.status === 'paid').length}
              </p>
            </div>
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-green-100 text-green-600">
              <CheckCircle size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Faturas Pendentes</p>
              <p className="text-2xl font-bold text-gray-900">
                {mockClientInvoices.filter(i => i.status === 'pending').length}
              </p>
            </div>
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-orange-100 text-orange-600">
              <AlertCircle size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Valor Total em Atraso</p>
              <p className="text-2xl font-bold text-gray-900">
                {mockClientInvoices.filter(i => i.status === 'overdue').reduce((sum, i) => sum + i.amount, 0).toLocaleString()} MT
              </p>
            </div>
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-red-100 text-red-600">
              <AlertCircle size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Faturas Recentes</h3>
        <div className="space-y-3">
          {mockClientInvoices.slice(0, 5).map((invoice) => (
            <div key={invoice.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">{invoice.number}</p>
                <p className="text-sm text-gray-500">{invoice.serviceName}</p>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-900">{invoice.amount.toLocaleString()} MT</p>
                {getStatusBadge(invoice.status)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderInvoices = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Minhas Faturas</h3>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Pesquisar faturas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">Todos os Status</option>
          <option value="pending">Pendentes</option>
          <option value="paid">Pagas</option>
          <option value="overdue">Em Atraso</option>
        </select>
      </div>

      {/* Invoices Grid */}
      <div className="grid gap-6">
        {mockClientInvoices.map((invoice) => (
          <div key={invoice.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">{invoice.serviceName}</h4>
                <p className="text-gray-600 mb-2">Fatura: {invoice.number}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Calendar size={12} />
                    Emitida em {formatDate(invoice.issueDate)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar size={12} />
                    Vence em {formatDate(invoice.dueDate)}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900 mb-2">{invoice.amount.toLocaleString()} MT</p>
                {getStatusBadge(invoice.status)}
                {invoice.paidDate && (
                  <p className="text-sm text-gray-500 mt-2">
                    Paga em {formatDate(invoice.paidDate)}
                  </p>
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                className="border border-blue-600 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-2"
              >
                <Download size={16} />
                Download PDF
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Informações da Empresa</h3>
          {!isEditingProfile && (
            <button
              onClick={() => {
                setEditedInfo(clientInfo);
                setIsEditingProfile(true);
              }}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Edit size={16} />
              Editar
            </button>
          )}
        </div>

        {isEditingProfile ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nome da Empresa</label>
                  <input
                    type="text"
                    value={editedInfo.companyName}
                    onChange={(e) => setEditedInfo({ ...editedInfo, companyName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Representante</label>
                  <input
                    type="text"
                    value={editedInfo.representative}
                    onChange={(e) => setEditedInfo({ ...editedInfo, representative: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={editedInfo.email}
                    onChange={(e) => setEditedInfo({ ...editedInfo, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Telefone</label>
                  <input
                    type="tel"
                    value={editedInfo.phone}
                    onChange={(e) => setEditedInfo({ ...editedInfo, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">NUIT</label>
                  <input
                    type="text"
                    value={editedInfo.nuit}
                    onChange={(e) => setEditedInfo({ ...editedInfo, nuit: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Endereço</label>
                  <input
                    type="text"
                    value={editedInfo.address}
                    onChange={(e) => setEditedInfo({ ...editedInfo, address: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={handleCancelEdit}
                className="flex items-center gap-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <X size={16} />
                Cancelar
              </button>
              <button
                onClick={handleSaveProfile}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                <Check size={16} />
                Salvar Alterações
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Building className="text-gray-400" size={20} />
                <div>
                  <p className="text-sm text-gray-600">Nome da Empresa</p>
                  <p className="font-medium text-gray-900">{clientInfo.companyName}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <User className="text-gray-400" size={20} />
                <div>
                  <p className="text-sm text-gray-600">Representante</p>
                  <p className="font-medium text-gray-900">{clientInfo.representative}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="text-gray-400" size={20} />
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium text-gray-900">{clientInfo.email}</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Phone className="text-gray-400" size={20} />
                <div>
                  <p className="text-sm text-gray-600">Telefone</p>
                  <p className="font-medium text-gray-900">{clientInfo.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FileText className="text-gray-400" size={20} />
                <div>
                  <p className="text-sm text-gray-600">NUIT</p>
                  <p className="font-medium text-gray-900">{clientInfo.nuit}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="text-gray-400" size={20} />
                <div>
                  <p className="text-sm text-gray-600">Endereço</p>
                  <p className="font-medium text-gray-900">{clientInfo.address}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'invoices', label: 'Faturas', icon: Receipt },
    { id: 'profile', label: 'Perfil', icon: User }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <img 
                src="https://cdn.signius.pl/wp-content/uploads/2022/09/signius_logo_rgb.svg" 
                alt="Signius Logo" 
                className="w-32 h-12 object-contain"
              />
              <div className="hidden md:block">
                <h1 className="text-lg font-semibold text-gray-900">Portal do Cliente</h1>
                <p className="text-sm text-gray-600">{mockClientInfo.companyName}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <User className="text-white" size={16} />
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-900">{mockClientInfo.representative}</p>
                  <p className="text-xs text-gray-500">{mockClientInfo.email}</p>
                </div>
              </div>
              <button
                onClick={() => window.location.reload()}
                className="text-gray-600 hover:text-gray-900 p-2"
                title="Voltar ao Sistema"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2 ${
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'invoices' && renderInvoices()}
        {activeTab === 'profile' && renderProfile()}
      </div>
    </div>
  );
};