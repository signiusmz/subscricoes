import React, { useState } from 'react';
import { 
  ArrowLeft, 
  TrendingUp, 
  TrendingDown,
  Users, 
  DollarSign, 
  Calendar, 
  Star, 
  Crown,
  Trophy,
  Medal,
  Award,
  Clock,
  Eye,
  Filter,
  Download,
  RefreshCw,
  BarChart3,
  PieChart,
  Activity,
  Target,
  Zap,
  Heart,
  AlertCircle,
  CheckCircle,
  UserCheck,
  UserX,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';

interface ClientAnalytics {
  id: string;
  companyName: string;
  representative: string;
  email: string;
  phone: string;
  address: string;
  totalRevenue: number;
  ltv: number;
  accountAge: number; // in days
  averageMonthlyRevenue: number;
  totalInvoices: number;
  satisfactionScore: number;
  lastPayment: string;
  status: 'active' | 'inactive';
  segment: 'premium' | 'gold' | 'silver' | 'bronze';
  riskLevel: 'low' | 'medium' | 'high';
  churnProbability: number;
  engagementScore: number;
  paymentBehavior: 'excellent' | 'good' | 'average' | 'poor';
  growthTrend: 'increasing' | 'stable' | 'decreasing';
  lastActivity: string;
  contractsCount: number;
  averageContractValue: number;
  renewalRate: number;
}

const mockClientAnalytics: ClientAnalytics[] = [
  {
    id: '1',
    companyName: 'Telecomunicações de Moçambique',
    representative: 'Isabel Machel',
    email: 'isabel@tmcel.mz',
    phone: '+258 84 200 300',
    address: 'Av. 25 de Setembro, 420, Maputo',
    totalRevenue: 200000,
    ltv: 300000,
    accountAge: 150,
    averageMonthlyRevenue: 40000,
    totalInvoices: 5,
    satisfactionScore: 9.1,
    lastPayment: '2024-03-30',
    status: 'active',
    segment: 'premium',
    riskLevel: 'low',
    churnProbability: 5,
    engagementScore: 95,
    paymentBehavior: 'excellent',
    growthTrend: 'increasing',
    lastActivity: '2024-03-30',
    contractsCount: 3,
    averageContractValue: 66667,
    renewalRate: 100
  },
  {
    id: '2',
    companyName: 'Petromoc',
    representative: 'Fernando Guebuza',
    email: 'fernando@petromoc.mz',
    phone: '+258 84 150 250',
    address: 'Av. Marginal, 1200, Maputo',
    totalRevenue: 180000,
    ltv: 270000,
    accountAge: 120,
    averageMonthlyRevenue: 45000,
    totalInvoices: 4,
    satisfactionScore: 8.7,
    lastPayment: '2024-03-29',
    status: 'active',
    segment: 'premium',
    riskLevel: 'low',
    churnProbability: 8,
    engagementScore: 88,
    paymentBehavior: 'excellent',
    growthTrend: 'increasing',
    lastActivity: '2024-03-29',
    contractsCount: 2,
    averageContractValue: 90000,
    renewalRate: 100
  },
  {
    id: '3',
    companyName: 'Mozal',
    representative: 'Sandra Macamo',
    email: 'sandra@mozal.mz',
    phone: '+258 84 180 280',
    address: 'Beluluane Industrial Park, Maputo',
    totalRevenue: 160000,
    ltv: 240000,
    accountAge: 100,
    averageMonthlyRevenue: 48000,
    totalInvoices: 4,
    satisfactionScore: 9.3,
    lastPayment: '2024-03-27',
    status: 'active',
    segment: 'premium',
    riskLevel: 'low',
    churnProbability: 3,
    engagementScore: 92,
    paymentBehavior: 'excellent',
    growthTrend: 'stable',
    lastActivity: '2024-03-27',
    contractsCount: 2,
    averageContractValue: 80000,
    renewalRate: 100
  },
  {
    id: '4',
    companyName: 'Banco Millennium',
    representative: 'Pedro Nunes',
    email: 'pedro@millennium.mz',
    phone: '+258 84 220 320',
    address: 'Av. 25 de Setembro, 1695, Maputo',
    totalRevenue: 150000,
    ltv: 220000,
    accountAge: 180,
    averageMonthlyRevenue: 25000,
    totalInvoices: 6,
    satisfactionScore: 9.5,
    lastPayment: '2024-03-28',
    status: 'active',
    segment: 'gold',
    riskLevel: 'low',
    churnProbability: 2,
    engagementScore: 96,
    paymentBehavior: 'excellent',
    growthTrend: 'increasing',
    lastActivity: '2024-03-28',
    contractsCount: 4,
    averageContractValue: 37500,
    renewalRate: 95
  },
  {
    id: '5',
    companyName: 'Cervejas de Moçambique',
    representative: 'Luisa Chissano',
    email: 'luisa@cdm.mz',
    phone: '+258 84 190 290',
    address: 'Av. das Indústrias, 890, Maputo',
    totalRevenue: 135000,
    ltv: 200000,
    accountAge: 90,
    averageMonthlyRevenue: 45000,
    totalInvoices: 3,
    satisfactionScore: 9.4,
    lastPayment: '2024-03-31',
    status: 'active',
    segment: 'gold',
    riskLevel: 'low',
    churnProbability: 4,
    engagementScore: 94,
    paymentBehavior: 'excellent',
    growthTrend: 'increasing',
    lastActivity: '2024-03-31',
    contractsCount: 2,
    averageContractValue: 67500,
    renewalRate: 100
  },
  {
    id: '6',
    companyName: 'Construções Beira SA',
    representative: 'Maria Santos',
    email: 'maria@construcoesbeira.mz',
    phone: '+258 85 987 6543',
    address: 'Rua da Independência, 123, Beira',
    totalRevenue: 120000,
    ltv: 180000,
    accountAge: 320,
    averageMonthlyRevenue: 12000,
    totalInvoices: 10,
    satisfactionScore: 8.8,
    lastPayment: '2024-03-20',
    status: 'active',
    segment: 'gold',
    riskLevel: 'medium',
    churnProbability: 15,
    engagementScore: 78,
    paymentBehavior: 'good',
    growthTrend: 'stable',
    lastActivity: '2024-03-20',
    contractsCount: 5,
    averageContractValue: 24000,
    renewalRate: 80
  },
  {
    id: '7',
    companyName: 'Hotel Polana',
    representative: 'Carlos Mendes',
    email: 'carlos@hotelpolana.mz',
    phone: '+258 87 444 5555',
    address: 'Av. Julius Nyerere, 1380, Maputo',
    totalRevenue: 95000,
    ltv: 140000,
    accountAge: 280,
    averageMonthlyRevenue: 9500,
    totalInvoices: 10,
    satisfactionScore: 9.0,
    lastPayment: '2024-03-18',
    status: 'active',
    segment: 'silver',
    riskLevel: 'low',
    churnProbability: 10,
    engagementScore: 85,
    paymentBehavior: 'good',
    growthTrend: 'stable',
    lastActivity: '2024-03-18',
    contractsCount: 4,
    averageContractValue: 23750,
    renewalRate: 90
  },
  {
    id: '8',
    companyName: 'Transportes Maputo Lda',
    representative: 'João Macamo',
    email: 'joao@transportesmaputo.mz',
    phone: '+258 84 123 4567',
    address: 'Av. Eduardo Mondlane, 567, Maputo',
    totalRevenue: 85000,
    ltv: 125000,
    accountAge: 365,
    averageMonthlyRevenue: 7000,
    totalInvoices: 12,
    satisfactionScore: 9.2,
    lastPayment: '2024-03-25',
    status: 'active',
    segment: 'silver',
    riskLevel: 'low',
    churnProbability: 7,
    engagementScore: 90,
    paymentBehavior: 'excellent',
    growthTrend: 'stable',
    lastActivity: '2024-03-25',
    contractsCount: 6,
    averageContractValue: 14167,
    renewalRate: 92
  },
  {
    id: '9',
    companyName: 'Supermercado Shoprite',
    representative: 'Ana Costa',
    email: 'ana@shoprite.mz',
    phone: '+258 82 333 4444',
    address: 'Shopping Maputo, Loja 15',
    totalRevenue: 75000,
    ltv: 110000,
    accountAge: 200,
    averageMonthlyRevenue: 11000,
    totalInvoices: 7,
    satisfactionScore: 8.9,
    lastPayment: '2024-03-22',
    status: 'active',
    segment: 'silver',
    riskLevel: 'medium',
    churnProbability: 20,
    engagementScore: 75,
    paymentBehavior: 'good',
    growthTrend: 'increasing',
    lastActivity: '2024-03-22',
    contractsCount: 3,
    averageContractValue: 25000,
    renewalRate: 85
  },
  {
    id: '10',
    companyName: 'Águas de Maputo',
    representative: 'Ricardo Bila',
    email: 'ricardo@aguasmaputo.mz',
    phone: '+258 83 555 6666',
    address: 'Av. do Trabalho, 2000, Maputo',
    totalRevenue: 65000,
    ltv: 95000,
    accountAge: 450,
    averageMonthlyRevenue: 4300,
    totalInvoices: 15,
    satisfactionScore: 8.3,
    lastPayment: '2024-03-10',
    status: 'active',
    segment: 'bronze',
    riskLevel: 'medium',
    churnProbability: 25,
    engagementScore: 70,
    paymentBehavior: 'average',
    growthTrend: 'decreasing',
    lastActivity: '2024-03-10',
    contractsCount: 8,
    averageContractValue: 8125,
    renewalRate: 75
  },
  {
    id: '11',
    companyName: 'Farmácia Central',
    representative: 'António Silva',
    email: 'antonio@farmaciacentral.mz',
    phone: '+258 86 555 7777',
    address: 'Praça da Independência, 45, Nampula',
    totalRevenue: 45000,
    ltv: 65000,
    accountAge: 420,
    averageMonthlyRevenue: 3500,
    totalInvoices: 14,
    satisfactionScore: 8.5,
    lastPayment: '2024-03-15',
    status: 'active',
    segment: 'bronze',
    riskLevel: 'high',
    churnProbability: 35,
    engagementScore: 65,
    paymentBehavior: 'average',
    growthTrend: 'decreasing',
    lastActivity: '2024-03-15',
    contractsCount: 7,
    averageContractValue: 6429,
    renewalRate: 70
  }
];

interface ClientAnalyticsProps {
  onBack: () => void;
}

export const ClientAnalytics: React.FC<ClientAnalyticsProps> = ({ onBack }) => {
  const [activeView, setActiveView] = useState<'overview' | 'segments' | 'ltv' | 'risk'>('overview');
  const [selectedSegment, setSelectedSegment] = useState<'all' | 'premium' | 'gold' | 'silver' | 'bronze'>('all');
  const [sortBy, setSortBy] = useState<'ltv' | 'revenue' | 'age' | 'satisfaction'>('ltv');

  const formatAccountAge = (days: number) => {
    const years = Math.floor(days / 365);
    const months = Math.floor((days % 365) / 30);
    
    if (years > 0) {
      return `${years}a ${months}m`;
    } else if (months > 0) {
      return `${months} meses`;
    } else {
      return `${days} dias`;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-PT');
  };

  const getSegmentColor = (segment: string) => {
    const colors = {
      premium: 'bg-purple-100 text-purple-800 border-purple-300',
      gold: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      silver: 'bg-gray-100 text-gray-800 border-gray-300',
      bronze: 'bg-orange-100 text-orange-800 border-orange-300'
    };
    return colors[segment as keyof typeof colors] || colors.bronze;
  };

  const getRiskColor = (risk: string) => {
    const colors = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-red-100 text-red-800'
    };
    return colors[risk as keyof typeof colors] || colors.medium;
  };

  const getPaymentBehaviorColor = (behavior: string) => {
    const colors = {
      excellent: 'bg-green-100 text-green-800',
      good: 'bg-blue-100 text-blue-800',
      average: 'bg-yellow-100 text-yellow-800',
      poor: 'bg-red-100 text-red-800'
    };
    return colors[behavior as keyof typeof colors] || colors.average;
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing':
        return <TrendingUp className="text-green-600" size={16} />;
      case 'decreasing':
        return <TrendingDown className="text-red-600" size={16} />;
      default:
        return <Activity className="text-blue-600" size={16} />;
    }
  };

  const filteredClients = mockClientAnalytics.filter(client => 
    selectedSegment === 'all' || client.segment === selectedSegment
  );

  const sortedClients = [...filteredClients].sort((a, b) => {
    switch (sortBy) {
      case 'ltv':
        return b.ltv - a.ltv;
      case 'revenue':
        return b.totalRevenue - a.totalRevenue;
      case 'age':
        return b.accountAge - a.accountAge;
      case 'satisfaction':
        return b.satisfactionScore - a.satisfactionScore;
      default:
        return 0;
    }
  });

  // Calculate analytics
  const totalLTV = mockClientAnalytics.reduce((sum, client) => sum + client.ltv, 0);
  const averageLTV = totalLTV / mockClientAnalytics.length;
  const totalRevenue = mockClientAnalytics.reduce((sum, client) => sum + client.totalRevenue, 0);
  const averageSatisfaction = mockClientAnalytics.reduce((sum, client) => sum + client.satisfactionScore, 0) / mockClientAnalytics.length;
  const averageChurnRisk = mockClientAnalytics.reduce((sum, client) => sum + client.churnProbability, 0) / mockClientAnalytics.length;

  const segmentStats = {
    premium: mockClientAnalytics.filter(c => c.segment === 'premium').length,
    gold: mockClientAnalytics.filter(c => c.segment === 'gold').length,
    silver: mockClientAnalytics.filter(c => c.segment === 'silver').length,
    bronze: mockClientAnalytics.filter(c => c.segment === 'bronze').length
  };

  const riskStats = {
    low: mockClientAnalytics.filter(c => c.riskLevel === 'low').length,
    medium: mockClientAnalytics.filter(c => c.riskLevel === 'medium').length,
    high: mockClientAnalytics.filter(c => c.riskLevel === 'high').length
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">LTV Total</p>
              <p className="text-2xl font-bold text-gray-900">{totalLTV.toLocaleString()} MT</p>
              <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                <TrendingUp size={10} />
                +12.5% vs mês anterior
              </p>
            </div>
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-purple-100 text-purple-600">
              <Crown size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">LTV Médio</p>
              <p className="text-2xl font-bold text-gray-900">{Math.round(averageLTV).toLocaleString()} MT</p>
              <p className="text-xs text-blue-600 flex items-center gap-1 mt-1">
                <Activity size={10} />
                Por cliente ativo
              </p>
            </div>
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-blue-100 text-blue-600">
              <BarChart3 size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Receita Total</p>
              <p className="text-2xl font-bold text-gray-900">{totalRevenue.toLocaleString()} MT</p>
              <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                <TrendingUp size={10} />
                +8.3% este mês
              </p>
            </div>
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-green-100 text-green-600">
              <DollarSign size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Satisfação Média</p>
              <p className="text-2xl font-bold text-gray-900">{averageSatisfaction.toFixed(1)}</p>
              <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                <Star size={10} />
                +0.2 este mês
              </p>
            </div>
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-yellow-100 text-yellow-600">
              <Star size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Segment Distribution */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <PieChart className="text-blue-600" size={20} />
            Distribuição por Segmento
          </h3>
          <div className="space-y-4">
            {Object.entries(segmentStats).map(([segment, count]) => {
              const percentage = (count / mockClientAnalytics.length) * 100;
              return (
                <div key={segment} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 text-sm font-semibold rounded-full border ${getSegmentColor(segment)}`}>
                      {segment.charAt(0).toUpperCase() + segment.slice(1)}
                    </span>
                    <span className="text-sm text-gray-600">{count} clientes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          segment === 'premium' ? 'bg-purple-500' :
                          segment === 'gold' ? 'bg-yellow-500' :
                          segment === 'silver' ? 'bg-gray-500' : 'bg-orange-500'
                        }`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{percentage.toFixed(1)}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Target className="text-red-600" size={20} />
            Análise de Risco
          </h3>
          <div className="space-y-4">
            {Object.entries(riskStats).map(([risk, count]) => {
              const percentage = (count / mockClientAnalytics.length) * 100;
              return (
                <div key={risk} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getRiskColor(risk)}`}>
                      {risk === 'low' ? 'Baixo' : risk === 'medium' ? 'Médio' : 'Alto'}
                    </span>
                    <span className="text-sm text-gray-600">{count} clientes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          risk === 'low' ? 'bg-green-500' :
                          risk === 'medium' ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{percentage.toFixed(1)}%</span>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="text-red-600" size={16} />
              <span className="font-medium text-red-900">Atenção Necessária</span>
            </div>
            <p className="text-sm text-red-800">
              {riskStats.high} cliente{riskStats.high !== 1 ? 's' : ''} com alto risco de cancelamento
            </p>
            <p className="text-xs text-red-700 mt-1">
              Risco médio de churn: {averageChurnRisk.toFixed(1)}%
            </p>
          </div>
        </div>
      </div>

      {/* Top Performers */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Trophy className="text-yellow-600" size={20} />
          Top Performers
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Highest LTV */}
          <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
            <Crown className="text-purple-600 mx-auto mb-2" size={32} />
            <p className="font-bold text-purple-900">{sortedClients[0]?.companyName}</p>
            <p className="text-sm text-purple-700">Maior LTV</p>
            <p className="text-lg font-bold text-purple-900">{sortedClients[0]?.ltv.toLocaleString()} MT</p>
          </div>

          {/* Highest Satisfaction */}
          <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <Star className="text-yellow-600 mx-auto mb-2" size={32} />
            <p className="font-bold text-yellow-900">
              {[...mockClientAnalytics].sort((a, b) => b.satisfactionScore - a.satisfactionScore)[0]?.companyName}
            </p>
            <p className="text-sm text-yellow-700">Maior Satisfação</p>
            <p className="text-lg font-bold text-yellow-900">
              {[...mockClientAnalytics].sort((a, b) => b.satisfactionScore - a.satisfactionScore)[0]?.satisfactionScore}
            </p>
          </div>

          {/* Oldest Client */}
          <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
            <Clock className="text-blue-600 mx-auto mb-2" size={32} />
            <p className="font-bold text-blue-900">
              {[...mockClientAnalytics].sort((a, b) => b.accountAge - a.accountAge)[0]?.companyName}
            </p>
            <p className="text-sm text-blue-700">Cliente Mais Antigo</p>
            <p className="text-lg font-bold text-blue-900">
              {formatAccountAge([...mockClientAnalytics].sort((a, b) => b.accountAge - a.accountAge)[0]?.accountAge)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSegments = () => (
    <div className="space-y-6">
      {/* Segment Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {Object.entries(segmentStats).map(([segment, count]) => {
          const segmentClients = mockClientAnalytics.filter(c => c.segment === segment);
          const segmentLTV = segmentClients.reduce((sum, c) => sum + c.ltv, 0);
          const segmentRevenue = segmentClients.reduce((sum, c) => sum + c.totalRevenue, 0);
          
          return (
            <div key={segment} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="text-center">
                <div className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center ${
                  segment === 'premium' ? 'bg-purple-100' :
                  segment === 'gold' ? 'bg-yellow-100' :
                  segment === 'silver' ? 'bg-gray-100' : 'bg-orange-100'
                }`}>
                  {segment === 'premium' ? <Crown className="text-purple-600" size={32} /> :
                   segment === 'gold' ? <Trophy className="text-yellow-600" size={32} /> :
                   segment === 'silver' ? <Medal className="text-gray-600" size={32} /> :
                   <Award className="text-orange-600" size={32} />}
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-2 capitalize">{segment}</h4>
                <p className="text-3xl font-bold text-gray-900 mb-1">{count}</p>
                <p className="text-sm text-gray-600 mb-3">clientes</p>
                <div className="space-y-1 text-xs text-gray-500">
                  <p>LTV: {segmentLTV.toLocaleString()} MT</p>
                  <p>Receita: {segmentRevenue.toLocaleString()} MT</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Segment Details */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Detalhes por Segmento</h3>
          <select
            value={selectedSegment}
            onChange={(e) => setSelectedSegment(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Todos os Segmentos</option>
            <option value="premium">Premium</option>
            <option value="gold">Gold</option>
            <option value="silver">Silver</option>
            <option value="bronze">Bronze</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Segmento</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">LTV</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Receita</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Satisfação</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Risco</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredClients.slice(0, 10).map((client) => (
                <tr key={client.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-gray-900">{client.companyName}</p>
                      <p className="text-sm text-gray-500">{client.representative}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${getSegmentColor(client.segment)}`}>
                      {client.segment.charAt(0).toUpperCase() + client.segment.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-900">{client.ltv.toLocaleString()} MT</td>
                  <td className="px-4 py-3 font-medium text-gray-900">{client.totalRevenue.toLocaleString()} MT</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Star className="text-yellow-500" size={14} />
                      <span className="font-medium text-gray-900">{client.satisfactionScore}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getRiskColor(client.riskLevel)}`}>
                      {client.riskLevel === 'low' ? 'Baixo' : client.riskLevel === 'medium' ? 'Médio' : 'Alto'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderLTVAnalysis = () => (
    <div className="space-y-6">
      {/* LTV Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Crown className="text-purple-600" size={24} />
            <h3 className="text-lg font-semibold text-purple-900">LTV Total</h3>
          </div>
          <p className="text-3xl font-bold text-purple-900 mb-2">{totalLTV.toLocaleString()} MT</p>
          <p className="text-sm text-purple-700">Valor vitalício de todos os clientes</p>
          <div className="mt-4 flex items-center gap-2 text-sm text-purple-600">
            <TrendingUp size={14} />
            <span>+15.2% crescimento mensal</span>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <BarChart3 className="text-blue-600" size={24} />
            <h3 className="text-lg font-semibold text-blue-900">LTV Médio</h3>
          </div>
          <p className="text-3xl font-bold text-blue-900 mb-2">{Math.round(averageLTV).toLocaleString()} MT</p>
          <p className="text-sm text-blue-700">Por cliente ativo</p>
          <div className="mt-4 flex items-center gap-2 text-sm text-blue-600">
            <Activity size={14} />
            <span>Baseado em {mockClientAnalytics.length} clientes</span>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Target className="text-green-600" size={24} />
            <h3 className="text-lg font-semibold text-green-900">Maior LTV</h3>
          </div>
          <p className="text-3xl font-bold text-green-900 mb-2">
            {Math.max(...mockClientAnalytics.map(c => c.ltv)).toLocaleString()} MT
          </p>
          <p className="text-sm text-green-700">
            {mockClientAnalytics.find(c => c.ltv === Math.max(...mockClientAnalytics.map(c => c.ltv)))?.companyName}
          </p>
          <div className="mt-4 flex items-center gap-2 text-sm text-green-600">
            <Zap size={14} />
            <span>Cliente premium</span>
          </div>
        </div>
      </div>

      {/* LTV Ranking */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Ranking LTV</h3>
          <div className="flex gap-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="ltv">Maior LTV</option>
              <option value="revenue">Maior Receita</option>
              <option value="age">Mais Antigos</option>
              <option value="satisfaction">Maior Satisfação</option>
            </select>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
              <Download size={16} />
              Exportar
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {sortedClients.slice(0, 10).map((client, index) => {
            const position = index + 1;
            const isTopThree = position <= 3;
            
            return (
              <div 
                key={client.id} 
                className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all hover:shadow-md ${
                  isTopThree 
                    ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-300 shadow-sm' 
                    : 'bg-gray-50 border-gray-200 hover:border-blue-300'
                }`}
              >
                <div className="flex items-center gap-4">
                  {/* Position */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isTopThree 
                      ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white' 
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {position === 1 ? <Trophy size={20} /> :
                     position === 2 ? <Medal size={20} /> :
                     position === 3 ? <Award size={20} /> :
                     <span className="font-bold text-sm">#{position}</span>}
                  </div>
                  
                  {/* Client Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h4 className="font-semibold text-gray-900">{client.companyName}</h4>
                      {isTopThree && (
                        <span className="px-2 py-1 text-xs font-bold bg-yellow-100 text-yellow-800 rounded-full">
                          TOP {position}
                        </span>
                      )}
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${getSegmentColor(client.segment)}`}>
                        {client.segment.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{client.representative}</p>
                    
                    {/* Metrics */}
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar size={10} />
                        <span>{formatAccountAge(client.accountAge)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star size={10} />
                        <span>{client.satisfactionScore}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Activity size={10} />
                        <span>{client.totalInvoices} faturas</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Values */}
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-900 mb-1">
                    {sortBy === 'ltv' ? `${client.ltv.toLocaleString()} MT` :
                     sortBy === 'revenue' ? `${client.totalRevenue.toLocaleString()} MT` :
                     sortBy === 'age' ? formatAccountAge(client.accountAge) :
                     client.satisfactionScore.toString()}
                  </div>
                  <div className="text-xs text-gray-500 mb-2">
                    {sortBy === 'ltv' ? 'LTV' :
                     sortBy === 'revenue' ? 'Receita Total' :
                     sortBy === 'age' ? 'Tempo de Conta' :
                     'Satisfação'}
                  </div>
                  
                  {/* Secondary Metrics */}
                  <div className="space-y-1">
                    {sortBy !== 'revenue' && (
                      <div className="text-xs text-gray-600">
                        Receita: {client.totalRevenue.toLocaleString()} MT
                      </div>
                    )}
                    {sortBy !== 'ltv' && (
                      <div className="text-xs text-gray-600">
                        LTV: {client.ltv.toLocaleString()} MT
                      </div>
                    )}
                    <div className="text-xs text-gray-500">
                      Média: {client.averageMonthlyRevenue.toLocaleString()} MT/mês
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderRiskAnalysis = () => (
    <div className="space-y-6">
      {/* Risk Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-green-50 rounded-xl border border-green-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle className="text-green-600" size={24} />
            <h3 className="text-lg font-semibold text-green-900">Baixo Risco</h3>
          </div>
          <p className="text-3xl font-bold text-green-900 mb-2">{riskStats.low}</p>
          <p className="text-sm text-green-700">clientes seguros</p>
          <div className="mt-4">
            <div className="w-full bg-green-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full"
                style={{ width: `${(riskStats.low / mockClientAnalytics.length) * 100}%` }}
              ></div>
            </div>
            <p className="text-xs text-green-600 mt-1">
              {((riskStats.low / mockClientAnalytics.length) * 100).toFixed(1)}% do total
            </p>
          </div>
        </div>

        <div className="bg-yellow-50 rounded-xl border border-yellow-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="text-yellow-600" size={24} />
            <h3 className="text-lg font-semibold text-yellow-900">Risco Médio</h3>
          </div>
          <p className="text-3xl font-bold text-yellow-900 mb-2">{riskStats.medium}</p>
          <p className="text-sm text-yellow-700">precisam atenção</p>
          <div className="mt-4">
            <div className="w-full bg-yellow-200 rounded-full h-2">
              <div 
                className="bg-yellow-600 h-2 rounded-full"
                style={{ width: `${(riskStats.medium / mockClientAnalytics.length) * 100}%` }}
              ></div>
            </div>
            <p className="text-xs text-yellow-600 mt-1">
              {((riskStats.medium / mockClientAnalytics.length) * 100).toFixed(1)}% do total
            </p>
          </div>
        </div>

        <div className="bg-red-50 rounded-xl border border-red-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="text-red-600" size={24} />
            <h3 className="text-lg font-semibold text-red-900">Alto Risco</h3>
          </div>
          <p className="text-3xl font-bold text-red-900 mb-2">{riskStats.high}</p>
          <p className="text-sm text-red-700">ação urgente</p>
          <div className="mt-4">
            <div className="w-full bg-red-200 rounded-full h-2">
              <div 
                className="bg-red-600 h-2 rounded-full"
                style={{ width: `${(riskStats.high / mockClientAnalytics.length) * 100}%` }}
              ></div>
            </div>
            <p className="text-xs text-red-600 mt-1">
              {((riskStats.high / mockClientAnalytics.length) * 100).toFixed(1)}% do total
            </p>
          </div>
        </div>
      </div>

      {/* High Risk Clients */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <AlertCircle className="text-red-600" size={20} />
          Clientes de Alto Risco
        </h3>
        
        <div className="space-y-4">
          {mockClientAnalytics.filter(c => c.riskLevel === 'high').map((client) => (
            <div key={client.id} className="border-l-4 border-red-400 bg-red-50 p-4 rounded-lg">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-semibold text-red-900 mb-1">{client.companyName}</h4>
                  <p className="text-sm text-red-700 mb-2">{client.representative}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-red-600 font-medium">Risco de Churn</p>
                      <p className="text-red-900 font-bold">{client.churnProbability}%</p>
                    </div>
                    <div>
                      <p className="text-red-600 font-medium">Último Pagamento</p>
                      <p className="text-red-900">{formatDate(client.lastPayment)}</p>
                    </div>
                    <div>
                      <p className="text-red-600 font-medium">Satisfação</p>
                      <p className="text-red-900">{client.satisfactionScore}/10</p>
                    </div>
                    <div>
                      <p className="text-red-600 font-medium">LTV em Risco</p>
                      <p className="text-red-900 font-bold">{client.ltv.toLocaleString()} MT</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700 transition-colors">
                    Ação Urgente
                  </button>
                  <button className="border border-red-600 text-red-600 px-3 py-1 rounded text-xs hover:bg-red-50 transition-colors">
                    Ver Detalhes
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Churn Prevention Recommendations */}
      <div className="bg-blue-50 rounded-xl border border-blue-200 p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center gap-2">
          <Heart className="text-blue-600" size={20} />
          Recomendações para Retenção
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-blue-900 mb-3">Ações Imediatas</h4>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex items-center gap-2">
                <Phone size={12} />
                <span>Contactar clientes de alto risco</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={12} />
                <span>Enviar pesquisa de satisfação</span>
              </li>
              <li className="flex items-center gap-2">
                <Star size={12} />
                <span>Oferecer descontos especiais</span>
              </li>
              <li className="flex items-center gap-2">
                <Calendar size={12} />
                <span>Agendar reuniões de follow-up</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-blue-900 mb-3">Estratégias de Longo Prazo</h4>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex items-center gap-2">
                <Target size={12} />
                <span>Programa de fidelidade</span>
              </li>
              <li className="flex items-center gap-2">
                <Zap size={12} />
                <span>Serviços personalizados</span>
              </li>
              <li className="flex items-center gap-2">
                <Users size={12} />
                <span>Gestor de conta dedicado</span>
              </li>
              <li className="flex items-center gap-2">
                <BarChart3 size={12} />
                <span>Relatórios mensais de valor</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'overview', label: 'Visão Geral', icon: Eye },
    { id: 'segments', label: 'Segmentação', icon: Users },
    { id: 'ltv', label: 'Análise LTV', icon: Crown },
    { id: 'risk', label: 'Análise de Risco', icon: AlertCircle }
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
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">Análise Completa de Clientes</h1>
          <p className="text-gray-600">Insights avançados sobre LTV, segmentação e comportamento dos clientes</p>
        </div>
        <div className="flex gap-3">
          <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
            <RefreshCw size={16} />
            Atualizar
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            <Download size={16} />
            Exportar Análise
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
                onClick={() => setActiveView(tab.id as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2 ${
                  activeView === tab.id
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
      {activeView === 'overview' && renderOverview()}
      {activeView === 'segments' && renderSegments()}
      {activeView === 'ltv' && renderLTVAnalysis()}
      {activeView === 'risk' && renderRiskAnalysis()}
    </div>
  );
};