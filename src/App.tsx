import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoginForm } from './components/auth/LoginForm';
import { RegisterForm } from './components/auth/RegisterForm';
import LandingPage from './components/landing/LandingPage';
import { Sidebar } from './components/layout/Sidebar';
import { TrialBanner } from './components/layout/TrialBanner';
import { UpgradeModal } from './components/layout/UpgradeModal';
import { SuperAdminDashboard } from './components/super-admin/SuperAdminDashboard';
import { DashboardHeader } from './components/dashboard/DashboardHeader';
import { MetricsCards } from './components/dashboard/MetricsCards';
import { RecentActivity } from './components/dashboard/RecentActivity';
import { GrowthChart } from './components/dashboard/GrowthChart';
import { TopClientsRanking } from './components/dashboard/TopClientsRanking';
import { ClientsTable } from './components/clients/ClientsTable';
import { ClientAnalytics } from './components/clients/ClientAnalytics';
import { UsersTable } from './components/users/UsersTable';
import { ServicesTable } from './components/services/ServicesTable';
import { SubscriptionsTable } from './components/subscriptions/SubscriptionsTable';
import { BillingModule } from './components/billing/BillingModule';
import { ReportsAnalytics } from './components/reports/ReportsAnalytics';
import { SettingsPanel } from './components/settings/SettingsPanel';
import { ClientPortal } from './components/client-portal/ClientPortal';
import { SenderModule } from './components/sender/SenderModule';
import { DashboardMetrics } from './types';

const mockMetrics: DashboardMetrics = {
  totalClients: 45,
  activeServices: 78,
  expiringServices: 12,
  expiredServices: 5,
  averageSatisfaction: 8.4,
  monthlyRevenue: 234500,
  growthRate: 15.7
};

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showClientAnalytics, setShowClientAnalytics] = useState(false);
  const [showClientPortal, setShowClientPortal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const { company, user, updateUser } = useAuth();

  // Demo: Toggle to client portal
  if (showClientPortal) {
    return <ClientPortal />;
  }
  
  // Show client analytics if requested
  if (showClientAnalytics) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <div className="ml-64">
          <div className="p-8">
            <ClientAnalytics onBack={() => setShowClientAnalytics(false)} />
          </div>
        </div>
      </div>
    );
  }

  const handleUpgradeSuccess = (planId: string, transactionId: string) => {
    // Update company plan in context
    if (company) {
      const updatedCompany = {
        ...company,
        plan: planId as 'basic' | 'professional' | 'enterprise',
        planPrice: planId === 'basic' ? 750 : planId === 'professional' ? 1500 : 3500,
        isTrialActive: false,
        trialEndDate: undefined
      };
      
      // Update localStorage
      localStorage.setItem('company', JSON.stringify(updatedCompany));
      
      // Force page reload to update context
      window.location.reload();
    }
    
    setShowUpgradeModal(false);
    alert(`Plano atualizado para ${planId} com sucesso! ID da transação: ${transactionId}`);
  };

  // Listen for upgrade modal trigger from sidebar
  React.useEffect(() => {
    const handleOpenUpgradeModal = () => {
      setShowUpgradeModal(true);
    };
    
    const handleOpenClientAnalytics = () => {
      setShowClientAnalytics(true);
    };

    window.addEventListener('openUpgradeModal', handleOpenUpgradeModal);
    window.addEventListener('openClientAnalytics', handleOpenClientAnalytics);
    
    return () => {
      window.removeEventListener('openUpgradeModal', handleOpenUpgradeModal);
      window.removeEventListener('openClientAnalytics', handleOpenClientAnalytics);
    };
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <DashboardHeader />
            <MetricsCards metrics={mockMetrics} />
            <div className="grid lg:grid-cols-3 gap-6">
              <RecentActivity />
              <GrowthChart />
              <TopClientsRanking />
            </div>
          </div>
        );
      case 'clients':
        return <ClientsTable />;
      case 'services':
        return <ServicesTable />;
      case 'subscriptions':
        return <SubscriptionsTable />;
      case 'billing':
        return <BillingModule />;
      case 'sender':
        return <SenderModule />;
      case 'reports':
        return <ReportsAnalytics />;
      case 'settings':
        return <SettingsPanel />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="ml-64">
        {/* Demo Portal Toggle */}
        <div className="bg-blue-600 text-white p-2 text-center">
          <button 
            onClick={() => setShowClientPortal(!showClientPortal)}
            className="text-sm hover:underline"
          >
            🔄 Demo: Alternar para Portal do Cliente
          </button>
        </div>
        <div className="p-8">
          {renderContent()}
        </div>
        
        {/* System Footer */}
        <footer className="bg-gray-50 border-t border-gray-200 py-4 px-8">
          <div className="text-center">
            <p className="text-xs text-gray-500">
              Signius - Sistema de Gestão Comercial (
              <a href="https://www.signius.co.mz" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">
                www.signius.co.mz
              </a>
              )
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Sistema Licenciado para: {company?.name || 'TechSolutions Lda'}
            </p>
          </div>
        </footer>
      </div>
      
      {/* Upgrade Modal */}
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        currentPlan={company?.plan}
        onUpgradeSuccess={handleUpgradeSuccess}
      />
    </div>
  );
};

const SuperAdminPanel = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-8">
        <SuperAdminDashboard />
      </div>
    </div>
  );
};

const AuthScreen = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showLanding, setShowLanding] = useState(true);
  const [directAction, setDirectAction] = useState<'login' | 'register' | null>(null);

  // Se há uma ação direta, não mostra a landing
  if (directAction && showLanding) {
    setShowLanding(false);
  }

  if (showLanding) {
    return (
      <div>
        <LandingPage 
          onLogin={() => {
            setDirectAction('login');
            setIsLogin(true);
            setShowLanding(false);
          }}
          onRegister={() => {
            setDirectAction('register');
            setIsLogin(false);
            setShowLanding(false);
          }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="absolute top-4 left-4">
        <button
          onClick={() => {
            setShowLanding(true);
            setDirectAction(null);
          }}
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          ← Voltar à Landing Page
        </button>
      </div>
      {isLogin ? (
        <LoginForm onSwitchToRegister={() => setIsLogin(false)} />
      ) : (
        <RegisterForm onSwitchToLogin={() => setIsLogin(true)} />
      )}
    </div>
  );
};

const AppContent = () => {
  const { user, superAdmin, isLoading, isSuperAdmin } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (isSuperAdmin && superAdmin) {
    return <SuperAdminPanel />;
  }

  return user ? <Dashboard /> : <AuthScreen />;
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;