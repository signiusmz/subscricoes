import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, Clock, Calendar, DollarSign, Users, UserCheck, UserX, AlertTriangle, CheckCircle, XCircle, Star, Eye, Download, RefreshCw, Bell, MessageSquare, TrendingUp, Filter, X, FileText, CreditCard, Mail, Smartphone } from 'lucide-react';
import { Subscription, Client, Service } from '../../types';
import { PDFGenerator } from '../../utils/pdfGenerator';

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
  },
  {
    id: '3',
    companyId: '1',
    name: 'Consultoria Fiscal',
    description: 'Consultoria em questões fiscais e tributárias',
    price: 3000,
    validity: 6,
    status: 'expired',
    autoRenew: false
  },
  {
    id: '4',
    companyId: '1',
    name: 'Declaração de IVA',
    description: 'Preparação e submissão de declarações de IVA',
    price: 2500,
    validity: 3,
    status: 'active',
    autoRenew: true
  },
  {
    id: '5',
    companyId: '1',
    name: 'Folha de Salários',
    description: 'Processamento mensal da folha de salários',
    price: 4000,
    validity: 12,
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
    nextBilling: '2024-12-01',
    reminderSent: false,
    npsScore: 9,
    npsComment: 'Excelente serviço, muito profissional'
  },
  {
    id: '2',
    companyId: '1',
    clientId: '2',
    serviceId: '2',
    status: 'active',
    nextBilling: '2024-11-15',
    reminderSent: true,
    npsScore: 8,
    npsComment: 'Bom serviço, mas pode melhorar a comunicação'
  },
  {
    id: '3',
    companyId: '1',
    clientId: '1',
    serviceId: '3',
    status: 'expired',
    nextBilling: '2024-01-01',
    reminderSent: true
  },
  {
    id: '4',
    companyId: '1',
    clientId: '3',
    serviceId: '4',
    status: 'active',
    nextBilling: '2024-12-15',
    reminderSent: false,
    npsScore: 7,
    npsComment: 'Serviço adequado, mas poderia ser mais rápido'
  },
  {
    id: '5',
    companyId: '1',
    clientId: '2',
    serviceId: '5',
    status: 'cancelled',
    nextBilling: '2024-10-01',
    reminderSent: false
  },
  {
    id: '6',
    companyId: '1',
    clientId: '1',
    serviceId: '4',
    status: 'active',
    nextBilling: '2024-11-30',
    reminderSent: true,
    npsScore: 10,
    npsComment: 'Perfeito! Muito satisfeito com o serviço'
  }
];

export const SubscriptionsTable: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'cancelled' | 'expired' | 'expiring_next_month' | 'expired_last_month'>('all');
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(mockSubscriptions);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [selectedSubscriptions, setSelectedSubscriptions] = useState<string[]>([]);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showNPSModal, setShowNPSModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [clientFilter, setClientFilter] = useState('');
  const [serviceFilter, setServiceFilter] = useState('');
  const [npsFilter, setNpsFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');

  const getDaysUntilBilling = (nextBilling: string) => {
    const today = new Date();
    const billing = new Date(nextBilling);
    const diffTime = billing.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getClientName = (clientId: string) => {
    const client = mockClients.find(c => c.id === clientId);
    return client ? client.companyName : 'Cliente não encontrado';
  };

  const getServiceName = (serviceId: string) => {
    const service = mockServices.find(s => s.id === serviceId);
    return service ? service.name : 'Serviço não encontrado';
  };

  const getServicePrice = (serviceId: string) => {
    const service = mockServices.find(s => s.id === serviceId);
    return service ? service.price : 0;
  };

  const filteredSubscriptions = mockSubscriptions.filter(subscription => {
    const clientName = getClientName(subscription.clientId);
    const serviceName = getServiceName(subscription.serviceId);
    const daysUntilBilling = getDaysUntilBilling(subscription.nextBilling);
    const today = new Date();
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
    const billingDate = new Date(subscription.nextBilling);
    
    const matchesSearch = clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         serviceName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesClient = !clientFilter || clientName.toLowerCase().includes(clientFilter.toLowerCase());
    const matchesService = !serviceFilter || serviceName.toLowerCase().includes(serviceFilter.toLowerCase());
    
    const matchesNPS = npsFilter === 'all' || 
                      (npsFilter === 'high' && subscription.npsScore && subscription.npsScore >= 9) ||
                      (npsFilter === 'medium' && subscription.npsScore && subscription.npsScore >= 7 && subscription.npsScore < 9) ||
                      (npsFilter === 'low' && subscription.npsScore && subscription.npsScore < 7);
    
    const matchesDateRange = !dateRange.start || !dateRange.end || 
                            (billingDate >= new Date(dateRange.start) && billingDate <= new Date(dateRange.end));
    
    if (!matchesSearch || !matchesClient || !matchesService || !matchesNPS || !matchesDateRange) return false;
    
    switch (statusFilter) {
      case 'all':
        return true;
      case 'active':
      case 'cancelled':
      case 'expired':
        return subscription.status === statusFilter;
      case 'expiring_next_month':
        return subscription.status === 'active' && 
               billingDate >= nextMonth && 
               billingDate < new Date(nextMonth.getFullYear(), nextMonth.getMonth() + 1, 1);
      case 'expired_last_month':
        return subscription.status === 'expired' && 
               billingDate >= lastMonth && 
               billingDate <= endOfLastMonth;
      default:
        return true;
    }
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
        <Icon size={10} />
        {config.label}
      </span>
    );
  };

  const getNPSBadge = (score?: number) => {
    if (!score) return (
      <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
        Não avaliado
      </span>
    );
    
    let color = 'bg-red-100 text-red-800';
    let label = 'Detrator';
    if (score >= 9) {
      color = 'bg-green-100 text-green-800';
      label = 'Promotor';
    } else if (score >= 7) {
      color = 'bg-yellow-100 text-yellow-800';
      label = 'Neutro';
    }
    
    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${color} flex items-center gap-1`}>
        <Star size={10} />
        {score} - {label}
      </span>
    );
  };

  const getPriorityBadge = (daysUntilBilling: number, status: string) => {
    if (status !== 'active') return null;
    
    if (daysUntilBilling <= 0) {
      return (
        <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full font-semibold">
          VENCIDA
        </span>
      );
    } else if (daysUntilBilling <= 7) {
      return (
        <span className="px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded-full font-semibold">
          URGENTE
        </span>
      );
    } else if (daysUntilBilling <= 30) {
      return (
        <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
          ATENÇÃO
        </span>
      );
    }
    return null;
  };

  const handleSendReminder = (subscriptionId: string) => {
    setSubscriptions(subscriptions.map(s => 
      s.id === subscriptionId 
        ? { ...s, reminderSent: true }
        : s
    ));
    alert('Lembrete enviado com sucesso!');
  };

  const handleRenewSubscription = (subscriptionId: string) => {
    // Create invoice for renewal
    const subscription = subscriptions.find(s => s.id === subscriptionId);
    if (!subscription) return;

    const invoiceNumber = `FAC-2024-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;
    
    // In a real app, this would create an invoice in the billing system
    alert(`Factura ${invoiceNumber} criada para renovação da subscrição!\nA factura foi adicionada ao módulo de Facturação.`);
    
    // Update subscription status
    setSubscriptions(subscriptions.map(s => 
      s.id === subscriptionId 
        ? { 
            ...s, 
            status: 'active' as const,
            nextBilling: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            reminderSent: false
          }
        : s
    ));
  };

  const handleSendBulkReminders = () => {
    const pendingReminders = subscriptions.filter(s => 
      s.status === 'active' && !s.reminderSent &&
      getDaysUntilBilling(s.nextBilling) <= 30
    );
    
    if (pendingReminders.length > 0) {
      setSubscriptions(subscriptions.map(s => 
        pendingReminders.some(pr => pr.id === s.id)
          ? { ...s, reminderSent: true }
          : s
      ));
      alert(`${pendingReminders.length} lembretes enviados com sucesso!`);
    } else {
      alert('Não há lembretes pendentes para enviar.');
    }
  };

  const handleBulkRenewal = () => {
    if (selectedSubscriptions.length === 0) {
      alert('Selecione pelo menos uma subscrição para renovar.');
      return;
    }
    
    const renewedCount = selectedSubscriptions.length;
    setSubscriptions(subscriptions.map(s => 
      selectedSubscriptions.includes(s.id)
        ? { 
            ...s, 
            status: 'active' as const,
            nextBilling: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            reminderSent: false
          }
        : s
    ));
    setSelectedSubscriptions([]);
    alert(`${renewedCount} subscrições renovadas com sucesso!`);
  };

  const handleBulkCancel = () => {
    if (selectedSubscriptions.length === 0) {
      alert('Selecione pelo menos uma subscrição para cancelar.');
      return;
    }
    
    if (confirm(`Tem certeza que deseja cancelar ${selectedSubscriptions.length} subscrições?`)) {
      setSubscriptions(subscriptions.map(s => 
        selectedSubscriptions.includes(s.id)
          ? { ...s, status: 'cancelled' as const }
          : s
      ));
      setSelectedSubscriptions([]);
      alert('Subscrições canceladas com sucesso!');
    }
  };

  const handleExportData = (format: 'csv' | 'excel' | 'pdf') => {
    const data = filteredSubscriptions.map(sub => ({
      Cliente: getClientName(sub.clientId),
      Serviço: getServiceName(sub.serviceId),
      Preço: `${getServicePrice(sub.serviceId)} MT`,
      Status: sub.status,
      'Próxima Cobrança': formatDate(sub.nextBilling),
      'NPS Score': sub.npsScore || 'N/A',
      'Lembrete Enviado': sub.reminderSent ? 'Sim' : 'Não',
      'Comentário NPS': sub.npsComment || 'N/A'
    }));
    
    console.log(`Exportando ${data.length} registros em formato ${format.toUpperCase()}`);
    alert(`Dados exportados em formato ${format.toUpperCase()}!`);
    setShowExportModal(false);
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

  const handleAutoRenewals = () => {
    const renewableSubscriptions = subscriptions.filter(s => 
      s.status === 'active' && 
      getDaysUntilBilling(s.nextBilling) <= 0
    );
    
    if (renewableSubscriptions.length > 0) {
      setSubscriptions(subscriptions.map(s => 
        renewableSubscriptions.some(rs => rs.id === s.id)
          ? { 
              ...s, 
              nextBilling: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              reminderSent: false
            }
          : s
      ));
      alert(`${renewableSubscriptions.length} subscrições renovadas automaticamente!`);
    } else {
      alert('Não há subscrições para renovar automaticamente.');
    }
  };

  const handleSendNPSSurvey = () => {
    const eligibleSubscriptions = subscriptions.filter(s => 
      s.status === 'active' && !s.npsScore
    );
    
    if (eligibleSubscriptions.length > 0) {
      alert(`Pesquisa NPS enviada para ${eligibleSubscriptions.length} clientes!`);
      setShowNPSModal(true);
    } else {
      alert('Todos os clientes elegíveis já responderam à pesquisa NPS.');
    }
  };

  const handleCheckExpiring = () => {
    const expiringSubscriptions = subscriptions.filter(s => {
      const days = getDaysUntilBilling(s.nextBilling);
      return s.status === 'active' && days <= 7 && days > 0;
    });
    
    if (expiringSubscriptions.length > 0) {
      alert(`${expiringSubscriptions.length} subscrições expiram nos próximos 7 dias!`);
    } else {
      alert('Não há subscrições expirando nos próximos 7 dias.');
    }
  };

  const handleEditSubscription = (subscriptionId: string) => {
    const subscription = subscriptions.find(s => s.id === subscriptionId);
    if (subscription) {
      setSelectedSubscription(subscription);
      setShowAddModal(true);
    }
  };

  const handleViewDetails = (subscription: Subscription) => {
    setSelectedSubscription(subscription);
    setShowDetailsModal(true);
  };

  const handleDeleteSubscription = (subscriptionId: string) => {
    if (confirm('Tem certeza que deseja cancelar esta subscrição?')) {
      setSubscriptions(subscriptions.map(s => 
        s.id === subscriptionId 
          ? { ...s, status: 'cancelled' as const }
          : s
      ));
      alert('Subscrição cancelada com sucesso!');
    }
  };

  const handleSaveSubscription = (subscriptionData: Partial<Subscription>) => {
    if (selectedSubscription) {
      // Update existing subscription
      setSubscriptions(subscriptions.map(s => 
        s.id === selectedSubscription.id 
          ? { ...s, ...subscriptionData }
          : s
      ));
      alert('Subscrição atualizada com sucesso!');
    } else {
      // Add new subscription
      const newSubscription: Subscription = {
        id: Date.now().toString(),
        companyId: '1',
        clientId: subscriptionData.clientId || '',
        serviceId: subscriptionData.serviceId || '',
        status: 'active',
        nextBilling: subscriptionData.nextBilling || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        reminderSent: false
      };
      setSubscriptions([...subscriptions, newSubscription]);
      alert('Subscrição adicionada com sucesso!');
    }
    setShowAddModal(false);
    setSelectedSubscription(null);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setDateRange({ start: '', end: '' });
    setClientFilter('');
    setServiceFilter('');
    setNpsFilter('all');
  };

  const getMetrics = () => {
    const total = subscriptions.length;
    const active = subscriptions.filter(s => s.status === 'active').length;
    const expired = subscriptions.filter(s => s.status === 'expired').length;
    const cancelled = subscriptions.filter(s => s.status === 'cancelled').length;
    const expiring = subscriptions.filter(s => {
      const days = getDaysUntilBilling(s.nextBilling);
      return s.status === 'active' && days <= 30 && days > 0;
    }).length;
    const overdue = subscriptions.filter(s => {
      const days = getDaysUntilBilling(s.nextBilling);
      return s.status === 'active' && days <= 0;
    }).length;
    const totalRevenue = subscriptions
      .filter(s => s.status === 'active')
      .reduce((sum, s) => sum + getServicePrice(s.serviceId), 0);
    const avgNPS = subscriptions
      .filter(s => s.npsScore)
      .reduce((sum, s, _, arr) => sum + (s.npsScore || 0) / arr.length, 0);

    return { total, active, expired, cancelled, expiring, overdue, totalRevenue, avgNPS };
  };

  const metrics = getMetrics();

  const handleExportSubscriptions = (format: string) => {
    if (format === 'pdf') {
      const reportData = {
        title: 'Relatório de Subscrições',
        type: 'subscriptions',
        startDate: new Date().toLocaleDateString('pt-PT'),
        endDate: new Date().toLocaleDateString('pt-PT'),
        totalClients: filteredSubscriptions.length,
        totalRevenue: filteredSubscriptions.reduce((sum, sub) => sum + sub.customPrice, 0),
        averageNPS: filteredSubscriptions.reduce((sum, sub) => sum + (sub.npsScore || 0), 0) / filteredSubscriptions.length,
        data: filteredSubscriptions.map(sub => ({
          name: `${getClientName(sub.clientId)} - ${getServiceName(sub.serviceId)}`,
          value: sub.customPrice
        }))
      };
      PDFGenerator.generateReport(reportData);
    }
    setShowExportModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestão de Subscrições</h2>
          <p className="text-gray-600 mt-1">Gerir subscrições, lembretes e renovações automáticas</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus size={20} />
          Nova Subscrição
        </button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Subscrições</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.total}</p>
            </div>
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-blue-100 text-blue-600">
              <Users size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Subscrições Ativas</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.active}</p>
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
              <p className="text-2xl font-bold text-gray-900">{metrics.expiring}</p>
            </div>
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-orange-100 text-orange-600">
              <AlertTriangle size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Receita Mensal</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.totalRevenue.toLocaleString()} MT</p>
            </div>
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-emerald-100 text-emerald-600">
              <TrendingUp size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <button 
          onClick={handleSendBulkReminders}
          className="bg-orange-50 border border-orange-200 p-4 rounded-lg hover:bg-orange-100 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Bell className="text-orange-600" size={24} />
            <div className="text-left">
              <p className="font-semibold text-orange-900">Enviar Lembretes</p>
              <p className="text-sm text-orange-700">
                {subscriptions.filter(s => s.status === 'active' && !s.reminderSent && getDaysUntilBilling(s.nextBilling) <= 30).length} pendentes
              </p>
            </div>
          </div>
        </button>
        
        <button 
          onClick={handleAutoRenewals}
          className="bg-green-50 border border-green-200 p-4 rounded-lg hover:bg-green-100 transition-colors"
        >
          <div className="flex items-center gap-3">
            <RefreshCw className="text-green-600" size={24} />
            <div className="text-left">
              <p className="font-semibold text-green-900">Renovações Auto</p>
              <p className="text-sm text-green-700">
                {subscriptions.filter(s => s.status === 'active' && getDaysUntilBilling(s.nextBilling) <= 0).length} este mês
              </p>
            </div>
          </div>
        </button>
        
        <button 
          onClick={handleSendNPSSurvey}
          className="bg-purple-50 border border-purple-200 p-4 rounded-lg hover:bg-purple-100 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Star className="text-purple-600" size={24} />
            <div className="text-left">
              <p className="font-semibold text-purple-900">Pesquisa NPS</p>
              <p className="text-sm text-purple-700">
                {subscriptions.filter(s => s.npsScore).length} respostas
              </p>
            </div>
          </div>
        </button>
        
        <button 
          onClick={handleCheckExpiring}
          className="bg-red-50 border border-red-200 p-4 rounded-lg hover:bg-red-100 transition-colors"
        >
          <div className="flex items-center gap-3">
            <AlertTriangle className="text-red-600" size={24} />
            <div className="text-left">
              <p className="font-semibold text-red-900">A Expirar</p>
              <p className="text-sm text-red-700">
                {subscriptions.filter(s => {
                  const days = getDaysUntilBilling(s.nextBilling);
                  return s.status === 'active' && days <= 7 && days > 0;
                }).length} em 7 dias
              </p>
            </div>
          </div>
        </button>
      </div>

      {/* Bulk Actions Bar */}
      {selectedSubscriptions.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-blue-900">
                {selectedSubscriptions.length} subscrições selecionadas
              </span>
              <button
                onClick={() => setSelectedSubscriptions([])}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Limpar seleção
              </button>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleBulkRenewal}
                className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors"
              >
                Renovar Selecionadas
              </button>
              <button
                onClick={handleBulkCancel}
                className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
              >
                Cancelar Selecionadas
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Filtros</h3>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="text-blue-600 hover:text-blue-700 flex items-center gap-2"
          >
            <Filter size={16} />
            {showFilters ? 'Ocultar Filtros' : 'Mostrar Filtros'}
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-4">
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
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todos os Status</option>
              <option value="active">Ativas</option>
              <option value="cancelled">Canceladas</option>
              <option value="expired">Expiradas</option>
              <option value="expiring_next_month">Expiram Próximo Mês</option>
              <option value="expired_last_month">Expiradas Mês Passado</option>
            </select>
            <button
              onClick={() => setShowExportModal(true)}
              className="bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <Download size={16} />
              Exportar
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Data Início</label>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Data Fim</label>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cliente</label>
              <input
                type="text"
                placeholder="Filtrar por cliente"
                value={clientFilter}
                onChange={(e) => setClientFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">NPS</label>
              <select
                value={npsFilter}
                onChange={(e) => setNpsFilter(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Todos</option>
                <option value="high">Alto (9-10)</option>
                <option value="medium">Médio (7-8)</option>
                <option value="low">Baixo (0-6)</option>
              </select>
            </div>
            <div className="md:col-span-2 lg:col-span-4">
              <button
                onClick={clearFilters}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Limpar Filtros
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    checked={selectedSubscriptions.length === filteredSubscriptions.length && filteredSubscriptions.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente / Serviço
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Valor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Próxima Cobrança
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
              {filteredSubscriptions.map((subscription) => {
                const daysUntilBilling = getDaysUntilBilling(subscription.nextBilling);
                const priorityBadge = getPriorityBadge(daysUntilBilling, subscription.status);
                
                return (
                  <tr key={subscription.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedSubscriptions.includes(subscription.id)}
                        onChange={(e) => handleSelectSubscription(subscription.id, e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {getClientName(subscription.clientId)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {getServiceName(subscription.serviceId)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {getServicePrice(subscription.serviceId).toLocaleString()} MT
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center gap-1">
                        <Calendar size={12} />
                        {formatDate(subscription.nextBilling)}
                      </div>
                      {subscription.status === 'active' && (
                        <div className={`text-xs mt-1 ${
                          daysUntilBilling <= 7 ? 'text-red-600' : 
                          daysUntilBilling <= 30 ? 'text-orange-600' : 'text-gray-500'
                        }`}>
                          {daysUntilBilling > 0 ? `${daysUntilBilling} dias` : 'Vencida'}
                        </div>
                      )}
                      {subscription.reminderSent && (
                        <span className="inline-block mt-1 px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded">
                          Lembrete Enviado
                        </span>
                      )}
                      {priorityBadge && (
                        <div className="mt-1">
                          {priorityBadge}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(subscription.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getNPSBadge(subscription.npsScore)}
                      {subscription.npsComment && (
                        <div className="text-xs text-gray-500 mt-1 max-w-[200px] truncate">
                          "{subscription.npsComment}"
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleViewDetails(subscription)}
                          className="text-green-600 hover:text-green-900 p-1 hover:bg-green-50 rounded"
                          title="Ver detalhes"
                        >
                          <Eye size={16} />
                        </button>
                        <button 
                          onClick={() => handleEditSubscription(subscription.id)}
                          className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded"
                          title="Editar"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => handleSendReminder(subscription.id)}
                          className="text-orange-600 hover:text-orange-900 p-1 hover:bg-orange-50 rounded"
                          title="Enviar lembrete"
                        >
                          <Bell size={16} />
                        </button>
                        <button 
                          onClick={() => handleRenewSubscription(subscription.id)}
                          className="text-green-600 hover:text-green-900 p-1 hover:bg-green-50 rounded"
                          title="Renovar"
                        >
                          <FileText size={16} />
                        </button>
                        <button 
                          onClick={() => handleDeleteSubscription(subscription.id)}
                          className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded"
                          title="Cancelar subscrição"
                        >
                          <Trash2 size={16} />
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

      {/* Add/Edit Subscription Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-4xl w-full mx-4 max-h-[95vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {selectedSubscription ? 'Editar Subscrição' : 'Nova Subscrição'}
            </h3>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const subscriptionData = {
                clientId: formData.get('clientId') as string,
                serviceId: formData.get('serviceId') as string,
                billingCycle: formData.get('billingCycle') as string,
                price: Number(formData.get('price')),
                nextBilling: formData.get('nextBilling') as string,
              };
              handleSaveSubscription(subscriptionData);
            }} className="space-y-6">
              {/* Seleção de Cliente e Serviço */}
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
                      defaultValue={selectedSubscription?.clientId || ''}
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
                      defaultValue={selectedSubscription?.serviceId || ''}
                      onChange={(e) => {
                        const selectedService = mockServices.find(s => s.id === e.target.value);
                        if (selectedService) {
                          const priceInput = document.querySelector('input[name="customPrice"]') as HTMLInputElement;
                          if (priceInput) {
                            priceInput.value = selectedService.price.toString();
                          }
                        }
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

              {/* Configurações de Cobrança */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <CreditCard size={18} className="text-green-600" />
                  Configurações de Cobrança
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ciclo de Cobrança *
                    </label>
                    <select
                      name="billingCycle"
                      defaultValue={selectedSubscription?.billingCycle || 'monthly'}
                      onChange={(e) => {
                        const today = new Date();
                        let nextBilling = new Date(today);
                        
                        switch (e.target.value) {
                          case 'monthly':
                            nextBilling.setMonth(today.getMonth() + 1);
                            break;
                          case 'quarterly':
                            nextBilling.setMonth(today.getMonth() + 3);
                            break;
                          case 'semiannual':
                            nextBilling.setMonth(today.getMonth() + 6);
                            break;
                          case 'annual':
                            nextBilling.setFullYear(today.getFullYear() + 1);
                            break;
                        }
                        
                        const nextBillingInput = document.querySelector('input[name="nextBilling"]') as HTMLInputElement;
                        if (nextBillingInput) {
                          nextBillingInput.value = nextBilling.toISOString().split('T')[0];
                        }
                      }}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="monthly">Mensal</option>
                      <option value="quarterly">Trimestral</option>
                      <option value="semiannual">Semestral</option>
                      <option value="annual">Anual</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Valor (MT) *
                    </label>
                    <input
                      type="number"
                      name="customPrice"
                      defaultValue={selectedSubscription?.customPrice || ''}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Valor personalizado"
                      min="0"
                      step="0.01"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Valor será preenchido automaticamente ao selecionar o serviço
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Próxima Cobrança *
                    </label>
                    <input
                      type="date"
                      name="nextBilling"
                      defaultValue={selectedSubscription?.nextBilling || ''}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Data será calculada automaticamente baseada no ciclo
                    </p>
                  </div>
                </div>
              </div>

              {/* Observações */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText size={18} className="text-purple-600" />
                  Observações (Opcional)
                </h4>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cliente
                  </label>
                  <textarea
                    name="notes"
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Adicione observações sobre esta subscrição..."
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Data será calculada automaticamente baseada no ciclo selecionado
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setSelectedSubscription(null);
                  }}
                  className="flex-1 border border-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  {selectedSubscription ? 'Atualizar' : 'Adicionar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Subscription Details Modal */}
      {showDetailsModal && selectedSubscription && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Detalhes da Subscrição</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
                  <p className="text-gray-900">{getClientName(selectedSubscription.clientId)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Serviço</label>
                  <p className="text-gray-900">{getServiceName(selectedSubscription.serviceId)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Valor</label>
                  <p className="text-gray-900">{(selectedSubscription.customPrice || getServicePrice(selectedSubscription.serviceId)).toLocaleString()} MT</p>
                  {selectedSubscription.billingCycle && (
                    <p className="text-sm text-gray-500">
                      Ciclo: {selectedSubscription.billingCycle === 'monthly' ? 'Mensal' :
                             selectedSubscription.billingCycle === 'quarterly' ? 'Trimestral' :
                             selectedSubscription.billingCycle === 'semiannual' ? 'Semestral' : 'Anual'}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <div>{getStatusBadge(selectedSubscription.status)}</div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Próxima Cobrança</label>
                  <p className="text-gray-900">{formatDate(selectedSubscription.nextBilling)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Lembrete Enviado</label>
                  <p className="text-gray-900">{selectedSubscription.reminderSent ? 'Sim' : 'Não'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">NPS Score</label>
                  <div>{getNPSBadge(selectedSubscription.npsScore)}</div>
                </div>
                {selectedSubscription.npsComment && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Comentário NPS</label>
                    <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">"{selectedSubscription.npsComment}"</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex gap-3 pt-6 border-t border-gray-200 mt-6">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Fechar
              </button>
              <button
                onClick={() => {
                  setShowDetailsModal(false);
                  handleEditSubscription(selectedSubscription.id);
                }}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Editar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Exportar Dados</h3>
            <p className="text-gray-600 mb-6">Exportar subscrições em formato PDF:</p>
            
            <button
              onClick={() => handleExportSubscriptions('pdf')}
              className="w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2 mb-4"
            >
              <FileText size={16} />
              Exportar como PDF
            </button>
            
            <button
              onClick={() => setShowExportModal(false)}
              className="w-full border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* NPS Survey Modal */}
      {showNPSModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Pesquisa NPS Enviada</h3>
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="text-green-600" size={32} />
              </div>
              <p className="text-gray-600">
                A pesquisa NPS foi enviada com sucesso para os clientes elegíveis via:
              </p>
            </div>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <Mail className="text-blue-600" size={20} />
                <span className="text-blue-900">Email</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <MessageSquare className="text-green-600" size={20} />
                <span className="text-green-900">WhatsApp</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                <Smartphone className="text-purple-600" size={20} />
                <span className="text-purple-900">SMS</span>
              </div>
            </div>
            
            <button
              onClick={() => setShowNPSModal(false)}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};