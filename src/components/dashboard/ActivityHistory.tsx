import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Clock, 
  User, 
  FileText, 
  Bell, 
  DollarSign, 
  RefreshCw, 
  Filter, 
  Download, 
  Search,
  Calendar,
  TrendingUp,
  UserPlus,
  CreditCard,
  AlertCircle,
  CheckCircle,
  Mail,
  MessageSquare,
  Phone,
  Eye,
  Activity
} from 'lucide-react';
import { Pagination } from '../common/Pagination';

interface ActivityItem {
  id: string;
  type: 'client' | 'service' | 'notification' | 'payment' | 'renewal' | 'user' | 'system';
  category: 'success' | 'warning' | 'info' | 'error';
  title: string;
  description: string;
  time: string;
  value?: number;
  user?: string;
  client?: string;
  details?: any;
}

const mockActivities: ActivityItem[] = [
  {
    id: '1',
    type: 'payment',
    category: 'success',
    title: 'Pagamento Recebido',
    description: 'Pagamento de 5.000 MT recebido de Transportes Maputo Lda',
    time: '2024-04-01T14:30:00Z',
    value: 5000,
    client: 'Transportes Maputo Lda',
    user: 'João Silva'
  },
  {
    id: '2',
    type: 'client',
    category: 'success',
    title: 'Novo Cliente Registado',
    description: 'Hotel Polana foi adicionado como novo cliente',
    time: '2024-04-01T13:15:00Z',
    client: 'Hotel Polana',
    user: 'Maria Santos'
  },
  {
    id: '3',
    type: 'renewal',
    category: 'success',
    title: 'Renovação Automática',
    description: 'Contrato de Construções Beira SA renovado automaticamente',
    time: '2024-04-01T12:00:00Z',
    value: 15000,
    client: 'Construções Beira SA',
    user: 'Sistema'
  },
  {
    id: '4',
    type: 'notification',
    category: 'warning',
    title: 'Lembrete de Renovação',
    description: 'Lembrete enviado para 3 clientes com contratos a expirar',
    time: '2024-04-01T11:30:00Z',
    user: 'Sistema'
  },
  {
    id: '5',
    type: 'system',
    category: 'info',
    title: 'Relatório Gerado',
    description: 'Relatório mensal de receitas gerado automaticamente',
    time: '2024-04-01T10:00:00Z',
    user: 'Sistema'
  },
  {
    id: '6',
    type: 'client',
    category: 'info',
    title: 'Dados Atualizados',
    description: 'Farmácia Central atualizou informações de contacto',
    time: '2024-04-01T09:45:00Z',
    client: 'Farmácia Central',
    user: 'António Silva'
  },
  {
    id: '7',
    type: 'service',
    category: 'warning',
    title: 'Serviço Expirado',
    description: 'Consultoria Fiscal da Farmácia Central expirou',
    time: '2024-03-31T23:59:00Z',
    client: 'Farmácia Central',
    user: 'Sistema'
  },
  {
    id: '8',
    type: 'payment',
    category: 'warning',
    title: 'Fatura Vencida',
    description: 'Fatura de 8.000 MT de Construções Beira SA está vencida',
    time: '2024-03-31T18:00:00Z',
    value: 8000,
    client: 'Construções Beira SA',
    user: 'Sistema'
  },
  {
    id: '9',
    type: 'user',
    category: 'success',
    title: 'Novo Utilizador',
    description: 'Carlos Mendes foi adicionado como utilizador',
    time: '2024-03-31T16:20:00Z',
    user: 'João Silva'
  },
  {
    id: '10',
    type: 'notification',
    category: 'success',
    title: 'Email Enviado',
    description: 'Confirmação de pagamento enviada para Transportes Maputo Lda',
    time: '2024-03-31T15:10:00Z',
    client: 'Transportes Maputo Lda',
    user: 'Sistema'
  },
  {
    id: '11',
    type: 'payment',
    category: 'success',
    title: 'Pagamento M-Pesa',
    description: 'Pagamento de 3.000 MT via M-Pesa de Supermercado Shoprite',
    time: '2024-03-31T14:30:00Z',
    value: 3000,
    client: 'Supermercado Shoprite',
    user: 'Sistema'
  },
  {
    id: '12',
    type: 'service',
    category: 'info',
    title: 'Serviço Ativado',
    description: 'Declaração de IVA ativada para Hotel Polana',
    time: '2024-03-31T13:45:00Z',
    client: 'Hotel Polana',
    user: 'Maria Santos'
  },
  {
    id: '13',
    type: 'client',
    category: 'warning',
    title: 'Cliente Inativo',
    description: 'Farmácia Central marcada como inativa por falta de pagamento',
    time: '2024-03-31T12:00:00Z',
    client: 'Farmácia Central',
    user: 'João Silva'
  },
  {
    id: '14',
    type: 'renewal',
    category: 'error',
    title: 'Falha na Renovação',
    description: 'Renovação automática falhou para Águas de Maputo',
    time: '2024-03-31T11:15:00Z',
    client: 'Águas de Maputo',
    user: 'Sistema'
  },
  {
    id: '15',
    type: 'notification',
    category: 'success',
    title: 'Mensagens Enviadas',
    description: 'Lembretes via Email e WhatsApp enviados para 5 clientes',
    time: '2024-03-31T10:30:00Z',
    user: 'Sistema'
  }
];

interface ActivityHistoryProps {
  onBack: () => void;
}

export const ActivityHistory: React.FC<ActivityHistoryProps> = ({ onBack }) => {
  const [activities] = useState<ActivityItem[]>(mockActivities);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'client' | 'service' | 'notification' | 'payment' | 'renewal' | 'user' | 'system'>('all');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'success' | 'warning' | 'info' | 'error'>('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (activity.client && activity.client.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = typeFilter === 'all' || activity.type === typeFilter;
    const matchesCategory = categoryFilter === 'all' || activity.category === categoryFilter;
    
    let matchesDate = true;
    if (dateFilter !== 'all') {
      const activityDate = new Date(activity.time);
      const now = new Date();
      
      switch (dateFilter) {
        case 'today':
          matchesDate = activityDate.toDateString() === now.toDateString();
          break;
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          matchesDate = activityDate >= weekAgo;
          break;
        case 'month':
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          matchesDate = activityDate >= monthAgo;
          break;
      }
    }
    
    return matchesSearch && matchesType && matchesCategory && matchesDate;
  });

  // Pagination
  const totalPages = Math.ceil(filteredActivities.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedActivities = filteredActivities.slice(startIndex, startIndex + itemsPerPage);

  // Reset to first page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, typeFilter, categoryFilter, dateFilter]);

  const formatTime = (timeString: string) => {
    const date = new Date(timeString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Agora mesmo';
    if (diffMins < 60) return `${diffMins} minuto${diffMins > 1 ? 's' : ''} atrás`;
    if (diffHours < 24) return `${diffHours} hora${diffHours > 1 ? 's' : ''} atrás`;
    if (diffDays < 7) return `${diffDays} dia${diffDays > 1 ? 's' : ''} atrás`;
    
    return date.toLocaleDateString('pt-PT', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'client':
        return <User size={20} className="text-blue-600" />;
      case 'service':
        return <FileText size={20} className="text-green-600" />;
      case 'notification':
        return <Bell size={20} className="text-orange-600" />;
      case 'payment':
        return <DollarSign size={20} className="text-emerald-600" />;
      case 'renewal':
        return <RefreshCw size={20} className="text-purple-600" />;
      case 'user':
        return <UserPlus size={20} className="text-indigo-600" />;
      case 'system':
        return <Activity size={20} className="text-gray-600" />;
      default:
        return <Clock size={20} className="text-gray-600" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'success':
        return 'border-l-green-400 bg-green-50';
      case 'warning':
        return 'border-l-orange-400 bg-orange-50';
      case 'error':
        return 'border-l-red-400 bg-red-50';
      case 'info':
        return 'border-l-blue-400 bg-blue-50';
      default:
        return 'border-l-gray-300 bg-gray-50';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'success':
        return <CheckCircle size={16} className="text-green-600" />;
      case 'warning':
        return <AlertCircle size={16} className="text-orange-600" />;
      case 'error':
        return <AlertCircle size={16} className="text-red-600" />;
      case 'info':
        return <Bell size={16} className="text-blue-600" />;
      default:
        return <Clock size={16} className="text-gray-600" />;
    }
  };

  const getTypeLabel = (type: string) => {
    const labels = {
      client: 'Cliente',
      service: 'Serviço',
      notification: 'Notificação',
      payment: 'Pagamento',
      renewal: 'Renovação',
      user: 'Utilizador',
      system: 'Sistema'
    };
    return labels[type as keyof typeof labels] || type;
  };

  const exportActivities = () => {
    const csvContent = [
      ['Data/Hora', 'Tipo', 'Categoria', 'Título', 'Descrição', 'Cliente', 'Utilizador', 'Valor'].join(','),
      ...filteredActivities.map(activity => [
        new Date(activity.time).toLocaleString('pt-PT'),
        getTypeLabel(activity.type),
        activity.category,
        activity.title,
        activity.description,
        activity.client || '',
        activity.user || '',
        activity.value ? `${activity.value.toLocaleString()} MT` : ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `atividade-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Calculate statistics
  const stats = {
    total: activities.length,
    today: activities.filter(a => {
      const activityDate = new Date(a.time);
      const today = new Date();
      return activityDate.toDateString() === today.toDateString();
    }).length,
    success: activities.filter(a => a.category === 'success').length,
    warnings: activities.filter(a => a.category === 'warning').length,
    errors: activities.filter(a => a.category === 'error').length,
    totalValue: activities.filter(a => a.value).reduce((sum, a) => sum + (a.value || 0), 0)
  };

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
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">Histórico Completo de Atividade</h1>
          <p className="text-gray-600">Todas as ações e eventos do sistema em tempo real</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={exportActivities}
            className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <Download size={16} />
            Exportar
          </button>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <RefreshCw size={16} />
            Atualizar
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Activity className="text-blue-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <Clock className="text-orange-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Hoje</p>
              <p className="text-xl font-bold text-gray-900">{stats.today}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="text-green-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Sucessos</p>
              <p className="text-xl font-bold text-gray-900">{stats.success}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="text-yellow-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Avisos</p>
              <p className="text-xl font-bold text-gray-900">{stats.warnings}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="text-red-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Erros</p>
              <p className="text-xl font-bold text-gray-900">{stats.errors}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
              <DollarSign className="text-emerald-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Valor</p>
              <p className="text-xl font-bold text-gray-900">{stats.totalValue.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Pesquisar atividades..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Todos os Tipos</option>
            <option value="client">Clientes</option>
            <option value="service">Serviços</option>
            <option value="payment">Pagamentos</option>
            <option value="renewal">Renovações</option>
            <option value="notification">Notificações</option>
            <option value="user">Utilizadores</option>
            <option value="system">Sistema</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Todas as Categorias</option>
            <option value="success">Sucessos</option>
            <option value="warning">Avisos</option>
            <option value="info">Informações</option>
            <option value="error">Erros</option>
          </select>

          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Todos os Períodos</option>
            <option value="today">Hoje</option>
            <option value="week">Última Semana</option>
            <option value="month">Último Mês</option>
          </select>

          <button
            onClick={() => {
              setSearchTerm('');
              setTypeFilter('all');
              setCategoryFilter('all');
              setDateFilter('all');
            }}
            className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Limpar Filtros
          </button>
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Timeline de Atividades</h3>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Ao vivo • {filteredActivities.length} atividades</span>
          </div>
        </div>
        
        <div className="space-y-4">
          {paginatedActivities.map((activity, index) => (
            <div 
              key={activity.id} 
              className={`flex items-start gap-4 p-4 rounded-lg border-l-4 transition-all hover:shadow-sm ${getCategoryColor(activity.category)}`}
            >
              {/* Icon */}
              <div className="flex-shrink-0 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-200">
                {getIcon(activity.type)}
              </div>
              
              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-semibold text-gray-900">{activity.title}</h4>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        activity.category === 'success' ? 'bg-green-100 text-green-800' :
                        activity.category === 'warning' ? 'bg-orange-100 text-orange-800' :
                        activity.category === 'error' ? 'bg-red-100 text-red-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {getTypeLabel(activity.type)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{activity.description}</p>
                    
                    {/* Metadata */}
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock size={10} />
                        <span>{formatTime(activity.time)}</span>
                      </div>
                      {activity.client && (
                        <div className="flex items-center gap-1">
                          <User size={10} />
                          <span>{activity.client}</span>
                        </div>
                      )}
                      {activity.user && (
                        <div className="flex items-center gap-1">
                          <UserPlus size={10} />
                          <span>{activity.user}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Value and Category */}
                  <div className="text-right flex flex-col items-end gap-2">
                    {activity.value && (
                      <span className="text-sm font-semibold text-gray-900">
                        {activity.value.toLocaleString()} MT
                      </span>
                    )}
                    <div className="flex items-center gap-1">
                      {getCategoryIcon(activity.category)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={filteredActivities.length}
          itemsPerPage={itemsPerPage}
        />
      </div>

      {/* Activity Summary */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumo por Tipo</h3>
          <div className="space-y-3">
            {['client', 'payment', 'service', 'renewal', 'notification', 'user', 'system'].map(type => {
              const count = activities.filter(a => a.type === type).length;
              const percentage = (count / activities.length) * 100;
              
              return (
                <div key={type} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getIcon(type)}
                    <span className="text-sm font-medium text-gray-900">{getTypeLabel(type)}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full bg-blue-500"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-8">{count}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Atividade por Hora</h3>
          <div className="space-y-3">
            {Array.from({ length: 24 }, (_, hour) => {
              const hourActivities = activities.filter(a => {
                const activityHour = new Date(a.time).getHours();
                return activityHour === hour;
              }).length;
              const maxHourActivities = Math.max(...Array.from({ length: 24 }, (_, h) => 
                activities.filter(a => new Date(a.time).getHours() === h).length
              ));
              const percentage = maxHourActivities > 0 ? (hourActivities / maxHourActivities) * 100 : 0;
              
              if (hourActivities === 0) return null;
              
              return (
                <div key={hour} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 w-12">{hour.toString().padStart(2, '0')}:00</span>
                  <div className="flex-1 mx-3">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full bg-green-500"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-8">{hourActivities}</span>
                </div>
              );
            }).filter(Boolean)}
          </div>
        </div>
      </div>
    </div>
  );
};