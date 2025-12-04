import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Company, SuperAdmin } from '../types';
import { authService, RegisterData } from '../services/authService';

interface AuthContextType {
  user: User | null;
  superAdmin: SuperAdmin | null;
  company: Company | null;
  login: (email: string, password: string) => Promise<void>;
  loginSuperAdmin: (email: string, password: string) => Promise<void>;
  register: (companyData: Partial<Company>, userData: Partial<User>) => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
  updateCompany: (companyData: Partial<Company>) => void;
  logout: () => void;
  isLoading: boolean;
  isSuperAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

function mapDatabaseUserToAppUser(dbUser: any, dbCompany: any): { user: User; company: Company } {
  const user: User = {
    id: dbUser.id,
    name: dbUser.full_name,
    email: dbUser.email,
    role: dbUser.role,
    companyId: dbUser.company_id,
    createdAt: dbUser.created_at,
  };

  const planPrices = { start: 750, pro: 1500, premium: 3500 };

  const company: Company = {
    id: dbCompany.id,
    name: dbCompany.name,
    email: dbCompany.email || '',
    nuit: dbCompany.tax_id || '',
    address: dbCompany.address || '',
    plan: dbCompany.plan === 'start' ? 'basic' : dbCompany.plan === 'pro' ? 'professional' : 'premium',
    planPrice: planPrices[dbCompany.plan as keyof typeof planPrices] || 750,
    createdAt: dbCompany.created_at,
    isActive: dbCompany.status === 'active',
    trialEndDate: dbCompany.trial_ends_at,
    isTrialActive: dbCompany.status === 'trial',
  };

  return { user, company };
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [superAdmin, setSuperAdmin] = useState<SuperAdmin | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      try {
        const result = await authService.getCurrentUser();
        if (result && mounted) {
          const { user: appUser, company: appCompany } = mapDatabaseUserToAppUser(
            result.userData,
            result.userData.companies
          );
          setUser(appUser);
          setCompany(appCompany);

          if (result.userData.role === 'super_admin') {
            setSuperAdmin({
              id: result.userData.id,
              name: result.userData.full_name,
              email: result.userData.email,
              role: 'super_admin',
              createdAt: result.userData.created_at,
            });
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    initAuth();

    const { data: authListener } = authService.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        setUser(null);
        setCompany(null);
        setSuperAdmin(null);
      }
    });

    return () => {
      mounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  const updateCompany = (companyData: Partial<Company>) => {
    if (company) {
      const updatedCompany = { ...company, ...companyData };
      setCompany(updatedCompany);
    }
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const result = await authService.login({ email, password });
      const { user: appUser, company: appCompany } = mapDatabaseUserToAppUser(
        result.userData,
        result.userData.companies
      );

      setUser(appUser);
      setCompany(appCompany);

      if (result.userData.role === 'super_admin') {
        setSuperAdmin({
          id: result.userData.id,
          name: result.userData.full_name,
          email: result.userData.email,
          role: 'super_admin',
          createdAt: result.userData.created_at,
        });
      }
    } catch (error: any) {
      throw new Error(error.message || 'Erro ao fazer login');
    } finally {
      setIsLoading(false);
    }
  };

  const loginSuperAdmin = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const result = await authService.login({ email, password });

      if (result.userData.role !== 'super_admin') {
        throw new Error('Credenciais de super admin inválidas');
      }

      setSuperAdmin({
        id: result.userData.id,
        name: result.userData.full_name,
        email: result.userData.email,
        role: 'super_admin',
        createdAt: result.userData.created_at,
      });
    } catch (error: any) {
      throw new Error(error.message || 'Erro ao fazer login como super admin');
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (companyData: Partial<Company>, userData: Partial<User>) => {
    setIsLoading(true);
    try {
      const registerData: RegisterData = {
        email: userData.email || '',
        password: userData.password || '',
        fullName: userData.name || '',
        companyName: companyData.name || '',
        phone: companyData.phone,
        plan: companyData.plan === 'basic' ? 'start' : companyData.plan === 'professional' ? 'pro' : 'premium',
      };

      const result = await authService.register(registerData);

      const planPrices = { start: 750, pro: 1500, premium: 3500 };

      const newUser: User = {
        id: result.user.id,
        name: registerData.fullName,
        email: registerData.email,
        role: 'admin',
        companyId: result.company.id,
        createdAt: result.company.created_at,
      };

      const newCompany: Company = {
        id: result.company.id,
        name: result.company.name,
        email: result.company.email || '',
        nuit: result.company.tax_id || '',
        address: result.company.address || '',
        plan: companyData.plan || 'basic',
        planPrice: planPrices[result.company.plan as keyof typeof planPrices] || 750,
        createdAt: result.company.created_at,
        isActive: false,
        trialEndDate: result.company.trial_ends_at,
        isTrialActive: true,
      };

      setUser(newUser);
      setCompany(newCompany);
    } catch (error: any) {
      throw new Error(error.message || 'Erro ao registrar');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Error logging out:', error);
    }
    setUser(null);
    setSuperAdmin(null);
    setCompany(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      superAdmin,
      company,
      login,
      loginSuperAdmin,
      register,
      updateCompany,
      updateUser,
      logout,
      isLoading,
      isSuperAdmin: !!superAdmin
    }}>
      {children}
    </AuthContext.Provider>
  );
};