import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, Clock, Mail, MessageSquare, Play, Pause } from 'lucide-react';
import { HTMLEditor } from '../common/HTMLEditor';
import { Pagination } from '../common/Pagination';

interface Flow {
  id: string;
  name: string;
  description: string;
  serviceIds: string[]; // Array of service IDs this flow applies to
  triggerType: 'before_expiry' | 'after_expiry' | 'after_issue';
  triggerDays: number;
  messageTemplate: string;
  channel: 'email' | 'whatsapp';
  isActive: boolean;
  createdAt: string;
}

const mockFlows: Flow[] = [
  {
    id: '1',
    name: 'Lembrete de Renovação',
    description: 'Enviar lembrete 30 dias antes da expiração',
    serviceIds: ['1', '2'], // Applies to Contabilidade and Auditoria
    triggerType: 'before_expiry',
    triggerDays: 30,
    messageTemplate: 'Olá {cliente}, seu serviço {servico} expira em {dias} dias. Renove agora!',
    channel: 'email',
    isActive: true,
    createdAt: '2024-01-15'
  },
  {
    id: '2',
    name: 'SMS Urgente',
    description: 'SMS 7 dias antes da expiração',
    serviceIds: ['1'], // Only for Contabilidade
    triggerType: 'before_expiry',
    triggerDays: 7,
    messageTemplate: 'URGENTE: {cliente}, seu {servico} expira em {dias} dias!',
    channel: 'whatsapp',
    isActive: true,
    createdAt: '2024-01-20'
  },
  {
    id: '3',
    name: 'Boas-vindas',
    description: 'Mensagem de boas-vindas após emissão',
    serviceIds: [], // Applies to all services
    triggerType: 'after_issue',
    triggerDays: 1,
    messageTemplate: 'Bem-vindo {cliente}! Seu {servico} foi ativado com sucesso.',
    channel: 'whatsapp',
    isActive: false,
    createdAt: '2024-02-01'
  }
];

// Mock services for selection
const mockServices = [
  { id: '1', name: 'Contabilidade Mensal' },
  { id: '2', name: 'Auditoria Anual' },
  { id: '3', name: 'Consultoria Fiscal' },
  { id: '4', name: 'Declaração de IVA' },
  { id: '5', name: 'Folha de Salários' }
];

// Available template variables
const templateVariables = [
  { category: 'Cliente', variables: [
    { key: '{cliente_nome}', description: 'Nome da empresa cliente' },
    { key: '{cliente_representante}', description: 'Nome do representante' },
    { key: '{cliente_email}', description: 'Email do cliente' },
    { key: '{cliente_telefone}', description: 'Telefone do cliente' },
    { key: '{cliente_nuit}', description: 'NUIT do cliente' },
    { key: '{cliente_endereco}', description: 'Endereço do cliente' },
    { key: '{cliente_aniversario}', description: 'Data de aniversário' }
  ]},
  { category: 'Serviço', variables: [
    { key: '{servico_nome}', description: 'Nome do serviço' },
    { key: '{servico_descricao}', description: 'Descrição do serviço' },
    { key: '{servico_preco}', description: 'Preço do serviço' },
    { key: '{servico_validade}', description: 'Validade em meses' },
    { key: '{servico_inicio}', description: 'Data de início' },
    { key: '{servico_fim}', description: 'Data de fim' }
  ]},
  { category: 'Sistema', variables: [
    { key: '{empresa_nome}', description: 'Nome da sua empresa' },
    { key: '{empresa_email}', description: 'Email da sua empresa' },
    { key: '{empresa_telefone}', description: 'Telefone da sua empresa' },
    { key: '{empresa_endereco}', description: 'Endereço da sua empresa' },
    { key: '{gestor_nome}', description: 'Nome do gestor responsável' },
    { key: '{gestor_email}', description: 'Email do gestor' },
    { key: '{gestor_telefone}', description: 'Telefone do gestor' }
  ]},
  { category: 'Datas', variables: [
    { key: '{dias_restantes}', description: 'Dias até expiração' },
    { key: '{data_hoje}', description: 'Data atual' },
    { key: '{data_expiracao}', description: 'Data de expiração' },
    { key: '{data_renovacao}', description: 'Data de renovação' }
  ]}
];

export const FlowsManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingFlow, setEditingFlow] = useState<Flow | null>(null);
  const [flows, setFlows] = useState<Flow[]>(mockFlows);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [messageTemplate, setMessageTemplate] = useState('');

  const filteredFlows = flows.filter(flow =>
    flow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    flow.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredFlows.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedFlows = filteredFlows.slice(startIndex, startIndex + itemsPerPage);

  // Reset to first page when search changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-PT');
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'email':
        return <Mail size={16} className="text-blue-600" />;
      case 'whatsapp':
        return <MessageSquare size={16} className="text-green-600" />;
      default:
        return <Mail size={16} className="text-gray-600" />;
    }
  };

  const getChannelLabel = (channel: string) => {
    const labels = {
      email: 'Email',
      whatsapp: 'WhatsApp'
    };
    return labels[channel as keyof typeof labels] || channel;
  };

  const getTriggerLabel = (triggerType: string, days: number) => {
    switch (triggerType) {
      case 'before_expiry':
        return `${days} dias antes da expiração`;
      case 'after_expiry':
        return `${days} dias após a expiração`;
      case 'after_issue':
        return `${days} dias após a emissão`;
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

  const getServiceNames = (serviceIds: string[]) => {
    if (serviceIds.length === 0) return 'Todos os serviços';
    const names = serviceIds.map(id => {
      const service = mockServices.find(s => s.id === id);
      return service ? service.name : 'Serviço não encontrado';
    });
    return names.length > 2 ? `${names.slice(0, 2).join(', ')} +${names.length - 2}` : names.join(', ');
  };

  const handleAddFlow = () => {
    setShowAddModal(true);
  };

  const handleEditFlow = (flow: Flow) => {
    setEditingFlow(flow);
    setShowAddModal(true);
  };

  const handleDeleteFlow = (flowId: string) => {
    if (confirm('Tem certeza que deseja eliminar este fluxo?')) {
      setFlows(flows.filter(f => f.id !== flowId));
      alert('Fluxo eliminado com sucesso!');
    }
  };

  const handleToggleStatus = (flowId: string) => {
    setFlows(flows.map(f => 
      f.id === flowId 
        ? { ...f, isActive: !f.isActive }
        : f
    ));
    alert('Status do fluxo atualizado!');
  };

  const handleSaveFlow = (flowData: Partial<Flow>) => {
    if (editingFlow) {
      // Update existing flow
      setFlows(flows.map(f => 
        f.id === editingFlow.id 
          ? { ...f, ...flowData }
          : f
      ));
      alert('Fluxo atualizado com sucesso!');
    } else {
      // Add new flow
      const newFlow: Flow = {
        id: Date.now().toString(),
        name: flowData.name || '',
        description: flowData.description || '',
        serviceIds: flowData.serviceIds || [],
        triggerType: flowData.triggerType || 'before_expiry',
        triggerDays: flowData.triggerDays || 30,
        messageTemplate: flowData.messageTemplate || '',
        channel: flowData.channel as 'email' | 'whatsapp' || 'email',
        isActive: true,
        createdAt: new Date().toISOString()
      };
      setFlows([...flows, newFlow]);
      alert('Fluxo adicionado com sucesso!');
    }
    setShowAddModal(false);
    setEditingFlow(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Gestão de Fluxos</h3>
          <p className="text-gray-600 mt-1">Automatizar comunicações baseadas em eventos dos serviços</p>
        </div>
        <button 
          onClick={handleAddFlow}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus size={20} />
          Novo Fluxo
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Pesquisar fluxos..."
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
                  Fluxo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Serviços
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Gatilho
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Canal
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Template
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
              {paginatedFlows.map((flow) => (
                <tr key={flow.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{flow.name}</div>
                      <div className="text-sm text-gray-500">{flow.description}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs">
                      <div className="truncate">{getServiceNames(flow.serviceIds)}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 flex items-center gap-1">
                      <Clock size={12} />
                      <span className="truncate">{getTriggerLabel(flow.triggerType, flow.triggerDays)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {getChannelIcon(flow.channel)}
                      <span className="text-sm text-gray-900">{getChannelLabel(flow.channel)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-sm">
                      <div className="truncate" title={flow.messageTemplate}>
                      {flow.messageTemplate}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(flow.isActive)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleEditFlow(flow)}
                        className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded"
                        title="Editar"
                      >
                        <Edit size={16} />
                      </button>
                      {(user?.role === 'admin') && (
                        <>
                          <button 
                            onClick={() => handleToggleStatus(flow.id)}
                            className="text-orange-600 hover:text-orange-900 p-1 hover:bg-orange-50 rounded"
                            title={flow.isActive ? "Desativar" : "Ativar"}
                          >
                            {flow.isActive ? <Pause size={16} /> : <Play size={16} />}
                          </button>
                          <button 
                            onClick={() => handleDeleteFlow(flow.id)}
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
          totalItems={filteredFlows.length}
          itemsPerPage={itemsPerPage}
        />
      </div>

      {/* Add/Edit Flow Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-5xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {editingFlow ? 'Editar Fluxo' : 'Novo Fluxo'}
            </h3>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const serviceIds = Array.from(formData.getAll('serviceIds')) as string[];
              const flowData = {
                name: formData.get('name') as string,
                description: formData.get('description') as string,
                serviceIds: serviceIds,
                triggerType: formData.get('triggerType') as 'before_expiry' | 'after_expiry' | 'after_issue',
                triggerDays: Number(formData.get('triggerDays')),
                messageTemplate: formData.get('messageTemplate') as string,
                channel: formData.get('channel') as 'email' | 'whatsapp',
              };
              handleSaveFlow(flowData);
            }} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome do Fluxo
                  </label>
                  <input
                    type="text"
                    name="name"
                    defaultValue={editingFlow?.name || ''}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descrição
                  </label>
                  <input
                    type="text"
                    name="description"
                    defaultValue={editingFlow?.description || ''}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Gatilho
                  </label>
                  <select
                    name="triggerType"
                    defaultValue={editingFlow?.triggerType || 'before_expiry'}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="before_expiry">Antes da Expiração</option>
                    <option value="after_expiry">Após a Expiração</option>
                    <option value="after_issue">Após a Emissão</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prazo (dias)
                  </label>
                  <input
                    type="number"
                    name="triggerDays"
                    defaultValue={editingFlow?.triggerDays || 30}
                    min="1"
                    max="365"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Canal de Comunicação
                  </label>
                  <select
                    name="channel"
                    defaultValue={editingFlow?.channel || 'email'}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="email">Email</option>
                    <option value="whatsapp">WhatsApp</option>
                  </select>
                </div>
              </div>

              {/* Service Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Serviços Aplicáveis
                </label>
                <div className="border border-gray-300 rounded-lg p-4 max-h-40 overflow-y-auto">
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="allServices"
                        onChange={(e) => {
                          const checkboxes = document.querySelectorAll('input[name="serviceIds"]') as NodeListOf<HTMLInputElement>;
                          checkboxes.forEach(cb => cb.checked = e.target.checked);
                        }}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm font-medium text-gray-900">Todos os serviços</span>
                    </label>
                    <hr className="my-2" />
                    {mockServices.map((service) => (
                      <label key={service.id} className="flex items-center">
                        <input
                          type="checkbox"
                          name="serviceIds"
                          value={service.id}
                          defaultChecked={editingFlow?.serviceIds.includes(service.id)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">{service.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Selecione os serviços aos quais este fluxo se aplica. Se nenhum for selecionado, aplicará a todos.
                </p>
              </div>

              {/* Message Template with Variables */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Template da Mensagem
                  </label>
                  <HTMLEditor
                    value={messageTemplate || editingFlow?.messageTemplate || ''}
                    onChange={setMessageTemplate}
                    placeholder="Digite sua mensagem aqui..."
                    height="200px"
                  />
                  <input
                    type="hidden"
                    name="messageTemplate"
                    value={messageTemplate || editingFlow?.messageTemplate || ''}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Variáveis Disponíveis
                  </label>
                  <div className="border border-gray-300 rounded-lg p-4 max-h-64 overflow-y-auto bg-gray-50">
                    {templateVariables.map((category) => (
                      <div key={category.category} className="mb-4">
                        <h4 className="font-semibold text-gray-900 mb-2">{category.category}</h4>
                        <div className="space-y-1">
                          {category.variables.map((variable) => (
                            <div key={variable.key} className="flex items-start gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  const currentTemplate = messageTemplate || editingFlow?.messageTemplate || '';
                                  setMessageTemplate(currentTemplate + ' ' + variable.key);
                                }}
                                className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded hover:bg-blue-200 transition-colors"
                              >
                                {variable.key}
                              </button>
                              <span className="text-xs text-gray-600">{variable.description}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Clique nas variáveis para inserir no template
                  </p>
                </div>
              </div>

              
              <div className="flex gap-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingFlow(null);
                  }}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingFlow ? 'Atualizar' : 'Adicionar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};