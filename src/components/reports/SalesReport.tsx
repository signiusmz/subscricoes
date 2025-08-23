import React, { useState } from 'react';
import { 
  TrendingUp, 
  Users, 
  FileText, 
  DollarSign, 
  Award, 
  Trophy, 
  Medal, 
  Crown,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  Eye,
  BarChart3,
  PieChart,
  Activity,
  Target,
  Star,
  CheckCircle,
  Clock,
  User,
  Mail,
  Phone
} from 'lucide-react';

interface SalesData {
  salespersonId: string;
  salespersonName: string;
  email: string;
  phone: string;
  totalSales: number;
  clientsRegistered: number;
  contractsIssued: number;
  contractsSigned: number;
  averageContractValue: number;
  conversionRate: number;
  lastSale: string;
  monthlyTarget: number;
  achievement: number;
}

interface MonthlyComparison {
  currentMonth: SalesData[];
  previousMonth: SalesData[];
}

const mockSalesData: MonthlyComparison = {
  currentMonth: [
    {
      salespersonId: '1',
      salespersonName: 'João Silva',
      email: 'joao@techsolutions.mz',
      phone: '+258 84 123 4567',
      totalSales: 85000,
      clientsRegistered: 12,
      contractsIssued: 8,
      contractsSigned: 6,
      averageContractValue: 14167,
      conversionRate: 75,
      lastSale: '2024-03-30',
      monthlyTarget: 80000,
      achievement: 106.25
    },
    {
      salespersonId: '2',
      salespersonName: 'Maria Santos',
      email: 'maria@techsolutions.mz',
      phone: '+258 85 987 6543',
      totalSales: 72000,
      clientsRegistered: 10,
      contractsIssued: 7,
      contractsSigned: 5,
      averageContractValue: 14400,
      conversionRate: 71.4,
      lastSale: '2024-03-29',
      monthlyTarget: 70000,
      achievement: 102.86
    },
    {
      salespersonId: '3',
      salespersonName: 'Carlos Mendes',
      email: 'carlos@techsolutions.mz',
      phone: '+258 86 555 7777',
      totalSales: 58000,
      clientsRegistered: 8,
      contractsIssued: 6,
      contractsSigned: 4,
      averageContractValue: 14500,
      conversionRate: 66.7,
      lastSale: '2024-03-28',
      monthlyTarget: 60000,
      achievement: 96.67
    }
  ],
  previousMonth: [
    {
      salespersonId: '1',
      salespersonName: 'João Silva',
      email: 'joao@techsolutions.mz',
      phone: '+258 84 123 4567',
      totalSales: 78000,
      clientsRegistered: 11,
      contractsIssued: 7,
      contractsSigned: 5,
      averageContractValue: 15600,
      conversionRate: 71.4,
      lastSale: '2024-02-28',
      monthlyTarget: 80000,
      achievement: 97.5
    },
    {
      salespersonId: '2',
      salespersonName: 'Maria Santos',
      email: 'maria@techsolutions.mz',
      phone: '+258 85 987 6543',
      totalSales: 65000,
      clientsRegistered: 9,
      contractsIssued: 6,
      contractsSigned: 4,
      averageContractValue: 16250,
      conversionRate: 66.7,
      lastSale: '2024-02-27',
      monthlyTarget: 70000,
      achievement: 92.86
    },
    {
      salespersonId: '3',
      salespersonName: 'Carlos Mendes',
      email: 'carlos@techsolutions.mz',
      phone: '+258 86 555 7777',
      totalSales: 52000,
      clientsRegistered: 7,
      contractsIssued: 5,
      contractsSigned: 3,
      averageContractValue: 17333,
      conversionRate: 60,
      lastSale: '2024-02-25',
      monthlyTarget: 60000,
      achievement: 86.67
    }
  ]
};

interface SalesReportProps {
  onBack?: () => void;
}

export const SalesReport: React.FC<SalesReportProps> = ({ onBack }) => {
  const [selectedPeriod, setSelectedPeriod] = useState<'current' | 'previous'>('current');
  const [sortBy, setSortBy] = useState<'sales' | 'clients' | 'contracts' | 'achievement'>('sales');

  const currentData = mockSalesData[selectedPeriod === 'current' ? 'currentMonth' : 'previousMonth'];
  
  const sortedData = [...currentData].sort((a, b) => {
    switch (sortBy) {
      case 'sales':
        return b.totalSales - a.totalSales;
      case 'clients':
        return b.clientsRegistered - a.clientsRegistered;
      case 'contracts':
        return b.contractsSigned - a.contractsSigned;
      case 'achievement':
        return b.achievement - a.achievement;
      default:
        return 0;
    }
  });

  const getBestPerformer = (metric: 'sales' | 'clients' | 'contracts' | 'achievement') => {
    return currentData.reduce((best, current) => {
      switch (metric) {
        case 'sales':
          return current.totalSales > best.totalSales ? current : best;
        case 'clients':
          return current.clientsRegistered > best.clientsRegistered ? current : best;
        case 'contracts':
          return current.contractsSigned > best.contractsSigned ? current : best;
        case 'achievement':
          return current.achievement > best.achievement ? current : best;
        default:
          return best;
      }
    });
  };

  const getRankIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Trophy className="text-yellow-500" size={24} />;
      case 2:
        return <Medal className="text-gray-400" size={24} />;
      case 3:
        return <Award className="text-orange-500" size={24} />;
      default:
        return <span className="text-gray-500 font-bold">#{position}</span>;
    }
  };

  const getAchievementColor = (achievement: number) => {
    if (achievement >= 100) return 'text-green-600 bg-green-100';
    if (achievement >= 80) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-PT');
  };

  const calculateGrowth = (current: number, previous: number) => {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  const totalCurrentSales = currentData.reduce((sum, s) => sum + s.totalSales, 0);
  const totalPreviousSales = mockSalesData.previousMonth.reduce((sum, s) => sum + s.totalSales, 0);
  const salesGrowth = calculateGrowth(totalCurrentSales, totalPreviousSales);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <BarChart3 className="text-blue-600" size={28} />
            Relatório de Vendas por Vendedor
          </h2>
          <p className="text-gray-600">Performance individual e comparativo mensal</p>
        </div>
        <div className="flex gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Voltar
            </button>
          )}
          <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
            <Download size={16} />
            Exportar
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            <RefreshCw size={16} />
            Atualizar
          </button>
        </div>
      </div>

      {/* Period Selector */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setSelectedPeriod('current')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedPeriod === 'current'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Mês Atual (Março)
            </button>
            <button
              onClick={() => setSelectedPeriod('previous')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedPeriod === 'previous'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Mês Anterior (Fevereiro)
            </button>
          </div>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="sales">Ordenar por Vendas</option>
            <option value="clients">Ordenar por Clientes</option>
            <option value="contracts">Ordenar por Contratos</option>
            <option value="achievement">Ordenar por Meta</option>
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Vendas Totais</p>
              <p className="text-2xl font-bold text-gray-900">{totalCurrentSales.toLocaleString()} MT</p>
              <p className={`text-xs flex items-center gap-1 mt-1 ${
                salesGrowth >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                <TrendingUp size={10} className={salesGrowth < 0 ? 'rotate-180' : ''} />
                {Math.abs(salesGrowth).toFixed(1)}% vs mês anterior
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
              <p className="text-sm font-medium text-gray-600 mb-1">Clientes Novos</p>
              <p className="text-2xl font-bold text-gray-900">
                {currentData.reduce((sum, s) => sum + s.clientsRegistered, 0)}
              </p>
              <p className="text-xs text-blue-600 mt-1">Este mês</p>
            </div>
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-blue-100 text-blue-600">
              <Users size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Contratos Assinados</p>
              <p className="text-2xl font-bold text-gray-900">
                {currentData.reduce((sum, s) => sum + s.contractsSigned, 0)}
              </p>
              <p className="text-xs text-purple-600 mt-1">Este mês</p>
            </div>
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-purple-100 text-purple-600">
              <FileText size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Taxa Conversão</p>
              <p className="text-2xl font-bold text-gray-900">
                {(currentData.reduce((sum, s) => sum + s.conversionRate, 0) / currentData.length).toFixed(1)}%
              </p>
              <p className="text-xs text-orange-600 mt-1">Média da equipe</p>
            </div>
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-orange-100 text-orange-600">
              <Target size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Best Performers */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <Crown className="text-yellow-600" size={20} />
          Melhores Performers do Mês
        </h3>
        
        <div className="grid md:grid-cols-4 gap-6">
          <div className="text-center p-6 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg border-2 border-yellow-300">
            <Trophy className="text-yellow-500 mx-auto mb-3" size={32} />
            <h4 className="font-bold text-yellow-900 mb-1">Maior Volume</h4>
            <p className="text-lg font-bold text-yellow-900">{getBestPerformer('sales').salespersonName}</p>
            <p className="text-sm text-yellow-700">{getBestPerformer('sales').totalSales.toLocaleString()} MT</p>
          </div>

          <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg border-2 border-blue-300">
            <Users className="text-blue-500 mx-auto mb-3" size={32} />
            <h4 className="font-bold text-blue-900 mb-1">Mais Clientes</h4>
            <p className="text-lg font-bold text-blue-900">{getBestPerformer('clients').salespersonName}</p>
            <p className="text-sm text-blue-700">{getBestPerformer('clients').clientsRegistered} clientes</p>
          </div>

          <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border-2 border-purple-300">
            <FileText className="text-purple-500 mx-auto mb-3" size={32} />
            <h4 className="font-bold text-purple-900 mb-1">Mais Contratos</h4>
            <p className="text-lg font-bold text-purple-900">{getBestPerformer('contracts').salespersonName}</p>
            <p className="text-sm text-purple-700">{getBestPerformer('contracts').contractsSigned} assinados</p>
          </div>

          <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border-2 border-green-300">
            <Target className="text-green-500 mx-auto mb-3" size={32} />
            <h4 className="font-bold text-green-900 mb-1">Melhor Meta</h4>
            <p className="text-lg font-bold text-green-900">{getBestPerformer('achievement').salespersonName}</p>
            <p className="text-sm text-green-700">{getBestPerformer('achievement').achievement.toFixed(1)}%</p>
          </div>
        </div>
      </div>

      {/* Detailed Rankings */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Ranking Detalhado - {selectedPeriod === 'current' ? 'Março 2024' : 'Fevereiro 2024'}</h3>
        
        <div className="space-y-4">
          {sortedData.map((salesperson, index) => {
            const position = index + 1;
            const isTopThree = position <= 3;
            const previousData = mockSalesData.previousMonth.find(p => p.salespersonId === salesperson.salespersonId);
            const salesGrowth = previousData ? calculateGrowth(salesperson.totalSales, previousData.totalSales) : 0;
            
            return (
              <div 
                key={salesperson.salespersonId}
                className={`border-2 rounded-lg p-6 transition-all hover:shadow-md ${
                  isTopThree 
                    ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-300' 
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      isTopThree 
                        ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white' 
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {getRankIcon(position)}
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h4 className="text-lg font-bold text-gray-900">{salesperson.salespersonName}</h4>
                        {isTopThree && (
                          <span className="px-2 py-1 text-xs font-bold bg-yellow-100 text-yellow-800 rounded-full">
                            TOP {position}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Mail size={12} />
                          <span>{salesperson.email}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Phone size={12} />
                          <span>{salesperson.phone}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900 mb-1">
                      {salesperson.totalSales.toLocaleString()} MT
                    </div>
                    <div className={`text-sm font-medium flex items-center gap-1 justify-end ${
                      salesGrowth >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      <TrendingUp size={12} className={salesGrowth < 0 ? 'rotate-180' : ''} />
                      {Math.abs(salesGrowth).toFixed(1)}% vs mês anterior
                    </div>
                  </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-600">{salesperson.clientsRegistered}</div>
                    <div className="text-xs text-gray-600">Clientes Novos</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-purple-600">{salesperson.contractsIssued}</div>
                    <div className="text-xs text-gray-600">Contratos Emitidos</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">{salesperson.contractsSigned}</div>
                    <div className="text-xs text-gray-600">Contratos Assinados</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-orange-600">{salesperson.conversionRate.toFixed(1)}%</div>
                    <div className="text-xs text-gray-600">Taxa Conversão</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900">{salesperson.averageContractValue.toLocaleString()} MT</div>
                    <div className="text-xs text-gray-600">Valor Médio</div>
                  </div>
                </div>

                {/* Achievement Progress */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Meta Mensal: {salesperson.monthlyTarget.toLocaleString()} MT</span>
                    <span className={`font-medium ${getAchievementColor(salesperson.achievement).split(' ')[0]}`}>
                      {salesperson.achievement.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full transition-all duration-1000 ${
                        salesperson.achievement >= 100 ? 'bg-green-500' :
                        salesperson.achievement >= 80 ? 'bg-orange-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${Math.min(salesperson.achievement, 100)}%` }}
                    ></div>
                  </div>
                </div>

                {/* Last Activity */}
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Clock size={12} />
                    <span>Última venda: {formatDate(salesperson.lastSale)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getAchievementColor(salesperson.achievement)}`}>
                      {salesperson.achievement >= 100 ? '🎯 Meta Atingida' :
                       salesperson.achievement >= 80 ? '⚠️ Próximo da Meta' : '🔴 Abaixo da Meta'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Comparison Chart */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Comparativo Mensal</h3>
          <div className="space-y-4">
            {mockSalesData.currentMonth.map((current) => {
              const previous = mockSalesData.previousMonth.find(p => p.salespersonId === current.salespersonId);
              const growth = previous ? calculateGrowth(current.totalSales, previous.totalSales) : 0;
              
              return (
                <div key={current.salespersonId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{current.salespersonName}</p>
                    <p className="text-sm text-gray-600">
                      {previous?.totalSales.toLocaleString() || 0} MT → {current.totalSales.toLocaleString()} MT
                    </p>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-bold ${growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {growth >= 0 ? '+' : ''}{growth.toFixed(1)}%
                    </div>
                    <div className="text-xs text-gray-500">crescimento</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Metas vs Realizações</h3>
          <div className="space-y-4">
            {currentData.map((salesperson) => (
              <div key={salesperson.salespersonId} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-gray-900">{salesperson.salespersonName}</span>
                  <span className="text-gray-600">
                    {salesperson.totalSales.toLocaleString()} / {salesperson.monthlyTarget.toLocaleString()} MT
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-1000 ${
                      salesperson.achievement >= 100 ? 'bg-green-500' :
                      salesperson.achievement >= 80 ? 'bg-orange-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${Math.min(salesperson.achievement, 100)}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-500 text-right">
                  {salesperson.achievement.toFixed(1)}% da meta
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};