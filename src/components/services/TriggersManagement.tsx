import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, Clock, Calendar, AlertCircle, Play, Pause } from 'lucide-react';
import { Pagination } from '../common/Pagination';

interface Trigger {
  id: string;
  name: string;
  description: string;
  triggerType: 'before_expiry' | 'after_expiry' | 'after_issue' | 'on_anniversary';
  triggerDays: number;
  isActive: boolean;
  createdAt: string;
  color: string; // Para identificação visual
}

const mockTriggers: Trigger[] = [
  {
    id: '1',
    name: '30 dias antes da expiração',
    description: 'Gatilho acionado 30 dias antes do serviço expirar',
    triggerType: 'before_expiry',
    triggerDays: 30,
    isActive: true,
    createdAt: '2024-01-15',
    color: 'orange'
  },
  {
    id: '2',
    name: '7 dias antes da expiração',
    description: 'Gatilho de alerta urgente 7 dias antes',
    triggerType: 'before_expiry',
    triggerDays: 7,
    isActive: true,
    createdAt: '2024-01-20',
    color: 'red'
  },
  {
    id: '3',
    name: '1 dia após emissão',
    description: 'Gatilho de boas-vindas após emissão do serviço',
    triggerType: 'after_issue',
    triggerDays: 1,
    isActive: false,
    createdAt: '2024-02-01',
    color: 'green'
  },
  {
    id: '4',
    name: '15 dias após expiração',
    description: 'Gatilho para clientes com serviços expirados',
    triggerType: 'after_expiry',
    triggerDays: 15,
    isActive: true,
    createdAt: '2024-02-05',
    color: 'purple'
  },
  {
    id: '5',
    name: 'Aniversário do cliente',
    description: 'Gatilho acionado no aniversário do cliente',
    triggerType: 'on_anniversary',
    triggerDays: 0,
    isActive: true,
    createdAt: '2024-02-10',
    color: 'blue'
  }
];

const triggerColors = [
  { value: 'blue', label: 'Azul', class: 'bg-blue-100 text-blue-800' },
  { value: 'green', label: 'Verde', class: 'bg-green-100 text-green-800' },
  { value: 'orange', label: 'Laranja', class: 'bg-orange-100 text-orange-800' },
  { value: 'red', label: 'Vermelho', class: 'bg-red-100 text-red-800' },
  { value: 'purple', label: 'Roxo', class: 'bg-purple-100 text-purple-800' },
  { value: 'pink', label: 'Rosa', class: 'bg-pink-100 text-pink-800' },
  { value: 'indigo', label: 'Índigo', class: 'bg-indigo-100 text-indigo-800' },
  { value: 'gray', label: 'Cinza', class: 'bg-gray-100 text-gray-800' }
];

export const TriggersManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTrigger, setEditingTrigger] = useState<Trigger | null>(null);
  const [triggers, setTriggers] = useState<Trigger[]>(mockTriggers);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredTriggers = triggers.filter(trigger =>
    trigger.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trigger.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredTriggers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTriggers = filteredTriggers.slice(startIndex, startIndex + itemsPerPage);

  // Reset to first page when search changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-PT');
  };

  const getTriggerTypeLabel = (triggerType: string, days: number) => {
    switch (triggerType) {
      case 'before_expiry':
        return `${days} dias antes da expiração`;
      case 'after_expiry':
        return `${days} dias após a expiração`;
      case 'after_issue':
        return `${days} dias após a emissão`;
      case 'on_anniversary':
        return 'No aniversário do cliente';
      default:
        return 'Não definido';
    }
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

  const getColorBadge = (color: string, name: string) => {
    const colorConfig = triggerColors.find(c => c.value === color);
    const colorClass = colorConfig?.class || 'bg-gray-100 text-gray-800';
    
    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${colorClass}`}>
        {name}
      </span>
    );
  };

  const handleAddTrigger = () => {
    setShowAddModal(true);
  };

  const handleEditTrigger = (trigger: Trigger) => {
    setEditingTrigger(trigger);
    setShowAddModal(true);
  };

  const handleDeleteTrigger = (triggerId: string) => {
    if (confirm('Tem certeza que deseja eliminar este gatilho?')) {
      setTriggers(triggers.filter(t => t.id !== triggerId));
      alert('Gatilho eliminado com sucesso!');
    }
  };

  const handleToggleStatus = (triggerId: string) => {
    setTriggers(triggers.map(t => 
      t.id === triggerId 
        ? { ...t, isActive: !t.isActive }
        : t
    ));
    alert('Status do gatilho atualizado!');
  };

  const handleSaveTrigger = (triggerData: Partial<Trigger>) => {
    if (editingTrigger) {
      // Update existing trigger
      setTriggers(triggers.map(t => 
        t.id === editingTrigger.id 
          ? { ...t, ...triggerData }
          : t
      ));
      alert(`✅ Gatilho "${triggerData.name}" atualizado com sucesso!\n\n🎯 Tipo: ${getTriggerTypeLabel(triggerData.triggerType || 'before_expiry', triggerData.triggerDays || 0)}\n🎨 Cor: ${triggerColors.find(c => c.value === triggerData.color)?.label}\n📅 Atualizado em: ${new Date().toLocaleString('pt-PT')}`);
    } else {
      // Add new trigger
      const newTrigger: Trigger = {
        id: Date.now().toString(),
        name: triggerData.name || '',
        description: triggerData.description || '',
        triggerType: triggerData.triggerType || 'before_expiry',
        triggerDays: triggerData.triggerDays || 30,
        color: triggerData.color || 'blue',
        isActive: true,
        createdAt: new Date().toISOString()
      };
      setTriggers([...triggers, newTrigger]);
      alert(`✅ Gatilho "${newTrigger.name}" criado com sucesso!\n\n🎯 Tipo: ${getTriggerTypeLabel(newTrigger.triggerType, newTrigger.triggerDays)}\n🎨 Cor: ${triggerColors.find(c => c.value === newTrigger.color)?.label}\n📅 Criado em: ${new Date().toLocaleString('pt-PT')}\n🟢 Status: Ativo`);
    }
    setShowAddModal(false);
    setEditingTrigger(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Gestão de Gatilhos</h3>
          <p className="text-gray-600 mt-1">Criar e gerenciar gatilhos de tempo para automações</p>
        </div>
        <button 
          onClick={handleAddTrigger}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus size={20} />
          Novo Gatilho
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Pesquisar gatilhos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Clock className="text-blue-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total de Gatilhos</p>
              <p className="text-xl font-bold text-gray-900">{triggers.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-2 rounded-lg">
              <Play className="text-green-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Gatilhos Ativos</p>
              <p className="text-xl font-bold text-gray-900">
                {triggers.filter(t => t.isActive).length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="bg-orange-100 p-2 rounded-lg">
              <AlertCircle className="text-orange-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Antes da Expiração</p>
              <p className="text-xl font-bold text-gray-900">
                {triggers.filter(t => t.triggerType === 'before_expiry').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="bg-purple-100 p-2 rounded-lg">
              <Calendar className="text-purple-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Após Emissão</p>
              <p className="text-xl font-bold text-gray-900">
                {triggers.filter(t => t.triggerType === 'after_issue').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Gatilho
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo e Prazo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Criado em
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
              {paginatedTriggers.map((trigger) => (
                <tr key={trigger.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      {getColorBadge(trigger.color, trigger.name)}
                      <div className="text-sm text-gray-500 mt-1">{trigger.description}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 flex items-center gap-1">
                      <Clock size={12} />
                      {getTriggerTypeLabel(trigger.triggerType, trigger.triggerDays)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 flex items-center gap-1">
                      <Calendar size={12} />
                      {formatDate(trigger.createdAt)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(trigger.isActive)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleEditTrigger(trigger)}
                        className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded"
                        title="Editar"
                      >
                        <Edit size={16} />
                      </button>
                      {(user?.role === 'admin') && (
                        <>
                          <button 
                            onClick={() => handleToggleStatus(trigger.id)}
                            className="text-orange-600 hover:text-orange-900 p-1 hover:bg-orange-50 rounded"
                            title={trigger.isActive ? "Desativar" : "Ativar"}
                          >
                            {trigger.isActive ? <Pause size={16} /> : <Play size={16} />}
                          </button>
                          <button 
                            onClick={() => handleDeleteTrigger(trigger.id)}
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
         totalItems={filteredTriggers.length}
         itemsPerPage={itemsPerPage}
       />
      </div>

      {/* Add/Edit Trigger Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {editingTrigger ? 'Editar Gatilho' : 'Novo Gatilho'}
            </h3>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const triggerData = {
                name: formData.get('name') as string,
                description: formData.get('description') as string,
                triggerType: formData.get('triggerType') as 'before_expiry' | 'after_expiry' | 'after_issue' | 'on_anniversary',
                triggerDays: Number(formData.get('triggerDays')),
                color: formData.get('color') as string,
              };
              handleSaveTrigger(triggerData);
            }} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome do Gatilho
                  </label>
                  <input
                    type="text"
                    name="name"
                    defaultValue={editingTrigger?.name || ''}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ex: 30 dias antes da expiração"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cor de Identificação
                  </label>
                  <select
                    name="color"
                    defaultValue={editingTrigger?.color || 'blue'}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    {triggerColors.map((color) => (
                      <option key={color.value} value={color.value}>
                        {color.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descrição
                  </label>
                  <textarea
                    name="description"
                    defaultValue={editingTrigger?.description || ''}
                    rows={2}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Descreva quando este gatilho deve ser acionado"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Gatilho
                  </label>
                  <select
                    name="triggerType"
                    defaultValue={editingTrigger?.triggerType || 'before_expiry'}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    onChange={(e) => {
                      const daysInput = document.querySelector('input[name="triggerDays"]') as HTMLInputElement;
                      if (e.target.value === 'on_anniversary' && daysInput) {
                        daysInput.value = '0';
                        daysInput.disabled = true;
                      } else if (daysInput) {
                        daysInput.disabled = false;
                      }
                    }}
                  >
                    <option value="before_expiry">Antes da Expiração</option>
                    <option value="after_expiry">Após a Expiração</option>
                    <option value="after_issue">Após a Emissão</option>
                    <option value="on_anniversary">No Aniversário</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prazo (dias)
                  </label>
                  <input
                    type="number"
                    name="triggerDays"
                    defaultValue={editingTrigger?.triggerDays || 30}
                    min="0"
                    max="365"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={editingTrigger?.triggerType === 'on_anniversary'}
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Para "No Aniversário", o prazo é sempre 0 dias
                  </p>
                </div>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingTrigger(null);
                  }}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingTrigger ? 'Atualizar' : 'Adicionar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};