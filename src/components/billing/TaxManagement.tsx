import React, { useState } from 'react';
import { 
  Calculator, 
  FileText, 
  Settings, 
  Save, 
  Plus, 
  Edit, 
  Trash2,
  DollarSign,
  Percent,
  Calendar,
  Building,
  AlertCircle,
  CheckCircle,
  Download,
  Upload,
  Eye,
  Filter,
  Search,
  BarChart3
} from 'lucide-react';

interface TaxRate {
  id: string;
  name: string;
  rate: number;
  type: 'iva' | 'irps' | 'irpc' | 'sisa' | 'custom';
  description: string;
  isActive: boolean;
  validFrom: string;
  validTo?: string;
  applicableServices: string[];
}

interface TaxCalculation {
  id: string;
  invoiceId: string;
  clientName: string;
  serviceName: string;
  baseAmount: number;
  taxType: string;
  taxRate: number;
  taxAmount: number;
  totalAmount: number;
  date: string;
  status: 'calculated' | 'applied' | 'paid';
}

interface TaxReport {
  period: string;
  totalTaxCollected: number;
  ivaCollected: number;
  irpsCollected: number;
  totalInvoices: number;
  averageTaxRate: number;
}

const mockTaxRates: TaxRate[] = [
  {
    id: '1',
    name: 'IVA Padrão',
    rate: 16,
    type: 'iva',
    description: 'Imposto sobre Valor Acrescentado - Taxa padrão',
    isActive: true,
    validFrom: '2024-01-01',
    applicableServices: ['1', '2', '3']
  },
  {
    id: '2',
    name: 'IVA Reduzido',
    rate: 10,
    type: 'iva',
    description: 'IVA com taxa reduzida para serviços específicos',
    isActive: true,
    validFrom: '2024-01-01',
    applicableServices: ['4']
  }
];

const mockTaxCalculations: TaxCalculation[] = [
  {
    id: '1',
    invoiceId: 'FAC-2024-001',
    clientName: 'Transportes Maputo Lda',
    serviceName: 'Contabilidade Mensal',
    baseAmount: 5000,
    taxType: 'IVA Padrão',
    taxRate: 16,
    taxAmount: 800,
    totalAmount: 5800,
    date: '2024-03-01',
    status: 'paid'
  },
  {
    id: '2',
    invoiceId: 'FAC-2024-002',
    clientName: 'Construções Beira SA',
    serviceName: 'Auditoria Anual',
    baseAmount: 15000,
    taxType: 'IVA Padrão',
    taxRate: 16,
    taxAmount: 2400,
    totalAmount: 17400,
    date: '2024-03-15',
    status: 'applied'
  },
  {
    id: '3',
    invoiceId: 'FAC-2024-003',
    clientName: 'Hotel Polana',
    serviceName: 'Consultoria Fiscal',
    baseAmount: 8000,
    taxType: 'IVA Reduzido',
    taxRate: 10,
    taxAmount: 800,
    totalAmount: 8800,
    date: '2024-03-20',
    status: 'calculated'
  }
];

const mockServices = [
  { id: '1', name: 'Contabilidade Mensal' },
  { id: '2', name: 'Auditoria Anual' },
  { id: '3', name: 'Consultoria Fiscal' },
  { id: '4', name: 'Declaração de IVA' },
  { id: '5', name: 'Folha de Salários' }
];

export const TaxManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('rates');
  const [taxRates, setTaxRates] = useState<TaxRate[]>(mockTaxRates);
  const [taxCalculations, setTaxCalculations] = useState<TaxCalculation[]>(mockTaxCalculations);
  const [showAddRateModal, setShowAddRateModal] = useState(false);
  const [editingRate, setEditingRate] = useState<TaxRate | null>(null);
  const [showCalculator, setShowCalculator] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'calculated' | 'applied' | 'paid'>('all');

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-PT');
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      calculated: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Calculado' },
      applied: { bg: 'bg-orange-100', text: 'text-orange-800', label: 'Aplicado' },
      paid: { bg: 'bg-green-100', text: 'text-green-800', label: 'Pago' }
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.calculated;
    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const getTaxTypeBadge = (type: string) => {
    const typeConfig = {
      iva: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'IVA' }
    };
    const config = typeConfig[type as keyof typeof typeConfig] || typeConfig.iva;
    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const calculateTax = (baseAmount: number, taxRateId: string) => {
    const taxRate = taxRates.find(tr => tr.id === taxRateId);
    if (!taxRate) return { taxAmount: 0, totalAmount: baseAmount };
    
    const taxAmount = (baseAmount * taxRate.rate) / 100;
    const totalAmount = baseAmount + taxAmount;
    
    return { taxAmount, totalAmount };
  };

  const handleSaveTaxRate = (rateData: Partial<TaxRate>) => {
    if (editingRate) {
      setTaxRates(taxRates.map(tr => 
        tr.id === editingRate.id 
          ? { ...tr, ...rateData }
          : tr
      ));
      alert(`✅ Taxa de imposto "${rateData.name}" atualizada!\n\n📊 Taxa: ${rateData.rate}%\n📋 Tipo: ${rateData.type?.toUpperCase()}\n📅 Válida desde: ${rateData.validFrom}\n🟢 Status: ${rateData.isActive ? 'Ativa' : 'Inativa'}`);
    } else {
      const newRate: TaxRate = {
        id: Date.now().toString(),
        name: rateData.name || '',
        rate: rateData.rate || 0,
        type: rateData.type || 'custom',
        description: rateData.description || '',
        isActive: true,
        validFrom: rateData.validFrom || new Date().toISOString().split('T')[0],
        applicableServices: rateData.applicableServices || []
      };
      setTaxRates([...taxRates, newRate]);
      alert(`✅ Nova taxa de imposto "${newRate.name}" criada!\n\n📊 Taxa: ${newRate.rate}%\n📋 Tipo: ${newRate.type.toUpperCase()}\n📅 Válida desde: ${newRate.validFrom}\n🟢 Status: Ativa`);
    }
    setShowAddRateModal(false);
    setEditingRate(null);
  };

  const handleDeleteTaxRate = (rateId: string) => {
    if (confirm('Tem certeza que deseja eliminar esta taxa de imposto?')) {
      setTaxRates(taxRates.filter(tr => tr.id !== rateId));
      alert('Taxa de imposto eliminada com sucesso!');
    }
  };

  const generateTaxReport = () => {
    const report: TaxReport = {
      period: 'Março 2024',
      totalTaxCollected: taxCalculations.reduce((sum, tc) => sum + tc.taxAmount, 0),
      ivaCollected: taxCalculations.filter(tc => tc.taxType.includes('IVA')).reduce((sum, tc) => sum + tc.taxAmount, 0),
      irpsCollected: taxCalculations.filter(tc => tc.taxType.includes('IRPS')).reduce((sum, tc) => sum + tc.taxAmount, 0),
      totalInvoices: taxCalculations.length,
      averageTaxRate: taxCalculations.reduce((sum, tc) => sum + tc.taxRate, 0) / taxCalculations.length
    };

    alert(`📊 Relatório Fiscal - ${report.period}\n\n💰 Total de Impostos: ${report.totalTaxCollected.toLocaleString()} MT\n📋 IVA Coletado: ${report.ivaCollected.toLocaleString()} MT\n👥 IRPS Coletado: ${report.irpsCollected.toLocaleString()} MT\n📄 Total de Faturas: ${report.totalInvoices}\n📈 Taxa Média: ${report.averageTaxRate.toFixed(1)}%\n\n📥 Relatório gerado com sucesso!`);
  };

  const filteredCalculations = taxCalculations.filter(calc => {
    const matchesSearch = calc.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         calc.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         calc.invoiceId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || calc.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const renderTaxRates = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Configuração de Impostos</h3>
        <button
          onClick={() => setShowAddRateModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus size={16} />
          Nova Taxa
        </button>
      </div>

      {/* Tax Rates Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nome</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Taxa</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Válido Desde</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Serviços</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {taxRates.map((rate) => (
                <tr key={rate.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{rate.name}</div>
                      <div className="text-sm text-gray-500">{rate.description}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">{getTaxTypeBadge(rate.type)}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <Percent size={12} className="text-gray-400" />
                      <span className="text-sm font-medium text-gray-900">{rate.rate}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{formatDate(rate.validFrom)}</td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-900">
                      {rate.applicableServices.length === 0 ? 'Todos' : `${rate.applicableServices.length} serviços`}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      rate.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {rate.isActive ? 'Ativa' : 'Inativa'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingRate(rate);
                          setShowAddRateModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteTaxRate(rate.id)}
                        className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tax Calculator */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Calculator className="text-green-600" size={20} />
          Calculadora de Impostos
        </h4>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Valor Base (MT)</label>
            <input
              type="number"
              id="baseAmount"
              placeholder="Ex: 5000"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Taxa de Imposto</label>
            <select
              id="taxRate"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Selecionar taxa</option>
              {taxRates.filter(tr => tr.isActive).map((rate) => (
                <option key={rate.id} value={rate.id}>
                  {rate.name} ({rate.rate}%)
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => {
                const baseAmountInput = document.getElementById('baseAmount') as HTMLInputElement;
                const taxRateSelect = document.getElementById('taxRate') as HTMLSelectElement;
                
                const baseAmount = parseFloat(baseAmountInput.value);
                const selectedRateId = taxRateSelect.value;
                
                if (!baseAmount || !selectedRateId) {
                  alert('Preencha todos os campos');
                  return;
                }
                
                const { taxAmount, totalAmount } = calculateTax(baseAmount, selectedRateId);
                const selectedRate = taxRates.find(tr => tr.id === selectedRateId);
                
                alert(`🧮 Cálculo de Impostos\n\n💰 Valor Base: ${baseAmount.toLocaleString()} MT\n📊 Taxa: ${selectedRate?.name} (${selectedRate?.rate}%)\n💸 Imposto: ${taxAmount.toLocaleString()} MT\n💵 Total: ${totalAmount.toLocaleString()} MT`);
              }}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
            >
              <Calculator size={16} />
              Calcular
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCalculations = () => (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Calculado</p>
              <p className="text-2xl font-bold text-gray-900">
                {taxCalculations.reduce((sum, tc) => sum + tc.taxAmount, 0).toLocaleString()} MT
              </p>
            </div>
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-blue-100 text-blue-600">
              <Calculator size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">IVA Coletado</p>
              <p className="text-2xl font-bold text-gray-900">
                {taxCalculations.filter(tc => tc.taxType.includes('IVA')).reduce((sum, tc) => sum + tc.taxAmount, 0).toLocaleString()} MT
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
              <p className="text-sm font-medium text-gray-600 mb-1">Faturas com Imposto</p>
              <p className="text-2xl font-bold text-gray-900">{taxCalculations.length}</p>
            </div>
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-purple-100 text-purple-600">
              <FileText size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Taxa Média</p>
              <p className="text-2xl font-bold text-gray-900">
                {(taxCalculations.reduce((sum, tc) => sum + tc.taxRate, 0) / taxCalculations.length).toFixed(1)}%
              </p>
            </div>
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-orange-100 text-orange-600">
              <Percent size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Pesquisar cálculos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">Todos os Status</option>
          <option value="calculated">Calculado</option>
          <option value="applied">Aplicado</option>
          <option value="paid">Pago</option>
        </select>
        <button
          onClick={generateTaxReport}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
        >
          <BarChart3 size={16} />
          Gerar Relatório
        </button>
      </div>

      {/* Calculations Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fatura</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Serviço</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Valor Base</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Imposto</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredCalculations.map((calc) => (
                <tr key={calc.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{calc.invoiceId}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{calc.clientName}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{calc.serviceName}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{calc.baseAmount.toLocaleString()} MT</td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {calc.taxAmount.toLocaleString()} MT
                      <div className="text-xs text-gray-500">({calc.taxRate}% {calc.taxType})</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{calc.totalAmount.toLocaleString()} MT</td>
                  <td className="px-6 py-4">{getStatusBadge(calc.status)}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded">
                        <Eye size={16} />
                      </button>
                      <button className="text-green-600 hover:text-green-900 p-1 hover:bg-green-50 rounded">
                        <Download size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderReports = () => (
    <div className="space-y-6">
      {/* Tax Summary */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Resumo Fiscal</h3>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-blue-50 rounded-lg p-6 text-center">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="text-white" size={24} />
            </div>
            <h4 className="font-semibold text-blue-900 mb-2">IVA a Pagar</h4>
            <div className="text-2xl font-bold text-blue-900">
              {taxCalculations.filter(tc => tc.taxType.includes('IVA')).reduce((sum, tc) => sum + tc.taxAmount, 0).toLocaleString()} MT
            </div>
            <p className="text-sm text-blue-700 mt-1">Este mês</p>
          </div>

          <div className="bg-green-50 rounded-lg p-6 text-center">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="text-white" size={24} />
            </div>
            <h4 className="font-semibold text-green-900 mb-2">Total de Impostos</h4>
            <div className="text-2xl font-bold text-green-900">
              {taxCalculations.reduce((sum, tc) => sum + tc.taxAmount, 0).toLocaleString()} MT
            </div>
            <p className="text-sm text-green-700 mt-1">Este mês</p>
          </div>

          <div className="bg-purple-50 rounded-lg p-6 text-center">
            <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <DollarSign className="text-white" size={24} />
            </div>
            <h4 className="font-semibold text-purple-900 mb-2">Média de IVA</h4>
            <div className="text-2xl font-bold text-purple-900">
              {(taxCalculations.reduce((sum, tc) => sum + tc.taxRate, 0) / taxCalculations.length).toFixed(1)}%
            </div>
            <p className="text-sm text-purple-700 mt-1">Taxa média aplicada</p>
          </div>
        </div>
      </div>

      {/* Export Options */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Exportar Relatórios Fiscais</h4>
        
        <div className="grid md:grid-cols-3 gap-4">
          <button
 type: 'iva';
       type: rateData.type || 'iva',
               type: formData.get('type') as 'iva',
                   placeholder="Ex: 16"
              <p className="text-sm text-blue-700">Declaração mensal em PDF</p>
            </div>
          </button>
          
          <button
            onClick={() => alert('Relatório de IRPS exportado em Excel!')}
            className="flex items-center justify-center gap-3 p-4 border-2 border-green-200 rounded-lg hover:bg-green-50 transition-colors"
          >
            <BarChart3 className="text-green-600" size={24} />
            <div className="text-left">
              <p className="font-medium text-green-900">Relatório de IRPS</p>
              <p className="text-sm text-green-700">Retenções em Excel</p>
            </div>
          </button>
          
          <button
            onClick={() => alert('Resumo fiscal exportado em CSV!')}
            className="flex items-center justify-center gap-3 p-4 border-2 border-purple-200 rounded-lg hover:bg-purple-50 transition-colors"
          >
            <Download className="text-purple-600" size={24} />
            <div className="text-left">
              <p className="font-medium text-purple-900">Resumo Fiscal</p>
              <p className="text-sm text-purple-700">Dados completos em CSV</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'rates', label: 'Taxas de Imposto', icon: Settings },
    { id: 'calculations', label: 'Cálculos', icon: Calculator },
    { id: 'reports', label: 'Relatórios', icon: BarChart3 }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Gestão de Impostos</h2>
        
        {/* Navigation Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Content */}
      {activeTab === 'rates' && renderTaxRates()}
      {activeTab === 'calculations' && renderCalculations()}
      {activeTab === 'reports' && renderReports()}

      {/* Add/Edit Tax Rate Modal */}
      {showAddRateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {editingRate ? 'Editar Taxa de Imposto' : 'Nova Taxa de Imposto'}
            </h3>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const serviceIds = Array.from(formData.getAll('applicableServices')) as string[];
              
              const rateData = {
                name: formData.get('name') as string,
                rate: Number(formData.get('rate')),
                type: formData.get('type') as 'iva' | 'irps' | 'irpc' | 'sisa' | 'custom',
                description: formData.get('description') as string,
                validFrom: formData.get('validFrom') as string,
                validTo: formData.get('validTo') as string || undefined,
                applicableServices: serviceIds,
                isActive: formData.get('isActive') === 'on'
              };
              handleSaveTaxRate(rateData);
            }} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nome da Taxa</label>
                  <input
                    type="text"
                    name="name"
                    defaultValue={editingRate?.name || ''}
                    placeholder="Ex: IVA Padrão"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Taxa (%)</label>
                  <input
                    type="number"
                    name="rate"
                    defaultValue={editingRate?.rate || ''}
                    placeholder="Ex: 17"
                    min="0"
                    max="100"
                    step="0.01"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Imposto</label>
                  <select
                    name="type"
                    defaultValue={editingRate?.type || 'iva'}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="iva">IVA</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Válido Desde</label>
                  <input
                    type="date"
                    name="validFrom"
                    defaultValue={editingRate?.validFrom || new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Descrição</label>
                  <textarea
                    name="description"
                    defaultValue={editingRate?.description || ''}
                    placeholder="Descrição da taxa de imposto..."
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              {/* Applicable Services */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Serviços Aplicáveis</label>
                <div className="border border-gray-300 rounded-lg p-4 max-h-40 overflow-y-auto">
                  <div className="space-y-2">
                    {mockServices.map((service) => (
                      <label key={service.id} className="flex items-center">
                        <input
                          type="checkbox"
                          name="applicableServices"
                          value={service.id}
                          defaultChecked={editingRate?.applicableServices.includes(service.id)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">{service.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Se nenhum serviço for selecionado, a taxa aplicará a todos os serviços
                </p>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isActive"
                  id="isActive"
                  defaultChecked={editingRate?.isActive !== false}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
                  Taxa ativa (será aplicada automaticamente)
                </label>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddRateModal(false);
                    setEditingRate(null);
                  }}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingRate ? 'Atualizar' : 'Adicionar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};