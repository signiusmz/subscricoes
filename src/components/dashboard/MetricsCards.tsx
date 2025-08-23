import React from 'react';
import { Users, Activity, Clock, TrendingUp, Star, DollarSign, AlertTriangle, CheckCircle } from 'lucide-react';
import { DashboardMetrics } from '../../types';

interface MetricsCardsProps {
  metrics: DashboardMetrics;
}

export const MetricsCards: React.FC<MetricsCardsProps> = ({ metrics }) => {
  const cards = [
    {
      title: 'Total de Clientes',
      value: metrics.totalClients,
      icon: Users,
      color: 'blue',
      suffix: ''
    },
    {
      title: 'Serviços Ativos',
      value: metrics.activeServices,
      icon: Activity,
      color: 'green',
      suffix: ''
    },
    {
      title: 'A Expirar (30 dias)',
      value: metrics.expiringServices,
      icon: AlertTriangle,
      color: 'orange',
      suffix: '',
      trend: '+2 esta semana'
    },
    {
      title: 'Expirados',
      value: metrics.expiredServices,
      icon: CheckCircle,
      color: 'red',
      suffix: '',
      trend: '-1 vs mês passado'
    },
    {
      title: 'Nível de Satisfação',
      value: metrics.averageNPS,
      icon: Star,
      color: 'purple',
      suffix: '',
      trend: '+0.3 este mês'
    },
    {
      title: 'Receita Mensal',
      value: metrics.monthlyRevenue,
      icon: DollarSign,
      color: 'emerald',
      suffix: ' MT',
      trend: '+15.7% vs mês anterior'
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-600',
      green: 'bg-green-100 text-green-600',
      orange: 'bg-orange-100 text-orange-600',
      red: 'bg-red-100 text-red-600',
      purple: 'bg-purple-100 text-purple-600',
      emerald: 'bg-emerald-100 text-emerald-600'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        const isPositiveTrend = card.trend?.includes('+');
        
        return (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg hover:scale-105 transition-all duration-200">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{card.title}</p>
                <p className="text-2xl font-bold text-gray-900">
                  {typeof card.value === 'number' ? card.value.toLocaleString() : card.value}{card.suffix}
                </p>
                {card.trend && (
                  <p className={`text-xs font-medium mt-1 flex items-center gap-1 ${
                    isPositiveTrend ? 'text-green-600' : 'text-red-600'
                  }`}>
                    <TrendingUp size={10} className={isPositiveTrend ? '' : 'rotate-180'} />
                    {card.trend}
                  </p>
                )}
              </div>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getColorClasses(card.color)}`}>
                <Icon size={24} />
              </div>
            </div>
            
            {/* Progress bar for visual appeal */}
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div 
                className={`h-1.5 rounded-full transition-all duration-1000 ${
                  card.color === 'blue' ? 'bg-blue-500' :
                  card.color === 'green' ? 'bg-green-500' :
                  card.color === 'orange' ? 'bg-orange-500' :
                  card.color === 'red' ? 'bg-red-500' :
                  card.color === 'purple' ? 'bg-purple-500' :
                  'bg-emerald-500'
                }`}
                style={{ width: `${Math.min(((typeof card.value === 'number' ? card.value : 0) / 100) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
        );
      })}
    </div>
  );
};