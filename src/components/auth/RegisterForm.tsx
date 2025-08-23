import React, { useState } from 'react';
import { UserPlus, Building, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface RegisterFormProps {
  onSwitchToLogin: () => void;
}

const plans = [
  { id: 'basic', name: 'Básico', price: 750, features: ['Até 100 clientes', 'Suporte por email', '1 utilizador'] },
  { id: 'professional', name: 'Profissional', price: 1500, features: ['Até 500 clientes', 'Suporte prioritário', '5 utilizadores'] },
  { id: 'enterprise', name: 'Empresarial', price: 3500, features: ['Clientes ilimitados', 'Suporte 24/7', 'Utilizadores ilimitados'] }
];

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSwitchToLogin }) => {
  const [step, setStep] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState<'basic' | 'professional' | 'enterprise'>('professional');
  const [companyData, setCompanyData] = useState({
    name: '',
    email: '',
    nuit: '',
    address: ''
  });
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const { register, isLoading } = useAuth();

  const handleCompanySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handleUserSubmit = async (e: React.FormForm) => {
    e.preventDefault();
    if (userData.password !== userData.confirmPassword) {
      alert('As palavras-passe não coincidem');
      return;
    }

    try {
      await register(
        {
          ...companyData,
          plan: selectedPlan,
          planPrice: plans.find(p => p.id === selectedPlan)?.price as 750 | 1500 | 3500
        },
        userData
      );
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        {step === 1 ? (
          <>
            <div className="bg-blue-600 text-white p-8 text-center">
              <div className="w-24 h-20 mx-auto mb-4 flex items-center justify-center">
                <img 
                  src="https://cdn.signius.pl/wp-content/uploads/2022/09/signius_logo_rgb.svg" 
                  alt="Signius Logo" 
                  className="w-24 h-20 object-contain filter brightness-0 invert"
                />
              </div>
              <h2 className="text-3xl font-bold mb-2">Registe a sua empresa</h2>
              <p className="opacity-90">Escolha o plano ideal para o seu negócio no Signius</p>
            </div>

            <div className="p-8">
              {/* Plan Selection */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">Escolha o seu plano</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  {plans.map((plan) => (
                    <div
                      key={plan.id}
                      className={`border-2 rounded-lg p-6 cursor-pointer transition-all ${
                        selectedPlan === plan.id
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                      onClick={() => setSelectedPlan(plan.id as 'basic' | 'professional' | 'enterprise')}
                    >
                      <div className="text-center">
                        <h4 className="font-semibold text-lg mb-2">{plan.name}</h4>
                        <div className="text-3xl font-bold text-blue-600 mb-4">
                          {plan.price} MT<span className="text-sm text-gray-500">/mês</span>
                        </div>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {plan.features.map((feature, index) => (
                            <li key={index}>• {feature}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Company Form */}
              <form onSubmit={handleCompanySubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nome da Empresa
                    </label>
                    <input
                      type="text"
                      value={companyData.name}
                      onChange={(e) => setCompanyData({...companyData, name: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email da Empresa
                    </label>
                    <input
                      type="email"
                      value={companyData.email}
                      onChange={(e) => setCompanyData({...companyData, email: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      NUIT
                    </label>
                    <input
                      type="text"
                      value={companyData.nuit}
                      onChange={(e) => setCompanyData({...companyData, nuit: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Endereço
                    </label>
                    <input
                      type="text"
                      value={companyData.address}
                      onChange={(e) => setCompanyData({...companyData, address: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={onSwitchToLogin}
                    className="flex-1 border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                  >
                    <ArrowLeft size={20} />
                    Voltar à Página Inicial
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-all"
                  >
                    Continuar
                  </button>
                </div>
              </form>
            </div>
          </>
        ) : (
          <>
            <div className="bg-green-600 text-white p-8 text-center">
              <div className="w-24 h-20 mx-auto mb-4 flex items-center justify-center">
                <img 
                  src="https://cdn.signius.pl/wp-content/uploads/2022/09/signius_logo_rgb.svg" 
                  alt="Signius Logo" 
                  className="w-20 h-16 object-contain filter brightness-0 invert"
                />
              </div>
              <h2 className="text-3xl font-bold mb-2">Criar Conta de Utilizador</h2>
              <p className="opacity-90">Complete o registo criando a sua conta no Signius</p>
            </div>

            <div className="p-8">
              <form onSubmit={handleUserSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nome Completo
                    </label>
                    <input
                      type="text"
                      value={userData.name}
                      onChange={(e) => setUserData({...userData, name: e.target.value})}
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
                      value={userData.email}
                      onChange={(e) => setUserData({...userData, email: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Palavra-passe
                    </label>
                    <input
                      type="password"
                      value={userData.password}
                      onChange={(e) => setUserData({...userData, password: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirmar Palavra-passe
                    </label>
                    <input
                      type="password"
                      value={userData.confirmPassword}
                      onChange={(e) => setUserData({...userData, confirmPassword: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                  >
                    <ArrowLeft size={20} />
                    Voltar
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <UserPlus size={20} />
                    )}
                    {isLoading ? 'Criando conta...' : 'Criar Conta'}
                  </button>
                </div>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
};