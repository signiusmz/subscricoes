import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoginForm } from './components/auth/LoginForm';
import { RegisterForm } from './components/auth/RegisterForm';
import LandingPage from './components/landing/LandingPage';
import { Sidebar } from './components/layout/Sidebar';
import { SuperAdminDashboard } from './components/super-admin/SuperAdminDashboard';
import { MetricsCards } from './components/dashboard/MetricsCards';
import { RecentActivity } from './components/dashboard/RecentActivity';
import { ClientsTable } from './components/clients/ClientsTable';
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
  averageNPS: 8.4,
  monthlyRevenue: 234500,
  growthRate: 15.7
};

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showClientPortal, setShowClientPortal] = useState(false);

  // Demo: Toggle to client portal
  if (showClientPortal) {
    return <ClientPortal />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
              <p className="text-gray-600">Visão geral do seu negócio</p>
            </div>
            <MetricsCards metrics={mockMetrics} />
            <div className="grid lg:grid-cols-2 gap-6">
              <RecentActivity />
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Gráfico de Crescimento</h3>
                <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">Gráfico de métricas (integração futura)</p>
                </div>
              </div>
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
      </div>
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