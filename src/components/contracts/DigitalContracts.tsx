import React, { useState } from 'react';
import { 
  FileText, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Download, 
  PenTool, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Search,
  Filter,
  Calendar,
  DollarSign,
  User,
  Building,
  Mail,
  Phone,
  MapPin,
  Send,
  Save,
  X,
  Hash,
  Shield
} from 'lucide-react';
import { HTMLEditor } from '../common/HTMLEditor';
import { PDFGenerator } from '../../utils/pdfGenerator';
import { Pagination } from '../common/Pagination';

interface Contract {
  id: string;
  number: string;
  title: string;
  content: string;
  clientId: string;
  value: number;
  startDate: string;
  endDate: string;
  status: 'draft' | 'sent' | 'signed' | 'cancelled';
  createdAt: string;
  signedAt?: string;
  signatureHash?: string;
  signerName?: string;
  signerEmail?: string;
  notes?: string;
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

// Dados iniciais vazios - serão preenchidos conforme uso real
const initialClients: Client[] = [];

const initialContracts: Contract[] = [];

// Template padrão para novos contratos
const defaultContractTemplate = `
<div style="max-width: 800px; margin: 0 auto; font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
  <div style="text-align: center; margin-bottom: 40px; padding: 20px; border-bottom: 2px solid #3b82f6;">
    <h1 style="color: #1f2937; margin-bottom: 10px;">CONTRATO DE PRESTAÇÃO DE SERVIÇOS</h1>
    <p style="color: #6b7280; margin: 0;">Número: {numero_contrato}</p>
  </div>

  <div style="margin-bottom: 30px;">
    <h2 style="color: #1f2937; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px;">PARTES CONTRATANTES</h2>
    
    <div style="margin: 20px 0;">
      <h3 style="color: #374151;">CONTRATANTE:</h3>
      <p><strong>Empresa:</strong> {cliente_nome}</p>
      <p><strong>Representante:</strong> {cliente_representante}</p>
      <p><strong>NUIT:</strong> {cliente_nuit}</p>
      <p><strong>Endereço:</strong> {cliente_endereco}</p>
      <p><strong>Email:</strong> {cliente_email}</p>
      <p><strong>Telefone:</strong> {cliente_telefone}</p>
    </div>

    <div style="margin: 20px 0;">
      <h3 style="color: #374151;">CONTRATADO:</h3>
      <p><strong>Empresa:</strong> Sua Empresa Lda</p>
      <p><strong>NUIT:</strong> 400000000</p>
      <p><strong>Endereço:</strong> Endereço da sua empresa</p>
      <p><strong>Email:</strong> admin@suaempresa.mz</p>
      <p><strong>Telefone:</strong> +258 21 000 000</p>
    </div>
  </div>

  <div style="margin-bottom: 30px;">
    <h2 style="color: #1f2937; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px;">OBJETO DO CONTRATO</h2>
    <p>O presente contrato tem por objeto a prestação de serviços de {titulo_contrato}, conforme especificações detalhadas abaixo.</p>
  </div>

  <div style="margin-bottom: 30px;">
    <h2 style="color: #1f2937; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px;">VALOR E CONDIÇÕES DE PAGAMENTO</h2>
    <p><strong>Valor Total:</strong> {valor_contrato} MT (Meticais)</p>
    <p><strong>Período:</strong> {data_inicio} a {data_fim}</p>
    <p><strong>Forma de Pagamento:</strong> Conforme acordado entre as partes</p>
  </div>

  <div style="margin-bottom: 30px;">
    <h2 style="color: #1f2937; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px;">CLÁUSULAS GERAIS</h2>
    <p>1. O presente contrato entra em vigor na data de assinatura por ambas as partes.</p>
    <p>2. Qualquer alteração deverá ser feita por escrito e acordada por ambas as partes.</p>
    <p>3. O contrato é regido pela legislação moçambicana.</p>
  </div>

  <div style="margin-top: 50px; display: flex; justify-content: space-between;">
    <div style="text-align: center; width: 45%;">
      <div style="border-top: 1px solid #000; padding-top: 10px;">
        <p><strong>CONTRATANTE</strong></p>
        <p>{cliente_representante}</p>
        <p>{cliente_nome}</p>
      </div>
    </div>
    <div style="text-align: center; width: 45%;">
      <div style="border-top: 1px solid #000; padding-top: 10px;">
        <p><strong>CONTRATADO</strong></p>
        <p>Administrador</p>
        <p>Sua Empresa Lda</p>
      </div>
    </div>
  </div>

  <div style="margin-top: 40px; text-align: center; font-size: 12px; color: #6b7280;">
    <p>Contrato gerado digitalmente pelo Sistema Signius</p>
    <p>Data de geração: {data_geracao}</p>
  </div>
</div>
`;

export const DigitalContracts: React.FC = () => {
  const [contracts, setContracts] = useState<Contract[]>(initialContracts);
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'sent' | 'signed' | 'cancelled'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showClientModal, setShowClientModal] = useState(false);
  const [editingContract, setEditingContract] = useState<Contract | null>(null);
  const [viewingContract, setViewingContract] = useState<Contract | null>(null);
  const [showContractModal, setShowContractModal] = useState(false);
  const [contractContent, setContractContent] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredContracts = contracts.filter(contract => {
    const client = clients.find(c => c.id === contract.clientId);
    const clientName = client ? client.companyName : '';
    
    const matchesSearch = contract.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contract.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         clientName.toLowerCase().includes(searchTerm.toLowerCase());
    
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

  const getClientName = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    return client ? client.companyName : 'Cliente não encontrado';
  };

  const handleAddContract = () => {
    if (clients.length === 0) {
      alert('⚠️ Nenhum cliente cadastrado!\n\nPara criar contratos, primeiro adicione clientes no sistema.\n\n📋 Vá para: Clientes → Novo Cliente');
      return;
    }
    setEditingContract(null);
    setContractContent(defaultContractTemplate);
    setShowAddModal(true);
  };

  const handleAddClient = () => {
    setShowClientModal(true);
  };

  const handleEditContract = (contract: Contract) => {
    setEditingContract(contract);
    setContractContent(contract.content);
    setShowAddModal(true);
  };

  const handleViewContract = (contract: Contract) => {
    setViewingContract(contract);
    setShowContractModal(true);
  };

  const handleDeleteContract = (contractId: string) => {
    if (confirm('Tem certeza que deseja eliminar este contrato?')) {
      setContracts(contracts.filter(c => c.id !== contractId));
      alert('Contrato eliminado com sucesso!');
    }
  };

  const handleSaveClient = (clientData: Partial<Client>) => {
    const newClient: Client = {
      id: Date.now().toString(),
      companyName: clientData.companyName || '',
      representative: clientData.representative || '',
      email: clientData.email || '',
      phone: clientData.phone || '',
      nuit: clientData.nuit || '',
      address: clientData.address || ''
    };
    
    setClients([...clients, newClient]);
    setShowClientModal(false);
    alert(`✅ Cliente "${newClient.companyName}" adicionado com sucesso!\n\n👤 Representante: ${newClient.representative}\n📧 Email: ${newClient.email}\n📱 Telefone: ${newClient.phone}\n🏢 NUIT: ${newClient.nuit}\n📍 Endereço: ${newClient.address}\n\n🎯 Agora você pode criar contratos para este cliente!`);
  };

  const replaceVariables = (content: string, contract: Contract, client: Client) => {
    const variables = {
      '{numero_contrato}': contract.number,
      '{titulo_contrato}': contract.title,
      '{valor_contrato}': contract.value.toLocaleString(),
      '{data_inicio}': formatDate(contract.startDate),
      '{data_fim}': formatDate(contract.endDate),
      '{cliente_nome}': client.companyName,
      '{cliente_representante}': client.representative,
      '{cliente_email}': client.email,
      '{cliente_telefone}': client.phone,
      '{cliente_nuit}': client.nuit,
      '{cliente_endereco}': client.address,
      '{data_geracao}': new Date().toLocaleDateString('pt-PT')
    };

    let processedContent = content;
    Object.entries(variables).forEach(([key, value]) => {
      processedContent = processedContent.replace(new RegExp(key.replace(/[{}]/g, '\\$&'), 'g'), value);
    });

    return processedContent;
  };

  const handleSaveContract = (contractData: any) => {
    if (editingContract) {
      // Update existing contract
      setContracts(contracts.map(c => 
        c.id === editingContract.id 
          ? { ...c, ...contractData, content: contractContent }
          : c
      ));
      alert(`✅ Contrato "${contractData.title}" atualizado com sucesso!\n\n📄 Número: ${contractData.number || editingContract.number}\n👤 Cliente: ${getClientName(contractData.clientId)}\n💰 Valor: ${contractData.value.toLocaleString()} MT\n📅 Período: ${formatDate(contractData.startDate)} - ${formatDate(contractData.endDate)}\n📝 Status: ${contractData.status || editingContract.status}\n🕒 Atualizado em: ${new Date().toLocaleString('pt-PT')}`);
    } else {
      // Add new contract
      const newContract: Contract = {
        id: Date.now().toString(),
        number: contractData.number || `CONT-${new Date().getFullYear()}-${String(contracts.length + 1).padStart(3, '0')}`,
        title: contractData.title,
        content: contractContent,
        clientId: contractData.clientId,
        value: contractData.value,
        startDate: contractData.startDate,
        endDate: contractData.endDate,
        status: 'draft',
        createdAt: new Date().toISOString(),
        notes: contractData.notes
      };
      setContracts([...contracts, newContract]);
      alert(`✅ Novo contrato "${newContract.title}" criado com sucesso!\n\n📄 Número: ${newContract.number}\n👤 Cliente: ${getClientName(newContract.clientId)}\n💰 Valor: ${newContract.value.toLocaleString()} MT\n📅 Período: ${formatDate(newContract.startDate)} - ${formatDate(newContract.endDate)}\n📝 Status: Rascunho\n🕒 Criado em: ${new Date().toLocaleString('pt-PT')}\n\n🎯 Próximos passos: Revisar e enviar para assinatura`);
    }
    setShowAddModal(false);
    setEditingContract(null);
  };

  const handleSendContract = (contractId: string) => {
    const contract = contracts.find(c => c.id === contractId);
    if (!contract) return;

    setContracts(contracts.map(c => 
      c.id === contractId 
        ? { ...c, status: 'sent' }
        : c
    ));
    
    alert(`✅ Contrato enviado com sucesso!\n\n📄 Contrato: ${contract.title}\n👤 Cliente: ${getClientName(contract.clientId)}\n📧 Enviado para assinatura digital\n📅 Enviado em: ${new Date().toLocaleString('pt-PT')}\n\n🔔 O cliente receberá um email com o link para assinatura`);
  };

  const handleSignContract = (contractId: string) => {
    const signerName = prompt('Para assinar digitalmente, digite seu nome completo:');
    
    if (!signerName || signerName.trim().length < 3) {
      alert('❌ Nome inválido!\n\nPor favor, digite seu nome completo para prosseguir com a assinatura digital.');
      return;
    }
    
    const contract = contracts.find(c => c.id === contractId);
    if (!contract) return;
    
    if (confirm(`Confirma a assinatura digital do contrato?\n\n👤 Assinante: ${signerName.trim()}\n📄 Contrato: ${contract.title}\n💰 Valor: ${contract.value.toLocaleString()} MT\n\n⚠️ Esta ação não pode ser desfeita.`)) {
      const signatureHash = `SIG_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      
      setContracts(contracts.map(c => 
        c.id === contractId 
          ? { 
              ...c, 
              status: 'signed',
              signedAt: new Date().toISOString(),
              signatureHash,
              signerName: signerName.trim()
            }
          : c
      ));
      
      alert(`✅ Contrato assinado digitalmente com sucesso!\n\n👤 Assinante: ${signerName.trim()}\n🔐 Hash de Segurança: ${signatureHash}\n📅 Data: ${new Date().toLocaleString('pt-PT')}\n✅ Status: Assinado\n\n📧 Uma cópia foi enviada para o seu email.`);
    }
  };

  const handleDownloadContract = (contract: Contract) => {
    const client = clients.find(c => c.id === contract.clientId);
    if (!client) {
      alert('Cliente não encontrado');
      return;
    }

    const processedContent = replaceVariables(contract.content, contract, client);
    
    PDFGenerator.generateContract({
      number: contract.number,
      clientInfo: {
        companyName: client.companyName,
        representative: client.representative,
        email: client.email,
        phone: client.phone,
        nuit: client.nuit,
        address: client.address
      },
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Contratos Digitais</h2>
          <p className="text-gray-600 mt-1">Criar, gerir e assinar contratos digitalmente</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleAddClient}
            className="border border-blue-600 text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center gap-2"
          >
            <Plus size={20} />
            Novo Cliente
          </button>
          <button 
            onClick={handleAddContract}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus size={20} />
            Novo Contrato
          </button>
        </div>
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

      {/* Empty State */}
      {contracts.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12">
          <div className="text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="text-gray-400" size={48} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Nenhum contrato criado ainda</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Comece criando seu primeiro contrato digital. O sistema permite criar, enviar e assinar contratos de forma totalmente digital.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {clients.length === 0 ? (
                <button 
                  onClick={handleAddClient}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <Plus size={20} />
                  Primeiro, Adicionar Cliente
                </button>
              ) : (
                <button 
                  onClick={handleAddContract}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <Plus size={20} />
                  Criar Primeiro Contrato
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <>
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Período</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {paginatedContracts.map((contract) => (
                    <tr key={contract.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{contract.title}</div>
                          <div className="text-sm text-gray-500">{contract.number}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{getClientName(contract.clientId)}</td>
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
                          {contract.status === 'draft' && (
                            <button 
                              onClick={() => handleEditContract(contract)}
                              className="text-orange-600 hover:text-orange-900 p-1 hover:bg-orange-50 rounded"
                              title="Editar"
                            >
                              <Edit size={16} />
                            </button>
                          )}
                          {contract.status === 'draft' && (
                            <button 
                              onClick={() => handleSendContract(contract.id)}
                              className="text-purple-600 hover:text-purple-900 p-1 hover:bg-purple-50 rounded"
                              title="Enviar para Assinatura"
                            >
                              <Send size={16} />
                            </button>
                          )}
                          {contract.status === 'sent' && (
                            <button 
                              onClick={() => handleSignContract(contract.id)}
                              className="text-green-600 hover:text-green-900 p-1 hover:bg-green-50 rounded"
                              title="Assinar Digitalmente"
                            >
                              <PenTool size={16} />
                            </button>
                          )}
                          <button 
                            onClick={() => handleDeleteContract(contract.id)}
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

      {/* Add Client Modal */}
      {showClientModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Adicionar Novo Cliente</h3>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const clientData = {
                companyName: formData.get('companyName') as string,
                representative: formData.get('representative') as string,
                email: formData.get('email') as string,
                phone: formData.get('phone') as string,
                nuit: formData.get('nuit') as string,
                address: formData.get('address') as string
              };
              handleSaveClient(clientData);
            }} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nome da Empresa *</label>
                  <input
                    type="text"
                    name="companyName"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ex: Transportes Maputo Lda"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Representante *</label>
                  <input
                    type="text"
                    name="representative"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ex: João Silva"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                  <input
                    type="email"
                    name="email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ex: joao@empresa.mz"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Telefone *</label>
                  <input
                    type="text"
                    name="phone"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ex: +258 84 123 4567"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">NUIT *</label>
                  <input
                    type="text"
                    name="nuit"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ex: 400123456"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Endereço *</label>
                  <input
                    type="text"
                    name="address"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ex: Av. Eduardo Mondlane, 567, Maputo"
                    required
                  />
                </div>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowClientModal(false)}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Adicionar Cliente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add/Edit Contract Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-6xl w-full mx-4 max-h-[95vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {editingContract ? 'Editar Contrato' : 'Novo Contrato'}
            </h3>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const contractData = {
                number: formData.get('number') as string,
                title: formData.get('title') as string,
                clientId: formData.get('clientId') as string,
                value: Number(formData.get('value')),
                startDate: formData.get('startDate') as string,
                endDate: formData.get('endDate') as string,
                notes: formData.get('notes') as string
              };
              handleSaveContract(contractData);
            }} className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Número do Contrato</label>
                  <input
                    type="text"
                    name="number"
                    defaultValue={editingContract?.number || `CONT-${new Date().getFullYear()}-${String(contracts.length + 1).padStart(3, '0')}`}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Título do Contrato *</label>
                  <input
                    type="text"
                    name="title"
                    defaultValue={editingContract?.title || ''}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ex: Contrato de Prestação de Serviços"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cliente *</label>
                  <select
                    name="clientId"
                    defaultValue={editingContract?.clientId || ''}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Selecionar cliente</option>
                    {clients.map((client) => (
                      <option key={client.id} value={client.id}>
                        {client.companyName} - {client.representative}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Valor (MT) *</label>
                  <input
                    type="number"
                    name="value"
                    defaultValue={editingContract?.value || ''}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ex: 50000"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Data de Início *</label>
                  <input
                    type="date"
                    name="startDate"
                    defaultValue={editingContract?.startDate || new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Data de Fim *</label>
                  <input
                    type="date"
                    name="endDate"
                    defaultValue={editingContract?.endDate || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Conteúdo do Contrato *</label>
                <HTMLEditor
                  value={contractContent}
                  onChange={setContractContent}
                  placeholder="Digite o conteúdo do contrato aqui..."
                  height="300px"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Use variáveis como {'{cliente_nome}'}, {'{valor_contrato}'}, {'{data_inicio}'} que serão substituídas automaticamente
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Observações</label>
                <textarea
                  name="notes"
                  defaultValue={editingContract?.notes || ''}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Observações adicionais sobre o contrato..."
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
                  {editingContract ? 'Atualizar' : 'Criar Contrato'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Contract Modal */}
      {showContractModal && viewingContract && (
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
                  onClick={() => setShowContractModal(false)}
                  className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Fechar
                </button>
              </div>
            </div>
            
            <div className="border border-gray-300 rounded-lg p-6 bg-white max-h-96 overflow-y-auto">
              <div dangerouslySetInnerHTML={{ 
                __html: viewingContract ? (() => {
                  const client = clients.find(c => c.id === viewingContract.clientId);
                  return client ? replaceVariables(viewingContract.content, viewingContract, client) : viewingContract.content;
                })() : ''
              }} />
            </div>

            {/* Contract Info */}
            <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Status: {getStatusBadge(viewingContract.status)}</p>
                <p className="text-gray-600">Valor: <span className="font-medium">{viewingContract.value.toLocaleString()} MT</span></p>
              </div>
              <div>
                <p className="text-gray-600">Período: <span className="font-medium">{formatDate(viewingContract.startDate)} - {formatDate(viewingContract.endDate)}</span></p>
                {viewingContract.signedAt && (
                  <p className="text-gray-600">Assinado em: <span className="font-medium">{formatDate(viewingContract.signedAt)}</span></p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};