import React, { useState } from 'react';
import { 
  Mail, 
  MessageSquare, 
  Phone, 
  Eye, 
  Save, 
  Copy, 
  Trash2, 
  Plus,
  Image,
  Link,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  Hash,
  Smile,
  Paperclip,
  Send,
  Palette,
  Type,
  Layout,
  Zap,
  Star,
  Heart,
  Gift,
  Calendar,
  Clock,
  User,
  Building,
  DollarSign,
  FileText,
  CheckCircle,
  AlertCircle,
  Filter
} from 'lucide-react';
import { HTMLEditor } from '../common/HTMLEditor';

interface Template {
  id: string;
  name: string;
  description: string;
  type: 'email' | 'whatsapp';
  category: 'welcome' | 'renewal' | 'retention' | 'payment' | 'anniversary' | 'satisfaction';
  subject?: string;
  content: string;
  variables: string[];
  isActive: boolean;
  lastUsed?: string;
  successRate?: number;
  openRate?: number;
  responseRate?: number;
}

const mockTemplates: Template[] = [
  {
    id: '1',
    name: 'Boas-vindas Premium',
    description: 'Template de boas-vindas para clientes premium',
    type: 'email',
    category: 'welcome',
    subject: 'Bem-vindo ao {empresa_nome}, {cliente_nome}! 🎉',
    content: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 28px;">Bem-vindo, {cliente_nome}! 🎉</h1>
          <p style="margin: 10px 0 0; font-size: 16px; opacity: 0.9;">Estamos muito felizes em tê-lo conosco</p>
        </div>
        
        <div style="padding: 30px 20px;">
          <p style="font-size: 16px; line-height: 1.6; color: #333;">
            Olá <strong>{cliente_representante}</strong>,
          </p>
          
          <p style="font-size: 16px; line-height: 1.6; color: #333;">
            É com grande satisfação que damos as boas-vindas à <strong>{cliente_nome}</strong> 
            à família {empresa_nome}! 
          </p>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #667eea; margin-top: 0;">🚀 Seu serviço está ativo:</h3>
            <p style="margin: 10px 0;"><strong>Serviço:</strong> {servico_nome}</p>
            <p style="margin: 10px 0;"><strong>Valor:</strong> {servico_preco} MT</p>
            <p style="margin: 10px 0;"><strong>Validade:</strong> {servico_validade} meses</p>
            <p style="margin: 10px 0;"><strong>Próxima renovação:</strong> {data_renovacao}</p>
          </div>
          
          <p style="font-size: 16px; line-height: 1.6; color: #333;">
            Nosso gestor <strong>{gestor_nome}</strong> estará sempre disponível para ajudá-lo.
            Pode contactá-lo através do email {gestor_email} ou telefone {gestor_telefone}.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="#" style="background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">
              Aceder ao Portal do Cliente
            </a>
          </div>
        </div>
        
        <div style="background: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #e9ecef;">
          <p style="margin: 0; color: #6c757d; font-size: 14px;">
            {empresa_nome} • {empresa_endereco} • {empresa_telefone}
          </p>
        </div>
      </div>
    `,
    variables: ['{cliente_nome}', '{cliente_representante}', '{empresa_nome}', '{servico_nome}', '{servico_preco}', '{gestor_nome}'],
    isActive: true,
    lastUsed: '2024-03-30',
    successRate: 94.2,
    openRate: 87.3,
    responseRate: 23.1
  },
  {
    id: '2',
    name: 'Lembrete de Renovação WhatsApp',
    description: 'Lembrete amigável via WhatsApp',
    type: 'whatsapp',
    category: 'renewal',
    content: `🔔 *Lembrete Importante* 🔔

Olá {cliente_representante}! 👋

Seu serviço *{servico_nome}* da {cliente_nome} expira em *{dias_restantes} dias* ({data_expiracao}).

💰 *Valor da renovação:* {servico_preco} MT
⏰ *Validade:* {servico_validade} meses

Para renovar, responda esta mensagem ou ligue para {empresa_telefone}.

Obrigado pela confiança! 🙏
*{empresa_nome}*`,
    variables: ['{cliente_nome}', '{cliente_representante}', '{servico_nome}', '{dias_restantes}', '{servico_preco}'],
    isActive: true,
    lastUsed: '2024-03-29',
    successRate: 91.8,
    openRate: 98.5,
    responseRate: 45.2
  },
  {
    id: '3',
    name: 'Oferta de Retenção',
    description: 'Template para clientes em risco de churn',
    type: 'email',
    category: 'retention',
    subject: '🎁 Oferta Especial para {cliente_nome} - Não Perca!',
    content: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%); padding: 40px 20px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 28px;">🎁 Oferta Especial!</h1>
          <p style="margin: 10px 0 0; font-size: 16px; opacity: 0.9;">Exclusiva para {cliente_nome}</p>
        </div>
        
        <div style="padding: 30px 20px;">
          <p style="font-size: 16px; line-height: 1.6; color: #333;">
            Caro <strong>{cliente_representante}</strong>,
          </p>
          
          <p style="font-size: 16px; line-height: 1.6; color: #333;">
            Notamos que você não renovou seu serviço <strong>{servico_nome}</strong> 
            e queremos oferecer uma condição especial para mantê-lo conosco.
          </p>
          
          <div style="background: #fff3cd; border: 2px solid #ffc107; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
            <h3 style="color: #856404; margin-top: 0;">🔥 DESCONTO ESPECIAL DE 30%</h3>
            <p style="margin: 10px 0; font-size: 18px;"><strong>De:</strong> <span style="text-decoration: line-through;">{servico_preco} MT</span></p>
            <p style="margin: 10px 0; font-size: 24px; color: #28a745;"><strong>Por apenas:</strong> {servico_preco_desconto} MT</p>
            <p style="margin: 10px 0; color: #856404;">Válido até {data_limite_oferta}</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="#" style="background: #28a745; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
              💚 ACEITAR OFERTA AGORA
            </a>
          </div>
          
          <p style="font-size: 14px; color: #6c757d; text-align: center;">
            Dúvidas? Contacte {gestor_nome} em {gestor_telefone}
          </p>
        </div>
      </div>
    `,
    variables: ['{cliente_nome}', '{cliente_representante}', '{servico_nome}', '{servico_preco}', '{servico_preco_desconto}'],
    isActive: true,
    lastUsed: '2024-03-28',
    successRate: 76.4,
    openRate: 82.1,
    responseRate: 34.7
  }
];

const templateCategories = [
  { id: 'welcome', label: 'Boas-vindas', icon: Gift, color: 'bg-green-100 text-green-800' },
  { id: 'renewal', label: 'Renovação', icon: Calendar, color: 'bg-blue-100 text-blue-800' },
  { id: 'retention', label: 'Retenção', icon: Heart, color: 'bg-red-100 text-red-800' },
  { id: 'payment', label: 'Pagamento', icon: DollarSign, color: 'bg-yellow-100 text-yellow-800' },
  { id: 'anniversary', label: 'Aniversário', icon: Star, color: 'bg-purple-100 text-purple-800' },
  { id: 'satisfaction', label: 'Satisfação', icon: Smile, color: 'bg-pink-100 text-pink-800' }
];

const availableVariables = [
  { category: 'Cliente', variables: [
    { key: '{cliente_nome}', description: 'Nome da empresa cliente' },
    { key: '{cliente_representante}', description: 'Nome do representante' },
    { key: '{cliente_email}', description: 'Email do cliente' },
    { key: '{cliente_telefone}', description: 'Telefone do cliente' },
    { key: '{cliente_nuit}', description: 'NUIT do cliente' },
    { key: '{cliente_endereco}', description: 'Endereço do cliente' }
  ]},
  { category: 'Serviço', variables: [
    { key: '{servico_nome}', description: 'Nome do serviço' },
    { key: '{servico_descricao}', description: 'Descrição do serviço' },
    { key: '{servico_preco}', description: 'Preço do serviço' },
    { key: '{servico_preco_desconto}', description: 'Preço com desconto' },
    { key: '{servico_validade}', description: 'Validade em meses' }
  ]},
  { category: 'Empresa', variables: [
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
    { key: '{data_renovacao}', description: 'Data de renovação' },
    { key: '{data_limite_oferta}', description: 'Data limite da oferta' }
  ]}
];

export const TemplateEditor: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [templateContent, setTemplateContent] = useState('');
  const [templateSubject, setTemplateSubject] = useState('');
  const [previewMode, setPreviewMode] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<'all' | 'email' | 'whatsapp'>('all');
  const [newTemplateType, setNewTemplateType] = useState<'email' | 'whatsapp'>('email');

  const filteredTemplates = mockTemplates.filter(template => {
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    const matchesType = selectedType === 'all' || template.type === selectedType;
    return matchesCategory && matchesType;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'email':
        return <Mail className="text-blue-600" size={16} />;
      case 'whatsapp':
        return <MessageSquare className="text-green-600" size={16} />;
      default:
        return <FileText className="text-gray-600" size={16} />;
    }
  };

  const getCategoryBadge = (category: string) => {
    const cat = templateCategories.find(c => c.id === category);
    if (!cat) return null;
    
    const Icon = cat.icon;
    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${cat.color} flex items-center gap-1`}>
        <Icon size={12} />
        {cat.label}
      </span>
    );
  };

  const handleEditTemplate = (template: Template) => {
    setSelectedTemplate(template);
    setTemplateContent(template.content);
    setTemplateSubject(template.subject || '');
    setIsEditing(true);
  };

  const handleCreateTemplate = () => {
    setSelectedTemplate(null);
    setTemplateContent('');
    setTemplateSubject('');
    setNewTemplateType('email');
    setIsEditing(true);
  };

  const handleSaveTemplate = () => {
    if (!templateContent.trim()) {
      alert('O conteúdo do template não pode estar vazio');
      return;
    }

    const templateName = prompt('Nome do template:');
    if (!templateName) return;

    const templateType = selectedTemplate?.type || newTemplateType;
    alert(`✅ Template "${templateName}" salvo com sucesso!\n\n📧 Tipo: ${templateType === 'email' ? 'Email' : 'WhatsApp'}\n📝 Conteúdo: ${templateContent.length} caracteres\n🔤 Variáveis: ${templateContent.match(/\{[^}]+\}/g)?.length || 0}\n📅 Salvo em: ${new Date().toLocaleString('pt-PT')}\n🟢 Status: Ativo`);
    
    setIsEditing(false);
    setSelectedTemplate(null);
  };

  const insertVariable = (variable: string) => {
    setTemplateContent(templateContent + ' ' + variable);
  };

  const previewTemplate = () => {
    // Replace variables with sample data for preview
    let preview = templateContent;
    const sampleData = {
      '{cliente_nome}': 'Transportes Maputo Lda',
      '{cliente_representante}': 'João Macamo',
      '{cliente_email}': 'joao@transportesmaputo.mz',
      '{empresa_nome}': 'TechSolutions Lda',
      '{servico_nome}': 'Contabilidade Mensal',
      '{servico_preco}': '5.000',
      '{servico_validade}': '12',
      '{gestor_nome}': 'Maria Santos',
      '{gestor_telefone}': '+258 84 123 4567',
      '{dias_restantes}': '30',
      '{data_expiracao}': '31/12/2024'
    };

    Object.entries(sampleData).forEach(([key, value]) => {
      preview = preview.replace(new RegExp(key.replace(/[{}]/g, '\\$&'), 'g'), value);
    });

    return preview;
  };

  if (isEditing) {
    return (
      <div className="h-screen flex flex-col">
        {/* Editor Header */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsEditing(false)}
                className="text-gray-600 hover:text-gray-900"
              >
                ← Voltar
              </button>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {selectedTemplate ? `Editando: ${selectedTemplate.name}` : 'Novo Template'}
                </h3>
                <p className="text-sm text-gray-600">
                  {selectedTemplate?.type || 'Email'} • {templateContent.length} caracteres
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setPreviewMode(!previewMode)}
                className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <Eye size={16} />
                {previewMode ? 'Editor' : 'Preview'}
              </button>
              <button
                onClick={handleSaveTemplate}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <Save size={16} />
                Salvar
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 flex">
          {/* Editor */}
          <div className="flex-1 p-6">
            {!previewMode ? (
              <div className="space-y-4">
                {/* Subject (for email) */}
                {(selectedTemplate?.type === 'email' || !selectedTemplate) && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Assunto</label>
                    <input
                      type="text"
                      value={templateSubject}
                      onChange={(e) => setTemplateSubject(e.target.value)}
                      placeholder="Ex: Bem-vindo ao {empresa_nome}, {cliente_nome}!"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                )}

                {/* Content Editor */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Conteúdo</label>
                  {selectedTemplate?.type === 'email' || !selectedTemplate ? (
                    <HTMLEditor
                      value={templateContent}
                      onChange={setTemplateContent}
                      placeholder="Digite o conteúdo do seu template aqui..."
                      height="400px"
                    />
                  ) : (
                    <textarea
                      value={templateContent}
                      onChange={(e) => setTemplateContent(e.target.value)}
                      placeholder="Digite sua mensagem aqui..."
                      rows={15}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                    />
                  )}
                </div>
              </div>
            ) : (
              /* Preview Mode */
              <div className="space-y-4">
                <div className="bg-gray-100 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Preview com Dados de Exemplo</h4>
                  {templateSubject && (
                    <div className="mb-4">
                      <strong>Assunto:</strong> {templateSubject.replace(/\{[^}]+\}/g, (match) => {
                        const sampleData: any = {
                          '{empresa_nome}': 'TechSolutions Lda',
                          '{cliente_nome}': 'Transportes Maputo Lda'
                        };
                        return sampleData[match] || match;
                      })}
                    </div>
                  )}
                </div>
                
                <div className="border border-gray-300 rounded-lg p-4 bg-white">
                  {selectedTemplate?.type === 'email' || !selectedTemplate ? (
                    <div dangerouslySetInnerHTML={{ __html: previewTemplate() }} />
                  ) : (
                    <div className="whitespace-pre-wrap font-mono text-sm">
                      {previewTemplate()}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Variables Panel */}
          <div className="w-80 bg-white border-l border-gray-200 p-4">
            <h4 className="font-semibold text-gray-900 mb-4">Variáveis Disponíveis</h4>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {availableVariables.map((category) => (
                <div key={category.category}>
                  <h5 className="font-medium text-gray-800 mb-2">{category.category}</h5>
                  <div className="space-y-1">
                    {category.variables.map((variable) => (
                      <div key={variable.key} className="flex items-start gap-2">
                        <button
                          onClick={() => insertVariable(variable.key)}
                          className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded hover:bg-blue-200 transition-colors font-mono"
                        >
                          {variable.key}
                        </button>
                        <span className="text-xs text-gray-600 flex-1">{variable.description}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Template Stats */}
            {selectedTemplate && (
              <div className="mt-6 pt-4 border-t border-gray-200">
                <h5 className="font-medium text-gray-800 mb-3">Estatísticas</h5>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Taxa de Sucesso:</span>
                    <span className="font-medium text-green-600">{selectedTemplate.successRate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Taxa de Abertura:</span>
                    <span className="font-medium text-blue-600">{selectedTemplate.openRate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Taxa de Resposta:</span>
                    <span className="font-medium text-purple-600">{selectedTemplate.responseRate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Último Uso:</span>
                    <span className="font-medium text-gray-900">
                      {selectedTemplate.lastUsed ? new Date(selectedTemplate.lastUsed).toLocaleDateString('pt-PT') : 'Nunca'}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Layout className="text-blue-600" size={28} />
            Editor de Templates
          </h2>
          <p className="text-gray-600">Crie templates personalizados para Email, WhatsApp e SMS</p>
        </div>
        <button
          onClick={handleCreateTemplate}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-semibold"
        >
          <Plus size={20} />
          Novo Template
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <Filter className="text-gray-400" size={20} />
              <span className="text-sm font-medium text-gray-700">Filtros:</span>
            </div>
            
            {/* Type Filter */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              {[
                { type: 'all', label: 'Todos', icon: FileText },
                { type: 'email', label: 'Email', icon: Mail },
                { type: 'whatsapp', label: 'WhatsApp', icon: MessageSquare }
              ].map((option) => {
                const Icon = option.icon;
                return (
                  <button
                    key={option.type}
                    onClick={() => setSelectedType(option.type as any)}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
                      selectedType === option.type
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Icon size={14} />
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>
          
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Todas as Categorias</option>
            {templateCategories.map((category) => (
              <option key={category.id} value={category.id}>{category.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <div key={template.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  {getTypeIcon(template.type)}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{template.name}</h3>
                  <p className="text-sm text-gray-600">{template.description}</p>
                </div>
              </div>
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                template.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {template.isActive ? 'Ativo' : 'Inativo'}
              </span>
            </div>

            <div className="mb-4">
              {getCategoryBadge(template.category)}
            </div>

            {/* Performance Metrics */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="text-center">
                <div className="text-lg font-bold text-green-600">{template.successRate}%</div>
                <div className="text-xs text-gray-600">Sucesso</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-blue-600">{template.openRate}%</div>
                <div className="text-xs text-gray-600">Abertura</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-purple-600">{template.responseRate}%</div>
                <div className="text-xs text-gray-600">Resposta</div>
              </div>
            </div>

            {/* Variables Used */}
            <div className="mb-4">
              <p className="text-xs font-medium text-gray-700 mb-2">Variáveis ({template.variables.length}):</p>
              <div className="flex flex-wrap gap-1">
                {template.variables.slice(0, 3).map((variable, idx) => (
                  <span key={idx} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded font-mono">
                    {variable}
                  </span>
                ))}
                {template.variables.length > 3 && (
                  <span className="text-xs text-gray-500">+{template.variables.length - 3}</span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => handleEditTemplate(template)}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <Eye size={16} />
                Editar
              </button>
              <button className="border border-gray-300 text-gray-700 py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors">
                <Copy size={16} />
              </button>
              <button className="border border-red-300 text-red-600 py-2 px-3 rounded-lg hover:bg-red-50 transition-colors">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Template Performance Analytics */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Performance dos Templates</h3>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="text-green-600" size={24} />
            </div>
            <div className="text-2xl font-bold text-green-600">
              {(mockTemplates.reduce((sum, t) => sum + (t.successRate || 0), 0) / mockTemplates.length).toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600">Taxa de Sucesso Média</div>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Eye className="text-blue-600" size={24} />
            </div>
            <div className="text-2xl font-bold text-blue-600">
              {(mockTemplates.reduce((sum, t) => sum + (t.openRate || 0), 0) / mockTemplates.length).toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600">Taxa de Abertura Média</div>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Send className="text-purple-600" size={24} />
            </div>
            <div className="text-2xl font-bold text-purple-600">
              {(mockTemplates.reduce((sum, t) => sum + (t.responseRate || 0), 0) / mockTemplates.length).toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600">Taxa de Resposta Média</div>
          </div>
        </div>
      </div>
    </div>
  );
};