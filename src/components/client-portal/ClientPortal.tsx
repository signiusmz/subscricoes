import React, { useState } from 'react';
import { FileText, CreditCard, Calendar, Download, Eye, RefreshCw, Star, User, LogOut, Edit, Camera, Upload, Save, X, Receipt, FileCheck } from 'lucide-react';
import { PDFGenerator, ClientInfo } from '../../utils/pdfGenerator';
import { useAuth } from '../../context/AuthContext';

interface Invoice {
  id: string;
  number: string;
  date: string;
  dueDate: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  serviceId: string;
  serviceName: string;
}

interface Contract {
  id: string;
  serviceName: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'expired';
  autoRenew: boolean;
  price: number;
}

const mockInvoices: Invoice[] = [
  {
    id: '1',
    number: 'INV-2024-001',
    date: '2024-03-01',
    dueDate: '2024-03-31',
    amount: 5000,
    status: 'paid',
    serviceId: '1',
    serviceName: 'Contabilidade Mensal'
  },
  {
    id: '2',
    number: 'INV-2024-002',
    date: '2024-04-01',
    dueDate: '2024-04-30',
    amount: 5000,
    status: 'pending',
    serviceId: '1',
    serviceName: 'Contabilidade Mensal'
  }
];

const mockContracts: Contract[] = [
  {
    id: '1',
    serviceName: 'Contabilidade Mensal',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    status: 'active',
    autoRenew: true,
    price: 5000
  }
];

const mockReceipts = [
  {
    id: '1',
    number: 'REC-2024-001',
    invoiceId: '1',
    date: '2024-01-25',
    amount: 5000,
    paymentMethod: 'transfer',
    serviceName: 'Contabilidade Mensal'
  },
  {
    id: '2',
    number: 'REC-2024-002',
    invoiceId: '2',
    date: '2024-02-20',
    amount: 5000,
    paymentMethod: 'mpesa',
    serviceName: 'Contabilidade Mensal'
  }
];

const mockContract = {
  id: '1',
  number: 'CONT-2024-001',
  serviceName: 'Contabilidade Mensal',
  startDate: '2024-01-01',
  endDate: '2024-12-31',
  price: 5000,
  terms: `
    <h3>CONTRATO DE PRESTAÇÃO DE SERVIÇOS DE CONTABILIDADE</h3>
    
    <p><strong>CONTRATANTE:</strong> Transportes Maputo Lda</p>
    <p><strong>CONTRATADA:</strong> TechSolutions Lda</p>
    
    <h4>CLÁUSULA 1ª - OBJETO</h4>
    <p>O presente contrato tem por objeto a prestação de serviços de contabilidade mensal, incluindo:</p>
    <ul>
      <li>Escrituração contábil completa</li>
      <li>Elaboração de demonstrações financeiras</li>
      <li>Assessoria fiscal e tributária</li>
      <li>Cumprimento de obrigações acessórias</li>
    </ul>
    
    <h4>CLÁUSULA 2ª - PRAZO</h4>
    <p>O contrato vigorará pelo período de 12 (doze) meses, de 01 de Janeiro de 2024 a 31 de Dezembro de 2024, renovável automaticamente por igual período.</p>
    
    <h4>CLÁUSULA 3ª - VALOR E FORMA DE PAGAMENTO</h4>
    <p>O valor mensal dos serviços é de 5.000,00 MT (cinco mil meticais), a ser pago até o dia 30 de cada mês.</p>
    
    <h4>CLÁUSULA 4ª - OBRIGAÇÕES DAS PARTES</h4>
    <p><strong>CONTRATANTE:</strong></p>
    <ul>
      <li>Fornecer documentação necessária até o dia 15 de cada mês</li>
      <li>Efetuar pagamentos nas datas acordadas</li>
      <li>Manter documentação organizada</li>
    </ul>
    
    <p><strong>CONTRATADA:</strong></p>
    <ul>
      <li>Prestar serviços com qualidade e pontualidade</li>
      <li>Manter sigilo das informações</li>
      <li>Cumprir prazos legais</li>
    </ul>
  `
};

export const ClientPortal: React.FC = () => {
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showNPSModal, setShowNPSModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showContractModal, setShowContractModal] = useState(false);
  const [npsScore, setNpsScore] = useState(0);
  const [npsComment, setNpsComment] = useState('');
  const [clientData, setClientData] = useState({
    companyName: 'Transportes Maputo Lda',
    representative: 'João Macamo',
    email: 'joao@transportesmaputo.mz',
    phone: '84 123 4567',
    phoneCountryCode: '+258',
    nuit: '400567890',
    address: 'Av. Eduardo Mondlane, 567, Maputo',
    profilePhoto: null as string | null
  });
  const [tempProfilePhoto, setTempProfilePhoto] = useState<string | null>(null);

  const countryCodes = [
    { code: '+258', country: 'Moçambique', flag: '🇲🇿' },
    { code: '+27', country: 'África do Sul', flag: '🇿🇦' },
    { code: '+55', country: 'Brasil', flag: '🇧🇷' },
    { code: '+351', country: 'Portugal', flag: '🇵🇹' },
    { code: '+244', country: 'Angola', flag: '🇦🇴' }
  ];

  const salesperson = {
    name: 'Maria Silva',
    email: 'maria.silva@signius.com',
    phone: '+258 84 123 4567'
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-PT');
  };

  const getStatusBadge = (status: string, type: 'invoice' | 'contract' = 'invoice') => {
    if (type === 'invoice') {
      const statusConfig = {
        paid: { bg: 'bg-green-100', text: 'text-green-800', label: 'Paga' },
        pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pendente' },
        overdue: { bg: 'bg-red-100', text: 'text-red-800', label: 'Em Atraso' }
      };
      const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
      return (
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${config.bg} ${config.text}`}>
          {config.label}
        </span>
      );
    } else {
      const statusConfig = {
        active: { bg: 'bg-green-100', text: 'text-green-800', label: 'Ativo' },
        expired: { bg: 'bg-red-100', text: 'text-red-800', label: 'Expirado' }
      };
      const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.active;
      return (
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${config.bg} ${config.text}`}>
          {config.label}
        </span>
      );
    }
  };

  const handleNPSSubmit = () => {
    // Submit NPS feedback
    console.log('NPS Score:', npsScore, 'Comment:', npsComment);
    setShowNPSModal(false);
    setNpsScore(0);
    setNpsComment('');
    alert('Obrigado pelo seu feedback!');
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert('A imagem deve ter no máximo 5MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setTempProfilePhoto(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    
    const updatedData = {
      companyName: formData.get('companyName') as string,
      representative: formData.get('representative') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      phoneCountryCode: formData.get('phoneCountryCode') as string,
      nuit: formData.get('nuit') as string,
      address: formData.get('address') as string,
      profilePhoto: tempProfilePhoto || clientData.profilePhoto
    };
    
    const password = formData.get('password') as string;
    
    setClientData(updatedData);
    setShowProfileModal(false);
    setTempProfilePhoto(null);
    
    if (password) {
      alert('Perfil e senha atualizados com sucesso!');
    } else {
      alert('Perfil atualizado com sucesso!');
    }
  };

  const handleGenerateStatement = () => {
    const clientInfoForPDF: ClientInfo = {
      companyName: clientData.companyName,
      representative: clientData.representative,
      email: clientData.email,
      phone: '+258 84 567 890',
      nuit: clientData.nuit,
      address: 'Av. Eduardo Mondlane, 567, Maputo'
    };
    
    PDFGenerator.generateClientStatement(clientInfoForPDF, mockInvoices);
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-3 rounded-lg">
              <FileText className="text-blue-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Serviços Ativos</p>
              <p className="text-2xl font-bold text-gray-900">
                {mockContracts.filter(c => c.status === 'active').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-3 rounded-lg">
              <CreditCard className="text-green-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Faturas Pagas</p>
              <p className="text-2xl font-bold text-gray-900">
                {mockInvoices.filter(i => i.status === 'paid').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="bg-yellow-100 p-3 rounded-lg">
              <Calendar className="text-yellow-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Faturas Pendentes</p>
              <p className="text-2xl font-bold text-gray-900">
                {mockInvoices.filter(i => i.status === 'pending').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button 
            onClick={() => setActiveTab('invoices')}
            className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-left"
          >
            <FileText className="text-blue-600 mb-2" size={24} />
            <p className="font-medium text-gray-900">Ver Faturas</p>
            <p className="text-sm text-gray-600">Consultar faturas emitidas</p>
          </button>
          
          <button 
            onClick={() => setActiveTab('contracts')}
            className="p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors text-left"
          >
            <FileText className="text-green-600 mb-2" size={24} />
            <p className="font-medium text-gray-900">Meus Contratos</p>
            <p className="text-sm text-gray-600">Ver contratos ativos</p>
          </button>
          
          <button 
            onClick={handleGenerateStatement}
            className="p-4 border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-colors text-left"
          >
            <FileText className="text-indigo-600 mb-2" size={24} />
            <p className="font-medium text-gray-900">Gerar Extrato</p>
            <p className="text-sm text-gray-600">Baixar extrato da conta</p>
          </button>
        </div>
      </div>
    </div>
  );

  const renderInvoices = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Minhas Faturas</h3>
        <div className="flex gap-3">
          <button 
            onClick={handleGenerateStatement}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <FileText size={16} />
            Gerar Extrato
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Número</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Serviço</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vencimento</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Valor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {mockInvoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{invoice.number}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{invoice.serviceName}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{formatDate(invoice.date)}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{formatDate(invoice.dueDate)}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{invoice.amount.toLocaleString()} MT</td>
                  <td className="px-6 py-4">{getStatusBadge(invoice.status, 'invoice')}</td>
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

  const renderContracts = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Meus Contratos</h3>
      </div>

      <div className="grid gap-6">
        {mockContracts.map((contract) => (
          <div key={contract.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="text-lg font-semibold text-gray-900">{contract.serviceName}</h4>
                <p className="text-gray-600">Período: {formatDate(contract.startDate)} - {formatDate(contract.endDate)}</p>
              </div>
              <div className="text-right">
                {getStatusBadge(contract.status, 'contract')}
                {contract.autoRenew && (
                  <div className="mt-2">
                    <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                      Renovação Automática
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-600">Valor Mensal</p>
                <p className="text-lg font-semibold text-gray-900">{contract.price.toLocaleString()} MT</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Próxima Renovação</p>
                <p className="text-lg font-semibold text-gray-900">{formatDate(contract.endDate)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Dias Restantes</p>
                <p className="text-lg font-semibold text-gray-900">
                  {Math.ceil((new Date(contract.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                <RefreshCw size={16} />
                Renovar Agora
              </button>
              <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
                <FileText size={16} />
                Ver Contrato
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderDocuments = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Meus Documentos</h3>
      </div>

      {/* Contract Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <FileCheck className="text-blue-600" size={20} />
          Contrato de Serviços
        </h4>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-blue-900">{mockContract.serviceName}</p>
              <p className="text-sm text-blue-700">
                Contrato: {mockContract.number} • 
                Vigência: {formatDate(mockContract.startDate)} - {formatDate(mockContract.endDate)}
              </p>
              <p className="text-sm text-blue-700">
                Valor: {mockContract.price.toLocaleString()} MT/mês
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowContractModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Eye size={16} />
                Ver Contrato
              </button>
              <button
                onClick={() => {
                  // Generate contract PDF
                  alert('Download do contrato iniciado!');
                }}
                className="border border-blue-600 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-2"
              >
                <Download size={16} />
                Download
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Invoices Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <FileText className="text-green-600" size={20} />
          Faturas
        </h4>
        
        <div className="space-y-3">
          {mockInvoices.map((invoice) => (
            <div key={invoice.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">{invoice.number}</p>
                <p className="text-sm text-gray-600">{invoice.serviceName}</p>
                <p className="text-sm text-gray-500">
                  Emitida: {formatDate(invoice.date)} • Vencimento: {formatDate(invoice.dueDate)}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="font-medium text-gray-900">{invoice.amount.toLocaleString()} MT</p>
                  {getStatusBadge(invoice.status, 'invoice')}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      // Generate and view invoice PDF
                      const clientInfoForPDF: ClientInfo = {
                        companyName: clientData.companyName,
                        representative: clientData.representative,
                        email: clientData.email,
                        phone: `${clientData.phoneCountryCode} ${clientData.phone}`,
                        nuit: clientData.nuit,
                        address: clientData.address
                      };
                      
                      const invoiceData = {
                        number: invoice.number,
                        date: invoice.date,
                        dueDate: invoice.dueDate,
                        clientInfo: clientInfoForPDF,
                        serviceName: invoice.serviceName,
                        serviceDescription: 'Descrição detalhada do serviço prestado',
                        amount: invoice.amount,
                        paidAmount: invoice.status === 'paid' ? invoice.amount : undefined,
                        status: invoice.status,
                        paymentMethod: invoice.status === 'paid' ? 'transfer' : undefined,
                        paidDate: invoice.status === 'paid' ? invoice.date : undefined,
                        notes: 'Obrigado pela sua preferência!'
                      };
                      
                      // Create a temporary window to show PDF
                      const pdfWindow = window.open('', '_blank');
                      if (pdfWindow) {
                        pdfWindow.document.write(`
                          <html>
                            <head>
                              <title>Fatura ${invoice.number}</title>
                              <style>
                                body { font-family: Arial, sans-serif; margin: 20px; }
                                .header { border-bottom: 2px solid #3b82f6; padding-bottom: 20px; margin-bottom: 20px; }
                                .company-info { display: flex; justify-content: space-between; margin-bottom: 20px; }
                                .invoice-details { background: #f3f4f6; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
                                .client-info { margin-bottom: 20px; }
                                .service-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
                                .service-table th, .service-table td { border: 1px solid #d1d5db; padding: 10px; text-align: left; }
                                .service-table th { background: #3b82f6; color: white; }
                                .total-section { text-align: right; margin-top: 20px; }
                                .status-paid { color: #059669; font-weight: bold; }
                                .status-pending { color: #d97706; font-weight: bold; }
                                @media print { body { margin: 0; } }
                              </style>
                            </head>
                            <body>
                              <div class="header">
                                <div class="company-info">
                                  <div>
                                    <h1>TechSolutions Lda</h1>
                                    <p>Av. Julius Nyerere, 123, Maputo</p>
                                    <p>Tel: +258 21 123 456 | Email: info@techsolutions.mz</p>
                                    <p>NUIT: 400123456</p>
                                  </div>
                                  <div>
                                    <h2 style="color: #3b82f6;">FATURA</h2>
                                  </div>
                                </div>
                              </div>
                              
                              <div class="invoice-details">
                                <h3>Detalhes da Fatura</h3>
                                <p><strong>Número:</strong> ${invoice.number}</p>
                                <p><strong>Data de Emissão:</strong> ${new Date(invoice.date).toLocaleDateString('pt-PT')}</p>
                                <p><strong>Data de Vencimento:</strong> ${new Date(invoice.dueDate).toLocaleDateString('pt-PT')}</p>
                                <p><strong>Status:</strong> <span class="status-${invoice.status}">${invoice.status === 'paid' ? 'PAGA' : 'PENDENTE'}</span></p>
                              </div>
                              
                              <div class="client-info">
                                <h3>Dados do Cliente</h3>
                                <p><strong>Empresa:</strong> ${clientData.companyName}</p>
                                <p><strong>Representante:</strong> ${clientData.representative}</p>
                                <p><strong>Email:</strong> ${clientData.email}</p>
                                <p><strong>Telefone:</strong> ${clientData.phoneCountryCode} ${clientData.phone}</p>
                                <p><strong>NUIT:</strong> ${clientData.nuit}</p>
                                <p><strong>Endereço:</strong> ${clientData.address}</p>
                              </div>
                              
                              <table class="service-table">
                                <thead>
                                  <tr>
                                    <th>Descrição do Serviço</th>
                                    <th>Valor</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <td>
                                      <strong>${invoice.serviceName}</strong><br>
                                      Descrição detalhada do serviço prestado
                                    </td>
                                    <td><strong>${invoice.amount.toLocaleString()} MT</strong></td>
                                  </tr>
                                </tbody>
                              </table>
                              
                              <div class="total-section">
                                <p><strong>TOTAL: ${invoice.amount.toLocaleString()} MT</strong></p>
                                ${invoice.status === 'paid' ? `<p class="status-paid">✓ FATURA QUITADA</p>` : `<p class="status-pending">⚠ PAGAMENTO PENDENTE</p>`}
                              </div>
                              
                              <div style="margin-top: 30px; text-align: center; color: #6b7280;">
                                <p>Obrigado pela sua preferência!</p>
                                <p>Documento gerado em ${new Date().toLocaleDateString('pt-PT')}</p>
                              </div>
                              
                              <script>
                                window.onload = function() {
                                  window.print();
                                }
                              </script>
                            </body>
                          </html>
                        `);
                        pdfWindow.document.close();
                      }
                    }}
                    className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded"
                    title="Visualizar"
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    onClick={() => {
                      // Download invoice PDF
                      const clientInfoForPDF: ClientInfo = {
                        companyName: clientData.companyName,
                        representative: clientData.representative,
                        email: clientData.email,
                        phone: `${clientData.phoneCountryCode} ${clientData.phone}`,
                        nuit: clientData.nuit,
                        address: clientData.address
                      };
                      
                      const invoiceData = {
                        number: invoice.number,
                        date: invoice.date,
                        dueDate: invoice.dueDate,
                        clientInfo: clientInfoForPDF,
                        serviceName: invoice.serviceName,
                        serviceDescription: 'Descrição detalhada do serviço prestado',
                        amount: invoice.amount,
                        paidAmount: invoice.status === 'paid' ? invoice.amount : undefined,
                        status: invoice.status,
                        paymentMethod: invoice.status === 'paid' ? 'transfer' : undefined,
                        paidDate: invoice.status === 'paid' ? invoice.date : undefined,
                        notes: 'Obrigado pela sua preferência!'
                      };
                      
                      PDFGenerator.generateInvoice(invoiceData);
                    }}
                    className="text-green-600 hover:text-green-900 p-1 hover:bg-green-50 rounded"
                    title="Download"
                  >
                    <Download size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Receipts Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Receipt className="text-purple-600" size={20} />
          Recibos de Pagamento
        </h4>
        
        <div className="space-y-3">
          {mockReceipts.map((receipt) => (
            <div key={receipt.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">{receipt.number}</p>
                <p className="text-sm text-gray-600">{receipt.serviceName}</p>
                <p className="text-sm text-gray-500">
                  Pagamento: {formatDate(receipt.date)} • Método: {receipt.paymentMethod === 'transfer' ? 'Transferência' : 'M-Pesa'}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="font-medium text-gray-900">{receipt.amount.toLocaleString()} MT</p>
                  <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                    Pago
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      // View receipt in new window
                      const receiptWindow = window.open('', '_blank');
                      if (receiptWindow) {
                        receiptWindow.document.write(`
                          <html>
                            <head>
                              <title>Recibo ${receipt.number}</title>
                              <style>
                                body { font-family: Arial, sans-serif; margin: 20px; }
                                .header { border-bottom: 2px solid #059669; padding-bottom: 20px; margin-bottom: 20px; }
                                .company-info { display: flex; justify-content: space-between; margin-bottom: 20px; }
                                .receipt-details { background: #f0fdf4; padding: 15px; border-radius: 8px; margin-bottom: 20px; border: 1px solid #059669; }
                                .client-info { margin-bottom: 20px; }
                                .payment-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
                                .payment-table th, .payment-table td { border: 1px solid #d1d5db; padding: 10px; text-align: left; }
                                .payment-table th { background: #059669; color: white; }
                                .confirmation { background: #f0fdf4; border: 2px solid #059669; padding: 20px; text-align: center; border-radius: 8px; margin-top: 20px; }
                                @media print { body { margin: 0; } }
                              </style>
                            </head>
                            <body>
                              <div class="header">
                                <div class="company-info">
                                  <div>
                                    <h1>TechSolutions Lda</h1>
                                    <p>Av. Julius Nyerere, 123, Maputo</p>
                                    <p>Tel: +258 21 123 456 | Email: info@techsolutions.mz</p>
                                    <p>NUIT: 400123456</p>
                                  </div>
                                  <div>
                                    <h2 style="color: #059669;">RECIBO</h2>
                                  </div>
                                </div>
                              </div>
                              
                              <div class="receipt-details">
                                <h3>Detalhes do Recibo</h3>
                                <p><strong>Número:</strong> ${receipt.number}</p>
                                <p><strong>Data de Pagamento:</strong> ${new Date(receipt.date).toLocaleDateString('pt-PT')}</p>
                                <p><strong>Método de Pagamento:</strong> ${receipt.paymentMethod === 'transfer' ? 'Transferência' : 'M-Pesa'}</p>
                              </div>
                              
                              <div class="client-info">
                                <h3>Dados do Cliente</h3>
                                <p><strong>Empresa:</strong> ${clientData.companyName}</p>
                                <p><strong>Representante:</strong> ${clientData.representative}</p>
                                <p><strong>Email:</strong> ${clientData.email}</p>
                                <p><strong>NUIT:</strong> ${clientData.nuit}</p>
                              </div>
                              
                              <table class="payment-table">
                                <thead>
                                  <tr>
                                    <th>Serviço</th>
                                    <th>Valor Pago</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <td><strong>${receipt.serviceName}</strong></td>
                                    <td><strong>${receipt.amount.toLocaleString()} MT</strong></td>
                                  </tr>
                                </tbody>
                              </table>
                              
                              <div class="confirmation">
                                <h3 style="color: #059669; margin: 0;">✓ PAGAMENTO CONFIRMADO</h3>
                                <p style="margin: 10px 0 0 0;">Valor de ${receipt.amount.toLocaleString()} MT recebido com sucesso</p>
                              </div>
                              
                              <div style="margin-top: 30px; text-align: center; color: #6b7280;">
                                <p>Obrigado pela sua preferência!</p>
                                <p>Documento gerado em ${new Date().toLocaleDateString('pt-PT')}</p>
                              </div>
                              
                              <script>
                                window.onload = function() {
                                  window.print();
                                }
                              </script>
                            </body>
                          </html>
                        `);
                        receiptWindow.document.close();
                      }
                    }}
                    className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded"
                    title="Visualizar"
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    onClick={() => {
                      // Download receipt PDF
                      const clientInfoForPDF: ClientInfo = {
                        companyName: clientData.companyName,
                        representative: clientData.representative,
                        email: clientData.email,
                        phone: `${clientData.phoneCountryCode} ${clientData.phone}`,
                        nuit: clientData.nuit,
                        address: clientData.address
                      };
                      
                      const receiptData = {
                        number: receipt.number,
                        date: receipt.date,
                        clientInfo: clientInfoForPDF,
                        invoiceNumber: `INV-${receipt.id}`,
                        serviceName: receipt.serviceName,
                        amount: receipt.amount,
                        paymentMethod: receipt.paymentMethod === 'transfer' ? 'Transferência' : 'M-Pesa',
                        reference: `REF-${receipt.number}`,
                        notes: 'Pagamento processado com sucesso!'
                      };
                      
                      PDFGenerator.generateReceipt(receiptData);
                    }}
                    className="text-green-600 hover:text-green-900 p-1 hover:bg-green-50 rounded"
                    title="Download"
                  >
                    <Download size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: FileText },
    { id: 'contracts', label: 'Contratos', icon: FileText },
    { id: 'documents', label: 'Documentos', icon: FileCheck }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-16 h-12 flex items-center justify-center">
                <img 
                  src="https://cdn.signius.pl/wp-content/uploads/2022/09/signius_logo_rgb.svg" 
                  alt="Signius Logo" 
                  className="w-14 h-10 object-contain"
                />
              </div>
              <div>
                <h1 className="font-semibold text-gray-900">{clientData.companyName}</h1>
                <p className="text-xs text-gray-500">Portal do Cliente - Signius</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center bg-blue-500">
                  {clientData.profilePhoto ? (
                    <img 
                      src={clientData.profilePhoto} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User size={16} className="text-white" />
                  )}
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{clientData.representative}</p>
                  <p className="text-xs text-gray-500">{clientData.email}</p>
                </div>
              </div>
              <button 
                onClick={() => setShowProfileModal(true)}
                className="text-gray-600 hover:text-blue-600 p-2 hover:bg-blue-50 rounded-lg transition-colors"
                title="Editar Perfil"
              >
                <Edit size={20} />
              </button>
              <button 
                onClick={() => setShowNPSModal(true)}
                className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2 text-sm font-medium"
              >
                <Star size={16} />
                Avaliar Serviço
              </button>
              <button 
                onClick={logout}
                className="text-gray-600 hover:text-red-600 p-2 hover:bg-red-50 rounded-lg transition-colors"
                title="Sair do Portal"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Salesperson Info */}
      {salesperson && (
        <div className="bg-blue-50 border-b border-blue-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-4">
                <span className="text-blue-800 font-medium">Seu Gestor:</span>
                <span className="text-blue-700">{salesperson.name}</span>
                <span className="text-blue-600">📧 {salesperson.email}</span>
                <span className="text-blue-600">📞 {salesperson.phone}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation */}
        <div className="mb-8">
          <nav className="flex space-x-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon size={18} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'contracts' && renderContracts()}
        {activeTab === 'documents' && renderDocuments()}
      </div>

      {/* NPS Modal */}
      {showNPSModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Avalie nosso serviço</h3>
            <p className="text-gray-600 mb-6">De 0 a 10, qual a probabilidade de recomendar nossos serviços?</p>
            
            <div className="flex justify-between mb-6">
              {[...Array(11)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setNpsScore(i)}
                  className={`w-8 h-8 rounded-full border-2 font-medium transition-colors ${
                    npsScore === i
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'border-gray-300 text-gray-700 hover:border-blue-300'
                  }`}
                >
                  {i}
                </button>
              ))}
            </div>
            
            <textarea
              value={npsComment}
              onChange={(e) => setNpsComment(e.target.value)}
              placeholder="Comentários adicionais (opcional)"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-6"
              rows={3}
            />
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowNPSModal(false)}
                className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleNPSSubmit}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Enviar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Profile Edit Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Edit size={20} className="text-blue-600" />
                Editar Perfil
              </h3>
              <button
                onClick={() => {
                  setShowProfileModal(false);
                  setTempProfilePhoto(null);
                }}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSaveProfile} className="space-y-6">
              
              {/* Profile Photo Section */}
              <div className="text-center">
                <div className="relative inline-block">
                  <div className="w-24 h-24 rounded-full overflow-hidden mx-auto bg-gray-200 flex items-center justify-center">
                    {(tempProfilePhoto || clientData.profilePhoto) ? (
                      <img 
                        src={tempProfilePhoto || clientData.profilePhoto || ''} 
                        alt="Profile Preview" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User size={32} className="text-gray-400" />
                    )}
                  </div>
                  <div className="absolute -bottom-2 -right-2">
                    <label className="bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors inline-flex">
                      <Camera size={16} />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
                <div className="mt-3 flex justify-center gap-2">
                  <label className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors flex items-center gap-1">
                    <Upload size={14} />
                    Carregar Foto
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </label>
                  {(tempProfilePhoto || clientData.profilePhoto) && (
                    <button
                      type="button"
                      onClick={() => {
                        setTempProfilePhoto(null);
                        setClientData({...clientData, profilePhoto: null});
                      }}
                      className="text-sm bg-red-100 text-red-700 px-3 py-1 rounded-lg hover:bg-red-200 transition-colors"
                    >
                      Remover
                    </button>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Formatos aceites: JPG, PNG, GIF (máx. 5MB)
                </p>
              </div>

              {/* Company Information */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <User size={18} className="text-blue-600" />
                  Informações da Empresa
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nome da Empresa *
                    </label>
                    <input
                      type="text"
                      name="companyName"
                      defaultValue={clientData.companyName}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      NUIT *
                    </label>
                    <input
                      type="text"
                      name="nuit"
                      defaultValue={clientData.nuit}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Endereço *
                    </label>
                    <input
                      type="text"
                      name="address"
                      defaultValue={clientData.address}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <User size={18} className="text-green-600" />
                  Dados do Representante
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nome do Representante *
                    </label>
                    <input
                      type="text"
                      name="representative"
                      defaultValue={clientData.representative}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      defaultValue={clientData.email}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Telefone *
                    </label>
                    <div className="flex gap-3">
                      <select
                        name="phoneCountryCode"
                        defaultValue={clientData.phoneCountryCode}
                        className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[140px]"
                      >
                        {countryCodes.map((country) => (
                          <option key={country.code} value={country.code}>
                            {country.flag} {country.code}
                          </option>
                        ))}
                      </select>
                      <input
                        type="text"
                        name="phone"
                        defaultValue={clientData.phone}
                        placeholder="84 123 4567"
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Security */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <User size={18} className="text-purple-600" />
                  Segurança
                </h4>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nova Senha (opcional)
                  </label>
                  <input
                    type="password"
                    name="password"
                    placeholder="Deixe em branco para manter a atual"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Mínimo 8 caracteres. Deixe em branco se não quiser alterar.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowProfileModal(false);
                    setTempProfilePhoto(null);
                  }}
                  className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Save size={16} />
                  Salvar Alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Contract Modal */}
      {showContractModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <FileCheck size={20} className="text-blue-600" />
                Contrato de Serviços
              </h3>
              <button
                onClick={() => setShowContractModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X size={20} />
              </button>
            </div>
            
            {/* Contract Header */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-blue-700"><strong>Número:</strong> {mockContract.number}</p>
                  <p className="text-blue-700"><strong>Serviço:</strong> {mockContract.serviceName}</p>
                </div>
                <div>
                  <p className="text-blue-700"><strong>Vigência:</strong> {formatDate(mockContract.startDate)} - {formatDate(mockContract.endDate)}</p>
                  <p className="text-blue-700"><strong>Valor:</strong> {mockContract.price.toLocaleString()} MT/mês</p>
                </div>
              </div>
            </div>
            
            {/* Contract Content */}
            <div className="prose max-w-none">
              <div 
                className="text-sm text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: mockContract.terms }}
              />
            </div>
            
            <div className="flex gap-3 pt-6 border-t border-gray-200 mt-6">
              <button
                onClick={() => setShowContractModal(false)}
                className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Fechar
              </button>
              <button
                onClick={() => {
                  // Download contract PDF
                  const contractWindow = window.open('', '_blank');
                  if (contractWindow) {
                    contractWindow.document.write(`
                      <html>
                        <head>
                          <title>Contrato ${mockContract.number}</title>
                          <style>
                            body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
                            .header { border-bottom: 2px solid #3b82f6; padding-bottom: 20px; margin-bottom: 30px; text-align: center; }
                            .contract-info { background: #f3f4f6; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
                            .contract-content { margin-bottom: 30px; }
                            .contract-content h3 { color: #1f2937; margin-top: 25px; margin-bottom: 10px; }
                            .contract-content h4 { color: #374151; margin-top: 20px; margin-bottom: 8px; }
                            .contract-content ul { margin-left: 20px; }
                            .contract-content li { margin-bottom: 5px; }
                            .signatures { display: flex; justify-content: space-between; margin-top: 50px; padding-top: 30px; border-top: 1px solid #d1d5db; }
                            .signature-box { text-align: center; width: 200px; }
                            .signature-line { border-top: 1px solid #000; margin-top: 50px; padding-top: 5px; }
                            @media print { body { margin: 0; } }
                          </style>
                        </head>
                        <body>
                          <div class="header">
                            <h1>TechSolutions Lda</h1>
                            <p>Av. Julius Nyerere, 123, Maputo | Tel: +258 21 123 456</p>
                            <h2 style="color: #3b82f6; margin-top: 20px;">CONTRATO DE PRESTAÇÃO DE SERVIÇOS</h2>
                          </div>
                          
                          <div class="contract-info">
                            <p><strong>Número do Contrato:</strong> ${mockContract.number}</p>
                            <p><strong>Serviço:</strong> ${mockContract.serviceName}</p>
                            <p><strong>Vigência:</strong> ${new Date(mockContract.startDate).toLocaleDateString('pt-PT')} - ${new Date(mockContract.endDate).toLocaleDateString('pt-PT')}</p>
                            <p><strong>Valor Mensal:</strong> ${mockContract.price.toLocaleString()} MT</p>
                          </div>
                          
                          <div class="contract-content">
                            ${mockContract.terms}
                          </div>
                          
                          <div class="signatures">
                            <div class="signature-box">
                              <div class="signature-line">
                                <strong>CONTRATANTE</strong><br>
                                ${clientData.companyName}<br>
                                ${clientData.representative}
                              </div>
                            </div>
                            <div class="signature-box">
                              <div class="signature-line">
                                <strong>CONTRATADA</strong><br>
                                TechSolutions Lda<br>
                                Diretor Geral
                              </div>
                            </div>
                          </div>
                          
                          <script>
                            window.onload = function() {
                              window.print();
                            }
                          </script>
                        </body>
                      </html>
                    `);
                    contractWindow.document.close();
                  }
                }}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <Download size={16} />
                Download PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};