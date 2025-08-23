import React from 'react';
import { Trophy, TrendingUp, DollarSign, Users, Star, Crown, Medal, Award, Target, Zap } from 'lucide-react';

interface Salesperson {
  id: string;
  name: string;
  avatar: string;
  sales: number;
  revenue: number;
  clients: number;
  growth: number;
  performance: number;
  achievements: string[];
}

const mockSalespeople: Salesperson[] = [
  {
    id: '1',
    name: 'João Silva',
    avatar: 'JS',
    sales: 12,
    revenue: 85000,
    clients: 15,
    growth: 15.2,
    performance: 92,
    achievements: ['Maior receita', 'Mais vendas', 'Melhor crescimento']
  },
  {
    id: '2',
    name: 'Maria Santos',
    avatar: 'MS',
    sales: 8,
    revenue: 62000,
    clients: 12,
    growth: 8.7,
    performance: 87,
    achievements: ['Maior ticket médio', 'Melhor satisfação']
  },
  {
    id: '3',
    name: 'Carlos Mendes',
    avatar: 'CM',
    sales: 5,
    revenue: 38000,
    clients: 8,
    growth: -2.1,
    performance: 75,
    achievements: ['Melhor retenção']
  }
];

export const SalespersonOfTheMonth: React.FC = () => {
  const topSalesperson = mockSalespeople[0]; // João Silva is the top performer
  const runners = mockSalespeople.slice(1, 3);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
          <Trophy className="text-white" size={20} />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Vendedor do Mês</h3>
          <p className="text-sm text-gray-600">Março 2024</p>
        </div>
      </div>

      {/* Winner */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border-2 border-yellow-300 p-6 mb-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
              {topSalesperson.avatar}
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
              <Crown size={16} className="text-white" />
            </div>
          </div>
          <div className="flex-1">
            <h4 className="text-xl font-bold text-gray-900 mb-1">{topSalesperson.name}</h4>
            <p className="text-yellow-800 font-medium">🏆 Campeão de Vendas</p>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <Target size={12} />
                {topSalesperson.sales} vendas
              </span>
              <span className="flex items-center gap-1">
                <Users size={12} />
                {topSalesperson.clients} clientes
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">
              {topSalesperson.revenue.toLocaleString()} MT
            </div>
            <div className="flex items-center gap-1 text-green-600">
              <TrendingUp size={14} />
              <span className="font-medium">+{topSalesperson.growth}%</span>
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="flex flex-wrap gap-2 mb-4">
          {topSalesperson.achievements.map((achievement, idx) => (
            <span key={idx} className="px-3 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full font-medium">
              ⭐ {achievement}
            </span>
          ))}
        </div>

        {/* Performance Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">Performance Geral</span>
            <span className="font-medium text-gray-900">{topSalesperson.performance}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-yellow-400 to-orange-500 h-3 rounded-full transition-all duration-1000"
              style={{ width: `${topSalesperson.performance}%` }}
            ></div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900">{(topSalesperson.revenue / topSalesperson.sales).toLocaleString()}</div>
            <div className="text-xs text-gray-600">Ticket Médio</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900">{Math.round(topSalesperson.sales / 30 * 100) / 100}</div>
            <div className="text-xs text-gray-600">Vendas/Dia</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900">{Math.round((topSalesperson.revenue / topSalesperson.clients) / 1000)}K</div>
            <div className="text-xs text-gray-600">Receita/Cliente</div>
          </div>
        </div>
      </div>

      {/* Runners Up */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-700 text-sm">Outros Destaques</h4>
        {runners.map((salesperson, index) => {
          const position = index + 2;
          const medal = position === 2 ? Medal : Award;
          const MedalIcon = medal;
          
          return (
            <div key={salesperson.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center text-white font-bold">
                    {salesperson.avatar}
                  </div>
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-gray-500 rounded-full flex items-center justify-center">
                    <MedalIcon size={12} className="text-white" />
                  </div>
                </div>
                <div>
                  <p className="font-medium text-gray-900">#{position} {salesperson.name}</p>
                  <p className="text-sm text-gray-600">{salesperson.sales} vendas • {salesperson.clients} clientes</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-900">{salesperson.revenue.toLocaleString()} MT</p>
                <div className={`text-sm flex items-center gap-1 ${
                  salesperson.growth >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {salesperson.growth >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                  {Math.abs(salesperson.growth)}%
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Action Button */}
      <div className="pt-4 border-t border-gray-200">
        <button 
          onClick={() => {
            alert(`📊 Relatório Completo de Vendedores - Março 2024\n\n🏆 Campeão: ${topSalesperson.name}\n💰 Receita: ${topSalesperson.revenue.toLocaleString()} MT\n📈 Crescimento: +${topSalesperson.growth}%\n🎯 Performance: ${topSalesperson.performance}%\n\n📋 Relatório detalhado será gerado...`);
          }}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2 group"
        >
          <BarChart3 size={14} className="group-hover:translate-x-1 transition-transform" />
          Ver ranking completo →
        </button>
      </div>
    </div>
  );
};