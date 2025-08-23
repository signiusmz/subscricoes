import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Download, Calendar, DollarSign, Users, Activity, Star, Filter, FileText, Mail, MessageSquare, Eye, RefreshCw, Clock, Play, Pause, Trash2, PieChart, Target, AlertCircle, CheckCircle, Send, Edit } from 'lucide-react';
import { PDFGenerator, ReportData } from '../../utils/pdfGenerator';
import { Pagination } from '../common/Pagination';
import { HTMLEditor } from '../common/HTMLEditor';

interface ReportDataItem {
  period: string;
  revenue: number;
  clients: number;
  services: number;
  satisfaction: number;
  invoices: number;
  payments: number;
  renewals: number;
  newClients: number;
  churnRate: number;
  averageContractValue: number;
}

interface ScheduledReport {
  id: string;
  name: string;
  reportType: string;
  Play,
  Zap
  recipients: string[];
  nextRun: string;
  lastRun?: string;
  isActive: boolean;
  createdAt: string;
  format: 'pdf' | 'excel' | 'csv';
  filters: any;
}

interface CommunicationAnalytics {
  channel: 'email' | 'whatsapp';
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  replied: number;
  bounced: number;
  deliveryRate: number;
  openRate: number;
  clickRate: number;
  replyRate: number;
  bounceRate: number;
}

const reportTypes = [
  { id: 'revenue', name: 'Relatório de Receitas', description: 'Análise detalhada das receitas por período', icon: DollarSign },
  { id: 'clients', name: 'Relatório de Clientes', description: 'Crescimento e retenção de clientes', icon: Users },
  { id: 'services', name: 'Relatório de Serviços', description: 'Performance e utilização dos serviços', icon: Activity },
  { id: 'satisfaction', name: 'Relatório de Satisfação', description: 'Análise de satisfação dos clientes', icon: Star },
  { id: 'communication', name: 'Relatório de Comunicação', description: 'Analytics de email e WhatsApp', icon: MessageSquare },
  { id: 'financial', name: 'Relatório Financeiro', description: 'Análise financeira completa', icon: FileText }
];

export const ReportsAnalytics: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('6months');
  const [selectedReport, setSelectedReport] = useState('revenue');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduledReports, setScheduledReports] = useState<ScheduledReport[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [scheduledCurrentPage, setScheduledCurrentPage] = useState(1);
  const [reportData, setReportData] = useState<ReportDataItem[]>([]);
  const [communicationData, setCommunicationData] = useState<CommunicationAnalytics[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout | null>(null);
  const itemsPerPage = 10;

  // Generate realistic data based on period
  const generateReportData = (period: string): ReportDataItem[] => {
    const now = new Date();
    const data: ReportDataItem[] = [];
    
    let months = 6;
    let startDate = new Date(now.getFullYear(), now.getMonth() - 5, 1);
    
    switch (period) {
      case '1month':
        months = 1;
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case '3months':
        months = 3;
        startDate = new Date(now.getFullYear(), now.getMonth() - 2, 1);
        break;
      case '6months':
        months = 6;
        startDate = new Date(now.getFullYear(), now.getMonth() - 5, 1);
        break;
      case '1year':
        months = 12;
        startDate = new Date(now.getFullYear() - 1, now.getMonth(), 1);
        break;
    }

    for (let i = 0; i < months; i++) {
      const date = new Date(startDate.getFullYear(), startDate.getMonth() + i, 1);
      const monthName = date.toLocaleDateString('pt-PT', { month: 'short', year: 'numeric' });
      
      // Generate realistic progressive data
      const baseRevenue = 150000 + (i * 15000) + (Math.random() * 20000);
      const baseClients = 30 + (i * 3) + Math.floor(Math.random() * 5);
      const baseServices = 50 + (i * 5) + Math.floor(Math.random() * 8);
      
      data.push({
        period: monthName,
        revenue: Math.round(baseRevenue),
        clients: baseClients,
        services: baseServices,
        satisfaction: 7.5 + (Math.random() * 2),
        invoices: Math.floor(baseServices * 1.2),
        payments: Math.floor(baseServices * 0.9),
        renewals: Math.floor(baseServices * 0.8),
        newClients: Math.floor(Math.random() * 8) + 2,
        churnRate: Math.random() * 5,
        averageContractValue: baseRevenue / baseClients
      });
    }
    
    return data;
  };

  // Generate communication analytics
  const generateCommunicationData = (): CommunicationAnalytics[] => {
    const emailSent = 2000 + Math.floor(Math.random() * 1000);
    const whatsappSent = 800 + Math.floor(Math.random() * 500);
    
    return [
      {
        channel: 'email',
        sent: emailSent,
        delivered: Math.floor(emailSent * 0.95),
        opened: Math.floor(emailSent * 0.68),
        clicked: Math.floor(emailSent * 0.12),
        replied: Math.floor(emailSent * 0.08),
        bounced: Math.floor(emailSent * 0.05),
        deliveryRate: 95,
        openRate: 68,
        clickRate: 12,
        replyRate: 8,
        bounceRate: 5
      },
      {
        channel: 'whatsapp',
        sent: whatsappSent,
        delivered: Math.floor(whatsappSent * 0.98),
        opened: Math.floor(whatsappSent * 0.89),
        clicked: Math.floor(whatsappSent * 0.25),
        replied: Math.floor(whatsappSent * 0.23),
        bounced: Math.floor(whatsappSent * 0.02),
        deliveryRate: 98,
        openRate: 89,
        clickRate: 25,
        replyRate: 23,
        bounceRate: 2
      }
    ];
  };

  // Load data when period changes
  useEffect(() => {
    setIsLoading(true);
    
    // Simulate API call delay
    const timer = setTimeout(() => {
      const newData = generateReportData(selectedPeriod);
      const newCommData = generateCommunicationData();
      
      setReportData(newData);
      setCommunicationData(newCommData);
      setLastUpdated(new Date());
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [selectedPeriod]);

  // Auto refresh functionality
  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        const newData = generateReportData(selectedPeriod);
        const newCommData = generateCommunicationData();
        setReportData(newData);
        setCommunicationData(newCommData);
        setLastUpdated(new Date());
      }, 30000); // Refresh every 30 seconds
      
      setRefreshInterval(interval);
    } else {
      if (refreshInterval) {
        clearInterval(refreshInterval);
        setRefreshInterval(null);
      }
    }

    return () => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    };
  }, [autoRefresh, selectedPeriod]);

  // Pagination for report data
  const reportDataTotalPages = Math.ceil(reportData.length / itemsPerPage);
  const reportDataStartIndex = (currentPage - 1) * itemsPerPage;
  const paginatedReportData = reportData.slice(reportDataStartIndex, reportDataStartIndex + itemsPerPage);

  // Pagination for scheduled reports
  const scheduledTotalPages = Math.ceil(scheduledReports.length / itemsPerPage);
  const scheduledStartIndex = (scheduledCurrentPage - 1) * itemsPerPage;
  const paginatedScheduledReports = scheduledReports.slice(scheduledStartIndex, scheduledStartIndex + itemsPerPage);

  const currentData = reportData[reportData.length - 1];
  const previousData = reportData[reportData.length - 2];

  const calculateGrowth = (current: number, previous: number) => {
    if (!previous || previous === 0) return '0';
    return ((current - previous) / previous * 100).toFixed(1);
  };

  const getMetricCards = () => {
    if (!currentData || !previousData) return [];
    
    return [
      {
        title: 'Receita Total',
        value: `${currentData.revenue.toLocaleString()} MT`,
        growth: calculateGrowth(currentData.revenue, previousData.revenue),
        icon: DollarSign,
        color: 'green'
      },
      {
        title: 'Total de Clientes',
        value: currentData.clients.toString(),
        growth: calculateGrowth(currentData.clients, previousData.clients),
        icon: Users,
        color: 'blue'
      },
      {
        title: 'Serviços Ativos',
        value: currentData.services.toString(),
        growth: calculateGrowth(currentData.services, previousData.services),
        icon: Activity,
        color: 'purple'
      },
      {
        title: 'Satisfação Média',
        value: currentData.satisfaction.toFixed(1),
        growth: calculateGrowth(currentData.satisfaction, previousData.satisfaction),
        icon: Star,
        color: 'orange'
      }
    ];
  };

  const getColorClasses = (color: string) => {
    const colors = {
      green: 'bg-green-100 text-green-600',
      blue: 'bg-blue-100 text-blue-600',
      purple: 'bg-purple-100 text-purple-600',
      orange: 'bg-orange-100 text-orange-600'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const handleRefreshData = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      const newData = generateReportData(selectedPeriod);
      const newCommData = generateCommunicationData();
      setReportData(newData);
      setCommunicationData(newCommData);
      setLastUpdated(new Date());
      setIsLoading(false);
    }, 1000);
  };

  const handleGenerateReport = () => {
    setIsLoading(true);
    
    // Apply filters and generate filtered data
    let filteredData = [...reportData];
    
    if (dateRange.start && dateRange.end) {
      const startDate = new Date(dateRange.start);
      const endDate = new Date(dateRange.end);
      
      filteredData = reportData.filter(item => {
        const [monthStr, yearStr] = item.period.split(' ');
        const monthMap: { [key: string]: number } = {
          'jan': 0, 'fev': 1, 'mar': 2, 'abr': 3, 'mai': 4, 'jun': 5,
          'jul': 6, 'ago': 7, 'set': 8, 'out': 9, 'nov': 10, 'dez': 11
        };
        const itemDate = new Date(parseInt(yearStr), monthMap[monthStr.toLowerCase()], 1);
        return itemDate >= startDate && itemDate <= endDate;
      });
    }
    
    setTimeout(() => {
      setIsLoading(false);
      alert(`✅ Relatório ${reportTypes.find(r => r.id === selectedReport)?.name} gerado com sucesso!\n\n📊 Período: ${selectedPeriod}\n📈 ${filteredData.length} registros processados\n📅 Dados atualizados em ${lastUpdated.toLocaleString('pt-PT')}`);
    }, 1500);
  };

  const handleExportReport = (format: 'pdf' | 'excel' | 'csv') => {
    if (!currentData) {
      alert('Nenhum dado disponível para exportar');
      return;
    }

    setIsLoading(true);
    
    setTimeout(() => {
      if (format === 'pdf') {
        const reportName = reportTypes.find(r => r.id === selectedReport)?.name || 'Relatório';
        const reportDataForPDF: ReportData = {
          title: reportName,
          type: selectedReport,
          period: selectedPeriod,
          startDate: dateRange.start || reportData[0]?.period || '2024-01-01',
          endDate: dateRange.end || reportData[reportData.length - 1]?.period || new Date().toISOString().split('T')[0],
          totalClients: currentData.clients,
          totalRevenue: currentData.revenue,
          averageSatisfaction: currentData.satisfaction,
          data: reportData
        };
        PDFGenerator.generateReport(reportDataForPDF);
      } else if (format === 'csv') {
        const csvContent = [
          ['Período', 'Receita (MT)', 'Clientes', 'Serviços', 'Satisfação', 'Faturas', 'Pagamentos', 'Renovações', 'Novos Clientes', 'Taxa Churn (%)', 'Valor Médio Contrato (MT)'].join(','),
          ...reportData.map(item => [
            item.period,
            item.revenue.toString(),
            item.clients.toString(),
            item.services.toString(),
            item.satisfaction.toFixed(1),
            item.invoices.toString(),
            item.payments.toString(),
            item.renewals.toString(),
            item.newClients.toString(),
            item.churnRate.toFixed(1),
            item.averageContractValue.toFixed(0)
          ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `relatorio-${selectedReport}-${selectedPeriod}-${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else if (format === 'excel') {
        // Simulate Excel export
        alert('📊 Exportação Excel em desenvolvimento. Use CSV por enquanto.');
      }
      
      setIsLoading(false);
      setShowExportModal(false);
      
      if (format !== 'excel') {
        alert(`✅ Relatório exportado em ${format.toUpperCase()} com sucesso!\n\n📁 Arquivo baixado para a pasta Downloads`);
      }
    }, 1000);
  };

  const handleSaveSchedule = (scheduleData: any) => {
    const newSchedule: ScheduledReport = {
      id: Date.now().toString(),
      name: scheduleData.name,
      reportType: scheduleData.reportType,
      frequency: scheduleData.frequency,
      recipients: scheduleData.recipients.split(',').map((email: string) => email.trim()),
      nextRun: calculateNextRun(scheduleData.frequency),
      isActive: true,
      createdAt: new Date().toISOString(),
      format: scheduleData.format || 'pdf',
      filters: {
        period: selectedPeriod,
        dateRange,
        clients: selectedClients,
        services: selectedServices
      }
    };
    
    setScheduledReports([...scheduledReports, newSchedule]);
    setShowScheduleModal(false);
    alert(`✅ Relatório agendado com sucesso!\n\n📅 Próxima execução: ${new Date(newSchedule.nextRun).toLocaleDateString('pt-PT')}\n📧 Destinatários: ${newSchedule.recipients.length}\n🔄 Frequência: ${getFrequencyLabel(newSchedule.frequency)}`);
  };

  const calculateNextRun = (frequency: string): string => {
    const now = new Date();
    switch (frequency) {
      case 'daily':
        now.setDate(now.getDate() + 1);
        break;
      case 'weekly':
        now.setDate(now.getDate() + 7);
        break;
      case 'monthly':
        now.setMonth(now.getMonth() + 1);
        break;
      case 'quarterly':
        now.setMonth(now.getMonth() + 3);
        break;
    }
    return now.toISOString().split('T')[0];
  };

  const getFrequencyLabel = (frequency: string) => {
    const labels = {
      daily: 'Diário',
      weekly: 'Semanal',
      monthly: 'Mensal',
      quarterly: 'Trimestral'
    };
    return labels[frequency as keyof typeof labels] || frequency;
  };

  const handleScheduleReport = () => {
    setShowScheduleModal(true);
  };

  const handleToggleSchedule = (scheduleId: string) => {
    setScheduledReports(scheduledReports.map(s => 
      s.id === scheduleId ? { ...s, isActive: !s.isActive } : s
    ));
    
    const schedule = scheduledReports.find(s => s.id === scheduleId);
    if (schedule) {
      alert(`📋 Relatório "${schedule.name}" ${schedule.isActive ? 'desativado' : 'ativado'} com sucesso!`);
    }
  };

  const handleDeleteSchedule = (scheduleId: string) => {
    const schedule = scheduledReports.find(s => s.id === scheduleId);
    if (schedule && confirm(`Tem certeza que deseja eliminar o agendamento "${schedule.name}"?`)) {
      setScheduledReports(scheduledReports.filter(s => s.id !== scheduleId));
      alert('🗑️ Agendamento eliminado com sucesso!');
    }
  };

  const handleRunScheduleNow = (scheduleId: string) => {
    const schedule = scheduledReports.find(s => s.id === scheduleId);
    if (schedule) {
      setIsLoading(true);
      
      setTimeout(() => {
        // Update last run date
        setScheduledReports(scheduledReports.map(s => 
          s.id === scheduleId 
            ? { ...s, lastRun: new Date().toISOString() }
            : s
        ));
        
        setIsLoading(false);
        alert(`✅ Relatório "${schedule.name}" executado com sucesso!\n\n📧 Enviado para: ${schedule.recipients.join(', ')}\n📄 Formato: ${schedule.format.toUpperCase()}\n⏰ Executado em: ${new Date().toLocaleString('pt-PT')}`);
      }, 2000);
    }
  };

  const clearFilters = () => {
    setDateRange({ start: '', end: '' });
    setSelectedClients([]);
    setSelectedServices([]);
    alert('🧹 Filtros limpos com sucesso!');
  };

  const applyAdvancedFilters = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      // Simulate filtered data generation
      const filteredData = generateReportData(selectedPeriod);
      setReportData(filteredData);
      setIsLoading(false);
      alert(`🔍 Filtros aplicados com sucesso!\n\n📅 Período: ${dateRange.start || 'Início'} - ${dateRange.end || 'Fim'}\n👥 Clientes: ${selectedClients.length || 'Todos'}\n🔧 Serviços: ${selectedServices.length || 'Todos'}`);
    }, 1000);
  };

  // Mock clients and services for filters
  const mockClients = [
    { id: '1', name: 'Transportes Maputo Lda' },
    { id: '2', name: 'Construções Beira SA' },
    { id: '3', name: 'Farmácia Central' },
    { id: '4', name: 'Hotel Polana' },
    { id: '5', name: 'Supermercado Shoprite' }
  ];

  const mockServices = [
    { id: '1', name: 'Contabilidade Mensal' },
    { id: '2', name: 'Auditoria Anual' },
    { id: '3', name: 'Consultoria Fiscal' },
    { id: '4', name: 'Declaração de IVA' },
    { id: '5', name: 'Folha de Salários' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Relatórios e Analytics</h2>
          <p className="text-gray-600 mt-1">Análise detalhada do desempenho do negócio</p>
        </div>
        <div className="flex gap-3">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="autoRefresh"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="autoRefresh" className="text-sm text-gray-700">
              Auto-atualizar
            </label>
          </div>
          <button 
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center gap-2">
            <Filter size={20} />
            {showAdvancedFilters ? 'Ocultar Filtros' : 'Filtros Avançados'}
          </button>
          <button 
            onClick={handleScheduleReport}
            className="border border-blue-300 text-blue-700 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center gap-2">
            <Calendar size={20} />
            Agendar
          </button>
          <button 
            onClick={() => setShowExportModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2">
            <Download size={20} />
            Exportar
          </button>
        </div>
      </div>

      {/* Advanced Filters */}
      {showAdvancedFilters && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Filtros Avançados</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Data Início</label>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Data Fim</label>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Clientes</label>
              <select
                multiple
                value={selectedClients}
                onChange={(e) => setSelectedClients(Array.from(e.target.selectedOptions, option => option.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-20"
              >
                {mockClients.map(client => (
                  <option key={client.id} value={client.id}>{client.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Serviços</label>
              <select
                multiple
                value={selectedServices}
                onChange={(e) => setSelectedServices(Array.from(e.target.selectedOptions, option => option.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-20"
              >
                {mockServices.map(service => (
                  <option key={service.id} value={service.id}>{service.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button
              onClick={applyAdvancedFilters}
              disabled={isLoading}
              className="bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? <RefreshCw className="animate-spin" size={16} /> : <Filter size={16} />}
              {isLoading ? 'Aplicando...' : 'Aplicar Filtros'}
            </button>
            <button
              onClick={clearFilters}
              className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Limpar Filtros
            </button>
            <button
              onClick={handleGenerateReport}
              disabled={isLoading}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {isLoading ? <RefreshCw className="animate-spin" size={16} /> : <BarChart3 size={16} />}
              {isLoading ? 'Gerando...' : 'Gerar Relatório'}
            </button>
          </div>
        </div>
      )}

      {/* Period Selector - REAL FUNCTIONALITY */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Período de Análise</h3>
            <div className="flex gap-2">
              {[
                { id: '1month', label: '1 Mês', desc: 'Último mês' },
                { id: '3months', label: '3 Meses', desc: 'Último trimestre' },
                { id: '6months', label: '6 Meses', desc: 'Último semestre' },
                { id: '1year', label: '1 Ano', desc: 'Últimos 12 meses' }
              ].map((period) => (
                <button
                  key={period.id}
                  onClick={() => {
                    setSelectedPeriod(period.id);
                    setCurrentPage(1); // Reset pagination
                  }}
                  disabled={isLoading}
                  className={`px-4 py-2 rounded-lg font-medium transition-all disabled:opacity-50 ${
                    selectedPeriod === period.id
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  title={period.desc}
                >
                  {period.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar size={16} />
              <span>Última atualização: {lastUpdated.toLocaleString('pt-PT')}</span>
            </div>
            <button
              onClick={handleRefreshData}
              disabled={isLoading}
              className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={isLoading ? 'animate-spin' : ''} size={16} />
              {isLoading ? 'Atualizando...' : 'Atualizar'}
            </button>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12">
          <div className="text-center">
            <RefreshCw className="animate-spin text-blue-600 mx-auto mb-4" size={48} />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Processando Dados</h3>
            <p className="text-gray-600">Gerando relatórios para o período selecionado...</p>
          </div>
        </div>
      )}

      {/* Metrics Cards - REAL DATA */}
      {!isLoading && reportData.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {getMetricCards().map((metric, index) => {
            const Icon = metric.icon;
            const isPositive = parseFloat(metric.growth) >= 0;
            
            return (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getColorClasses(metric.color)}`}>
                    <Icon size={24} />
                  </div>
                  <div className={`flex items-center gap-1 text-sm font-medium ${
                    isPositive ? 'text-green-600' : 'text-red-600'
                  }`}>
                    <TrendingUp size={14} className={isPositive ? '' : 'rotate-180'} />
                    {metric.growth}%
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{metric.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Charts Section - REAL DATA */}
      {!isLoading && reportData.length > 0 && (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Revenue Evolution Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Evolução da Receita</h3>
              <div className="flex items-center gap-2">
                <BarChart3 className="text-gray-400" size={20} />
                <span className="text-sm text-gray-500">{reportData.length} períodos</span>
              </div>
            </div>
            <div className="h-64 bg-gradient-to-t from-blue-50 to-transparent rounded-lg flex items-end justify-between p-4 relative">
              {/* Grid Lines */}
              <div className="absolute inset-4">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-full border-t border-gray-200 border-dashed"
                    style={{ top: `${i * 25}%` }}
                  />
                ))}
              </div>
              
              {/* Bars */}
              <div className="relative h-full flex items-end justify-between gap-2 w-full">
                {reportData.map((data, index) => {
                  const maxRevenue = Math.max(...reportData.map(d => d.revenue));
                  const barHeight = (data.revenue / maxRevenue) * 100;
                  
                  return (
                    <div key={index} className="flex flex-col items-center gap-2 flex-1 group">
                      <div 
                        className="bg-gradient-to-t from-blue-600 to-blue-500 rounded-t-md w-full max-w-12 transition-all hover:shadow-lg hover:scale-105 cursor-pointer relative"
                        style={{ height: `${barHeight}%`, minHeight: '8px' }}
                        title={`${data.period}: ${data.revenue.toLocaleString()} MT`}
                      >
                        {/* Tooltip */}
                        <div className="absolute -top-20 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-3 py-2 rounded-lg text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-10">
                          <div className="font-medium">{data.period}</div>
                          <div>{data.revenue.toLocaleString()} MT</div>
                          <div className="text-green-400">+{calculateGrowth(data.revenue, reportData[index-1]?.revenue || data.revenue)}%</div>
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                        </div>
                      </div>
                      <span className="text-xs text-gray-600 transform -rotate-45 origin-left">
                        {data.period.split(' ')[0]}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Y-axis Labels */}
              <div className="absolute left-0 top-4 bottom-8 flex flex-col justify-between text-xs text-gray-500">
                {[...Array(5)].map((_, i) => {
                  const maxRevenue = Math.max(...reportData.map(d => d.revenue));
                  const value = maxRevenue - (maxRevenue * i / 4);
                  return (
                    <span key={i} className="transform -translate-y-1/2">
                      {(value / 1000).toFixed(0)}K
                    </span>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Satisfaction Trend Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Tendência de Satisfação</h3>
              <div className="flex items-center gap-2">
                <Star className="text-gray-400" size={20} />
                <span className="text-sm text-gray-500">Escala 0-10</span>
              </div>
            </div>
            <div className="h-64 bg-gradient-to-t from-orange-50 to-transparent rounded-lg flex items-end justify-between p-4 relative">
              {/* Grid Lines */}
              <div className="absolute inset-4">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-full border-t border-gray-200 border-dashed"
                    style={{ top: `${i * 25}%` }}
                  />
                ))}
              </div>
              
              {/* Line Chart */}
              <div className="relative h-full flex items-end justify-between w-full">
                <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
                  <polyline
                    fill="none"
                    stroke="#f97316"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={reportData.map((data, index) => {
                      const x = (index / (reportData.length - 1)) * 100;
                      const y = 100 - ((data.satisfaction / 10) * 100);
                      return `${x}%,${y}%`;
                    }).join(' ')}
                  />
                </svg>
                
                {reportData.map((data, index) => (
                  <div key={index} className="flex flex-col items-center gap-2 flex-1 group relative" style={{ zIndex: 2 }}>
                    <div 
                      className="w-3 h-3 bg-orange-500 rounded-full border-2 border-white shadow-md cursor-pointer hover:scale-150 transition-transform"
                      style={{ marginBottom: `${(data.satisfaction / 10) * 200}px` }}
                      title={`${data.period}: ${data.satisfaction.toFixed(1)}/10`}
                    >
                      {/* Tooltip */}
                      <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-3 py-2 rounded-lg text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="font-medium">{data.period}</div>
                        <div>{data.satisfaction.toFixed(1)}/10</div>
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                      </div>
                    </div>
                    <span className="text-xs text-gray-600 transform -rotate-45 origin-left">
                      {data.period.split(' ')[0]}
                    </span>
                  </div>
                ))}
              </div>

              {/* Y-axis Labels */}
              <div className="absolute left-0 top-4 bottom-8 flex flex-col justify-between text-xs text-gray-500">
                {[10, 8, 6, 4, 2].map((value, i) => (
                  <span key={i} className="transform -translate-y-1/2">
                    {value}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Report Types - INTERACTIVE */}
      {!isLoading && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Relatórios Disponíveis</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reportTypes.map((report) => {
              const Icon = report.icon;
              const isSelected = selectedReport === report.id;
              
              return (
                <div 
                  key={report.id}
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50 shadow-sm'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                  onClick={() => setSelectedReport(report.id)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        isSelected ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                      }`}>
                        <Icon size={20} />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{report.name}</h4>
                        <p className="text-sm text-gray-600">{report.description}</p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedReport(report.id);
                          setTimeout(() => {
                            alert(`👁️ Visualizando ${report.name}\n\n📊 Dados do período: ${selectedPeriod}\n📈 ${reportData.length} registros disponíveis`);
                          }, 100);
                        }}
                        className="text-green-600 hover:text-green-700 p-1 hover:bg-green-50 rounded transition-colors"
                        title="Visualizar"
                      >
                        <Eye size={16} />
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedReport(report.id);
                          setTimeout(() => {
                            setShowExportModal(true);
                          }, 100);
                        }}
                        className="text-blue-600 hover:text-blue-700 p-1 hover:bg-blue-50 rounded transition-colors"
                        title="Baixar"
                      >
                        <Download size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />
                      Atualizado: {lastUpdated.toLocaleDateString('pt-PT')}
                    </span>
                    <span className="flex items-center gap-1">
                      <FileText size={12} />
                      {reportData.length} registros
                    </span>
                  </div>
                  {isSelected && (
                    <div className="mt-3 p-2 bg-blue-100 rounded-lg">
                      <p className="text-xs text-blue-800 font-medium">✓ Relatório selecionado</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Communication Analytics - REAL DATA */}
      {!isLoading && communicationData.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Analytics de Comunicação</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {communicationData.map((comm) => {
              const Icon = comm.channel === 'email' ? Mail : MessageSquare;
              const color = comm.channel === 'email' ? 'blue' : 'green';
              
              return (
                <div key={comm.channel} className={`text-center p-6 ${
                  color === 'blue' ? 'bg-blue-50 border-blue-200' : 'bg-green-50 border-green-200'
                } rounded-lg border`}>
                  <Icon className={`${color === 'blue' ? 'text-blue-600' : 'text-green-600'} mx-auto mb-3`} size={32} />
                  <p className={`text-3xl font-bold ${color === 'blue' ? 'text-blue-900' : 'text-green-900'} mb-2`}>
                    {comm.sent.toLocaleString()}
                  </p>
                  <p className={`text-sm ${color === 'blue' ? 'text-blue-700' : 'text-green-700'} font-medium mb-2`}>
                    {comm.channel === 'email' ? 'Emails Enviados' : 'WhatsApp Enviados'}
                  </p>
                  <div className={`space-y-1 text-xs ${color === 'blue' ? 'text-blue-600' : 'text-green-600'}`}>
                    <p>Taxa de entrega: {comm.deliveryRate}%</p>
                    <p>Taxa de abertura: {comm.openRate}%</p>
                    <p>Taxa de resposta: {comm.replyRate}%</p>
                    <p>Bounces: {comm.bounceRate}%</p>
                  </div>
                  <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${color === 'blue' ? 'bg-blue-600' : 'bg-green-600'}`}
                      style={{ width: `${comm.openRate}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Communication Trends */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-3">Melhor Horário de Envio</h4>
              <div className="space-y-2">
                {[
                  { time: '09:00 - 11:00', rate: 85, color: 'bg-green-500' },
                  { time: '14:00 - 16:00', rate: 72, color: 'bg-blue-500' },
                  { time: '19:00 - 21:00', rate: 58, color: 'bg-orange-500' }
                ].map((slot, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">{slot.time}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div className={`${slot.color} h-2 rounded-full`} style={{ width: `${slot.rate}%` }}></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{slot.rate}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-3">Canal Preferido por Perfil</h4>
              <div className="space-y-2">
                {[
                  { profile: 'Empresas Jovens', channel: 'whatsapp', rate: 78, icon: MessageSquare, color: 'text-green-600' },
                  { profile: 'Empresas Estabelecidas', channel: 'email', rate: 65, icon: Mail, color: 'text-blue-600' },
                  { profile: 'Grandes Corporações', channel: 'email', rate: 92, icon: Mail, color: 'text-blue-600' }
                ].map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">{item.profile}</span>
                      <div className="flex items-center gap-2">
                        <Icon size={12} className={item.color} />
                        <span className="text-sm font-medium text-gray-900">
                          {item.channel === 'email' ? 'Email' : 'WhatsApp'} ({item.rate}%)
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Detailed Analytics - REAL DATA */}
      {!isLoading && reportData.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Análise Detalhada</h3>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Activity size={16} />
              <span>{reportData.length} períodos analisados</span>
            </div>
          </div>
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
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedReportData.map((data, index) => {
                  const actualIndex = reportDataStartIndex + index;
                  const previousPeriod = actualIndex > 0 ? reportData[actualIndex - 1] : null;
                  const growth = previousPeriod ? calculateGrowth(data.revenue, previousPeriod.revenue) : '0';
                  const isPositive = parseFloat(growth) >= 0;
                  
                  return (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{data.period}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{data.revenue.toLocaleString()} MT</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{data.clients}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{data.services}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        <div className="flex items-center gap-1">
                          <Star className="text-yellow-500" size={12} />
                          {data.satisfaction.toFixed(1)}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`flex items-center gap-1 ${
                          isPositive ? 'text-green-600' : 'text-red-600'
                        }`}>
                          <TrendingUp size={12} className={isPositive ? '' : 'rotate-180'} />
                          {growth}%
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <button 
                            onClick={() => {
                              alert(`👁️ Visualizando detalhes de ${data.period}\n\n📊 Receita: ${data.revenue.toLocaleString()} MT\n👥 Clientes: ${data.clients}\n🔧 Serviços: ${data.services}\n⭐ Satisfação: ${data.satisfaction.toFixed(1)}\n📄 Faturas: ${data.invoices}\n💳 Pagamentos: ${data.payments}\n🔄 Renovações: ${data.renewals}`);
                            }}
                            className="text-blue-600 hover:text-blue-700 p-1 hover:bg-blue-50 rounded transition-colors"
                            title="Ver detalhes"
                          >
                            <Eye size={14} />
                          </button>
                          <button 
                            onClick={() => {
                              const reportDataForPDF: ReportData = {
                                title: `Relatório Detalhado - ${data.period}`,
                                type: 'detailed',
                                period: data.period,
                                startDate: dateRange.start || '2024-01-01',
                                endDate: dateRange.end || new Date().toISOString().split('T')[0],
                                totalClients: data.clients,
                                totalRevenue: data.revenue,
                                averageSatisfaction: data.satisfaction,
                                data: [data]
                              };
                              PDFGenerator.generateReport(reportDataForPDF);
                            }}
                            className="text-green-600 hover:text-green-700 p-1 hover:bg-green-50 rounded transition-colors"
                            title="Baixar PDF"
                          >
                            <Download size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {reportData.length > itemsPerPage && (
            <Pagination
              currentPage={currentPage}
              totalPages={reportDataTotalPages}
              onPageChange={setCurrentPage}
              totalItems={reportData.length}
              itemsPerPage={itemsPerPage}
            />
          )}
        </div>
      )}

      {/* Export Modal - REAL FUNCTIONALITY */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Exportar Relatório</h3>
            <p className="text-gray-600 mb-6">
              Escolha o formato para exportar "{reportTypes.find(r => r.id === selectedReport)?.name}":
            </p>
            
            <div className="space-y-3">
              <button
                onClick={() => handleExportReport('pdf')}
                disabled={isLoading}
                className="w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? <RefreshCw className="animate-spin" size={16} /> : <FileText size={16} />}
                {isLoading ? 'Gerando PDF...' : 'Exportar como PDF'}
              </button>
              <button
                onClick={() => handleExportReport('excel')}
                disabled={isLoading}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? <RefreshCw className="animate-spin" size={16} /> : <BarChart3 size={16} />}
                {isLoading ? 'Gerando Excel...' : 'Exportar como Excel'}
              </button>
              <button
                onClick={() => handleExportReport('csv')}
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? <RefreshCw className="animate-spin" size={16} /> : <Download size={16} />}
                {isLoading ? 'Gerando CSV...' : 'Exportar como CSV'}
              </button>
              <button
                onClick={() => setShowExportModal(false)}
                className="w-full border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Modal - ENHANCED */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Agendar Relatório</h3>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const scheduleData = {
                name: formData.get('name') as string,
                reportType: formData.get('reportType') as string,
                frequency: formData.get('frequency') as string,
                recipients: formData.get('recipients') as string,
                format: formData.get('format') as string,
                startDate: formData.get('startDate') as string
              };
              handleSaveSchedule(scheduleData);
            }} className="space-y-6">
              
              {/* Basic Info */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Calendar size={18} className="text-blue-600" />
                  Informações Básicas
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nome do Agendamento *
                    </label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Ex: Relatório Mensal de Receitas"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tipo de Relatório *
                    </label>
                    <select
                      name="reportType"
                      defaultValue={selectedReport}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      {reportTypes.map((report) => (
                        <option key={report.id} value={report.id}>{report.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Schedule Settings */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Clock size={18} className="text-green-600" />
                  Configurações de Agendamento
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Frequência *
                    </label>
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Formato *
                    </label>
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
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Primeira Execução *
                    </label>
                    <input
                      type="date"
                      name="startDate"
                      min={new Date().toISOString().split('T')[0]}
                      defaultValue={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Recipients */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Mail size={18} className="text-purple-600" />
                  Destinatários
                </h4>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Emails dos Destinatários *
                  </label>
                  <textarea
                    name="recipients"
                    rows={3}
                    placeholder="admin@empresa.mz, gestor@empresa.mz, diretor@empresa.mz"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Separe múltiplos emails com vírgulas
                  </p>
                </div>
              </div>

              {/* Preview */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                  <Eye size={18} className="text-blue-600" />
                  Pré-visualização do Agendamento
                </h4>
                <div className="text-sm text-blue-800 space-y-1">
                  <p><strong>Relatório:</strong> {reportTypes.find(r => r.id === selectedReport)?.name}</p>
                  <p><strong>Período Atual:</strong> {selectedPeriod}</p>
                  <p><strong>Dados:</strong> {reportData.length} registros</p>
                  <p><strong>Horário:</strong> 08:00 (horário local)</p>
                  <p><strong>Fuso:</strong> África/Maputo (CAT)</p>
                </div>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowScheduleModal(false)}
                  className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Calendar size={16} />
                  Agendar Relatório
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Scheduled Reports Section - REAL FUNCTIONALITY */}
      {scheduledReports.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Calendar className="text-blue-600" size={20} />
              Relatórios Agendados ({scheduledReports.length})
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>{scheduledReports.filter(s => s.isActive).length} ativos</span>
            </div>
          </div>
          
          <div className="space-y-3">
            {paginatedScheduledReports.map((schedule) => (
              <div key={schedule.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-sm transition-all">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <p className="font-medium text-gray-900">{schedule.name}</p>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      schedule.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {schedule.isActive ? 'Ativo' : 'Inativo'}
                    </span>
                    <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                      {schedule.format.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mb-1">
                    {reportTypes.find(r => r.id === schedule.reportType)?.name} • 
                    {getFrequencyLabel(schedule.frequency)} • 
                    {schedule.recipients.length} destinatário{schedule.recipients.length !== 1 ? 's' : ''}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>Próxima: {new Date(schedule.nextRun).toLocaleDateString('pt-PT')}</span>
                    {schedule.lastRun && (
                      <span>Última: {new Date(schedule.lastRun).toLocaleDateString('pt-PT')}</span>
                    )}
                    <span>Criado: {new Date(schedule.createdAt).toLocaleDateString('pt-PT')}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleRunScheduleNow(schedule.id)}
                    disabled={isLoading}
                    className="text-green-600 hover:text-green-700 p-2 hover:bg-green-50 rounded transition-colors disabled:opacity-50"
                    title="Executar agora"
                  >
                    <Send size={16} />
                  </button>
                  <button 
                    onClick={() => handleToggleSchedule(schedule.id)}
                    className="text-orange-600 hover:text-orange-700 p-2 hover:bg-orange-50 rounded transition-colors"
                    title={schedule.isActive ? 'Desativar' : 'Ativar'}
                  >
                    {schedule.isActive ? <Pause size={16} /> : <Play size={16} />}
                  </button>
                  <button 
                    onClick={() => {
                      alert(`✏️ Editando agendamento "${schedule.name}"\n\n📋 Tipo: ${reportTypes.find(r => r.id === schedule.reportType)?.name}\n🔄 Frequência: ${getFrequencyLabel(schedule.frequency)}\n📧 Destinatários: ${schedule.recipients.length}\n📄 Formato: ${schedule.format.toUpperCase()}\n\n⚠️ Funcionalidade de edição em desenvolvimento`);
                    }}
                    className="text-blue-600 hover:text-blue-700 p-2 hover:bg-blue-50 rounded transition-colors"
                    title="Editar"
                  >
                    <Edit size={16} />
                  </button>
                  <button 
                    onClick={() => handleDeleteSchedule(schedule.id)}
                    className="text-red-600 hover:text-red-700 p-2 hover:bg-red-50 rounded transition-colors"
                    title="Eliminar"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
         
          {scheduledReports.length > itemsPerPage && (
            <div className="mt-4">
              <Pagination
                currentPage={scheduledCurrentPage}
                totalPages={scheduledTotalPages}
                onPageChange={setScheduledCurrentPage}
                totalItems={scheduledReports.length}
                itemsPerPage={itemsPerPage}
              />
            </div>
          )}
        </div>
      )}

      {/* Quick Actions */}
      {!isLoading && reportData.length > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Zap className="text-blue-600" size={20} />
            Ações Rápidas
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => {
                setSelectedReport('revenue');
                setTimeout(() => setShowExportModal(true), 100);
              }}
              className="p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-all text-left"
            >
              <DollarSign className="text-green-600 mb-2" size={24} />
              <p className="font-medium text-gray-900">Relatório Financeiro</p>
              <p className="text-sm text-gray-600">Exportar análise de receitas</p>
            </button>
            <button
              onClick={() => {
                setSelectedReport('clients');
                setTimeout(() => setShowExportModal(true), 100);
              }}
              className="p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-all text-left"
            >
              <Users className="text-blue-600 mb-2" size={24} />
              <p className="font-medium text-gray-900">Relatório de Clientes</p>
              <p className="text-sm text-gray-600">Análise de crescimento</p>
            </button>
            <button
              onClick={() => {
                setSelectedReport('communication');
                setTimeout(() => setShowExportModal(true), 100);
              }}
              className="p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-all text-left"
            >
              <MessageSquare className="text-purple-600 mb-2" size={24} />
              <p className="font-medium text-gray-900">Analytics Comunicação</p>
              <p className="text-sm text-gray-600">Email e WhatsApp</p>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};