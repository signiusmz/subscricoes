import React, { useState } from 'react';
import { 
  Crown, 
  Trophy, 
  Medal, 
  Award, 
  Users, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Star,
  Target,
  Filter,
  Eye,
  Send,
  BarChart3,
  PieChart,
  Activity,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Building,
  Zap,
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  Download,
  ArrowLeft
} from 'lucide-react';

interface SegmentClient {
  id: string;
  companyName: string;
  representative: string;
  email: string;
  phone: string;
  address: string;
  ltv: number;
  totalRevenue: number;
  monthsAsClient: number;
  satisfactionScore: number;
  lastPayment: string;
  paymentBehavior: 'excellent' | 'good' | 'average' | 'poor';
  engagementLevel: number;
  contractsCount: number;
  averageMonthlyRevenue: number;
  churnRisk: number;
  segment: 'premium' | 'gold' | 'silver' | 'bronze';
  tags: string[];
}

interface Segment {
  id: string;
  name: string;
  description: string;
  criteria: SegmentCriteria;
  color: string;
  icon: React.ComponentType<any>;
  clients: SegmentClient[];
  metrics: SegmentMetrics;
  strategies: string[];
}

interface SegmentCriteria {
  minLTV?: number;
  maxLTV?: number;
  minSatisfaction?: number;
  minMonthsAsClient?: number;
  maxChurnRisk?: number;
  paymentBehavior?: string[];
  minEngagement?: number;
}

interface SegmentMetrics {
  totalClients: number;
  averageLTV: number;
  totalRevenue: number;
  averageSatisfaction: number;
  churnRate: number;
  growthRate: number;
  conversionRate: number;
  retentionRate: number;
}

const mockSegmentClients: SegmentClient[] = [
  {
    id: '1',
    companyName: 'Telecomunicações de Moçambique',
    representative: 'Isabel Machel',
    email: 'isabel@tmcel.mz',
    phone: '+258 84 200 300',
    address: 'Av. 25 de Setembro, 420, Maputo',
    ltv: 300000,
    totalRevenue: 200000,
    monthsAsClient: 5,
    satisfactionScore: 9.1,
    lastPayment: '2024-03-30',
    paymentBehavior: 'excellent',
    engagementLevel: 95,
    contractsCount: 3,
    averageMonthlyRevenue: 40000,
    churnRisk: 5,
    segment: 'premium',
    tags: ['VIP', 'High-Value', 'Strategic']
  },
  {
    id: '2',
    companyName: 'Petromoc',
    representative: 'Fernando Guebuza',
    email: 'fernando@petromoc.mz',
    phone: '+258 84 150 250',
    address: 'Av. Marginal, 1200, Maputo',
    ltv: 270000,
    totalRevenue: 180000,
    monthsAsClient: 4,
    satisfactionScore: 8.7,
    lastPayment: '2024-03-29',
    paymentBehavior: 'excellent',
    engagementLevel: 88,
    contractsCount: 2,
    averageMonthlyRevenue: 45000,
    churnRisk: 8,
    segment: 'premium',
    tags: ['Enterprise', 'High-Growth']
  },
  {
    id: '3',
    companyName: 'Banco Millennium',
    representative: 'Pedro Nunes',
    email: 'pedro@millennium.mz',
    phone: '+258 84 220 320',
    address: 'Av. 25 de Setembro, 1695, Maputo',
    ltv: 220000,
    totalRevenue: 150000,
    monthsAsClient: 6,
    satisfactionScore: 9.5,
    lastPayment: '2024-03-28',
    paymentBehavior: 'excellent',
    engagementLevel: 96,
    contractsCount: 4,
    averageMonthlyRevenue: 25000,
    churnRisk: 2,
    segment: 'gold',
    tags: ['Loyal', 'Financial']
  },
  {
    id: '4',
    companyName: 'Hotel Polana',
    representative: 'Carlos Mendes',
    email: 'carlos@hotelpolana.mz',
    phone: '+258 87 444 5555',
    address: 'Av. Julius Nyerere, 1380, Maputo',
    ltv: 140000,
    totalRevenue: 95000,
    monthsAsClient: 9,
    satisfactionScore: 9.0,
    lastPayment: '2024-03-18',
    paymentBehavior: 'good',
    engagementLevel: 85,
    contractsCount: 4,
    averageMonthlyRevenue: 10556,
    churnRisk: 10,
    segment: 'silver',
    tags: ['Hospitality', 'Stable']
  },
  {
    id: '5',
    companyName: 'Farmácia Central',
    representative: 'António Silva',
    email: 'antonio@farmaciacentral.mz',
    phone: '+258 86 555 7777',
    address: 'Praça da Independência, 45, Nampula',
    ltv: 65000,
    totalRevenue: 45000,
    monthsAsClient: 14,
    satisfactionScore: 8.5,
    lastPayment: '2024-03-15',
    paymentBehavior: 'average',
    engagementLevel: 65,
    contractsCount: 7,
    averageMonthlyRevenue: 3214,
    churnRisk: 35,
    segment: 'bronze',
    tags: ['Healthcare', 'At-Risk']
  }
];

const segments: Segment[] = [
  {
    id: 'premium',
    name: 'Premium Champions',
    description: 'Clientes de altíssimo valor com relacionamento excepcional',
    criteria: {
      minLTV: 200000,
      minSatisfaction: 9.0,
      maxChurnRisk: 10,
      paymentBehavior: ['excellent'],
      minEngagement: 90
    },
    color: 'from-purple-500 to-pink-500',
    icon: Crown,
    clients: mockSegmentClients.filter(c => c.segment === 'premium'),
    metrics: {
      totalClients: 2,
      averageLTV: 285000,
      totalRevenue: 380000,
      averageSatisfaction: 8.9,
      churnRate: 1.5,
      growthRate: 25.3,
      conversionRate: 95.2,
      retentionRate: 98.5
    },
    strategies: [
      'Atendimento VIP personalizado',
      'Gestor de conta dedicado',
      'Acesso antecipado a novos recursos',
      'Eventos exclusivos e networking',
      'Consultoria estratégica gratuita'
    ]
  },
  {
    id: 'gold',
    name: 'Gold Partners',
    description: 'Clientes valiosos com excelente potencial de crescimento',
    criteria: {
      minLTV: 100000,
      maxLTV: 199999,
      minSatisfaction: 8.5,
      maxChurnRisk: 15,
      paymentBehavior: ['excellent', 'good']
    },
    color: 'from-yellow-500 to-orange-500',
    icon: Trophy,
    clients: mockSegmentClients.filter(c => c.segment === 'gold'),
    metrics: {
      totalClients: 1,
      averageLTV: 220000,
      totalRevenue: 150000,
      averageSatisfaction: 9.5,
      churnRate: 3.2,
      growthRate: 18.7,
      conversionRate: 87.3,
      retentionRate: 96.8
    },
    strategies: [
      'Programa de fidelidade premium',
      'Ofertas de upgrade personalizadas',
      'Suporte prioritário',
      'Webinars exclusivos',
      'Desconto em novos serviços'
    ]
  },
  {
    id: 'silver',
    name: 'Silver Members',
    description: 'Clientes estáveis com bom relacionamento e potencial',
    criteria: {
      minLTV: 50000,
      maxLTV: 99999,
      minSatisfaction: 7.5,
      maxChurnRisk: 25
    },
    color: 'from-gray-400 to-gray-600',
    icon: Medal,
    clients: mockSegmentClients.filter(c => c.segment === 'silver'),
    metrics: {
      totalClients: 1,
      averageLTV: 140000,
      totalRevenue: 95000,
      averageSatisfaction: 9.0,
      churnRate: 8.1,
      growthRate: 12.4,
      conversionRate: 72.6,
      retentionRate: 91.9
    },
    strategies: [
      'Campanhas de upsell direcionadas',
      'Conteúdo educativo personalizado',
      'Check-ins mensais',
      'Ofertas sazonais',
      'Programa de referência'
    ]
  },
  {
    id: 'bronze',
    name: 'Bronze Starters',
    description: 'Novos clientes ou de menor valor com potencial de crescimento',
    criteria: {
      maxLTV: 49999,
      maxChurnRisk: 50
    },
    color: 'from-orange-600 to-red-500',
    icon: Award,
    clients: mockSegmentClients.filter(c => c.segment === 'bronze'),
    metrics: {
      totalClients: 1,
      averageLTV: 65000,
      totalRevenue: 45000,
      averageSatisfaction: 8.5,
      churnRate: 15.8,
      growthRate: 8.9,
      conversionRate: 58.3,
      retentionRate: 84.2
    },
    strategies: [
      'Onboarding intensivo',
      'Suporte proativo',
      'Ofertas de crescimento',
      'Educação sobre valor',
      'Acompanhamento semanal'
    ]
  }
];

export const ClientSegmentation: React.FC = () => {
  const [selectedSegment, setSelectedSegment] = useState<string>('premium');
  const [viewMode, setViewMode] = useState<'overview' | 'clients' | 'strategies'>('overview');
  const [showSegmentDetails, setShowSegmentDetails] = useState(false);

  const currentSegment = segments.find(s => s.id === selectedSegment) || segments[0];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-PT');
  };

  const getPaymentBehaviorColor = (behavior: string) => {
    switch (behavior) {
      case 'excellent':
        return 'bg-green-100 text-green-800';
      case 'good':
        return 'bg-blue-100 text-blue-800';
      case 'average':
        return 'bg-yellow-100 text-yellow-800';
      case 'poor':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getChurnRiskColor = (risk: number) => {
    if (risk <= 10) return 'text-green-600';
    if (risk <= 25) return 'text-yellow-600';
    if (risk <= 50) return 'text-orange-600';
    return 'text-red-600';
  };

  const executeSegmentStrategy = (segmentName: string, strategy: string) => {
    alert(`🎯 Executando estratégia para segmento ${segmentName}:\n\n📋 Estratégia: ${strategy}\n👥 Clientes afetados: ${currentSegment.metrics.totalClients}\n📈 Impacto estimado: Aumento de 15-25% na retenção\n⏰ Implementação: Iniciada agora\n\n✅ Estratégia ativada com sucesso!`);
  };

  const sendSegmentCampaign = (segmentName: string) => {
    alert(`📧 Enviando campanha personalizada para segmento ${segmentName}:\n\n👥 Destinatários: ${currentSegment.metrics.totalClients} clientes\n📱 Canais: Email + WhatsApp\n🎯 Personalização: 100% baseada no perfil\n📊 Taxa de abertura esperada: 85%\n\n✅ Campanha enviada com sucesso!`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Target className="text-blue-600" size={28} />
            Segmentação Automática de Clientes
          </h2>
          <p className="text-gray-600">Classificação inteligente baseada em valor, comportamento e potencial</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => window.history.back()}
            className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            Voltar ao Dashboard
          </button>
          <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
            <Download size={16} />
            Exportar Segmentos
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            <RefreshCw size={16} />
            Recalcular IA
          </button>
        </div>
      </div>

      {/* Segment Overview Cards */}
      <div className="grid md:grid-cols-4 gap-6">
        {segments.map((segment) => {
          const Icon = segment.icon;
          const isSelected = selectedSegment === segment.id;
          
          return (
            <div
              key={segment.id}
              className={`bg-white rounded-xl shadow-sm border-2 p-6 cursor-pointer transition-all hover:shadow-lg ${
                isSelected ? 'border-blue-500 shadow-lg scale-105' : 'border-gray-200 hover:border-blue-300'
              }`}
              onClick={() => setSelectedSegment(segment.id)}
            >
              <div className="text-center mb-4">
                <div className={`w-16 h-16 bg-gradient-to-r ${segment.color} rounded-full flex items-center justify-center mx-auto mb-3`}>
                  <Icon size={32} className="text-white" />
                </div>
                <h3 className="font-bold text-gray-900 mb-1">{segment.name}</h3>
                <p className="text-xs text-gray-600">{segment.description}</p>
              </div>

              <div className="space-y-3">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{segment.metrics.totalClients}</div>
                  <div className="text-xs text-gray-600">clientes</div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">LTV Médio:</span>
                    <span className="font-medium">{(segment.metrics.averageLTV / 1000).toFixed(0)}K MT</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">Receita:</span>
                    <span className="font-medium">{(segment.metrics.totalRevenue / 1000).toFixed(0)}K MT</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">Satisfação:</span>
                    <span className="font-medium">{segment.metrics.averageSatisfaction.toFixed(1)}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">Churn:</span>
                    <span className={`font-medium ${
                      segment.metrics.churnRate > 10 ? 'text-red-600' : 
                      segment.metrics.churnRate > 5 ? 'text-orange-600' : 'text-green-600'
                    }`}>
                      {segment.metrics.churnRate}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Segment Details */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 bg-gradient-to-r ${currentSegment.color} rounded-lg flex items-center justify-center`}>
              <currentSegment.icon size={24} className="text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">{currentSegment.name}</h3>
              <p className="text-gray-600">{currentSegment.description}</p>
            </div>
          </div>
          
          <div className="flex bg-gray-100 rounded-lg p-1">
            {[
              { mode: 'overview' as const, label: 'Visão Geral', icon: BarChart3 },
              { mode: 'clients' as const, label: 'Clientes', icon: Users },
              { mode: 'strategies' as const, label: 'Estratégias', icon: Target }
            ].map((option) => {
              const Icon = option.icon;
              return (
                <button
                  key={option.mode}
                  onClick={() => setViewMode(option.mode)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
                    viewMode === option.mode
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon size={14} />
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Overview Mode */}
        {viewMode === 'overview' && (
          <div className="space-y-6">
            {/* Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{currentSegment.metrics.totalClients}</div>
                <div className="text-sm text-blue-800">Total Clientes</div>
              </div>
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-600">
                  {(currentSegment.metrics.averageLTV / 1000).toFixed(0)}K MT
                </div>
                <div className="text-sm text-green-800">LTV Médio</div>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {currentSegment.metrics.averageSatisfaction.toFixed(1)}
                </div>
                <div className="text-sm text-purple-800">Satisfação</div>
              </div>
              <div className="bg-orange-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {currentSegment.metrics.churnRate}%
                </div>
                <div className="text-sm text-orange-800">Taxa Churn</div>
              </div>
            </div>

            {/* Performance Indicators */}
            <div className="grid lg:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Indicadores de Performance</h4>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Taxa de Retenção</span>
                      <span className="font-medium">{currentSegment.metrics.retentionRate}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${currentSegment.metrics.retentionRate}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Taxa de Conversão</span>
                      <span className="font-medium">{currentSegment.metrics.conversionRate}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${currentSegment.metrics.conversionRate}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Taxa de Crescimento</span>
                      <span className="font-medium">{currentSegment.metrics.growthRate}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-purple-500 h-2 rounded-full"
                        style={{ width: `${Math.min(currentSegment.metrics.growthRate * 4, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Critérios de Segmentação</h4>
                <div className="space-y-3">
                  {currentSegment.criteria.minLTV && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <DollarSign className="text-green-600" size={16} />
                      <span className="text-sm text-gray-700">
                        LTV mínimo: {currentSegment.criteria.minLTV.toLocaleString()} MT
                      </span>
                    </div>
                  )}
                  {currentSegment.criteria.minSatisfaction && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Star className="text-yellow-600" size={16} />
                      <span className="text-sm text-gray-700">
                        Satisfação mínima: {currentSegment.criteria.minSatisfaction}
                      </span>
                    </div>
                  )}
                  {currentSegment.criteria.maxChurnRisk && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <AlertTriangle className="text-red-600" size={16} />
                      <span className="text-sm text-gray-700">
                        Risco máximo de churn: {currentSegment.criteria.maxChurnRisk}%
                      </span>
                    </div>
                  )}
                  {currentSegment.criteria.paymentBehavior && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <CheckCircle className="text-blue-600" size={16} />
                      <span className="text-sm text-gray-700">
                        Comportamento: {currentSegment.criteria.paymentBehavior.join(', ')}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Clients Mode */}
        {viewMode === 'clients' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-gray-900">
                Clientes do Segmento {currentSegment.name} ({currentSegment.clients.length})
              </h4>
              <button
                onClick={() => sendSegmentCampaign(currentSegment.name)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Send size={16} />
                Enviar Campanha
              </button>
            </div>

            <div className="space-y-4">
              {currentSegment.clients.map((client) => (
                <div key={client.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                        <Building className="text-gray-600" size={20} />
                      </div>
                      <div>
                        <h5 className="font-semibold text-gray-900">{client.companyName}</h5>
                        <p className="text-sm text-gray-600">{client.representative}</p>
                        <div className="flex gap-2 mt-1">
                          {client.tags.map((tag, idx) => (
                            <span key={idx} className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900">
                        {client.ltv.toLocaleString()} MT
                      </div>
                      <div className="text-sm text-gray-600">LTV</div>
                      <div className={`text-sm font-medium ${getChurnRiskColor(client.churnRisk)}`}>
                        Risco: {client.churnRisk}%
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-sm font-medium text-gray-900">
                        {client.totalRevenue.toLocaleString()} MT
                      </div>
                      <div className="text-xs text-gray-600">Receita Total</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-medium text-gray-900">{client.monthsAsClient}m</div>
                      <div className="text-xs text-gray-600">Tempo de Cliente</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-medium text-gray-900">{client.satisfactionScore}</div>
                      <div className="text-xs text-gray-600">Satisfação</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-medium text-gray-900">{client.engagementLevel}%</div>
                      <div className="text-xs text-gray-600">Engajamento</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Mail size={12} />
                      <span>{client.email}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Phone size={12} />
                      <span>{client.phone}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar size={12} />
                      <span>Último pagamento: {formatDate(client.lastPayment)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Strategies Mode */}
        {viewMode === 'strategies' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-gray-900">
                Estratégias para {currentSegment.name}
              </h4>
              <span className="text-sm text-gray-600">
                {currentSegment.strategies.length} estratégias recomendadas
              </span>
            </div>

            <div className="grid gap-4">
              {currentSegment.strategies.map((strategy, idx) => (
                <div key={idx} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Zap className="text-blue-600" size={20} />
                      </div>
                      <div>
                        <h5 className="font-semibold text-gray-900">{strategy}</h5>
                        <p className="text-sm text-gray-600">
                          Estratégia personalizada para o segmento {currentSegment.name}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => executeSegmentStrategy(currentSegment.name, strategy)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                      >
                        <ArrowRight size={16} />
                        Implementar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Strategy Impact Prediction */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 border border-green-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                  <TrendingUp className="text-white" size={20} />
                </div>
                <div>
                  <h4 className="font-semibold text-green-900">Impacto Previsto das Estratégias</h4>
                  <p className="text-sm text-green-700">Resultados esperados em 90 dias</p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-xl font-bold text-green-600">+{(currentSegment.metrics.retentionRate * 0.15).toFixed(1)}%</div>
                  <div className="text-sm text-gray-600">Melhoria na Retenção</div>
                </div>
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-xl font-bold text-blue-600">+{(currentSegment.metrics.averageSatisfaction * 0.12).toFixed(1)}</div>
                  <div className="text-sm text-gray-600">Aumento na Satisfação</div>
                </div>
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-xl font-bold text-purple-600">
                    +{((currentSegment.metrics.totalRevenue * 0.18) / 1000).toFixed(0)}K MT
                  </div>
                  <div className="text-sm text-gray-600">Receita Adicional</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* AI Segmentation Engine */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
            <Target size={24} className="text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold">Motor de Segmentação com IA</h3>
            <p className="text-indigo-200">Classificação automática baseada em 40+ variáveis</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white bg-opacity-10 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Activity size={16} />
              <span className="font-semibold">Análise Comportamental</span>
            </div>
            <p className="text-sm text-indigo-100 mb-3">
              Padrões de uso, frequência de login, interação com recursos
            </p>
            <div className="text-xs text-indigo-200">
              ✓ 15 variáveis comportamentais
            </div>
          </div>

          <div className="bg-white bg-opacity-10 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign size={16} />
              <span className="font-semibold">Análise Financeira</span>
            </div>
            <p className="text-sm text-indigo-100 mb-3">
              Histórico de pagamentos, valor dos contratos, crescimento de receita
            </p>
            <div className="text-xs text-indigo-200">
              ✓ 12 variáveis financeiras
            </div>
          </div>

          <div className="bg-white bg-opacity-10 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Star size={16} />
              <span className="font-semibold">Análise de Satisfação</span>
            </div>
            <p className="text-sm text-indigo-100 mb-3">
              NPS, tickets de suporte, feedback, tempo de resposta
            </p>
            <div className="text-xs text-indigo-200">
              ✓ 13 variáveis de satisfação
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-white border-opacity-20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-indigo-200">Última atualização da segmentação:</p>
              <p className="font-semibold">Hoje às 14:30 • Próxima: Amanhã às 02:00</p>
            </div>
            <button className="bg-white bg-opacity-20 text-white px-4 py-2 rounded-lg hover:bg-opacity-30 transition-colors">
              Configurar Automação
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};