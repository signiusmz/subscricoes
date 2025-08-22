export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  profilePhoto?: string;
  role: 'admin' | 'manager' | 'user';
  companyId: string;
  createdAt: string;
  isActive: boolean;
  permissions: string[];
}

export interface Company {
  id: string;
  name: string;
  email: string;
  nuit: string;
  address: string;
  plan: 'basic' | 'professional' | 'enterprise';
  planPrice: 750 | 1500 | 3500;
  createdAt: string;
  isActive: boolean;
}

export interface Client {
  id: string;
  companyId: string;
  companyName: string;
  representative: string;
  email: string;
  phone: string;
  phoneCountryCode: string;
  nuit: string;
  address: string;
  anniversary: string; // Format: MM-DD
  salespersonId: string;
  createdAt: string;
  isActive: boolean;
}

export interface Service {
  id: string;
  companyId: string;
  clientId?: string; // Optional, will be set via subscription
  name: string;
  description: string;
  price: number;
  validity: 1 | 3 | 6 | 12; // months: mensal, trimestral, semestral, anual
  startDate?: string; // Optional, will be set via subscription
  endDate?: string; // Optional, will be set via subscription
  status: 'active' | 'expiring' | 'expired';
  autoRenew: boolean;
}

export interface Subscription {
  id: string;
  companyId: string;
  clientId: string;
  serviceId: string;
  status: 'active' | 'cancelled' | 'expired';
  nextBilling: string;
  reminderSent: boolean;
  npsScore?: number;
  npsComment?: string;
}

export interface Notification {
  id: string;
  companyId: string;
  clientId: string;
  type: 'email' | 'sms' | 'whatsapp';
  template: 'reminder' | 'renewal' | 'nps' | 'welcome';
  status: 'pending' | 'sent' | 'failed';
  scheduledFor: string;
  content: string;
}

export interface DashboardMetrics {
  totalClients: number;
  activeServices: number;
  expiringServices: number;
  expiredServices: number;
  averageNPS: number;
  monthlyRevenue: number;
  growthRate: number;
}

export interface SuperAdmin {
  id: string;
  name: string;
  email: string;
  role: 'super_admin';
  createdAt: string;
}

export interface CompanySubscription {
  id: string;
  companyId: string;
  planId: string;
  status: 'active' | 'cancelled' | 'expired' | 'suspended';
  startDate: string;
  endDate: string;
  autoRenew: boolean;
  paymentStatus: 'paid' | 'pending' | 'overdue';
  lastPayment?: string;
  nextPayment: string;
}

export interface Plan {
  id: string;
  name: string;
  price: number;
  features: string[];
  maxClients: number;
  maxUsers: number;
  isActive: boolean;
}