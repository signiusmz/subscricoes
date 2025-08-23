import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Company, SuperAdmin } from '../types';

interface AuthContextType {
  user: User | null;
  superAdmin: SuperAdmin | null;
  company: Company | null;
  login: (email: string, password: string) => Promise<void>;
  loginSuperAdmin: (email: string, password: string) => Promise<void>;
  register: (companyData: Partial<Company>, userData: Partial<User>) => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [superAdmin, setSuperAdmin] = useState<SuperAdmin | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored auth data
    const storedUser = localStorage.getItem('user');
    const storedSuperAdmin = localStorage.getItem('superAdmin');
    const storedCompany = localStorage.getItem('company');
    
    if (storedUser && storedCompany) {
      setUser(JSON.parse(storedUser));
      setCompany(JSON.parse(storedCompany));
    }
    
    if (storedSuperAdmin) {
      setSuperAdmin(JSON.parse(storedSuperAdmin));
    }
    
    setIsLoading(false);
  }, []);

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser: User = {
        id: '1',
        name: 'João Silva',
        email,
        role: 'admin',
        companyId: '1',
        createdAt: new Date().toISOString()
      };

      const mockCompany: Company = {
        id: '1',
        name: 'TechSolutions Lda',
        email: 'admin@techsolutions.mz',
        nuit: '400123456',
        address: 'Av. Julius Nyerere, 123, Maputo',
        plan: 'professional',
        planPrice: 1500,
        createdAt: new Date().toISOString(),
        isActive: true,
        trialEndDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
        isTrialActive: true
      };

      setUser(mockUser);
      setCompany(mockCompany);
      
      localStorage.setItem('user', JSON.stringify(mockUser));
      localStorage.setItem('company', JSON.stringify(mockCompany));
    } finally {
      setIsLoading(false);
    }
  };

  const loginSuperAdmin = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (email === 'admin@signius.com' && password === 'superadmin123') {
        const mockSuperAdmin: SuperAdmin = {
          id: 'super_1',
          name: 'Super Administrador',
          email,
          role: 'super_admin',
          createdAt: new Date().toISOString()
        };

        setSuperAdmin(mockSuperAdmin);
        localStorage.setItem('superAdmin', JSON.stringify(mockSuperAdmin));
      } else {
        throw new Error('Credenciais inválidas');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (companyData: Partial<Company>, userData: Partial<User>) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newCompany: Company = {
        id: Date.now().toString(),
        name: companyData.name || '',
        email: companyData.email || '',
        nuit: companyData.nuit || '',
        address: companyData.address || '',
        plan: companyData.plan || 'basic',
        planPrice: companyData.planPrice || 750,
        createdAt: new Date().toISOString(),
        isActive: true
      };

      const newUser: User = {
        id: Date.now().toString(),
        name: userData.name || '',
        email: userData.email || '',
        role: 'admin',
        companyId: newCompany.id,
        createdAt: new Date().toISOString()
      };

      setUser(newUser);
      setCompany(newCompany);
      
      localStorage.setItem('user', JSON.stringify(newUser));
      localStorage.setItem('company', JSON.stringify(newCompany));
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setSuperAdmin(null);
    setCompany(null);
    localStorage.removeItem('user');
    localStorage.removeItem('superAdmin');
    localStorage.removeItem('company');
  };

  return (
    <AuthContext.Provider value={{
      user,
      superAdmin,
      company,
      login,
      loginSuperAdmin,
      register,
      updateUser,
      logout,
      isLoading,
      isSuperAdmin: !!superAdmin
    }}>
      {children}
    </AuthContext.Provider>
  );
};