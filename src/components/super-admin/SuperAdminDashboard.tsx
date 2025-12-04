import React, { useState } from 'react';
import {
  Building2,
  Users,
  DollarSign,
  TrendingUp,
  Settings,
  CreditCard,
  ArrowUpCircle,
  Eye,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter,
  Download,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Key,
  Globe,
  Shield,
  ExternalLink,
  LogOut,
  User,
  Package
} from 'lucide-react';
import { MPGSPayment } from '../billing/MPGSPayment';
import { Pagination } from '../common/Pagination';
import { useAuth } from '../../context/AuthContext';
import { PlansManagement } from './PlansManagement';
import { PaymentSettings } from '../settings/PaymentSettings';
import { NotificationSettings } from '../settings/NotificationSettings';

interface Company {
  id: string;
  name: string;
  email: string;
  plan: 'basic' | 'professional' | 'enterprise';
  planPrice: number;
  status: 'active' | 'suspended' | 'cancelled';
  createdAt: string;
  lastPayment: string;
  nextPayment: string;
}

interface Transaction {
  id: string;
  companyId: string;
  companyName: string;
  amount: number;
  status: 'success' | 'pending' | 'failed';
  method: 'card';
  reference: string;
  date: string;
}

const mockCompanies: Company[] = [
  {
    id: '1',
    name: 'Empresa Exemplo 1',
    email: 'admin@empresa1.mz',
    plan: 'professional',
    planPrice: 1500,
    status: 'active',
    createdAt: '2024-01-15',
    lastPayment: '2024-03-01',
    nextPayment: '2024-04-01'
  },
  {
    id: '2',
    name: 'Empresa Exemplo 2',
    email: 'admin@empresa2.mz',
    plan: 'enterprise',
    planPrice: 3500,
    status: 'active',
    createdAt: '2024-02-01',
    lastPayment: '2024-03-15',
    nextPayment: '2024-04-15'
  },
  {
    id: '3',
    name: 'Farmácia Central',
    email: 'admin@farmaciacentral.mz',
    plan: 'basic',
    planPrice: 750,
    status: 'suspended',
    createdAt: '2024-02-20',
    lastPayment: '2024-02-20',
    nextPayment: '2024-03-20'
  }
];

const mockTransactions: Transaction[] = [
  {
    id: '1',
    companyId: '1',
    companyName: 'TechSolutions Lda',
    amount: 1500,
    status: 'success',
    method: 'card',
    reference: 'MPGS240301001',
    date: '2024-03-01'
  },
  {
    id: '2',
    companyId: '2',
    companyName: 'Construções Maputo SA',
    amount: 3500,
    status: 'success',
    method: 'card',
    reference: 'MPGS240315001',
    date: '2024-03-15'
  }
];

const plans = [
  { 
    id: 'basic', 
    name: 'Básico', 
    price: 750, 
    color: 'bg-gray-100 text-gray-800',
    features: ['Até 100 clientes', 'Suporte por email', '1 utilizador'] 
  },
  { 
    id: 'professional', 
    name: 'Profissional', 
    price: 1500, 
    color: 'bg-blue-100 text-blue-800',
    features: ['Até 500 clientes', 'Suporte prioritário', '5 utilizadores'] 
  },
  { 
    id: 'enterprise', 
    name: 'Empresarial', 
    price: 3500, 
    color: 'bg-purple-100 text-purple-800',
    features: ['Clientes ilimitados', 'Suporte 24/7', 'Utilizadores ilimitados'] 
  }
];

export const SuperAdminDashboard: React.FC = () => {
  const { superAdmin, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [companies, setCompanies] = useState<Company[]>(mockCompanies);
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [searchTerm, setSearchTerm] = useState('');
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [transactionsCurrentPage, setTransactionsCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination for companies
  const companiesTotalPages = Math.ceil(filteredCompanies.length / itemsPerPage);
  const companiesStartIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCompanies = filteredCompanies.slice(companiesStartIndex, companiesStartIndex + itemsPerPage);

  // Pagination for transactions
  const transactionsTotalPages = Math.ceil(transactions.length / itemsPerPage);
  const transactionsStartIndex = (transactionsCurrentPage - 1) * itemsPerPage;
  const paginatedTransactions = transactions.slice(transactionsStartIndex, transactionsStartIndex + itemsPerPage);

  // Reset to first page when search changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { bg: 'bg-green-100', text: 'text-green-800', label: 'Ativa' },
      suspended: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Suspensa' },
      cancelled: { bg: 'bg-red-100', text: 'text-red-800', label: 'Cancelada' }
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.active;
    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const getPlanBadge = (plan: string) => {
    const planConfig = plans.find(p => p.id === plan);
    if (!planConfig) return null;
    
    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${planConfig.color}`}>
        {planConfig.name}
      </span>
    );
  };

  const handleChangePlan = (company: Company) => {
    setSelectedCompany(company);
    setSelectedPlan(company.plan);
    setShowPlanModal(true);
  };

  const handlePlanSelection = (planId: string) => {
    if (!selectedCompany) return;
    
    const currentPlan = plans.find(p => p.id === selectedCompany.plan);
    const newPlan = plans.find(p => p.id === planId);
    
    if (!currentPlan || !newPlan) return;
    
    setSelectedPlan(planId);
    
    // Se é upgrade (preço maior), precisa de pagamento
    if (newPlan.price > currentPlan.price) {
      setShowPlanModal(false);
      setShowPaymentModal(true);
    } else {
      // Se é downgrade, aplica imediatamente
      updateCompanyPlan(selectedCompany.id, planId, newPlan.price);
      setShowPlanModal(false);
      alert(`Plano alterado para ${newPlan.name} com sucesso!`);
    }
  };

  const updateCompanyPlan = (companyId: string, newPlan: string, newPrice: number) => {
    setCompanies(companies.map(company => 
      company.id === companyId 
        ? { 
            ...company, 
            plan: newPlan as 'basic' | 'professional' | 'enterprise',
            planPrice: newPrice,
            lastPayment: new Date().toISOString().split('T')[0],
            nextPayment: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
          }
        : company
    ));
  };

  const handlePaymentSuccess = (transactionId: string) => {
    if (!selectedCompany) return;
    
    const newPlan = plans.find(p => p.id === selectedPlan);
    if (!newPlan) return;
    
    // Atualizar empresa
    updateCompanyPlan(selectedCompany.id, selectedPlan, newPlan.price);
    
    // Adicionar transação
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      companyId: selectedCompany.id,
      companyName: selectedCompany.name,
      amount: newPlan.price,
      status: 'success',
      method: 'card',
      reference: transactionId,
      date: new Date().toISOString().split('T')[0]
    };
    
    setTransactions([newTransaction, ...transactions]);
    setShowPaymentModal(false);
    setSelectedCompany(null);
    setSelectedPlan('');
    
    alert(`Plano alterado para ${newPlan.name} e pagamento processado com sucesso!`);
  };

  const handlePaymentError = (error: string) => {
    alert(`Erro no pagamento: ${error}`);
    setShowPaymentModal(false);
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Empresas</p>
              <p className="text-2xl font-bold text-gray-900">{companies.length}</p>
            </div>
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-blue-100 text-blue-600">
              <Building2 size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Empresas Ativas</p>
              <p className="text-2xl font-bold text-gray-900">
                {companies.filter(c => c.status === 'active').length}
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
              <p className="text-sm font-medium text-gray-600 mb-1">Receita Mensal</p>
              <p className="text-2xl font-bold text-gray-900">
                {companies.reduce((total, c) => total + c.planPrice, 0).toLocaleString()} MT
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
              <p className="text-sm font-medium text-gray-600 mb-1">Crescimento</p>
              <p className="text-2xl font-bold text-gray-900">+12.5%</p>
            </div>
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-purple-100 text-purple-600">
              <TrendingUp size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Atividade Recente</h3>
        <div className="space-y-3">
          {transactions.slice(0, 5).map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">{transaction.companyName}</p>
                <p className="text-sm text-gray-500">Pagamento via Visa/MasterCard</p>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-900">{transaction.amount.toLocaleString()} MT</p>
                <p className="text-sm text-green-600">Sucesso</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderCompanies = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Gestão de Empresas</h3>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2">
          <Plus size={20} />
          Nova Empresa
        </button>
      </div>

      {/* Search */}
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

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Empresa</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Plano</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Preço</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Próximo Pagamento</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedCompanies.map((company) => (
                <tr key={company.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{company.name}</div>
                      <div className="text-sm text-gray-500">{company.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">{getPlanBadge(company.plan)}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{company.planPrice.toLocaleString()} MT</td>
                  <td className="px-6 py-4">{getStatusBadge(company.status)}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {new Date(company.nextPayment).toLocaleDateString('pt-PT')}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleChangePlan(company)}
                        className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded"
                        title="Alterar Plano"
                      >
                        <ArrowUpCircle size={16} />
                      </button>
                      <button className="text-green-600 hover:text-green-900 p-1 hover:bg-green-50 rounded">
                        <Eye size={16} />
                      </button>
                      <button className="text-orange-600 hover:text-orange-900 p-1 hover:bg-orange-50 rounded">
                        <Edit size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={companiesTotalPages}
          onPageChange={setCurrentPage}
          totalItems={filteredCompanies.length}
          itemsPerPage={itemsPerPage}
        />
      </div>
    </div>
  );

  const renderPayments = () => (
    <div className="space-y-6">
      {/* MPGS Configuration Status */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <CreditCard className="text-blue-600" size={24} />
            Configuração MPGS (Visa/MasterCard)
          </h3>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-2">
            <p className="text-sm text-yellow-800">
              <strong>Nota:</strong> Configure as credenciais MPGS na aba{' '}
              <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('overview'); }} className="text-blue-600 hover:underline">
                Configurações → Pagamentos
              </a>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <CreditCard className="text-blue-600" size={16} />
              <span className="font-medium text-blue-900">Gateway MPGS</span>
            </div>
            <p className="text-sm text-blue-700">Pagamentos via Visa/MasterCard</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="text-green-600" size={16} />
              <span className="font-medium text-green-900">Pagamentos Recorrentes</span>
            </div>
            <p className="text-sm text-green-700">Subscrições automáticas</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="text-purple-600" size={16} />
              <span className="font-medium text-purple-900">PCI Compliant</span>
            </div>
            <p className="text-sm text-purple-700">Certificado Level 1</p>
          </div>
        </div>
      </div>

      {/* Payment Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Pagamentos</p>
              <p className="text-2xl font-bold text-gray-900">{transactions.length}</p>
            </div>
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-green-100 text-green-600">
              <CreditCard size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Valor Total</p>
              <p className="text-2xl font-bold text-gray-900">
                {transactions.reduce((total, t) => total + t.amount, 0).toLocaleString()} MT
              </p>
            </div>
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-blue-100 text-blue-600">
              <DollarSign size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Taxa de Sucesso</p>
              <p className="text-2xl font-bold text-gray-900">
                {((transactions.filter(t => t.status === 'success').length / transactions.length) * 100).toFixed(1)}%
              </p>
            </div>
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-emerald-100 text-emerald-600">
              <TrendingUp size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Este Mês</p>
              <p className="text-2xl font-bold text-gray-900">
                {transactions.filter(t => new Date(t.date).getMonth() === new Date().getMonth()).length}
              </p>
            </div>
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-purple-100 text-purple-600">
              <CreditCard size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Transações Recentes</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Empresa</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Valor</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Referência</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{transaction.companyName}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{transaction.amount.toLocaleString()} MT</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      transaction.status === 'success' ? 'bg-green-100 text-green-800' :
                      transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {transaction.status === 'success' ? 'Sucesso' :
                       transaction.status === 'pending' ? 'Pendente' : 'Falhou'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">{transaction.reference}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {new Date(transaction.date).toLocaleDateString('pt-PT')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination
          currentPage={transactionsCurrentPage}
          totalPages={transactionsTotalPages}
          onPageChange={setTransactionsCurrentPage}
          totalItems={transactions.length}
          itemsPerPage={itemsPerPage}
        />
      </div>

      {/* Documentation */}
      <div className="bg-blue-50 rounded-xl border border-blue-200 p-6">
        <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
          <ExternalLink className="text-blue-600" size={20} />
          Documentação MPGS
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h5 className="font-medium text-blue-900 mb-2">Links Úteis</h5>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• <a href="https://gateway.mastercard.com/api/documentation" target="_blank" rel="noopener noreferrer" className="hover:underline">Documentação da API MPGS</a></li>
              <li>• <a href="https://test-gateway.mastercard.com" target="_blank" rel="noopener noreferrer" className="hover:underline">Ambiente de Teste</a></li>
              <li>• <a href="https://gateway.mastercard.com/checkout" target="_blank" rel="noopener noreferrer" className="hover:underline">Hosted Checkout</a></li>
            </ul>
          </div>
          <div>
            <h5 className="font-medium text-blue-900 mb-2">Como Obter Credenciais</h5>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Aceder ao Merchant Administration Portal</li>
              <li>• Ir em Admin → Integration Settings</li>
              <li>• Ativar autenticação e gerar API Password</li>
              <li>• Copiar Merchant ID, Username e Password</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'overview', label: 'Visão Geral', icon: TrendingUp },
    { id: 'companies', label: 'Empresas', icon: Building2 },
    { id: 'plans', label: 'Planos', icon: Package },
    { id: 'payments', label: 'Pagamentos', icon: CreditCard },
    { id: 'settings', label: 'Configurações', icon: Settings }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Painel Super Admin</h1>
          <p className="text-gray-600">Gestão completa da plataforma Signius</p>
        </div>
        
        {/* Super Admin Profile and Logout */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 bg-white rounded-lg p-3 shadow-sm border border-gray-200">
            <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
              <User className="text-white" size={20} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{superAdmin?.name}</p>
              <p className="text-xs text-gray-500">{superAdmin?.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
          >
            <LogOut size={16} />
            Sair
          </button>
        </div>
      </div>

      {/* Navigation */}
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
      {activeTab === 'overview' && renderOverview()}
      {activeTab === 'companies' && renderCompanies()}
      {activeTab === 'plans' && <PlansManagement />}
      {activeTab === 'payments' && renderPayments()}
      {activeTab === 'settings' && (
        <div className="space-y-6">
          <NotificationSettings />
          <PaymentSettings />
        </div>
      )}

      {/* Plan Change Modal */}
      {showPlanModal && selectedCompany && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Alterar Plano - {selectedCompany.name}
            </h3>
            
            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-2">Plano Atual:</p>
              <div className="flex items-center gap-2">
                {getPlanBadge(selectedCompany.plan)}
                <span className="text-sm text-gray-900">{selectedCompany.planPrice.toLocaleString()} MT/mês</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <p className="text-sm font-medium text-gray-700">Selecionar Novo Plano:</p>
              {plans.map((plan) => {
                const currentPlan = plans.find(p => p.id === selectedCompany.plan);
                const priceDiff = plan.price - (currentPlan?.price || 0);
                const isUpgrade = priceDiff > 0;
                const isDowngrade = priceDiff < 0;
                const isCurrent = plan.id === selectedCompany.plan;
                
                return (
                  <div
                    key={plan.id}
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                      isCurrent 
                        ? 'border-gray-300 bg-gray-50 cursor-not-allowed opacity-50'
                        : selectedPlan === plan.id
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                    onClick={() => !isCurrent && setSelectedPlan(plan.id)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${plan.color}`}>
                            {plan.name}
                          </span>
                          {isCurrent && <span className="text-xs text-gray-500">(Atual)</span>}
                          {isUpgrade && <span className="text-xs text-green-600">↗ Upgrade</span>}
                          {isDowngrade && <span className="text-xs text-orange-600">↘ Downgrade</span>}
                        </div>
                        <p className="text-lg font-bold text-gray-900">{plan.price.toLocaleString()} MT/mês</p>
                        {priceDiff !== 0 && (
                          <p className={`text-sm ${isUpgrade ? 'text-green-600' : 'text-orange-600'}`}>
                            {isUpgrade ? '+' : ''}{priceDiff.toLocaleString()} MT
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <ul className="text-xs text-gray-600 space-y-1">
                          {plan.features.map((feature, idx) => (
                            <li key={idx}>• {feature}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="flex gap-3 pt-6">
              <button
                onClick={() => {
                  setShowPlanModal(false);
                  setSelectedCompany(null);
                  setSelectedPlan('');
                }}
                className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => handlePlanSelection(selectedPlan)}
                disabled={!selectedPlan || selectedPlan === selectedCompany.plan}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirmar Alteração
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && selectedCompany && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <MPGSPayment
            companyId={selectedCompany.id}
            companyName={selectedCompany.name}
            planType={selectedPlan as 'basic' | 'professional' | 'enterprise'}
            amount={plans.find(p => p.id === selectedPlan)?.price || 0}
            onPaymentSuccess={handlePaymentSuccess}
            onPaymentError={handlePaymentError}
            onCancel={() => {
              setShowPaymentModal(false);
              setSelectedCompany(null);
              setSelectedPlan('');
            }}
          />
        </div>
      )}
    </div>
  );
};