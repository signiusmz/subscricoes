import React, { useState } from 'react';
import { BarChart3, TrendingUp, Download, Calendar, DollarSign, Users, Activity, Star, Filter, FileText, Mail, MessageSquare, Eye, RefreshCw, Clock, Play, Pause, Trash2, PieChart, Target } from 'lucide-react';
import { PDFGenerator, ReportData } from '../../utils/pdfGenerator';
import { Pagination } from '../common/Pagination';

interface ReportDataItem {
  period: string;
  revenue: number;
  clients: number;
  services: number;
  satisfaction: number;
}

const mockReportData: ReportDataItem[] = [
  { period: 'Jan 2024', revenue: 180000, clients: 35, services: 65, satisfaction: 8.2 },
  { period: 'Fev 2024', revenue: 195000, clients: 38, services: 70, satisfaction: 8.4 },
  { period: 'Mar 2024', revenue: 210000, clients: 42, services: 75, satisfaction: 8.6 },
  { period: 'Abr 2024', revenue: 225000, clients: 45, services: 78, satisfaction: 8.3 },
  { period: 'Mai 2024', revenue: 240000, clients: 48, services: 82, satisfaction: 8.7 },
  { period: 'Jun 2024', revenue: 255000, clients: 52, services: 85, satisfaction: 8.5 }
];

const reportTypes = [
  { id: 'revenue', name: 'Relatório de Receitas', description: 'Análise detalhada das receitas por período' },
  { id: 'clients', name: 'Relatório de Clientes', description: 'Crescimento e retenção de clientes' },
  { id: 'services', name: 'Relatório de Serviços', description: 'Performance e utilização dos serviços' },
  { id: 'satisfaction', name: 'Relatório de Satisfação', description: 'Análise de satisfação dos clientes' }
];

interface ScheduledReport {
  id: string;
  name: string;
  reportType: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  recipients: string[];
  nextRun: string;
  isActive: boolean;
  createdAt: string;
}

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
  const itemsPerPage = 10;

  // Pagination for report data
  const reportDataTotalPages = Math.ceil(mockReportData.length / itemsPerPage);
  const reportDataStartIndex = (currentPage - 1) * itemsPerPage;
  const paginatedReportData = mockReportData.slice(reportDataStartIndex, reportDataStartIndex + itemsPerPage);

  // Pagination for scheduled reports
  const scheduledTotalPages = Math.ceil(scheduledReports.length / itemsPerPage);
  const scheduledStartIndex = (scheduledCurrentPage - 1) * itemsPerPage;
  const paginatedScheduledReports = scheduledReports.slice(scheduledStartIndex, scheduledStartIndex + itemsPerPage);

  const currentData = mockReportData[mockReportData.length - 1];
  const previousData = mockReportData[mockReportData.length - 2];

  const calculateGrowth = (current: number, previous: number) => {
    return ((current - previous) / previous * 100).toFixed(1);
  };

  const getMetricCards = () => [
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
      value: currentData.satisfaction.toString(),
      growth: calculateGrowth(currentData.satisfaction, previousData.satisfaction),
      icon: Star,
      color: 'orange'
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      green: 'bg-green-100 text-green-600',
      blue: 'bg-blue-100 text-blue-600',
      purple: 'bg-purple-100 text-purple-600',
      orange: 'bg-orange-100 text-orange-600'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const handleGenerateReport = () => {
    const reportData = {
      type: selectedReport,
      period: selectedPeriod,
      dateRange,
      clients: selectedClients,
      services: selectedServices,
      data: mockReportData
    };
    
    console.log('Generating report:', reportData);
    alert(`Relatório ${reportTypes.find(r => r.id === selectedReport)?.name} gerado com sucesso!`);
  };

  const handleExportReport = (format: 'pdf' | 'excel' | 'csv') => {
    if (format === 'pdf') {
      const reportName = reportTypes.find(r => r.id === selectedReport)?.name || 'Relatório';
      const reportData: ReportData = {
        title: reportName,
        type: selectedReport,
        period: selectedPeriod,
        startDate: dateRange.start || '2024-01-01',
        endDate: dateRange.end || new Date().toISOString().split('T')[0],
        totalClients: currentData.clients,
        totalRevenue: currentData.revenue,
        averageSatisfaction: currentData.satisfaction,
        data: mockReportData
      };
      PDFGenerator.generateReport(reportData);
    }
    setShowExportModal(false);
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
      createdAt: new Date().toISOString()
    };
    
    setScheduledReports([...scheduledReports, newSchedule]);
    setShowScheduleModal(false);
    alert(`Relatório agendado com sucesso! Próxima execução: ${new Date(newSchedule.nextRun).toLocaleDateString('pt-PT')}`);
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

  const handleScheduleReport = () => {
    setShowScheduleModal(true);
  };

  const mockClients = [
    { id: '1', name: 'Transportes Maputo Lda' },
    { id: '2', name: 'Construções Beira SA' },
    { id: '3', name: 'Farmácia Central' }
  ];

  const mockServices = [
    { id: '1', name: 'Contabilidade Mensal' },
    { id: '2', name: 'Auditoria Anual' },
    { id: '3', name: 'Consultoria Fiscal' }
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {mockServices.map(service => (
                  <option key={service.id} value={service.id}>{service.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button
              onClick={handleGenerateReport}
              className="bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <RefreshCw size={16} />
              Gerar Relatório
            </button>
            <button
              onClick={() => {
                setDateRange({ start: '', end: '' });
                setSelectedClients([]);
                setSelectedServices([]);
              }}
              className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Limpar Filtros
            </button>
          </div>
        </div>
      )}

      {/* Period Selector */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Período de Análise</h3>
            <div className="flex gap-2">
              {[
                { id: '1month', label: '1 Mês' },
                { id: '3months', label: '3 Meses' },
                { id: '6months', label: '6 Meses' },
                { id: '1year', label: '1 Ano' }
              ].map((period) => (
                <button
                  key={period.id}
                  onClick={() => setSelectedPeriod(period.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedPeriod === period.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {period.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar size={16} />
            <span>Última atualização: {new Date().toLocaleDateString('pt-PT')}</span>
          </div>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {getMetricCards().map((metric, index) => {
          const Icon = metric.icon;
          const isPositive = parseFloat(metric.growth) >= 0;
          
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
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

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Revenue Evolution Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Evolução da Receita</h3>
            <BarChart3 className="text-gray-400" size={20} />
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
              {mockReportData.map((data, index) => {
                const maxRevenue = Math.max(...mockReportData.map(d => d.revenue));
                const barHeight = (data.revenue / maxRevenue) * 100;
                
                return (
                  <div key={index} className="flex flex-col items-center gap-2 flex-1 group">
                    <div 
                      className="bg-gradient-to-t from-blue-600 to-blue-500 rounded-t-md w-full max-w-12 transition-all hover:shadow-lg hover:scale-105 cursor-pointer relative"
                      style={{ height: `${barHeight}%`, minHeight: '8px' }}
                      title={`${data.period}: ${data.revenue.toLocaleString()} MT`}
                    >
                      {/* Tooltip */}
                      <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-3 py-2 rounded-lg text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-10">
                        <div className="font-medium">{data.period}</div>
                        <div>{data.revenue.toLocaleString()} MT</div>
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
                const maxRevenue = Math.max(...mockReportData.map(d => d.revenue));
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
            <Star className="text-gray-400" size={20} />
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
                  points={mockReportData.map((data, index) => {
                    const x = (index / (mockReportData.length - 1)) * 100;
                    const y = 100 - ((data.satisfaction / 10) * 100);
                    return `${x}%,${y}%`;
                  }).join(' ')}
                />
              </svg>
              
              {mockReportData.map((data, index) => (
                <div key={index} className="flex flex-col items-center gap-2 flex-1 group relative" style={{ zIndex: 2 }}>
                  <div 
                    className="w-3 h-3 bg-orange-500 rounded-full border-2 border-white shadow-md cursor-pointer hover:scale-150 transition-transform"
                    style={{ marginBottom: `${(data.satisfaction / 10) * 200}px` }}
                    title={`${data.period}: ${data.satisfaction}/10`}
                  >
                    {/* Tooltip */}
                    <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-3 py-2 rounded-lg text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="font-medium">{data.period}</div>
                      <div>{data.satisfaction}/10</div>
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

      {/* Report Types */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Relatórios Disponíveis</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reportTypes.map((report) => (
            <div 
              key={report.id}
              className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                selectedReport === report.id
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300'
              }`}
              onClick={() => setSelectedReport(report.id)}
            >
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium text-gray-900">{report.name}</h4>
                <div className="flex gap-1">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      alert(`Visualizando ${report.name}`);
                    }}
                    className="text-green-600 hover:text-green-700 p-1"
                    title="Visualizar"
                  >
                    <Eye size={16} />
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowExportModal(true);
                    }}
                    className="text-blue-600 hover:text-blue-700 p-1"
                    title="Baixar"
                  >
                    <Download size={16} />
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-600">{report.description}</p>
              <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Calendar size={12} />
                  Última atualização: hoje
                </span>
                <span className="flex items-center gap-1">
                  <FileText size={12} />
                  {Math.floor(Math.random() * 50) + 10} registros
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Communication Analytics */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Analytics de Comunicação</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-blue-50 rounded-lg border border-blue-200">
            <Mail className="text-blue-600 mx-auto mb-3" size={32} />
            <p className="text-3xl font-bold text-blue-900 mb-2">2,847</p>
            <p className="text-sm text-blue-700 font-medium mb-2">Emails Enviados</p>
            <div className="space-y-1 text-xs text-blue-600">
              <p>Taxa de abertura: 68%</p>
              <p>Taxa de clique: 12%</p>
              <p>Bounces: 2.1%</p>
            </div>
            <div className="mt-4 w-full bg-blue-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: '68%' }}></div>
            </div>
          </div>
          
          <div className="text-center p-6 bg-green-50 rounded-lg border border-green-200">
            <MessageSquare className="text-green-600 mx-auto mb-3" size={32} />
            <p className="text-3xl font-bold text-green-900 mb-2">567</p>
            <p className="text-sm text-green-700 font-medium mb-2">WhatsApp Enviados</p>
            <div className="space-y-1 text-xs text-green-600">
              <p>Taxa de entrega: 98%</p>
              <p>Taxa de leitura: 89%</p>
              <p>Respostas: 23%</p>
            </div>
            <div className="mt-4 w-full bg-green-200 rounded-full h-2">
              <div className="bg-green-600 h-2 rounded-full" style={{ width: '89%' }}></div>
            </div>
          </div>
          
          <div className="text-center p-6 bg-purple-50 rounded-lg border border-purple-200">
            <Phone className="text-purple-600 mx-auto mb-3" size={32} />
            <p className="text-3xl font-bold text-purple-900 mb-2">234</p>
            <p className="text-sm text-purple-700 font-medium mb-2">SMS Enviados</p>
            <div className="space-y-1 text-xs text-purple-600">
              <p>Taxa de entrega: 95%</p>
              <p>Taxa de leitura: 78%</p>
              <p>Respostas: 8%</p>
            </div>
            <div className="mt-4 w-full bg-purple-200 rounded-full h-2">
              <div className="bg-purple-600 h-2 rounded-full" style={{ width: '78%' }}></div>
            </div>
          </div>
        </div>

        {/* Communication Trends */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-3">Melhor Horário de Envio</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">09:00 - 11:00</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900">85%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">14:00 - 16:00</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '72%' }}></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900">72%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">19:00 - 21:00</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div className="bg-orange-500 h-2 rounded-full" style={{ width: '58%' }}></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900">58%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-3">Canal Preferido por Idade</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">18-30 anos</span>
                <div className="flex items-center gap-2">
                  <MessageSquare size={12} className="text-green-600" />
                  <span className="text-sm font-medium text-gray-900">WhatsApp (78%)</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">31-50 anos</span>
                <div className="flex items-center gap-2">
                  <Mail size={12} className="text-blue-600" />
                  <span className="text-sm font-medium text-gray-900">Email (65%)</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">50+ anos</span>
                <div className="flex items-center gap-2">
                  <Phone size={12} className="text-purple-600" />
                  <span className="text-sm font-medium text-gray-900">SMS (82%)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Analytics */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Análise Detalhada</h3>
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
                const previousPeriod = index > 0 ? mockReportData[index - 1] : null;
                const growth = previousPeriod ? calculateGrowth(data.revenue, previousPeriod.revenue) : '0';
                const isPositive = parseFloat(growth) >= 0;
                
                return (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{data.period}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{data.revenue.toLocaleString()} MT</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{data.clients}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{data.services}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      <div className="flex items-center gap-1">
                        <Star className="text-yellow-500" size={12} />
                        {data.satisfaction}
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
                          onClick={() => alert(`Visualizando detalhes de ${data.period}`)}
                          className="text-blue-600 hover:text-blue-700 p-1"
                          title="Ver detalhes"
                        >
                          <Eye size={14} />
                        </button>
                        <button 
                          onClick={() => {
                            const reportData: ReportData = {
                              title: `Relatório Detalhado - ${data.period}`,
                              type: 'detailed',
                              period: data.period,
                              startDate: '2024-01-01',
                              endDate: new Date().toISOString().split('T')[0],
                              totalClients: data.clients,
                              totalRevenue: data.revenue,
                              averageSatisfaction: data.satisfaction,
                              data: [data]
                            };
                            PDFGenerator.generateReport(reportData);
                          }}
                          className="text-green-600 hover:text-green-700 p-1"
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
        <Pagination
          currentPage={currentPage}
          totalPages={reportDataTotalPages}
          onPageChange={setCurrentPage}
          totalItems={mockReportData.length}
          itemsPerPage={itemsPerPage}
        />
      </div>

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Exportar Relatório</h3>
            <p className="text-gray-600 mb-6">
              Escolha o formato para exportar o relatório "{reportTypes.find(r => r.id === selectedReport)?.name}":
            </p>
            
            <div className="space-y-3">
              <button
                onClick={() => handleExportReport('pdf')}
                className="w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
              >
                <FileText size={16} />
                Exportar como PDF
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

      {/* Schedule Modal */}
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <p><strong>Formato:</strong> PDF por email</p>
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

      {/* Scheduled Reports Section */}
      {scheduledReports.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Calendar className="text-blue-600" size={20} />
            Relatórios Agendados
          </h3>
          
          <div className="space-y-3">
            {paginatedScheduledReports.map((schedule) => (
              <div key={schedule.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{schedule.name}</p>
                  <p className="text-sm text-gray-500">
                    {reportTypes.find(r => r.id === schedule.reportType)?.name} • 
                    {schedule.frequency === 'daily' ? 'Diário' :
                     schedule.frequency === 'weekly' ? 'Semanal' :
                     schedule.frequency === 'monthly' ? 'Mensal' : 'Trimestral'}
                  </p>
                  <p className="text-xs text-gray-500">
                    Próxima execução: {new Date(schedule.nextRun).toLocaleDateString('pt-PT')}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    schedule.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {schedule.isActive ? 'Ativo' : 'Inativo'}
                  </span>
                  <div className="flex gap-1">
                    <button 
                      onClick={() => {
                        setScheduledReports(scheduledReports.map(s => 
                          s.id === schedule.id ? { ...s, isActive: !s.isActive } : s
                        ));
                      }}
                      className="text-orange-600 hover:text-orange-700 p-1"
                      title={schedule.isActive ? 'Desativar' : 'Ativar'}
                    >
                      {schedule.isActive ? <Pause size={16} /> : <Play size={16} />}
                    </button>
                    <button 
                      onClick={() => {
                        if (confirm('Tem certeza que deseja eliminar este agendamento?')) {
                          setScheduledReports(scheduledReports.filter(s => s.id !== schedule.id));
                          alert('Agendamento eliminado com sucesso!');
                        }
                      }}
                      className="text-red-600 hover:text-red-700 p-1"
                      title="Eliminar"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
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
    </div>
  );
};