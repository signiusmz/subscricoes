import React, { useState } from 'react';
import { FileText, CreditCard, Calendar, Download, Eye, RefreshCw, Star, User, LogOut, Bell, Settings, MessageSquare, Phone, Mail, MapPin, Building, Clock, CheckCircle, AlertCircle, DollarSign, Send, Edit, Save, X } from 'lucide-react';
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

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'renewal';
  date: string;
  read: boolean;
}

interface SupportTicket {
  id: string;
  subject: string;
  message: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: string;
  updatedAt: string;
  responses: TicketResponse[];
}

interface TicketResponse {
  id: string;
  message: string;
  author: string;
  authorType: 'client' | 'support';
  createdAt: string;
}

interface PaymentMethod {
  id: string;
  type: 'mpesa' | 'bank_transfer' | 'cash';
  details: string;
  isDefault: boolean;
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

const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'Renovação Próxima',
    message: 'Seu serviço de Contabilidade Mensal expira em 15 dias',
    type: 'warning',
    date: '2024-04-15',
    read: false
  },
  {
    id: '2',
    title: 'Pagamento Confirmado',
    message: 'Pagamento da fatura INV-2024-001 foi confirmado',
    type: 'success',
    date: '2024-04-10',
    read: true
  },
  {
    id: '3',
    title: 'Nova Funcionalidade',
    message: 'Portal do cliente foi atualizado com novas funcionalidades',
    type: 'info',
    date: '2024-04-05',
    read: false
  }
];

const mockSupportTickets: SupportTicket[] = [
  {
    id: '1',
    subject: 'Dúvida sobre renovação de contrato',
    message: 'Gostaria de saber como funciona o processo de renovação automática.',
    status: 'resolved',
    priority: 'medium',
    createdAt: '2024-04-01',
    updatedAt: '2024-04-02',
    responses: [
      {
        id: '1',
        message: 'Gostaria de saber como funciona o processo de renovação automática.',
        author: 'João Macamo',
        authorType: 'client',
        createdAt: '2024-04-01'
      },
      {
        id: '2',
        message: 'Olá João! A renovação automática funciona da seguinte forma: 30 dias antes do vencimento, enviamos um lembrete. Se não houver cancelamento, o serviço é renovado automaticamente.',
        author: 'Maria Silva',
        authorType: 'support',
        createdAt: '2024-04-02'
      }
    ]
  },
  {
    id: '2',
    subject: 'Problema com acesso ao sistema',
    message: 'Não consigo acessar o portal desde ontem.',
    status: 'open',
    priority: 'high',
    createdAt: '2024-04-14',
    updatedAt: '2024-04-14',
    responses: [
      {
        id: '3',
        message: 'Não consigo acessar o portal desde ontem.',
        author: 'João Macamo',
        authorType: 'client',
        createdAt: '2024-04-14'
      }
    ]
  }
];

const mockPaymentMethods: PaymentMethod[] = [
  {
    id: '1',
    type: 'mpesa',
    details: '+258 84 567 890',
    isDefault: true
  },
  {
    id: '2',
    type: 'bank_transfer',
    details: 'Banco BCI - Conta: 123456789',
    isDefault: false
  }
];

export const ClientPortal: React.FC = () => {
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showNPSModal, setShowNPSModal] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>(mockSupportTickets);

  // Initialize clientInfo at the top level
  const clientInfo = {
    companyName: 'Transportes Maputo Lda',
    representative: 'João Macamo',
    email: 'joao@transportesmaputo.mz',
    phone: '+258 84 123 4567',
    nuit: '400567890',
    address: 'Av. Eduardo Mondlane, 567, Maputo',
    clientSince: '2024-01-15',
    plan: 'Profissional',
    nextPayment: '2024-05-01'
  };
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(mockPaymentMethods);
  const [npsScore, setNpsScore] = useState(0);
  const [npsComment, setNpsComment] = useState('');
  const [profileData, setProfileData] = useState({
    companyName: clientInfo.companyName,
    representative: clientInfo.representative,
    email: clientInfo.email,
    phone: '+258 84 567 890',
    address: 'Av. Eduardo Mondlane, 567, Maputo'
  });

    email: 'maria.silva@signius.com',
    phone: '+258 84 123 4567'
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-PT');
  };

  const handleNPSSubmit = () => {
    // Submit NPS feedback
    console.log('NPS Score:', npsScore, 'Comment:', npsComment);
    setShowNPSModal(false);
    setNpsScore(0);
    setNpsComment('');
    alert('Obrigado pelo seu feedback!');
  };

  const handleGenerateStatement = () => {
    const clientInfoForPDF: ClientInfo = {
      companyName: clientInfo.companyName,
      representative: clientInfo.representative,
      email: clientInfo.email,
      phone: '+258 84 567 890',
      nuit: clientInfo.nuit,
      address: 'Av. Eduardo Mondlane, 567, Maputo'
    };
    
    PDFGenerator.generateClientStatement(clientInfoForPDF, mockInvoices);
  };

  const markNotificationAsRead = (notificationId: string) => {
    setNotifications(notifications.map(n => 
      n.id === notificationId ? { ...n, read: true } : n
    ));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertCircle className="text-orange-500" size={20} />;
      case 'success':
        return <CheckCircle className="text-green-500" size={20} />;
      case 'renewal':
        return <RefreshCw className="text-blue-500" size={20} />;
      default:
        return <Bell className="text-blue-500" size={20} />;
    }
  };

  const getStatusBadge = (status: string, type: 'invoice' | 'contract' | 'ticket' = 'invoice') => {
    if (type === 'ticket') {
      const statusConfig = {
        open: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Aberto' },
        in_progress: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Em Andamento' },
        resolved: { bg: 'bg-green-100', text: 'text-green-800', label: 'Resolvido' },
        closed: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Fechado' }
      };
      const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.open;
      return (
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${config.bg} ${config.text}`}>
          {config.label}
        </span>
      );
    }
    
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

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      low: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Baixa' },
      medium: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Média' },
      high: { bg: 'bg-orange-100', text: 'text-orange-800', label: 'Alta' },
      urgent: { bg: 'bg-red-100', text: 'text-red-800', label: 'Urgente' }
    };
    const config = priorityConfig[priority as keyof typeof priorityConfig] || priorityConfig.medium;
    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const handleCreateSupportTicket = (ticketData: any) => {
    const newTicket: SupportTicket = {
      id: Date.now().toString(),
      subject: ticketData.subject,
      message: ticketData.message,
      status: 'open',
      priority: ticketData.priority,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      responses: [{
        id: Date.now().toString(),
        message: ticketData.message,
        author: clientInfo.representative,
        authorType: 'client',
        createdAt: new Date().toISOString()
      }]
    };
    
    setSupportTickets([newTicket, ...supportTickets]);
    setShowSupportModal(false);
    alert('Ticket de suporte criado com sucesso! Nossa equipe entrará em contato em breve.');
  };

  const handleAddTicketResponse = (ticketId: string, message: string) => {
    const newResponse: TicketResponse = {
      id: Date.now().toString(),
      message,
      author: clientInfo.representative,
      authorType: 'client',
      createdAt: new Date().toISOString()
    };
    
    setSupportTickets(supportTickets.map(ticket => 
      ticket.id === ticketId 
        ? { 
            ...ticket, 
            responses: [...ticket.responses, newResponse],
            updatedAt: new Date().toISOString()
          }
        : ticket
    ));
    
    alert('Resposta adicionada com sucesso!');
  };

  const handleUpdateProfile = (newProfileData: any) => {
    setProfileData(newProfileData);
    setShowProfileModal(false);
    alert('Perfil atualizado com sucesso!');
  };

  const handlePayInvoice = (invoice: Invoice) => {
    // Simulate payment processing
    alert(`Processando pagamento da fatura ${invoice.number} no valor de ${invoice.amount.toLocaleString()} MT via M-Pesa...`);
    
    // Simulate successful payment after 2 seconds
    setTimeout(() => {
      alert('Pagamento processado com sucesso! Fatura quitada.');
    }, 2000);
  };

  const unreadNotifications = notifications.filter(n => !n.read).length;

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Notifications Section */}
      {unreadNotifications > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-blue-900 flex items-center gap-2">
              <Bell className="text-blue-600" size={20} />
              Notificações ({unreadNotifications} não lidas)
            </h3>
            <button
              onClick={markAllNotificationsAsRead}
              className="text-sm text-blue-600 hover:text-blue-800 underline"
            >
              Marcar todas como lidas
            </button>
          </div>
          <div className="space-y-3">
            {notifications.filter(n => !n.read).slice(0, 3).map((notification) => (
              <div 
                key={notification.id}
                className="flex items-start gap-3 p-3 bg-white rounded-lg border border-blue-200 cursor-pointer hover:bg-blue-50 transition-colors"
                onClick={() => markNotificationAsRead(notification.id)}
              >
                {getNotificationIcon(notification.type)}
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{notification.title}</p>
                  <p className="text-sm text-gray-600">{notification.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{formatDate(notification.date)}</p>
                </div>
              </div>
            ))}
            {unreadNotifications > 3 && (
              <button
                onClick={() => setActiveTab('notifications')}
                className="text-sm text-blue-600 hover:text-blue-800 underline"
              >
                Ver todas as {unreadNotifications} notificações
              </button>
            )}
          </div>
        </div>
      )}

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
          
          <button 
            onClick={() => setShowPaymentModal(true)}
            className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors text-left"
          >
            <CreditCard className="text-purple-600 mb-2" size={24} />
            <p className="font-medium text-gray-900">Pagamentos</p>
            <p className="text-sm text-gray-600">Efetuar pagamentos</p>
          </button>
          
          <button 
            onClick={() => setShowSupportModal(true)}
            className="p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors text-left"
          >
            <MessageSquare className="text-green-600 mb-2" size={24} />
            <p className="font-medium text-gray-900">Suporte</p>
            <p className="text-sm text-gray-600">Abrir ticket de suporte</p>
          </button>
          
          <button 
            onClick={() => setShowProfileModal(true)}
            className="p-4 border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-colors text-left"
          >
            <User className="text-indigo-600 mb-2" size={24} />
            <p className="font-medium text-gray-900">Meu Perfil</p>
            <p className="text-sm text-gray-600">Atualizar dados</p>
          </button>
          
          <button 
            onClick={() => setShowNPSModal(true)}
            className="p-4 border border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-colors text-left"
          >
            <Star className="text-orange-600 mb-2" size={24} />
            <p className="font-medium text-gray-900">Avaliar Serviço</p>
            <p className="text-sm text-gray-600">Dar feedback</p>
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
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            <Download size={16} />
            Exportar
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
                      {invoice.status === 'pending' && (
                        <button className="text-purple-600 hover:text-purple-900 p-1 hover:bg-purple-50 rounded">
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

  const renderNotifications = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Notificações</h3>
        <button
          onClick={markAllNotificationsAsRead}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Marcar Todas como Lidas
        </button>
      </div>

      <div className="space-y-3">
        {notifications.map((notification) => (
          <div 
            key={notification.id}
            className={`p-4 rounded-lg border transition-colors cursor-pointer ${
              notification.read 
                ? 'bg-gray-50 border-gray-200' 
                : 'bg-white border-blue-200 shadow-sm'
            }`}
            onClick={() => markNotificationAsRead(notification.id)}
          >
            <div className="flex items-start gap-3">
              {getNotificationIcon(notification.type)}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className={`font-medium ${notification.read ? 'text-gray-700' : 'text-gray-900'}`}>
                    {notification.title}
                  </h4>
                  <span className="text-xs text-gray-500">{formatDate(notification.date)}</span>
                </div>
                <p className={`text-sm ${notification.read ? 'text-gray-600' : 'text-gray-700'}`}>
                  {notification.message}
                </p>
                {!notification.read && (
                  <div className="mt-2">
                    <span className="inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSupport = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Suporte ao Cliente</h3>
        <button
          onClick={() => setShowSupportModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus size={16} />
          Novo Ticket
        </button>
      </div>

      {/* Contact Info */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Informações de Contato</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Phone className="text-blue-600" size={20} />
              <div>
                <p className="text-sm text-gray-600">Telefone</p>
                <p className="font-medium text-gray-900">{salesperson.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="text-blue-600" size={20} />
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium text-gray-900">{salesperson.email}</p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <User className="text-blue-600" size={20} />
              <div>
                <p className="text-sm text-gray-600">Seu Gestor</p>
                <p className="font-medium text-gray-900">{salesperson.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="text-blue-600" size={20} />
              <div>
                <p className="text-sm text-gray-600">Horário de Atendimento</p>
                <p className="font-medium text-gray-900">08:00 - 17:00 (Segunda a Sexta)</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Support Tickets */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Meus Tickets</h4>
        <div className="space-y-4">
          {supportTickets.map((ticket) => (
            <div 
              key={ticket.id}
              className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer"
              onClick={() => setSelectedTicket(ticket)}
            >
              <div className="flex items-start justify-between mb-2">
                <h5 className="font-medium text-gray-900">{ticket.subject}</h5>
                <div className="flex gap-2">
                  {getStatusBadge(ticket.status, 'ticket')}
                  {getPriorityBadge(ticket.priority)}
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-2">{ticket.message.substring(0, 100)}...</p>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Criado em {formatDate(ticket.createdAt)}</span>
                <span>{ticket.responses.length} resposta(s)</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPayments = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Métodos de Pagamento</h3>
      
      {/* Payment Methods */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Métodos Salvos</h4>
        <div className="space-y-3">
          {paymentMethods.map((method) => (
            <div key={method.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-3">
                {method.type === 'mpesa' && <Smartphone className="text-green-600" size={20} />}
                {method.type === 'bank_transfer' && <CreditCard className="text-blue-600" size={20} />}
                {method.type === 'cash' && <DollarSign className="text-gray-600" size={20} />}
                <div>
                  <p className="font-medium text-gray-900">
                    {method.type === 'mpesa' ? 'M-Pesa' : 
                     method.type === 'bank_transfer' ? 'Transferência Bancária' : 'Dinheiro'}
                  </p>
                  <p className="text-sm text-gray-600">{method.details}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {method.isDefault && (
                  <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                    Padrão
                  </span>
                )}
                <button className="text-blue-600 hover:text-blue-800 p-1">
                  <Edit size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pending Invoices */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Faturas Pendentes</h4>
        <div className="space-y-3">
          {mockInvoices.filter(inv => inv.status === 'pending').map((invoice) => (
            <div key={invoice.id} className="flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">{invoice.number}</p>
                <p className="text-sm text-gray-600">{invoice.serviceName}</p>
                <p className="text-xs text-gray-500">Vencimento: {formatDate(invoice.dueDate)}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-gray-900">{invoice.amount.toLocaleString()} MT</p>
                <button
                  onClick={() => handlePayInvoice(invoice)}
                  className="mt-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  <CreditCard size={14} />
                  Pagar Agora
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Meu Perfil</h3>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-6 mb-6">
          <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center">
            <Building className="text-white" size={32} />
          </div>
          <div>
            <h4 className="text-xl font-bold text-gray-900">{profileData.companyName}</h4>
            <p className="text-gray-600">{profileData.representative}</p>
            <p className="text-sm text-gray-500">Cliente desde {formatDate('2024-01-15')}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <User className="text-gray-400" size={20} />
              <div>
                <p className="text-sm text-gray-600">Representante</p>
                <p className="font-medium text-gray-900">{profileData.representative}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="text-gray-400" size={20} />
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium text-gray-900">{profileData.email}</p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Phone className="text-gray-400" size={20} />
              <div>
                <p className="text-sm text-gray-600">Telefone</p>
                <p className="font-medium text-gray-900">{profileData.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="text-gray-400" size={20} />
              <div>
                <p className="text-sm text-gray-600">Endereço</p>
                <p className="font-medium text-gray-900">{profileData.address}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <button
            onClick={() => setShowProfileModal(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Edit size={16} />
            Editar Perfil
          </button>
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

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: FileText },
    { id: 'invoices', label: 'Faturas', icon: CreditCard },
    { id: 'contracts', label: 'Contratos', icon: FileText },
    { id: 'notifications', label: 'Notificações', icon: Bell },
    { id: 'support', label: 'Suporte', icon: MessageSquare },
    { id: 'payments', label: 'Pagamentos', icon: CreditCard },
    { id: 'profile', label: 'Perfil', icon: User }
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
                <h1 className="font-semibold text-gray-900">{clientInfo.companyName}</h1>
                <p className="text-xs text-gray-500">Portal do Cliente - Signius</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{clientInfo.representative}</p>
                <p className="text-xs text-gray-500">{clientInfo.email}</p>
              </div>
              <div className="relative">
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Notificações"
                >
                  <Bell size={20} />
                  {unreadNotifications > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {unreadNotifications}
                    </span>
                  )}
                </button>
                
                {/* Notifications Dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 top-12 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <div className="p-4 border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-gray-900">Notificações</h4>
                        <button
                          onClick={() => setShowNotifications(false)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {notifications.slice(0, 5).map((notification) => (
                        <div 
                          key={notification.id}
                          className={`p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                            !notification.read ? 'bg-blue-50' : ''
                          }`}
                          onClick={() => {
                            markNotificationAsRead(notification.id);
                            setShowNotifications(false);
                          }}
                        >
                          <div className="flex items-start gap-2">
                            {getNotificationIcon(notification.type)}
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                              <p className="text-xs text-gray-600">{notification.message.substring(0, 60)}...</p>
                              <p className="text-xs text-gray-500 mt-1">{formatDate(notification.date)}</p>
                            </div>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full mt-1"></div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="p-3 border-t border-gray-200">
                      <button
                        onClick={() => {
                          setActiveTab('notifications');
                          setShowNotifications(false);
                        }}
                        className="w-full text-center text-sm text-blue-600 hover:text-blue-800"
                      >
                        Ver todas as notificações
                      </button>
                    </div>
                  </div>
                )}
              </div>
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
        {activeTab === 'invoices' && renderInvoices()}
        {activeTab === 'contracts' && renderContracts()}
        {activeTab === 'notifications' && renderNotifications()}
        {activeTab === 'support' && renderSupport()}
        {activeTab === 'payments' && renderPayments()}
        {activeTab === 'profile' && renderProfile()}
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

      {/* Support Ticket Modal */}
      {showSupportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Novo Ticket de Suporte</h3>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const ticketData = {
                subject: formData.get('subject') as string,
                message: formData.get('message') as string,
                priority: formData.get('priority') as string
              };
              handleCreateSupportTicket(ticketData);
            }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assunto *
                </label>
                <input
                  type="text"
                  name="subject"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Descreva brevemente o problema"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prioridade *
                </label>
                <select
                  name="priority"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="low">Baixa</option>
                  <option value="medium">Média</option>
                  <option value="high">Alta</option>
                  <option value="urgent">Urgente</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descrição *
                </label>
                <textarea
                  name="message"
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Descreva detalhadamente o problema ou dúvida"
                  required
                />
              </div>
              
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowSupportModal(false)}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Criar Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Support Ticket Details Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Ticket #{selectedTicket.id}</h3>
              <button
                onClick={() => setSelectedTicket(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-gray-900">{selectedTicket.subject}</h4>
                <div className="flex gap-2">
                  {getStatusBadge(selectedTicket.status, 'ticket')}
                  {getPriorityBadge(selectedTicket.priority)}
                </div>
              </div>
              <p className="text-sm text-gray-600">
                Criado em {formatDate(selectedTicket.createdAt)} • 
                Atualizado em {formatDate(selectedTicket.updatedAt)}
              </p>
            </div>

            {/* Conversation */}
            <div className="space-y-4 mb-6">
              {selectedTicket.responses.map((response) => (
                <div 
                  key={response.id}
                  className={`p-4 rounded-lg ${
                    response.authorType === 'client' 
                      ? 'bg-blue-50 border border-blue-200 ml-8' 
                      : 'bg-green-50 border border-green-200 mr-8'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">{response.author}</span>
                    <span className="text-xs text-gray-500">{formatDate(response.createdAt)}</span>
                  </div>
                  <p className="text-sm text-gray-700">{response.message}</p>
                </div>
              ))}
            </div>

            {/* Add Response */}
            {selectedTicket.status !== 'closed' && (
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const message = formData.get('message') as string;
                handleAddTicketResponse(selectedTicket.id, message);
                (e.target as HTMLFormElement).reset();
              }} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Adicionar Resposta
                  </label>
                  <textarea
                    name="message"
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Digite sua resposta..."
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <Send size={16} />
                  Enviar Resposta
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Métodos de Pagamento</h3>
            
            <div className="space-y-4">
              <div className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">M-Pesa</h4>
                <p className="text-sm text-gray-600 mb-3">Pague diretamente com M-Pesa</p>
                <button className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors">
                  Pagar com M-Pesa
                </button>
              </div>
              
              <div className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Transferência Bancária</h4>
                <p className="text-sm text-gray-600 mb-3">Dados bancários para transferência</p>
                <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Ver Dados Bancários
                </button>
              </div>
            </div>
            
            <div className="mt-6">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="w-full border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Profile Edit Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Editar Perfil</h3>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const newProfileData = {
                companyName: formData.get('companyName') as string,
                representative: formData.get('representative') as string,
                email: formData.get('email') as string,
                phone: formData.get('phone') as string,
                address: formData.get('address') as string
              };
              handleUpdateProfile(newProfileData);
            }} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome da Empresa
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    defaultValue={profileData.companyName}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Representante
                  </label>
                  <input
                    type="text"
                    name="representative"
                    defaultValue={profileData.representative}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    defaultValue={profileData.email}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Telefone
                  </label>
                  <input
                    type="text"
                    name="phone"
                    defaultValue={profileData.phone}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Endereço
                </label>
                <input
                  type="text"
                  name="address"
                  defaultValue={profileData.address}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowProfileModal(false)}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Save size={16} />
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};