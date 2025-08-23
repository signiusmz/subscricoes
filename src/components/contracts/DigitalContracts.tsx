import React, { useState } from 'react';
import { 
  FileText, 
  Plus, 
  Edit, 
  Trash2, 
  Download, 
  Send, 
  Eye, 
  CheckCircle, 
  Clock, 
  User, 
  Building,
  Calendar,
  DollarSign,
  Search,
  Filter,
  RefreshCw,
  PenTool,
  Save,
  Copy,
  Layout,
  Code,
  Type,
  Palette
} from 'lucide-react';
import { PDFGenerator } from '../../utils/pdfGenerator';
import { useAuth } from '../../context/AuthContext';
import { HTMLEditor } from '../common/HTMLEditor';
import { Pagination } from '../common/Pagination';

interface Contract {
  id: string;
  number: string;
  clientId: string;
  clientName: string;
  title: string;
  content: string;
  value: number;
  startDate: string;
  endDate: string;
  status: 'draft' | 'sent' | 'signed' | 'cancelled';
  createdAt: string;
  signedAt?: string;
  signatureHash?: string;
  templateId?: string;
  salespersonId?: string;
  salespersonName?: string;
}

interface ContractTemplate {
  id: string;
  name: string;
  description: string;
  category: 'service' | 'maintenance' | 'consulting' | 'general';
  content: string;
  variables: string[];
  isActive: boolean;
  createdAt: string;
  lastUsed?: string;
  usageCount: number;
}

const mockTemplates: ContractTemplate[] = [
  {
    id: '1',
    name: 'Prestação de Serviços Contábeis',
    description: 'Template padrão para contratos de serviços contábeis',
    category: 'service',
    content: `
      <div style="max-width: 800px; margin: 0 auto; font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="text-align: center; border-bottom: 3px solid #2563eb; padding-bottom: 20px; margin-bottom: 30px;">
          <h1 style="color: #2563eb; margin: 0; font-size: 24px;">CONTRATO DE PRESTAÇÃO DE SERVIÇOS</h1>
          <p style="margin: 10px 0 0; color: #666; font-size: 16px;">Número: {contrato_numero}</p>
        </div>

        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
          <h3 style="color: #1e40af; margin-top: 0;">PARTES CONTRATANTES</h3>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
            <div>
              <h4 style="color: #374151; margin-bottom: 10px;">CONTRATANTE:</h4>
              <p><strong>{cliente_nome}</strong></p>
              <p>NUIT: {cliente_nuit}</p>
              <p>Endereço: {cliente_endereco}</p>
              <p>Email: {cliente_email}</p>
              <p>Telefone: {cliente_telefone}</p>
            </div>
            <div>
              <h4 style="color: #374151; margin-bottom: 10px;">CONTRATADA:</h4>
              <p><strong>{empresa_nome}</strong></p>
              <p>NUIT: {empresa_nuit}</p>
              <p>Endereço: {empresa_endereco}</p>
              <p>Email: {empresa_email}</p>
              <p>Telefone: {empresa_telefone}</p>
            </div>
          </div>
        </div>

        <div style="margin-bottom: 25px;">
          <h3 style="color: #1e40af;">OBJETO DO CONTRATO</h3>
          <p>A CONTRATADA compromete-se a prestar os seguintes serviços contábeis:</p>
          <div style="background: #ecfdf5; padding: 15px; border-radius: 8px; border-left: 4px solid #10b981;">
            {servicos_lista}
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 25px;">
          <div style="background: #fef3c7; padding: 15px; border-radius: 8px;">
            <h4 style="color: #92400e; margin-top: 0;">VALOR DO CONTRATO</h4>
            <p style="font-size: 18px; font-weight: bold; color: #92400e;">{contrato_valor} MT</p>
            <p style="font-size: 14px; color: #78350f;">({contrato_valor_extenso})</p>
          </div>
          <div style="background: #e0e7ff; padding: 15px; border-radius: 8px;">
            <h4 style="color: #3730a3; margin-top: 0;">VIGÊNCIA</h4>
            <p><strong>Início:</strong> {contrato_data_inicio}</p>
            <p><strong>Término:</strong> {contrato_data_fim}</p>
            <p><strong>Duração:</strong> 12 meses</p>
          </div>
        </div>

        <div style="margin-bottom: 25px;">
          <h3 style="color: #1e40af;">RESPONSABILIDADES</h3>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
            <div>
              <h4 style="color: #374151;">DA CONTRATADA:</h4>
              <ul style="padding-left: 20px;">
                <li>Executar os serviços com qualidade e pontualidade</li>
                <li>Manter sigilo das informações</li>
                <li>Cumprir prazos estabelecidos</li>
                <li>Fornecer relatórios mensais</li>
              </ul>
            </div>
            <div>
              <h4 style="color: #374151;">DO CONTRATANTE:</h4>
              <ul style="padding-left: 20px;">
                <li>Fornecer documentação necessária</li>
                <li>Efetuar pagamentos em dia</li>
                <li>Colaborar com informações solicitadas</li>
                <li>Comunicar alterações relevantes</li>
              </ul>
            </div>
          </div>
        </div>

        <div style="background: #f1f5f9; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
          <h3 style="color: #1e40af; margin-top: 0;">CONDIÇÕES GERAIS</h3>
          <p>Este contrato é regido pela legislação moçambicana e qualquer litígio será resolvido pelos tribunais competentes de Maputo.</p>
          <p>O presente contrato entra em vigor na data de assinatura e permanece válido pelo período estabelecido.</p>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-top: 50px; padding-top: 30px; border-top: 2px solid #e5e7eb;">
          <div style="text-align: center;">
            <div style="border-bottom: 1px solid #333; margin-bottom: 10px; padding-bottom: 5px;">
              <strong>{cliente_nome}</strong>
            </div>
            <p style="margin: 0; font-size: 14px; color: #666;">CONTRATANTE</p>
            <p style="margin: 5px 0 0; font-size: 12px; color: #999;">Data: ___/___/______</p>
          </div>
          <div style="text-align: center;">
            <div style="border-bottom: 1px solid #333; margin-bottom: 10px; padding-bottom: 5px;">
              <strong>{gestor_nome}</strong>
            </div>
            <p style="margin: 0; font-size: 14px; color: #666;">CONTRATADA</p>
            <p style="margin: 5px 0 0; font-size: 12px; color: #999;">Data: ___/___/______</p>
          </div>
        </div>

        <div style="margin-top: 30px; padding: 15px; background: #f8fafc; border-radius: 8px; text-align: center;">
          <p style="margin: 0; font-size: 12px; color: #64748b;">
            Documento gerado pelo Sistema Signius em {data_geracao}
          </p>
        </div>
      </div>
    `,
    variables: ['{contrato_numero}', '{cliente_nome}', '{cliente_nuit}', '{empresa_nome}', '{contrato_valor}', '{servicos_lista}'],
    isActive: true,
    createdAt: '2024-01-15',
    lastUsed: '2024-03-30',
    usageCount: 15
  },
  {
    id: '2',
    name: 'Manutenção Predial',
    description: 'Template para contratos de manutenção de edifícios',
    category: 'maintenance',
    content: `
      <div style="max-width: 800px; margin: 0 auto; font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="text-align: center; border-bottom: 3px solid #059669; padding-bottom: 20px; margin-bottom: 30px;">
          <h1 style="color: #059669; margin: 0; font-size: 24px;">CONTRATO DE MANUTENÇÃO PREDIAL</h1>
          <p style="margin: 10px 0 0; color: #666; font-size: 16px;">Número: {contrato_numero}</p>
        </div>

        <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin-bottom: 25px; border-left: 4px solid #22c55e;">
          <h3 style="color: #166534; margin-top: 0;">SERVIÇOS DE MANUTENÇÃO</h3>
          <p>A CONTRATADA prestará serviços de manutenção preventiva e corretiva conforme especificado:</p>
          {servicos_lista}
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 25px;">
          <div style="background: #fef3c7; padding: 15px; border-radius: 8px;">
            <h4 style="color: #92400e; margin-top: 0;">VALOR MENSAL</h4>
            <p style="font-size: 18px; font-weight: bold; color: #92400e;">{contrato_valor} MT</p>
          </div>
          <div style="background: #e0e7ff; padding: 15px; border-radius: 8px;">
            <h4 style="color: #3730a3; margin-top: 0;">PERIODICIDADE</h4>
            <p>Manutenção preventiva: Mensal</p>
            <p>Manutenção corretiva: Conforme necessário</p>
          </div>
        </div>

        <div style="margin-top: 50px; display: grid; grid-template-columns: 1fr 1fr; gap: 40px; padding-top: 30px; border-top: 2px solid #e5e7eb;">
          <div style="text-align: center;">
            <div style="border-bottom: 1px solid #333; margin-bottom: 10px; padding-bottom: 5px;">
              <strong>{cliente_nome}</strong>
            </div>
            <p style="margin: 0; font-size: 14px; color: #666;">CONTRATANTE</p>
          </div>
          <div style="text-align: center;">
            <div style="border-bottom: 1px solid #333; margin-bottom: 10px; padding-bottom: 5px;">
              <strong>{gestor_nome}</strong>
            </div>
            <p style="margin: 0; font-size: 14px; color: #666;">CONTRATADA</p>
          </div>
        </div>
      </div>
    `,
    variables: ['{contrato_numero}', '{cliente_nome}', '{empresa_nome}', '{contrato_valor}', '{servicos_lista}'],
    isActive: true,
    createdAt: '2024-01-20',
    usageCount: 8
  },
  {
    id: '3',
    name: 'Consultoria Empresarial',
    description: 'Template para contratos de consultoria e assessoria',
    category: 'consulting',
    content: `
      <div style="max-width: 800px; margin: 0 auto; font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="text-align: center; border-bottom: 3px solid #7c3aed; padding-bottom: 20px; margin-bottom: 30px;">
          <h1 style="color: #7c3aed; margin: 0; font-size: 24px;">CONTRATO DE CONSULTORIA EMPRESARIAL</h1>
          <p style="margin: 10px 0 0; color: #666; font-size: 16px;">Número: {contrato_numero}</p>
        </div>

        <div style="background: #faf5ff; padding: 20px; border-radius: 8px; margin-bottom: 25px; border-left: 4px solid #8b5cf6;">
          <h3 style="color: #6b21a8; margin-top: 0;">ESCOPO DA CONSULTORIA</h3>
          <p>A CONTRATADA prestará serviços especializados de consultoria empresarial:</p>
          {servicos_lista}
        </div>

        <div style="margin-top: 50px; display: grid; grid-template-columns: 1fr 1fr; gap: 40px; padding-top: 30px; border-top: 2px solid #e5e7eb;">
          <div style="text-align: center;">
            <div style="border-bottom: 1px solid #333; margin-bottom: 10px; padding-bottom: 5px;">
              <strong>{cliente_nome}</strong>
            </div>
            <p style="margin: 0; font-size: 14px; color: #666;">CONTRATANTE</p>
          </div>
          <div style="text-align: center;">
            <div style="border-bottom: 1px solid #333; margin-bottom: 10px; padding-bottom: 5px;">
              <strong>{gestor_nome}</strong>
            </div>
            <p style="margin: 0; font-size: 14px; color: #666;">CONTRATADA</p>
          </div>
        </div>
      </div>
    `,
    variables: ['{contrato_numero}', '{cliente_nome}', '{empresa_nome}', '{contrato_valor}', '{servicos_lista}'],
    isActive: true,
    createdAt: '2024-02-01',
    usageCount: 5
  }
];

const mockContracts: Contract[] = [
  {
    id: '1',
    number: 'CONT-2024-001',
    clientId: '1',
    clientName: 'Transportes Maputo Lda',
    title: 'Contrato de Contabilidade Mensal',
    content: '<p>Contrato de prestação de serviços contábeis...</p>',
    value: 60000,
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    status: 'signed',
    createdAt: '2024-01-01',
    signedAt: '2024-01-05',
    signatureHash: 'abc123def456',
    templateId: '1',
    salespersonId: '1',
    salespersonName: 'João Silva'
  },
  {
    id: '2',
    number: 'CONT-2024-002',
    clientId: '2',
    clientName: 'Construções Beira SA',
    title: 'Contrato de Auditoria Anual',
    content: '<p>Contrato de auditoria externa...</p>',
    value: 180000,
    startDate: '2024-02-01',
    endDate: '2025-01-31',
    status: 'sent',
    createdAt: '2024-02-01',
    templateId: '1',
    salespersonId: '2',
    salespersonName: 'Maria Santos'
  }
];

const mockClients = [
  { id: '1', companyName: 'Transportes Maputo Lda', representative: 'João Macamo', email: 'joao@transportesmaputo.mz', nuit: '400567890', address: 'Av. Eduardo Mondlane, 567, Maputo', phone: '+258 84 123 4567' },
  { id: '2', companyName: 'Construções Beira SA', representative: 'Maria Santos', email: 'maria@construcoesbeira.mz', nuit: '400123789', address: 'Rua da Independência, 123, Beira', phone: '+258 85 987 6543' },
  { id: '3', companyName: 'Hotel Polana', representative: 'Carlos Mendes', email: 'carlos@hotelpolana.mz', nuit: '400111222', address: 'Av. Julius Nyerere, 1380, Maputo', phone: '+258 87 444 5555' },
  { id: '4', companyName: 'Farmácia Central', representative: 'António Silva', email: 'antonio@farmaciacentral.mz', nuit: '400987654', address: 'Praça da Independência, 45, Nampula', phone: '+258 86 555 7777' }
];

const mockSubscriptions = [
  { id: '1', clientId: '1', serviceId: '1', serviceName: 'Contabilidade Mensal', totalWithIva: 5800 },
  { id: '2', clientId: '2', serviceId: '2', serviceName: 'Auditoria Anual', totalWithIva: 17400 },
  { id: '3', clientId: '3', serviceId: '3', serviceName: 'Consultoria Fiscal', totalWithIva: 10440 }
];

const mockUsers = [
  { id: '1', name: 'João Silva', email: 'joao@techsolutions.mz', role: 'admin' },
  { id: '2', name: 'Maria Santos', email: 'maria@techsolutions.mz', role: 'manager' },
  { id: '3', name: 'Carlos Mendes', email: 'carlos@techsolutions.mz', role: 'user' }
];

const availableVariables = [
  { category: 'Contrato', variables: [
    { key: '{contrato_numero}', description: 'Número do contrato' },
    { key: '{contrato_valor}', description: 'Valor total do contrato' },
    { key: '{contrato_valor_extenso}', description: 'Valor por extenso' },
    { key: '{contrato_data_inicio}', description: 'Data de início' },
    { key: '{contrato_data_fim}', description: 'Data de término' },
    { key: '{data_geracao}', description: 'Data de geração do documento' }
  ]},
  { category: 'Cliente', variables: [
    { key: '{cliente_nome}', description: 'Nome da empresa cliente' },
    { key: '{cliente_representante}', description: 'Nome do representante' },
    { key: '{cliente_email}', description: 'Email do cliente' },
    { key: '{cliente_telefone}', description: 'Telefone do cliente' },
    { key: '{cliente_nuit}', description: 'NUIT do cliente' },
    { key: '{cliente_endereco}', description: 'Endereço do cliente' }
  ]},
  { category: 'Empresa', variables: [
    { key: '{empresa_nome}', description: 'Nome da sua empresa' },
    { key: '{empresa_email}', description: 'Email da sua empresa' },
    { key: '{empresa_telefone}', description: 'Telefone da sua empresa' },
    { key: '{empresa_endereco}', description: 'Endereço da sua empresa' },
    { key: '{empresa_nuit}', description: 'NUIT da sua empresa' },
    { key: '{gestor_nome}', description: 'Nome do gestor/vendedor' },
    { key: '{gestor_email}', description: 'Email do gestor' },
    { key: '{gestor_telefone}', description: 'Telefone do gestor' }
  ]},
  { category: 'Serviços', variables: [
    { key: '{servicos_lista}', description: 'Lista completa de serviços' },
    { key: '{servico_principal}', description: 'Serviço principal' },
    { key: '{servico_contabilidade}', description: 'Serviços de contabilidade' },
    { key: '{servico_auditoria}', description: 'Serviços de auditoria' },
    { key: '{servico_consultoria}', description: 'Serviços de consultoria' }
  ]}
];

export const DigitalContracts: React.FC = () => {
  const { user, company } = useAuth();
  const [activeTab, setActiveTab] = useState('contracts');
  const [contracts, setContracts] = useState<Contract[]>(mockContracts);
  const [templates, setTemplates] = useState<ContractTemplate[]>(mockTemplates);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'sent' | 'signed' | 'cancelled'>('all');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'service' | 'maintenance' | 'consulting' | 'general'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [editingContract, setEditingContract] = useState<Contract | null>(null);
  const [editingTemplate, setEditingTemplate] = useState<ContractTemplate | null>(null);
  const [viewingContract, setViewingContract] = useState<Contract | null>(null);
  const [editContent, setEditContent] = useState('');
  const [templateContent, setTemplateContent] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [templatesCurrentPage, setTemplatesCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredContracts = contracts.filter(contract => {
    const matchesSearch = contract.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contract.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contract.title.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || contract.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || template.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  // Pagination
  const contractsTotalPages = Math.ceil(filteredContracts.length / itemsPerPage);
  const contractsStartIndex = (currentPage - 1) * itemsPerPage;
  const paginatedContracts = filteredContracts.slice(contractsStartIndex, contractsStartIndex + itemsPerPage);

  const templatesTotalPages = Math.ceil(filteredTemplates.length / itemsPerPage);
  const templatesStartIndex = (templatesCurrentPage - 1) * itemsPerPage;
  const paginatedTemplates = filteredTemplates.slice(templatesStartIndex, templatesStartIndex + itemsPerPage);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  React.useEffect(() => {
    setTemplatesCurrentPage(1);
  }, [searchTerm, categoryFilter]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-PT');
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Rascunho' },
      sent: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Enviado' },
      signed: { bg: 'bg-green-100', text: 'text-green-800', label: 'Assinado' },
      cancelled: { bg: 'bg-red-100', text: 'text-red-800', label: 'Cancelado' }
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const getCategoryBadge = (category: string) => {
    const categoryConfig = {
      service: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Serviços' },
      maintenance: { bg: 'bg-green-100', text: 'text-green-800', label: 'Manutenção' },
      consulting: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Consultoria' },
      general: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Geral' }
    };
    const config = categoryConfig[category as keyof typeof categoryConfig] || categoryConfig.general;
    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const handleGenerateContract = (clientId: string, templateId?: string) => {
    const client = mockClients.find(c => c.id === clientId);
    if (!client) {
      alert('Cliente não encontrado');
      return;
    }

    const clientSubscriptions = mockSubscriptions.filter(s => s.clientId === clientId);
    if (clientSubscriptions.length === 0) {
      alert(`❌ Não é possível gerar contrato!\n\n👤 Cliente: ${client.companyName}\n⚠️ Motivo: Cliente não possui subscrições ativas\n\n💡 Solução: Primeiro crie uma subscrição para este cliente na aba "Subscrições"`);
      return;
    }

    const totalValue = clientSubscriptions.reduce((sum, sub) => sum + sub.totalWithIva, 0);
    const servicesList = clientSubscriptions.map(sub => `• ${sub.serviceName} - ${sub.totalWithIva.toLocaleString()} MT`).join('\n');

    let contractContent = '';
    let contractTitle = '';

    if (templateId) {
      const template = templates.find(t => t.id === templateId);
      if (template) {
        contractContent = template.content;
        contractTitle = template.name;
        
        // Update template usage
        setTemplates(templates.map(t => 
          t.id === templateId 
            ? { ...t, lastUsed: new Date().toISOString(), usageCount: t.usageCount + 1 }
            : t
        ));
      }
    } else {
      contractTitle = `Contrato de Prestação de Serviços - ${client.companyName}`;
      contractContent = `
        <div style="max-width: 800px; margin: 0 auto; font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h1 style="text-align: center; color: #2563eb;">CONTRATO DE PRESTAÇÃO DE SERVIÇOS</h1>
          <p><strong>Cliente:</strong> ${client.companyName}</p>
          <p><strong>Representante:</strong> ${client.representative}</p>
          <p><strong>Serviços:</strong></p>
          <ul>${clientSubscriptions.map(sub => `<li>${sub.serviceName} - ${sub.totalWithIva.toLocaleString()} MT</li>`).join('')}</ul>
          <p><strong>Valor Total:</strong> ${totalValue.toLocaleString()} MT</p>
        </div>
      `;
    }

    // Replace variables in content
    const replacedContent = replaceVariables(contractContent, client, totalValue, servicesList);

    const newContract: Contract = {
      id: Date.now().toString(),
      number: `CONT-2024-${String(contracts.length + 1).padStart(3, '0')}`,
      clientId: clientId,
      clientName: client.companyName,
      title: contractTitle,
      content: replacedContent,
      value: totalValue,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'draft',
      createdAt: new Date().toISOString(),
      templateId: templateId,
      salespersonId: user?.id,
      salespersonName: user?.name
    };

    setContracts([newContract, ...contracts]);
    alert(`✅ Contrato gerado com sucesso!\n\n📄 Número: ${newContract.number}\n👤 Cliente: ${client.companyName}\n💰 Valor: ${totalValue.toLocaleString()} MT\n📋 Serviços: ${clientSubscriptions.length}\n👨‍💼 Vendedor: ${user?.name}\n📅 Criado em: ${new Date().toLocaleString('pt-PT')}`);
  };

  const replaceVariables = (content: string, client: any, totalValue: number, servicesList: string) => {
    const variables = {
      '{contrato_numero}': `CONT-2024-${String(contracts.length + 1).padStart(3, '0')}`,
      '{cliente_nome}': client.companyName,
      '{cliente_representante}': client.representative,
      '{cliente_email}': client.email,
      '{cliente_telefone}': client.phone,
      '{cliente_nuit}': client.nuit,
      '{cliente_endereco}': client.address,
      '{empresa_nome}': company?.name || 'TechSolutions Lda',
      '{empresa_email}': company?.email || 'admin@techsolutions.mz',
      '{empresa_telefone}': '+258 21 123 456',
      '{empresa_endereco}': company?.address || 'Av. Julius Nyerere, 123, Maputo',
      '{empresa_nuit}': company?.nuit || '400123456',
      '{gestor_nome}': user?.name || 'Gestor Responsável',
      '{gestor_email}': user?.email || 'gestor@techsolutions.mz',
      '{gestor_telefone}': '+258 84 123 4567',
      '{contrato_valor}': totalValue.toLocaleString(),
      '{contrato_valor_extenso}': 'Valor por extenso aqui',
      '{contrato_data_inicio}': new Date().toLocaleDateString('pt-PT'),
      '{contrato_data_fim}': new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-PT'),
      '{servicos_lista}': servicesList,
      '{data_geracao}': new Date().toLocaleDateString('pt-PT')
    };

    let result = content;
    Object.entries(variables).forEach(([key, value]) => {
      result = result.replace(new RegExp(key.replace(/[{}]/g, '\\$&'), 'g'), value);
    });

    return result;
  };

  const handleDownloadContract = (contract: Contract) => {
    PDFGenerator.generateContract({
      number: contract.number,
      clientInfo: mockClients.find(c => c.id === contract.clientId) || mockClients[0],
      title: contract.title,
      content: contract.content,
      value: contract.value,
      startDate: contract.startDate,
      endDate: contract.endDate,
      status: contract.status,
      signedAt: contract.signedAt,
      signatureHash: contract.signatureHash
    });
  };

  const handleViewContract = (contract: Contract) => {
    setViewingContract(contract);
    setShowViewModal(true);
  };

  const handleEditContract = (contract: Contract) => {
    setEditingContract(contract);
    setEditContent(contract.content);
    setShowAddModal(true);
  };

  const handleSendContract = (contractId: string) => {
    setContracts(contracts.map(c => 
      c.id === contractId 
        ? { ...c, status: 'sent' }
        : c
    ));
    alert('Contrato enviado com sucesso!');
  };

  const handleSignContract = (contractId: string) => {
    const signerName = prompt('Para assinar digitalmente, digite seu nome completo:');
    
    if (!signerName || signerName.trim().length < 3) {
      alert('❌ Nome inválido!\n\nPor favor, digite seu nome completo para prosseguir com a assinatura digital.');
      return;
    }
    
    if (confirm(`Confirma a assinatura digital do contrato?\n\n👤 Assinante: ${signerName.trim()}\n📄 Contrato: ${contracts.find(c => c.id === contractId)?.title}\n\n⚠️ Esta ação não pode ser desfeita.`)) {
      const signatureHash = `SIG_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      setContracts(contracts.map(c => 
        c.id === contractId 
          ? { 
              ...c, 
              status: 'signed',
              signedAt: new Date().toISOString(),
              signatureHash: signatureHash,
              signerName: signerName.trim()
            }
          : c
      ));
      alert(`✅ Contrato assinado digitalmente com sucesso!\n\n👤 Assinante: ${signerName.trim()}\n🔐 Hash de Segurança: ${signatureHash}\n📅 Data: ${new Date().toLocaleString('pt-PT')}\n✅ Status: Assinado\n\n📧 Uma cópia foi enviada para o seu email.`);
    }
  };

  const handleSaveContract = (contractData: any) => {
    if (editingContract) {
      setContracts(contracts.map(c => 
        c.id === editingContract.id 
          ? { ...c, ...contractData, content: editContent }
          : c
      ));
      alert('Contrato atualizado com sucesso!');
    }
    setShowAddModal(false);
    setEditingContract(null);
  };

  const handleSaveTemplate = (templateData: any) => {
    if (editingTemplate) {
      setTemplates(templates.map(t => 
        t.id === editingTemplate.id 
          ? { ...t, ...templateData, content: templateContent }
          : t
      ));
      alert(`✅ Template "${templateData.name}" atualizado!\n\n📝 Categoria: ${templateData.category}\n🔤 Variáveis: ${templateContent.match(/\{[^}]+\}/g)?.length || 0}\n📅 Atualizado em: ${new Date().toLocaleString('pt-PT')}`);
    } else {
      const newTemplate: ContractTemplate = {
        id: Date.now().toString(),
        name: templateData.name,
        description: templateData.description,
        category: templateData.category,
        content: templateContent,
        variables: templateContent.match(/\{[^}]+\}/g) || [],
        isActive: true,
        createdAt: new Date().toISOString(),
        usageCount: 0
      };
      setTemplates([newTemplate, ...templates]);
      alert(`✅ Novo template "${newTemplate.name}" criado!\n\n📝 Categoria: ${newTemplate.category}\n🔤 Variáveis: ${newTemplate.variables.length}\n📅 Criado em: ${new Date().toLocaleString('pt-PT')}\n🟢 Status: Ativo`);
    }
    setShowTemplateModal(false);
    setEditingTemplate(null);
    setTemplateContent('');
  };

  const handleDeleteTemplate = (templateId: string) => {
    if (confirm('Tem certeza que deseja eliminar este template?')) {
      setTemplates(templates.filter(t => t.id !== templateId));
      alert('Template eliminado com sucesso!');
    }
  };

  const handleUseTemplate = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (!template) return;

    const clientId = prompt('Selecione o cliente (ID):');
    if (clientId) {
      handleGenerateContract(clientId, templateId);
    }
  };

  const insertVariable = (variable: string) => {
    setTemplateContent(templateContent + ' ' + variable);
  };

  const renderContracts = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Gestão de Contratos</h3>
        <div className="flex gap-3">
          <button 
            onClick={() => {
              const clientId = prompt('ID do Cliente:');
              if (clientId) handleGenerateContract(clientId);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus size={16} />
            Gerar Contrato
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Contratos</p>
              <p className="text-2xl font-bold text-gray-900">{contracts.length}</p>
            </div>
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-blue-100 text-blue-600">
              <FileText size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Assinados</p>
              <p className="text-2xl font-bold text-gray-900">
                {contracts.filter(c => c.status === 'signed').length}
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
              <p className="text-sm font-medium text-gray-600 mb-1">Valor Total</p>
              <p className="text-2xl font-bold text-gray-900">
                {contracts.reduce((total, c) => total + c.value, 0).toLocaleString()} MT
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
              <p className="text-sm font-medium text-gray-600 mb-1">Este Mês</p>
              <p className="text-2xl font-bold text-gray-900">
                {contracts.filter(c => {
                  const contractDate = new Date(c.createdAt);
                  const now = new Date();
                  return contractDate.getMonth() === now.getMonth() && 
                         contractDate.getFullYear() === now.getFullYear();
                }).length}
              </p>
            </div>
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-purple-100 text-purple-600">
              <Calendar size={24} />
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
            placeholder="Pesquisar contratos..."
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
          <option value="draft">Rascunhos</option>
          <option value="sent">Enviados</option>
          <option value="signed">Assinados</option>
          <option value="cancelled">Cancelados</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contrato</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Valor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vendedor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedContracts.map((contract) => (
                <tr key={contract.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{contract.number}</div>
                      <div className="text-sm text-gray-500">{contract.title}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{contract.clientName}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{contract.value.toLocaleString()} MT</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{contract.salespersonName || 'N/A'}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{formatDate(contract.createdAt)}</td>
                  <td className="px-6 py-4">{getStatusBadge(contract.status)}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleViewContract(contract)}
                        className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded"
                        title="Visualizar"
                      >
                        <Eye size={16} />
                      </button>
                      <button 
                        onClick={() => handleDownloadContract(contract)}
                        className="text-green-600 hover:text-green-900 p-1 hover:bg-green-50 rounded"
                        title="Download PDF"
                      >
                        <Download size={16} />
                      </button>
                      <button 
                        onClick={() => handleEditContract(contract)}
                        className="text-purple-600 hover:text-purple-900 p-1 hover:bg-purple-50 rounded"
                        title="Editar"
                      >
                        <Edit size={16} />
                      </button>
                      {contract.status === 'draft' && (
                        <button 
                          onClick={() => handleSendContract(contract.id)}
                          className="text-orange-600 hover:text-orange-900 p-1 hover:bg-orange-50 rounded"
                          title="Enviar"
                        >
                          <Send size={16} />
                        </button>
                      )}
                      {contract.status === 'sent' && (
                        <button 
                          onClick={() => handleSignContract(contract.id)}
                          className="text-green-600 hover:text-green-900 p-1 hover:bg-green-50 rounded"
                          title="Assinar"
                        >
                          <PenTool size={16} />
                        </button>
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
          totalPages={contractsTotalPages}
          onPageChange={setCurrentPage}
          totalItems={filteredContracts.length}
          itemsPerPage={itemsPerPage}
        />
      </div>
    </div>
  );

  const renderTemplates = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Templates de Contratos</h3>
        <button 
          onClick={() => {
            setEditingTemplate(null);
            setTemplateContent('');
            setShowTemplateModal(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus size={16} />
          Novo Template
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Templates</p>
              <p className="text-2xl font-bold text-gray-900">{templates.length}</p>
            </div>
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-blue-100 text-blue-600">
              <Layout size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Templates Ativos</p>
              <p className="text-2xl font-bold text-gray-900">
                {templates.filter(t => t.isActive).length}
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
              <p className="text-sm font-medium text-gray-600 mb-1">Mais Usado</p>
              <p className="text-lg font-bold text-gray-900">
                {templates.reduce((max, t) => t.usageCount > max.usageCount ? t : max, templates[0])?.name || 'N/A'}
              </p>
            </div>
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-purple-100 text-purple-600">
              <Eye size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Variáveis</p>
              <p className="text-2xl font-bold text-gray-900">
                {availableVariables.reduce((sum, cat) => sum + cat.variables.length, 0)}
              </p>
            </div>
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-orange-100 text-orange-600">
              <Code size={24} />
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
            placeholder="Pesquisar templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value as any)}
          className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">Todas as Categorias</option>
          <option value="service">Serviços</option>
          <option value="maintenance">Manutenção</option>
          <option value="consulting">Consultoria</option>
          <option value="general">Geral</option>
        </select>
      </div>

      {/* Templates Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedTemplates.map((template) => (
          <div key={template.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">{template.name}</h4>
                <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                {getCategoryBadge(template.category)}
              </div>
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                template.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {template.isActive ? 'Ativo' : 'Inativo'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center">
                <div className="text-lg font-bold text-gray-900">{template.usageCount}</div>
                <div className="text-xs text-gray-600">Usos</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-gray-900">{template.variables.length}</div>
                <div className="text-xs text-gray-600">Variáveis</div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleUseTemplate(template.id)}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <FileText size={16} />
                Usar
              </button>
              <button
                onClick={() => {
                  setEditingTemplate(template);
                  setTemplateContent(template.content);
                  setShowTemplateModal(true);
                }}
                className="border border-gray-300 text-gray-700 py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Edit size={16} />
              </button>
              <button
                onClick={() => {
                  setTemplateContent(template.content);
                  navigator.clipboard.writeText(template.content);
                  alert('Template copiado para a área de transferência!');
                }}
                className="border border-gray-300 text-gray-700 py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Copy size={16} />
              </button>
              <button
                onClick={() => handleDeleteTemplate(template.id)}
                className="border border-red-300 text-red-600 py-2 px-3 rounded-lg hover:bg-red-50 transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <Pagination
        currentPage={templatesCurrentPage}
        totalPages={templatesTotalPages}
        onPageChange={setTemplatesCurrentPage}
        totalItems={filteredTemplates.length}
        itemsPerPage={itemsPerPage}
      />
    </div>
  );

  const tabs = [
    { id: 'contracts', label: 'Contratos', icon: FileText },
    { id: 'templates', label: 'Templates', icon: Layout }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Contratos Digitais</h2>
        
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
      {activeTab === 'contracts' && renderContracts()}
      {activeTab === 'templates' && renderTemplates()}

      {/* View Contract Modal */}
      {showViewModal && viewingContract && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Visualizar Contrato - {viewingContract.number}
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={() => handleDownloadContract(viewingContract)}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  <Download size={16} />
                  Download PDF
                </button>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Fechar
                </button>
              </div>
            </div>
            
            <div className="border border-gray-300 rounded-lg p-6 bg-white max-h-96 overflow-y-auto">
              <div dangerouslySetInnerHTML={{ __html: viewingContract.content }} />
            </div>
          </div>
        </div>
      )}

      {/* Edit Contract Modal */}
      {showAddModal && editingContract && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Editar Contrato - {editingContract.number}
            </h3>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const contractData = {
                title: formData.get('title') as string,
                value: Number(formData.get('value')),
                startDate: formData.get('startDate') as string,
                endDate: formData.get('endDate') as string
              };
              handleSaveContract(contractData);
            }} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Título</label>
                  <input
                    type="text"
                    name="title"
                    defaultValue={editingContract.title}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Valor (MT)</label>
                  <input
                    type="number"
                    name="value"
                    defaultValue={editingContract.value}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Data de Início</label>
                  <input
                    type="date"
                    name="startDate"
                    defaultValue={editingContract.startDate}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Data de Término</label>
                  <input
                    type="date"
                    name="endDate"
                    defaultValue={editingContract.endDate}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Conteúdo do Contrato</label>
                <HTMLEditor
                  value={editContent}
                  onChange={setEditContent}
                  placeholder="Digite o conteúdo do contrato..."
                  height="400px"
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingContract(null);
                  }}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Salvar Alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Template Modal */}
      {showTemplateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-7xl w-full mx-4 max-h-[95vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {editingTemplate ? 'Editar Template' : 'Novo Template'}
            </h3>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const templateData = {
                name: formData.get('name') as string,
                description: formData.get('description') as string,
                category: formData.get('category') as string
              };
              handleSaveTemplate(templateData);
            }} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nome do Template</label>
                  <input
                    type="text"
                    name="name"
                    defaultValue={editingTemplate?.name || ''}
                    placeholder="Ex: Prestação de Serviços"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Categoria</label>
                  <select
                    name="category"
                    defaultValue={editingTemplate?.category || 'service'}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="service">Serviços</option>
                    <option value="maintenance">Manutenção</option>
                    <option value="consulting">Consultoria</option>
                    <option value="general">Geral</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Descrição</label>
                  <input
                    type="text"
                    name="description"
                    defaultValue={editingTemplate?.description || ''}
                    placeholder="Descrição do template"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Conteúdo HTML (Formato A4)</label>
                  <HTMLEditor
                    value={templateContent}
                    onChange={setTemplateContent}
                    placeholder="Digite o conteúdo do template aqui..."
                    height="500px"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Variáveis Disponíveis</label>
                  <div className="border border-gray-300 rounded-lg p-4 max-h-96 overflow-y-auto bg-gray-50">
                    {availableVariables.map((category) => (
                      <div key={category.category} className="mb-4">
                        <h5 className="font-semibold text-gray-900 mb-2">{category.category}</h5>
                        <div className="space-y-1">
                          {category.variables.map((variable) => (
                            <div key={variable.key} className="flex items-start gap-2">
                              <button
                                type="button"
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
                  <p className="text-xs text-gray-500 mt-2">
                    Clique nas variáveis para inserir no template
                  </p>
                </div>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowTemplateModal(false);
                    setEditingTemplate(null);
                    setTemplateContent('');
                  }}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingTemplate ? 'Atualizar' : 'Criar'} Template
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};