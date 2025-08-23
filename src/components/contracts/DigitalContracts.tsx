import React, { useState } from 'react';
import { 
  FileText, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Send, 
  Download, 
  PenTool, 
  CheckCircle, 
  Clock, 
  User,
  Building,
  Calendar,
  DollarSign,
  Search,
  Filter,
  Save,
  X,
  AlertCircle,
  Copy,
  Settings,
  Layout,
  Type,
  Palette
} from 'lucide-react';
import { Client, Service, Subscription } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { HTMLEditor } from '../common/HTMLEditor';
import { Pagination } from '../common/Pagination';
import { PDFGenerator } from '../../utils/pdfGenerator';

interface ContractTemplate {
  id: string;
  name: string;
  description: string;
  category: 'service' | 'maintenance' | 'consulting' | 'custom';
  content: string;
  variables: string[];
  isActive: boolean;
  createdAt: string;
}

interface Contract {
  id: string;
  number: string;
  clientId: string;
  serviceIds: string[];
  templateId: string;
  title: string;
  content: string;
  value: number;
  startDate: string;
  endDate: string;
  status: 'draft' | 'sent' | 'signed' | 'cancelled';
  createdAt: string;
  signedAt?: string;
  signatureHash?: string;
  signerName?: string;
  vendorId: string;
}

const mockTemplates: ContractTemplate[] = [
  {
    id: '1',
    name: 'Contrato de Serviços Contábeis',
    description: 'Template padrão para serviços de contabilidade',
    category: 'service',
    content: `
      <div style="max-width: 800px; margin: 0 auto; font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="text-align: center; margin-bottom: 40px; padding: 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 10px;">
          <h1 style="margin: 0; font-size: 28px; font-weight: bold;">CONTRATO DE PRESTAÇÃO DE SERVIÇOS</h1>
          <p style="margin: 10px 0 0; font-size: 16px; opacity: 0.9;">Serviços Contábeis e Fiscais</p>
        </div>

        <div style="margin-bottom: 30px; padding: 20px; background: #f8f9fa; border-radius: 8px; border-left: 4px solid #667eea;">
          <h2 style="color: #667eea; margin-top: 0;">PARTES CONTRATANTES</h2>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 15px;">
            <div>
              <h3 style="color: #333; margin-bottom: 10px;">CONTRATANTE:</h3>
              <p><strong>Empresa:</strong> {cliente_nome}</p>
              <p><strong>Representante:</strong> {cliente_representante}</p>
              <p><strong>NUIT:</strong> {cliente_nuit}</p>
              <p><strong>Email:</strong> {cliente_email}</p>
              <p><strong>Telefone:</strong> {cliente_telefone}</p>
              <p><strong>Endereço:</strong> {cliente_endereco}</p>
            </div>
            <div>
              <h3 style="color: #333; margin-bottom: 10px;">CONTRATADA:</h3>
              <p><strong>Empresa:</strong> {empresa_nome}</p>
              <p><strong>Representante:</strong> {vendedor_nome}</p>
              <p><strong>NUIT:</strong> {empresa_nuit}</p>
              <p><strong>Email:</strong> {empresa_email}</p>
              <p><strong>Telefone:</strong> {empresa_telefone}</p>
              <p><strong>Endereço:</strong> {empresa_endereco}</p>
            </div>
          </div>
        </div>

        <div style="margin-bottom: 30px;">
          <h2 style="color: #667eea; border-bottom: 2px solid #667eea; padding-bottom: 10px;">OBJETO DO CONTRATO</h2>
          <p style="margin-top: 15px; text-align: justify;">
            A <strong>CONTRATADA</strong> compromete-se a prestar os seguintes serviços à <strong>CONTRATANTE</strong>:
          </p>
          <div style="margin: 20px 0; padding: 15px; background: #e3f2fd; border-radius: 8px;">
            <p><strong>Serviços Contratados:</strong> {servicos_lista}</p>
            <p><strong>Descrição:</strong> Prestação de serviços contábeis completos incluindo escrituração, balancetes mensais, demonstrações financeiras e assessoria fiscal.</p>
          </div>
        </div>

        <div style="margin-bottom: 30px;">
          <h2 style="color: #667eea; border-bottom: 2px solid #667eea; padding-bottom: 10px;">CONDIÇÕES FINANCEIRAS</h2>
          <div style="margin-top: 15px; padding: 20px; background: #f1f8e9; border-radius: 8px; border: 1px solid #4caf50;">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
              <p><strong>Valor Total:</strong> {contrato_valor} MT</p>
              <p><strong>Forma de Pagamento:</strong> Mensal</p>
              <p><strong>Data de Início:</strong> {contrato_inicio}</p>
              <p><strong>Data de Término:</strong> {contrato_fim}</p>
            </div>
          </div>
        </div>

        <div style="margin-bottom: 30px;">
          <h2 style="color: #667eea; border-bottom: 2px solid #667eea; padding-bottom: 10px;">CLÁUSULAS GERAIS</h2>
          <div style="margin-top: 15px;">
            <p><strong>1. VIGÊNCIA:</strong> Este contrato terá vigência de {contrato_duracao} meses, iniciando em {contrato_inicio} e terminando em {contrato_fim}.</p>
            <p><strong>2. RENOVAÇÃO:</strong> O contrato poderá ser renovado mediante acordo entre as partes.</p>
            <p><strong>3. RESCISÃO:</strong> Qualquer das partes poderá rescindir este contrato mediante aviso prévio de 30 dias.</p>
            <p><strong>4. CONFIDENCIALIDADE:</strong> Todas as informações trocadas serão mantidas em sigilo absoluto.</p>
          </div>
        </div>

        <div style="margin-top: 50px; padding: 30px; background: #f8f9fa; border-radius: 8px;">
          <p style="text-align: center; margin-bottom: 30px; font-weight: bold;">
            Maputo, {data_hoje}
          </p>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-top: 40px;">
            <div style="text-align: center;">
              <div style="border-bottom: 1px solid #333; margin-bottom: 10px; height: 50px;"></div>
              <p><strong>{cliente_representante}</strong></p>
              <p style="font-size: 14px; color: #666;">{cliente_nome}</p>
              <p style="font-size: 12px; color: #999;">CONTRATANTE</p>
            </div>
            <div style="text-align: center;">
              <div style="border-bottom: 1px solid #333; margin-bottom: 10px; height: 50px;"></div>
              <p><strong>{vendedor_nome}</strong></p>
              <p style="font-size: 14px; color: #666;">{empresa_nome}</p>
              <p style="font-size: 12px; color: #999;">CONTRATADA</p>
            </div>
          </div>
        </div>
      </div>
    `,
    variables: ['{cliente_nome}', '{cliente_representante}', '{empresa_nome}', '{vendedor_nome}', '{contrato_valor}'],
    isActive: true,
    createdAt: '2024-01-15'
  },
  {
    id: '2',
    name: 'Contrato de Manutenção',
    description: 'Template para contratos de manutenção predial',
    category: 'maintenance',
    content: `
      <div style="max-width: 800px; margin: 0 auto; font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="text-align: center; margin-bottom: 40px; padding: 30px; background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; border-radius: 10px;">
          <h1 style="margin: 0; font-size: 28px; font-weight: bold;">CONTRATO DE MANUTENÇÃO</h1>
          <p style="margin: 10px 0 0; font-size: 16px; opacity: 0.9;">Serviços de Manutenção Predial</p>
        </div>

        <div style="margin-bottom: 30px; padding: 20px; background: #f8f9fa; border-radius: 8px;">
          <h2 style="color: #28a745; margin-top: 0;">IDENTIFICAÇÃO DAS PARTES</h2>
          <p><strong>CONTRATANTE:</strong> {cliente_nome}, representada por {cliente_representante}</p>
          <p><strong>CONTRATADA:</strong> {empresa_nome}, representada por {vendedor_nome}</p>
        </div>

        <div style="margin-bottom: 30px;">
          <h2 style="color: #28a745; border-bottom: 2px solid #28a745; padding-bottom: 10px;">SERVIÇOS DE MANUTENÇÃO</h2>
          <p>A CONTRATADA prestará serviços de manutenção preventiva e corretiva, incluindo:</p>
          <ul style="margin: 15px 0; padding-left: 20px;">
            <li>Manutenção preventiva mensal</li>
            <li>Manutenção corretiva sob demanda</li>
            <li>Fornecimento de materiais e peças</li>
            <li>Relatórios técnicos mensais</li>
          </ul>
        </div>

        <div style="margin-bottom: 30px; padding: 20px; background: #e8f5e8; border-radius: 8px;">
          <h2 style="color: #28a745; margin-top: 0;">VALOR E PAGAMENTO</h2>
          <p><strong>Valor Mensal:</strong> {contrato_valor} MT</p>
          <p><strong>Vigência:</strong> {contrato_inicio} a {contrato_fim}</p>
          <p><strong>Pagamento:</strong> Até o dia 10 de cada mês</p>
        </div>

        <div style="margin-top: 50px; text-align: center;">
          <p>Maputo, {data_hoje}</p>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-top: 40px;">
            <div>
              <div style="border-bottom: 1px solid #333; margin-bottom: 10px; height: 50px;"></div>
              <p><strong>{cliente_representante}</strong></p>
              <p>CONTRATANTE</p>
            </div>
            <div>
              <div style="border-bottom: 1px solid #333; margin-bottom: 10px; height: 50px;"></div>
              <p><strong>{vendedor_nome}</strong></p>
              <p>CONTRATADA</p>
            </div>
          </div>
        </div>
      </div>
    `,
    variables: ['{cliente_nome}', '{cliente_representante}', '{empresa_nome}', '{vendedor_nome}'],
    isActive: true,
    createdAt: '2024-01-20'
  },
  {
    id: '3',
    name: 'Contrato de Consultoria',
    description: 'Template para serviços de consultoria empresarial',
    category: 'consulting',
    content: `
      <div style="max-width: 800px; margin: 0 auto; font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="text-align: center; margin-bottom: 40px; padding: 30px; background: linear-gradient(135deg, #6f42c1 0%, #e83e8c 100%); color: white; border-radius: 10px;">
          <h1 style="margin: 0; font-size: 28px; font-weight: bold;">CONTRATO DE CONSULTORIA</h1>
          <p style="margin: 10px 0 0; font-size: 16px; opacity: 0.9;">Serviços de Consultoria Empresarial</p>
        </div>

        <div style="margin-bottom: 30px;">
          <h2 style="color: #6f42c1; border-bottom: 2px solid #6f42c1; padding-bottom: 10px;">ESCOPO DOS SERVIÇOS</h2>
          <p>A CONTRATADA prestará serviços de consultoria especializada em:</p>
          <div style="margin: 20px 0; padding: 15px; background: #f3e5f5; border-radius: 8px;">
            <p><strong>Área de Atuação:</strong> {servicos_lista}</p>
            <p><strong>Objetivo:</strong> Otimização de processos e melhoria da eficiência operacional</p>
            <p><strong>Metodologia:</strong> Análise, diagnóstico, implementação e acompanhamento</p>
          </div>
        </div>

        <div style="margin-bottom: 30px;">
          <h2 style="color: #6f42c1; border-bottom: 2px solid #6f42c1; padding-bottom: 10px;">CRONOGRAMA E ENTREGÁVEIS</h2>
          <table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
            <thead>
              <tr style="background: #6f42c1; color: white;">
                <th style="padding: 10px; text-align: left; border: 1px solid #ddd;">Fase</th>
                <th style="padding: 10px; text-align: left; border: 1px solid #ddd;">Entregável</th>
                <th style="padding: 10px; text-align: left; border: 1px solid #ddd;">Prazo</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="padding: 10px; border: 1px solid #ddd;">Diagnóstico</td>
                <td style="padding: 10px; border: 1px solid #ddd;">Relatório de Situação Atual</td>
                <td style="padding: 10px; border: 1px solid #ddd;">30 dias</td>
              </tr>
              <tr style="background: #f8f9fa;">
                <td style="padding: 10px; border: 1px solid #ddd;">Implementação</td>
                <td style="padding: 10px; border: 1px solid #ddd;">Plano de Ação Detalhado</td>
                <td style="padding: 10px; border: 1px solid #ddd;">60 dias</td>
              </tr>
              <tr>
                <td style="padding: 10px; border: 1px solid #ddd;">Acompanhamento</td>
                <td style="padding: 10px; border: 1px solid #ddd;">Relatórios Mensais</td>
                <td style="padding: 10px; border: 1px solid #ddd;">Contínuo</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div style="margin-bottom: 30px; padding: 20px; background: #fff3cd; border-radius: 8px; border: 1px solid #ffc107;">
          <h2 style="color: #856404; margin-top: 0;">INVESTIMENTO</h2>
          <p><strong>Valor Total do Projeto:</strong> {contrato_valor} MT</p>
          <p><strong>Forma de Pagamento:</strong> Conforme cronograma acordado</p>
          <p><strong>Vigência:</strong> {contrato_inicio} a {contrato_fim}</p>
        </div>

        <div style="margin-top: 50px; padding: 20px; background: #f8f9fa; border-radius: 8px;">
          <p style="text-align: center; margin-bottom: 30px;">
            <strong>Maputo, {data_hoje}</strong>
          </p>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px;">
            <div style="text-align: center;">
              <div style="border-bottom: 2px solid #333; margin-bottom: 15px; height: 60px;"></div>
              <p style="font-weight: bold; margin-bottom: 5px;">{cliente_representante}</p>
              <p style="color: #666; margin-bottom: 5px;">{cliente_nome}</p>
              <p style="font-size: 12px; color: #999; text-transform: uppercase;">Contratante</p>
            </div>
            <div style="text-align: center;">
              <div style="border-bottom: 2px solid #333; margin-bottom: 15px; height: 60px;"></div>
              <p style="font-weight: bold; margin-bottom: 5px;">{vendedor_nome}</p>
              <p style="color: #666; margin-bottom: 5px;">{empresa_nome}</p>
              <p style="font-size: 12px; color: #999; text-transform: uppercase;">Contratada</p>
            </div>
          </div>
        </div>
      </div>
    `,
    variables: ['{cliente_nome}', '{cliente_representante}', '{empresa_nome}', '{vendedor_nome}', '{contrato_valor}'],
    isActive: true,
    createdAt: '2024-02-01'
  }
];

const mockContracts: Contract[] = [
  {
    id: '1',
    number: 'CONT-2024-001',
    clientId: '1',
    serviceIds: ['1'],
    templateId: '1',
    title: 'Contrato de Contabilidade Mensal',
    content: 'Conteúdo do contrato...',
    value: 60000,
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    status: 'signed',
    createdAt: '2024-01-01',
    signedAt: '2024-01-05',
    signatureHash: 'abc123def456',
    signerName: 'João Macamo',
    vendorId: '1'
  },
  {
    id: '2',
    number: 'CONT-2024-002',
    clientId: '2',
    serviceIds: ['2'],
    templateId: '2',
    title: 'Contrato de Auditoria Anual',
    content: 'Conteúdo do contrato...',
    value: 180000,
    startDate: '2024-02-01',
    endDate: '2025-01-31',
    status: 'sent',
    createdAt: '2024-02-01',
    vendorId: '2'
  }
];

const mockClients = [
  { id: '1', companyName: 'Transportes Maputo Lda', representative: 'João Macamo', email: 'joao@transportesmaputo.mz', nuit: '400567890', phone: '+258 84 123 4567', address: 'Av. Eduardo Mondlane, 567, Maputo' },
  { id: '2', companyName: 'Construções Beira SA', representative: 'Maria Santos', email: 'maria@construcoesbeira.mz', nuit: '400123789', phone: '+258 85 987 6543', address: 'Rua da Independência, 123, Beira' },
  { id: '3', companyName: 'Hotel Polana', representative: 'Carlos Mendes', email: 'carlos@hotelpolana.mz', nuit: '400111222', phone: '+258 87 444 5555', address: 'Av. Julius Nyerere, 1380, Maputo' },
  { id: '4', companyName: 'Farmácia Central', representative: 'António Silva', email: 'antonio@farmaciacentral.mz', nuit: '400987654', phone: '+258 86 555 7777', address: 'Praça da Independência, 45, Nampula' }
];

const mockServices = [
  { id: '1', name: 'Contabilidade Mensal', price: 5000 },
  { id: '2', name: 'Auditoria Anual', price: 15000 },
  { id: '3', name: 'Consultoria Fiscal', price: 8000 },
  { id: '4', name: 'Declaração de IVA', price: 2000 }
];

const mockUsers = [
  { id: '1', name: 'João Silva', email: 'joao@techsolutions.mz' },
  { id: '2', name: 'Maria Santos', email: 'maria@techsolutions.mz' },
  { id: '3', name: 'Carlos Mendes', email: 'carlos@techsolutions.mz' }
];

const mockSubscriptions: Subscription[] = [
  { id: '1', companyId: '1', clientId: '1', serviceId: '1', status: 'active', nextBilling: '2024-12-01', reminderSent: false },
  { id: '2', companyId: '1', clientId: '2', serviceId: '2', status: 'active', nextBilling: '2024-11-15', reminderSent: true }
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
  { category: 'Empresa', variables: [
    { key: '{empresa_nome}', description: 'Nome da sua empresa' },
    { key: '{empresa_email}', description: 'Email da sua empresa' },
    { key: '{empresa_telefone}', description: 'Telefone da sua empresa' },
    { key: '{empresa_endereco}', description: 'Endereço da sua empresa' },
    { key: '{empresa_nuit}', description: 'NUIT da sua empresa' },
    { key: '{vendedor_nome}', description: 'Nome do vendedor/gestor' },
    { key: '{vendedor_email}', description: 'Email do vendedor' },
    { key: '{vendedor_telefone}', description: 'Telefone do vendedor' }
  ]},
  { category: 'Contrato', variables: [
    { key: '{contrato_numero}', description: 'Número do contrato' },
    { key: '{contrato_valor}', description: 'Valor total do contrato' },
    { key: '{contrato_inicio}', description: 'Data de início' },
    { key: '{contrato_fim}', description: 'Data de término' },
    { key: '{contrato_duracao}', description: 'Duração em meses' },
    { key: '{servicos_lista}', description: 'Lista de serviços contratados' }
  ]},
  { category: 'Sistema', variables: [
    { key: '{data_hoje}', description: 'Data atual' },
    { key: '{data_vencimento}', description: 'Data de vencimento' },
    { key: '{numero_fatura}', description: 'Número da fatura relacionada' }
  ]}
];

export const DigitalContracts: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('contracts');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'sent' | 'signed' | 'cancelled'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingContract, setEditingContract] = useState<Contract | null>(null);
  const [viewingContract, setViewingContract] = useState<Contract | null>(null);
  const [contracts, setContracts] = useState<Contract[]>(mockContracts);
  const [templates, setTemplates] = useState<ContractTemplate[]>(mockTemplates);
  const [currentPage, setCurrentPage] = useState(1);
  const [templatesCurrentPage, setTemplatesCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Template editor states
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<ContractTemplate | null>(null);
  const [templateContent, setTemplateContent] = useState('');
  const [showClientSelectionModal, setShowClientSelectionModal] = useState(false);
  const [selectedClientForContract, setSelectedClientForContract] = useState<any>(null);
  const [clientSubscriptions, setClientSubscriptions] = useState<any[]>([]);
  const [selectedSubscriptions, setSelectedSubscriptions] = useState<string[]>([]);

  const filteredContracts = contracts.filter(contract => {
    const client = mockClients.find(c => c.id === contract.clientId);
    const clientName = client ? client.companyName : '';
    
    const matchesSearch = contract.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contract.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         clientName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || contract.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const filteredTemplates = templates.filter(template =>
    template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination for contracts
  const contractsTotalPages = Math.ceil(filteredContracts.length / itemsPerPage);
  const contractsStartIndex = (currentPage - 1) * itemsPerPage;
  const paginatedContracts = filteredContracts.slice(contractsStartIndex, contractsStartIndex + itemsPerPage);

  // Pagination for templates
  const templatesTotalPages = Math.ceil(filteredTemplates.length / itemsPerPage);
  const templatesStartIndex = (templatesCurrentPage - 1) * itemsPerPage;
  const paginatedTemplates = filteredTemplates.slice(templatesStartIndex, templatesStartIndex + itemsPerPage);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  React.useEffect(() => {
    setTemplatesCurrentPage(1);
  }, [searchTerm]);

  // Mock clients data
  const mockClients = [
    { id: '1', companyName: 'Cliente Exemplo 1', representative: 'Representante 1', email: 'cliente1@email.com' },
    { id: '2', companyName: 'Cliente Exemplo 2', representative: 'Representante 2', email: 'cliente2@email.com' },
    { id: '3', companyName: 'Cliente Exemplo 3', representative: 'Representante 3', email: 'cliente3@email.com' }
  ];

  // Mock subscriptions data
  const mockSubscriptions = [
    { id: '1', clientId: '1', serviceName: 'Serviço Básico', price: 1000, validity: 1, status: 'active' },
    { id: '2', clientId: '1', serviceName: 'Serviço Premium', price: 5000, validity: 12, status: 'active' },
    { id: '3', clientId: '2', serviceName: 'Consultoria Fiscal', price: 8000, validity: 6, status: 'active' },
    { id: '4', clientId: '3', serviceName: 'Declaração de IVA', price: 2000, validity: 1, status: 'active' }
  ];

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
      custom: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Personalizado' }
    };
    const config = categoryConfig[category as keyof typeof categoryConfig] || categoryConfig.custom;
    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const getClientName = (clientId: string) => {
    const client = mockClients.find(c => c.id === clientId);
    return client ? client.companyName : 'Cliente não encontrado';
  };

  const getVendorName = (vendorId: string) => {
    const vendor = mockUsers.find(u => u.id === vendorId);
    return vendor ? vendor.name : 'Vendedor não encontrado';
  };

  const replaceVariables = (content: string, contract: Contract) => {
    const client = mockClients.find(c => c.id === contract.clientId);
    const vendor = mockUsers.find(u => u.id === contract.vendorId);
    const services = contract.serviceIds.map(id => {
      const service = mockServices.find(s => s.id === id);
      return service ? service.name : 'Serviço não encontrado';
    }).join(', ');

    const variables = {
      '{cliente_nome}': client?.companyName || 'Cliente',
      '{cliente_representante}': client?.representative || 'Representante',
      '{cliente_email}': client?.email || 'email@cliente.com',
      '{cliente_telefone}': client?.phone || '+258 XX XXX XXXX',
      '{cliente_nuit}': client?.nuit || 'XXXXXXXXX',
      '{cliente_endereco}': client?.address || 'Endereço do cliente',
      '{empresa_nome}': 'TechSolutions Lda',
      '{empresa_email}': 'admin@techsolutions.mz',
      '{empresa_telefone}': '+258 21 123 456',
      '{empresa_endereco}': 'Av. Julius Nyerere, 123, Maputo',
      '{empresa_nuit}': '400123456',
      '{vendedor_nome}': vendor?.name || 'Vendedor',
      '{vendedor_email}': vendor?.email || 'vendedor@empresa.com',
      '{contrato_numero}': contract.number,
      '{contrato_valor}': contract.value.toLocaleString(),
      '{contrato_inicio}': formatDate(contract.startDate),
      '{contrato_fim}': formatDate(contract.endDate),
      '{contrato_duracao}': Math.ceil((new Date(contract.endDate).getTime() - new Date(contract.startDate).getTime()) / (1000 * 60 * 60 * 24 * 30)).toString(),
      '{servicos_lista}': services,
      '{data_hoje}': formatDate(new Date().toISOString())
    };

    let processedContent = content;
    Object.entries(variables).forEach(([key, value]) => {
      processedContent = processedContent.replace(new RegExp(key.replace(/[{}]/g, '\\$&'), 'g'), value);
    });

    return processedContent;
  };

  const handleViewContract = (contract: Contract) => {
    setViewingContract(contract);
    setShowViewModal(true);
  };

  const handleDownloadContract = (contract: Contract) => {
    const processedContent = replaceVariables(contract.content, contract);
    
    PDFGenerator.generateContract({
      number: contract.number,
      clientInfo: mockClients.find(c => c.id === contract.clientId) || mockClients[0],
      title: contract.title,
      content: processedContent,
      value: contract.value,
      startDate: contract.startDate,
      endDate: contract.endDate,
      status: contract.status,
      signedAt: contract.signedAt,
      signatureHash: contract.signatureHash
    });
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
              status: 'signed' as const,
              signedAt: new Date().toISOString(),
              signatureHash: signatureHash,
              signerName: signerName.trim()
            }
          : c
      ));
      
      alert(`✅ Contrato assinado digitalmente com sucesso!\n\n👤 Assinante: ${signerName.trim()}\n🔐 Hash de Segurança: ${signatureHash}\n📅 Data: ${new Date().toLocaleString('pt-PT')}\n✅ Status: Assinado\n\n📧 Uma cópia foi enviada para o seu email.`);
    }
  };

  const handleSendContract = (contractId: string) => {
    setContracts(contracts.map(c => 
      c.id === contractId 
        ? { ...c, status: 'sent' as const }
        : c
    ));
    alert('Contrato enviado para o cliente!');
  };

  const handleAddContract = () => {
    setEditingContract(null);
    setShowAddModal(true);
  };

  const handleEditContract = (contract: Contract) => {
    setEditingContract(contract);
    setShowAddModal(true);
  };

  const handleDeleteContract = (contractId: string) => {
    if (confirm('Tem certeza que deseja eliminar este contrato?')) {
      setContracts(contracts.filter(c => c.id !== contractId));
      alert('Contrato eliminado com sucesso!');
    }
  };

  const handleSaveContract = (contractData: any) => {
    const template = templates.find(t => t.id === contractData.templateId);
    if (!template) {
      alert('Template não encontrado');
      return;
    }

    if (editingContract) {
      setContracts(contracts.map(c => 
        c.id === editingContract.id 
          ? { ...c, ...contractData, content: template.content }
          : c
      ));
      alert('Contrato atualizado com sucesso!');
    } else {
      const newContract: Contract = {
        id: Date.now().toString(),
        number: `CONT-2024-${String(contracts.length + 1).padStart(3, '0')}`,
        clientId: contractData.clientId,
        serviceIds: contractData.serviceIds,
        templateId: contractData.templateId,
        title: contractData.title,
        content: template.content,
        value: contractData.value,
        startDate: contractData.startDate,
        endDate: contractData.endDate,
        status: 'draft',
        createdAt: new Date().toISOString(),
        vendorId: user?.id || '1'
      };
      setContracts([...contracts, newContract]);
      alert('Contrato criado com sucesso!');
    }
    setShowAddModal(false);
    setEditingContract(null);
  };

  const handleAddTemplate = () => {
    setEditingTemplate(null);
    setTemplateContent('');
    setShowTemplateModal(true);
  };

  const handleEditTemplate = (template: ContractTemplate) => {
    setEditingTemplate(template);
    setTemplateContent(template.content);
    setShowTemplateModal(true);
  };

  const handleDeleteTemplate = (templateId: string) => {
    if (confirm('Tem certeza que deseja eliminar este template?')) {
      setTemplates(templates.filter(t => t.id !== templateId));
      alert('Template eliminado com sucesso!');
    }
  };

  const handleSaveTemplate = (templateData: any) => {
    if (editingTemplate) {
      setTemplates(templates.map(t => 
        t.id === editingTemplate.id 
          ? { ...t, ...templateData, content: templateContent }
          : t
      ));
      alert('Template atualizado com sucesso!');
    } else {
      const newTemplate: ContractTemplate = {
        id: Date.now().toString(),
        name: templateData.name,
        description: templateData.description,
        category: templateData.category,
        content: templateContent,
        variables: templateContent.match(/\{[^}]+\}/g) || [],
        isActive: true,
        createdAt: new Date().toISOString()
      };
      setTemplates([...templates, newTemplate]);
      alert('Template criado com sucesso!');
    }
    setShowTemplateModal(false);
    setEditingTemplate(null);
  };

  const renderContracts = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Gestão de Contratos</h3>
        <button 
          onClick={() => setShowClientSelectionModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus size={20} />
          Gerar Novo Contrato
        </button>
      </div>

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
              <p className="text-sm font-medium text-gray-600 mb-1">Pendentes</p>
              <p className="text-2xl font-bold text-gray-900">
                {contracts.filter(c => c.status === 'sent').length}
              </p>
            </div>
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-orange-100 text-orange-600">
              <Clock size={24} />
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
      </div>

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

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contrato</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Valor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Período</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vendedor</th>
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
                      {contract.signerName && (
                        <div className="text-xs text-green-600 mt-1">
                          Assinado por: {contract.signerName}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{getClientName(contract.clientId)}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{contract.value.toLocaleString()} MT</td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {formatDate(contract.startDate)} - {formatDate(contract.endDate)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{getVendorName(contract.vendorId)}</td>
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
                      {contract.status === 'draft' && (
                        <>
                          <button 
                            onClick={() => handleEditContract(contract)}
                            className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded"
                            title="Editar"
                          >
                            <Edit size={16} />
                          </button>
                          <button 
                            onClick={() => handleSendContract(contract.id)}
                            className="text-purple-600 hover:text-purple-900 p-1 hover:bg-purple-50 rounded"
                            title="Enviar para cliente"
                          >
                            <Send size={16} />
                          </button>
                        </>
                      )}
                      {contract.status === 'sent' && (
                        <button 
                          onClick={() => handleSignContract(contract.id)}
                          className="text-green-600 hover:text-green-900 p-1 hover:bg-green-50 rounded"
                          title="Assinar contrato"
                        >
                          <PenTool size={16} />
                        </button>
                      )}
                      {(user?.role === 'admin') && (
                        <button 
                          onClick={() => handleDeleteContract(contract.id)}
                          className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded"
                          title="Eliminar"
                        >
                          <Trash2 size={16} />
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
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Templates de Contratos</h3>
        <button 
          onClick={handleAddTemplate}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-purple-700 transition-colors flex items-center gap-2"
        >
          <Plus size={20} />
          Novo Template
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Pesquisar templates..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

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

            <div className="flex gap-2">
              <button
                onClick={() => handleEditTemplate(template)}
                className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
              >
                <Edit size={16} />
                Editar
              </button>
              <button 
                onClick={() => {
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
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Contratos Digitais</h2>
        
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

      {activeTab === 'contracts' && renderContracts()}
      {activeTab === 'templates' && renderTemplates()}

      {/* View Contract Modal */}
      {showViewModal && viewingContract && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {viewingContract.title} - {viewingContract.number}
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={() => handleDownloadContract(viewingContract)}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  <Download size={16} />
                  Download PDF
                </button>
                {viewingContract.status === 'sent' && (
                  <button
                    onClick={() => handleSignContract(viewingContract.id)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <PenTool size={16} />
                    Assinar
                  </button>
                )}
                <button
                  onClick={() => setShowViewModal(false)}
                  className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Fechar
                </button>
              </div>
            </div>
            
            <div className="border border-gray-300 rounded-lg p-6 bg-white max-h-96 overflow-y-auto">
              <div dangerouslySetInnerHTML={{ __html: replaceVariables(viewingContract.content, viewingContract) }} />
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Contract Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {editingContract ? 'Editar Contrato' : 'Novo Contrato'}
            </h3>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const serviceIds = Array.from(formData.getAll('serviceIds')) as string[];
              
              const contractData = {
                clientId: formData.get('clientId') as string,
                serviceIds: serviceIds,
                templateId: formData.get('templateId') as string,
                title: formData.get('title') as string,
                value: Number(formData.get('value')),
                startDate: formData.get('startDate') as string,
                endDate: formData.get('endDate') as string,
              };
              handleSaveContract(contractData);
            }} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cliente</label>
                  <select
                    name="clientId"
                    defaultValue={editingContract?.clientId || ''}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Selecionar cliente</option>
                    {mockClients.map((client) => (
                      <option key={client.id} value={client.id}>
                        {client.companyName}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Template</label>
                  <select
                    name="templateId"
                    defaultValue={editingContract?.templateId || ''}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Selecionar template</option>
                    {templates.filter(t => t.isActive).map((template) => (
                      <option key={template.id} value={template.id}>
                        {template.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Título do Contrato</label>
                  <input
                    type="text"
                    name="title"
                    defaultValue={editingContract?.title || ''}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Valor (MT)</label>
                  <input
                    type="number"
                    name="value"
                    defaultValue={editingContract?.value || ''}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Data de Início</label>
                  <input
                    type="date"
                    name="startDate"
                    defaultValue={editingContract?.startDate || new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Data de Término</label>
                  <input
                    type="date"
                    name="endDate"
                    defaultValue={editingContract?.endDate || ''}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Serviços</label>
                <div className="border border-gray-300 rounded-lg p-4 max-h-40 overflow-y-auto">
                  <div className="space-y-2">
                    {mockServices.map((service) => (
                      <label key={service.id} className="flex items-center">
                        <input
                          type="checkbox"
                          name="serviceIds"
                          value={service.id}
                          defaultChecked={editingContract?.serviceIds.includes(service.id)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          {service.name} - {service.price.toLocaleString()} MT
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
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
                  {editingContract ? 'Atualizar' : 'Criar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Template Editor Modal */}
      {showTemplateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {editingTemplate ? 'Editar Template' : 'Novo Template'}
            </h3>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const templateData = {
                name: formData.get('name') as string,
                description: formData.get('description') as string,
                category: formData.get('category') as 'service' | 'maintenance' | 'consulting' | 'custom',
              };
              handleSaveTemplate(templateData);
            }} className="space-y-6">
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nome do Template</label>
                    <input
                      type="text"
                      name="name"
                      defaultValue={editingTemplate?.name || ''}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Descrição</label>
                    <textarea
                      name="description"
                      defaultValue={editingTemplate?.description || ''}
                      rows={3}
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
                      <option value="custom">Personalizado</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Variáveis Disponíveis</label>
                  <div className="border border-gray-300 rounded-lg p-4 max-h-64 overflow-y-auto bg-gray-50">
                    {availableVariables.map((category) => (
                      <div key={category.category} className="mb-4">
                        <h4 className="font-semibold text-gray-900 mb-2">{category.category}</h4>
                        <div className="space-y-1">
                          {category.variables.map((variable) => (
                            <div key={variable.key} className="flex items-start gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  setTemplateContent(templateContent + ' ' + variable.key);
                                }}
                                className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded hover:bg-blue-200 transition-colors font-mono"
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
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Conteúdo do Template</label>
                <HTMLEditor
                  value={templateContent}
                  onChange={setTemplateContent}
                  placeholder="Digite o conteúdo do template aqui..."
                  height="400px"
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowTemplateModal(false);
                    setEditingTemplate(null);
                  }}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  {editingTemplate ? 'Atualizar' : 'Criar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};