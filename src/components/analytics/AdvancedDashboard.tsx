import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  PieChart, 
  Activity, 
  Users, 
  DollarSign, 
  AlertTriangle,
  Target,
  Brain,
  Zap,
  Filter,
  Download,
  RefreshCw,
  Eye,
  Calendar,
  Clock,
  Star,
  Crown,
  Trophy,
  Medal,
  Award,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Info,
  ArrowLeft
} from 'lucide-react';

interface ChartData {
  period: string;
  revenue: number;
  clients: number;
  churnRate: number;
  acquisitionCost: number;
  ltv: number;
  satisfaction: number;
}

interface ChurnPrediction {
  clientId: string;
  clientName: string;
  churnProbability: number;
  riskLevel: 'low' | 'medium' | 'high';
  factors: string[];
  recommendedActions: string[];
  lastActivity: string;
  totalValue: number;
}

interface ClientSegment {
  id: string;
  name: string;
  description: string;
  criteria: string[];
  clientCount: number;
  averageLTV: number;
  churnRate: number;
  color: string;
  icon: React.ComponentType<any>;
}

const mockChartData: ChartData[] = [
  { period: 'Jan', revenue: 180000, clients: 35, churnRate: 5.2, acquisitionCost: 1200, ltv: 45000, satisfaction: 8.1 },
  { period: 'Fev', revenue: 195000, clients: 38, churnRate: 4.8, acquisitionCost: 1150, ltv: 47000, satisfaction: 8.3 },
  { period: 'Mar', revenue: 210000, clients: 42, churnRate: 4.2, acquisitionCost: 1100, ltv: 49000, satisfaction: 8.5 },
  { period: 'Abr', revenue: 225000, clients: 45, churnRate: 3.8, acquisitionCost: 1050, ltv: 52000, satisfaction: 8.7 },
  { period: 'Mai', revenue: 240000, clients: 48, churnRate: 3.5, acquisitionCost: 1000, ltv: 55000, satisfaction: 8.9 },
  { period: 'Jun', revenue: 255000, clients: 52, churnRate: 3.2, acquisitionCost: 950, ltv: 58000, satisfaction: 9.1 }
];

const mockChurnPredictions: ChurnPrediction[] = [
  {
    clientId: '1',
    clientName: 'Farmácia Central',
    churnProbability: 85,
    riskLevel: 'high',
    factors: ['Pagamentos atrasados', 'Baixa satisfação', 'Redução de uso'],
    recommendedActions: ['Contacto imediato', 'Oferecer desconto', 'Reunião presencial'],
    lastActivity: '2024-03-10',
    totalValue: 45000
  },
  {
    clientId: '2',
    clientName: 'Águas de Maputo',
    churnProbability: 72,
    riskLevel: 'high',
    factors: ['Sem renovação há 60 dias', 'Reclamações frequentes'],
    recommendedActions: ['Ligar urgente', 'Propor novo plano', 'Gestor dedicado'],
    lastActivity: '2024-03-08',
    totalValue: 65000
  },
  {
    clientId: '3',
    clientName: 'Construções Beira SA',
    churnProbability: 45,
    riskLevel: 'medium',
    factors: ['Redução de 20% no uso', 'Atraso de 5 dias no pagamento'],
    recommendedActions: ['Check-in mensal', 'Oferecer treinamento'],
    lastActivity: '2024-03-20',
    totalValue: 120000
  },
  {
    clientId: '4',
    clientName: 'Supermercado Shoprite',
    churnProbability: 28,
    riskLevel: 'medium',
    factors: ['Satisfação em declínio'],
    recommendedActions: ['Pesquisa de satisfação', 'Melhorar suporte'],
    lastActivity: '2024-03-22',
    totalValue: 75000
  }
];

const clientSegments: ClientSegment[] = [
  {
    id: 'premium',
    name: 'Premium Champions',
    description: 'Clientes de alto valor com excelente relacionamento',
    criteria: ['LTV > 200.000 MT', 'Satisfação > 9.0', 'Sem atrasos'],
    clientCount: 8,
    averageLTV: 280000,
    churnRate: 2.1,
    color: 'from-purple-500 to-pink-500',
    icon: Crown
  },
  {
    id: 'gold',
    name: 'Gold Partners',
    description: 'Clientes valiosos com bom relacionamento',
    criteria: ['LTV > 100.000 MT', 'Satisfação > 8.5', 'Pagamentos pontuais'],
    clientCount: 15,
    averageLTV: 150000,
    churnRate: 4.2,
    color: 'from-yellow-500 to-orange-500',
    icon: Trophy
  },
  {
    id: 'silver',
    name: 'Silver Members',
    description: 'Clientes estáveis com potencial de crescimento',
    criteria: ['LTV > 50.000 MT', 'Satisfação > 7.5'],
    clientCount: 18,
    averageLTV: 85000,
    churnRate: 8.5,
    color: 'from-gray-400 to-gray-600',
    icon: Medal
  },
  {
    id: 'bronze',
    name: 'Bronze Starters',
    description: 'Novos clientes ou baixo valor',
    criteria: ['LTV < 50.000 MT', 'Clientes há menos de 6 meses'],
    clientCount: 11,
    averageLTV: 25000,
    churnRate: 15.8,
    color: 'from-orange-600 to-red-500',
    icon: Award
  }
];

export const AdvancedDashboard: React.FC = () => {
  const [activeChart, setActiveChart] = useState<'revenue' | 'churn' | 'ltv' | 'satisfaction'>('revenue');
  const [selectedPeriod, setSelectedPeriod] = useState('6months');
  const [hoveredDataPoint, setHoveredDataPoint] = useState<number | null>(null);
  const [showChurnDetails, setShowChurnDetails] = useState(false);
  const [selectedSegment, setSelectedSegment] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const getChartData = () => {
    switch (activeChart) {
      case 'revenue':
        return mockChartData.map(d => ({ ...d, value: d.revenue, label: 'Receita' }));
      case 'churn':
        return mockChartData.map(d => ({ ...d, value: d.churnRate, label: 'Taxa de Churn' }));
      case 'ltv':
        return mockChartData.map(d => ({ ...d, value: d.ltv, label: 'LTV Médio' }));
      case 'satisfaction':
        return mockChartData.map(d => ({ ...d, value: d.satisfaction, label: 'Satisfação' }));
      default:
        return mockChartData.map(d => ({ ...d, value: d.revenue, label: 'Receita' }));
    }
  };

  const chartData = getChartData();
  const maxValue = Math.max(...chartData.map(d => d.value));
  const minValue = Math.min(...chartData.map(d => d.value));

  const getBarHeight = (value: number) => {
    const percentage = ((value - minValue) / (maxValue - minValue)) * 100;
    return Math.max(percentage * 0.8, 10);
  };

  const getChartColor = () => {
    switch (activeChart) {
      case 'revenue':
        return 'from-blue-500 to-blue-600';
      case 'churn':
        return 'from-red-500 to-red-600';
      case 'ltv':
        return 'from-green-500 to-green-600';
      case 'satisfaction':
        return 'from-purple-500 to-purple-600';
      default:
        return 'from-blue-500 to-blue-600';
    }
  };

  const formatValue = (value: number) => {
    switch (activeChart) {
      case 'revenue':
        return `${(value / 1000).toFixed(0)}K MT`;
      case 'churn':
        return `${value.toFixed(1)}%`;
      case 'ltv':
        return `${(value / 1000).toFixed(0)}K MT`;
      case 'satisfaction':
        return value.toFixed(1);
      default:
        return value.toString();
    }
  };

  const getChurnRiskColor = (level: string) => {
    switch (level) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'medium':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const refreshData = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      alert('Dados atualizados com sucesso!');
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analytics Avançado</h2>
          <p className="text-gray-600">Dashboard inteligente com análise preditiva e segmentação automática</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => window.history.back()}
            className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            Voltar ao Dashboard
          </button>
          <button
            onClick={refreshData}
            disabled={isLoading}
            className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <RefreshCw className={isLoading ? 'animate-spin' : ''} size={16} />
            {isLoading ? 'Atualizando...' : 'Atualizar'}
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            <Download size={16} />
            Exportar
          </button>
        </div>
      </div>

      {/* AI Insights Banner */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl p-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <Brain size={32} className="text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold mb-2">🤖 Insights de IA</h3>
            <p className="text-purple-100 mb-3">
              Nossa IA analisou seus dados e identificou oportunidades importantes
            </p>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="bg-white bg-opacity-10 rounded-lg p-3">
                <p className="font-semibold">⚠️ 4 clientes em risco alto</p>
                <p className="text-purple-200">Ação necessária em 48h</p>
              </div>
              <div className="bg-white bg-opacity-10 rounded-lg p-3">
                <p className="font-semibold">📈 Oportunidade de upsell</p>
                <p className="text-purple-200">8 clientes prontos para upgrade</p>
              </div>
              <div className="bg-white bg-opacity-10 rounded-lg p-3">
                <p className="font-semibold">💰 Potencial de receita</p>
                <p className="text-purple-200">+45.000 MT este mês</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Main Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Análise Temporal Interativa</h3>
            <div className="flex bg-gray-100 rounded-lg p-1">
              {[
                { type: 'revenue' as const, label: 'Receita', icon: DollarSign },
                { type: 'churn' as const, label: 'Churn', icon: TrendingDown },
                { type: 'ltv' as const, label: 'LTV', icon: TrendingUp },
                { type: 'satisfaction' as const, label: 'NPS', icon: Star }
              ].map((option) => {
                const Icon = option.icon;
                return (
                  <button
                    key={option.type}
                    onClick={() => setActiveChart(option.type)}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
                      activeChart === option.type
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

          {/* Chart */}
          <div className="h-80 bg-gradient-to-t from-gray-50 to-transparent rounded-lg p-4 relative">
            <div className="h-full flex items-end justify-between gap-2">
              {chartData.map((data, index) => {
                const barHeight = getBarHeight(data.value);
                const isHovered = hoveredDataPoint === index;
                
                return (
                  <div
                    key={index}
                    className="flex flex-col items-center gap-2 flex-1 relative group cursor-pointer"
                    onMouseEnter={() => setHoveredDataPoint(index)}
                    onMouseLeave={() => setHoveredDataPoint(null)}
                  >
                    {/* Tooltip */}
                    {isHovered && (
                      <div className="absolute -top-20 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-4 py-3 rounded-lg text-xs whitespace-nowrap z-10 shadow-lg">
                        <div className="font-medium">{data.period} 2024</div>
                        <div className="text-blue-300">{data.label}: {formatValue(data.value)}</div>
                        <div className="text-gray-300">Clientes: {data.clients}</div>
                        <div className="text-gray-300">Churn: {data.churnRate}%</div>
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                      </div>
                    )}
                    
                    {/* Bar with drill-down effect */}
                    <div
                      className={`w-full max-w-12 bg-gradient-to-t ${getChartColor()} rounded-t-md transition-all duration-500 ease-out cursor-pointer ${
                        isHovered ? 'shadow-lg scale-110 brightness-110' : 'hover:shadow-md hover:scale-105'
                      }`}
                      style={{ 
                        height: `${barHeight * 2}px`,
                        minHeight: '20px'
                      }}
                      onClick={() => {
                        alert(`Drill-down para ${data.period}:\n\n📊 ${data.label}: ${formatValue(data.value)}\n👥 Clientes: ${data.clients}\n📉 Churn: ${data.churnRate}%\n💰 LTV: ${data.ltv.toLocaleString()} MT\n⭐ Satisfação: ${data.satisfaction}`);
                      }}
                    />
                    
                    <span className="text-xs text-gray-600 font-medium">{data.period}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Chart Insights */}
          <div className="mt-4 grid grid-cols-3 gap-4 text-center">
            <div className="bg-blue-50 rounded-lg p-3">
              <div className="text-lg font-bold text-blue-600">
                {chartData[chartData.length - 1]?.value ? formatValue(chartData[chartData.length - 1].value) : '0'}
              </div>
              <div className="text-xs text-blue-700">Atual</div>
            </div>
            <div className="bg-green-50 rounded-lg p-3">
              <div className="text-lg font-bold text-green-600">
                +{((chartData[chartData.length - 1]?.value - chartData[0]?.value) / chartData[0]?.value * 100).toFixed(1)}%
              </div>
              <div className="text-xs text-green-700">Crescimento</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-3">
              <div className="text-lg font-bold text-purple-600">
                {(chartData.reduce((sum, d) => sum + d.value, 0) / chartData.length).toFixed(0)}
              </div>
              <div className="text-xs text-purple-700">Média</div>
            </div>
          </div>
        </div>

        {/* Churn Prediction */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="text-red-600" size={20} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Análise de Churn (IA)</h3>
                <p className="text-sm text-gray-600">Previsão de cancelamentos com IA</p>
              </div>
            </div>
            <button
              onClick={() => setShowChurnDetails(!showChurnDetails)}
              className="text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <Eye size={16} />
              {showChurnDetails ? 'Ocultar' : 'Ver Todos'}
            </button>
          </div>

          {/* High Risk Clients */}
          <div className="space-y-3">
            {mockChurnPredictions.slice(0, showChurnDetails ? undefined : 3).map((prediction) => (
              <div 
                key={prediction.clientId}
                className={`border-2 rounded-lg p-4 transition-all hover:shadow-md ${
                  prediction.riskLevel === 'high' ? 'border-red-300 bg-red-50' :
                  prediction.riskLevel === 'medium' ? 'border-orange-300 bg-orange-50' :
                  'border-green-300 bg-green-50'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-900">{prediction.clientName}</h4>
                    <p className="text-sm text-gray-600">Valor: {prediction.totalValue.toLocaleString()} MT</p>
                  </div>
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${
                      prediction.riskLevel === 'high' ? 'text-red-600' :
                      prediction.riskLevel === 'medium' ? 'text-orange-600' :
                      'text-green-600'
                    }`}>
                      {prediction.churnProbability}%
                    </div>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${getChurnRiskColor(prediction.riskLevel)}`}>
                      {prediction.riskLevel === 'high' ? 'Alto Risco' :
                       prediction.riskLevel === 'medium' ? 'Médio Risco' : 'Baixo Risco'}
                    </span>
                  </div>
                </div>

                {/* Risk Factors */}
                <div className="mb-3">
                  <p className="text-xs font-medium text-gray-700 mb-1">Fatores de Risco:</p>
                  <div className="flex flex-wrap gap-1">
                    {prediction.factors.map((factor, idx) => (
                      <span key={idx} className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">
                        {factor}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Recommended Actions */}
                <div className="mb-3">
                  <p className="text-xs font-medium text-gray-700 mb-1">Ações Recomendadas:</p>
                  <div className="space-y-1">
                    {prediction.recommendedActions.slice(0, 2).map((action, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                        <span className="text-xs text-gray-700">{action}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button 
                    onClick={() => alert(`Contactando ${prediction.clientName}...`)}
                    className={`text-xs px-3 py-1 rounded-lg font-medium transition-colors ${
                      prediction.riskLevel === 'high' 
                        ? 'bg-red-600 text-white hover:bg-red-700'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    Contactar Agora
                  </button>
                  <button 
                    onClick={() => alert(`Criando plano de retenção para ${prediction.clientName}...`)}
                    className="text-xs px-3 py-1 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
                  >
                    Plano de Retenção
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Churn Summary */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-lg font-bold text-red-600">
                  {mockChurnPredictions.filter(p => p.riskLevel === 'high').length}
                </div>
                <div className="text-xs text-gray-600">Alto Risco</div>
              </div>
              <div>
                <div className="text-lg font-bold text-orange-600">
                  {mockChurnPredictions.filter(p => p.riskLevel === 'medium').length}
                </div>
                <div className="text-xs text-gray-600">Médio Risco</div>
              </div>
              <div>
                <div className="text-lg font-bold text-gray-600">
                  {(mockChurnPredictions.reduce((sum, p) => sum + p.totalValue, 0) / 1000).toFixed(0)}K MT
                </div>
                <div className="text-xs text-gray-600">Valor em Risco</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Client Segmentation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
              <Target className="text-white" size={20} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Segmentação Automática</h3>
              <p className="text-sm text-gray-600">Classificação inteligente por valor e comportamento</p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {clientSegments.map((segment) => {
            const Icon = segment.icon;
            const isSelected = selectedSegment === segment.id;
            
            return (
              <div
                key={segment.id}
                className={`border-2 rounded-xl p-6 cursor-pointer transition-all hover:shadow-lg ${
                  isSelected ? 'border-blue-500 shadow-lg scale-105' : 'border-gray-200 hover:border-blue-300'
                }`}
                onClick={() => setSelectedSegment(isSelected ? null : segment.id)}
              >
                <div className="text-center mb-4">
                  <div className={`w-16 h-16 bg-gradient-to-r ${segment.color} rounded-full flex items-center justify-center mx-auto mb-3`}>
                    <Icon size={32} className="text-white" />
                  </div>
                  <h4 className="font-bold text-gray-900 mb-1">{segment.name}</h4>
                  <p className="text-xs text-gray-600">{segment.description}</p>
                </div>

                <div className="space-y-3">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{segment.clientCount}</div>
                    <div className="text-xs text-gray-600">clientes</div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">LTV Médio:</span>
                      <span className="font-medium">{(segment.averageLTV / 1000).toFixed(0)}K MT</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">Taxa Churn:</span>
                      <span className={`font-medium ${
                        segment.churnRate > 10 ? 'text-red-600' : 
                        segment.churnRate > 5 ? 'text-orange-600' : 'text-green-600'
                      }`}>
                        {segment.churnRate}%
                      </span>
                    </div>
                  </div>

                  {/* Criteria */}
                  <div className="pt-2 border-t border-gray-200">
                    <p className="text-xs font-medium text-gray-700 mb-1">Critérios:</p>
                    <div className="space-y-1">
                      {segment.criteria.slice(0, 2).map((criteria, idx) => (
                        <div key={idx} className="text-xs text-gray-600 flex items-center gap-1">
                          <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                          {criteria}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    alert(`Visualizando clientes do segmento ${segment.name}:\n\n👥 ${segment.clientCount} clientes\n💰 LTV Médio: ${segment.averageLTV.toLocaleString()} MT\n📉 Taxa de Churn: ${segment.churnRate}%\n\n🎯 Estratégias recomendadas serão exibidas...`);
                  }}
                  className={`w-full mt-4 py-2 px-4 rounded-lg text-xs font-medium transition-colors bg-gradient-to-r ${segment.color} text-white hover:shadow-md`}
                >
                  Ver Clientes
                </button>
              </div>
            );
          })}
        </div>

        {/* Segment Insights */}
        {selectedSegment && (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <Info className="text-blue-600" size={16} />
              <span className="font-semibold text-blue-900">
                Insights do Segmento {clientSegments.find(s => s.id === selectedSegment)?.name}
              </span>
            </div>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-800">
              <div>
                <p className="font-medium mb-1">🎯 Estratégias Recomendadas:</p>
                <ul className="space-y-1 text-xs">
                  <li>• Comunicação personalizada por segmento</li>
                  <li>• Ofertas específicas baseadas no valor</li>
                  <li>• Frequência de contato otimizada</li>
                </ul>
              </div>
              <div>
                <p className="font-medium mb-1">📊 Métricas de Performance:</p>
                <ul className="space-y-1 text-xs">
                  <li>• Taxa de conversão: 85%</li>
                  <li>• Tempo médio de resposta: 2.3h</li>
                  <li>• Satisfação média: 8.7/10</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Advanced Metrics Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
              <TrendingUp className="text-white" size={24} />
            </div>
            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">+12.5%</span>
          </div>
          <h4 className="font-semibold text-gray-900 mb-1">Customer Lifetime Value</h4>
          <p className="text-2xl font-bold text-gray-900">156K MT</p>
          <p className="text-sm text-gray-600">LTV médio por cliente</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-500 rounded-lg flex items-center justify-center">
              <Brain className="text-white" size={24} />
            </div>
            <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">IA</span>
          </div>
          <h4 className="font-semibold text-gray-900 mb-1">Previsão de Receita</h4>
          <p className="text-2xl font-bold text-gray-900">285K MT</p>
          <p className="text-sm text-gray-600">Próximos 3 meses</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-red-500 rounded-lg flex items-center justify-center">
              <Target className="text-white" size={24} />
            </div>
            <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">-2.1%</span>
          </div>
          <h4 className="font-semibold text-gray-900 mb-1">Taxa de Churn</h4>
          <p className="text-2xl font-bold text-gray-900">3.2%</p>
          <p className="text-sm text-gray-600">Este mês</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-lg flex items-center justify-center">
              <Zap className="text-white" size={24} />
            </div>
            <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full">Auto</span>
          </div>
          <h4 className="font-semibold text-gray-900 mb-1">Automações Ativas</h4>
          <p className="text-2xl font-bold text-gray-900">24</p>
          <p className="text-sm text-gray-600">Fluxos em execução</p>
        </div>
      </div>

      {/* Predictive Analytics */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <Brain className="text-purple-600" size={20} />
          Análise Preditiva com IA
        </h3>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Revenue Forecast */}
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-6 border border-blue-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <DollarSign className="text-white" size={20} />
              </div>
              <div>
                <h4 className="font-semibold text-blue-900">Previsão de Receita</h4>
                <p className="text-sm text-blue-700">Próximos 6 meses</p>
              </div>
            </div>
            <div className="space-y-3">
              {['Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'].map((month, idx) => {
                const baseValue = 255000;
                const growth = 1 + (idx * 0.08);
                const predictedValue = Math.round(baseValue * growth);
                
                return (
                  <div key={month} className="flex items-center justify-between">
                    <span className="text-sm text-blue-800">{month}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-blue-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${(idx + 1) * 20}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-blue-900">
                        {(predictedValue / 1000).toFixed(0)}K
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 pt-4 border-t border-blue-200">
              <div className="text-center">
                <div className="text-xl font-bold text-blue-900">1.65M MT</div>
                <div className="text-sm text-blue-700">Total previsto</div>
              </div>
            </div>
          </div>

          {/* Churn Prevention */}
          <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-lg p-6 border border-red-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
                <AlertTriangle className="text-white" size={20} />
              </div>
              <div>
                <h4 className="font-semibold text-red-900">Prevenção de Churn</h4>
                <p className="text-sm text-red-700">Ações automáticas</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="bg-white bg-opacity-50 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-red-900">Intervenções Ativas</span>
                  <span className="text-lg font-bold text-red-900">12</span>
                </div>
                <div className="text-xs text-red-700">Clientes sendo acompanhados</div>
              </div>
              <div className="bg-white bg-opacity-50 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-red-900">Taxa de Sucesso</span>
                  <span className="text-lg font-bold text-red-900">78%</span>
                </div>
                <div className="text-xs text-red-700">Retenção após intervenção</div>
              </div>
              <div className="bg-white bg-opacity-50 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-red-900">Valor Salvo</span>
                  <span className="text-lg font-bold text-red-900">156K MT</span>
                </div>
                <div className="text-xs text-red-700">Receita preservada</div>
              </div>
            </div>
          </div>

          {/* Growth Opportunities */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                <Zap className="text-white" size={20} />
              </div>
              <div>
                <h4 className="font-semibold text-green-900">Oportunidades</h4>
                <p className="text-sm text-green-700">Crescimento identificado</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="bg-white bg-opacity-50 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-green-900">Upsell Ready</span>
                  <span className="text-lg font-bold text-green-900">8</span>
                </div>
                <div className="text-xs text-green-700">Clientes prontos para upgrade</div>
              </div>
              <div className="bg-white bg-opacity-50 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-green-900">Cross-sell</span>
                  <span className="text-lg font-bold text-green-900">15</span>
                </div>
                <div className="text-xs text-green-700">Oportunidades de novos serviços</div>
              </div>
              <div className="bg-white bg-opacity-50 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-green-900">Potencial</span>
                  <span className="text-lg font-bold text-green-900">89K MT</span>
                </div>
                <div className="text-xs text-green-700">Receita adicional estimada</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Recommendations */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
            <Brain size={24} className="text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold">Recomendações Inteligentes</h3>
            <p className="text-indigo-200">Ações prioritárias baseadas em IA</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white bg-opacity-10 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle size={16} />
              <span className="font-semibold">Ação Urgente</span>
            </div>
            <p className="text-sm text-indigo-100 mb-3">
              Contactar Farmácia Central nas próximas 24h - 85% probabilidade de churn
            </p>
            <button className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600 transition-colors">
              Contactar Agora
            </button>
          </div>

          <div className="bg-white bg-opacity-10 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp size={16} />
              <span className="font-semibold">Oportunidade</span>
            </div>
            <p className="text-sm text-indigo-100 mb-3">
              8 clientes Premium prontos para upgrade - potencial de +45K MT
            </p>
            <button className="bg-green-500 text-white px-3 py-1 rounded text-xs hover:bg-green-600 transition-colors">
              Ver Oportunidades
            </button>
          </div>

          <div className="bg-white bg-opacity-10 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Star size={16} />
              <span className="font-semibold">Otimização</span>
            </div>
            <p className="text-sm text-indigo-100 mb-3">
              Ajustar frequência de comunicação pode aumentar satisfação em 15%
            </p>
            <button className="bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600 transition-colors">
              Aplicar Sugestão
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};