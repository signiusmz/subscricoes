import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Download, 
  FileText, 
  CreditCard, 
  Calendar, 
  Clock, 
  DollarSign,
  User,
  Mail,
  Phone,
  MapPin,
  Building,
  Star,
  Eye,
  Filter,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { Client, Service, Subscription } from '../../types';
import { PDFGenerator, ClientInfo, InvoiceData } from '../../utils/pdfGenerator';

interface ClientProfileProps {
  client: Client;
  onBack: () => void;
}

interface Invoice {
  id: string;
  number: string;
  date: string;
  dueDate: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  serviceId: string;
  serviceName: string;
  paymentDate?: string;
}

interface Payment {
  id: string;
  invoiceId: string;
  date: string;
  amount: number;
  method: 'cash' | 'transfer' | 'mpesa';
  reference?: string;
}

const mockServices: Service[] = [
  {
    id: '1',
    companyId: '1',
    name: 'Contabilidade Mensal',
    description: 'Serviço completo de contabilidade mensal',
    price: 5000,
    validity: 12,
    status: 'active',
    autoRenew: true
  },
  {
    id: '2',
    companyId: '1',
    name: 'Auditoria Anual',
    description: 'Auditoria externa das contas anuais',
    price: 15000,
    validity: 12,
    status: 'active',
    autoRenew: false
  }
];

const mockSubscriptions: Subscription[] = [
  {
    id: '1',
    companyId: '1',
    clientId: '1',
    serviceId: '1',
    status: 'active',
    nextBilling: '2024-12-01',
    reminderSent: false,
    npsScore: 9,
    npsComment: 'Excelente serviço, muito profissional'
  },
  {
    id: '2',
    companyId: '1',
    clientId: '1',
    serviceId: '2',
    status: 'active',
    nextBilling: '2024-11-15',
    reminderSent: true,
    npsScore: 8,
    npsComment: 'Bom serviço, mas pode melhorar a comunicação'
  }
];

const mockInvoices: Invoice[] = [
  {
    id: '1',
    number: 'INV-2024-001',
    date: '2024-01-01',
    dueDate: '2024-01-31',
    amount: 5000,
    status: 'paid',
    serviceId: '1',
    serviceName: 'Contabilidade Mensal',
    paymentDate: '2024-01-25'
  },
  {
    id: '2',
    number: 'INV-2024-002',
    date: '2024-02-01',
    dueDate: '2024-02-29',
    amount: 5000,
    status: 'paid',
    serviceId: '1',
    serviceName: 'Contabilidade Mensal',
    paymentDate: '2024-02-20'
  },
  {
    id: '3',
    number: 'INV-2024-003',
    date: '2024-03-01',
    dueDate: '2024-03-31',
    amount: 5000,
    status: 'paid',
    serviceId: '1',
    serviceName: 'Contabilidade Mensal',
    paymentDate: '2024-03-28'
  },
  {
    id: '4',
    number: 'INV-2024-004',
    date: '2024-04-01',
    dueDate: '2024-04-30',
    amount: 5000,
    status: 'pending',
    serviceId: '1',
    serviceName: 'Contabilidade Mensal'
  },
  {
    id: '5',
    number: 'INV-2024-005',
    date: '2024-02-01',
    dueDate: '2024-02-29',
    amount: 15000,
    status: 'paid',
    serviceId: '2',
    serviceName: 'Auditoria Anual',
    paymentDate: '2024-02-15'
  }
];

const mockPayments: Payment[] = [
  {
    id: '1',
    invoiceId: '1',
    date: '2024-01-25',
    amount: 5000,
    method: 'transfer',
    reference: 'TRF-001'
  },
  {
    id: '2',
    invoiceId: '2',
    date: '2024-02-20',
    amount: 5000,
    method: 'mpesa',
    reference: 'MP-002'
  },
  {
    id: '3',
    invoiceId: '3',
    date: '2024-03-28',
    amount: 5000,
    method: 'cash'
  },
  {
    id: '4',
    invoiceId: '5',
    date: '2024-02-15',
    amount: 15000,
    method: 'transfer',
    reference: 'TRF-004'
  }
];

export const ClientProfile: React.FC<ClientProfileProps> = ({ client, onBack }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [dateFilter, setDateFilter] = useState('all');

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-PT');
  };

  const formatAnniversary = (anniversary: string) => {
    const [month, day] = anniversary.split('-');
    const date = new Date(2000, parseInt(month) - 1, parseInt(day));
    return date.toLocaleDateString('pt-PT', { day: '2-digit', month: 'long' });
  };

  const getStatusBadge = (status: string, type: 'invoice' | 'subscription' = 'invoice') => {
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
        active: { bg: 'bg-green-100', text: 'text-green-800', label: 'Ativa' },
        cancelled: { bg: 'bg-red-100', text: 'text-red-800', label: 'Cancelada' },
        expired: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Expirada' }
      };
      const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.active;
      return (
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${config.bg} ${config.text}`}>
          {config.label}
        </span>
      );
    }
  };

  const getPaymentMethodLabel = (method: string) => {
    const methods = {
      cash: 'Dinheiro',
      transfer: 'Transferência',
      mpesa: 'M-Pesa'
    };
    return methods[method as keyof typeof methods] || method;
  };

  const getServiceName = (serviceId: string) => {
    const service = mockServices.find(s => s.id === serviceId);
    return service ? service.name : 'Serviço não encontrado';
  };

  const calculateAccountAge = () => {
    const createdDate = new Date(client.createdAt);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - createdDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const diffMonths = Math.floor(diffDays / 30);
    const diffYears = Math.floor(diffMonths / 12);
    
    if (diffYears > 0) {
      return `${diffYears} ano${diffYears > 1 ? 's' : ''} e ${diffMonths % 12} mês${diffMonths % 12 !== 1 ? 'es' : ''}`;
    } else if (diffMonths > 0) {
      return `${diffMonths} mês${diffMonths > 1 ? 'es' : ''}`;
    } else {
      return `${diffDays} dia${diffDays > 1 ? 's' : ''}`;
    }
  };

  const calculateTotalRevenue = () => {
    return mockInvoices
      .filter(inv => inv.status === 'paid')
      .reduce((total, inv) => total + inv.amount, 0);
  };

  const calculatePendingAmount = () => {
    return mockInvoices
      .filter(inv => inv.status === 'pending' || inv.status === 'overdue')
      .reduce((total, inv) => total + inv.amount, 0);
  };

  const getAverageNPS = () => {
    const scores = mockSubscriptions.filter(s => s.npsScore).map(s => s.npsScore!);
    if (scores.length === 0) return 0;
    return (scores.reduce((sum, score) => sum + score, 0) / scores.length).toFixed(1);
  };

  const handleDownloadStatement = () => {
    const clientInfo: ClientInfo = {
      companyName: client.companyName,
      representative: client.representative,
      email: client.email,
      phone: `${client.phoneCountryCode} ${client.phone}`,
      nuit: client.nuit,
      address: client.address
    };
    
    PDFGenerator.generateClientStatement(clientInfo, mockInvoices);
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Client Info Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center">
              <Building className="text-white" size={32} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{client.companyName}</h2>
              <p className="text-gray-600">NUIT: {client.nuit}</p>
              <p className="text-sm text-gray-500">Cliente desde {formatDate(client.createdAt)} • {calculateAccountAge()}</p>
            </div>
          </div>
          <div className="text-right">
            <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
              client.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {client.isActive ? 'Ativo' : 'Inativo'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <User className="text-gray-400" size={20} />
            <div>
              <p className="text-sm text-gray-600">Representante</p>
              <p className="font-medium text-gray-900">{client.representative}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Mail className="text-gray-400" size={20} />
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-medium text-gray-900">{client.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="text-gray-400" size={20} />
            <div>
              <p className="text-sm text-gray-600">Telefone</p>
              <p className="font-medium text-gray-900">{client.phoneCountryCode} {client.phone}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Calendar className="text-gray-400" size={20} />
            <div>
              <p className="text-sm text-gray-600">Aniversário</p>
              <p className="font-medium text-gray-900">{formatAnniversary(client.anniversary)}</p>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center gap-3">
            <MapPin className="text-gray-400" size={20} />
            <div>
              <p className="text-sm text-gray-600">Endereço</p>
              <p className="font-medium text-gray-900">{client.address}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Receita Total</p>
              <p className="text-2xl font-bold text-gray-900">{calculateTotalRevenue().toLocaleString()} MT</p>
            </div>
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-green-100 text-green-600">
              <DollarSign size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Valor Pendente</p>
              <p className="text-2xl font-bold text-gray-900">{calculatePendingAmount().toLocaleString()} MT</p>
            </div>
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-yellow-100 text-yellow-600">
              <AlertCircle size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Serviços Ativos</p>
              <p className="text-2xl font-bold text-gray-900">
                {mockSubscriptions.filter(s => s.status === 'active').length}
              </p>
            </div>
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-blue-100 text-blue-600">
              <FileText size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Satisfação Média</p>
              <p className="text-2xl font-bold text-gray-900">{getAverageNPS()}</p>
            </div>
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-purple-100 text-purple-600">
              <Star size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Últimas Faturas</h3>
          <div className="space-y-3">
            {mockInvoices.slice(0, 5).map((invoice) => (
              <div key={invoice.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{invoice.number}</p>
                  <p className="text-sm text-gray-500">{invoice.serviceName}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">{invoice.amount.toLocaleString()} MT</p>
                  {getStatusBadge(invoice.status, 'invoice')}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Contratos Ativos</h3>
          <div className="space-y-3">
            {mockSubscriptions.filter(s => s.status === 'active').map((subscription) => (
              <div key={subscription.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{getServiceName(subscription.serviceId)}</p>
                  <p className="text-sm text-gray-500">Próxima cobrança: {formatDate(subscription.nextBilling)}</p>
                </div>
                <div className="text-right">
                  {subscription.npsScore && (
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Star size={12} />
                      {subscription.npsScore}
                    </div>
                  )}
                  {getStatusBadge(subscription.status, 'subscription')}
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
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Contratos e Subscrições</h3>
      </div>

      <div className="grid gap-6">
        {mockSubscriptions.map((subscription) => {
          const service = mockServices.find(s => s.id === subscription.serviceId);
          if (!service) return null;

          return (
            <div key={subscription.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">{service.name}</h4>
                  <p className="text-gray-600">{service.description}</p>
                </div>
                <div className="text-right">
                  {getStatusBadge(subscription.status, 'subscription')}
                  {service.autoRenew && (
                    <div className="mt-2">
                      <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                        Renovação Automática
                      </span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Valor</p>
                  <p className="text-lg font-semibold text-gray-900">{service.price.toLocaleString()} MT</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Validade</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {service.validity === 1 ? 'Mensal' : 
                     service.validity === 3 ? 'Trimestral' :
                     service.validity === 6 ? 'Semestral' : 'Anual'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Próxima Cobrança</p>
                  <p className="text-lg font-semibold text-gray-900">{formatDate(subscription.nextBilling)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Satisfação</p>
                  <div className="flex items-center gap-1">
                    {subscription.npsScore ? (
                      <>
                        <Star className="text-yellow-500" size={16} />
                        <span className="text-lg font-semibold text-gray-900">{subscription.npsScore}</span>
                      </>
                    ) : (
                      <span className="text-gray-400">Não avaliado</span>
                    )}
                  </div>
                </div>
              </div>

              {subscription.npsComment && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Comentário de Satisfação:</p>
                  <p className="text-gray-900">"{subscription.npsComment}"</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderAccountStatement = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Extrato da Conta</h3>
        <div className="flex gap-3">
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Todos os períodos</option>
            <option value="2024">2024</option>
            <option value="2023">2023</option>
            <option value="last6months">Últimos 6 meses</option>
            <option value="last3months">Últimos 3 meses</option>
          </select>
          <button 
            onClick={handleDownloadStatement}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Download size={16} />
            Baixar PDF
          </button>
        </div>
      </div>

      {/* Account Summary */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Resumo da Conta</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Total Faturado</p>
            <p className="text-2xl font-bold text-gray-900">
              {mockInvoices.reduce((total, inv) => total + inv.amount, 0).toLocaleString()} MT
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Total Pago</p>
            <p className="text-2xl font-bold text-green-600">
              {calculateTotalRevenue().toLocaleString()} MT
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Saldo Pendente</p>
            <p className="text-2xl font-bold text-yellow-600">
              {calculatePendingAmount().toLocaleString()} MT
            </p>
          </div>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fatura</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Serviço</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vencimento</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Valor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pagamento</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {mockInvoices.map((invoice) => {
                const payment = mockPayments.find(p => p.invoiceId === invoice.id);
                
                return (
                  <tr key={invoice.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{invoice.number}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{invoice.serviceName}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{formatDate(invoice.date)}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{formatDate(invoice.dueDate)}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{invoice.amount.toLocaleString()} MT</td>
                    <td className="px-6 py-4">{getStatusBadge(invoice.status, 'invoice')}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {payment ? (
                        <div>
                          <p>{formatDate(payment.date)}</p>
                          <p className="text-xs text-gray-500">{getPaymentMethodLabel(payment.method)}</p>
                          {payment.reference && (
                            <p className="text-xs text-gray-500">{payment.reference}</p>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded">
                          <Eye size={16} />
                        </button>
                        <button 
                          onClick={() => {
                            const invoiceData: InvoiceData = {
                              number: invoice.number,
                              date: invoice.date,
                              dueDate: invoice.dueDate,
                              clientInfo: {
                                companyName: client.companyName,
                                representative: client.representative,
                                email: client.email,
                                phone: `${client.phoneCountryCode} ${client.phone}`,
                                nuit: client.nuit,
                                address: client.address
                              },
                              serviceName: invoice.serviceName,
                              serviceDescription: 'Descrição detalhada do serviço prestado',
                              amount: invoice.amount,
                              paidAmount: payment?.amount,
                              status: invoice.status,
                              paymentMethod: payment?.method,
                              paidDate: payment?.date,
                              notes: undefined
                            };
                            PDFGenerator.generateInvoice(invoiceData);
                          }}
                          className="text-green-600 hover:text-green-900 p-1 hover:bg-green-50 rounded"
                        >
                          <Download size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'overview', label: 'Visão Geral', icon: TrendingUp },
    { id: 'contracts', label: 'Contratos', icon: FileText },
    { id: 'statement', label: 'Extrato da Conta', icon: CreditCard }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Perfil do Cliente</h1>
          <p className="text-gray-600">Informações detalhadas e histórico completo</p>
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
      {activeTab === 'contracts' && renderContracts()}
      {activeTab === 'statement' && renderAccountStatement()}
    </div>
  );
};