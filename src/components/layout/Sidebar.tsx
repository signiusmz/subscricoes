import React, { useState } from 'react';
import { 
  Home, 
  Users, 
  Settings, 
  BarChart3, 
  Bell, 
  FileText, 
  CreditCard,
  Receipt,
  User,
  LogOut,
  Edit,
  Camera,
  Upload,
  Send,
  Clock,
  Calculator,
  PenTool,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTawkTo } from '../common/TawkToChat';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const getMenuItems = (userRole: string) => [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'clients', label: 'Clientes', icon: Users },
  { id: 'subscriptions', label: 'Subscrições', icon: CreditCard },
  { id: 'billing', label: 'Facturação', icon: Receipt },
  { id: 'tax', label: 'Impostos', icon: Calculator },
  { id: 'reports', label: 'Relatórios', icon: BarChart3 },
  { id: 'sales', label: 'Vendas', icon: Send },
  ...(userRole === 'admin' ? [
    { id: 'users', label: 'Utilizadores', icon: User },
    { id: 'sender', label: 'Envios', icon: Send },
    { id: 'settings', label: 'Configurações', icon: Settings }
  ] : [])
];

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  const { user, company, logout, updateUser } = useAuth();
  const { sendEvent } = useTawkTo();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(user?.profilePhoto || null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleUpdateProfile = (profileData: any) => {
    updateUser({ ...profileData, profilePhoto });
    setShowProfileModal(false);
    
    // Send event to Tawk.to
    sendEvent('profile_updated', {
      action: 'profile_update',
      changes: Object.keys(profileData)
    });
    
    alert('Perfil atualizado com sucesso!');
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert('A imagem deve ter no máximo 5MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setProfilePhoto(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setProfilePhoto(null);
  };

  const handleTabChange = (tabId: string) => {
    onTabChange(tabId);
    setIsMobileMenuOpen(false); // Close mobile menu when tab changes
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="bg-white shadow-lg rounded-lg p-3 border border-gray-200"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`bg-white shadow-lg h-screen w-64 fixed left-0 top-0 z-40 flex flex-col transform transition-transform duration-300 ease-in-out ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        {/* Company Header */}
        <div className="p-6 border-b border-gray-200">
          <button 
            onClick={() => handleTabChange('dashboard')}
            className="flex items-center justify-center py-6 w-full hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
            title="Voltar ao Dashboard"
          >
            <div className="w-48 h-24 flex items-center justify-center">
              <img 
                src="https://cdn.signius.pl/wp-content/uploads/2022/09/signius_logo_rgb.svg" 
                alt="Signius Logo" 
                className="w-48 h-24 object-contain hover:scale-105 transition-transform duration-200"
              />
            </div>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {getMenuItems(user?.role || '').map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => handleTabChange(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-200">
          {/* Trial Banner */}
          {company?.isTrialActive && (
            <div className="mb-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="text-yellow-600" size={16} />
                <span className="text-sm font-semibold text-yellow-800">Período de Teste</span>
              </div>
              <p className="text-xs text-yellow-700 mb-2">
                {company.trialEndDate ? 
                  Math.max(0, Math.ceil((new Date(company.trialEndDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))) 
                  : 0
                } dias restantes
              </p>
              <button
                onClick={() => {
                  // Trigger upgrade modal - we'll need to pass this up
                  const event = new CustomEvent('openUpgradeModal');
                  window.dispatchEvent(event);
                }}
                className="w-full bg-yellow-600 text-white py-1.5 px-3 rounded text-xs font-medium hover:bg-yellow-700 transition-colors"
              >
                Fazer Upgrade
              </button>
            </div>
          )}
          
          <button
            onClick={() => setShowProfileModal(true)}
            className="w-full flex items-center gap-3 p-3 rounded-lg bg-gray-50 mb-3 hover:bg-gray-100 transition-colors"
          >
            <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center bg-blue-500">
              {user?.profilePhoto ? (
                <img 
                  src={user.profilePhoto} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <User size={16} className="text-white" />
              )}
            </div>
            <div className="flex-1 min-w-0 text-left">
              <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
          </button>
          
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
          >
            <LogOut size={18} />
            <span className="font-medium">Sair</span>
          </button>
        </div>

        {/* Profile Edit Modal */}
        {showProfileModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Edit size={20} className="text-blue-600" />
                Editar Perfil
              </h3>
              
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const profileData = {
                  name: formData.get('name') as string,
                  email: formData.get('email') as string,
                  phone: formData.get('phone') as string,
                  password: formData.get('password') as string,
                };
                handleUpdateProfile(profileData);
              }} className="space-y-4">
                
                {/* Profile Photo Section */}
                <div className="text-center">
                  <div className="relative inline-block">
                    <div className="w-24 h-24 rounded-full overflow-hidden mx-auto bg-gray-200 flex items-center justify-center">
                      {profilePhoto ? (
                        <img 
                          src={profilePhoto} 
                          alt="Profile Preview" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User size={32} className="text-gray-400" />
                      )}
                    </div>
                    <div className="absolute -bottom-2 -right-2">
                      <label className="bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors inline-flex">
                        <Camera size={16} />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                  <div className="mt-3 flex justify-center gap-2">
                    <label className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors flex items-center gap-1">
                      <Upload size={14} />
                      Carregar Foto
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                    </label>
                    {profilePhoto && (
                      <button
                        type="button"
                        onClick={removePhoto}
                        className="text-sm bg-red-100 text-red-700 px-3 py-1 rounded-lg hover:bg-red-200 transition-colors"
                      >
                        Remover
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Formatos aceites: JPG, PNG, GIF (máx. 5MB)
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    name="name"
                    defaultValue={user?.name || ''}
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
                    defaultValue={user?.email || ''}
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
                    defaultValue={user?.phone || ''}
                    placeholder="+258 84 123 4567"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nova Palavra-passe (opcional)
                  </label>
                  <input
                    type="password"
                    name="password"
                    placeholder="Deixe em branco para manter a atual"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowProfileModal(false);
                      setProfilePhoto(user?.profilePhoto || null);
                    }}
                    className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Salvar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};