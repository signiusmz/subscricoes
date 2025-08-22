import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, Calendar, Clock, DollarSign, GitBranch, FileText, Settings } from 'lucide-react';
import { Service } from '../../types';
import { FlowsManagement } from './FlowsManagement';
import { TriggersManagement } from './TriggersManagement';

const mockServices: Service[] = [
  {
    id: '1',
    companyId: '1',
    clientId: '1',
    name: 'Contabilidade Mensal',
    description: 'Serviço completo de contabilidade mensal',
    price: 5000,
    validity: 12,
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    status: 'active',
    autoRenew: true
  },
  {
    id: '2',
    companyId: '1',
    clientId: '2',
    name: 'Auditoria Anual',
    description: 'Auditoria externa das contas anuais',
    price: 15000,
    validity: 12,
    startDate: '2024-02-01',
    endDate: '2025-01-31',
    status: 'active',
    autoRenew: false
  },
  {
    id: '3',
    companyId: '1',
    clientId: '3',
    name: 'Consultoria Fiscal',
    description: 'Consultoria em questões fiscais e tributárias',
    price: 3000,
    validity: 6,
    startDate: '2023-08-01',
    endDate: '2024-01-31',
    status: 'expired',
    autoRenew: false
  }
];

export const ServicesTable: React.FC = () => {
  const [activeTab, setActiveTab] = useState('services');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'expiring' | 'expired'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [services, setServices] = useState<Service[]>(mockServices);

  const filteredServices = mockServices.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (statusFilter === 'all') return matchesSearch;
    return matchesSearch && service.status === statusFilter;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-PT');
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { bg: 'bg-green-100', text: 'text-green-800', label: 'Ativo' },
      expiring: { bg: 'bg-orange-100', text: 'text-orange-800', label: 'A Expirar' },
      expired: { bg: 'bg-red-100', text: 'text-red-800', label: 'Expirado' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.active;
    
    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const getDaysUntilExpiry = (endDate: string) => {
    const today = new Date();
    const expiry = new Date(endDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleAddService = () => {
    setShowAddModal(true);
  };

  const handleEditService = (service: Service) => {
    setEditingService(service);
    setShowAddModal(true);
  };

  const handleDeleteService = (serviceId: string) => {
    if (confirm('Tem certeza que deseja eliminar este serviço?')) {
      setServices(services.filter(s => s.id !== serviceId));
      alert('Serviço eliminado com sucesso!');
    }
  };

  const handleSaveService = (serviceData: Partial<Service>) => {
    if (editingService) {
      // Update existing service
      setServices(services.map(s => 
        s.id === editingService.id 
          ? { ...s, ...serviceData }
          : s
      ));
      alert('Serviço atualizado com sucesso!');
    } else {
      // Add new service
      const newService: Service = {
        id: Date.now().toString(),
        companyId: '1',
        name: serviceData.name || '',
        description: serviceData.description || '',
        price: serviceData.price || 0,
        validity: serviceData.validity || 1,
        status: 'active',
        autoRenew: serviceData.autoRenew || false
      };
      setServices([...services, newService]);
      alert('Serviço adicionado com sucesso!');
    }
    setShowAddModal(false);
    setEditingService(null);
  };

  const tabs = [
    { id: 'services', label: 'Serviços', icon: Calendar },
    { id: 'flows', label: 'Fluxos', icon: GitBranch },
    { id: 'triggers', label: 'Gatilhos', icon: Clock }
  ];

  const renderServicesContent = () => (
    <>
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Gestão de Serviços</h2>
        <button 
          onClick={handleAddService}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus size={20} />
          Novo Serviço
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Pesquisar serviços..."
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
          <option value="expiring">A Expirar</option>
          <option value="expired">Expirados</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Serviço
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Preço
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Validade
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Renovação
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
              {filteredServices.map((service) => {
                
                return (
                  <tr key={service.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{service.name}</div>
                        <div className="text-sm text-gray-500">{service.description}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center gap-1">
                        <DollarSign size={12} />
                        {service.price.toLocaleString()} MT
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center gap-1">
                        <Clock size={12} />
                        {service.validity} meses
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {service.autoRenew ? (
                        <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                          Automática
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">
                          Manual
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(service.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleEditService(service)}
                          className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => handleDeleteService(service.id)}
                          className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Service Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-3xl w-full mx-4 max-h-[95vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {editingService ? 'Editar Serviço' : 'Novo Serviço'}
            </h3>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const serviceData = {
                name: formData.get('name') as string,
                description: formData.get('description') as string,
                price: Number(formData.get('price')),
                validity: Number(formData.get('validity')) as 1 | 3 | 6 | 12,
                autoRenew: formData.get('autoRenew') === 'on',
              };
              handleSaveService(serviceData);
            }} className="space-y-6">
              {/* Informações Básicas */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText size={18} className="text-blue-600" />
                  Informações do Serviço
                </h4>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome do Serviço *
                  </label>
                  <input
                    type="text"
                    name="name"
                    defaultValue={editingService?.name || ''}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ex: Contabilidade Mensal"
                    required
                  />
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descrição *
                  </label>
                  <textarea
                    name="description"
                    defaultValue={editingService?.description || ''}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Descreva detalhadamente o serviço oferecido..."
                    required
                  />
                </div>
              </div>

              {/* Preço e Validade */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <DollarSign size={18} className="text-green-600" />
                  Preço e Validade
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preço (MT) *
                    </label>
                    <input
                      type="number"
                      name="price"
                      defaultValue={editingService?.price || ''}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ex: 5000"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Período de Validade *
                    </label>
                    <select
                      name="validity"
                      defaultValue={editingService?.validity || 12}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value={1}>1 mês (Mensal)</option>
                      <option value={3}>3 meses (Trimestral)</option>
                      <option value={6}>6 meses (Semestral)</option>
                      <option value={12}>12 meses (Anual)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Configurações */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Settings size={18} className="text-purple-600" />
                  Configurações do Serviço
                </h4>
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    name="autoRenew"
                    id="autoRenew"
                    defaultChecked={editingService?.autoRenew || false}
                    className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-0.5"
                  />
                  <div>
                    <label htmlFor="autoRenew" className="block text-sm font-medium text-gray-900">
                      Renovação Automática
                    </label>
                    <p className="text-sm text-gray-600 mt-1">
                      Quando ativado, o serviço será renovado automaticamente no vencimento
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingService(null);
                  }}
                  className="flex-1 border border-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  {editingService ? 'Atualizar' : 'Adicionar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );

  return (
    <div className="space-y-6">
      {/* Header with Tabs */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Gestão de Serviços</h2>
        
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
      {activeTab === 'services' && renderServicesContent()}
      {activeTab === 'flows' && <FlowsManagement />}
      {activeTab === 'triggers' && <TriggersManagement />}
    </div>
  );
};