import React from 'react';
import { Users, Activity, Clock, TrendingUp, Star, DollarSign } from 'lucide-react';
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
      icon: Clock,
      color: 'orange',
      suffix: ''
    },
    {
      title: 'Expirados',
      value: metrics.expiredServices,
      icon: Clock,
      color: 'red',
      suffix: ''
    },
    {
      title: 'NPS Médio',
      value: metrics.averageNPS,
      icon: Star,
      color: 'purple',
      suffix: ''
    },
    {
      title: 'Receita Mensal',
      value: metrics.monthlyRevenue,
      icon: DollarSign,
      color: 'emerald',
      suffix: ' MT'
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
        
        return (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{card.title}</p>
                <p className="text-2xl font-bold text-gray-900">
                  {typeof card.value === 'number' ? card.value.toLocaleString() : card.value}{card.suffix}
                </p>
              </div>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getColorClasses(card.color)}`}>
                <Icon size={24} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};