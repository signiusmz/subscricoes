/*
  # Fix Security and Performance Issues

  ## Security Fixes
  This migration addresses critical security issues:
  
  1. **update_updated_at_column() function**
     - Issue: Function has role mutable search_path
     - Fix: Add SET search_path = '' to prevent search_path injection attacks
  
  2. **get_user_company_id() function**
     - Issue: Function has role mutable search_path
     - Fix: Add SET search_path = '' for security
  
  ## Performance Improvements
  Adds missing indexes based on actual table structure to improve query performance:
  
  1. **Authentication & User Lookups**
     - Index on users(email) for login queries
     - Index on companies(email) for company lookups
  
  2. **Foreign Key Indexes**
     - Index on invoices(client_id) for client invoice queries
     - Index on payments(invoice_id) for invoice payment queries
     - Index on subscriptions(client_id) for client subscriptions
     - Index on activity_logs(user_id) and activity_logs(client_id)
  
  3. **Status & Date Filtering**
     - Index on subscriptions(status) for active subscription queries
     - Index on subscriptions(next_billing_date) for billing jobs
     - Index on invoices(status) for unpaid invoice queries
     - Index on invoices(due_date) for overdue invoice queries
     - Index on companies(trial_ends_at) for trial expiration checks
  
  4. **Compound Indexes**
     - Index on subscriptions(client_id, status) for common queries
     - Index on invoices(company_id, status) for company reports
     - Index on activity_logs(company_id, created_at) for activity logs
*/

-- ============================================================================
-- SECURITY FIXES: Update Functions with Secure search_path
-- ============================================================================

-- Fix update_updated_at_column function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER 
SET search_path = ''
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Fix get_user_company_id function
CREATE OR REPLACE FUNCTION get_user_company_id(user_id uuid)
RETURNS uuid
SET search_path = ''
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT company_id FROM public.users WHERE id = user_id LIMIT 1;
$$;

-- ============================================================================
-- PERFORMANCE IMPROVEMENTS: Add Missing Indexes
-- ============================================================================

-- Authentication & User Lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_companies_email ON public.companies(email);

-- Foreign Key Indexes for Better Join Performance
CREATE INDEX IF NOT EXISTS idx_invoices_client_id ON public.invoices(client_id);
CREATE INDEX IF NOT EXISTS idx_invoices_company_id ON public.invoices(company_id);
CREATE INDEX IF NOT EXISTS idx_payments_invoice_id ON public.payments(invoice_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_client_id ON public.subscriptions(client_id);
CREATE INDEX IF NOT EXISTS idx_clients_user_id ON public.clients(user_id);
CREATE INDEX IF NOT EXISTS idx_clients_company_id ON public.clients(company_id);
CREATE INDEX IF NOT EXISTS idx_services_company_id ON public.services(company_id);
CREATE INDEX IF NOT EXISTS idx_users_company_id ON public.users(company_id);

-- Activity Logs Indexes
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON public.activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_company_id ON public.activity_logs(company_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_entity ON public.activity_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_action ON public.activity_logs(action);

-- Status & Date Filtering Indexes
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON public.subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_next_billing_date ON public.subscriptions(next_billing_date);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON public.invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_due_date ON public.invoices(due_date);
CREATE INDEX IF NOT EXISTS idx_companies_trial_ends_at ON public.companies(trial_ends_at);
CREATE INDEX IF NOT EXISTS idx_companies_status ON public.companies(status);
CREATE INDEX IF NOT EXISTS idx_clients_status ON public.clients(status);

-- Compound Indexes for Common Query Patterns
CREATE INDEX IF NOT EXISTS idx_subscriptions_client_status ON public.subscriptions(client_id, status);
CREATE INDEX IF NOT EXISTS idx_invoices_company_status ON public.invoices(company_id, status);
CREATE INDEX IF NOT EXISTS idx_activity_logs_company_created ON public.activity_logs(company_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_clients_company_status ON public.clients(company_id, status);

-- Timestamp Indexes for Sorting and Filtering
CREATE INDEX IF NOT EXISTS idx_clients_created_at ON public.clients(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_invoices_created_at ON public.invoices(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_subscriptions_created_at ON public.subscriptions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_payments_created_at ON public.payments(payment_date DESC);

-- Communication & Automation Indexes
CREATE INDEX IF NOT EXISTS idx_communication_logs_company_id ON public.communication_logs(company_id);
CREATE INDEX IF NOT EXISTS idx_communication_logs_client_id ON public.communication_logs(client_id);
CREATE INDEX IF NOT EXISTS idx_communication_logs_status ON public.communication_logs(status);
CREATE INDEX IF NOT EXISTS idx_communication_logs_type ON public.communication_logs(type);
CREATE INDEX IF NOT EXISTS idx_automation_flows_company_id ON public.automation_flows(company_id);
CREATE INDEX IF NOT EXISTS idx_automation_flows_is_active ON public.automation_flows(is_active);
CREATE INDEX IF NOT EXISTS idx_communication_templates_company_id ON public.communication_templates(company_id);
CREATE INDEX IF NOT EXISTS idx_communication_templates_type ON public.communication_templates(type);

-- Contract & File Indexes
CREATE INDEX IF NOT EXISTS idx_contracts_company_id ON public.contracts(company_id);
CREATE INDEX IF NOT EXISTS idx_contracts_client_id ON public.contracts(client_id);
CREATE INDEX IF NOT EXISTS idx_contracts_status ON public.contracts(status);
CREATE INDEX IF NOT EXISTS idx_file_attachments_entity ON public.file_attachments(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_file_attachments_company_id ON public.file_attachments(company_id);

-- Subscription Plans
CREATE INDEX IF NOT EXISTS idx_companies_subscription_plan_id ON public.companies(subscription_plan_id);

-- Client Services
CREATE INDEX IF NOT EXISTS idx_client_services_client_id ON public.client_services(client_id);
CREATE INDEX IF NOT EXISTS idx_client_services_service_id ON public.client_services(service_id);
CREATE INDEX IF NOT EXISTS idx_client_services_status ON public.client_services(status);

-- Tags & Custom Fields
CREATE INDEX IF NOT EXISTS idx_entity_tags_entity ON public.entity_tags(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_entity_tags_tag_id ON public.entity_tags(tag_id);
CREATE INDEX IF NOT EXISTS idx_tags_company_id ON public.tags(company_id);
CREATE INDEX IF NOT EXISTS idx_custom_fields_company_id ON public.custom_fields(company_id);
CREATE INDEX IF NOT EXISTS idx_custom_field_values_entity_id ON public.custom_field_values(entity_id);
CREATE INDEX IF NOT EXISTS idx_custom_field_values_custom_field_id ON public.custom_field_values(custom_field_id);

-- ============================================================================
-- ANALYZE TABLES: Update Statistics for Query Planner
-- ============================================================================

ANALYZE public.users;
ANALYZE public.companies;
ANALYZE public.clients;
ANALYZE public.services;
ANALYZE public.subscriptions;
ANALYZE public.invoices;
ANALYZE public.payments;
ANALYZE public.activity_logs;
ANALYZE public.communication_logs;
ANALYZE public.communication_templates;
ANALYZE public.automation_flows;
ANALYZE public.contracts;
ANALYZE public.subscription_plans;
