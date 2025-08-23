import React, { useState } from 'react';
import { FileText, Receipt, Plus, Search, Filter, Eye, Download, Edit, Trash2, Calendar, DollarSign, CreditCard, Banknote, Smartphone } from 'lucide-react';
import { PDFGenerator, InvoiceData, ReceiptData } from '../../utils/pdfGenerator';
import { useAuth } from '../../context/AuthContext';

interface Invoice {
  id: string;
  number: string;
  subscriptionId: string;
  clientId: string;
  clientName: string;
  serviceName: string;
  amount: number;
  paidAmount?: number;
  issueDate: string;
  dueDate: string;
  status: 'pending' | 'paid' | 'partial' | 'overdue' | 'cancelled';
  paymentMethod?: 'cash' | 'pos' | 'transfer' | 'numerario';
  paidDate?: string;
  receiptId?: string;
  notes?: string;
  payments?: Payment[];
}

interface Receipt {
  id: string;
  number: string;
  invoiceId: string;
  subscriptionId: string;
  clientId: string;
  clientName: string;
  serviceName: string;
  amount: number;
  paymentDate: string;
  paymentMethod: 'cash' | 'pos' | 'transfer' | 'numerario';
  reference?: string;
  notes?: string;
}
interface Payment {
  id: string;
  invoiceId: string;
  amount: number;
  date: string;
  method: 'cash' | 'pos' | 'transfer' | 'numerario';
  reference?: string;
  notes?: string;
}


// Create a global state for invoices that can be shared across components
let globalInvoices: Invoice[] = [
  {
    id: '1',
    number: 'FAC-2024-001',
    subscriptionId: '1',
    clientId: '1',
    clientName: 'Transportes Maputo Lda',
    serviceName: 'Contabilidade Mensal',
    amount: 5000,
    issueDate: '2024-01-01',
    dueDate: '2024-01-31',
    status: 'paid',
    paymentMethod: 'transfer',
    paidDate: '2024-01-25',
    receiptId: '1',
    paidAmount: 5000,
    payments: [{
      id: '1',
      invoiceId: '1',
      amount: 5000,
      date: '2024-01-25',
      method: 'transfer',
      reference: 'TRF-001'
    }]
  },
  {
    id: '2',
    number: 'FAC-2024-002',
    subscriptionId: '2',
    clientId: '2',
    clientName: 'Construções Beira SA',
    serviceName: 'Auditoria Anual',
    amount: 15000,
    issueDate: '2024-02-01',
    dueDate: '2024-02-29',
    status: 'pending'
  },
  {
    id: '6',
    number: 'FAC-2024-006',
    subscriptionId: '3',
    clientId: '2',
    clientName: 'Construções Beira SA',
    serviceName: 'Consultoria Fiscal',
    amount: 8000,
    issueDate: '2024-03-01',
    dueDate: '2024-03-31',
    status: 'partial',
    paidAmount: 3000,
    payments: [{
      id: '2',
      invoiceId: '6',
      amount: 3000,
      date: '2024-03-15',
      method: 'cash',
      notes: 'Pagamento parcial'
    }]
  },
  {
    id: '3',
    number: 'FAC-2024-003',
    subscriptionId: '1',
    clientId: '1',
    clientName: 'Transportes Maputo Lda',
    serviceName: 'Contabilidade Mensal',
    amount: 5000,
    issueDate: '2024-02-01',
    dueDate: '2024-02-29',
    status: 'overdue'
  }
];

// Function to add new invoice to global state
export const addInvoiceToGlobal = (invoice: Invoice) => {
  globalInvoices = [invoice, ...globalInvoices];
  // Trigger a custom event to notify components
  window.dispatchEvent(new CustomEvent('invoicesUpdated', { detail: globalInvoices }));
};

// Function to get all invoices
export const getGlobalInvoices = () => globalInvoices;

const mockReceipts: Receipt[] = [
  {
    id: '1',
    number: 'REC-2024-001',
    invoiceId: '1',
    subscriptionId: '1',
    clientId: '1',
    clientName: 'Transportes Maputo Lda',
    serviceName: 'Contabilidade Mensal',
    amount: 5000,
    paymentDate: '2024-01-25',
    paymentMethod: 'transfer',
    reference: 'TRF-001-2024'
  }
];

const paymentMethods = [
  { value: 'cash', label: 'Dinheiro', icon: Banknote },
  { value: 'pos', label: 'POS', icon: CreditCard },
  { value: 'transfer', label: 'Transferência', icon: CreditCard },
  { value: 'numerario', label: 'Numerário', icon: DollarSign }
];

export const BillingModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState('invoices');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<Receipt | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>(globalInvoices);
  const [receipts, setReceipts] = useState<Receipt[]>(mockReceipts);

  // Listen for invoice updates from other components
  React.useEffect(() => {
    const handleInvoicesUpdate = (event: CustomEvent) => {
      setInvoices([...event.detail]);
    };

    window.addEventListener('invoicesUpdated', handleInvoicesUpdate as EventListener);
    
    return () => {
      window.removeEventListener('invoicesUpdated', handleInvoicesUpdate as EventListener);
    };
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-PT');
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pendente' },
      paid: { bg: 'bg-green-100', text: 'text-green-800', label: 'Paga' },
      partial: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Parcial' },
      overdue: { bg: 'bg-red-100', text: 'text-red-800', label: 'Em Atraso' },
      cancelled: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Cancelada' }
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const getPaymentMethodLabel = (method: string) => {
    const methodConfig = paymentMethods.find(m => m.value === method);
    return methodConfig ? methodConfig.label : method;
  };

  const getPaymentMethodIcon = (method: string) => {
    const methodConfig = paymentMethods.find(m => m.value === method);
    if (methodConfig) {
      const Icon = methodConfig.icon;
      return <Icon size={12} />;
    }
    return <DollarSign size={12} />;
  };
  const handleDownloadInvoice = (invoice: Invoice) => {
    // Get client info from mock data (in production, this would come from API)
    const mockClientInfo = {
      companyName: invoice.clientName,
      representative: 'Representante Legal',
      email: 'cliente@email.com',
      phone: '+258 84 123 456',
      nuit: '400123456',
      address: 'Endereço do cliente'
    };

    const invoiceData: InvoiceData = {
      number: invoice.number,
      date: invoice.issueDate,
      dueDate: invoice.dueDate,
      clientInfo: mockClientInfo,
      serviceName: invoice.serviceName,
      serviceDescription: 'Descrição detalhada do serviço prestado pela empresa',
      amount: invoice.amount,
      status: invoice.status,
      paymentMethod: invoice.paymentMethod,
      paidDate: invoice.paidDate,
      notes: invoice.notes || 'Obrigado pela sua preferência!'
    };
    
    PDFGenerator.generateInvoice(invoiceData);
  };

  const handleDownloadReceipt = (receipt: Receipt) => {
    // Get client info from mock data (in production, this would come from API)
    const mockClientInfo = {
      companyName: receipt.clientName,
      representative: 'Representante Legal',
      email: 'cliente@email.com',
      phone: '+258 84 123 456',
      nuit: '400123456',
      address: 'Endereço do cliente'
    };

    const receiptData: ReceiptData = {
      number: receipt.number,
      date: receipt.paymentDate,
      clientInfo: mockClientInfo,
      invoiceNumber: `INV-${receipt.invoiceId}`,
      serviceName: receipt.serviceName,
      amount: receipt.amount,
      paymentMethod: receipt.paymentMethod,
      reference: receipt.reference,
      notes: receipt.notes || 'Pagamento processado com sucesso!'
    };
    
    PDFGenerator.generateReceipt(receiptData);
  };


  const handlePayInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setShowPaymentModal(true);
  };

  const handleProcessPayment = (paymentData: any) => {
    if (!selectedInvoice) return;

    const paymentAmount = parseFloat(paymentData.amount);
    const currentPaidAmount = selectedInvoice.paidAmount || 0;
    const newPaidAmount = currentPaidAmount + paymentAmount;
    const remainingAmount = selectedInvoice.amount - newPaidAmount;
    
    // Determine new status
    let newStatus: 'paid' | 'partial' | 'pending' = 'pending';
    if (newPaidAmount >= selectedInvoice.amount) {
      newStatus = 'paid';
    } else if (newPaidAmount > 0) {
      newStatus = 'partial';
    }

    // Create receipt
    const newReceipt: Receipt = {
      id: Date.now().toString(),
      number: `REC-2024-${String(receipts.length + 1).padStart(3, '0')}`,
      invoiceId: selectedInvoice.id,
      subscriptionId: selectedInvoice.subscriptionId,
      clientId: selectedInvoice.clientId,
      clientName: selectedInvoice.clientName,
      serviceName: selectedInvoice.serviceName,
      amount: paymentAmount,
      paymentDate: new Date().toISOString().split('T')[0],
      paymentMethod: paymentData.paymentMethod,
      reference: paymentData.reference,
      notes: paymentData.notes
    };

    // Create payment record
    const newPayment: Payment = {
      id: Date.now().toString(),
      invoiceId: selectedInvoice.id,
      amount: paymentAmount,
      date: new Date().toISOString().split('T')[0],
      method: paymentData.paymentMethod,
      reference: paymentData.reference,
      notes: paymentData.notes
    };

    // Update invoice status
    const updatedInvoices = invoices.map(inv => 
      inv.id === selectedInvoice.id 
        ? { 
            ...inv, 
            status: newStatus,
            paidAmount: newPaidAmount,
            paymentMethod: paymentData.paymentMethod,
            paidDate: newStatus === 'paid' ? new Date().toISOString().split('T')[0] : inv.paidDate,
            receiptId: newStatus === 'paid' ? newReceipt.id : inv.receiptId,
            payments: [...(inv.payments || []), newPayment]
          }
        : inv
    );

    // Update global state
    globalInvoices = updatedInvoices;
    window.dispatchEvent(new CustomEvent('invoicesUpdated', { detail: globalInvoices }));

    setInvoices(updatedInvoices);
    setReceipts([...receipts, newReceipt]);
    setShowPaymentModal(false);
    setSelectedInvoice(null);
    
    // Show appropriate message
    if (newStatus === 'paid') {
      alert(`✅ Pagamento completo processado!\n\n💰 Valor pago: ${paymentAmount.toLocaleString()} MT\n📄 Recibo: ${newReceipt.number}\n✅ Fatura quitada totalmente`);
    } else {
      alert(`✅ Pagamento parcial processado!\n\n💰 Valor pago: ${paymentAmount.toLocaleString()} MT\n💳 Total pago: ${newPaidAmount.toLocaleString()} MT\n📊 Saldo restante: ${remainingAmount.toLocaleString()} MT\n📄 Recibo: ${newReceipt.number}\n\n⚠️ Fatura mantida em aberto para próximo pagamento`);
    }
  };

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.serviceName.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (statusFilter === 'all') return matchesSearch;
    return matchesSearch && invoice.status === statusFilter;
  });

  const filteredReceipts = receipts.filter(receipt =>
    receipt.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    receipt.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    receipt.serviceName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderInvoices = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Gestão de Facturas</h3>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2">
          <Plus size={20} />
          Nova Factura
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Facturas</p>
              <p className="text-2xl font-bold text-gray-900">{invoices.length}</p>
            </div>
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-blue-100 text-blue-600">
              <FileText size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Facturas Pagas</p>
              <p className="text-2xl font-bold text-gray-900">
                {invoices.filter(i => i.status === 'paid').length}
              </p>
            </div>
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-green-100 text-green-600">
              <FileText size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Pendentes</p>
              <p className="text-2xl font-bold text-gray-900">
                {invoices.filter(i => i.status === 'pending').length}
              </p>
            </div>
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-yellow-100 text-yellow-600">
              <FileText size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Pagamentos Parciais</p>
              <p className="text-2xl font-bold text-gray-900">
                {invoices.filter(i => i.status === 'partial').length}
              </p>
            </div>
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-blue-100 text-blue-600">
              <CreditCard size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Valor Total</p>
              <p className="text-2xl font-bold text-gray-900">
                {invoices.reduce((total, inv) => total + inv.amount, 0).toLocaleString()} MT
              </p>
            </div>
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-emerald-100 text-emerald-600">
              <DollarSign size={24} />
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
            placeholder="Pesquisar facturas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">Todos os Status</option>
          <option value="pending">Pendentes</option>
          <option value="paid">Pagas</option>
          <option value="partial">Pagamento Parcial</option>
          <option value="overdue">Em Atraso</option>
          <option value="cancelled">Canceladas</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Factura</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Serviço</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Valor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pago</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Emissão</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vencimento</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredInvoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{invoice.number}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{invoice.clientName}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{invoice.serviceName}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{invoice.amount.toLocaleString()} MT</td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {invoice.paidAmount ? (
                      <div>
                        <div className="font-medium">{invoice.paidAmount.toLocaleString()} MT</div>
                        {invoice.status === 'partial' && (
                          <div className="text-xs text-blue-600">
                            Restante: {(invoice.amount - invoice.paidAmount).toLocaleString()} MT
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="text-gray-400">0 MT</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{formatDate(invoice.issueDate)}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{formatDate(invoice.dueDate)}</td>
                  <td className="px-6 py-4">{getStatusBadge(invoice.status)}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => {
                          setSelectedInvoice(invoice);
                          setShowInvoiceModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded"
                        title="Ver detalhes"
                      >
                        <Eye size={16} />
                      </button>
                      <button 
                        onClick={() => handleDownloadInvoice(invoice)}
                        className="text-green-600 hover:text-green-900 p-1 hover:bg-green-50 rounded" 
                        title="Download PDF"
                      >
                        <Download size={16} />
                      </button>
                      {(invoice.status === 'pending' || invoice.status === 'partial') && (
                        <button 
                          onClick={() => handlePayInvoice(invoice)}
                          className="text-purple-600 hover:text-purple-900 p-1 hover:bg-purple-50 rounded"
                          title={invoice.status === 'partial' ? 'Completar pagamento' : 'Processar pagamento'}
                        >
                          <CreditCard size={16} />
                        </button>
                      )}
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

  const renderReceipts = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Gestão de Recibos</h3>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Recibos</p>
              <p className="text-2xl font-bold text-gray-900">{receipts.length}</p>
            </div>
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-green-100 text-green-600">
              <Receipt size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Dinheiro</p>
              <p className="text-2xl font-bold text-gray-900">
                {receipts.filter(r => r.paymentMethod === 'cash').length}
              </p>
            </div>
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-blue-100 text-blue-600">
              <Banknote size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Transferências</p>
              <p className="text-2xl font-bold text-gray-900">
                {receipts.filter(r => r.paymentMethod === 'transfer').length}
              </p>
            </div>
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-purple-100 text-purple-600">
              <CreditCard size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Valor Total</p>
              <p className="text-2xl font-bold text-gray-900">
                {receipts.reduce((total, rec) => total + rec.amount, 0).toLocaleString()} MT
              </p>
            </div>
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-emerald-100 text-emerald-600">
              <DollarSign size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Pesquisar recibos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Recibo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Serviço</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Valor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data Pagamento</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Método</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Referência</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredReceipts.map((receipt) => (
                <tr key={receipt.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{receipt.number}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{receipt.clientName}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{receipt.serviceName}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{receipt.amount.toLocaleString()} MT</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{formatDate(receipt.paymentDate)}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {getPaymentMethodIcon(receipt.paymentMethod)}
                      <span className="text-sm text-gray-900">{getPaymentMethodLabel(receipt.paymentMethod)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{receipt.reference || '-'}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => {
                          setSelectedReceipt(receipt);
                          setShowReceiptModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded"
                        title="Ver detalhes"
                      >
                        <Eye size={16} />
                      </button>
                      <button 
                        onClick={() => handleDownloadReceipt(receipt)}
                        className="text-green-600 hover:text-green-900 p-1 hover:bg-green-50 rounded" 
                        title="Download PDF"
                      >
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

  const tabs = [
    { id: 'invoices', label: 'Facturas', icon: FileText },
    { id: 'receipts', label: 'Recibos', icon: Receipt }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Facturação</h2>
        
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
      {activeTab === 'invoices' && renderInvoices()}
      {activeTab === 'receipts' && renderReceipts()}

      {/* Payment Modal */}
      {showPaymentModal && selectedInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Processar Pagamento</h3>
            
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Factura: <span className="font-medium">{selectedInvoice.number}</span></p>
              <p className="text-sm text-gray-600">Cliente: <span className="font-medium">{selectedInvoice.clientName}</span></p>
              <p className="text-sm text-gray-600">Valor Total: <span className="font-medium">{selectedInvoice.amount.toLocaleString()} MT</span></p>
              {selectedInvoice.paidAmount && selectedInvoice.paidAmount > 0 && (
                <>
                  <p className="text-sm text-gray-600">Já Pago: <span className="font-medium text-green-600">{selectedInvoice.paidAmount.toLocaleString()} MT</span></p>
                  <p className="text-sm text-gray-600">Saldo Restante: <span className="font-medium text-blue-600">{(selectedInvoice.amount - selectedInvoice.paidAmount).toLocaleString()} MT</span></p>
                </>
              )}
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const paymentData = {
                amount: formData.get('amount') as string,
                paymentMethod: formData.get('paymentMethod') as string,
                reference: formData.get('reference') as string,
                notes: formData.get('notes') as string
              };
              handleProcessPayment(paymentData);
            }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Valor a Pagar (MT) *
                </label>
                <input
                  type="number"
                  name="amount"
                  step="0.01"
                  min="0.01"
                  max={selectedInvoice.amount - (selectedInvoice.paidAmount || 0)}
                  defaultValue={selectedInvoice.amount - (selectedInvoice.paidAmount || 0)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Digite o valor a pagar"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Máximo: {(selectedInvoice.amount - (selectedInvoice.paidAmount || 0)).toLocaleString()} MT
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Método de Pagamento</label>
                <select
                  name="paymentMethod"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  {paymentMethods.map((method) => (
                    <option key={method.value} value={method.value}>{method.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Referência (opcional)</label>
                <input
                  type="text"
                  name="reference"
                  placeholder="Ex: TRF-001-2024"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Observações (opcional)</label>
                <textarea
                  name="notes"
                  rows={2}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowPaymentModal(false);
                    setSelectedInvoice(null);
                  }}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                >
                  <CreditCard size={16} />
                  Processar Pagamento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invoice Details Modal */}
      {showInvoiceModal && selectedInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Detalhes da Factura</h3>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-sm text-gray-600">Número</p>
                <p className="font-medium">{selectedInvoice.number}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                {getStatusBadge(selectedInvoice.status)}
              </div>
              <div>
                <p className="text-sm text-gray-600">Cliente</p>
                <p className="font-medium">{selectedInvoice.clientName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Serviço</p>
                <p className="font-medium">{selectedInvoice.serviceName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Valor</p>
                <p className="font-medium">{selectedInvoice.amount.toLocaleString()} MT</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Data de Emissão</p>
                <p className="font-medium">{formatDate(selectedInvoice.issueDate)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Data de Vencimento</p>
                <p className="font-medium">{formatDate(selectedInvoice.dueDate)}</p>
              </div>
              {selectedInvoice.paidDate && (
                <div>
                  <p className="text-sm text-gray-600">Data de Pagamento</p>
                  <p className="font-medium">{formatDate(selectedInvoice.paidDate)}</p>
                </div>
              )}
              {selectedInvoice.paymentMethod && (
                <div>
                  <p className="text-sm text-gray-600">Método de Pagamento</p>
                  <div className="flex items-center gap-2">
                    {getPaymentMethodIcon(selectedInvoice.paymentMethod)}
                    <span className="font-medium">{getPaymentMethodLabel(selectedInvoice.paymentMethod)}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowInvoiceModal(false)}
                className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Fechar
              </button>
              <button 
                onClick={() => handleDownloadInvoice(selectedInvoice)}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Download PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Receipt Details Modal */}
      {showReceiptModal && selectedReceipt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Detalhes do Recibo</h3>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-sm text-gray-600">Número</p>
                <p className="font-medium">{selectedReceipt.number}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Cliente</p>
                <p className="font-medium">{selectedReceipt.clientName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Serviço</p>
                <p className="font-medium">{selectedReceipt.serviceName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Valor</p>
                <p className="font-medium">{selectedReceipt.amount.toLocaleString()} MT</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Data de Pagamento</p>
                <p className="font-medium">{formatDate(selectedReceipt.paymentDate)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Método de Pagamento</p>
                <div className="flex items-center gap-2">
                  {getPaymentMethodIcon(selectedReceipt.paymentMethod)}
                  <span className="font-medium">{getPaymentMethodLabel(selectedReceipt.paymentMethod)}</span>
                </div>
              </div>
              {selectedReceipt.reference && (
                <div>
                  <p className="text-sm text-gray-600">Referência</p>
                  <p className="font-medium">{selectedReceipt.reference}</p>
                </div>
              )}
              {selectedReceipt.notes && (
                <div className="col-span-2">
                  <p className="text-sm text-gray-600">Observações</p>
                  <p className="font-medium">{selectedReceipt.notes}</p>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowReceiptModal(false)}
                className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Fechar
              </button>
              <button 
                onClick={() => handleDownloadReceipt(selectedReceipt)}
                className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Download PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};