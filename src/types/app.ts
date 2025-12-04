export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: 'admin' | 'staff' | 'super_admin';
  companyId: string;
  createdAt: string;
  phone?: string;
}

export interface Company {
  id: string;
  name: string;
  email: string;
  phone?: string;
  nuit?: string;
  address?: string;
  city?: string;
  country?: string;
  plan: 'basic' | 'professional' | 'premium';
  planPrice: number;
  status?: 'trial' | 'active' | 'suspended' | 'cancelled';
  createdAt: string;
  isActive: boolean;
  trialEndDate?: string;
  isTrialActive?: boolean;
}

export interface SuperAdmin {
  id: string;
  name: string;
  email: string;
  role: 'super_admin';
  createdAt: string;
}

export interface Client {
  id: string;
  companyId: string;
  companyName: string;
  representative: string;
  email: string;
  phone: string;
  phoneCountryCode?: string;
  nuit?: string;
  address?: string;
  city?: string;
  country?: string;
  anniversary?: string;
  salespersonId?: string;
  segment?: 'premium' | 'gold' | 'silver' | 'bronze';
  createdAt: string;
  isActive: boolean;
  notes?: string;
}

export interface Service {
  id: string;
  companyId: string;
  name: string;
  description?: string;
  price: number;
  ivaType?: 'additional' | 'included';
  ivaAmount?: number;
  totalPrice?: number;
  validity?: number;
  status: 'active' | 'inactive';
  autoRenew?: boolean;
  billingType: 'monthly' | 'quarterly' | 'annual' | 'one_time';
  category?: string;
  createdAt: string;
}

export interface Subscription {
  id: string;
  clientId: string;
  serviceId: string;
  status: 'active' | 'inactive' | 'cancelled' | 'expired';
  startDate: string;
  endDate?: string;
  nextBillingDate?: string;
  autoRenew: boolean;
  createdAt: string;
}

export interface Invoice {
  id: string;
  companyId: string;
  clientId: string;
  invoiceNumber: string;
  amount: number;
  taxAmount: number;
  totalAmount: number;
  status: 'pending' | 'paid' | 'overdue' | 'cancelled';
  dueDate: string;
  paidDate?: string;
  paymentMethod?: string;
  notes?: string;
  createdAt: string;
}

export interface Payment {
  id: string;
  invoiceId: string;
  amount: number;
  paymentMethod: string;
  transactionId?: string;
  status: 'pending' | 'completed' | 'failed';
  paymentDate: string;
  createdAt: string;
}

export interface ActivityLog {
  id: string;
  companyId?: string;
  userId?: string;
  entityType: string;
  entityId: string;
  action: string;
  details?: any;
  createdAt: string;
}
