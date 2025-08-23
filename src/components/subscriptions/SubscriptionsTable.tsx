import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, Calendar, Clock, DollarSign, Users, CheckCircle, AlertCircle, XCircle, RefreshCw, Star, Eye, Send, Filter, Download } from 'lucide-react';
import { Subscription, Service, Client } from '../../types';

interface ExtendedSubscription extends Subscription {
  clientName: string;
  serviceName: string;
  servicePrice: number;
  serviceValidity: number;
  daysUntilBilling: number;
}

const mockClients: Client[] = [
  {
    id: '1',
    companyId: '1',
    companyName: 'Transportes Maputo Lda',
    representative: 'João Macamo',
    email: 'joao@transportesmaputo.mz',
    phone: '84 123 4567',
    phoneCountryCode: '+258',
    nuit: '400567890',
    address: 'Av. Eduardo Mondlane, 567, Maputo',
    anniversary: '03-15',
    salespersonId: '1',
    createdAt: '2024-01-15',
    isActive: true
  },
  {
    id: '2',
    companyId: '1',
    companyName: 'Construções Beira SA',
    representative: 'Maria Santos',
    email: 'maria@construcoesbeira.mz',
    phone: '85 987 6543',
    phoneCountryCode: '+258',
    nuit: '400123789',
    address: 'Rua da Independência, 123, Beira',
    anniversary: '11-22',
    salespersonId: '2',
    createdAt: '2024-01-20',
    isActive: true
  },
  {
    id: '3',
    companyId: '1',
    companyName: 'Farmácia Central',
    representative: 'António Silva',
    email: 'antonio@farmaciacentral.mz',
    phone: '86 555 7777',
    phoneCountryCode: '+258',
    nuit: '400987654',
    address: 'Praça da Independência, 45, Nampula',
    anniversary: '07-08',
    salespersonId: '1',
    createdAt: '2024-02-01',
    isActive: false
  }
];

const mockServices: Service[] = [
  {
    id: '1',
    companyId: '1',
    name: 'Contabilidade Mensal',
    description: 'Serviço completo de contabilidade mensal',
    price: 5000,
    validity: 1,
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
  },
  {
    id: '3',
    companyId: '1',
    name: 'Consultoria Fiscal',
    description: 'Consultoria em questões fiscais e tributárias',
    price: 3000,
    validity: 6,
    status: 'active',
    autoRenew: true
  },
  {
    id: '4',
    companyId: '1',
    name: 'Declaração de IVA',
    description: 'Preparação e submissão de declarações de IVA',
    price: 2000,
    validity: 3,
    status: 'active',
    autoRenew: true
  }
];

const mockSubscriptions: Subscription[] = [
  {
    id: '1',
    companyId: '1',
    clientId: '1',
    serviceId: '1',
    status: 'active',
    nextBilling: '2024-05-01',
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
    nextBilling: '2024-12-01',
    reminderSent: true,
    npsScore: 8,
    npsComment: 'Bom serviço, mas pode melhorar a comunicação'
  },
  {
    id: '3',
    companyId: '1',
    clientId: '2',
    serviceId: '1',
    status: 'active',
    nextBilling: '2024-04-20',
    reminderSent: false
  },
  {
    id: '4',
    companyId: '1',
    clientId: '3',
    serviceId: '3',
    status: 'expired',
    nextBilling: '2024-02-01',
    reminderSent: true,
    npsScore: 6,
    npsComment: 'Serviço ok, mas preço alto'
  },
  {
    id: '5',
    companyId: '1',
    clientId: '4',
    serviceId: '4',
    status: 'active',
    nextBilling: '2024-04-15',
    reminderSent: false
  }
];

export const SubscriptionsTable: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'cancelled' | 'expired'>('all');
  const [reminderFilter, setReminderFilter] = useState<'all' | 'sent' | 'pending'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showNPSModal, setShowNPSModal] = useState(false);
  const [showRenewalModal, setShowRenewalModal] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState<Subscription | null>(null);
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(mockSubscriptions);
  const [selectedSubscriptions, setSelectedSubscriptions] = useState<string[]>([]);
  const [npsScore, setNpsScore] = useState(0);
  const [npsComment, setNpsComment] = useState('');

  const getExtendedSubscriptions = (): ExtendedSubscription[] => {
    return subscriptions.map(subscription => {
      const client = mockClients.find(c => c.id === subscription.clientId);
      const service = mockServices.find(s => s.id === subscription.serviceId);
      const daysUntilBilling = Math.ceil((new Date(subscription.nextBilling).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
      
      return {
        ...subscription,
        clientName: client?.companyName || 'Cliente não encontrado',
        serviceName: service?.name || 'Serviço não encontrado',
        servicePrice: service?.price || 0,
        serviceValidity: service?.validity || 1,
        daysUntilBilling
      };
    });
  };

  const filteredSubscriptions = getExtendedSubscriptions().filter(subscription => {
    const matchesSearch = subscription.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         subscription.serviceName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || subscription.status === statusFilter;
    
    const matchesReminder = reminderFilter === 'all' || 
                           (reminderFilter === 'sent' && subscription.reminderSent) ||
                           (reminderFilter === 'pending' && !subscription.reminderSent);
    
    return matchesSearch && matchesStatus && matchesReminder;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-PT');
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { bg: 'bg-green-100', text: 'text-green-800', label: 'Ativa', icon: CheckCircle },
      cancelled: { bg: 'bg-red-100', text: 'text-red-800', label: 'Cancelada', icon: XCircle },
      expired: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Expirada', icon: Clock }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.active;
    const Icon = config.icon;
    
    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${config.bg} ${config.text} flex items-center gap-1`}>
        <Icon size={12} />
        {config.label}
      </span>
    );
  };

  const getDaysUntilBillingBadge = (days: number) => {
    if (days < 0) {
      return (
        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
          Expirado há {Math.abs(days)} dias
        </span>
      );
    } else if (days <= 7) {
      return (
        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
          {days} dias restantes
        </span>
      );
    } else if (days <= 30) {
      return (
        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800">
          {days} dias restantes
        </span>
      );
    } else {
      return (
        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
          {days} dias restantes
        </span>
      );
    }
  };

  const handleAddSubscription = () => {
    setShowAddModal(true);
  };

  const handleEditSubscription = (subscription: Subscription) => {
    setEditingSubscription(subscription);
    setShowAddModal(true);
  };

  const handleDeleteSubscription = (subscriptionId: string) => {
    if (confirm('Tem certeza que deseja eliminar esta subscrição?')) {
      setSubscriptions(subscriptions.filter(s => s.id !== subscriptionId));
      alert('Subscrição eliminada com sucesso!');
    }
  };

  const handleRenewSubscription = (subscription: Subscription) => {
    setSelectedSubscription(subscription);
    setShowRenewalModal(true);
  };

  const handleProcessRenewal = (months: number) => {
    if (!selectedSubscription) return;
    
    const currentEndDate = new Date(selectedSubscription.nextBilling);
    const newBillingDate = new Date(currentEndDate);
    newBillingDate.setMonth(newBillingDate.getMonth() + months);
    
    setSubscriptions(subscriptions.map(s => 
      s.id === selectedSubscription.id 
        ? { 
            ...s, 
            nextBilling: newBillingDate.toISOString().split('T')[0],
            status: 'active',
            reminderSent: false,
            cycle: months
          }
        : s
    ));
    
    setShowRenewalModal(false);
    setSelectedSubscription(null);
    alert(`Subscrição renovada por ${months} mês${months > 1 ? 'es' : ''}!`);
  };

  const handleSendReminder = (subscriptionId: string) => {
    setSubscriptions(subscriptions.map(s => 
      s.id === subscriptionId 
        ? { ...s, reminderSent: true }
        : s
    ));
    alert('Lembrete enviado com sucesso!');
  };

  const handleBulkSendReminders = () => {
    if (selectedSubscriptions.length === 0) {
      alert('Selecione pelo menos uma subscrição');
      return;
    }
    
    setSubscriptions(subscriptions.map(s => 
      selectedSubscriptions.includes(s.id) 
        ? { ...s, reminderSent: true }
        : s
    ));
    
    setSelectedSubscriptions([]);
    alert(`Lembretes enviados para ${selectedSubscriptions.length} subscrição(ões)!`);
  };

  const handleRequestNPS = (subscription: Subscription) => {
    setSelectedSubscription(subscription);
    setShowNPSModal(true);
  };

  const handleSaveNPS = () => {
    if (!selectedSubscription) return;
    
    setSubscriptions(subscriptions.map(s => 
      s.id === selectedSubscription.id 
        ? { ...s, npsScore, npsComment }
        : s
    ));
    
    setShowNPSModal(false);
    setSelectedSubscription(null);
    setNpsScore(0);
    setNpsComment('');
    alert('Avaliação NPS registrada com sucesso!');
  };

  const handleSaveSubscription = (subscriptionData: Partial<Subscription>) => {
    if (editingSubscription) {
      setSubscriptions(subscriptions.map(s => 
        s.id === editingSubscription.id 
          ? { ...s, ...subscriptionData }
          : s
      ));
      alert('Subscrição atualizada com sucesso!');
    } else {
      const newSubscription: Subscription = {
        id: Date.now().toString(),
        companyId: '1',
        clientId: subscriptionData.clientId || '',
        serviceId: subscriptionData.serviceId || '',
        status: 'active',
        nextBilling: subscriptionData.nextBilling || new Date().toISOString().split('T')[0],
        reminderSent: false
      };
      setSubscriptions([...subscriptions, newSubscription]);
      alert('Subscrição adicionada com sucesso!');
    }
    setShowAddModal(false);
    setEditingSubscription(null);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedSubscriptions(filteredSubscriptions.map(s => s.id));
    } else {
      setSelectedSubscriptions([]);
    }
  };

  const handleSelectSubscription = (subscriptionId: string, checked: boolean) => {
    if (checked) {
      setSelectedSubscriptions([...selectedSubscriptions, subscriptionId]);
    } else {
      setSelectedSubscriptions(selectedSubscriptions.filter(id => id !== subscriptionId));
    }
  };

  const exportSubscriptions = () => {
    const csvContent = [
      ['Cliente', 'Serviço', 'Status', 'Próxima Cobrança', 'Valor', 'Lembrete Enviado', 'NPS'].join(','),
      ...filteredSubscriptions.map(sub => [
        sub.clientName,
        sub.serviceName,
        sub.status,
        formatDate(sub.nextBilling),
        sub.servicePrice.toString(),
        sub.reminderSent ? 'Sim' : 'Não',
        sub.npsScore?.toString() || 'N/A'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `subscricoes-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestão de Subscrições</h2>
          <p className="text-gray-600 mt-1">Controlar renovações e acompanhar status dos contratos</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={exportSubscriptions}
            className="border border-blue-600 text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center gap-2"
          >
            <Download size={20} />
            Exportar
          </button>
          <button 
            onClick={handleAddSubscription}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus size={20} />
            Nova Subscrição
          </button>
        </div>
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
                {getExtendedSubscriptions().filter(s => s.daysUntilBilling <= 30 && s.daysUntilBilling > 0).length}
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
                {getExtendedSubscriptions()
                  .filter(s => s.status === 'active')
                  .reduce((total, s) => total + s.servicePrice, 0)
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
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
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
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Todos os Status</option>
            <option value="active">Ativas</option>
            <option value="cancelled">Canceladas</option>
            <option value="expired">Expiradas</option>
          </select>
          <select
            value={reminderFilter}
            onChange={(e) => setReminderFilter(e.target.value as any)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Todos os Lembretes</option>
            <option value="sent">Lembrete Enviado</option>
            <option value="pending">Lembrete Pendente</option>
          </select>
        </div>
        
        {selectedSubscriptions.length > 0 && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-800">
                {selectedSubscriptions.length} subscrição(ões) selecionada(s)
              </span>
              <button
                onClick={handleBulkSendReminders}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Send size={16} />
                Enviar Lembretes
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedSubscriptions.length === filteredSubscriptions.length && filteredSubscriptions.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Serviço
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Próxima Cobrança
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Valor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  NPS
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSubscriptions.map((subscription) => (
                <tr key={subscription.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedSubscriptions.includes(subscription.id)}
                      onChange={(e) => handleSelectSubscription(subscription.id, e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{subscription.clientName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{subscription.serviceName}</div>
                      <div className="text-sm text-gray-500">Validade: {subscription.serviceValidity} mês{subscription.serviceValidity > 1 ? 'es' : ''}</div>
                    </div>
                    <div className="text-sm text-gray-500">
                      Ciclo: {subscription.cycle || subscription.serviceValidity} mês{(subscription.cycle || subscription.serviceValidity) > 1 ? 'es' : ''}
                      {subscription.autoRenew && (
                        <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">Auto</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm text-gray-900">{formatDate(subscription.nextBilling)}</div>
                      {getDaysUntilBillingBadge(subscription.daysUntilBilling)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {(subscription.customPrice || subscription.servicePrice).toLocaleString()} MT
                      {subscription.customPrice && subscription.customPrice !== subscription.servicePrice && (
                        <div className="text-xs text-orange-600">Valor personalizado</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(subscription.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {subscription.npsScore ? (
                      <div className="flex items-center gap-1">
                        <Star className="text-yellow-500" size={14} />
                        <span className="text-sm font-medium text-gray-900">{subscription.npsScore}</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleRequestNPS(subscription)}
                        className="text-xs text-blue-600 hover:text-blue-800 underline"
                      >
                        Solicitar
                      </button>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleRenewSubscription(subscription)}
                        className="text-green-600 hover:text-green-900 p-1 hover:bg-green-50 rounded"
                        title="Renovar"
                      >
                        <RefreshCw size={16} />
                      </button>
                      <button 
                        onClick={() => handleSendReminder(subscription.id)}
                        className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded"
                        title="Enviar lembrete"
                      >
                        <Send size={16} />
                      </button>
                      <button 
                        onClick={() => handleEditSubscription(subscription)}
                        className="text-orange-600 hover:text-orange-900 p-1 hover:bg-orange-50 rounded"
                        title="Editar"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => handleDeleteSubscription(subscription.id)}
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

      {/* Add/Edit Subscription Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {editingSubscription ? 'Editar Subscrição' : 'Nova Subscrição'}
            </h3>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              
              // Calculate contract end date based on cycle
              const startDate = new Date(formData.get('startDate') as string);
              const cycle = parseInt(formData.get('cycle') as string);
              const endDate = new Date(startDate);
              endDate.setMonth(endDate.getMonth() + cycle);
              
              const subscriptionData = {
                clientId: formData.get('clientId') as string,
                serviceId: formData.get('serviceId') as string,
                startDate: formData.get('startDate') as string,
                nextBilling: endDate.toISOString().split('T')[0],
                cycle: cycle,
                customPrice: parseFloat(formData.get('customPrice') as string) || undefined,
                autoRenew: formData.get('autoRenew') === 'on'
              };
              handleSaveSubscription(subscriptionData);
            }} className="space-y-6">
              
              {/* Client and Service Selection */}
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
                      {mockClients.filter(c => c.isActive).map((client) => (
                        <option key={client.id} value={client.id}>{client.companyName}</option>
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                      onChange={(e) => {
                        const selectedService = mockServices.find(s => s.id === e.target.value);
                        const priceInput = document.querySelector('input[name="customPrice"]') as HTMLInputElement;
                        if (selectedService && priceInput) {
                          priceInput.value = selectedService.price.toString();
                        }
                      }}
                    >
                      <option value="">Selecionar serviço</option>
                      {mockServices.filter(s => s.status === 'active').map((service) => (
                        <option key={service.id} value={service.id}>
                          {service.name} - {service.price.toLocaleString()} MT
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Contract Details */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Calendar size={18} className="text-green-600" />
                  Detalhes do Contrato
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                      onChange={(e) => {
                        const startDate = new Date(e.target.value);
                        const cycleSelect = document.querySelector('select[name="cycle"]') as HTMLSelectElement;
                        const endDateInput = document.querySelector('input[name="endDate"]') as HTMLInputElement;
                        
                        if (cycleSelect && endDateInput) {
                          const cycle = parseInt(cycleSelect.value);
                          const endDate = new Date(startDate);
                          endDate.setMonth(endDate.getMonth() + cycle);
                          endDateInput.value = endDate.toISOString().split('T')[0];
                        }
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ciclo de Cobrança *
                    </label>
                    <select
                      name="cycle"
                      defaultValue={editingSubscription?.cycle || 1}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                      onChange={(e) => {
                        const startDateInput = document.querySelector('input[name="startDate"]') as HTMLInputElement;
                        const endDateInput = document.querySelector('input[name="endDate"]') as HTMLInputElement;
                        
                        if (startDateInput && endDateInput && startDateInput.value) {
                          const startDate = new Date(startDateInput.value);
                          const cycle = parseInt(e.target.value);
                          const endDate = new Date(startDate);
                          endDate.setMonth(endDate.getMonth() + cycle);
                          endDateInput.value = endDate.toISOString().split('T')[0];
                        }
                      }}
                    >
                      <option value={1}>1 mês (Mensal)</option>
                      <option value={3}>3 meses (Trimestral)</option>
                      <option value={6}>6 meses (Semestral)</option>
                      <option value={12}>12 meses (Anual)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Validade do Contrato *
                    </label>
                    <input
                      type="date"
                      name="endDate"
                      readOnly
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
                      title="Calculado automaticamente baseado no ciclo"
                    />
                  </div>
                </div>
              </div>

              {/* Pricing and Options */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <DollarSign size={18} className="text-purple-600" />
                  Preço e Opções
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Valor do Serviço (MT) *
                    </label>
                    <input
                      type="number"
                      name="customPrice"
                      step="0.01"
                      min="0"
                      placeholder="Valor será preenchido automaticamente"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Valor padrão do serviço. Pode ser editado para casos especiais.
                    </p>
                  </div>
                  <div className="flex items-center">
                    <div className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg w-full">
                      <input
                        type="checkbox"
                        name="autoRenew"
                        id="autoRenew"
                        defaultChecked={editingSubscription?.autoRenew || false}
                        className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <div>
                        <label htmlFor="autoRenew" className="block text-sm font-medium text-gray-900">
                          Renovação Automática
                        </label>
                        <p className="text-xs text-gray-600">
                          Renovar automaticamente no final do ciclo
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h4 className="text-md font-semibold text-blue-900 mb-3 flex items-center gap-2">
                  <CheckCircle size={18} className="text-blue-600" />
                  Resumo da Subscrição
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-blue-700"><strong>Cliente:</strong> <span id="summary-client">Selecione um cliente</span></p>
                    <p className="text-blue-700"><strong>Serviço:</strong> <span id="summary-service">Selecione um serviço</span></p>
                  </div>
                  <div>
                    <p className="text-blue-700"><strong>Ciclo:</strong> <span id="summary-cycle">Selecione o ciclo</span></p>
                    <p className="text-blue-700"><strong>Valor:</strong> <span id="summary-price">0 MT</span></p>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3 pt-6 border-t border-gray-200">
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
                  {editingSubscription ? 'Atualizar' : 'Adicionar'}
                </button>
              </div>
            </form>
            
            {/* JavaScript for dynamic updates */}
            <script dangerouslySetInnerHTML={{
              __html: `
                // Update summary when form changes
                document.addEventListener('change', function(e) {
                  if (e.target.name === 'clientId') {
                    const clientSelect = e.target;
                    const clientName = clientSelect.options[clientSelect.selectedIndex].text;
                    document.getElementById('summary-client').textContent = clientName !== 'Selecionar cliente' ? clientName : 'Selecione um cliente';
                  }
                  
                  if (e.target.name === 'serviceId') {
                    const serviceSelect = e.target;
                    const serviceName = serviceSelect.options[serviceSelect.selectedIndex].text;
                    document.getElementById('summary-service').textContent = serviceName !== 'Selecionar serviço' ? serviceName.split(' - ')[0] : 'Selecione um serviço';
                  }
                  
                  if (e.target.name === 'cycle') {
                    const cycleSelect = e.target;
                    const cycleName = cycleSelect.options[cycleSelect.selectedIndex].text;
                    document.getElementById('summary-cycle').textContent = cycleName;
                  }
                  
                  if (e.target.name === 'customPrice') {
                    const price = parseFloat(e.target.value) || 0;
                    document.getElementById('summary-price').textContent = price.toLocaleString() + ' MT';
                  }
                });
              `
            }} />
          </div>
        </div>
      )}

      {/* Renewal Modal */}
      {showRenewalModal && selectedSubscription && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Renovar Subscrição</h3>
            
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Cliente: <span className="font-medium">{getExtendedSubscriptions().find(s => s.id === selectedSubscription.id)?.clientName}</span></p>
              <p className="text-sm text-gray-600">Serviço: <span className="font-medium">{getExtendedSubscriptions().find(s => s.id === selectedSubscription.id)?.serviceName}</span></p>
            </div>
            
            <div className="space-y-3">
              <button
                onClick={() => handleProcessRenewal(1)}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Renovar por 1 mês
              </button>
              <button
                onClick={() => handleProcessRenewal(3)}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors"
              >
                Renovar por 3 meses
              </button>
              <button
                onClick={() => handleProcessRenewal(6)}
                className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Renovar por 6 meses
              </button>
              <button
                onClick={() => handleProcessRenewal(12)}
                className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Renovar por 12 meses
              </button>
              <button
                onClick={() => {
                  setShowRenewalModal(false);
                  setSelectedSubscription(null);
                }}
                className="w-full border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* NPS Modal */}
      {showNPSModal && selectedSubscription && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Avaliação NPS</h3>
            <p className="text-gray-600 mb-6">
              Cliente: {getExtendedSubscriptions().find(s => s.id === selectedSubscription.id)?.clientName}
            </p>
            
            <div className="mb-6">
              <p className="text-sm font-medium text-gray-700 mb-3">
                De 0 a 10, qual a probabilidade de recomendar nossos serviços?
              </p>
              <div className="flex justify-between">
                {[...Array(11)].map((_, i) => (
                  <button
                    key={i}
                    type="button"
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
                onClick={() => {
                  setShowNPSModal(false);
                  setSelectedSubscription(null);
                  setNpsScore(0);
                  setNpsComment('');
                }}
                className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveNPS}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Salvar Avaliação
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};