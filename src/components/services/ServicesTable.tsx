import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, DollarSign, Calendar, CheckCircle, AlertCircle, Eye, Filter, Download, Percent, FileText, Clock } from 'lucide-react';
import { Service } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { Pagination } from '../common/Pagination';

const mockServices: Service[] = [
  {
    id: '1',
    companyId: '1',
    name: 'Serviço Básico',
    description: 'Descrição do serviço básico oferecido pela empresa',
    price: 1000,
    ivaType: 'additional',
    ivaAmount: 160,
    totalPrice: 1160,
    validity: 1,
    status: 'active',
    autoRenew: true,
    createdAt: '2024-01-15'
  },
  {
    id: '2',
    companyId: '1',
    name: 'Serviço Premium',
    description: 'Serviço premium com funcionalidades avançadas',
    price: 5000,
    ivaType: 'additional',
    ivaAmount: 800,
    totalPrice: 5800,
    validity: 12,
    status: 'active',
    autoRenew: false,
    createdAt: '2024-01-20'
  },
  {
    id: '3',
    companyId: '1',
    name: 'Consultoria Fiscal',
    description: 'Consultoria especializada em questões fiscais e tributárias',
    price: 8000,
    ivaType: 'included',
    ivaAmount: 1103.45,
    totalPrice: 8000,
    validity: 6,
    status: 'active',
    autoRenew: true,
    createdAt: '2024-02-01'
  },
  {
    id: '4',
    companyId: '1',
    name: 'Declaração de IVA',
    description: 'Preparação e submissão da declaração mensal de IVA',
    price: 2000,
    ivaType: 'included',
    ivaAmount: 275.86,
    totalPrice: 2000,
    validity: 1,
    status: 'active',
    autoRenew: true,
    createdAt: '2024-02-10'
  },
  {
    id: '5',
    companyId: '1',
    name: 'Folha de Salários',
    description: 'Processamento completo da folha de salários mensal',
    price: 4000,
    ivaType: 'additional',
    ivaAmount: 640,
    totalPrice: 4640,
    validity: 1,
    status: 'inactive',
    autoRenew: false,
    createdAt: '2024-02-15'
  }
];

export const ServicesTable: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [services, setServices] = useState<Service[]>(mockServices);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Form calculation states
  const [servicePrice, setServicePrice] = useState<number>(0);
  const [ivaType, setIvaType] = useState<'additional' | 'included'>('additional');

  const calculateIVA = (price: number, type: 'additional' | 'included') => {
    if (type === 'additional') {
      const ivaAmount = (price * 16) / 100;
      return {
        basePrice: price,
        ivaAmount: Math.round(ivaAmount * 100) / 100,
        totalPrice: Math.round((price + ivaAmount) * 100) / 100
      };
    } else {
      // IVA incluído - calcular o valor base
      const basePrice = price / 1.16;
      const ivaAmount = price - basePrice;
      return {
        basePrice: Math.round(basePrice * 100) / 100,
        ivaAmount: Math.round(ivaAmount * 100) / 100,
        totalPrice: price
      };
    }
  };

  const { basePrice, ivaAmount, totalPrice } = calculateIVA(servicePrice, ivaType);

  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || service.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredServices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedServices = filteredServices.slice(startIndex, startIndex + itemsPerPage);

  // Reset to first page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-PT');
  };

  const getStatusBadge = (status: string) => {
    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
        status === 'active'
          ? 'bg-green-100 text-green-800'
          : 'bg-red-100 text-red-800'
      }`}>
        {status === 'active' ? 'Ativo' : 'Inativo'}
      </span>
    );
  };

  const getIVABadge = (ivaType: string) => {
    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
        ivaType === 'additional'
          ? 'bg-blue-100 text-blue-800'
          : 'bg-green-100 text-green-800'
      }`}>
        {ivaType === 'additional' ? 'IVA Adicional' : 'IVA Incluído'}
      </span>
    );
  };

  const getValidityLabel = (validity: number) => {
    if (validity === 1) return 'Mensal';
    if (validity === 3) return 'Trimestral';
    if (validity === 6) return 'Semestral';
    if (validity === 12) return 'Anual';
    return `${validity} meses`;
  };

  const handleAddService = () => {
    setEditingService(null);
    setServicePrice(0);
    setIvaType('additional');
    setShowAddModal(true);
  };

  const handleEditService = (service: Service) => {
    setEditingService(service);
    setServicePrice(service.ivaType === 'additional' ? service.price : service.totalPrice);
    setIvaType(service.ivaType);
    setShowAddModal(true);
  };

  const handleDeleteService = (serviceId: string) => {
    if (confirm('Tem certeza que deseja eliminar este serviço?')) {
      setServices(services.filter(s => s.id !== serviceId));
      alert('Serviço eliminado com sucesso!');
    }
  };

  const handleToggleStatus = (serviceId: string) => {
    setServices(services.map(s => 
      s.id === serviceId 
        ? { ...s, status: s.status === 'active' ? 'inactive' : 'active' }
        : s
    ));
    alert('Status do serviço atualizado!');
  };

  const handleSaveService = (serviceData: any) => {
    const calculations = calculateIVA(serviceData.price, serviceData.ivaType);
    
    if (editingService) {
      // Update existing service
      setServices(services.map(s => 
        s.id === editingService.id 
          ? { 
              ...s, 
              ...serviceData,
              price: serviceData.ivaType === 'additional' ? serviceData.price : calculations.basePrice,
              ivaAmount: calculations.ivaAmount,
              totalPrice: calculations.totalPrice
            }
          : s
      ));
      alert(`✅ Serviço "${serviceData.name}" atualizado!\n\n💰 Preço: ${serviceData.price.toLocaleString()} MT\n📊 IVA: ${serviceData.ivaType === 'additional' ? 'Adicional' : 'Incluído'}\n💸 Valor do IVA: ${calculations.ivaAmount.toLocaleString()} MT\n💵 Total: ${calculations.totalPrice.toLocaleString()} MT\n⏰ Validade: ${getValidityLabel(serviceData.validity)}\n🔄 Renovação: ${serviceData.autoRenew ? 'Automática' : 'Manual'}`);
    } else {
      // Add new service
      const newService: Service = {
        id: Date.now().toString(),
        companyId: '1',
        name: serviceData.name,
        description: serviceData.description,
        price: serviceData.ivaType === 'additional' ? serviceData.price : calculations.basePrice,
        ivaType: serviceData.ivaType,
        ivaAmount: calculations.ivaAmount,
        totalPrice: calculations.totalPrice,
        validity: serviceData.validity,
        status: 'active',
        autoRenew: serviceData.autoRenew,
        createdAt: new Date().toISOString()
      };
      setServices([...services, newService]);
      alert(`✅ Novo serviço "${newService.name}" criado!\n\n💰 Preço: ${serviceData.price.toLocaleString()} MT\n📊 IVA: ${serviceData.ivaType === 'additional' ? 'Adicional' : 'Incluído'}\n💸 Valor do IVA: ${calculations.ivaAmount.toLocaleString()} MT\n💵 Total: ${calculations.totalPrice.toLocaleString()} MT\n⏰ Validade: ${getValidityLabel(serviceData.validity)}\n🔄 Renovação: ${serviceData.autoRenew ? 'Automática' : 'Manual'}\n🟢 Status: Ativo`);
    }
    setShowAddModal(false);
    setEditingService(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestão de Serviços</h2>
          <p className="text-gray-600 mt-1">Gerir serviços oferecidos pela empresa</p>
        </div>
        <button 
          onClick={handleAddService}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus size={20} />
          Novo Serviço
        </button>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total de Serviços</p>
              <p className="text-2xl font-bold text-gray-900">{services.length}</p>
            </div>
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-blue-100 text-blue-600">
              <FileText size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Serviços Ativos</p>
              <p className="text-2xl font-bold text-gray-900">
                {services.filter(s => s.status === 'active').length}
              </p>
            </div>
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-green-100 text-green-600">
              <CheckCircle size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Receita Potencial</p>
              <p className="text-2xl font-bold text-gray-900">
                {services.filter(s => s.status === 'active').reduce((total, s) => total + s.totalPrice, 0).toLocaleString()} MT
              </p>
            </div>
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-emerald-100 text-emerald-600">
              <DollarSign size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">IVA Total</p>
              <p className="text-2xl font-bold text-gray-900">
                {services.filter(s => s.status === 'active').reduce((total, s) => total + s.ivaAmount, 0).toLocaleString()} MT
              </p>
            </div>
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-purple-100 text-purple-600">
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
          <option value="inactive">Inativos</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Serviço</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Preço Base</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">IVA</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Validade</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Renovação</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedServices.map((service) => (
                <tr key={service.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{service.name}</div>
                      <div className="text-sm text-gray-500">{service.description}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {service.ivaType === 'additional' ? service.price.toLocaleString() : (service.totalPrice / 1.16).toFixed(0)} MT
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      {getIVABadge(service.ivaType)}
                      <div className="text-xs text-gray-600">
                        {service.ivaAmount.toLocaleString()} MT (16%)
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {service.totalPrice.toLocaleString()} MT
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <div className="flex items-center gap-1">
                      <Clock size={12} className="text-gray-400" />
                      {getValidityLabel(service.validity)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      service.autoRenew
                        ? 'bg-green-100 text-green-800'
                        : 'bg-orange-100 text-orange-800'
                    }`}>
                      {service.autoRenew ? 'Automática' : 'Manual'}
                    </span>
                  </td>
                  <td className="px-6 py-4">{getStatusBadge(service.status)}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleEditService(service)}
                        className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded"
                        title="Editar"
                      >
                        <Edit size={16} />
                      </button>
                      {(user?.role === 'admin') && (
                        <>
                          <button 
                            onClick={() => handleToggleStatus(service.id)}
                            className="text-orange-600 hover:text-orange-900 p-1 hover:bg-orange-50 rounded"
                            title={service.status === 'active' ? "Desativar" : "Ativar"}
                          >
                            {service.status === 'active' ? <AlertCircle size={16} /> : <CheckCircle size={16} />}
                          </button>
                          <button 
                            onClick={() => handleDeleteService(service.id)}
                            className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded"
                            title="Eliminar"
                          >
                            <Trash2 size={16} />
                          </button>
                        </>
                      )}
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
          totalItems={filteredServices.length}
          itemsPerPage={itemsPerPage}
        />
      </div>

      {/* Add/Edit Service Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-4xl w-full mx-4 max-h-[95vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              {editingService ? 'Editar Serviço' : 'Novo Serviço'}
            </h3>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              
              const serviceData = {
                name: formData.get('name') as string,
                description: formData.get('description') as string,
                price: Number(formData.get('price')),
                ivaType: formData.get('ivaType') as 'additional' | 'included',
                validity: Number(formData.get('validity')),
                autoRenew: formData.get('autoRenew') === 'on'
              };
              handleSaveService(serviceData);
            }} className="space-y-6">
              
              {/* Informações Básicas */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText size={18} className="text-blue-600" />
                  Informações do Serviço
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Validade (meses) *
                    </label>
                    <select
                      name="validity"
                      defaultValue={editingService?.validity || 1}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value={1}>1 mês (Mensal)</option>
                      <option value={3}>3 meses (Trimestral)</option>
                      <option value={6}>6 meses (Semestral)</option>
                      <option value={12}>12 meses (Anual)</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Descrição *
                    </label>
                    <textarea
                      name="description"
                      defaultValue={editingService?.description || ''}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Descrição detalhada do serviço..."
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Preços e IVA */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <DollarSign size={18} className="text-green-600" />
                  Preços e IVA
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preço (MT) *
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={servicePrice || ''}
                      onChange={(e) => setServicePrice(Number(e.target.value) || 0)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ex: 5000"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tipo de IVA *
                    </label>
                    <select
                      name="ivaType"
                      value={ivaType}
                      onChange={(e) => setIvaType(e.target.value as 'additional' | 'included')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="additional">IVA Adicional (16%)</option>
                      <option value="included">IVA Incluído (16%)</option>
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                      {ivaType === 'additional' 
                        ? 'O preço informado + 16% de IVA' 
                        : 'O preço informado já inclui 16% de IVA'
                      }
                    </p>
                  </div>
                </div>

                {/* Cálculos Automáticos */}
                {servicePrice > 0 && (
                  <div className="mt-6 bg-white rounded-lg border border-gray-200 p-6">
                    <h5 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Percent size={16} className="text-blue-600" />
                      Cálculos Automáticos de IVA
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-sm text-blue-600 mb-1">
                          {ivaType === 'additional' ? 'Preço Base' : 'Preço Base (sem IVA)'}
                        </div>
                        <div className="text-xl font-bold text-blue-900">
                          {ivaType === 'additional' ? servicePrice.toLocaleString() : basePrice.toLocaleString()} MT
                        </div>
                      </div>
                      <div className="text-center p-4 bg-orange-50 rounded-lg">
                        <div className="text-sm text-orange-600 mb-1">IVA (16%)</div>
                        <div className="text-xl font-bold text-orange-900">{ivaAmount.toLocaleString()} MT</div>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg border-2 border-green-300">
                        <div className="text-sm text-green-600 mb-1">Total com IVA</div>
                        <div className="text-2xl font-bold text-green-900">{totalPrice.toLocaleString()} MT</div>
                      </div>
                    </div>
                    
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700 text-center">
                        <strong>Explicação:</strong> {
                          ivaType === 'additional' 
                            ? `${servicePrice.toLocaleString()} MT + ${ivaAmount.toLocaleString()} MT (IVA) = ${totalPrice.toLocaleString()} MT`
                            : `${totalPrice.toLocaleString()} MT ÷ 1.16 = ${basePrice.toLocaleString()} MT (base) + ${ivaAmount.toLocaleString()} MT (IVA)`
                        }
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Configurações */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Calendar size={18} className="text-purple-600" />
                  Configurações de Renovação
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
                      Quando ativado, as subscrições deste serviço serão renovadas automaticamente
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
                  {editingService ? 'Atualizar' : 'Criar Serviço'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};