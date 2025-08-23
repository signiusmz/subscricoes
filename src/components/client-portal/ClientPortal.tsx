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
  Filter
} from 'lucide-react';
import { PDFGenerator } from '../../utils/pdfGenerator';

interface ClientPortalContract {
  id: string;
  number: string;
  title: string;
  content: string;
  value: number;
  startDate: string;
  endDate: string;
  status: 'draft' | 'sent' | 'signed' | 'cancelled';
  createdAt: string;
  signedAt?: string;
  signatureHash?: string;
  signerName?: string;
}

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

const mockClientContracts: ClientPortalContract[] = [
  {
    id: '1',
    number: 'CONT-2024-001',
    title: 'Contrato de Contabilidade Mensal',
    content: '<div style="max-width: 800px; margin: 0 auto; font-family: Arial, sans-serif;"><h1>CONTRATO DE PRESTAÇÃO DE SERVIÇOS</h1><p>Contrato entre Transportes Maputo Lda e TechSolutions Lda...</p></div>',
    value: 60000,
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    status: 'signed',
    createdAt: '2024-01-01',
    signedAt: '2024-01-05',
    signatureHash: 'abc123def456'
  },
  {
    id: '2',
    number: 'CONT-2024-003',
    title: 'Contrato de Consultoria Fiscal',
    content: '<div style="max-width: 800px; margin: 0 auto; font-family: Arial, sans-serif;"><h1>CONTRATO DE CONSULTORIA</h1><p>Contrato de consultoria fiscal...</p></div>',
    value: 36000,
    startDate: '2024-03-01',
    endDate: '2024-08-31',
    status: 'sent',
    createdAt: '2024-03-01'
  }
];

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
  companyName: 'Transportes Maputo Lda',
  representative: 'João Macamo',
  email: 'joao@transportesmaputo.mz',
  phone: '+258 84 123 4567',
  nuit: '400567890',
  address: 'Av. Eduardo Mondlane, 567, Maputo'
};

export const ClientPortal: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [viewingContract, setViewingContract] = useState<ClientPortalContract | null>(null);
  const [showContractModal, setShowContractModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'sent' | 'signed' | 'cancelled'>('all');

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

  const handleViewContract = (contract: ClientPortalContract) => {
    setViewingContract(contract);
    setShowContractModal(true);
  };

  const handleDownloadContract = (contract: ClientPortalContract) => {
    PDFGenerator.generateContract({
      number: contract.number,
      clientInfo: mockClientInfo,
      title: contract.title,
      content: contract.content,
      value: contract.value,
      startDate: contract.startDate,
      endDate: contract.endDate,
      status: contract.status,
      signedAt: contract.signedAt,
      signatureHash: contract.signatureHash
    });
  };

  const handleSignContract = (contractId: string) => {
    const signerName = prompt('Para assinar digitalmente, digite seu nome completo:');
    
    if (!signerName || signerName.trim().length < 3) {
      alert('❌ Nome inválido!\n\nPor favor, digite seu nome completo para prosseguir com a assinatura digital.');
      return;
    }
    
    if (confirm(`Confirma a assinatura digital do contrato?\n\n👤 Assinante: ${signerName.trim()}\n📄 Contrato: ${mockClientContracts.find(c => c.id === contractId)?.title}\n\n⚠️ Esta ação não pode ser desfeita.`)) {
      const signatureHash = `SIG_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      alert(`✅ Contrato assinado digitalmente com sucesso!\n\n👤 Assinante: ${signerName.trim()}\n🔐 Hash de Segurança: ${signatureHash}\n📅 Data: ${new Date().toLocaleString('pt-PT')}\n✅ Status: Assinado\n\n📧 Uma cópia foi enviada para o seu email.`);
    }
  };

  const filteredContracts = mockClientContracts.filter(contract => {
    const matchesSearch = contract.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contract.number.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || contract.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl p-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <Building className="text-white" size={32} />
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-2">Bem-vindo, {mockClientInfo.representative}!</h2>
            <p className="text-blue-100 text-lg">{mockClientInfo.companyName}</p>
            <p className="text-blue-200 text-sm">Portal do Cliente - TechSolutions Lda</p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Contratos</p>
              <p className="text-2xl font-bold text-gray-900">{mockClientContracts.length}</p>
            </div>
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-blue-100 text-blue-600">
              <FileText size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Assinados</p>
              <p className="text-2xl font-bold text-gray-900">
                {mockClientContracts.filter(c => c.status === 'signed').length}
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
              <p className="text-sm font-medium text-gray-600 mb-1">Valor Total</p>
              <p className="text-2xl font-bold text-gray-900">
                {mockClientContracts.reduce((sum, c) => sum + c.value, 0).toLocaleString()} MT
              </p>
            </div>
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-emerald-100 text-emerald-600">
              <DollarSign size={24} />
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
      </div>

      {/* Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Contratos Recentes</h3>
          <div className="space-y-3">
            {mockClientContracts.slice(0, 3).map((contract) => (
              <div key={contract.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{contract.number}</p>
                  <p className="text-sm text-gray-500">{contract.title}</p>
                </div>
                <div className="text-right">
                  {getStatusBadge(contract.status)}
                  <p className="text-sm text-gray-500 mt-1">{formatDate(contract.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Faturas Recentes</h3>
          <div className="space-y-3">
            {mockClientInvoices.slice(0, 3).map((invoice) => (
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
    </div>
  );

  const renderContracts = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Meus Contratos</h3>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Pesquisar contratos..."
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
          <option value="draft">Rascunhos</option>
          <option value="sent">Enviados</option>
          <option value="signed">Assinados</option>
          <option value="cancelled">Cancelados</option>
        </select>
      </div>

      {/* Contracts Grid */}
      <div className="grid gap-6">
        {filteredContracts.map((contract) => (
          <div key={contract.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">{contract.title}</h4>
                <p className="text-gray-600 mb-2">Contrato: {contract.number}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Calendar size={12} />
                    {formatDate(contract.startDate)} - {formatDate(contract.endDate)}
                  </span>
                  <span className="flex items-center gap-1">
                    <DollarSign size={12} />
                    {contract.value.toLocaleString()} MT
                  </span>
                </div>
              </div>
              <div className="text-right">
                {getStatusBadge(contract.status)}
                {contract.signedAt && (
                  <p className="text-sm text-gray-500 mt-2">
                    Assinado em {formatDate(contract.signedAt)}
                    {contract.signerName && (
                      <span className="block text-xs text-gray-400 mt-1">
                        Por: {contract.signerName}
                      </span>
                    )}
                  </p>
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => handleViewContract(contract)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Eye size={16} />
                Visualizar
              </button>
              <button
                onClick={() => handleDownloadContract(contract)}
                className="border border-green-600 text-green-600 px-4 py-2 rounded-lg hover:bg-green-50 transition-colors flex items-center gap-2"
              >
                <Download size={16} />
                Download PDF
              </button>
              {contract.status === 'sent' && (
                <button
                  onClick={() => handleSignContract(contract.id)}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  <PenTool size={16} />
                  Assinar Digitalmente
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Informações da Empresa</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Building className="text-gray-400" size={20} />
              <div>
                <p className="text-sm text-gray-600">Nome da Empresa</p>
                <p className="font-medium text-gray-900">{mockClientInfo.companyName}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <User className="text-gray-400" size={20} />
              <div>
                <p className="text-sm text-gray-600">Representante</p>
                <p className="font-medium text-gray-900">{mockClientInfo.representative}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="text-gray-400" size={20} />
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium text-gray-900">{mockClientInfo.email}</p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Phone className="text-gray-400" size={20} />
              <div>
                <p className="text-sm text-gray-600">Telefone</p>
                <p className="font-medium text-gray-900">{mockClientInfo.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <FileText className="text-gray-400" size={20} />
              <div>
                <p className="text-sm text-gray-600">NUIT</p>
                <p className="font-medium text-gray-900">{mockClientInfo.nuit}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="text-gray-400" size={20} />
              <div>
                <p className="text-sm text-gray-600">Endereço</p>
                <p className="font-medium text-gray-900">{mockClientInfo.address}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'contracts', label: 'Contratos', icon: FileText },
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
        {activeTab === 'contracts' && renderContracts()}
        {activeTab === 'profile' && renderProfile()}
      </div>

      {/* Contract View Modal */}
      {showContractModal && viewingContract && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {viewingContract.title} - {viewingContract.number}
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={() => handleDownloadContract(viewingContract)}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  <Download size={16} />
                  Download PDF
                </button>
                {viewingContract.status === 'sent' && (
                  <button
                    onClick={() => handleSignContract(viewingContract.id)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <PenTool size={16} />
                    Assinar
                  </button>
                )}
                <button
                  onClick={() => setShowContractModal(false)}
                  className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Fechar
                </button>
              </div>
            </div>
            
            <div className="border border-gray-300 rounded-lg p-6 bg-white max-h-96 overflow-y-auto">
              <div dangerouslySetInnerHTML={{ __html: viewingContract.content }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};