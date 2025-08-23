import React, { useState } from 'react';
import { LogIn, Building } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface LoginFormProps {
  onSwitchToRegister: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToRegister }) => {
  const [email, setEmail] = useState('admin@techsolutions.mz');
  const [password, setPassword] = useState('password123');
  const [isSuperAdminLogin, setIsSuperAdminLogin] = useState(false);
  const { login, loginSuperAdmin, isLoading } = useAuth();

  const accessLevels = [
    {
      title: 'Super Administrador',
      description: 'Acesso completo ao sistema - Gestão de todas as empresas',
      email: 'admin@signius.com',
      password: 'superadmin123',
      color: 'bg-purple-50 border-purple-200 hover:bg-purple-100',
      textColor: 'text-purple-800',
      isSuperAdmin: true
    },
    {
      title: 'Administrador da Empresa',
      description: 'Gestão completa da empresa - Todos os módulos',
      email: 'admin@techsolutions.mz',
      password: 'password123',
      color: 'bg-blue-50 border-blue-200 hover:bg-blue-100',
      textColor: 'text-blue-800',
      isSuperAdmin: false
    },
    {
      title: 'Gestor/Manager',
      description: 'Gestão de clientes, serviços e relatórios',
      email: 'manager@techsolutions.mz',
      password: 'manager123',
      color: 'bg-green-50 border-green-200 hover:bg-green-100',
      textColor: 'text-green-800',
      isSuperAdmin: false
    },
    {
      title: 'Utilizador/Vendedor',
      description: 'Acesso limitado - Gestão de clientes',
      email: 'user@techsolutions.mz',
      password: 'user123',
      color: 'bg-orange-50 border-orange-200 hover:bg-orange-100',
      textColor: 'text-orange-800',
      isSuperAdmin: false
    }
  ];

  const handleQuickLogin = (level: typeof accessLevels[0]) => {
    setEmail(level.email);
    setPassword(level.password);
    setIsSuperAdminLogin(level.isSuperAdmin);
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isSuperAdminLogin) {
        await loginSuperAdmin(email, password);
      } else {
        await login(email, password);
      }
    } catch (error) {
      console.error('Login failed:', error);
      alert('Falha no login. Verifique suas credenciais.');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="w-32 h-24 flex items-center justify-center mx-auto mb-4">
            <img 
              src="https://cdn.signius.pl/wp-content/uploads/2022/09/signius_logo_rgb.svg" 
              alt="Signius Logo" 
              className="w-32 h-24 object-contain"
            />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Bem-vindo ao Signius</h2>
          <p className="text-gray-600">Faça login na sua conta</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder={isSuperAdminLogin ? "admin@signius.com" : "seu@email.com"}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Palavra-passe
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder={isSuperAdminLogin ? "superadmin123" : "••••••••"}
              required
            />
          </div>

          <div className="flex items-center">
            <input
              id="super-admin"
              type="checkbox"
              checked={isSuperAdminLogin}
              onChange={(e) => {
                setIsSuperAdminLogin(e.target.checked);
                if (e.target.checked) {
                  setEmail('admin@signius.com');
                  setPassword('superadmin123');
                } else {
                  setEmail('admin@techsolutions.mz');
                  setPassword('password123');
                }
              }}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="super-admin" className="ml-2 block text-sm text-gray-900">
              Acesso Super Admin
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <LogIn size={20} />
            )}
            {isLoading ? 'Entrando...' : (isSuperAdminLogin ? 'Entrar como Super Admin' : 'Entrar')}
          </button>
        </form>

        {/* Quick Access Credentials */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
            Acesso Rápido - Dados de Teste
          </h3>
          <div className="space-y-3">
            {accessLevels.map((level, index) => (
              <div
                key={index}
                className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${level.color}`}
                onClick={() => handleQuickLogin(level)}
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className={`font-semibold ${level.textColor}`}>{level.title}</h4>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleQuickLogin(level);
                    }}
                    className={`text-xs px-2 py-1 rounded ${level.color} ${level.textColor} border border-current`}
                  >
                    Usar
                  </button>
                </div>
                <p className="text-sm text-gray-600 mb-2">{level.description}</p>
                <div className="text-xs text-gray-500 space-y-1">
                  <p><strong>Email:</strong> {level.email}</p>
                  <p><strong>Senha:</strong> {level.password}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-xs text-yellow-800">
              <strong>💡 Dica:</strong> Clique em qualquer card para preencher automaticamente os dados de acesso.
            </p>
          </div>
        </div>
        {!isSuperAdminLogin && (
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Não tem conta?{' '}
              <button
                onClick={onSwitchToRegister}
                className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
              >
                Registe-se
          className="text-blue-600 hover:text-blue-700 font-medium"
            </p>
          ← Voltar à Página Inicial
        )}
      </div>
    </div>
  );
};