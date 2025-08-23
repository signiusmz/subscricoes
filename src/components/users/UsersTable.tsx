import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, Shield, User, Mail, Phone, Calendar } from 'lucide-react';
import { User as UserType } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { Pagination } from '../common/Pagination';

const mockUsers: UserType[] = [
  {
    id: '1',
    name: 'João Silva',
    email: 'joao@techsolutions.mz',
    phone: '+258 84 123 4567',
    role: 'admin',
    companyId: '1',
    createdAt: '2024-01-15T00:00:00Z',
    isActive: true,
    permissions: ['all']
  },
  {
    id: '2',
    name: 'Maria Santos',
    email: 'maria@techsolutions.mz',
    phone: '+258 85 987 6543',
    role: 'manager',
    companyId: '1',
    createdAt: '2024-02-01T00:00:00Z',
    isActive: true,
    permissions: ['clients', 'services', 'reports']
  },
  {
    id: '3',
    name: 'Carlos Mendes',
    email: 'carlos@techsolutions.mz',
    phone: '+258 86 555 7777',
    role: 'user',
    companyId: '1',
    createdAt: '2024-02-15T00:00:00Z',
    isActive: false,
    permissions: ['clients']
  }
];

const roleLabels = {
  admin: 'Administrador',
  manager: 'Gestor',
  user: 'Utilizador'
};

const availablePermissions = [
  { id: 'clients', label: 'Gestão de Clientes' },
  { id: 'services', label: 'Gestão de Serviços' },
  { id: 'subscriptions', label: 'Gestão de Subscrições' },
  { id: 'reports', label: 'Relatórios' },
  { id: 'settings', label: 'Configurações' }
];

export const UsersTable: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState<UserType | null>(null);
  const [users, setUsers] = useState<UserType[]>(mockUsers);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

  // Reset to first page when search changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-PT');
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

  const getRoleBadge = (role: string) => {
    const roleConfig = {
      admin: { bg: 'bg-purple-100', text: 'text-purple-800' },
      manager: { bg: 'bg-blue-100', text: 'text-blue-800' },
      user: { bg: 'bg-gray-100', text: 'text-gray-800' }
    };
    
    const config = roleConfig[role as keyof typeof roleConfig] || roleConfig.user;
    
    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${config.bg} ${config.text}`}>
        {roleLabels[role as keyof typeof roleLabels]}
      </span>
    );
  };

  const handleAddUser = () => {
    setShowAddModal(true);
  };

  const handleEditUser = (user: UserType) => {
    setEditingUser(user);
    setShowAddModal(true);
  };

  const handleDeleteUser = (userId: string) => {
    if (userId === currentUser?.id) {
      alert('Não pode eliminar o seu próprio utilizador!');
      return;
    }
    
    if (confirm('Tem certeza que deseja eliminar este utilizador?')) {
      setUsers(users.filter(u => u.id !== userId));
      alert('Utilizador eliminado com sucesso!');
    }
  };

  const handleToggleStatus = (userId: string) => {
    if (userId === currentUser?.id) {
      alert('Não pode desativar o seu próprio utilizador!');
      return;
    }
    
    setUsers(users.map(u => 
      u.id === userId 
        ? { ...u, isActive: !u.isActive }
        : u
    ));
    alert('Status do utilizador atualizado!');
  };

  const handleSaveUser = (userData: Partial<UserType>) => {
    if (editingUser) {
      // Update existing user
      setUsers(users.map(u => 
        u.id === editingUser.id 
          ? { ...u, ...userData }
          : u
      ));
      alert('Utilizador atualizado com sucesso!');
    } else {
      // Add new user
      const newUser: UserType = {
        id: Date.now().toString(),
        name: userData.name || '',
        email: userData.email || '',
        phone: userData.phone || '',
        role: userData.role || 'user',
        companyId: currentUser?.companyId || '1',
        createdAt: new Date().toISOString(),
        isActive: true,
        permissions: userData.permissions || []
      };
      setUsers([...users, newUser]);
      alert('Utilizador adicionado com sucesso!');
    }
    setShowAddModal(false);
    setEditingUser(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestão de Utilizadores</h2>
          <p className="text-gray-600 mt-1">Gerir utilizadores e permissões da empresa</p>
        </div>
        <button 
          onClick={handleAddUser}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus size={20} />
          Novo Utilizador
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Pesquisar utilizadores..."
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
                  Utilizador
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contacto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Função
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Permissões
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
              {paginatedUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center bg-gray-400">
                        {user.profilePhoto ? (
                          <img 
                            src={user.profilePhoto} 
                            alt="Profile" 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User size={20} className="text-white" />
                        )}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500 flex items-center gap-1">
                          <Calendar size={12} />
                          {formatDate(user.createdAt)}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm space-y-1">
                      <div className="flex items-center gap-2 text-gray-900">
                        <Mail size={12} />
                        {user.email}
                      </div>
                      <div className="flex items-center gap-2 text-gray-500">
                        <Phone size={12} />
                        {user.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getRoleBadge(user.role)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {user.permissions.includes('all') ? (
                        <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded">
                          Todas
                        </span>
                      ) : (
                        user.permissions.slice(0, 2).map((permission) => {
                          const perm = availablePermissions.find(p => p.id === permission);
                          return perm ? (
                            <span key={permission} className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                              {perm.label}
                            </span>
                          ) : null;
                        })
                      )}
                      {user.permissions.length > 2 && !user.permissions.includes('all') && (
                        <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded">
                          +{user.permissions.length - 2}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(user.isActive)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleEditUser(user)}
                        className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded"
                        title="Editar"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => handleToggleStatus(user.id)}
                        className="text-orange-600 hover:text-orange-900 p-1 hover:bg-orange-50 rounded"
                        title={user.isActive ? "Desativar" : "Ativar"}
                      >
                        <Shield size={16} />
                      </button>
                      <button 
                        onClick={() => handleDeleteUser(user.id)}
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
          totalItems={filteredUsers.length}
          itemsPerPage={itemsPerPage}
        />
      </div>

      {/* Add/Edit User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {editingUser ? 'Editar Utilizador' : 'Novo Utilizador'}
            </h3>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const permissions = Array.from(formData.getAll('permissions')) as string[];
              
              const userData = {
                name: formData.get('name') as string,
                email: formData.get('email') as string,
                phone: formData.get('phone') as string,
                role: formData.get('role') as 'admin' | 'manager' | 'user',
                permissions: formData.get('role') === 'admin' ? ['all'] : permissions,
              };
              handleSaveUser(userData);
            }} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    name="name"
                    defaultValue={editingUser?.name || ''}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    defaultValue={editingUser?.email || ''}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Telefone
                  </label>
                  <input
                    type="text"
                    name="phone"
                    defaultValue={editingUser?.phone || '+258 '}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+258 84 123 4567"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Função
                  </label>
                  <select
                    name="role"
                    defaultValue={editingUser?.role || 'user'}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="user">Utilizador</option>
                    <option value="manager">Gestor</option>
                    <option value="admin">Administrador</option>
                  </select>
                </div>
              </div>

              {/* Permissions */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Permissões
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {availablePermissions.map((permission) => (
                    <label key={permission.id} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="permissions"
                        value={permission.id}
                        defaultChecked={editingUser?.permissions.includes(permission.id) || editingUser?.permissions.includes('all')}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-700">{permission.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {!editingUser && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Palavra-passe Temporária
                  </label>
                  <input
                    type="password"
                    name="password"
                    placeholder="Será enviada por email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              )}
              
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingUser(null);
                  }}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingUser ? 'Atualizar' : 'Adicionar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};