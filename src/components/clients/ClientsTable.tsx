import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, Mail, Phone, MapPin, Calendar, Eye, Users, UserCheck, UserX, Clock, Building, User, Filter, Download, Upload, FileText, Star } from 'lucide-react';
import { Client } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { ClientProfile } from './ClientProfile';
import { Pagination } from '../common/Pagination';

const countryCodes = [
  { code: '+258', country: 'Moçambique', flag: '🇲🇿' },
  { code: '+27', country: 'África do Sul', flag: '🇿🇦' },
  { code: '+55', country: 'Brasil', flag: '🇧🇷' },
  { code: '+351', country: 'Portugal', flag: '🇵🇹' },
  { code: '+244', country: 'Angola', flag: '🇦🇴' },
  { code: '+1', country: 'Estados Unidos', flag: '🇺🇸' },
  { code: '+44', country: 'Reino Unido', flag: '🇬🇧' },
  { code: '+33', country: 'França', flag: '🇫🇷' },
];

const mockClients: Client[] = [
  {
    id: '1',
    companyId: '1',
    companyName: 'Transportes Maputo Lda',
    representative: 'João Macamo',
    email: 'joao@transportesmaputo.mz',
    phone: '84 123 4567',
    phoneCountryCode: '+258',
    nuit: '400567890',
    address: 'Av. Eduardo Mondlane, 567, Maputo',
    anniversary: '03-15',
    salespersonId: '1',
    createdAt: '2024-01-15',
    isActive: true
  },
  {
    id: '2',
    companyId: '1',
    companyName: 'Construções Beira SA',
    representative: 'Maria Santos',
    email: 'maria@construcoesbeira.mz',
    phone: '85 987 6543',
    phoneCountryCode: '+258',
    nuit: '400123789',
    address: 'Rua da Independência, 123, Beira',
    anniversary: '11-22',
    salespersonId: '2',
    createdAt: '2024-01-20',
    isActive: true
  },
  {
    id: '3',
    companyId: '1',
    companyName: 'Farmácia Central',
    representative: 'António Silva',
    email: 'antonio@farmaciacentral.mz',
    phone: '86 555 7777',
    phoneCountryCode: '+258',
    nuit: '400987654',
    address: 'Praça da Independência, 45, Nampula',
    anniversary: '07-08',
    salespersonId: '1',
    createdAt: '2024-02-01',
    isActive: false
  },
  {
    id: '4',
    companyId: '1',
    companyName: 'Hotel Polana',
    representative: 'Carlos Mendes',
    email: 'carlos@hotelpolana.mz',
    phone: '87 444 5555',
    phoneCountryCode: '+258',
    nuit: '400111222',
    address: 'Av. Julius Nyerere, 1380, Maputo',
    anniversary: '05-10',
    salespersonId: '3',
    createdAt: '2024-03-01',
    isActive: true
  },
  {
    id: '5',
    companyId: '1',
    companyName: 'Supermercado Shoprite',
    representative: 'Ana Costa',
    email: 'ana@shoprite.mz',
    phone: '82 333 4444',
    phoneCountryCode: '+258',
    nuit: '400333444',
    address: 'Shopping Maputo, Loja 15',
    anniversary: '12-25',
    salespersonId: '2',
    createdAt: '2024-03-15',
    isActive: true
  }
];

const mockUsers = [
  {
    id: '1',
    name: 'João Silva',
    email: 'joao@techsolutions.mz',
    phone: '+258 84 123 4567',
    role: 'admin'
  },
  {
    id: '2',
    name: 'Maria Santos',
    email: 'maria@techsolutions.mz',
    phone: '+258 85 987 6543',
    role: 'manager'
  },
  {
    id: '3',
    name: 'Carlos Mendes',
    email: 'carlos@techsolutions.mz',
    phone: '+258 86 555 7777',
    role: 'user'
  }
];

interface ClientsTableProps {
  initialFilters?: {
    statusFilter?: 'all' | 'active' | 'inactive';
    salespersonFilter?: string;
    searchTerm?: string;
  };
}

export const ClientsTable: React.FC<ClientsTableProps> = ({ initialFilters }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>(initialFilters?.statusFilter || 'all');
  const [salespersonFilter, setSalespersonFilter] = useState(initialFilters?.salespersonFilter || 'all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showBulkActionsModal, setShowBulkActionsModal] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [clients, setClients] = useState<Client[]>(mockClients);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [sortField, setSortField] = useState<'name' | 'date' | 'salesperson'>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Listen for dashboard navigation filters
  React.useEffect(() => {
    const handleApplyFilters = (event: CustomEvent) => {
      const filters = event.detail;
      if (filters?.statusFilter) {
        setStatusFilter(filters.statusFilter);
      }
      if (filters?.salespersonFilter) {
        setSalespersonFilter(filters.salespersonFilter);
      }
      if (filters?.searchTerm) {
        setSearchTerm(filters.searchTerm);
      }
    };

    window.addEventListener('applyDashboardFilters', handleApplyFilters as EventListener);
    
    return () => {
      window.removeEventListener('applyDashboardFilters', handleApplyFilters as EventListener);
    };
  }, []);

  if (selectedClient) {
    return <ClientProfile client={selectedClient} onBack={() => setSelectedClient(null)} />;
  }

  const getSalespersonName = (salespersonId: string) => {
    const salesperson = mockUsers.find(u => u.id === salespersonId);
    return salesperson ? salesperson.name : 'Não atribuído';
  };

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.representative.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && client.isActive) ||
                         (statusFilter === 'inactive' && !client.isActive);
    
    const matchesSalesperson = salespersonFilter === 'all' || client.salespersonId === salespersonFilter;
    
    return matchesSearch && matchesStatus && matchesSalesperson;
  }).sort((a, b) => {
    let aValue, bValue;
    
    switch (sortField) {
      case 'name':
        aValue = a.companyName.toLowerCase();
        bValue = b.companyName.toLowerCase();
        break;
      case 'date':
        aValue = new Date(a.createdAt).getTime();
        bValue = new Date(b.createdAt).getTime();
        break;
      case 'salesperson':
        aValue = getSalespersonName(a.salespersonId).toLowerCase();
        bValue = getSalespersonName(b.salespersonId).toLowerCase();
        break;
      default:
        return 0;
    }
    
    if (sortDirection === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });

  // Pagination
  const totalPages = Math.ceil(filteredClients.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedClients = filteredClients.slice(startIndex, startIndex + itemsPerPage);

  // Reset to first page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, salespersonFilter]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-PT');
  };

  const formatAnniversary = (anniversary: string) => {
    const [month, day] = anniversary.split('-');
    const date = new Date(2000, parseInt(month) - 1, parseInt(day));
    return date.toLocaleDateString('pt-PT', { day: '2-digit', month: 'long' });
  };

  const getStatusBadge = (isActive: boolean) => {
    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
        isActive
          ? 'bg-green-100 text-green-800'
          : 'bg-red-100 text-red-800'
      }`}>
        {isActive ? 'Ativo' : 'Inativo'}
      </span>
    );
  };

  const handleAddClient = () => {
    setShowAddModal(true);
  };

  const handleEditClient = (client: Client) => {
    setEditingClient(client);
    setShowAddModal(true);
  };

  const handleDeleteClient = (clientId: string) => {
    if (confirm('Tem certeza que deseja eliminar este cliente?')) {
      setClients(clients.filter(c => c.id !== clientId));
      alert('Cliente eliminado com sucesso!');
    }
  };

  const handleBulkDelete = () => {
    if (selectedClients.length === 0) {
      alert('Selecione pelo menos um cliente');
      return;
    }
    
    if (confirm(`Tem certeza que deseja eliminar ${selectedClients.length} cliente(s)?`)) {
      setClients(clients.filter(c => !selectedClients.includes(c.id)));
      setSelectedClients([]);
      setShowBulkActionsModal(false);
      alert(`${selectedClients.length} cliente(s) eliminado(s) com sucesso!`);
    }
  };

  const handleBulkStatusChange = (newStatus: boolean) => {
    if (selectedClients.length === 0) {
      alert('Selecione pelo menos um cliente');
      return;
    }
    
    setClients(clients.map(c => 
      selectedClients.includes(c.id) ? { ...c, isActive: newStatus } : c
    ));
    setSelectedClients([]);
    setShowBulkActionsModal(false);
    alert(`Status de ${selectedClients.length} cliente(s) atualizado!`);
  };

  const handleExportClients = () => {
    const csvContent = [
      ['Nome da Empresa', 'Representante', 'Email', 'Telefone', 'NUIT', 'Endereço', 'Aniversário', 'Gestor', 'Status', 'Data de Criação'].join(','),
      ...filteredClients.map(client => [
        client.companyName,
        client.representative,
        client.email,
        `${client.phoneCountryCode} ${client.phone}`,
        client.nuit,
        client.address,
        formatAnniversary(client.anniversary),
        getSalespersonName(client.salespersonId),
        client.isActive ? 'Ativo' : 'Inativo',
        formatDate(client.createdAt)
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `clientes-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportClients = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const csv = e.target?.result as string;
      const lines = csv.split('\n');
      const headers = lines[0].split(',');
      
      const importedClients: Client[] = [];
      
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',');
        if (values.length >= 6) {
          const newClient: Client = {
            id: Date.now().toString() + i,
            companyId: '1',
            companyName: values[0]?.trim() || '',
            representative: values[1]?.trim() || '',
            email: values[2]?.trim() || '',
            phone: values[3]?.trim() || '',
            phoneCountryCode: '+258',
            nuit: values[4]?.trim() || '',
            address: values[5]?.trim() || '',
            anniversary: '01-01',
            salespersonId: '1',
            createdAt: new Date().toISOString(),
            isActive: true
          };
          importedClients.push(newClient);
        }
      }
      
      setClients([...clients, ...importedClients]);
      setShowImportModal(false);
      alert(`${importedClients.length} cliente(s) importado(s) com sucesso!`);
    };
    
    reader.readAsText(file);
  };

  const handleSaveClient = (clientData: Partial<Client>) => {
    if (editingClient) {
      setClients(clients.map(c => 
        c.id === editingClient.id 
          ? { ...c, ...clientData }
          : c
      ));
      alert('Cliente atualizado com sucesso!');
    } else {
      const newClient: Client = {
        id: Date.now().toString(),
        companyId: '1',
        companyName: clientData.companyName || '',
        representative: clientData.representative || '',
        email: clientData.email || '',
        phone: clientData.phone || '',
        phoneCountryCode: clientData.phoneCountryCode || '+258',
        nuit: clientData.nuit || '',
        address: clientData.address || '',
        anniversary: clientData.anniversary || '',
        salespersonId: clientData.salespersonId || '',
        createdAt: new Date().toISOString(),
        isActive: true
      };
      setClients([...clients, newClient]);
      alert('Cliente adicionado com sucesso!');
    }
    setShowAddModal(false);
    setEditingClient(null);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedClients(filteredClients.map(c => c.id));
    } else {
      setSelectedClients([]);
    }
  };

  const handleSelectClient = (clientId: string, checked: boolean) => {
    if (checked) {
      setSelectedClients([...selectedClients, clientId]);
    } else {
      setSelectedClients(selectedClients.filter(id => id !== clientId));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestão de Clientes</h2>
          <p className="text-gray-600 mt-1">Gerir clientes e acompanhar status dos serviços</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setShowImportModal(true)}
            className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <Upload size={20} />
            Importar
          </button>
          <button 
            onClick={handleExportClients}
            className="border border-blue-600 text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center gap-2"
          >
            <Download size={20} />
            Exportar
          </button>
          <button 
            onClick={handleAddClient}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus size={20} />
            Novo Cliente
          </button>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total de Clientes</p>
              <p className="text-2xl font-bold text-gray-900">{clients.length}</p>
            </div>
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-blue-100 text-blue-600">
              <Users size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Clientes Ativos</p>
              <p className="text-2xl font-bold text-gray-900">
                {clients.filter(c => c.isActive).length}
              </p>
            </div>
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-green-100 text-green-600">
              <UserCheck size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Clientes Inativos</p>
              <p className="text-2xl font-bold text-gray-900">
                {clients.filter(c => !c.isActive).length}
              </p>
            </div>
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-red-100 text-red-600">
              <UserX size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Novos Este Mês</p>
              <p className="text-2xl font-bold text-gray-900">
                {clients.filter(c => {
                  const clientDate = new Date(c.createdAt);
                  const now = new Date();
                  return clientDate.getMonth() === now.getMonth() && 
                         clientDate.getFullYear() === now.getFullYear();
                }).length}
              </p>
            </div>
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-purple-100 text-purple-600">
              <Clock size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Birthday Clients Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Calendar className="text-purple-600" size={20} />
          Aniversariantes do Mês
        </h3>
        
        {(() => {
          const currentMonth = new Date().getMonth() + 1;
          const birthdayClients = clients.filter(client => {
            if (!client.anniversary) return false;
            const [month] = client.anniversary.split('-');
            return parseInt(month) === currentMonth;
          });

          if (birthdayClients.length === 0) {
            return (
              <div className="text-center py-8">
                <Calendar className="text-gray-300 mx-auto mb-3" size={48} />
                <p className="text-gray-500">Nenhum aniversariante este mês</p>
              </div>
            );
          }

          return (
            <div className="space-y-3">
              {birthdayClients.map((client) => {
                const [month, day] = client.anniversary.split('-');
                const birthdayDate = new Date(2024, parseInt(month) - 1, parseInt(day));
                const today = new Date();
                const currentYear = today.getFullYear();
                const thisYearBirthday = new Date(currentYear, parseInt(month) - 1, parseInt(day));
                
                const isToday = today.getDate() === parseInt(day) && today.getMonth() === parseInt(month) - 1;
                const isPast = thisYearBirthday < today;
                const daysUntil = Math.ceil((thisYearBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                
                return (
                  <div 
                    key={client.id} 
                    className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
                      isToday 
                        ? 'bg-yellow-50 border-yellow-300 shadow-md' 
                        : isPast
                        ? 'bg-gray-50 border-gray-200'
                        : 'bg-blue-50 border-blue-200'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        isToday 
                          ? 'bg-yellow-200 text-yellow-800' 
                          : isPast
                          ? 'bg-gray-200 text-gray-600'
                          : 'bg-blue-200 text-blue-800'
                      }`}>
                        <Calendar size={20} />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{client.companyName}</p>
                        <p className="text-sm text-gray-600">{client.representative}</p>
                        <p className="text-xs text-gray-500">{client.email}</p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className={`text-lg font-bold ${
                        isToday 
                          ? 'text-yellow-800' 
                          : isPast
                          ? 'text-gray-600'
                          : 'text-blue-800'
                      }`}>
                        {parseInt(day)}/{parseInt(month)}
                      </div>
                      <div className={`text-xs font-medium ${
                        isToday 
                          ? 'text-yellow-700' 
                          : isPast
                          ? 'text-gray-500'
                          : 'text-blue-700'
                      }`}>
                        {isToday 
                          ? '🎉 HOJE!' 
                          : isPast
                          ? 'Já passou'
                          : `Em ${daysUntil} dias`
                        }
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex gap-1 mt-2">
                        <button
                          onClick={() => {
                            const message = `Parabéns pelo aniversário da empresa ${client.companyName}! 🎉`;
                            alert(`Mensagem de parabéns enviada para ${client.email}:\n\n"${message}"`);
                          }}
                          className={`text-xs px-2 py-1 rounded transition-colors ${
                            isToday || !isPast
                              ? 'bg-green-100 text-green-700 hover:bg-green-200'
                              : 'bg-gray-100 text-gray-500 cursor-not-allowed'
                          }`}
                          disabled={isPast && !isToday}
                          title="Enviar parabéns"
                        >
                          🎉 Parabéns
                        </button>
                        <button
                          onClick={() => setSelectedClient(client)}
                          className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
                          title="Ver perfil"
                        >
                          Ver Perfil
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
              
              {/* Summary */}
              <div className="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Star className="text-purple-600" size={16} />
                    <span className="text-sm font-medium text-purple-900">
                      {birthdayClients.length} aniversariante{birthdayClients.length !== 1 ? 's' : ''} este mês
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      const birthdayEmails = birthdayClients.map(c => c.email).join(', ');
                      alert(`Enviando parabéns em lote para:\n\n${birthdayEmails}\n\n✅ Mensagens enviadas com sucesso!`);
                    }}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-purple-700 transition-colors flex items-center gap-2"
                  >
                    <Mail size={14} />
                    Enviar Parabéns em Lote
                  </button>
                </div>
              </div>
            </div>
          );
        })()}
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Pesquisar clientes..."
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
            <option value="active">Ativos</option>
            <option value="inactive">Inativos</option>
          </select>
          <select
            value={salespersonFilter}
            onChange={(e) => setSalespersonFilter(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Todos os Gestores</option>
            {mockUsers.map((user) => (
              <option key={user.id} value={user.id}>{user.name}</option>
            ))}
          </select>
          <select
            value={`${sortField}-${sortDirection}`}
            onChange={(e) => {
              const [field, direction] = e.target.value.split('-');
              setSortField(field as any);
              setSortDirection(direction as any);
            }}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="name-asc">Nome A-Z</option>
            <option value="name-desc">Nome Z-A</option>
            <option value="date-desc">Mais Recentes</option>
            <option value="date-asc">Mais Antigos</option>
            <option value="salesperson-asc">Gestor A-Z</option>
          </select>
        </div>
        
        {selectedClients.length > 0 && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-800">
                {selectedClients.length} cliente(s) selecionado(s)
              </span>
              <button
                onClick={() => setShowBulkActionsModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors"
              >
                Ações em Lote
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedClients.length === filteredClients.length && filteredClients.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Representante
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contacto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Gestor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedClients.map((client) => (
                <tr key={client.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedClients.includes(client.id)}
                      onChange={(e) => handleSelectClient(client.id, e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{client.companyName}</div>
                      <div className="text-sm text-gray-500">NUIT: {client.nuit}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm text-gray-900">{client.representative}</div>
                      <div className="text-sm text-gray-500 flex items-center gap-1">
                        <Calendar size={12} />
                        {formatAnniversary(client.anniversary)}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm space-y-1">
                      <div className="flex items-center gap-2 text-gray-900">
                        <Mail size={12} />
                        {client.email}
                      </div>
                      <div className="flex items-center gap-2 text-gray-500">
                        <Phone size={12} />
                        {client.phoneCountryCode} {client.phone}
                      </div>
                      <div className="flex items-center gap-2 text-gray-500">
                        <MapPin size={12} />
                        <span className="truncate max-w-[200px]">{client.address}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {getSalespersonName(client.salespersonId)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(client.isActive)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setSelectedClient(client)}
                        className="text-green-600 hover:text-green-900 p-1 hover:bg-green-50 rounded"
                        title="Ver perfil"
                      >
                        <Eye size={16} />
                      </button>
                      <button 
                        onClick={() => handleEditClient(client)}
                        className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded"
                        title="Editar"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => handleDeleteClient(client.id)}
                        className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded"
                        title="Eliminar"
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
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={filteredClients.length}
          itemsPerPage={itemsPerPage}
        />
      </div>

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Importar Clientes</h3>
            <p className="text-gray-600 mb-4">
              Faça upload de um arquivo CSV com os dados dos clientes.
            </p>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Arquivo CSV
              </label>
              <input
                type="file"
                accept=".csv"
                onChange={handleImportClients}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <h4 className="font-medium text-blue-900 mb-2">Formato do CSV:</h4>
              <p className="text-sm text-blue-800">
                Nome da Empresa, Representante, Email, Telefone, NUIT, Endereço
              </p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowImportModal(false)}
                className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Actions Modal */}
      {showBulkActionsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Ações em Lote</h3>
            <p className="text-gray-600 mb-6">
              {selectedClients.length} cliente(s) selecionado(s)
            </p>
            
            <div className="space-y-3">
              <button
                onClick={() => handleBulkStatusChange(true)}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
              >
                <UserCheck size={16} />
                Ativar Todos
              </button>
              <button
                onClick={() => handleBulkStatusChange(false)}
                className="w-full bg-orange-600 text-white py-3 px-4 rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center gap-2"
              >
                <UserX size={16} />
                Desativar Todos
              </button>
              <button
                onClick={handleBulkDelete}
                className="w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
              >
                <Trash2 size={16} />
                Eliminar Todos
              </button>
              <button
                onClick={() => setShowBulkActionsModal(false)}
                className="w-full border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Client Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-4xl w-full mx-4 max-h-[95vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {editingClient ? 'Editar Cliente' : 'Novo Cliente'}
            </h3>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              
              const anniversaryDay = formData.get('anniversaryDay') as string;
              const anniversaryMonth = formData.get('anniversaryMonth') as string;
              const anniversaryValue = anniversaryDay && anniversaryMonth ? 
                `${anniversaryMonth}-${anniversaryDay}` : '';
              
              const clientData = {
                companyName: formData.get('companyName') as string,
                representative: formData.get('representative') as string,
                email: formData.get('email') as string,
                phone: formData.get('phone') as string,
                phoneCountryCode: formData.get('phoneCountryCode') as string,
                nuit: formData.get('nuit') as string,
                address: formData.get('address') as string,
                anniversary: anniversaryValue,
                salespersonId: formData.get('salespersonId') as string,
              };
              handleSaveClient(clientData);
            }} className="space-y-6">
              {/* Informações da Empresa */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Building size={18} className="text-blue-600" />
                  Informações da Empresa
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nome da Empresa *
                    </label>
                    <input
                      type="text"
                      name="companyName"
                      defaultValue={editingClient?.companyName || ''}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ex: Transportes Maputo Lda"
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
                      defaultValue={editingClient?.nuit || ''}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ex: 400123456"
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
                      defaultValue={editingClient?.address || ''}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ex: Av. Eduardo Mondlane, 567, Maputo"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Informações do Representante */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <User size={18} className="text-green-600" />
                  Representante da Empresa
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nome do Representante *
                    </label>
                    <input
                      type="text"
                      name="representative"
                      defaultValue={editingClient?.representative || ''}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ex: João Macamo"
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
                      defaultValue={editingClient?.email || ''}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ex: joao@transportesmaputo.mz"
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
                        defaultValue={editingClient?.phoneCountryCode || '+258'}
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
                        defaultValue={editingClient?.phone || ''}
                        placeholder="84 123 4567"
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Informações Adicionais */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Calendar size={18} className="text-purple-600" />
                  Informações Adicionais
                </h4>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Data de Aniversário
                  </label>
                  <div className="flex gap-3 max-w-md">
                    <select
                      name="anniversaryDay"
                      defaultValue={editingClient?.anniversary ? 
                        editingClient.anniversary.split('-')[1] : ''}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Dia</option>
                      {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                        <option key={day} value={day.toString().padStart(2, '0')}>
                          {day}
                        </option>
                      ))}
                    </select>
                    <select
                      name="anniversaryMonth"
                      defaultValue={editingClient?.anniversary ? 
                        editingClient.anniversary.split('-')[0] : ''}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Mês</option>
                      <option value="01">Janeiro</option>
                      <option value="02">Fevereiro</option>
                      <option value="03">Março</option>
                      <option value="04">Abril</option>
                      <option value="05">Maio</option>
                      <option value="06">Junho</option>
                      <option value="07">Julho</option>
                      <option value="08">Agosto</option>
                      <option value="09">Setembro</option>
                      <option value="10">Outubro</option>
                      <option value="11">Novembro</option>
                      <option value="12">Dezembro</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Gestão */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Users size={18} className="text-orange-600" />
                  Gestão da Conta
                </h4>
                <div className="max-w-md">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gestor/Vendedor Responsável *
                  </label>
                  <select
                    name="salespersonId"
                    defaultValue={editingClient?.salespersonId || ''}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Selecionar gestor</option>
                    {mockUsers.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name} - {user.role === 'admin' ? 'Administrador' : user.role === 'manager' ? 'Gestor' : 'Vendedor'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="flex gap-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingClient(null);
                  }}
                  className="flex-1 border border-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  {editingClient ? 'Atualizar' : 'Adicionar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};