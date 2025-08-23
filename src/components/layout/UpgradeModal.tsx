import React, { useState } from 'react';
import { Crown, Check, X, Zap, Shield, Users, BarChart3, Smartphone, CreditCard } from 'lucide-react';
import { MPesaPayment } from '../billing/MPesaPayment';

interface Plan {
  id: 'basic' | 'professional' | 'enterprise';
  name: string;
  price: number;
  originalPrice?: number;
  discount?: string;
  description: string;
  popular?: boolean;
  features: string[];
  icon: React.ComponentType<any>;
  color: string;
  bgColor: string;
}

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlan?: string;
  onUpgradeSuccess: (planId: string, transactionId: string) => void;
}

const plans: Plan[] = [
  {
    id: 'basic',
    name: 'Básico',
    price: 750,
    originalPrice: 1000,
    discount: '25% OFF',
    description: 'Ideal para pequenas empresas que estão começando',
    features: [
      'Até 100 clientes',
      'Gestão básica de serviços',
      'Notificações por email',
      '1 utilizador',
      'Suporte por email',
      'Relatórios básicos'
    ],
    icon: Users,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50'
  },
  {
    id: 'professional',
    name: 'Profissional',
    price: 1500,
    originalPrice: 2000,
    discount: '25% OFF',
    description: 'Para empresas em crescimento que precisam de mais recursos',
    popular: true,
    features: [
      'Até 500 clientes',
      'Gestão avançada de serviços',
      'Notificações por email e WhatsApp',
      '5 utilizadores',
      'Suporte prioritário',
      'Relatórios detalhados',
      'Fluxos personalizados',
      'Portal do cliente'
    ],
    icon: BarChart3,
    color: 'text-green-600',
    bgColor: 'bg-green-50'
  },
  {
    id: 'enterprise',
    name: 'Empresarial',
    price: 3500,
    originalPrice: 4500,
    discount: '22% OFF',
    description: 'Para grandes empresas com necessidades complexas',
    features: [
      'Clientes ilimitados',
      'Todas as funcionalidades',
      'Notificações multi-canal',
      'Utilizadores ilimitados',
      'Suporte 24/7',
      'Portal do cliente',
      'Integração M-Pesa',
      'Gestor dedicado'
    ],
    icon: Crown,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50'
  }
];

export const UpgradeModal: React.FC<UpgradeModalProps> = ({
  isOpen,
  onClose,
  currentPlan,
  onUpgradeSuccess
}) => {
  const [selectedPlan, setSelectedPlan] = useState<'basic' | 'professional' | 'enterprise' | null>(null);
  const [showPayment, setShowPayment] = useState(false);

  if (!isOpen) return null;

  const handlePlanSelect = (planId: 'basic' | 'professional' | 'enterprise') => {
    setSelectedPlan(planId);
    setShowPayment(true);
  };

  const handlePaymentSuccess = (transactionId: string) => {
    if (selectedPlan) {
      onUpgradeSuccess(selectedPlan, transactionId);
    }
  };

  const handlePaymentError = (error: string) => {
    alert(`Erro no pagamento: ${error}`);
    setShowPayment(false);
  };

  const handlePaymentCancel = () => {
    setShowPayment(false);
    setSelectedPlan(null);
  };

  if (showPayment && selectedPlan) {
    const plan = plans.find(p => p.id === selectedPlan);
    if (plan) {
      return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <MPesaPayment
            companyId="1"
            companyName="TechSolutions Lda"
            planType={selectedPlan}
            amount={plan.price}
            onPaymentSuccess={handlePaymentSuccess}
            onPaymentError={handlePaymentError}
            onCancel={handlePaymentCancel}
          />
        </div>
      );
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-t-2xl relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-gray-200 p-2"
          >
            <X size={24} />
          </button>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Crown size={32} className="text-white" />
            </div>
            <h2 className="text-3xl font-bold mb-2">Escolha o Plano Ideal</h2>
            <p className="text-blue-100 text-lg">
              Desbloqueie todo o potencial do Signius com recursos avançados
            </p>
          </div>
        </div>

        {/* Trial Benefits */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 m-6">
          <div className="flex items-center gap-3 mb-3">
            <Zap className="text-yellow-600" size={24} />
            <h3 className="text-lg font-semibold text-yellow-800">Oferta Especial de Teste!</h3>
          </div>
          <div className="grid md:grid-cols-3 gap-4 text-sm text-yellow-700">
            <div className="flex items-center gap-2">
              <Check size={16} className="text-yellow-600" />
              <span>Desconto especial para novos clientes</span>
            </div>
            <div className="flex items-center gap-2">
              <Check size={16} className="text-yellow-600" />
              <span>Sem compromisso de permanência</span>
            </div>
            <div className="flex items-center gap-2">
              <Check size={16} className="text-yellow-600" />
              <span>Suporte completo incluído</span>
            </div>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="p-6">
          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((plan) => {
              const Icon = plan.icon;
              const isCurrentPlan = currentPlan === plan.id;
              
              return (
                <div
                  key={plan.id}
                  className={`relative border-2 rounded-xl p-6 transition-all hover:shadow-lg ${
                    plan.popular 
                      ? 'border-green-500 shadow-lg scale-105' 
                      : 'border-gray-200 hover:border-blue-300'
                  } ${isCurrentPlan ? 'opacity-50' : ''}`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                        Mais Popular
                      </span>
                    </div>
                  )}
                  
                  {plan.discount && (
                    <div className="absolute -top-2 -right-2">
                      <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                        {plan.discount}
                      </span>
                    </div>
                  )}

                  <div className="text-center mb-6">
                    <div className={`w-16 h-16 ${plan.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}>
                      <Icon size={32} className={plan.color} />
                    </div>
                    
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                    <p className="text-gray-600 text-sm mb-4">{plan.description}</p>
                    
                    <div className="mb-4">
                      {plan.originalPrice && (
                        <div className="text-sm text-gray-500 line-through mb-1">
                          {plan.originalPrice.toLocaleString()} MT/mês
                        </div>
                      )}
                      <div className="text-4xl font-bold text-gray-900">
                        {plan.price.toLocaleString()}
                        <span className="text-lg text-gray-500 font-normal"> MT/mês</span>
                      </div>
                    </div>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-3">
                        <Check size={16} className="text-green-500 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => handlePlanSelect(plan.id)}
                    disabled={isCurrentPlan}
                    className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
                      isCurrentPlan
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : plan.popular
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {isCurrentPlan ? 'Plano Atual' : 'Escolher Plano'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Security & Support */}
        <div className="bg-gray-50 p-6 rounded-b-2xl">
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div className="flex flex-col items-center gap-2">
              <Shield className="text-green-600" size={24} />
              <h4 className="font-semibold text-gray-900">Seguro & Confiável</h4>
              <p className="text-sm text-gray-600">Dados protegidos com criptografia</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Smartphone className="text-blue-600" size={24} />
              <h4 className="font-semibold text-gray-900">Pagamento M-Pesa</h4>
              <p className="text-sm text-gray-600">Pague facilmente com M-Pesa</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Users className="text-purple-600" size={24} />
              <h4 className="font-semibold text-gray-900">Suporte Dedicado</h4>
              <p className="text-sm text-gray-600">Equipe pronta para ajudar</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};