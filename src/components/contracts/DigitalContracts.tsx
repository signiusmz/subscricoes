import React, { useState } from 'react';
import { FileText, Download, Edit, Send, Eye, CheckCircle, Clock, AlertCircle, Search, Filter, Calendar, User, Building, DollarSign, FileSignature as Signature, Hash, Users, Plus, X, Save, RefreshCw, Star, Trash2 } from 'lucide-react';
import { PDFGenerator } from '../../utils/pdfGenerator';
import { formatAmountInWords } from '../../utils/numberToWords';
import { HTMLEditor } from '../common/HTMLEditor';
import { Pagination } from '../common/Pagination';

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
}

const mockContractTemplates: ContractTemplate[] = [
  {
    id: '1',
    name: 'Contrato de Prestação de Serviços Contábeis',
    description: 'Template padrão para serviços de contabilidade',
    category: 'service',
    content: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 40px; border-bottom: 2px solid #2563eb; padding-bottom: 20px;">
          <h1 style="color: #2563eb; margin: 0; font-size: 24px; font-weight: bold;">CONTRATO DE PRESTAÇÃO DE SERVIÇOS</h1>
          <p style="margin: 10px 0 0 0; color: #64748b; font-size: 14px;">Número: {contrato_numero}</p>
        </div>
        
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 30px; border-left: 4px solid #2563eb;">
          <h2 style="color: #1e40af; margin-top: 0; font-size: 18px;">IDENTIFICAÇÃO DAS PARTES</h2>
          
          <div style="margin-bottom: 20px;">
            <h3 style="color: #374151; font-size: 16px; margin-bottom: 10px;">CONTRATANTE:</h3>
            <p style="margin: 5px 0;"><strong>Empresa:</strong> {cliente_nome}</p>
            <p style="margin: 5px 0;"><strong>Representante Legal:</strong> {cliente_representante}</p>
            <p style="margin: 5px 0;"><strong>NUIT:</strong> {cliente_nuit}</p>
            <p style="margin: 5px 0;"><strong>Endereço:</strong> {cliente_endereco}</p>
            <p style="margin: 5px 0;"><strong>Email:</strong> {cliente_email}</p>
            <p style="margin: 5px 0;"><strong>Telefone:</strong> {cliente_telefone}</p>
          </div>
          
          <div>
            <h3 style="color: #374151; font-size: 16px; margin-bottom: 10px;">CONTRATADA:</h3>
            <p style="margin: 5px 0;"><strong>Empresa:</strong> {empresa_nome}</p>
            <p style="margin: 5px 0;"><strong>NUIT:</strong> {empresa_nuit}</p>
            <p style="margin: 5px 0;"><strong>Endereço:</strong> {empresa_endereco}</p>
            <p style="margin: 5px 0;"><strong>Email:</strong> {empresa_email}</p>
            <p style="margin: 5px 0;"><strong>Telefone:</strong> {empresa_telefone}</p>
          </div>
        </div>
        
        <h2 style="color: #1e40af; font-size: 18px; margin-top: 30px;">CLÁUSULA PRIMEIRA - DO OBJETO</h2>
        <p style="text-align: justify;">
          O presente contrato tem por objeto a prestação dos seguintes serviços pela CONTRATADA à CONTRATANTE:
        </p>
        <div style="background: #f1f5f9; padding: 15px; border-radius: 8px; margin: 15px 0;">
          <ul style="margin: 0; padding-left: 20px;">
            {servicos_lista}
          </ul>
        </div>
        
        <h2 style="color: #1e40af; font-size: 18px; margin-top: 30px;">CLÁUSULA SEGUNDA - DO VALOR E FORMA DE PAGAMENTO</h2>
        <div style="background: #ecfdf5; padding: 20px; border-radius: 8px; border-left: 4px solid #10b981; margin: 15px 0;">
          <p style="margin: 0 0 10px 0;">
            O valor total dos serviços contratados é de <strong style="color: #059669; font-size: 18px;">{contrato_valor_total} MT</strong> 
            ({contrato_valor_extenso}).
          </p>
          <p style="margin: 0;">
            O pagamento será efetuado conforme os ciclos estabelecidos para cada serviço, nas datas de vencimento das respetivas faturas.
          </p>
        </div>
        
        <h2 style="color: #1e40af; font-size: 18px; margin-top: 30px;">CLÁUSULA TERCEIRA - DO PRAZO DE VIGÊNCIA</h2>
        <p style="text-align: justify;">
          O presente contrato terá vigência de <strong>{contrato_data_inicio}</strong> até <strong>{contrato_data_fim}</strong>, 
          podendo ser renovado mediante acordo entre as partes.
        </p>
        
        <h2 style="color: #1e40af; font-size: 18px; margin-top: 30px;">CLÁUSULA QUARTA - DAS OBRIGAÇÕES DA CONTRATADA</h2>
        <ul style="text-align: justify; padding-left: 20px;">
          <li>Prestar os serviços com qualidade, pontualidade e profissionalismo;</li>
          <li>Manter absoluto sigilo sobre todas as informações do CONTRATANTE;</li>
          <li>Cumprir rigorosamente os prazos estabelecidos para cada serviço;</li>
          <li>Fornecer relatórios periódicos quando solicitado pelo CONTRATANTE;</li>
          <li>Manter-se atualizada com a legislação vigente aplicável aos serviços;</li>
          <li>Disponibilizar suporte técnico durante o horário comercial.</li>
        </ul>
        
        <h2 style="color: #1e40af; font-size: 18px; margin-top: 30px;">CLÁUSULA QUINTA - DAS OBRIGAÇÕES DO CONTRATANTE</h2>
        <ul style="text-align: justify; padding-left: 20px;">
          <li>Efetuar os pagamentos nas datas acordadas e pelos valores estabelecidos;</li>
          <li>Fornecer toda a documentação necessária para a prestação dos serviços;</li>
          <li>Comunicar alterações relevantes em tempo hábil;</li>
          <li>Manter os dados de contacto sempre atualizados;</li>
          <li>Colaborar com a CONTRATADA fornecendo informações precisas;</li>
          <li>Respeitar os prazos estabelecidos para entrega de documentos.</li>
        </ul>
        
        <h2 style="color: #1e40af; font-size: 18px; margin-top: 30px;">CLÁUSULA SEXTA - DA CONFIDENCIALIDADE</h2>
        <p style="text-align: justify;">
          A CONTRATADA compromete-se a manter absoluto sigilo sobre todas as informações, dados, 
          documentos e conhecimentos obtidos em razão da prestação dos serviços, não podendo 
          divulgá-los a terceiros sem autorização expressa do CONTRATANTE.
        </p>
        
        <h2 style="color: #1e40af; font-size: 18px; margin-top: 30px;">CLÁUSULA SÉTIMA - DA RESCISÃO</h2>
        <p style="text-align: justify;">
          O presente contrato poderá ser rescindido por qualquer das partes, mediante aviso prévio 
          de 30 (trinta) dias, sem prejuízo do cumprimento das obrigações já assumidas.
        </p>
        
        <h2 style="color: #1e40af; font-size: 18px; margin-top: 30px;">CLÁUSULA OITAVA - DO FORO</h2>
        <p style="text-align: justify;">
          As partes elegem o foro da Comarca de Maputo para dirimir quaisquer questões 
          oriundas do presente contrato.
        </p>
        
        <div style="margin-top: 50px; text-align: center;">
          <p style="margin-bottom: 30px;">
            Maputo, {contrato_data_assinatura}
          </p>
          
          <div style="display: flex; justify-content: space-between; margin-top: 60px;">
            <div style="text-align: center; width: 45%;">
              <div style="border-top: 1px solid #000; padding-top: 10px;">
                <strong>{cliente_representante}</strong><br>
                <span style="font-size: 14px;">CONTRATANTE</span><br>
                <span style="font-size: 12px;">{cliente_nome}</span>
              </div>
            </div>
            
            <div style="text-align: center; width: 45%;">
              <div style="border-top: 1px solid #000; padding-top: 10px;">
                <strong>{empresa_representante}</strong><br>
                <span style="font-size: 14px;">CONTRATADA</span><br>
                <span style="font-size: 12px;">{empresa_nome}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin-top: 40px; text-align: center; border: 1px solid #f59e0b;">
          <p style="margin: 0; font-weight: bold; color: #92400e; font-size: 12px;">
            Contrato gerado automaticamente pelo Sistema Signius
          </p>
          <p style="margin: 5px 0 0 0; font-size: 10px; color: #a16207;">
            Data de geração: {data_geracao} | Versão: 1.0
          </p>
        </div>
      </div>
    `,
    variables: [
      '{contrato_numero}', '{cliente_nome}', '{cliente_representante}', '{cliente_nuit}',
      '{cliente_endereco}', '{cliente_email}', '{cliente_telefone}', '{empresa_nome}',
      '{empresa_nuit}', '{empresa_endereco}', '{empresa_email}', '{empresa_telefone}',
      '{servicos_lista}', '{contrato_valor_total}', '{contrato_valor_extenso}',
      '{contrato_data_inicio}', '{contrato_data_fim}', '{contrato_data_assinatura}',
      '{empresa_representante}', '{data_geracao}'
    ],
    isActive: true,
    createdAt: '2024-01-01',
    lastUsed: '2024-03-30'
  },
  {
    id: '2',
    name: 'Contrato de Manutenção Predial',
    description: 'Template para contratos de manutenção de edifícios',
    category: 'maintenance',
    content: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 40px; border-bottom: 2px solid #059669; padding-bottom: 20px;">
          <h1 style="color: #059669; margin: 0; font-size: 24px; font-weight: bold;">CONTRATO DE MANUTENÇÃO PREDIAL</h1>
          <p style="margin: 10px 0 0 0; color: #64748b; font-size: 14px;">Número: {contrato_numero}</p>
        </div>
        
        <h2 style="color: #047857; font-size: 18px;">OBJETO DO CONTRATO</h2>
        <p style="text-align: justify;">
          A CONTRATADA prestará serviços de manutenção preventiva e corretiva nas instalações 
          da CONTRATANTE, incluindo {servicos_manutencao}.
        </p>
        
        <h2 style="color: #047857; font-size: 18px; margin-top: 30px;">VALOR E PERIODICIDADE</h2>
        <div style="background: #ecfdf5; padding: 20px; border-radius: 8px; border-left: 4px solid #10b981;">
          <p><strong>Valor Mensal:</strong> {contrato_valor_total} MT ({contrato_valor_extenso})</p>
          <p><strong>Periodicidade:</strong> {periodicidade_manutencao}</p>
          <p><strong>Vigência:</strong> {contrato_data_inicio} a {contrato_data_fim}</p>
        </div>
        
        <h2 style="color: #047857; font-size: 18px; margin-top: 30px;">RESPONSABILIDADES</h2>
        <p style="text-align: justify;">
          A CONTRATADA será responsável por toda a manutenção preventiva e corretiva, 
          fornecimento de materiais e mão-de-obra especializada.
        </p>
      </div>
    `,
    variables: [
      '{contrato_numero}', '{servicos_manutencao}', '{contrato_valor_total}',
      '{contrato_valor_extenso}', '{periodicidade_manutencao}', '{contrato_data_inicio}',
      '{contrato_data_fim}'
    ],
    isActive: true,
    createdAt: '2024-01-15',
    lastUsed: '2024-03-25'
  },
  {
    id: '3',
    name: 'Contrato de Consultoria Empresarial',
    description: 'Template para serviços de consultoria e assessoria',
    category: 'consulting',
    content: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 40px; border-bottom: 2px solid #7c3aed; padding-bottom: 20px;">
          <h1 style="color: #7c3aed; margin: 0; font-size: 24px; font-weight: bold;">CONTRATO DE CONSULTORIA EMPRESARIAL</h1>
          <p style="margin: 10px 0 0 0; color: #64748b; font-size: 14px;">Número: {contrato_numero}</p>
        </div>
        
        <h2 style="color: #6d28d9; font-size: 18px;">ESCOPO DOS SERVIÇOS</h2>
        <p style="text-align: justify;">
          A CONTRATADA prestará serviços de consultoria empresarial especializada, incluindo 
          {servicos_consultoria}, visando o desenvolvimento e otimização dos processos da CONTRATANTE.
        </p>
        
        <h2 style="color: #6d28d9; font-size: 18px; margin-top: 30px;">METODOLOGIA</h2>
        <p style="text-align: justify;">
          Os serviços serão prestados através de {metodologia_trabalho}, com relatórios 
          periódicos e acompanhamento contínuo dos resultados.
        </p>
        
        <div style="background: #faf5ff; padding: 20px; border-radius: 8px; border-left: 4px solid #7c3aed; margin: 20px 0;">
          <h3 style="color: #6d28d9; margin-top: 0;">INVESTIMENTO</h3>
          <p><strong>Valor Total:</strong> {contrato_valor_total} MT ({contrato_valor_extenso})</p>
          <p><strong>Forma de Pagamento:</strong> {forma_pagamento}</p>
        </div>
      </div>
    `,
    variables: [
      '{contrato_numero}', '{servicos_consultoria}', '{metodologia_trabalho}',
      '{contrato_valor_total}', '{contrato_valor_extenso}', '{forma_pagamento}'
    ],
    isActive: true,
    createdAt: '2024-02-01'
  }
];

const templateCategories = [
  { id: 'service', label: 'Prestação de Serviços', color: 'bg-blue-100 text-blue-800' },
  { id: 'maintenance', label: 'Manutenção', color: 'bg-green-100 text-green-800' },
  { id: 'consulting', label: 'Consultoria', color: 'bg-purple-100 text-purple-800' },
  { id: 'general', label: 'Geral', color: 'bg-gray-100 text-gray-800' }
];

const availableVariables = [
  { category: 'Contrato', variables: [
    { key: '{contrato_numero}', description: 'Número do contrato' },
    { key: '{contrato_valor_total}', description: 'Valor total do contrato' },
    { key: '{contrato_valor_extenso}', description: 'Valor por extenso' },
    { key: '{contrato_data_inicio}', description: 'Data de início' },
    { key: '{contrato_data_fim}', description: 'Data de fim' },
    { key: '{contrato_data_assinatura}', description: 'Data de assinatura' },
    { key: '{data_geracao}', description: 'Data de geração do contrato' }
  ]},
  { category: 'Cliente', variables: [
    { key: '{cliente_nome}', description: 'Nome da empresa cliente' },
    { key: '{cliente_representante}', description: 'Representante legal' },
    { key: '{cliente_nuit}', description: 'NUIT do cliente' },
    { key: '{cliente_endereco}', description: 'Endereço do cliente' },
    { key: '{cliente_email}', description: 'Email do cliente' },
    { key: '{cliente_telefone}', description: 'Telefone do cliente' }
  ]},
  { category: 'Empresa', variables: [
    { key: '{empresa_nome}', description: 'Nome da sua empresa' },
    { key: '{empresa_nuit}', description: 'NUIT da sua empresa' },
    { key: '{empresa_endereco}', description: 'Endereço da sua empresa' },
    { key: '{empresa_email}', description: 'Email da sua empresa' },
    { key: '{empresa_telefone}', description: 'Telefone da sua empresa' },
    { key: '{empresa_representante}', description: 'Representante da empresa' }
  ]},
  { category: 'Serviços', variables: [
    { key: '{servicos_lista}', description: 'Lista de serviços contratados' },
    { key: '{servicos_manutencao}', description: 'Serviços de manutenção específicos' },
    { key: '{servicos_consultoria}', description: 'Serviços de consultoria específicos' },
    { key: '{periodicidade_manutencao}', description: 'Periodicidade da manutenção' },
    { key: '{metodologia_trabalho}', description: 'Metodologia de trabalho' },
    { key: '{forma_pagamento}', description: 'Forma de pagamento acordada' }
  ]}
];

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
  status: 'draft' | 'sent' | 'signed' | 'expired';
  createdAt: string;
  signedAt?: string;
  signatureHash?: string;
  isAutoGenerated: boolean;
  services: string[];
}

interface Client {
  id: string;
  companyName: string;
  representative: string;
  email: string;
  phone: string;
  nuit: string;
  address: string;
}

interface Subscription {
  id: string;
  clientId: string;
  serviceId: string;
  serviceName: string;
  status: 'active' | 'expired' | 'cancelled';
  nextBilling: string;
  totalWithIva: number;
  startDate: string;
}

const mockClients: Client[] = [
  {
    id: '1',
    companyName: 'Transportes Maputo Lda',
    representative: 'João Macamo',
    email: 'joao@transportesmaputo.mz',
    phone: '+258 84 123 4567',
    nuit: '400567890',
    address: 'Av. Eduardo Mondlane, 567, Maputo'
  },
  {
    id: '2',
    companyName: 'Construções Beira SA',
    representative: 'Maria Santos',
    email: 'maria@construcoesbeira.mz',
    phone: '+258 85 987 6543',
    nuit: '400123789',
    address: 'Rua da Independência, 123, Beira'
  },
  {
    id: '3',
    companyName: 'Hotel Polana',
    representative: 'Carlos Mendes',
    email: 'carlos@hotelpolana.mz',
    phone: '+258 87 444 5555',
    nuit: '400111222',
    address: 'Av. Julius Nyerere, 1380, Maputo'
  }
];

const mockSubscriptions: Subscription[] = [
  {
    id: '1',
    clientId: '1',
    serviceId: '1',
    serviceName: 'Contabilidade Mensal',
    status: 'active',
    nextBilling: '2024-05-01',
    totalWithIva: 5800,
    startDate: '2024-01-01'
  },
  {
    id: '2',
    clientId: '1',
    serviceId: '2',
    serviceName: 'Auditoria Anual',
    status: 'active',
    nextBilling: '2024-12-01',
    totalWithIva: 17400,
    startDate: '2024-01-01'
  },
  {
    id: '3',
    clientId: '2',
    serviceId: '1',
    serviceName: 'Contabilidade Mensal',
    status: 'active',
    nextBilling: '2024-05-01',
    totalWithIva: 5800,
    startDate: '2024-02-01'
  },
  {
    id: '4',
    clientId: '3',
    serviceId: '3',
    serviceName: 'Consultoria Fiscal',
    status: 'expired',
    nextBilling: '2024-03-01',
    totalWithIva: 3480,
    startDate: '2023-09-01'
  }
];

const mockContracts: Contract[] = [
  {
    id: '1',
    number: 'CONT-2024-001',
    clientId: '1',
    clientName: 'Transportes Maputo Lda',
    title: 'Contrato de Prestação de Serviços Contábeis',
    content: `
      <h2>CONTRATO DE PRESTAÇÃO DE SERVIÇOS</h2>
      <p><strong>CONTRATANTE:</strong> Transportes Maputo Lda</p>
      <p><strong>CONTRATADA:</strong> TechSolutions Lda</p>
      
      <h3>CLÁUSULA PRIMEIRA - DO OBJETO</h3>
      <p>O presente contrato tem por objeto a prestação de serviços de contabilidade mensal e auditoria anual.</p>
      
      <h3>CLÁUSULA SEGUNDA - DO VALOR</h3>
      <p>O valor total dos serviços é de <strong>23.200,00 MT</strong> (vinte e três mil e duzentos meticais).</p>
      
      <h3>CLÁUSULA TERCEIRA - DO PRAZO</h3>
      <p>O presente contrato terá vigência de 12 (doze) meses, iniciando em 01/01/2024.</p>
    `,
    value: 23200,
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    status: 'signed',
    createdAt: '2024-01-01',
    signedAt: '2024-01-05',
    signatureHash: 'SHA256:a1b2c3d4e5f6...',
    isAutoGenerated: true,
    services: ['Contabilidade Mensal', 'Auditoria Anual']
  },
  {
    id: '2',
    number: 'CONT-2024-002',
    clientId: '2',
    clientName: 'Construções Beira SA',
    title: 'Contrato de Serviços Contábeis',
    content: `
      <h2>CONTRATO DE PRESTAÇÃO DE SERVIÇOS CONTÁBEIS</h2>
      <p><strong>CONTRATANTE:</strong> Construções Beira SA</p>
      <p><strong>CONTRATADA:</strong> TechSolutions Lda</p>
      
      <h3>OBJETO DO CONTRATO</h3>
      <p>Prestação de serviços de contabilidade mensal para a empresa contratante.</p>
      
      <h3>VALOR E FORMA DE PAGAMENTO</h3>
      <p>Valor mensal de <strong>5.800,00 MT</strong> com vencimento todo dia 05.</p>
    `,
    value: 5800,
    startDate: '2024-02-01',
    endDate: '2025-01-31',
    status: 'sent',
    createdAt: '2024-02-01',
    isAutoGenerated: true,
    services: ['Contabilidade Mensal']
  },
  {
    id: '3',
    number: 'CONT-2024-003',
    clientId: '3',
    clientName: 'Hotel Polana',
    title: 'Contrato de Consultoria Fiscal',
    content: `
      <h2>CONTRATO DE CONSULTORIA FISCAL</h2>
      <p><strong>CONTRATANTE:</strong> Hotel Polana</p>
      <p><strong>CONTRATADA:</strong> TechSolutions Lda</p>
      
      <h3>SERVIÇOS INCLUÍDOS</h3>
      <p>Consultoria especializada em questões fiscais e tributárias.</p>
    `,
    value: 3480,
    startDate: '2023-09-01',
    endDate: '2024-02-29',
    status: 'expired',
    createdAt: '2023-09-01',
    isAutoGenerated: false,
    services: ['Consultoria Fiscal']
  }
];

export const DigitalContracts: React.FC = () => {
  const [contracts, setContracts] = useState<Contract[]>(mockContracts);
  const [contractTemplates, setContractTemplates] = useState<ContractTemplate[]>(mockContractTemplates);
  const [activeTab, setActiveTab] = useState('contracts');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'sent' | 'signed' | 'expired'>('all');
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showTemplateEditor, setShowTemplateEditor] = useState(false);
  const [editingContract, setEditingContract] = useState<Contract | null>(null);
  const [editingTemplate, setEditingTemplate] = useState<ContractTemplate | null>(null);
  const [editContent, setEditContent] = useState('');
  const [templates, setTemplates] = useState<ContractTemplate[]>(mockTemplates);
  const [templateContent, setTemplateContent] = useState('');
  const [selectedClientId, setSelectedClientId] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredContracts = contracts.filter(contract => {
    const matchesSearch = contract.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contract.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contract.title.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || contract.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredContracts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedContracts = filteredContracts.slice(startIndex, startIndex + itemsPerPage);

  // Reset to first page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-PT');
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Rascunho', icon: Edit },
      sent: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Enviado', icon: Send },
      signed: { bg: 'bg-green-100', text: 'text-green-800', label: 'Assinado', icon: CheckCircle },
      expired: { bg: 'bg-red-100', text: 'text-red-800', label: 'Expirado', icon: AlertCircle }
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
    const Icon = config.icon;
    
    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${config.bg} ${config.text} flex items-center gap-1`}>
        <Icon size={12} />
        {config.label}
      </span>
    );
  };

  const getClientSubscriptions = (clientId: string) => {
    return mockSubscriptions.filter(sub => sub.clientId === clientId && sub.status === 'active');
  };

  const handleGenerateContract = () => {
    if (!selectedClientId) {
      alert('Selecione um cliente primeiro');
      return;
    }

    const client = mockClients.find(c => c.id === selectedClientId);
    const clientSubscriptions = getClientSubscriptions(selectedClientId);

    if (!client) {
      alert('Cliente não encontrado');
      return;
    }

    if (clientSubscriptions.length === 0) {
      alert(`❌ Não é possível gerar contrato!\n\n🚫 O cliente "${client.companyName}" não possui subscrições ativas.\n\n💡 Para gerar um contrato:\n1. Vá ao módulo "Subscrições"\n2. Crie pelo menos uma subscrição ativa\n3. Retorne aqui para gerar o contrato\n\n✅ Subscrições ativas são obrigatórias para contratos!`);
      return;
    }

    const totalValue = clientSubscriptions.reduce((sum, sub) => sum + sub.totalWithIva, 0);
    const serviceNames = clientSubscriptions.map(sub => sub.serviceName);
    const earliestStart = clientSubscriptions.reduce((earliest, sub) => 
      sub.startDate < earliest ? sub.startDate : earliest, 
      clientSubscriptions[0].startDate
    );
    const latestEnd = clientSubscriptions.reduce((latest, sub) => 
      sub.nextBilling > latest ? sub.nextBilling : latest, 
      clientSubscriptions[0].nextBilling
    );

    const contractContent = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #2563eb; text-align: center; margin-bottom: 30px;">CONTRATO DE PRESTAÇÃO DE SERVIÇOS</h2>
        
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="color: #1e40af; margin-top: 0;">PARTES CONTRATANTES</h3>
          <p><strong>CONTRATANTE:</strong> ${client.companyName}</p>
          <p><strong>Representante:</strong> ${client.representative}</p>
          <p><strong>NUIT:</strong> ${client.nuit}</p>
          <p><strong>Endereço:</strong> ${client.address}</p>
          <p><strong>Email:</strong> ${client.email}</p>
          <p><strong>Telefone:</strong> ${client.phone}</p>
          
          <hr style="margin: 15px 0; border: 1px solid #e2e8f0;">
          
          <p><strong>CONTRATADA:</strong> TechSolutions Lda</p>
          <p><strong>NUIT:</strong> 400123456</p>
          <p><strong>Endereço:</strong> Av. Julius Nyerere, 123, Maputo</p>
          <p><strong>Email:</strong> info@techsolutions.mz</p>
          <p><strong>Telefone:</strong> +258 21 123 456</p>
        </div>
        
        <h3 style="color: #1e40af;">CLÁUSULA PRIMEIRA - DO OBJETO</h3>
        <p>O presente contrato tem por objeto a prestação dos seguintes serviços:</p>
        <ul style="background: #f1f5f9; padding: 15px; border-radius: 8px;">
          ${serviceNames.map(service => `<li><strong>${service}</strong></li>`).join('')}
        </ul>
        
        <h3 style="color: #1e40af;">CLÁUSULA SEGUNDA - DO VALOR E FORMA DE PAGAMENTO</h3>
        <div style="background: #ecfdf5; padding: 15px; border-radius: 8px; border-left: 4px solid #10b981;">
          <p>O valor total dos serviços contratados é de <strong style="color: #059669;">${totalValue.toLocaleString()} MT</strong> (${formatAmountInWords(totalValue)}).</p>
          <p>O pagamento será efetuado conforme os ciclos de cada serviço, nas datas estabelecidas nas respetivas subscrições.</p>
        </div>
        
        <h3 style="color: #1e40af;">CLÁUSULA TERCEIRA - DO PRAZO DE VIGÊNCIA</h3>
        <p>O presente contrato terá vigência de <strong>${formatDate(earliestStart)}</strong> até <strong>${formatDate(latestEnd)}</strong>, podendo ser renovado mediante acordo entre as partes.</p>
        
        <h3 style="color: #1e40af;">CLÁUSULA QUARTA - DAS OBRIGAÇÕES DA CONTRATADA</h3>
        <ul>
          <li>Prestar os serviços com qualidade e pontualidade;</li>
          <li>Manter sigilo absoluto sobre as informações do cliente;</li>
          <li>Cumprir os prazos estabelecidos para cada serviço;</li>
          <li>Fornecer relatórios periódicos quando solicitado.</li>
        </ul>
        
        <h3 style="color: #1e40af;">CLÁUSULA QUINTA - DAS OBRIGAÇÕES DO CONTRATANTE</h3>
        <ul>
          <li>Efetuar os pagamentos nas datas acordadas;</li>
          <li>Fornecer toda a documentação necessária;</li>
          <li>Comunicar alterações relevantes em tempo hábil;</li>
          <li>Manter os dados de contacto atualizados.</li>
        </ul>
        
        <h3 style="color: #1e40af;">CLÁUSULA SEXTA - DA RESCISÃO</h3>
        <p>O presente contrato poderá ser rescindido por qualquer das partes, mediante aviso prévio de 30 (trinta) dias.</p>
        
        <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin-top: 30px; text-align: center;">
          <p style="margin: 0; font-weight: bold; color: #92400e;">Contrato gerado automaticamente pelo Sistema Signius</p>
          <p style="margin: 5px 0 0 0; font-size: 12px; color: #a16207;">Data de geração: ${new Date().toLocaleDateString('pt-PT')}</p>
        </div>
      </div>
    `;

    const newContract: Contract = {
      id: Date.now().toString(),
      number: `CONT-2024-${String(contracts.length + 1).padStart(3, '0')}`,
      clientId: selectedClientId,
      clientName: client.companyName,
      title: `Contrato de Prestação de Serviços - ${client.companyName}`,
      content: contractContent,
      value: totalValue,
      startDate: earliestStart,
      endDate: latestEnd,
      status: 'draft',
      createdAt: new Date().toISOString(),
      isAutoGenerated: true,
      services: serviceNames
    };

    setContracts([newContract, ...contracts]);
    setShowGenerateModal(false);
    setSelectedClientId('');
    
    alert(`✅ Contrato gerado automaticamente!\n\n📄 Número: ${newContract.number}\n👤 Cliente: ${client.companyName}\n🛍️ Serviços: ${serviceNames.length}\n💰 Valor Total: ${totalValue.toLocaleString()} MT\n📅 Vigência: ${formatDate(earliestStart)} - ${formatDate(latestEnd)}\n📝 Status: Rascunho (pronto para edição)\n🤖 Gerado automaticamente com base nas subscrições ativas`);
  };

  const handleSaveTemplate = (templateData: any) => {
    if (editingTemplate) {
      setTemplates(templates.map(t => 
        t.id === editingTemplate.id 
          ? { ...t, ...templateData, content: templateContent }
          : t
      ));
      alert(`✅ Template "${templateData.name}" atualizado com sucesso!`);
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
      setTemplates([...templates, newTemplate]);
      alert(`✅ Novo template "${newTemplate.name}" criado com sucesso!`);
    }
    setShowTemplateModal(false);
    setEditingTemplate(null);
    setTemplateContent('');
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

  const insertVariable = (variable: string) => {
    setTemplateContent(templateContent + ' ' + variable);
  };

  const handleDownloadPDF = (contract: Contract) => {
    const client = mockClients.find(c => c.id === contract.clientId);
    if (!client) {
      alert('Cliente não encontrado');
      return;
    }

    // Create a temporary div to render the contract content
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = contract.content;
    tempDiv.style.padding = '20px';
    tempDiv.style.fontFamily = 'Arial, sans-serif';
    tempDiv.style.lineHeight = '1.6';
    tempDiv.style.color = '#333';
    
    // Add contract header info
    const headerInfo = document.createElement('div');
    headerInfo.innerHTML = `
      <div style="text-align: center; margin-bottom: 30px; padding: 20px; background: #f8fafc; border-radius: 8px;">
        <h1 style="color: #2563eb; margin: 0 0 10px 0;">${contract.title}</h1>
        <p style="margin: 5px 0; color: #64748b;"><strong>Número:</strong> ${contract.number}</p>
        <p style="margin: 5px 0; color: #64748b;"><strong>Data:</strong> ${formatDate(contract.createdAt)}</p>
        <p style="margin: 5px 0; color: #64748b;"><strong>Status:</strong> ${contract.status.toUpperCase()}</p>
        <p style="margin: 5px 0; color: #64748b;"><strong>Valor:</strong> ${contract.value.toLocaleString()} MT</p>
      </div>
    `;
    
    tempDiv.insertBefore(headerInfo, tempDiv.firstChild);
    
    // Add signature section if signed
    if (contract.status === 'signed' && contract.signedAt) {
      const signatureInfo = document.createElement('div');
      signatureInfo.innerHTML = `
        <div style="margin-top: 40px; padding: 20px; background: #ecfdf5; border-radius: 8px; border-left: 4px solid #10b981;">
          <h3 style="color: #059669; margin-top: 0;">ASSINATURA DIGITAL</h3>
          <p><strong>Data de Assinatura:</strong> ${formatDate(contract.signedAt)}</p>
    const salesperson = mockSalespeople.find(s => s.id === clientData.salespersonId);
          <p><strong>Hash de Segurança:</strong> ${contract.signatureHash}</p>
          <p style="color: #059669; font-weight: bold;">✓ Contrato assinado digitalmente</p>
        </div>
      `;
      tempDiv.appendChild(signatureInfo);
    }
    
    document.body.appendChild(tempDiv);
    
    PDFGenerator.fromElement(tempDiv, {
      title: contract.title,
      filename: `contrato-${contract.number}.pdf`,
      orientation: 'portrait'
    }).then(() => {
      document.body.removeChild(tempDiv);
      alert(`✅ PDF do contrato baixado!\n\n📄 Arquivo: contrato-${contract.number}.pdf\n👤 Cliente: ${contract.clientName}\n💰 Valor: ${contract.value.toLocaleString()} MT\n📅 Baixado em: ${new Date().toLocaleString('pt-PT')}`);
    }).catch(() => {
      document.body.removeChild(tempDiv);
      alert('Erro ao gerar PDF. Tente novamente.');
    });
  };

  const handleEditContract = (contract: Contract) => {
    setEditingContract(contract);
    setEditContent(contract.content);
    setShowEditModal(true);
  };

  const handleViewContract = (contract: Contract) => {
    setViewingContract(contract);
    setShowViewModal(true);
  };

  const handleSaveEdit = () => {
    if (!editingContract) return;

    setContracts(contracts.map(c => 
      c.id === editingContract.id 
        ? { ...c, content: editContent }
        : c
    ));
    
    setShowEditModal(false);
    setEditingContract(null);
    setEditContent('');
    
    alert(`✅ Contrato "${editingContract.number}" atualizado!\n\n📝 Conteúdo modificado com sucesso\n📅 Atualizado em: ${new Date().toLocaleString('pt-PT')}\n💾 Alterações salvas no sistema`);
  };

  const handleSendContract = (contractId: string) => {
    setContracts(contracts.map(c => 
      c.id === contractId 
        ? { ...c, status: 'sent' as const }
        : c
    ));
    
    const contract = contracts.find(c => c.id === contractId);
    alert(`✅ Contrato enviado!\n\n📧 Contrato "${contract?.number}" enviado para ${contract?.clientName}\n📨 Email: ${mockClients.find(cl => cl.id === contract?.clientId)?.email}\n📅 Enviado em: ${new Date().toLocaleString('pt-PT')}\n🔔 Cliente será notificado por email`);
  };

  const getCategoryBadge = (category: string) => {
    const cat = templateCategories.find(c => c.id === category);
    if (!cat) return null;
    const Icon = cat.icon;
    return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${cat.color} flex items-center gap-1`}><Icon size={12} />{cat.label}</span>;
  };

  const handleSignContract = (contractId: string) => {
    const signatureHash = `SHA256:${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
    
    setContracts(contracts.map(c => 
      c.id === contractId 
        ? { 
            ...c, 
            status: 'signed' as const,
            signedAt: new Date().toISOString(),
            signatureHash
          }
        : c
    ));
    
    const contract = contracts.find(c => c.id === contractId);
    alert(`✅ Contrato assinado digitalmente!\n\n📄 Contrato: ${contract?.number}\n👤 Cliente: ${contract?.clientName}\n🔐 Hash: ${signatureHash}\n📅 Assinado em: ${new Date().toLocaleString('pt-PT')}\n✅ Assinatura válida e registrada`);
  };

  const handleSaveTemplate = (templateData: Partial<ContractTemplate>) => {
    if (editingTemplate) {
      setContractTemplates(contractTemplates.map(t => 
        t.id === editingTemplate.id 
          ? { ...t, ...templateData, content: templateContent }
          : t
      ));
      alert(`✅ Template "${templateData.name}" atualizado!\n\n📝 Categoria: ${templateCategories.find(c => c.id === templateData.category)?.label}\n🔤 Variáveis: ${templateData.variables?.length || 0}\n📅 Atualizado em: ${new Date().toLocaleString('pt-PT')}`);
    } else {
      const newTemplate: ContractTemplate = {
        id: Date.now().toString(),
        name: templateData.name || '',
        description: templateData.description || '',
        category: templateData.category as 'service' | 'maintenance' | 'consulting' | 'general' || 'general',
        content: templateContent,
        variables: templateContent.match(/\{[^}]+\}/g) || [],
        isActive: true,
        createdAt: new Date().toISOString()
      };
      setContractTemplates([...contractTemplates, newTemplate]);
      alert(`✅ Novo template "${newTemplate.name}" criado!\n\n📝 Categoria: ${templateCategories.find(c => c.id === newTemplate.category)?.label}\n🔤 Variáveis: ${newTemplate.variables.length}\n📅 Criado em: ${new Date().toLocaleString('pt-PT')}\n🟢 Status: Ativo`);
    }
    setShowTemplateEditor(false);
    setEditingTemplate(null);
    setTemplateContent('');
  };

  const handleEditTemplate = (template: ContractTemplate) => {
    setEditingTemplate(template);
    setTemplateContent(template.content);
    setShowTemplateEditor(true);
  };

  const handleDeleteTemplate = (templateId: string) => {
    if (confirm('Tem certeza que deseja eliminar este template?')) {
      setContractTemplates(contractTemplates.filter(t => t.id !== templateId));
      alert('Template eliminado com sucesso!');
    }
  };

  const handleUseTemplate = (template: ContractTemplate) => {
    if (!selectedClientId) {
      alert('Selecione um cliente primeiro');
      return;
    }

    const client = mockClients.find(c => c.id === selectedClientId);
    const clientSubscriptions = getClientSubscriptions(selectedClientId);

    if (!client) {
      alert('Cliente não encontrado');
      return;
    }

    if (clientSubscriptions.length === 0) {
      alert(`❌ Não é possível usar template!\n\n🚫 O cliente "${client.companyName}" não possui subscrições ativas.\n\n💡 Para usar um template:\n1. Vá ao módulo "Subscrições"\n2. Crie pelo menos uma subscrição ativa\n3. Retorne aqui para usar o template\n\n✅ Subscrições ativas são obrigatórias!`);
      return;
    }

    const totalValue = clientSubscriptions.reduce((sum, sub) => sum + sub.totalWithIva, 0);
    const serviceNames = clientSubscriptions.map(sub => sub.serviceName);
    const earliestStart = clientSubscriptions.reduce((earliest, sub) => 
    // Use template if selected
    let baseContent = '';
    if (clientData.templateId) {
      const template = templates.find(t => t.id === clientData.templateId);
      if (template) {
        baseContent = template.content;
        // Update template usage
        setTemplates(templates.map(t => 
          t.id === template.id 
            ? { ...t, usageCount: t.usageCount + 1, lastUsed: new Date().toISOString() }
            : t
        ));
      }
    }
    
    if (!baseContent) {
      // Default content if no template selected
      baseContent = `<div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px; line-height: 1.6;">
        <h1 style="text-align: center; color: #1e40af;">CONTRATO DE PRESTAÇÃO DE SERVIÇOS</h1>
        <p><strong>CONTRATANTE:</strong> {cliente_nome}</p>
        <p><strong>CONTRATADA:</strong> {empresa_nome}</p>
        <p><strong>VALOR:</strong> {contrato_valor_formatado}</p>
    let contractContent = baseContent
      .replace(/\{contrato_numero\}/g, \`CONT-2024-${String(contracts.length + 1).padStart(3, '0')}`)
      .replace(/\{cliente_nome\}/g, client.companyName)
      .replace(/\{cliente_representante\}/g, client.representative)
      .replace(/\{cliente_email\}/g, client.email)
      .replace(/\{cliente_telefone\}/g, client.phone)
      .replace(/\{cliente_nuit\}/g, client.nuit)
      .replace(/\{cliente_endereco\}/g, client.address)
      .replace(/\{empresa_nome\}/g, 'TechSolutions Lda')
      .replace(/\{empresa_email\}/g, 'info@techsolutions.mz')
      .replace(/\{empresa_telefone\}/g, '+258 21 123 456')
      .replace(/\{empresa_endereco\}/g, 'Av. Julius Nyerere, 123, Maputo')
      .replace(/\{empresa_nuit\}/g, '400123456')
      .replace(/\{vendedor_nome\}/g, salesperson?.name || 'Representante da Empresa')
      .replace(/\{vendedor_email\}/g, salesperson?.email || 'vendedor@techsolutions.mz')
      .replace(/\{vendedor_telefone\}/g, salesperson?.phone || '+258 84 000 0000')
      .replace(/\{contrato_valor\}/g, totalValue.toString())
      .replace(/\{contrato_valor_formatado\}/g, \`${totalValue.toLocaleString()} MT`)
      .replace(/\{contrato_valor_extenso\}/g, formatAmountInWords(totalValue))
      .replace(/\{servicos_lista\}/g, `<ul style="margin: 0; padding-left: 20px;">${servicesList}</ul>`)
      .replace(/\{contrato_data_inicio\}/g, new Date().toLocaleDateString('pt-PT'))
      .replace(/\{contrato_data_fim\}/g, new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-PT'))
      .replace(/\{data_hoje\}/g, new Date().toLocaleDateString('pt-PT'))
      .replace(/\{servicos_count\}/g, clientSubscriptions.length.toString())
      .replace(/\{servico_principal\}/g, clientSubscriptions[0]?.serviceName || '');

    const newContract: Contract = {
      id: Date.now().toString(),
      number: `CONT-2024-${String(contracts.length + 1).padStart(3, '0')}`,
      clientId: selectedClientId,
      clientName: client.companyName,
      title: template.name.replace('Template', '') + ` - ${client.companyName}`,
      content: contractContent,
      value: totalValue,
      startDate: earliestStart,
      endDate: latestEnd,
      status: 'draft',
      createdAt: new Date().toISOString(),
      templateId: clientData.templateId,
      salespersonId: clientData.salespersonId
      isAutoGenerated: true,
      services: serviceNames
    };

    setContracts([newContract, ...contracts]);
    setShowTemplateModal(false);
    setSelectedClientId('');
    alert(`✅ Contrato gerado com sucesso!\n\n📄 Número: ${newContract.number}\n👤 Cliente: ${client.companyName}\n👨‍💼 Vendedor: ${salesperson?.name || 'Não atribuído'}\n💰 Valor: ${totalValue.toLocaleString()} MT\n📅 Vigência: 12 meses\n🛍️ Serviços: ${clientSubscriptions.length}\n📋 Status: Rascunho`);
    // Update template last used
    setContractTemplates(contractTemplates.map(t => 
      t.id === template.id 
        ? { ...t, lastUsed: new Date().toISOString() }
        : t
    ));
    
    alert(`✅ Contrato criado usando template!\n\n📄 Template: ${template.name}\n📋 Número: ${newContract.number}\n👤 Cliente: ${client.companyName}\n🛍️ Serviços: ${serviceNames.length}\n💰 Valor Total: ${totalValue.toLocaleString()} MT\n📅 Vigência: ${formatDate(earliestStart)} - ${formatDate(latestEnd)}\n📝 Status: Rascunho (pronto para edição)`);
  };

  const insertVariable = (variable: string) => {
    setTemplateContent(templateContent + ' ' + variable);
  };

  const getCategoryBadge = (category: string) => {
    const cat = templateCategories.find(c => c.id === category);
    if (!cat) return null;
    
    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${cat.color}`}>
        {cat.label}
      </span>
    );
  };

  const filteredTemplates = contractTemplates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const renderContracts = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Gestão de Contratos</h3>
        <button 
          onClick={() => setShowGenerateModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus size={20} />
          Gerar Contrato
        </button>
      </div>

      {/* Status Cards */}
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vigência</th>
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
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {formatDate(contract.startDate)} - {formatDate(contract.endDate)}
                  </td>
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
                        className="text-orange-600 hover:text-orange-900 p-1 hover:bg-orange-50 rounded"
                        title="Editar"
                      >
                        <Edit size={16} />
                      </button>
                      {contract.status === 'draft' && (
                        <button 
                          onClick={() => handleSendContract(contract)}
                          className="text-purple-600 hover:text-purple-900 p-1 hover:bg-purple-50 rounded"
                          title="Enviar"
                        >
                          <Send size={16} />
                        </button>
                      )}
                      {contract.status === 'sent' && (
                        <button 
                          onClick={() => handleSignContract(contract.id)}
                          className="text-emerald-600 hover:text-emerald-900 p-1 hover:bg-emerald-50 rounded"
                          title="Assinar"
                        >
                          <CheckCircle size={16} />
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
          totalPages={totalPages}
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
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus size={20} />
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
                {templates.reduce((max, t) => t.usageCount > max.usageCount ? t : max, templates[0])?.name.substring(0, 15) || 'N/A'}
              </p>
            </div>
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-purple-100 text-purple-600">
              <Star size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Variáveis</p>
              <p className="text-2xl font-bold text-gray-900">
                {availableVariables.reduce((sum, cat) => sum + cat.variables.length, 0)}
              </p>
            </div>
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-orange-100 text-orange-600">
              <Hash size={24} />
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
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">Todas as Categorias</option>
          {templateCategories.map((category) => (
            <option key={category.id} value={category.id}>{category.label}</option>
          ))}
        </select>
      </div>

      {/* Templates Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedTemplates.map((template) => (
          <div key={template.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
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
                onClick={() => handleEditTemplate(template)}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
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

      {/* Generate Contract Modal */}
      {showGenerateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Gerar Novo Contrato</h3>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const contractData = {
                clientId: formData.get('clientId') as string,
                title: formData.get('title') as string,
                templateId: formData.get('templateId') as string,
                salespersonId: formData.get('salespersonId') as string
              };
              handleGenerateContract(contractData);
            }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cliente *</label>
                <select
                  name="clientId"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Selecionar cliente</option>
                  {mockClients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.companyName} - {client.representative}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Template (opcional)</label>
                <select
                  name="templateId"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Contrato básico (sem template)</option>
                  {templates.filter(t => t.isActive).map((template) => (
                    <option key={template.id} value={template.id}>
                      {template.name} - {template.usageCount} usos
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Vendedor/Representante *</label>
                <select
                  name="salespersonId"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Selecionar vendedor</option>
                  {mockSalespeople.map((salesperson) => (
                    <option key={salesperson.id} value={salesperson.id}>
                      {salesperson.name} - {salesperson.email}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Título do Contrato</label>
                <input
                  type="text"
                  name="title"
                  placeholder="Ex: Contrato de Prestação de Serviços Contábeis"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowGenerateModal(false)}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Gerar Contrato
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Contract Modal */}
      {showViewModal && viewingContract && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Visualizar Contrato</h3>
              <div className="flex gap-3">
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
            
            <div className="border border-gray-300 rounded-lg p-4 bg-white max-h-96 overflow-y-auto">
              <div dangerouslySetInnerHTML={{ __html: viewingContract.content }} />
            </div>
          </div>
        </div>
      )}

      {/* Template Modal */}
      {showTemplateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-6xl w-full mx-4 max-h-[95vh] overflow-y-auto">
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
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nome do Template *</label>
                  <input
                    type="text"
                    name="name"
                    defaultValue={editingTemplate?.name || ''}
                    placeholder="Ex: Prestação de Serviços Contábeis"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Categoria *</label>
                  <select
                    name="category"
                    defaultValue={editingTemplate?.category || 'service'}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    {templateCategories.map((category) => (
                      <option key={category.id} value={category.id}>{category.label}</option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Descrição *</label>
                  <input
                    type="text"
                    name="description"
                    defaultValue={editingTemplate?.description || ''}
                    placeholder="Descrição do template..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Conteúdo do Template *</label>
                  <HTMLEditor
                    value={templateContent}
                    onChange={setTemplateContent}
                    placeholder="Digite o conteúdo do template aqui..."
                    height="400px"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Variáveis Disponíveis</label>
                  <div className="border border-gray-300 rounded-lg p-4 max-h-96 overflow-y-auto bg-gray-50">
                    {availableVariables.map((category) => (
                      <div key={category.category} className="mb-4">
                        <h4 className="font-semibold text-gray-900 mb-2">{category.category}</h4>
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
                  {editingTemplate ? 'Atualizar Template' : 'Criar Template'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Contract Modal */}
      {showEditModal && editingContract && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-6xl w-full mx-4 max-h-[95vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Editar Contrato</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Título do Contrato</label>
                <input
                  type="text"
                  value={editingContract.title}
                  onChange={(e) => setEditingContract({...editingContract, title: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Conteúdo do Contrato</label>
                <HTMLEditor
                  value={contractContent}
                  onChange={setContractContent}
                  placeholder="Digite o conteúdo do contrato aqui..."
                  height="400px"
                />
              </div>
              
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingContract(null);
                    setContractContent('');
                  }}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSaveContract}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Salvar Alterações
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Contratos Digitais</h2>
          <p className="text-gray-600 mt-1">Gestão completa de contratos com assinatura digital</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setShowTemplateModal(true)}
            className="border border-blue-600 text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center gap-2"
          >
            <FileText size={16} />
            Usar Template
          </button>
          <button 
            onClick={() => setShowGenerateModal(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus size={20} />
            Gerar Contrato
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {[
            { id: 'contracts', label: 'Contratos', icon: FileText },
            { id: 'templates', label: 'Templates', icon: Edit }
          ].map((tab) => {
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

      {/* Contracts Tab Content */}
      {activeTab === 'contracts' && (
        <>
      {/* Status Cards */}
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
                {contracts.reduce((sum, c) => sum + c.value, 0).toLocaleString()} MT
              </p>
            </div>
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-emerald-100 text-emerald-600">
              <DollarSign size={24} />
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
          <option value="expired">Expirados</option>
        </select>
      </div>

      {/* Contracts Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contrato</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Valor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vigência</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
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
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {contract.value.toLocaleString()} MT
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <div>
                      <div>{formatDate(contract.startDate)}</div>
                      <div className="text-xs text-gray-500">até {formatDate(contract.endDate)}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">{getStatusBadge(contract.status)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      contract.isAutoGenerated 
                        ? 'bg-purple-100 text-purple-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {contract.isAutoGenerated ? '🤖 Auto' : '✏️ Manual'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleDownloadPDF(contract)}
                        className="text-green-600 hover:text-green-900 p-1 hover:bg-green-50 rounded"
                        title="Download PDF"
                      >
                        <Download size={16} />
                      </button>
                      <button 
                        onClick={() => handleEditContract(contract)}
                        className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded"
                        title="Editar"
                      >
                        <Edit size={16} />
                      </button>
                      {contract.status === 'draft' && (
                        <button 
                          onClick={() => handleSendContract(contract.id)}
                          className="text-purple-600 hover:text-purple-900 p-1 hover:bg-purple-50 rounded"
                          title="Enviar"
                        >
                          <Send size={16} />
                        </button>
                      )}
                      {contract.status === 'sent' && (
                        <button 
                          onClick={() => handleSignContract(contract.id)}
                          className="text-orange-600 hover:text-orange-900 p-1 hover:bg-orange-50 rounded"
                          title="Assinar"
                        >
                          <Signature size={16} />
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
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={filteredContracts.length}
          itemsPerPage={itemsPerPage}
        />
      </div>
        </>
      )}

      {/* Templates Tab Content */}
      {activeTab === 'templates' && (
        <>
          {/* Templates Header */}
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Templates de Contratos</h3>
              <p className="text-gray-600">Modelos padronizados para geração automática</p>
            </div>
            <button 
              onClick={() => {
                setEditingTemplate(null);
                setTemplateContent('');
                setShowTemplateEditor(true);
              }}
              className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <Plus size={16} />
              Novo Template
            </button>
          </div>

          {/* Template Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Total Templates</p>
                  <p className="text-2xl font-bold text-gray-900">{contractTemplates.length}</p>
                </div>
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-blue-100 text-blue-600">
                  <FileText size={24} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Templates Ativos</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {contractTemplates.filter(t => t.isActive).length}
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
                    {contractTemplates.find(t => t.lastUsed)?.name.substring(0, 15) || 'Nenhum'}...
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-purple-100 text-purple-600">
                  <Star size={24} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Variáveis</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {availableVariables.reduce((sum, cat) => sum + cat.variables.length, 0)}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-orange-100 text-orange-600">
                  <Hash size={24} />
                </div>
              </div>
            </div>
          </div>

          {/* Template Filters */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2">
                  <Filter className="text-gray-400" size={20} />
                  <span className="text-sm font-medium text-gray-700">Filtros:</span>
                </div>
                {['all', ...templateCategories.map(c => c.id)].map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      selectedCategory === category
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category === 'all' ? 'Todos' : templateCategories.find(c => c.id === category)?.label}
                  </button>
                ))}
              </div>
              
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Pesquisar templates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Templates Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => (
              <div key={template.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
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

                {template.lastUsed && (
                  <div className="mb-4 text-xs text-gray-500">
                    Último uso: {formatDate(template.lastUsed)}
                  </div>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedClientId('');
                      setShowTemplateModal(true);
                      // Pre-select this template
                      setTimeout(() => {
                        const templateSelect = document.getElementById('templateSelect') as HTMLSelectElement;
                        if (templateSelect) {
                          templateSelect.value = template.id;
                        }
                      }, 100);
                    }}
                    className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 text-sm"
                  >
                    <FileText size={14} />
                    Usar
                  </button>
                  <button
                    onClick={() => handleEditTemplate(template)}
                    className="border border-gray-300 text-gray-700 py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Edit size={14} />
                  </button>
                  <button
                    onClick={() => handleDeleteTemplate(template.id)}
                    className="border border-red-300 text-red-600 py-2 px-3 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Generate Contract Modal */}
      {showGenerateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Plus className="text-blue-600" size={20} />
              Gerar Contrato Automaticamente
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Selecionar Cliente *
                </label>
                <select
                  value={selectedClientId}
                  onChange={(e) => setSelectedClientId(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Escolha um cliente</option>
                  {mockClients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.companyName} - {client.representative}
                    </option>
                  ))}
                </select>
              </div>

              {/* Preview of client subscriptions */}
              {selectedClientId && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                    <Eye className="text-blue-600" size={16} />
                    Subscrições Ativas do Cliente
                  </h4>
                  {(() => {
                    const clientSubscriptions = getClientSubscriptions(selectedClientId);
                    const client = mockClients.find(c => c.id === selectedClientId);
                    
                    if (clientSubscriptions.length === 0) {
                      return (
                        <div className="text-center py-6">
                          <AlertCircle className="text-red-500 mx-auto mb-3" size={32} />
                          <p className="text-red-700 font-medium">Nenhuma subscrição ativa encontrada</p>
                          <p className="text-sm text-red-600 mt-1">
                            Este cliente não possui subscrições ativas. Crie subscrições primeiro.
                          </p>
                        </div>
                      );
                    }

                    const totalValue = clientSubscriptions.reduce((sum, sub) => sum + sub.totalWithIva, 0);
                    
                    return (
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Cliente:</span>
                            <span className="font-medium text-gray-900 ml-2">{client?.companyName}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Total de Serviços:</span>
                            <span className="font-medium text-gray-900 ml-2">{clientSubscriptions.length}</span>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          {clientSubscriptions.map((sub) => (
                            <div key={sub.id} className="flex justify-between items-center p-2 bg-white rounded border">
                              <span className="text-sm text-gray-900">{sub.serviceName}</span>
                              <span className="text-sm font-medium text-gray-900">{sub.totalWithIva.toLocaleString()} MT</span>
                            </div>
                          ))}
                        </div>
                        
                        <div className="pt-3 border-t border-gray-200">
                          <div className="flex justify-between items-center">
                            <span className="font-medium text-gray-900">Valor Total do Contrato:</span>
                            <span className="text-lg font-bold text-blue-600">{totalValue.toLocaleString()} MT</span>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
            
            <div className="flex gap-3 pt-6">
              <button
                onClick={() => {
                  setShowGenerateModal(false);
                  setSelectedClientId('');
                }}
                className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleGenerateContract}
                disabled={!selectedClientId || getClientSubscriptions(selectedClientId).length === 0}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Gerar Contrato
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Contract Modal */}
      {showEditModal && editingContract && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl max-w-6xl w-full mx-4 h-[90vh] flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Edit className="text-blue-600" size={20} />
                    Editando: {editingContract.number}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Cliente: {editingContract.clientName} • 
                    {editingContract.isAutoGenerated ? ' Gerado automaticamente' : ' Criado manualmente'}
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowEditModal(false);
                      setEditingContract(null);
                      setEditContent('');
                    }}
                    className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                  >
                    <Save size={16} />
                    Salvar Alterações
                  </button>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 flex">
              {/* Editor */}
              <div className="flex-1 p-6">
                <HTMLEditor
                  value={editContent}
                  onChange={setEditContent}
                  placeholder="Conteúdo do contrato..."
                  height="500px"
                />
              </div>

              {/* Contract Info Panel */}
              <div className="w-80 bg-gray-50 border-l border-gray-200 p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Informações do Contrato</h4>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-600">Número</label>
                    <p className="font-medium text-gray-900">{editingContract.number}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm text-gray-600">Cliente</label>
                    <p className="font-medium text-gray-900">{editingContract.clientName}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm text-gray-600">Valor</label>
                    <p className="font-medium text-gray-900">{editingContract.value.toLocaleString()} MT</p>
                  </div>
                  
                  <div>
                    <label className="text-sm text-gray-600">Vigência</label>
                    <p className="font-medium text-gray-900">
                      {formatDate(editingContract.startDate)} - {formatDate(editingContract.endDate)}
                    </p>
                  </div>
                  
                  <div>
                    <label className="text-sm text-gray-600">Status</label>
                    <div className="mt-1">{getStatusBadge(editingContract.status)}</div>
                  </div>
                  
                  <div>
                    <label className="text-sm text-gray-600">Tipo</label>
                    <p className="font-medium text-gray-900">
                      {editingContract.isAutoGenerated ? '🤖 Gerado Automaticamente' : '✏️ Criado Manualmente'}
                    </p>
                  </div>
                  
                  {editingContract.services.length > 0 && (
                    <div>
                      <label className="text-sm text-gray-600">Serviços Incluídos</label>
                      <div className="mt-1 space-y-1">
                        {editingContract.services.map((service, idx) => (
                          <div key={idx} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            {service}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {editingContract.signatureHash && (
                    <div>
                      <label className="text-sm text-gray-600">Hash de Assinatura</label>
                      <p className="font-mono text-xs text-gray-900 break-all">
                        {editingContract.signatureHash}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Use Template Modal */}
      {showTemplateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="text-blue-600" size={20} />
              Usar Template de Contrato
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Selecionar Template *
                </label>
                <select
                  id="templateSelect"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Escolha um template</option>
                  {contractTemplates.filter(t => t.isActive).map((template) => (
                    <option key={template.id} value={template.id}>
                      {template.name} - {templateCategories.find(c => c.id === template.category)?.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Selecionar Cliente *
                </label>
                <select
                  value={selectedClientId}
                  onChange={(e) => setSelectedClientId(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Escolha um cliente</option>
                  {mockClients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.companyName} - {client.representative}
                    </option>
                  ))}
                </select>
              </div>

              {/* Preview of client subscriptions */}
              {selectedClientId && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                    <Eye className="text-blue-600" size={16} />
                    Subscrições Ativas do Cliente
                  </h4>
                  {(() => {
                    const clientSubscriptions = getClientSubscriptions(selectedClientId);
                    const client = mockClients.find(c => c.id === selectedClientId);
                    
                    if (clientSubscriptions.length === 0) {
                      return (
                        <div className="text-center py-6">
                          <AlertCircle className="text-red-500 mx-auto mb-3" size={32} />
                          <p className="text-red-700 font-medium">Nenhuma subscrição ativa encontrada</p>
                          <p className="text-sm text-red-600 mt-1">
                            Este cliente não possui subscrições ativas. Crie subscrições primeiro.
                          </p>
                        </div>
                      );
                    }

                    const totalValue = clientSubscriptions.reduce((sum, sub) => sum + sub.totalWithIva, 0);
                    
                    return (
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Cliente:</span>
                            <span className="font-medium text-gray-900 ml-2">{client?.companyName}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Total de Serviços:</span>
                            <span className="font-medium text-gray-900 ml-2">{clientSubscriptions.length}</span>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          {clientSubscriptions.map((sub) => (
                            <div key={sub.id} className="flex justify-between items-center p-2 bg-white rounded border">
                              <span className="text-sm text-gray-900">{sub.serviceName}</span>
                              <span className="text-sm font-medium text-gray-900">{sub.totalWithIva.toLocaleString()} MT</span>
                            </div>
                          ))}
                        </div>
                        
                        <div className="pt-3 border-t border-gray-200">
                          <div className="flex justify-between items-center">
                            <span className="font-medium text-gray-900">Valor Total do Contrato:</span>
                            <span className="text-lg font-bold text-blue-600">{totalValue.toLocaleString()} MT</span>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
            
            <div className="flex gap-3 pt-6">
              <button
                onClick={() => {
                  setShowTemplateModal(false);
                  setSelectedClientId('');
                }}
                className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  const templateSelect = document.getElementById('templateSelect') as HTMLSelectElement;
                  const selectedTemplateId = templateSelect.value;
                  
                  if (!selectedTemplateId || !selectedClientId) {
                    alert('Selecione um template e um cliente');
                    return;
                  }
                  
                  const template = contractTemplates.find(t => t.id === selectedTemplateId);
                  if (template) {
                    handleUseTemplate(template);
                  }
                }}
                disabled={!selectedClientId}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Gerar com Template
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Template Editor Modal */}
      {showTemplateEditor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl max-w-7xl w-full mx-4 h-[95vh] flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Edit className="text-green-600" size={20} />
                    {editingTemplate ? `Editando: ${editingTemplate.name}` : 'Novo Template de Contrato'}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Editor HTML avançado com variáveis dinâmicas para contratos padronizados
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowTemplateEditor(false);
                      setEditingTemplate(null);
                      setTemplateContent('');
                    }}
                    className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => {
                      const templateName = prompt('Nome do template:');
                      if (!templateName) return;
                      
                      const templateDescription = prompt('Descrição do template:');
                      if (!templateDescription) return;
                      
                      const templateCategory = prompt('Categoria (service/maintenance/consulting/general):') || 'general';
                      
                      handleSaveTemplate({
                        name: templateName,
                        description: templateDescription,
                        category: templateCategory as any,
                        variables: templateContent.match(/\{[^}]+\}/g) || []
                      });
                    }}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                  >
                    <Save size={16} />
                    Salvar Template
                  </button>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 flex">
              {/* Editor */}
              <div className="flex-1 p-6">
                <HTMLEditor
                  value={templateContent}
                  onChange={setTemplateContent}
                  placeholder="Digite o conteúdo do template aqui..."
                  height="600px"
                />
              </div>

              {/* Variables Panel */}
              <div className="w-80 bg-gray-50 border-l border-gray-200 p-6">
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

                {/* Template Guidelines */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <h5 className="font-medium text-gray-800 mb-3">Diretrizes de Template</h5>
                  <div className="space-y-2 text-xs text-gray-600">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Use formato A4 (max-width: 800px)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Fonte Arial, line-height: 1.6</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span>Cores: #2563eb (azul), #059669 (verde)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span>Padding: 20px, margin: 0 auto</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};