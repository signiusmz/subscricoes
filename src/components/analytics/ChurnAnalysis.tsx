import React, { useState } from 'react';
import { 
  AlertTriangle, 
  TrendingDown, 
  Brain, 
  Target, 
  Clock, 
  DollarSign,
  User,
  Mail,
  Phone,
  Calendar,
  Activity,
  Zap,
  CheckCircle,
  XCircle,
  ArrowRight,
  Eye,
  Filter,
  Download,
  RefreshCw,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface ChurnClient {
  id: string;
  companyName: string;
  representative: string;
  email: string;
  phone: string;
  churnProbability: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  riskFactors: RiskFactor[];
  recommendedActions: Action[];
  lastActivity: string;
  totalValue: number;
  monthsAsClient: number;
  satisfactionScore: number;
  paymentBehavior: 'excellent' | 'good' | 'average' | 'poor';
  engagementLevel: number;
  contractsCount: number;
  lastPaymentDelay: number;
}

interface RiskFactor {
  factor: string;
  impact: 'high' | 'medium' | 'low';
  description: string;
}

interface Action {
  action: string;
  priority: 'urgent' | 'high' | 'medium' | 'low';
  estimatedImpact: string;
  timeframe: string;
}

const mockChurnClients: ChurnClient[] = [
  {
    id: '1',
    companyName: 'Farmácia Central',
    representative: 'António Silva',
    email: 'antonio@farmaciacentral.mz',
    phone: '+258 86 555 7777',
    churnProbability: 89,
    riskLevel: 'critical',
    riskFactors: [
      { factor: 'Pagamentos atrasados', impact: 'high', description: '3 pagamentos consecutivos com atraso > 15 dias' },
      { factor: 'Baixa satisfação', impact: 'high', description: 'NPS caiu de 8.5 para 6.2 nos últimos 3 meses' },
      { factor: 'Redução de uso', impact: 'medium', description: 'Uso da plataforma reduziu 40% no último mês' },
      { factor: 'Sem renovação', impact: 'high', description: 'Contrato expirou há 15 dias sem renovação' }
    ],
    recommendedActions: [
      { action: 'Contacto telefónico imediato', priority: 'urgent', estimatedImpact: '65% chance de retenção', timeframe: '24h' },
      { action: 'Oferecer desconto de 30%', priority: 'urgent', estimatedImpact: '45% chance de renovação', timeframe: '48h' },
      { action: 'Reunião presencial', priority: 'high', estimatedImpact: '80% chance de resolução', timeframe: '1 semana' },
      { action: 'Plano de pagamento personalizado', priority: 'high', estimatedImpact: '70% melhoria no pagamento', timeframe: '3 dias' }
    ],
    lastActivity: '2024-03-10',
    totalValue: 45000,
    monthsAsClient: 14,
    satisfactionScore: 6.2,
    paymentBehavior: 'poor',
    engagementLevel: 25,
    contractsCount: 2,
    lastPaymentDelay: 18
  },
  {
    id: '2',
    companyName: 'Águas de Maputo',
    representative: 'Ricardo Bila',
    email: 'ricardo@aguasmaputo.mz',
    phone: '+258 83 555 6666',
    churnProbability: 76,
    riskLevel: 'high',
    riskFactors: [
      { factor: 'Sem renovação há 60 dias', impact: 'high', description: 'Contrato principal expirou sem renovação' },
      { factor: 'Reclamações frequentes', impact: 'medium', description: '5 tickets de suporte nos últimos 30 dias' },
      { factor: 'Baixo engajamento', impact: 'medium', description: 'Login na plataforma reduziu 60%' }
    ],
    recommendedActions: [
      { action: 'Ligar nas próximas 2 horas', priority: 'urgent', estimatedImpact: '55% chance de retenção', timeframe: '2h' },
      { action: 'Propor novo plano com desconto', priority: 'high', estimatedImpact: '40% chance de renovação', timeframe: '24h' },
      { action: 'Atribuir gestor dedicado', priority: 'high', estimatedImpact: '60% melhoria na satisfação', timeframe: '1 semana' }
    ],
    lastActivity: '2024-03-08',
    totalValue: 65000,
    monthsAsClient: 18,
    satisfactionScore: 7.1,
    paymentBehavior: 'average',
    engagementLevel: 35,
    contractsCount: 3,
    lastPaymentDelay: 8
  },
  {
    id: '3',
    companyName: 'Construções Beira SA',
    representative: 'Maria Santos',
    email: 'maria@construcoesbeira.mz',
    phone: '+258 85 987 6543',
    churnProbability: 52,
    riskLevel: 'medium',
    riskFactors: [
      { factor: 'Redução de 20% no uso', impact: 'medium', description: 'Menos logins e atividade na plataforma' },
      { factor: 'Atraso de 5 dias no pagamento', impact: 'low', description: 'Último pagamento com pequeno atraso' },
      { factor: 'Satisfação em declínio', impact: 'medium', description: 'NPS caiu de 9.1 para 8.8' }
    ],
    recommendedActions: [
      { action: 'Check-in mensal agendado', priority: 'medium', estimatedImpact: '30% melhoria no engajamento', timeframe: '1 semana' },
      { action: 'Oferecer treinamento adicional', priority: 'medium', estimatedImpact: '25% aumento no uso', timeframe: '2 semanas' },
      { action: 'Pesquisa de satisfação detalhada', priority: 'low', estimatedImpact: '20% melhoria na satisfação', timeframe: '1 mês' }
    ],
    lastActivity: '2024-03-20',
    totalValue: 120000,
    monthsAsClient: 10,
    satisfactionScore: 8.8,
    paymentBehavior: 'good',
    engagementLevel: 65,
    contractsCount: 4,
    lastPaymentDelay: 5
  }
];

export const ChurnAnalysis: React.FC = () => {
  const [selectedRiskLevel, setSelectedRiskLevel] = useState<'all' | 'critical' | 'high' | 'medium' | 'low'>('all');
  const [sortBy, setSortBy] = useState<'probability' | 'value' | 'activity'>('probability');
  const [showActionPlan, setShowActionPlan] = useState<string | null>(null);
  const [expandedClient, setExpandedClient] = useState<string | null>(null);

  const filteredClients = mockChurnClients.filter(client => 
    selectedRiskLevel === 'all' || client.riskLevel === selectedRiskLevel
  ).sort((a, b) => {
    switch (sortBy) {
      case 'probability':
        return b.churnProbability - a.churnProbability;
      case 'value':
        return b.totalValue - a.totalValue;
      case 'activity':
        return new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime();
      default:
        return 0;
    }
  });

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'critical':
        return 'bg-red-600 text-white';
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

  const getRiskLabel = (level: string) => {
    switch (level) {
      case 'critical':
        return 'CRÍTICO';
      case 'high':
        return 'Alto';
      case 'medium':
        return 'Médio';
      case 'low':
        return 'Baixo';
      default:
        return level;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'text-red-600';
      case 'medium':
        return 'text-orange-600';
      case 'low':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-500 text-white';
      case 'high':
        return 'bg-orange-500 text-white';
      case 'medium':
        return 'bg-blue-500 text-white';
      case 'low':
        return 'bg-gray-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-PT');
  };

  const calculateDaysAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const executeAction = (clientName: string, action: Action) => {
    alert(`🎯 Executando ação para ${clientName}:\n\n📋 Ação: ${action.action}\n⚡ Prioridade: ${action.priority.toUpperCase()}\n📈 Impacto Estimado: ${action.estimatedImpact}\n⏰ Prazo: ${action.timeframe}\n\n✅ Ação registrada no sistema!`);
  };

  // Calculate summary stats
  const summaryStats = {
    totalAtRisk: filteredClients.length,
    criticalRisk: filteredClients.filter(c => c.riskLevel === 'critical').length,
    highRisk: filteredClients.filter(c => c.riskLevel === 'high').length,
    totalValueAtRisk: filteredClients.reduce((sum, c) => sum + c.totalValue, 0),
    averageChurnProbability: filteredClients.reduce((sum, c) => sum + c.churnProbability, 0) / filteredClients.length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Brain className="text-purple-600" size={28} />
            Análise de Churn com IA
          </h2>
          <p className="text-gray-600">Previsão inteligente de cancelamentos e ações preventivas</p>
        </div>
        <div className="flex gap-3">
          <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
            <Download size={16} />
            Exportar Análise
          </button>
          <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2">
            <RefreshCw size={16} />
            Atualizar IA
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Clientes em Risco</p>
              <p className="text-2xl font-bold text-gray-900">{summaryStats.totalAtRisk}</p>
              <p className="text-xs text-red-600 mt-1">Requer atenção</p>
            </div>
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-red-100 text-red-600">
              <AlertTriangle size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Risco Crítico</p>
              <p className="text-2xl font-bold text-gray-900">{summaryStats.criticalRisk}</p>
              <p className="text-xs text-red-600 mt-1">Ação imediata</p>
            </div>
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-red-600 text-white">
              <XCircle size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Valor em Risco</p>
              <p className="text-2xl font-bold text-gray-900">{(summaryStats.totalValueAtRisk / 1000).toFixed(0)}K MT</p>
              <p className="text-xs text-orange-600 mt-1">Receita potencial perdida</p>
            </div>
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-orange-100 text-orange-600">
              <DollarSign size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Churn Médio</p>
              <p className="text-2xl font-bold text-gray-900">{summaryStats.averageChurnProbability.toFixed(1)}%</p>
              <p className="text-xs text-blue-600 mt-1">Probabilidade média</p>
            </div>
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-blue-100 text-blue-600">
              <TrendingDown size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <Filter className="text-gray-400" size={20} />
              <span className="text-sm font-medium text-gray-700">Filtros:</span>
            </div>
            {['all', 'critical', 'high', 'medium', 'low'].map((level) => (
              <button
                key={level}
                onClick={() => setSelectedRiskLevel(level as any)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedRiskLevel === level
                    ? level === 'critical' ? 'bg-red-600 text-white' :
                      level === 'high' ? 'bg-red-500 text-white' :
                      level === 'medium' ? 'bg-orange-500 text-white' :
                      level === 'low' ? 'bg-green-500 text-white' :
                      'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {level === 'all' ? 'Todos' : getRiskLabel(level)}
              </button>
            ))}
          </div>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="probability">Maior Probabilidade</option>
            <option value="value">Maior Valor</option>
            <option value="activity">Atividade Recente</option>
          </select>
        </div>
      </div>

      {/* Churn Clients List */}
      <div className="space-y-4">
        {filteredClients.map((client) => {
          const isExpanded = expandedClient === client.id;
          const daysAgo = calculateDaysAgo(client.lastActivity);
          
          return (
            <div 
              key={client.id}
              className={`bg-white rounded-xl shadow-sm border-2 transition-all ${
                client.riskLevel === 'critical' ? 'border-red-500 shadow-red-100' :
                client.riskLevel === 'high' ? 'border-red-300' :
                client.riskLevel === 'medium' ? 'border-orange-300' :
                'border-green-300'
              }`}
            >
              {/* Client Header */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                      client.riskLevel === 'critical' ? 'bg-red-600 text-white' :
                      client.riskLevel === 'high' ? 'bg-red-100 text-red-600' :
                      client.riskLevel === 'medium' ? 'bg-orange-100 text-orange-600' :
                      'bg-green-100 text-green-600'
                    }`}>
                      <div className="text-center">
                        <div className="text-lg font-bold">{client.churnProbability}%</div>
                        <div className="text-xs">CHURN</div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{client.companyName}</h3>
                      <p className="text-gray-600">{client.representative}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar size={12} />
                          Cliente há {client.monthsAsClient} meses
                        </span>
                        <span className="flex items-center gap-1">
                          <DollarSign size={12} />
                          {client.totalValue.toLocaleString()} MT
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={12} />
                          Última atividade: {daysAgo} dias atrás
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <span className={`px-3 py-1 text-sm font-bold rounded-full border ${getRiskColor(client.riskLevel)}`}>
                      {getRiskLabel(client.riskLevel)}
                    </span>
                    <div className="mt-2 space-y-1">
                      <div className="text-sm text-gray-600">
                        Satisfação: <span className="font-medium">{client.satisfactionScore}</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        Engajamento: <span className="font-medium">{client.engagementLevel}%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex gap-2 mb-4">
                  {client.recommendedActions.slice(0, 2).map((action, idx) => (
                    <button
                      key={idx}
                      onClick={() => executeAction(client.companyName, action)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${getPriorityColor(action.priority)}`}
                    >
                      {action.action}
                    </button>
                  ))}
                  <button
                    onClick={() => setExpandedClient(isExpanded ? null : client.id)}
                    className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                  >
                    <Eye size={16} />
                    {isExpanded ? 'Menos' : 'Mais'} Detalhes
                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                </div>

                {/* Progress Bars */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-600">Risco de Churn</span>
                      <span className="font-medium">{client.churnProbability}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          client.churnProbability > 80 ? 'bg-red-500' :
                          client.churnProbability > 60 ? 'bg-orange-500' :
                          client.churnProbability > 40 ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${client.churnProbability}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-600">Engajamento</span>
                      <span className="font-medium">{client.engagementLevel}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${client.engagementLevel}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-600">Satisfação</span>
                      <span className="font-medium">{client.satisfactionScore}/10</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-purple-500 h-2 rounded-full"
                        style={{ width: `${(client.satisfactionScore / 10) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Expanded Details */}
              {isExpanded && (
                <div className="border-t border-gray-200 p-6 bg-gray-50">
                  <div className="grid lg:grid-cols-2 gap-6">
                    {/* Risk Factors */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <AlertTriangle className="text-red-600" size={16} />
                        Fatores de Risco Identificados
                      </h4>
                      <div className="space-y-3">
                        {client.riskFactors.map((factor, idx) => (
                          <div key={idx} className="bg-white rounded-lg p-3 border border-gray-200">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium text-gray-900">{factor.factor}</span>
                              <span className={`text-xs font-bold ${getImpactColor(factor.impact)}`}>
                                {factor.impact.toUpperCase()}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600">{factor.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Recommended Actions */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <Target className="text-blue-600" size={16} />
                        Plano de Ação Recomendado
                      </h4>
                      <div className="space-y-3">
                        {client.recommendedActions.map((action, idx) => (
                          <div key={idx} className="bg-white rounded-lg p-3 border border-gray-200">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium text-gray-900">{action.action}</span>
                              <span className={`px-2 py-1 text-xs font-bold rounded-full ${getPriorityColor(action.priority)}`}>
                                {action.priority.toUpperCase()}
                              </span>
                            </div>
                            <div className="text-sm text-gray-600 mb-2">
                              <div>📈 {action.estimatedImpact}</div>
                              <div>⏰ Prazo: {action.timeframe}</div>
                            </div>
                            <button
                              onClick={() => executeAction(client.companyName, action)}
                              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg text-sm hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                            >
                              <Zap size={14} />
                              Executar Ação
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Client Details */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-3">Detalhes do Cliente</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="bg-white rounded-lg p-3 border border-gray-200">
                        <div className="flex items-center gap-2 mb-1">
                          <Mail size={12} className="text-gray-400" />
                          <span className="text-gray-600">Email</span>
                        </div>
                        <p className="font-medium text-gray-900">{client.email}</p>
                      </div>
                      <div className="bg-white rounded-lg p-3 border border-gray-200">
                        <div className="flex items-center gap-2 mb-1">
                          <Phone size={12} className="text-gray-400" />
                          <span className="text-gray-600">Telefone</span>
                        </div>
                        <p className="font-medium text-gray-900">{client.phone}</p>
                      </div>
                      <div className="bg-white rounded-lg p-3 border border-gray-200">
                        <div className="flex items-center gap-2 mb-1">
                          <Activity size={12} className="text-gray-400" />
                          <span className="text-gray-600">Contratos</span>
                        </div>
                        <p className="font-medium text-gray-900">{client.contractsCount}</p>
                      </div>
                      <div className="bg-white rounded-lg p-3 border border-gray-200">
                        <div className="flex items-center gap-2 mb-1">
                          <Clock size={12} className="text-gray-400" />
                          <span className="text-gray-600">Atraso Médio</span>
                        </div>
                        <p className="font-medium text-gray-900">{client.lastPaymentDelay} dias</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* AI Model Performance */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <Brain className="text-purple-600" size={20} />
          Performance do Modelo de IA
        </h3>
        
        <div className="grid md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="text-green-600" size={24} />
            </div>
            <div className="text-2xl font-bold text-green-600">94.2%</div>
            <div className="text-sm text-gray-600">Precisão do Modelo</div>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Target className="text-blue-600" size={24} />
            </div>
            <div className="text-2xl font-bold text-blue-600">87.5%</div>
            <div className="text-sm text-gray-600">Taxa de Recall</div>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Activity className="text-purple-600" size={24} />
            </div>
            <div className="text-2xl font-bold text-purple-600">156</div>
            <div className="text-sm text-gray-600">Previsões Corretas</div>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <RefreshCw className="text-orange-600" size={24} />
            </div>
            <div className="text-2xl font-bold text-orange-600">2h</div>
            <div className="text-sm text-gray-600">Última Atualização</div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Brain className="text-purple-600" size={16} />
            <span className="font-semibold text-purple-900">Como Funciona a IA</span>
          </div>
          <p className="text-sm text-purple-800">
            Nosso modelo analisa mais de 50 variáveis incluindo padrões de pagamento, engajamento, 
            satisfação, uso da plataforma e dados históricos para prever com 94% de precisão 
            quais clientes têm maior probabilidade de cancelar nos próximos 90 dias.
          </p>
        </div>
      </div>
    </div>
  );
};