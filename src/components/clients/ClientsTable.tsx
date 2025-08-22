import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, Mail, Phone, MapPin, Calendar, Eye, Users, UserCheck, UserX, Clock, Building, User } from 'lucide-react';
import { Client } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { ClientProfile } from './ClientProfile';

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

export const ClientsTable: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [clients, setClients] = useState<Client[]>(mockClients);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  if (selectedClient) {
    return <ClientProfile client={selectedClient} onBack={() => setSelectedClient(null)} />;
  }

  const getSalespersonName = (salespersonId: string) => {
    const salesperson = mockUsers.find(u => u.id === salespersonId);
    return salesperson ? salesperson.name : 'Não atribuído';
  };

  const filteredClients = mockClients.filter(client =>
    client.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.representative.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  const handleSaveClient = (clientData: Partial<Client>) => {
    if (editingClient) {
      // Update existing client
      setClients(clients.map(c => 
        c.id === editingClient.id 
          ? { ...c, ...clientData }
          : c
      ));
      alert('Cliente atualizado com sucesso!');
    } else {
      // Add new client
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestão de Clientes</h2>
          <p className="text-gray-600 mt-1">Gerir clientes e acompanhar status dos serviços</p>
        </div>
        <button 
          onClick={handleAddClient}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus size={20} />
          Novo Cliente
        </button>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total de Clientes</p>
              <p className="text-2xl font-bold text-gray-900">{mockClients.length}</p>
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
                {mockClients.filter(c => c.isActive).length}
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
                {mockClients.filter(c => !c.isActive).length}
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
                {mockClients.filter(c => {
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

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Pesquisar clientes..."
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
              {filteredClients.map((client) => (
                <tr key={client.id} className="hover:bg-gray-50 transition-colors">
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
      </div>

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
              
              // Handle anniversary format conversion
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