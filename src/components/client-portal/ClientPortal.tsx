import React, { useState } from 'react';
import { FileText, CreditCard, Calendar, Download, Eye, RefreshCw, Star, User, LogOut } from 'lucide-react';
import { PDFGenerator, ClientInfo } from '../../utils/pdfGenerator';
import { useAuth } from '../../context/AuthContext';

interface Invoice {
  id: string;
  number: string;
  date: string;
  dueDate: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  serviceId: string;
  serviceName: string;
}

interface Contract {
  id: string;
  serviceName: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'expired';
  autoRenew: boolean;
  price: number;
}

const mockInvoices: Invoice[] = [
  {
    id: '1',
    number: 'INV-2024-001',
    date: '2024-03-01',
    dueDate: '2024-03-31',
    amount: 5000,
    status: 'paid',
    serviceId: '1',
    serviceName: 'Contabilidade Mensal'
  },
  {
    id: '2',
    number: 'INV-2024-002',
    date: '2024-04-01',
    dueDate: '2024-04-30',
    amount: 5000,
    status: 'pending',
    serviceId: '1',
    serviceName: 'Contabilidade Mensal'
  }
];

const mockContracts: Contract[] = [
  {
    id: '1',
    serviceName: 'Contabilidade Mensal',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    status: 'active',
    autoRenew: true,
    price: 5000
  }
];

export const ClientPortal: React.FC = () => {
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showNPSModal, setShowNPSModal] = useState(false);
  const [npsScore, setNpsScore] = useState(0);
  const [npsComment, setNpsComment] = useState('');

  const clientInfo = {
    companyName: 'Transportes Maputo Lda',
    representative: 'João Macamo',
    email: 'joao@transportesmaputo.mz',
    nuit: '400567890'
  };

  const salesperson = {
    name: 'Maria Silva',
    email: 'maria.silva@signius.com',
    phone: '+258 84 123 4567'
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-PT');
  };

  const getStatusBadge = (status: string, type: 'invoice' | 'contract' = 'invoice') => {
    if (type === 'invoice') {
      const statusConfig = {
        paid: { bg: 'bg-green-100', text: 'text-green-800', label: 'Paga' },
        pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pendente' },
        overdue: { bg: 'bg-red-100', text: 'text-red-800', label: 'Em Atraso' }
      };
      const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
      return (
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${config.bg} ${config.text}`}>
          {config.label}
        </span>
      );
    } else {
      const statusConfig = {
        active: { bg: 'bg-green-100', text: 'text-green-800', label: 'Ativo' },
        expired: { bg: 'bg-red-100', text: 'text-red-800', label: 'Expirado' }
      };
      const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.active;
      return (
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${config.bg} ${config.text}`}>
          {config.label}
        </span>
      );
    }
  };

  const handleNPSSubmit = () => {
    // Submit NPS feedback
    console.log('NPS Score:', npsScore, 'Comment:', npsComment);
    setShowNPSModal(false);
    setNpsScore(0);
    setNpsComment('');
    alert('Obrigado pelo seu feedback!');
  };

  const handleGenerateStatement = () => {
    const clientInfoForPDF: ClientInfo = {
      companyName: clientInfo.companyName,
      representative: clientInfo.representative,
      email: clientInfo.email,
      phone: '+258 84 567 890',
      nuit: clientInfo.nuit,
      address: 'Av. Eduardo Mondlane, 567, Maputo'
    };
    
    PDFGenerator.generateClientStatement(clientInfoForPDF, mockInvoices);
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-3 rounded-lg">
              <FileText className="text-blue-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Serviços Ativos</p>
              <p className="text-2xl font-bold text-gray-900">
                {mockContracts.filter(c => c.status === 'active').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-3 rounded-lg">
              <CreditCard className="text-green-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Faturas Pagas</p>
              <p className="text-2xl font-bold text-gray-900">
                {mockInvoices.filter(i => i.status === 'paid').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="bg-yellow-100 p-3 rounded-lg">
              <Calendar className="text-yellow-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Faturas Pendentes</p>
              <p className="text-2xl font-bold text-gray-900">
                {mockInvoices.filter(i => i.status === 'pending').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button 
            onClick={() => setActiveTab('invoices')}
            className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-left"
          >
            <FileText className="text-blue-600 mb-2" size={24} />
            <p className="font-medium text-gray-900">Ver Faturas</p>
            <p className="text-sm text-gray-600">Consultar faturas emitidas</p>
          </button>
          
          <button 
            onClick={() => setActiveTab('contracts')}
            className="p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors text-left"
          >
            <FileText className="text-green-600 mb-2" size={24} />
            <p className="font-medium text-gray-900">Meus Contratos</p>
            <p className="text-sm text-gray-600">Ver contratos ativos</p>
          </button>
          
          <button 
            onClick={handleGenerateStatement}
            className="p-4 border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-colors text-left"
          >
            <FileText className="text-indigo-600 mb-2" size={24} />
            <p className="font-medium text-gray-900">Gerar Extrato</p>
            <p className="text-sm text-gray-600">Baixar extrato da conta</p>
          </button>
          
          <button className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors text-left">
            <CreditCard className="text-purple-600 mb-2" size={24} />
            <p className="font-medium text-gray-900">Pagamentos</p>
            <p className="text-sm text-gray-600">Efetuar pagamentos</p>
          </button>
        </div>
      </div>
    </div>
  );

  const renderInvoices = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Minhas Faturas</h3>
        <div className="flex gap-3">
          <button 
            onClick={handleGenerateStatement}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <FileText size={16} />
            Gerar Extrato
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Número</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Serviço</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vencimento</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Valor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {mockInvoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{invoice.number}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{invoice.serviceName}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{formatDate(invoice.date)}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{formatDate(invoice.dueDate)}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{invoice.amount.toLocaleString()} MT</td>
                  <td className="px-6 py-4">{getStatusBadge(invoice.status, 'invoice')}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded">
                        <Eye size={16} />
                      </button>
                      <button className="text-green-600 hover:text-green-900 p-1 hover:bg-green-50 rounded">
                        <Download size={16} />
                      </button>
                      {invoice.status === 'pending' && (
                        <button className="text-purple-600 hover:text-purple-900 p-1 hover:bg-purple-50 rounded">
                          <CreditCard size={16} />
                        </button>
                      )}
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

  const renderContracts = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Meus Contratos</h3>
      </div>

      <div className="grid gap-6">
        {mockContracts.map((contract) => (
          <div key={contract.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="text-lg font-semibold text-gray-900">{contract.serviceName}</h4>
                <p className="text-gray-600">Período: {formatDate(contract.startDate)} - {formatDate(contract.endDate)}</p>
              </div>
              <div className="text-right">
                {getStatusBadge(contract.status, 'contract')}
                {contract.autoRenew && (
                  <div className="mt-2">
                    <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                      Renovação Automática
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-600">Valor Mensal</p>
                <p className="text-lg font-semibold text-gray-900">{contract.price.toLocaleString()} MT</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Próxima Renovação</p>
                <p className="text-lg font-semibold text-gray-900">{formatDate(contract.endDate)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Dias Restantes</p>
                <p className="text-lg font-semibold text-gray-900">
                  {Math.ceil((new Date(contract.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                <RefreshCw size={16} />
                Renovar Agora
              </button>
              <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
                <FileText size={16} />
                Ver Contrato
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: FileText },
    { id: 'invoices', label: 'Faturas', icon: CreditCard },
    { id: 'contracts', label: 'Contratos', icon: FileText }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-16 h-12 flex items-center justify-center">
                <img 
                  src="https://cdn.signius.pl/wp-content/uploads/2022/09/signius_logo_rgb.svg" 
                  alt="Signius Logo" 
                  className="w-14 h-10 object-contain"
                />
              </div>
              <div>
                <h1 className="font-semibold text-gray-900">{clientInfo.companyName}</h1>
                <p className="text-xs text-gray-500">Portal do Cliente - Signius</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{clientInfo.representative}</p>
                <p className="text-xs text-gray-500">{clientInfo.email}</p>
              </div>
              <button 
                onClick={() => setShowNPSModal(true)}
                className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2 text-sm font-medium"
              >
                <Star size={16} />
                Avaliar Serviço
              </button>
              <button 
                onClick={logout}
                className="text-gray-600 hover:text-red-600 p-2 hover:bg-red-50 rounded-lg transition-colors"
                title="Sair do Portal"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Salesperson Info */}
      {salesperson && (
        <div className="bg-blue-50 border-b border-blue-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-4">
                <span className="text-blue-800 font-medium">Seu Gestor:</span>
                <span className="text-blue-700">{salesperson.name}</span>
                <span className="text-blue-600">📧 {salesperson.email}</span>
                <span className="text-blue-600">📞 {salesperson.phone}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation */}
        <div className="mb-8">
          <nav className="flex space-x-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white'
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

        {/* Content */}
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'invoices' && renderInvoices()}
        {activeTab === 'contracts' && renderContracts()}
      </div>

      {/* NPS Modal */}
      {showNPSModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Avalie nosso serviço</h3>
            <p className="text-gray-600 mb-6">De 0 a 10, qual a probabilidade de recomendar nossos serviços?</p>
            
            <div className="flex justify-between mb-6">
              {[...Array(11)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setNpsScore(i)}
                  className={`w-8 h-8 rounded-full border-2 font-medium transition-colors ${
                    npsScore === i
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'border-gray-300 text-gray-700 hover:border-blue-300'
                  }`}
                >
                  {i}
                </button>
              ))}
            </div>
            
            <textarea
              value={npsComment}
              onChange={(e) => setNpsComment(e.target.value)}
              placeholder="Comentários adicionais (opcional)"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-6"
              rows={3}
            />
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowNPSModal(false)}
                className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleNPSSubmit}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Enviar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};