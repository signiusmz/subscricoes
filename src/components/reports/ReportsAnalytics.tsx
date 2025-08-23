import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Calendar, 
  Download, 
  Filter, 
  RefreshCw, 
  Users, 
  DollarSign, 
  FileText, 
  Clock,
  Mail,
  MessageSquare,
  Phone,
  Star,
  Eye,
  CheckCircle,
  AlertCircle,
  Activity,
  Target,
  Zap,
  Settings,
  Play,
  Pause,
  Trash2,
  Plus,
  Send,
  Bell,
  PieChart,
  Globe,
  Smartphone
} from 'lucide-react';
import { PDFGenerator, ReportData } from '../../utils/pdfGenerator';

interface ReportPeriod {
  label: string;
  value: string;
  months: number;
}

interface ReportData {
  period: string;
  revenue: number;
  clients: number;
  services: number;
  satisfaction: number;
  growth: number;
}

interface ScheduledReport {
  id: string;
  name: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  format: 'pdf' | 'excel' | 'csv';
  recipients: string[];
  isActive: boolean;
  lastRun?: string;
  nextRun: string;
}

interface CommunicationMetrics {
  channel: 'email' | 'whatsapp';
  sent: number;
  delivered: number;
  opened: number;
  responded: number;
  deliveryRate: number;
  openRate: number;
  responseRate: number;
}

const reportPeriods: ReportPeriod[] = [
  { label: '1 Mês', value: '1month', months: 1 },
  { label: '3 Meses', value: '3months', months: 3 },
  { label: '6 Meses', value: '6months', months: 6 },
  { label: '1 Ano', value: '1year', months: 12 }
];

export const ReportsAnalytics: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<string>('3months');
  const [isLoading, setIsLoading] = useState(false);
  const [reportData, setReportData] = useState<ReportData[]>([]);
  const [communicationData, setCommunicationData] = useState<CommunicationMetrics[]>([]);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduledReports, setScheduledReports] = useState<ScheduledReport[]>([]);
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  // Generate dynamic data based on selected period
  const generateReportData = (months: number): ReportData[] => {
    const data: ReportData[] = [];
    const now = new Date();
    
    for (let i = months - 1; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = date.toLocaleDateString('pt-PT', { month: 'short', year: '2-digit' });
      
      // Generate realistic data with some variation
      const baseRevenue = 200000;
      const variation = (Math.random() - 0.5) * 0.3; // ±15% variation
      const revenue = Math.round(baseRevenue * (1 + variation));
      
      const baseClients = 45;
      const clientVariation = Math.floor((Math.random() - 0.5) * 10);
      const clients = Math.max(baseClients + clientVariation, 30);
      
      const baseServices = 78;
      const serviceVariation = Math.floor((Math.random() - 0.5) * 15);
      const services = Math.max(baseServices + serviceVariation, 60);
      
      const satisfaction = 8.0 + (Math.random() * 1.5); // 8.0 to 9.5
      
      const growth = i === months - 1 ? 0 : (Math.random() - 0.3) * 20; // -6% to +14%
      
      data.push({
        period: monthName,
        revenue,
        clients,
        services,
        satisfaction: Math.round(satisfaction * 10) / 10,
        growth: Math.round(growth * 10) / 10
      });
    }
    
    return data;
  };

  // Generate communication metrics
  const generateCommunicationData = (): CommunicationMetrics[] => {
    return [
      {
        channel: 'email',
        sent: 1234,
        delivered: 1198,
        opened: 856,
        responded: 234,
        deliveryRate: 97.1,
        openRate: 71.4,
        responseRate: 27.3
      },
      {
        channel: 'whatsapp',
        sent: 567,
        delivered: 562,
        opened: 534,
        responded: 189,
        deliveryRate: 99.1,
        openRate: 95.0,
        responseRate: 35.4
      }
    ];
  };

  // Load data when period changes
  useEffect(() => {
    setIsLoading(true);
    
    setTimeout(() => {
      const period = reportPeriods.find(p => p.value === selectedPeriod);
      if (period) {
        setReportData(generateReportData(period.months));
        setCommunicationData(generateCommunicationData());
      }
      setIsLoading(false);
    }, 1000);
  }, [selectedPeriod]);

  // Auto-refresh functionality
  useEffect(() => {
    if (!autoRefresh) return;
    
    const interval = setInterval(() => {
      const period = reportPeriods.find(p => p.value === selectedPeriod);
      if (period) {
        setReportData(generateReportData(period.months));
        setCommunicationData(generateCommunicationData());
      }
    }, 30000); // Refresh every 30 seconds
    
    return () => clearInterval(interval);
  }, [autoRefresh, selectedPeriod]);

  const handleExportReport = (format: 'pdf' | 'excel' | 'csv') => {
    setIsLoading(true);
    
    setTimeout(() => {
      if (format === 'pdf') {
        const reportDataForPDF: any = {
          title: `Relatório de Análise - ${reportPeriods.find(p => p.value === selectedPeriod)?.label}`,
          type: 'Análise de Performance',
          period: reportPeriods.find(p => p.value === selectedPeriod)?.label || '',
          startDate: customStartDate || new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          endDate: customEndDate || new Date().toISOString().split('T')[0],
          totalClients: reportData.reduce((sum, d) => sum + d.clients, 0),
          totalRevenue: reportData.reduce((sum, d) => sum + d.revenue, 0),
          averageSatisfaction: reportData.reduce((sum, d) => sum + d.satisfaction, 0) / reportData.length,
          data: reportData
        };
        
        PDFGenerator.generateReport(reportDataForPDF);
        alert(`✅ Relatório PDF gerado com sucesso!\n\n📊 Período: ${reportDataForPDF.period}\n📈 Total Receita: ${reportDataForPDF.totalRevenue.toLocaleString()} MT\n👥 Total Clientes: ${reportDataForPDF.totalClients}\n⭐ Satisfação Média: ${reportDataForPDF.averageSatisfaction.toFixed(1)}\n📅 Gerado em: ${new Date().toLocaleString('pt-PT')}`);
      } else if (format === 'csv') {
        const csvContent = [
          ['Período', 'Receita (MT)', 'Clientes', 'Serviços', 'Satisfação', 'Crescimento (%)'].join(','),
          ...reportData.map(item => [
            item.period,
            item.revenue.toString(),
            item.clients.toString(),
            item.services.toString(),
            item.satisfaction.toString(),
            item.growth.toString()
          ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `relatorio-${selectedPeriod}-${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        alert(`✅ Relatório CSV exportado com sucesso!\n\n📊 Dados: ${reportData.length} períodos\n📁 Arquivo: relatorio-${selectedPeriod}-${new Date().toISOString().split('T')[0]}.csv\n📅 Exportado em: ${new Date().toLocaleString('pt-PT')}`);
      } else {
        alert(`⚠️ Exportação Excel em desenvolvimento!\n\nPor enquanto, use:\n📄 PDF - Para relatórios visuais\n📊 CSV - Para análise em planilhas\n\n🔄 Excel será implementado em breve.`);
      }
      
      setIsLoading(false);
    }, 1500);
  };

  const handleScheduleReport = (reportConfig: any) => {
    const newReport: ScheduledReport = {
      id: Date.now().toString(),
      name: reportConfig.name,
      frequency: reportConfig.frequency,
      format: reportConfig.format,
      recipients: reportConfig.recipients.split(',').map((email: string) => email.trim()),
      isActive: true,
      nextRun: calculateNextRun(reportConfig.frequency)
    };
    
    setScheduledReports([...scheduledReports, newReport]);
    setShowScheduleModal(false);
    
    alert(`✅ Relatório agendado com sucesso!\n\n📋 Nome: ${newReport.name}\n⏰ Frequência: ${getFrequencyLabel(newReport.frequency)}\n📧 Destinatários: ${newReport.recipients.length}\n📅 Próxima execução: ${new Date(newReport.nextRun).toLocaleString('pt-PT')}\n🟢 Status: Ativo`);
  };

  const calculateNextRun = (frequency: string): string => {
    const now = new Date();
    switch (frequency) {
      case 'daily':
        return new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();
      case 'weekly':
        return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();
      case 'monthly':
        return new Date(now.getFullYear(), now.getMonth() + 1, now.getDate()).toISOString();
      case 'quarterly':
        return new Date(now.getFullYear(), now.getMonth() + 3, now.getDate()).toISOString();
      default:
        return new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();
    }
  };

  const getFrequencyLabel = (frequency: string): string => {
    const labels = {
      daily: 'Diário',
      weekly: 'Semanal',
      monthly: 'Mensal',
      quarterly: 'Trimestral'
    };
    return labels[frequency as keyof typeof labels] || frequency;
  };

  const handleRunScheduledReport = (reportId: string) => {
    const report = scheduledReports.find(r => r.id === reportId);
    if (!report) return;
    
    setIsLoading(true);
    
    setTimeout(() => {
      // Update last run and next run
      setScheduledReports(scheduledReports.map(r => 
        r.id === reportId 
          ? { 
              ...r, 
              lastRun: new Date().toISOString(),
              nextRun: calculateNextRun(r.frequency)
            }
          : r
      ));
      
      setIsLoading(false);
      alert(`✅ Relatório "${report.name}" executado com sucesso!\n\n📧 Enviado para: ${report.recipients.join(', ')}\n📄 Formato: ${report.format.toUpperCase()}\n⏰ Próxima execução: ${new Date(calculateNextRun(report.frequency)).toLocaleString('pt-PT')}`);
    }, 2000);
  };

  const handleToggleScheduledReport = (reportId: string) => {
    setScheduledReports(scheduledReports.map(r => 
      r.id === reportId 
        ? { ...r, isActive: !r.isActive }
        : r
    ));
    
    const report = scheduledReports.find(r => r.id === reportId);
    alert(`✅ Relatório "${report?.name}" ${report?.isActive ? 'desativado' : 'ativado'} com sucesso!`);
  };

  const handleDeleteScheduledReport = (reportId: string) => {
    const report = scheduledReports.find(r => r.id === reportId);
    if (!report) return;
    
    if (confirm(`Tem certeza que deseja eliminar o relatório agendado "${report.name}"?`)) {
      setScheduledReports(scheduledReports.filter(r => r.id !== reportId));
      alert(`✅ Relatório agendado "${report.name}" eliminado com sucesso!`);
    }
  };

  // Calculate summary metrics
  const summaryMetrics = {
    totalRevenue: reportData.reduce((sum, d) => sum + d.revenue, 0),
    averageClients: Math.round(reportData.reduce((sum, d) => sum + d.clients, 0) / reportData.length) || 0,
    averageServices: Math.round(reportData.reduce((sum, d) => sum + d.services, 0) / reportData.length) || 0,
    averageSatisfaction: Math.round((reportData.reduce((sum, d) => sum + d.satisfaction, 0) / reportData.length) * 10) / 10 || 0,
    averageGrowth: Math.round((reportData.reduce((sum, d) => sum + d.growth, 0) / reportData.length) * 10) / 10 || 0
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Relatórios e Analytics</h2>
          <p className="text-gray-600 mt-1">Análise detalhada de performance e comunicação</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="autoRefresh"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="autoRefresh" className="text-sm text-gray-700">
              Auto-refresh (30s)
            </label>
          </div>
          <button
            onClick={() => setShowScheduleModal(true)}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
          >
            <Clock size={16} />
            Agendar Relatório
          </button>
        </div>
      </div>

      {/* Period Selection and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <Calendar className="text-gray-400" size={20} />
              <span className="text-sm font-medium text-gray-700">Período de Análise:</span>
            </div>
            {reportPeriods.map((period) => (
              <button
                key={period.value}
                onClick={() => setSelectedPeriod(period.value)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedPeriod === period.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {period.label}
              </button>
            ))}
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <Filter size={16} />
              Filtros Avançados
            </button>
            <button
              onClick={() => {
                const period = reportPeriods.find(p => p.value === selectedPeriod);
                if (period) {
                  setIsLoading(true);
                  setTimeout(() => {
                    setReportData(generateReportData(period.months));
                    setCommunicationData(generateCommunicationData());
                    setIsLoading(false);
                  }, 1000);
                }
              }}
              disabled={isLoading}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              <RefreshCw className={isLoading ? 'animate-spin' : ''} size={16} />
              {isLoading ? 'Carregando...' : 'Atualizar'}
            </button>
          </div>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Data Início</label>
                <input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Data Fim</label>
                <input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Clientes</label>
                <select
                  multiple
                  value={selectedClients}
                  onChange={(e) => setSelectedClients(Array.from(e.target.selectedOptions, option => option.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="1">Transportes Maputo Lda</option>
                  <option value="2">Construções Beira SA</option>
                  <option value="3">Hotel Polana</option>
                  <option value="4">Farmácia Central</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Serviços</label>
                <select
                  multiple
                  value={selectedServices}
                  onChange={(e) => setSelectedServices(Array.from(e.target.selectedOptions, option => option.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="1">Contabilidade Mensal</option>
                  <option value="2">Auditoria Anual</option>
                  <option value="3">Consultoria Fiscal</option>
                </select>
              </div>
            </div>
            <div className="mt-4 flex gap-3">
              <button
                onClick={() => {
                  setCustomStartDate('');
                  setCustomEndDate('');
                  setSelectedClients([]);
                  setSelectedServices([]);
                }}
                className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Limpar Filtros
              </button>
              <button
                onClick={() => {
                  setIsLoading(true);
                  setTimeout(() => {
                    const period = reportPeriods.find(p => p.value === selectedPeriod);
                    if (period) {
                      setReportData(generateReportData(period.months));
                    }
                    setIsLoading(false);
                    alert('✅ Filtros aplicados com sucesso!');
                  }, 1000);
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Aplicar Filtros
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Receita Total</p>
              <p className="text-2xl font-bold text-gray-900">{summaryMetrics.totalRevenue.toLocaleString()} MT</p>
              <p className={`text-xs flex items-center gap-1 mt-1 ${
                summaryMetrics.averageGrowth >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {summaryMetrics.averageGrowth >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                {Math.abs(summaryMetrics.averageGrowth)}% média
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
              <p className="text-sm font-medium text-gray-600 mb-1">Clientes Médios</p>
              <p className="text-2xl font-bold text-gray-900">{summaryMetrics.averageClients}</p>
              <p className="text-xs text-blue-600 flex items-center gap-1 mt-1">
                <Users size={10} />
                por período
              </p>
            </div>
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-blue-100 text-blue-600">
              <Users size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Serviços Médios</p>
              <p className="text-2xl font-bold text-gray-900">{summaryMetrics.averageServices}</p>
              <p className="text-xs text-purple-600 flex items-center gap-1 mt-1">
                <FileText size={10} />
                por período
              </p>
            </div>
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-purple-100 text-purple-600">
              <FileText size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Satisfação Média</p>
              <p className="text-2xl font-bold text-gray-900">{summaryMetrics.averageSatisfaction}</p>
              <p className="text-xs text-yellow-600 flex items-center gap-1 mt-1">
                <Star size={10} />
                de 10
              </p>
            </div>
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-yellow-100 text-yellow-600">
              <Star size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Crescimento Médio</p>
              <p className="text-2xl font-bold text-gray-900">{summaryMetrics.averageGrowth}%</p>
              <p className={`text-xs flex items-center gap-1 mt-1 ${
                summaryMetrics.averageGrowth >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {summaryMetrics.averageGrowth >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                {summaryMetrics.averageGrowth >= 0 ? 'positivo' : 'negativo'}
              </p>
            </div>
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-orange-100 text-orange-600">
              <TrendingUp size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Evolução da Receita</h3>
            <div className="flex gap-2">
              <button
                onClick={() => handleExportReport('pdf')}
                disabled={isLoading}
                className="text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                PDF
              </button>
              <button
                onClick={() => handleExportReport('csv')}
                disabled={isLoading}
                className="text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                CSV
              </button>
            </div>
          </div>
          
          {isLoading ? (
            <div className="h-64 flex items-center justify-center">
              <RefreshCw className="animate-spin text-gray-400" size={32} />
            </div>
          ) : (
            <div className="h-64 bg-gradient-to-t from-gray-50 to-transparent rounded-lg p-4 relative">
              <div className="h-full flex items-end justify-between gap-2">
                {reportData.map((data, index) => {
                  const maxRevenue = Math.max(...reportData.map(d => d.revenue));
                  const height = (data.revenue / maxRevenue) * 100;
                  
                  return (
                    <div key={index} className="flex flex-col items-center gap-2 flex-1 group">
                      <div className="relative">
                        <div
                          className="w-full max-w-12 bg-gradient-to-t from-blue-500 to-blue-600 rounded-t-md transition-all duration-1000 cursor-pointer hover:shadow-lg"
                          style={{ height: `${height * 2}px`, minHeight: '20px' }}
                          title={`${data.period}: ${data.revenue.toLocaleString()} MT`}
                        />
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          {data.revenue.toLocaleString()} MT
                        </div>
                      </div>
                      <span className="text-xs text-gray-600 font-medium">{data.period}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Communication Analytics */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Analytics de Comunicação</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {communicationData.map((comm) => (
              <div key={comm.channel} className="space-y-4">
                <div className="flex items-center gap-3">
                  {comm.channel === 'email' ? (
                    <Mail className="text-blue-600" size={24} />
                  ) : (
                    <MessageSquare className="text-green-600" size={24} />
                  )}
                  <div>
                    <h4 className="font-semibold text-gray-900 capitalize">{comm.channel}</h4>
                    <p className="text-sm text-gray-600">{comm.sent.toLocaleString()} mensagens enviadas</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Taxa de Entrega</span>
                      <span className="font-medium">{comm.deliveryRate}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-1000"
                        style={{ width: `${comm.deliveryRate}%` }}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Taxa de Abertura</span>
                      <span className="font-medium">{comm.openRate}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all duration-1000"
                        style={{ width: `${comm.openRate}%` }}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Taxa de Resposta</span>
                      <span className="font-medium">{comm.responseRate}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-purple-500 h-2 rounded-full transition-all duration-1000"
                        style={{ width: `${comm.responseRate}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Analytics */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Análise Detalhada por Período</h3>
        
        {isLoading ? (
          <div className="h-32 flex items-center justify-center">
            <RefreshCw className="animate-spin text-gray-400" size={24} />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Período</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Receita</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Clientes</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Serviços</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Satisfação</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Crescimento</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {reportData.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{item.period}</td>
                    <td className="px-4 py-3 text-gray-900">{item.revenue.toLocaleString()} MT</td>
                    <td className="px-4 py-3 text-gray-900">{item.clients}</td>
                    <td className="px-4 py-3 text-gray-900">{item.services}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Star className="text-yellow-500" size={14} />
                        <span className="text-gray-900">{item.satisfaction}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className={`flex items-center gap-1 ${
                        item.growth >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {item.growth >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                        <span className="font-medium">{Math.abs(item.growth)}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Export Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Exportar Relatórios</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => handleExportReport('pdf')}
            disabled={isLoading}
            className="flex items-center justify-center gap-3 p-4 border-2 border-red-200 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
          >
            <FileText className="text-red-600" size={24} />
            <div className="text-left">
              <p className="font-medium text-red-900">Relatório PDF</p>
              <p className="text-sm text-red-700">Relatório visual completo</p>
            </div>
          </button>
          
          <button
            onClick={() => handleExportReport('excel')}
            disabled={isLoading}
            className="flex items-center justify-center gap-3 p-4 border-2 border-green-200 rounded-lg hover:bg-green-50 transition-colors disabled:opacity-50"
          >
            <BarChart3 className="text-green-600" size={24} />
            <div className="text-left">
              <p className="font-medium text-green-900">Planilha Excel</p>
              <p className="text-sm text-green-700">Dados para análise</p>
            </div>
          </button>
          
          <button
            onClick={() => handleExportReport('csv')}
            disabled={isLoading}
            className="flex items-center justify-center gap-3 p-4 border-2 border-blue-200 rounded-lg hover:bg-blue-50 transition-colors disabled:opacity-50"
          >
            <Download className="text-blue-600" size={24} />
            <div className="text-left">
              <p className="font-medium text-blue-900">Dados CSV</p>
              <p className="text-sm text-blue-700">Formato universal</p>
            </div>
          </button>
        </div>
      </div>

      {/* Scheduled Reports */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Relatórios Agendados</h3>
          <span className="text-sm text-gray-500">{scheduledReports.length} agendamento(s)</span>
        </div>
        
        {scheduledReports.length === 0 ? (
          <div className="text-center py-8">
            <Clock className="text-gray-300 mx-auto mb-3" size={48} />
            <p className="text-gray-500">Nenhum relatório agendado</p>
            <p className="text-sm text-gray-400 mt-1">Clique em "Agendar Relatório" para criar um</p>
          </div>
        ) : (
          <div className="space-y-3">
            {scheduledReports.map((report) => (
              <div key={report.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-medium text-gray-900">{report.name}</h4>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      report.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {report.isActive ? 'Ativo' : 'Inativo'}
                    </span>
                    <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                      {getFrequencyLabel(report.frequency)}
                    </span>
                    <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full">
                      {report.format.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    <p>Destinatários: {report.recipients.join(', ')}</p>
                    <p>Próxima execução: {new Date(report.nextRun).toLocaleString('pt-PT')}</p>
                    {report.lastRun && (
                      <p>Última execução: {new Date(report.lastRun).toLocaleString('pt-PT')}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => handleRunScheduledReport(report.id)}
                    disabled={isLoading}
                    className="text-green-600 hover:text-green-900 p-2 hover:bg-green-50 rounded transition-colors disabled:opacity-50"
                    title="Executar agora"
                  >
                    <Play size={16} />
                  </button>
                  <button
                    onClick={() => handleToggleScheduledReport(report.id)}
                    className="text-orange-600 hover:text-orange-900 p-2 hover:bg-orange-50 rounded transition-colors"
                    title={report.isActive ? 'Desativar' : 'Ativar'}
                  >
                    {report.isActive ? <Pause size={16} /> : <Play size={16} />}
                  </button>
                  <button
                    onClick={() => handleDeleteScheduledReport(report.id)}
                    className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded transition-colors"
                    title="Eliminar"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Communication Performance */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Performance de Comunicação</h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Channel Comparison */}
          <div>
            <h4 className="font-medium text-gray-900 mb-4">Comparação de Canais</h4>
            <div className="space-y-4">
              {communicationData.map((comm) => (
                <div key={comm.channel} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {comm.channel === 'email' ? (
                        <Mail className="text-blue-600" size={20} />
                      ) : (
                        <MessageSquare className="text-green-600" size={20} />
                      )}
                      <span className="font-medium text-gray-900 capitalize">{comm.channel}</span>
                    </div>
                    <span className="text-sm text-gray-600">{comm.sent.toLocaleString()} enviadas</span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div>
                      <p className="text-lg font-bold text-blue-600">{comm.deliveryRate}%</p>
                      <p className="text-xs text-gray-600">Entrega</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-green-600">{comm.openRate}%</p>
                      <p className="text-xs text-gray-600">Abertura</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-purple-600">{comm.responseRate}%</p>
                      <p className="text-xs text-gray-600">Resposta</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Best Times */}
          <div>
            <h4 className="font-medium text-gray-900 mb-4">Melhores Horários</h4>
            <div className="space-y-3">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Mail className="text-blue-600" size={16} />
                  <span className="font-medium text-blue-900">Email</span>
                </div>
                <p className="text-sm text-blue-800">Melhor horário: 09:00 - 11:00</p>
                <p className="text-sm text-blue-800">Taxa de abertura: 78%</p>
              </div>
              
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare className="text-green-600" size={16} />
                  <span className="font-medium text-green-900">WhatsApp</span>
                </div>
                <p className="text-sm text-green-800">Melhor horário: 14:00 - 16:00</p>
                <p className="text-sm text-green-800">Taxa de resposta: 89%</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Schedule Report Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Agendar Relatório</h3>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const reportConfig = {
                name: formData.get('name') as string,
                frequency: formData.get('frequency') as string,
                format: formData.get('format') as string,
                recipients: formData.get('recipients') as string
              };
              handleScheduleReport(reportConfig);
            }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nome do Relatório</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Ex: Relatório Mensal de Performance"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Frequência</label>
                  <select
                    name="frequency"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="daily">Diário</option>
                    <option value="weekly">Semanal</option>
                    <option value="monthly">Mensal</option>
                    <option value="quarterly">Trimestral</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Formato</label>
                  <select
                    name="format"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="pdf">PDF</option>
                    <option value="excel">Excel</option>
                    <option value="csv">CSV</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Destinatários (emails separados por vírgula)</label>
                <textarea
                  name="recipients"
                  placeholder="admin@empresa.com, gestor@empresa.com"
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowScheduleModal(false)}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Agendar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};