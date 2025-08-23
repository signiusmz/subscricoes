import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, Calendar, Clock, DollarSign, Users, CheckCircle, AlertCircle, Eye, Filter, Download, RefreshCw, Calculator, Percent } from 'lucide-react';
import { Subscription, Service, Client } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { addInvoiceToGlobal } from '../billing/BillingModule';
import { Pagination } from '../common/Pagination';

// Mock data
const mockClients = [
  { id: '1', companyName: 'Transportes Maputo Lda', representative: 'João Macamo', email: 'joao@transportesmaputo.mz' },
  { id: '2', companyName: 'Construções Beira SA', representative: 'Maria Santos', email: 'maria@construcoesbeira.mz' },
  { id: '3', companyName: 'Hotel Polana', representative: 'Carlos Mendes', email: 'carlos@hotelpolana.mz' },
  { id: '4', companyName: 'Farmácia Central', representative: 'António Silva', email: 'antonio@farmaciacentral.mz' }
];

const mockServices = [
  { id: '1', name: 'Contabilidade Mensal', price: 5000, validity: 1 },
  { id: '2', name: 'Auditoria Anual', price: 15000, validity: 12 },
  { id: '3', name: 'Consultoria Fiscal', price: 3000, validity: 6 },
  { id: '4', name: 'Declaração de IVA', price: 2000, validity: 3 },
  { id: '5', name: 'Folha de Salários', price: 4000, validity: 1 }
];

interface EnhancedSubscription extends Subscription {
  quantity: number;
  unitPrice: number;
  subtotal: number;
  ivaRate: number;
  ivaAmount: number;
  totalWithIva: number;
  paymentCycle: 1 | 3 | 6 | 12; // months
  customRenewalDate?: string;
}

const mockSubscriptions: EnhancedSubscription[] = [
  {
    id: '1',
    companyId: '1',
    clientId: '1',
    serviceId: '1',
    status: 'active',
    startDate: '2024-01-01',
    nextBilling: '2024-04-01',
    cycle: 1,
    autoRenew: true,
    reminderSent: false,
    npsScore: 9,
    npsComment: 'Excelente serviço',
    quantity: 2,
    unitPrice: 5000,
    subtotal: 10000,
    ivaRate: 16,
    ivaAmount: 1600,
    totalWithIva: 11600,
    paymentCycle: 1
  },
  {
    id: '2',
    companyId: '1',
    clientId: '2',
    serviceId: '2',
    status: 'active',
    startDate: '2024-02-01',
    nextBilling: '2024-11-01',
    cycle: 12,
    autoRenew: false,
    reminderSent: true,
    npsScore: 8,
    npsComment: 'Bom serviço',
    quantity: 1,
    unitPrice: 15000,
    subtotal: 15000,
    ivaRate: 16,
    ivaAmount: 2400,
    totalWithIva: 17400,
    paymentCycle: 12,
    customRenewalDate: '2024-11-15'
  },
  {
    id: '3',
    companyId: '1',
    clientId: '3',
    serviceId: '3',
    status: 'expired',
    startDate: '2023-08-01',
    nextBilling: '2024-02-01',
    cycle: 6,
    autoRenew: false,
    reminderSent: false,
    quantity: 3,
    unitPrice: 3000,
    subtotal: 9000,
    ivaRate: 16,
    ivaAmount: 1440,
    totalWithIva: 10440,
    paymentCycle: 6
  }
];

interface SubscriptionsTableProps {
  initialFilters?: {
    statusFilter?: string;
    searchTerm?: string;
  };
}

export const SubscriptionsTable: React.FC<SubscriptionsTableProps> = ({ initialFilters }) => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState(initialFilters?.statusFilter || 'all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState<EnhancedSubscription | null>(null);
  const [subscriptions, setSubscriptions] = useState<EnhancedSubscription[]>(mockSubscriptions);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Calculation states for the form
  const [selectedService, setSelectedService] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [customPrice, setCustomPrice] = useState<number | null>(null);
  const [paymentCycle, setPaymentCycle] = useState<1 | 3 | 6 | 12>(1);
  const [customRenewalDate, setCustomRenewalDate] = useState('');

  // Listen for dashboard navigation filters
  React.useEffect(() => {
    const handleApplyFilters = (event: CustomEvent) => {
      const filters = event.detail;
      if (filters?.statusFilter) {
        setStatusFilter(filters.statusFilter);
      }
      if (filters?.searchTerm) {
        setSearchTerm(filters.searchTerm);
      }
    };

    window.addEventListener('applyDashboardFilters', handleApplyFilters as EventListener);
    
    return () => {
      window.removeEventListener('applyDashboardFilters', handleApplyFilters as EventListener);
    };
  }, []);

  // Apply initial filters from dashboard navigation
  React.useEffect(() => {
    if (initialFilters?.statusFilter) {
      setStatusFilter(initialFilters.statusFilter);
    }
    if (initialFilters?.searchTerm) {
      setSearchTerm(initialFilters.searchTerm);
    }
  }, [initialFilters]);

  // Calculate totals when form values change
  const calculateTotals = () => {
    if (!selectedService) return { subtotal: 0, ivaAmount: 0, totalWithIva: 0 };
    
    const unitPrice = customPrice || selectedService.price;
    const subtotal = unitPrice * quantity;
    const ivaAmount = (subtotal * 16) / 100;
    const totalWithIva = subtotal + ivaAmount;
    
    return { subtotal, ivaAmount, totalWithIva, unitPrice };
  };

  const { subtotal, ivaAmount, totalWithIva, unitPrice } = calculateTotals();

  const getClientName = (clientId: string) => {
    const client = mockClients.find(c => c.id === clientId);
    return client ? client.companyName : 'Cliente não encontrado';
  };

  const getServiceName = (serviceId: string) => {
    const service = mockServices.find(s => s.id === serviceId);
    return service ? service.name : 'Serviço não encontrado';
  };

  const filteredSubscriptions = subscriptions.filter(subscription => {
    const clientName = getClientName(subscription.clientId);
    const serviceName = getServiceName(subscription.serviceId);
    
    const matchesSearch = clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         serviceName.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (statusFilter === 'all') return matchesSearch;
    if (statusFilter === 'expiring') {
      const nextBilling = new Date(subscription.nextBilling);
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
      return matchesSearch && subscription.status === 'active' && nextBilling <= thirtyDaysFromNow;
    }
    return matchesSearch && subscription.status === statusFilter;
  });

  // Pagination
  const totalPages = Math.ceil(filteredSubscriptions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedSubscriptions = filteredSubscriptions.slice(startIndex, startIndex + itemsPerPage);

  // Reset to first page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-PT');
  };

  const getStatusBadge = (status: string) => {
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
  };

  const getCycleLabel = (cycle: number) => {
    const labels = {
      1: 'Mensal',
      3: 'Trimestral',
      6: 'Semestral',
      12: 'Anual'
    };
    return labels[cycle as keyof typeof labels] || `${cycle} meses`;
  };

  const handleAddSubscription = () => {
    setEditingSubscription(null);
    setSelectedService(null);
    setQuantity(1);
    setCustomPrice(null);
    setPaymentCycle(1);
    setCustomRenewalDate('');
    setShowAddModal(true);
  };

  const handleEditSubscription = (subscription: EnhancedSubscription) => {
    setEditingSubscription(subscription);
    const service = mockServices.find(s => s.id === subscription.serviceId);
    setSelectedService(service);
    setQuantity(subscription.quantity);
    setCustomPrice(subscription.customPrice || null);
    setPaymentCycle(subscription.paymentCycle);
    setCustomRenewalDate(subscription.customRenewalDate || '');
    setShowAddModal(true);
  };

  const handleDeleteSubscription = (subscriptionId: string) => {
    if (confirm('Tem certeza que deseja eliminar esta subscrição?')) {
      setSubscriptions(subscriptions.filter(s => s.id !== subscriptionId));
      alert('Subscrição eliminada com sucesso!');
    }
  };

  const generateInvoice = (subscription: EnhancedSubscription) => {
    const client = mockClients.find(c => c.id === subscription.clientId);
    const service = mockServices.find(s => s.id === subscription.serviceId);
    
    if (!client || !service) {
      alert('Erro: Cliente ou serviço não encontrado');
      return;
    }

    const newInvoice = {
      id: Date.now().toString(),
      number: `FAC-2024-${String(Date.now()).slice(-3)}`,
      subscriptionId: subscription.id,
      clientId: subscription.clientId,
      clientName: client.companyName,
      serviceName: `${service.name} (Qtd: ${subscription.quantity})`,
      amount: subscription.totalWithIva,
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'pending' as const
    };

    addInvoiceToGlobal(newInvoice);
    alert(`✅ Fatura gerada com sucesso!\n\n📄 Número: ${newInvoice.number}\n👤 Cliente: ${client.companyName}\n🛍️ Serviço: ${service.name}\n📊 Quantidade: ${subscription.quantity}\n💰 Valor Unitário: ${subscription.unitPrice.toLocaleString()} MT\n💵 Subtotal: ${subscription.subtotal.toLocaleString()} MT\n📈 IVA (16%): ${subscription.ivaAmount.toLocaleString()} MT\n💸 Total: ${subscription.totalWithIva.toLocaleString()} MT\n📅 Vencimento: ${formatDate(newInvoice.dueDate)}`);
  };

  const calculateNextBilling = (startDate: string, cycle: number, customDate?: string) => {
    if (customDate) {
      return customDate;
    }
    
    const start = new Date(startDate);
    const next = new Date(start);
    next.setMonth(next.getMonth() + cycle);
    return next.toISOString().split('T')[0];
  };

  const handleSaveSubscription = (subscriptionData: any) => {
    const service = mockServices.find(s => s.id === subscriptionData.serviceId);
    if (!service) {
      alert('Serviço não encontrado');
      return;
    }

    const unitPrice = subscriptionData.customPrice || service.price;
    const qty = subscriptionData.quantity;
    const subtotalCalc = unitPrice * qty;
    const ivaAmountCalc = (subtotalCalc * 16) / 100;
    const totalWithIvaCalc = subtotalCalc + ivaAmountCalc;

    const nextBilling = calculateNextBilling(
      subscriptionData.startDate,
      subscriptionData.paymentCycle,
      subscriptionData.customRenewalDate
    );

    if (editingSubscription) {
      // Update existing subscription
      setSubscriptions(subscriptions.map(s => 
        s.id === editingSubscription.id 
          ? { 
              ...s, 
              ...subscriptionData,
              quantity: qty,
              unitPrice: unitPrice,
              subtotal: subtotalCalc,
              ivaAmount: ivaAmountCalc,
              totalWithIva: totalWithIvaCalc,
              nextBilling: nextBilling
            }
          : s
      ));
      alert(`✅ Subscrição atualizada com sucesso!\n\n👤 Cliente: ${getClientName(subscriptionData.clientId)}\n🛍️ Serviço: ${service.name}\n📊 Quantidade: ${qty}\n💰 Preço Unitário: ${unitPrice.toLocaleString()} MT\n💵 Subtotal: ${subtotalCalc.toLocaleString()} MT\n📈 IVA (16%): ${ivaAmountCalc.toLocaleString()} MT\n💸 Total: ${totalWithIvaCalc.toLocaleString()} MT\n🔄 Ciclo: ${getCycleLabel(subscriptionData.paymentCycle)}\n📅 Próxima cobrança: ${formatDate(nextBilling)}`);
    } else {
      // Add new subscription
      const newSubscription: EnhancedSubscription = {
        id: Date.now().toString(),
        companyId: '1',
        clientId: subscriptionData.clientId,
        serviceId: subscriptionData.serviceId,
        status: 'active',
        startDate: subscriptionData.startDate,
        nextBilling: nextBilling,
        cycle: subscriptionData.paymentCycle,
        autoRenew: subscriptionData.autoRenew,
        reminderSent: false,
        quantity: qty,
        unitPrice: unitPrice,
        subtotal: subtotalCalc,
        ivaRate: 16,
        ivaAmount: ivaAmountCalc,
        totalWithIva: totalWithIvaCalc,
        paymentCycle: subscriptionData.paymentCycle,
        customRenewalDate: subscriptionData.customRenewalDate
      };
      setSubscriptions([...subscriptions, newSubscription]);
      alert(`✅ Nova subscrição criada com sucesso!\n\n👤 Cliente: ${getClientName(subscriptionData.clientId)}\n🛍️ Serviço: ${service.name}\n📊 Quantidade: ${qty}\n💰 Preço Unitário: ${unitPrice.toLocaleString()} MT\n💵 Subtotal: ${subtotalCalc.toLocaleString()} MT\n📈 IVA (16%): ${ivaAmountCalc.toLocaleString()} MT\n💸 Total: ${totalWithIvaCalc.toLocaleString()} MT\n🔄 Ciclo: ${getCycleLabel(subscriptionData.paymentCycle)}\n📅 Próxima cobrança: ${formatDate(nextBilling)}\n🟢 Status: Ativa`);
    }
    setShowAddModal(false);
    setEditingSubscription(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestão de Subscrições</h2>
          <p className="text-gray-600 mt-1">Gerir contratos e renovações automáticas</p>
        </div>
        <button 
          onClick={handleAddSubscription}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus size={20} />
          Nova Subscrição
        </button>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Subscrições</p>
              <p className="text-2xl font-bold text-gray-900">{subscriptions.length}</p>
            </div>
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-blue-100 text-blue-600">
              <Users size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Ativas</p>
              <p className="text-2xl font-bold text-gray-900">
                {subscriptions.filter(s => s.status === 'active').length}
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
              <p className="text-sm font-medium text-gray-600 mb-1">A Expirar (30 dias)</p>
              <p className="text-2xl font-bold text-gray-900">
                {subscriptions.filter(s => {
                  const nextBilling = new Date(s.nextBilling);
                  const thirtyDaysFromNow = new Date();
                  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
                  return s.status === 'active' && nextBilling <= thirtyDaysFromNow;
                }).length}
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
              <p className="text-sm font-medium text-gray-600 mb-1">Receita Mensal</p>
              <p className="text-2xl font-bold text-gray-900">
                {subscriptions
                  .filter(s => s.status === 'active' && s.paymentCycle === 1)
                  .reduce((total, s) => total + s.totalWithIva, 0)
                  .toLocaleString()} MT
              </p>
            </div>
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-emerald-100 text-emerald-600">
              <DollarSign size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Pesquisar subscrições..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">Todos os Status</option>
          <option value="active">Ativas</option>
          <option value="expiring">A Expirar</option>
          <option value="expired">Expiradas</option>
          <option value="cancelled">Canceladas</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Serviço</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantidade</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Valor Unit.</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subtotal</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">IVA (16%)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ciclo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Próxima Cobrança</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedSubscriptions.map((subscription) => (
                <tr key={subscription.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{getClientName(subscription.clientId)}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{getServiceName(subscription.serviceId)}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 text-center font-medium">{subscription.quantity}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{subscription.unitPrice.toLocaleString()} MT</td>
                  <td className="px-6 py-4 text-sm text-gray-900 font-medium">{subscription.subtotal.toLocaleString()} MT</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{subscription.ivaAmount.toLocaleString()} MT</td>
                  <td className="px-6 py-4 text-sm text-gray-900 font-bold">{subscription.totalWithIva.toLocaleString()} MT</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{getCycleLabel(subscription.paymentCycle)}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <div>
                      {formatDate(subscription.nextBilling)}
                      {subscription.customRenewalDate && (
                        <div className="text-xs text-blue-600">Personalizada</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">{getStatusBadge(subscription.status)}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => generateInvoice(subscription)}
                        className="text-green-600 hover:text-green-900 p-1 hover:bg-green-50 rounded"
                        title="Gerar Fatura"
                      >
                        <RefreshCw size={16} />
                      </button>
                      <button 
                        onClick={() => handleEditSubscription(subscription)}
                        className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded"
                        title="Editar"
                      >
                        <Edit size={16} />
                      </button>
                      {(user?.role === 'admin') && (
                        <button 
                          onClick={() => handleDeleteSubscription(subscription.id)}
                          className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded"
                          title="Eliminar"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={filteredSubscriptions.length}
          itemsPerPage={itemsPerPage}
        />
      </div>

      {/* Add/Edit Subscription Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-4xl w-full mx-4 max-h-[95vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              {editingSubscription ? 'Editar Subscrição' : 'Nova Subscrição'}
            </h3>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              
              const subscriptionData = {
                clientId: formData.get('clientId') as string,
                serviceId: formData.get('serviceId') as string,
                quantity: Number(formData.get('quantity')),
                customPrice: formData.get('customPrice') ? Number(formData.get('customPrice')) : null,
                paymentCycle: Number(formData.get('paymentCycle')) as 1 | 3 | 6 | 12,
                startDate: formData.get('startDate') as string,
                customRenewalDate: formData.get('customRenewalDate') as string || undefined,
                autoRenew: formData.get('autoRenew') === 'on'
              };
              handleSaveSubscription(subscriptionData);
            }} className="space-y-6">
              
              {/* Cliente e Serviço */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Users size={18} className="text-blue-600" />
                  Cliente e Serviço
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cliente *
                    </label>
                    <select
                      name="clientId"
                      defaultValue={editingSubscription?.clientId || ''}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Selecionar cliente</option>
                      {mockClients.map((client) => (
                        <option key={client.id} value={client.id}>
                          {client.companyName} - {client.representative}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Serviço *
                    </label>
                    <select
                      name="serviceId"
                      defaultValue={editingSubscription?.serviceId || ''}
                      onChange={(e) => {
                        const service = mockServices.find(s => s.id === e.target.value);
                        setSelectedService(service);
                        setCustomPrice(null); // Reset custom price when service changes
                      }}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Selecionar serviço</option>
                      {mockServices.map((service) => (
                        <option key={service.id} value={service.id}>
                          {service.name} - {service.price.toLocaleString()} MT
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Quantidade e Preços */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Calculator size={18} className="text-green-600" />
                  Quantidade e Preços
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quantidade *
                    </label>
                    <input
                      type="number"
                      name="quantity"
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      min="1"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preço Unitário (MT)
                    </label>
                    <input
                      type="number"
                      name="customPrice"
                      value={customPrice || (selectedService?.price || '')}
                      onChange={(e) => setCustomPrice(Number(e.target.value) || null)}
                      placeholder={selectedService ? selectedService.price.toString() : 'Selecione um serviço'}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={!selectedService}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {selectedService ? `Preço padrão: ${selectedService.price.toLocaleString()} MT` : 'Preço será preenchido automaticamente'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ciclo de Pagamento *
                    </label>
                    <select
                      name="paymentCycle"
                      value={paymentCycle}
                      onChange={(e) => setPaymentCycle(Number(e.target.value) as 1 | 3 | 6 | 12)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value={1}>Mensal</option>
                      <option value={3}>Trimestral</option>
                      <option value={6}>Semestral</option>
                      <option value={12}>Anual</option>
                    </select>
                  </div>
                </div>

                {/* Cálculos Automáticos */}
                {selectedService && (
                  <div className="mt-6 bg-white rounded-lg border border-gray-200 p-6">
                    <h5 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Calculator size={16} className="text-blue-600" />
                      Cálculos Automáticos
                    </h5>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-sm text-blue-600 mb-1">Preço Unitário</div>
                        <div className="text-lg font-bold text-blue-900">{unitPrice.toLocaleString()} MT</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-sm text-green-600 mb-1">Subtotal</div>
                        <div className="text-lg font-bold text-green-900">{subtotal.toLocaleString()} MT</div>
                        <div className="text-xs text-green-700">{quantity} × {unitPrice.toLocaleString()}</div>
                      </div>
                      <div className="text-center p-3 bg-orange-50 rounded-lg">
                        <div className="text-sm text-orange-600 mb-1 flex items-center justify-center gap-1">
                          <Percent size={12} />
                          IVA (16%)
                        </div>
                        <div className="text-lg font-bold text-orange-900">{ivaAmount.toLocaleString()} MT</div>
                      </div>
                      <div className="text-center p-3 bg-purple-50 rounded-lg border-2 border-purple-300">
                        <div className="text-sm text-purple-600 mb-1">Total com IVA</div>
                        <div className="text-xl font-bold text-purple-900">{totalWithIva.toLocaleString()} MT</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Datas e Renovação */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Calendar size={18} className="text-purple-600" />
                  Datas e Renovação
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Data de Início *
                    </label>
                    <input
                      type="date"
                      name="startDate"
                      defaultValue={editingSubscription?.startDate || new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Data de Renovação Personalizada (opcional)
                    </label>
                    <input
                      type="date"
                      name="customRenewalDate"
                      value={customRenewalDate}
                      onChange={(e) => setCustomRenewalDate(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Se não definida, será calculada automaticamente baseada no ciclo de pagamento
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex items-start gap-3">
                  <input
                    type="checkbox"
                    name="autoRenew"
                    id="autoRenew"
                    defaultChecked={editingSubscription?.autoRenew || false}
                    className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-0.5"
                  />
                  <div>
                    <label htmlFor="autoRenew" className="block text-sm font-medium text-gray-900">
                      Renovação Automática
                    </label>
                    <p className="text-sm text-gray-600 mt-1">
                      Quando ativado, a subscrição será renovada automaticamente na data de vencimento
                    </p>
                  </div>
                </div>

                {/* Preview da Próxima Cobrança */}
                {selectedService && (
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="text-blue-600" size={16} />
                      <span className="font-medium text-blue-900">Preview da Próxima Cobrança</span>
                    </div>
                    <div className="text-sm text-blue-800">
                      <p>
                        <strong>Data:</strong> {
                          customRenewalDate 
                            ? formatDate(customRenewalDate)
                            : 'Será calculada automaticamente baseada no ciclo'
                        }
                      </p>
                      <p><strong>Valor:</strong> {totalWithIva.toLocaleString()} MT (incluindo IVA)</p>
                      <p><strong>Ciclo:</strong> {getCycleLabel(paymentCycle)}</p>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex gap-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingSubscription(null);
                  }}
                  className="flex-1 border border-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  {editingSubscription ? 'Atualizar' : 'Criar Subscrição'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};