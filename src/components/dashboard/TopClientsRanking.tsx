import React, { useState } from 'react';
import { Crown, TrendingUp, Calendar, DollarSign, Star, Trophy, Medal, Award, Users, Clock, Eye } from 'lucide-react';

interface ClientLTV {
  id: string;
  companyName: string;
  representative: string;
  totalRevenue: number;
  ltv: number;
  accountAge: number; // in days
  averageMonthlyRevenue: number;
  totalInvoices: number;
  satisfactionScore: number;
  lastPayment: string;
  status: 'active' | 'inactive';
}

const mockClientsLTV: ClientLTV[] = [
  {
    id: '1',
    companyName: 'Transportes Maputo Lda',
    representative: 'João Macamo',
    totalRevenue: 85000,
    ltv: 125000,
    accountAge: 365,
    averageMonthlyRevenue: 7000,
    totalInvoices: 12,
    satisfactionScore: 9.2,
    lastPayment: '2024-03-25',
    status: 'active'
  },
  {
    id: '2',
    companyName: 'Construções Beira SA',
    representative: 'Maria Santos',
    totalRevenue: 120000,
    ltv: 180000,
    accountAge: 320,
    averageMonthlyRevenue: 12000,
    totalInvoices: 10,
    satisfactionScore: 8.8,
    lastPayment: '2024-03-20',
    status: 'active'
  },
  {
    id: '3',
    companyName: 'Hotel Polana',
    representative: 'Carlos Mendes',
    totalRevenue: 95000,
    ltv: 140000,
    accountAge: 280,
    averageMonthlyRevenue: 9500,
    totalInvoices: 10,
    satisfactionScore: 9.0,
    lastPayment: '2024-03-18',
    status: 'active'
  },
  {
    id: '4',
    companyName: 'Farmácia Central',
    representative: 'António Silva',
    totalRevenue: 45000,
    ltv: 65000,
    accountAge: 420,
    averageMonthlyRevenue: 3500,
    totalInvoices: 14,
    satisfactionScore: 8.5,
    lastPayment: '2024-03-15',
    status: 'active'
  },
  {
    id: '5',
    companyName: 'Supermercado Shoprite',
    representative: 'Ana Costa',
    totalRevenue: 75000,
    ltv: 110000,
    accountAge: 200,
    averageMonthlyRevenue: 11000,
    totalInvoices: 7,
    satisfactionScore: 8.9,
    lastPayment: '2024-03-22',
    status: 'active'
  },
  {
    id: '6',
    companyName: 'Banco Millennium',
    representative: 'Pedro Nunes',
    totalRevenue: 150000,
    ltv: 220000,
    accountAge: 180,
    averageMonthlyRevenue: 25000,
    totalInvoices: 6,
    satisfactionScore: 9.5,
    lastPayment: '2024-03-28',
    status: 'active'
  },
  {
    id: '7',
    companyName: 'Telecomunicações de Moçambique',
    representative: 'Isabel Machel',
    totalRevenue: 200000,
    ltv: 300000,
    accountAge: 150,
    averageMonthlyRevenue: 40000,
    totalInvoices: 5,
    satisfactionScore: 9.1,
    lastPayment: '2024-03-30',
    status: 'active'
  },
  {
    id: '8',
    companyName: 'Petromoc',
    representative: 'Fernando Guebuza',
    totalRevenue: 180000,
    ltv: 270000,
    accountAge: 120,
    averageMonthlyRevenue: 45000,
    totalInvoices: 4,
    satisfactionScore: 8.7,
    lastPayment: '2024-03-29',
    status: 'active'
  },
  {
    id: '9',
    companyName: 'Mozal',
    representative: 'Sandra Macamo',
    totalRevenue: 160000,
    ltv: 240000,
    accountAge: 100,
    averageMonthlyRevenue: 48000,
    totalInvoices: 4,
    satisfactionScore: 9.3,
    lastPayment: '2024-03-27',
    status: 'active'
  },
  {
    id: '10',
    companyName: 'Águas de Maputo',
    representative: 'Ricardo Bila',
    totalRevenue: 65000,
    ltv: 95000,
    accountAge: 450,
    averageMonthlyRevenue: 4300,
    totalInvoices: 15,
    satisfactionScore: 8.3,
    lastPayment: '2024-03-10',
    status: 'active'
  },
  {
    id: '11',
    companyName: 'Cervejas de Moçambique',
    representative: 'Luisa Chissano',
    totalRevenue: 135000,
    ltv: 200000,
    accountAge: 90,
    averageMonthlyRevenue: 45000,
    totalInvoices: 3,
    satisfactionScore: 9.4,
    lastPayment: '2024-03-31',
    status: 'active'
  }
];

export const TopClientsRanking: React.FC = () => {
  const [activeRanking, setActiveRanking] = useState<'oldest' | 'revenue'>('revenue');

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

  const getRankingData = () => {
    switch (activeRanking) {
      case 'oldest':
        return [...mockClientsLTV]
          .sort((a, b) => b.accountAge - a.accountAge)
          .slice(0, 5);
      case 'revenue':
        return [...mockClientsLTV]
          .sort((a, b) => b.totalRevenue - a.totalRevenue)
          .slice(0, 5);
      default:
        return mockClientsLTV.slice(0, 5);
    }
  };

  const getRankingTitle = () => {
    switch (activeRanking) {
      case 'oldest':
        return 'Clientes Mais Antigos';
      case 'revenue':
        return 'Maior Faturação';
      default:
        return 'Ranking de Clientes';
    }
  };

  const getRankingIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Trophy className="text-yellow-500" size={20} />;
      case 2:
        return <Medal className="text-gray-400" size={20} />;
      case 3:
        return <Award className="text-orange-500" size={20} />;
      default:
        return <span className="text-gray-500 font-bold text-sm">#{position}</span>;
    }
  };

  const getMetricValue = (client: ClientLTV) => {
    switch (activeRanking) {
      case 'oldest':
        return formatAccountAge(client.accountAge);
      case 'revenue':
        return `${client.totalRevenue.toLocaleString()} MT`;
      default:
        return '';
    }
  };

  const getMetricLabel = () => {
    switch (activeRanking) {
      case 'oldest':
        return 'Tempo de Conta';
      case 'revenue':
        return 'Faturação Total';
      default:
        return '';
    }
  };

  const rankingData = getRankingData();
  const totalLTV = mockClientsLTV.reduce((sum, client) => sum + client.ltv, 0);
  const averageLTV = totalLTV / mockClientsLTV.length;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <Crown className="text-white" size={20} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{getRankingTitle()}</h3>
            <p className="text-sm text-gray-600">Top 5 clientes por categoria</p>
          </div>
        </div>
        
        {/* Ranking Type Selector */}
        <div className="flex bg-gray-100 rounded-lg p-1">
          {[
            { type: 'revenue' as const, label: 'Receita', icon: DollarSign },
            { type: 'oldest' as const, label: 'Antiguidade', icon: Clock }
          ].map((option) => {
            const Icon = option.icon;
            return (
              <button
                key={option.type}
                onClick={() => setActiveRanking(option.type)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
                  activeRanking === option.type
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

      {/* LTV Summary */}
      {activeRanking === 'ltv' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="text-green-600" size={16} />
              <span className="text-sm font-medium text-green-900">LTV Total</span>
            </div>
            <p className="text-2xl font-bold text-green-900">{totalLTV.toLocaleString()} MT</p>
            <p className="text-xs text-green-700">Valor vitalício estimado</p>
          </div>
          
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="text-blue-600" size={16} />
              <span className="text-sm font-medium text-blue-900">LTV Médio</span>
            </div>
            <p className="text-2xl font-bold text-blue-900">{averageLTV.toLocaleString()} MT</p>
            <p className="text-xs text-blue-700">Por cliente ativo</p>
          </div>
          
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200">
            <div className="flex items-center gap-2 mb-2">
              <Crown className="text-purple-600" size={16} />
              <span className="text-sm font-medium text-purple-900">Maior LTV</span>
            </div>
            <p className="text-2xl font-bold text-purple-900">
              {Math.max(...mockClientsLTV.map(c => c.ltv)).toLocaleString()} MT
            </p>
            <p className="text-xs text-purple-700">Cliente premium</p>
          </div>
        </div>
      )}

      {/* Ranking List */}
      <div className="space-y-3">
        {rankingData.map((client, index) => {
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
                {/* Ranking Position */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  isTopThree 
                    ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {getRankingIcon(position)}
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
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      client.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {client.status === 'active' ? 'Ativo' : 'Inativo'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{client.representative}</p>
                  
                  {/* Additional Metrics */}
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar size={10} />
                      <span>Cliente há {formatAccountAge(client.accountAge)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star size={10} />
                      <span>Satisfação: {client.satisfactionScore}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users size={10} />
                      <span>{client.totalInvoices} faturas</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Metrics */}
              <div className="text-right">
                <div className="text-lg font-bold text-gray-900 mb-1">
                  {getMetricValue(client)}
                </div>
                <div className="text-xs text-gray-500 mb-2">
                  {getMetricLabel()}
                </div>
                
                {/* Secondary Metrics */}
                <div className="space-y-1">
                  {activeRanking === 'ltv' && (
                    <div className="text-xs text-gray-600">
                      Receita: {client.totalRevenue.toLocaleString()} MT
                    </div>
                  )}
                  {activeRanking === 'revenue' && (
                    <div className="text-xs text-gray-600">
                      LTV: {client.ltv.toLocaleString()} MT
                    </div>
                  )}
                  {activeRanking === 'oldest' && (
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

      {/* Summary Stats */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Trophy className="text-yellow-500" size={16} />
              <span className="text-sm font-medium text-gray-700">Cliente #1</span>
            </div>
            <div className="text-lg font-bold text-gray-900">
              {rankingData[0]?.companyName}
            </div>
            <div className="text-sm text-gray-600">
              {getMetricValue(rankingData[0])}
            </div>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <TrendingUp className="text-blue-500" size={16} />
              <span className="text-sm font-medium text-gray-700">Crescimento Médio</span>
            </div>
            <div className="text-lg font-bold text-gray-900">
              {activeRanking === 'ltv' ? '+15.2%' : 
               activeRanking === 'revenue' ? '+12.8%' : '+8.5%'}
            </div>
            <div className="text-sm text-gray-600">mensal</div>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Star className="text-purple-500" size={16} />
              <span className="text-sm font-medium text-gray-700">Satisfação Média</span>
            </div>
            <div className="text-lg font-bold text-gray-900">
              {(rankingData.reduce((sum, c) => sum + c.satisfactionScore, 0) / rankingData.length).toFixed(1)}
            </div>
            <div className="text-sm text-gray-600">top 5</div>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <button 
          onClick={() => {
            // Trigger navigation to client analytics
            const event = new CustomEvent('openClientAnalytics');
            window.dispatchEvent(event);
          }}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2 group"
        >
          <Eye size={14} className="group-hover:translate-x-1 transition-transform" />
          Ver análise completa de clientes →
        </button>
      </div>
    </div>
  );
};