import React, { useState, useRef, useCallback } from 'react';
import { 
  Plus, 
  Play, 
  Pause, 
  Trash2, 
  Save, 
  Eye, 
  Settings,
  Mail,
  MessageSquare,
  Clock,
  Calendar,
  DollarSign,
  User,
  Bell,
  Zap,
  GitBranch,
  ArrowRight,
  ArrowDown,
  Circle,
  Square,
  Diamond,
  Triangle,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Filter,
  Copy,
  Download,
  Upload
} from 'lucide-react';

interface FlowNode {
  id: string;
  type: 'trigger' | 'condition' | 'action' | 'delay';
  position: { x: number; y: number };
  data: {
    label: string;
    description?: string;
    config?: any;
  };
  connections: string[];
}

interface FlowTemplate {
  id: string;
  name: string;
  description: string;
  category: 'retention' | 'onboarding' | 'billing' | 'satisfaction';
  nodes: FlowNode[];
  isActive: boolean;
  lastRun?: string;
  successRate?: number;
}

const mockFlowTemplates: FlowTemplate[] = [
  {
    id: '1',
    name: 'Retenção de Clientes Premium',
    description: 'Fluxo automático para prevenir churn de clientes de alto valor',
    category: 'retention',
    isActive: true,
    lastRun: '2024-03-30T14:30:00Z',
    successRate: 87.5,
    nodes: [
      {
        id: 'trigger-1',
        type: 'trigger',
        position: { x: 100, y: 100 },
        data: { 
          label: 'Cliente com Risco Alto',
          description: 'Churn probability > 70%',
          config: { triggerType: 'churn_risk', threshold: 70 }
        },
        connections: ['condition-1']
      },
      {
        id: 'condition-1',
        type: 'condition',
        position: { x: 100, y: 200 },
        data: { 
          label: 'LTV > 100K MT?',
          config: { field: 'ltv', operator: '>', value: 100000 }
        },
        connections: ['action-1', 'action-2']
      },
      {
        id: 'action-1',
        type: 'action',
        position: { x: 50, y: 300 },
        data: { 
          label: 'Contacto Gestor',
          description: 'Ligar em 2h',
          config: { actionType: 'call', priority: 'urgent', assignTo: 'manager' }
        },
        connections: ['delay-1']
      },
      {
        id: 'action-2',
        type: 'action',
        position: { x: 150, y: 300 },
        data: { 
          label: 'Email Automático',
          description: 'Template de retenção',
          config: { actionType: 'email', template: 'retention_offer' }
        },
        connections: []
      },
      {
        id: 'delay-1',
        type: 'delay',
        position: { x: 50, y: 400 },
        data: { 
          label: 'Aguardar 24h',
          config: { duration: 24, unit: 'hours' }
        },
        connections: ['action-3']
      },
      {
        id: 'action-3',
        type: 'action',
        position: { x: 50, y: 500 },
        data: { 
          label: 'WhatsApp Follow-up',
          config: { actionType: 'whatsapp', template: 'followup' }
        },
        connections: []
      }
    ]
  },
  {
    id: '2',
    name: 'Onboarding Novos Clientes',
    description: 'Sequência de boas-vindas e ativação para novos clientes',
    category: 'onboarding',
    isActive: true,
    lastRun: '2024-03-29T10:15:00Z',
    successRate: 92.3,
    nodes: [
      {
        id: 'trigger-2',
        type: 'trigger',
        position: { x: 100, y: 100 },
        data: { 
          label: 'Novo Cliente',
          description: 'Cliente criado no sistema',
          config: { triggerType: 'client_created' }
        },
        connections: ['action-4']
      },
      {
        id: 'action-4',
        type: 'action',
        position: { x: 100, y: 200 },
        data: { 
          label: 'Email de Boas-vindas',
          config: { actionType: 'email', template: 'welcome' }
        },
        connections: ['delay-2']
      },
      {
        id: 'delay-2',
        type: 'delay',
        position: { x: 100, y: 300 },
        data: { 
          label: 'Aguardar 3 dias',
          config: { duration: 3, unit: 'days' }
        },
        connections: ['action-5']
      },
      {
        id: 'action-5',
        type: 'action',
        position: { x: 100, y: 400 },
        data: { 
          label: 'Tutorial WhatsApp',
          config: { actionType: 'whatsapp', template: 'tutorial' }
        },
        connections: []
      }
    ]
  }
];

const nodeTypes = [
  { 
    type: 'trigger', 
    label: 'Gatilho', 
    icon: Zap, 
    color: 'bg-green-500',
    description: 'Evento que inicia o fluxo'
  },
  { 
    type: 'condition', 
    label: 'Condição', 
    icon: GitBranch, 
    color: 'bg-blue-500',
    description: 'Decisão baseada em critérios'
  },
  { 
    type: 'action', 
    label: 'Ação', 
    icon: Play, 
    color: 'bg-purple-500',
    description: 'Ação a ser executada'
  },
  { 
    type: 'delay', 
    label: 'Espera', 
    icon: Clock, 
    color: 'bg-orange-500',
    description: 'Pausa antes da próxima ação'
  }
];

export const FlowBuilder: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<FlowTemplate | null>(null);
  const [isBuilding, setIsBuilding] = useState(false);
  const [flowNodes, setFlowNodes] = useState<FlowNode[]>([]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [draggedNodeType, setDraggedNodeType] = useState<string | null>(null);
  const [showTemplates, setShowTemplates] = useState(true);
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleDragStart = (nodeType: string) => {
    setDraggedNodeType(nodeType);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedNodeType || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newNode: FlowNode = {
      id: `${draggedNodeType}-${Date.now()}`,
      type: draggedNodeType as any,
      position: { x, y },
      data: {
        label: `Novo ${nodeTypes.find(nt => nt.type === draggedNodeType)?.label}`,
        description: 'Configurar...'
      },
      connections: []
    };

    setFlowNodes([...flowNodes, newNode]);
    setDraggedNodeType(null);
  }, [draggedNodeType, flowNodes]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const loadTemplate = (template: FlowTemplate) => {
    setSelectedTemplate(template);
    setFlowNodes(template.nodes);
    setIsBuilding(true);
    setShowTemplates(false);
  };

  const createNewFlow = () => {
    setSelectedTemplate(null);
    setFlowNodes([]);
    setIsBuilding(true);
    setShowTemplates(false);
  };

  const saveFlow = () => {
    if (flowNodes.length === 0) {
      alert('Adicione pelo menos um nó ao fluxo');
      return;
    }

    const flowName = prompt('Nome do fluxo:');
    if (!flowName) return;

    alert(`✅ Fluxo "${flowName}" salvo com sucesso!\n\n🔧 Nós: ${flowNodes.length}\n🎯 Gatilhos: ${flowNodes.filter(n => n.type === 'trigger').length}\n⚡ Ações: ${flowNodes.filter(n => n.type === 'action').length}\n📅 Criado em: ${new Date().toLocaleString('pt-PT')}\n🟢 Status: Ativo`);
  };

  const getNodeIcon = (type: string) => {
    const nodeType = nodeTypes.find(nt => nt.type === type);
    if (!nodeType) return Circle;
    return nodeType.icon;
  };

  const getNodeColor = (type: string) => {
    const nodeType = nodeTypes.find(nt => nt.type === type);
    return nodeType?.color || 'bg-gray-500';
  };

  const renderNode = (node: FlowNode) => {
    const Icon = getNodeIcon(node.type);
    const isSelected = selectedNode === node.id;
    
    return (
      <div
        key={node.id}
        className={`absolute bg-white rounded-lg border-2 p-4 cursor-pointer transition-all hover:shadow-lg ${
          isSelected ? 'border-blue-500 shadow-lg' : 'border-gray-300'
        }`}
        style={{ 
          left: node.position.x, 
          top: node.position.y,
          minWidth: '150px'
        }}
        onClick={() => setSelectedNode(node.id)}
      >
        <div className="flex items-center gap-3 mb-2">
          <div className={`w-8 h-8 ${getNodeColor(node.type)} rounded-full flex items-center justify-center`}>
            <Icon size={16} className="text-white" />
          </div>
          <div className="flex-1">
            <div className="font-semibold text-gray-900 text-sm">{node.data.label}</div>
            {node.data.description && (
              <div className="text-xs text-gray-600">{node.data.description}</div>
            )}
          </div>
        </div>
        
        {/* Connection points */}
        <div className="flex justify-between">
          <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
          <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
        </div>
      </div>
    );
  };

  if (showTemplates) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <GitBranch className="text-blue-600" size={28} />
              Editor Visual de Fluxos
            </h2>
            <p className="text-gray-600">Crie automações avançadas com interface drag-and-drop</p>
          </div>
          <button
            onClick={createNewFlow}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-semibold"
          >
            <Plus size={20} />
            Criar Fluxo do Zero
          </button>
        </div>

        {/* Templates Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockFlowTemplates.map((template) => (
            <div key={template.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  template.category === 'retention' ? 'bg-red-100' :
                  template.category === 'onboarding' ? 'bg-green-100' :
                  template.category === 'billing' ? 'bg-blue-100' :
                  'bg-purple-100'
                }`}>
                  {template.category === 'retention' ? <AlertTriangle className="text-red-600" size={24} /> :
                   template.category === 'onboarding' ? <User className="text-green-600" size={24} /> :
                   template.category === 'billing' ? <DollarSign className="text-blue-600" size={24} /> :
                   <Star className="text-purple-600" size={24} />}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900">{template.name}</h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    template.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {template.isActive ? 'Ativo' : 'Inativo'}
                  </span>
                </div>
              </div>

              <p className="text-gray-600 mb-4">{template.description}</p>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-900">{template.nodes.length}</div>
                  <div className="text-xs text-gray-600">Nós</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-green-600">{template.successRate}%</div>
                  <div className="text-xs text-gray-600">Taxa de Sucesso</div>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => loadTemplate(template)}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Eye size={16} />
                  Usar Template
                </button>
                <button className="border border-gray-300 text-gray-700 py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <Copy size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Start Guide */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200 p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center gap-2">
            <Zap className="text-blue-600" size={20} />
            Como Criar Fluxos Poderosos
          </h3>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-white font-bold">1</span>
              </div>
              <h4 className="font-semibold text-blue-900 mb-1">Defina o Gatilho</h4>
              <p className="text-sm text-blue-800">Escolha o evento que inicia o fluxo</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-white font-bold">2</span>
              </div>
              <h4 className="font-semibold text-blue-900 mb-1">Adicione Condições</h4>
              <p className="text-sm text-blue-800">Crie regras para personalizar o fluxo</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-white font-bold">3</span>
              </div>
              <h4 className="font-semibold text-blue-900 mb-1">Configure Ações</h4>
              <p className="text-sm text-blue-800">Defina emails, WhatsApp, tarefas</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-white font-bold">4</span>
              </div>
              <h4 className="font-semibold text-blue-900 mb-1">Ative e Monitore</h4>
              <p className="text-sm text-blue-800">Acompanhe performance em tempo real</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Flow Builder Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowTemplates(true)}
              className="text-gray-600 hover:text-gray-900 flex items-center gap-2"
            >
              ← Voltar aos Templates
            </button>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {selectedTemplate ? `Editando: ${selectedTemplate.name}` : 'Novo Fluxo'}
              </h3>
              <p className="text-sm text-gray-600">
                {flowNodes.length} nós • {flowNodes.filter(n => n.type === 'trigger').length} gatilhos • {flowNodes.filter(n => n.type === 'action').length} ações
              </p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
              <Eye size={16} />
              Testar
            </button>
            <button
              onClick={saveFlow}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <Save size={16} />
              Salvar
            </button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
              <Play size={16} />
              Ativar
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Node Palette */}
        <div className="w-64 bg-white border-r border-gray-200 p-4">
          <h4 className="font-semibold text-gray-900 mb-4">Componentes</h4>
          <div className="space-y-3">
            {nodeTypes.map((nodeType) => {
              const Icon = nodeType.icon;
              return (
                <div
                  key={nodeType.type}
                  draggable
                  onDragStart={() => handleDragStart(nodeType.type)}
                  className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-move hover:shadow-md transition-shadow"
                >
                  <div className={`w-8 h-8 ${nodeType.color} rounded-full flex items-center justify-center`}>
                    <Icon size={16} className="text-white" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{nodeType.label}</div>
                    <div className="text-xs text-gray-600">{nodeType.description}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Flow Statistics */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h5 className="font-semibold text-gray-900 mb-3">Estatísticas do Fluxo</h5>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Gatilhos:</span>
                <span className="font-medium">{flowNodes.filter(n => n.type === 'trigger').length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Condições:</span>
                <span className="font-medium">{flowNodes.filter(n => n.type === 'condition').length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Ações:</span>
                <span className="font-medium">{flowNodes.filter(n => n.type === 'action').length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Delays:</span>
                <span className="font-medium">{flowNodes.filter(n => n.type === 'delay').length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 bg-gray-50 relative overflow-hidden">
          <div
            ref={canvasRef}
            className="w-full h-full relative"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            {/* Grid Background */}
            <div className="absolute inset-0 opacity-20">
              <svg width="100%" height="100%">
                <defs>
                  <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e5e7eb" strokeWidth="1"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            </div>

            {/* Flow Nodes */}
            {flowNodes.map(renderNode)}

            {/* Empty State */}
            {flowNodes.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <GitBranch className="text-gray-300 mx-auto mb-4" size={64} />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">Canvas Vazio</h3>
                  <p className="text-gray-500 mb-4">Arraste componentes da barra lateral para começar</p>
                  <div className="flex gap-2 justify-center">
                    <button
                      onClick={() => setShowTemplates(true)}
                      className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Ver Templates
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Properties Panel */}
        {selectedNode && (
          <div className="w-80 bg-white border-l border-gray-200 p-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-gray-900">Propriedades</h4>
              <button
                onClick={() => {
                  setFlowNodes(flowNodes.filter(n => n.id !== selectedNode));
                  setSelectedNode(null);
                }}
                className="text-red-600 hover:text-red-700 p-1"
              >
                <Trash2 size={16} />
              </button>
            </div>

            {(() => {
              const node = flowNodes.find(n => n.id === selectedNode);
              if (!node) return null;

              return (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nome</label>
                    <input
                      type="text"
                      value={node.data.label}
                      onChange={(e) => {
                        setFlowNodes(flowNodes.map(n => 
                          n.id === selectedNode 
                            ? { ...n, data: { ...n.data, label: e.target.value } }
                            : n
                        ));
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Descrição</label>
                    <textarea
                      value={node.data.description || ''}
                      onChange={(e) => {
                        setFlowNodes(flowNodes.map(n => 
                          n.id === selectedNode 
                            ? { ...n, data: { ...n.data, description: e.target.value } }
                            : n
                        ));
                      }}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Type-specific configurations */}
                  {node.type === 'trigger' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Gatilho</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option value="client_created">Cliente Criado</option>
                        <option value="service_expiring">Serviço Expirando</option>
                        <option value="payment_overdue">Pagamento Atrasado</option>
                        <option value="churn_risk">Risco de Churn</option>
                        <option value="anniversary">Aniversário</option>
                      </select>
                    </div>
                  )}

                  {node.type === 'action' && (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Ação</label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                          <option value="email">Enviar Email</option>
                          <option value="whatsapp">Enviar WhatsApp</option>
                          <option value="sms">Enviar SMS</option>
                          <option value="task">Criar Tarefa</option>
                          <option value="call">Agendar Ligação</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Template</label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                          <option value="welcome">Boas-vindas</option>
                          <option value="renewal">Renovação</option>
                          <option value="retention">Retenção</option>
                          <option value="payment_reminder">Lembrete de Pagamento</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {node.type === 'condition' && (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Campo</label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                          <option value="ltv">LTV</option>
                          <option value="satisfaction">Satisfação</option>
                          <option value="payment_behavior">Comportamento de Pagamento</option>
                          <option value="engagement">Engajamento</option>
                          <option value="months_as_client">Meses como Cliente</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Operador</label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                          <option value=">">Maior que</option>
                          <option value="<">Menor que</option>
                          <option value="=">Igual a</option>
                          <option value="!=">Diferente de</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Valor</label>
                        <input
                          type="text"
                          placeholder="Ex: 100000"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  )}

                  {node.type === 'delay' && (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Duração</label>
                        <input
                          type="number"
                          placeholder="Ex: 24"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Unidade</label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                          <option value="minutes">Minutos</option>
                          <option value="hours">Horas</option>
                          <option value="days">Dias</option>
                          <option value="weeks">Semanas</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
};