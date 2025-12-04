/*
  # Create Remaining Platform Tables

  ## Overview
  This migration creates all remaining tables needed for a fully functional subscription management platform including multi-tenancy, automation, communication, and system configuration.

  ## New Tables
  
  ### Multi-Tenancy
  - `companies` - Tenant/organization management
  
  ### Automation & Workflows
  - `automation_flows` - Workflow definitions
  - `automation_flow_nodes` - Individual nodes in workflows
  - `automation_flow_executions` - Execution history
  - `automation_triggers` - Trigger configurations
  
  ### Communication
  - `communication_templates` - Email/SMS/WhatsApp templates
  - `communication_logs` - Message delivery tracking
  - `notification_preferences` - User notification settings
  
  ### System Configuration
  - `company_settings` - Company-specific settings
  - `tags` - Generic tagging system
  - `entity_tags` - Tag assignments to entities
  - `custom_fields` - Custom field definitions
  - `custom_field_values` - Custom field data
  - `file_attachments` - File tracking
  
  ## Security
  - Enable RLS on all tables
  - Add appropriate policies for authenticated users
  - Ensure multi-tenant data isolation
*/

-- Companies (Multi-tenant)
CREATE TABLE IF NOT EXISTS companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text,
  phone text,
  address text,
  city text,
  country text DEFAULT 'Mozambique',
  tax_id text,
  logo_url text,
  plan text DEFAULT 'start' CHECK (plan IN ('start', 'pro', 'premium')),
  status text DEFAULT 'trial' CHECK (status IN ('trial', 'active', 'suspended', 'cancelled')),
  trial_ends_at timestamptz,
  subscription_starts_at timestamptz,
  subscription_ends_at timestamptz,
  monthly_payment numeric(10,2),
  is_super_admin boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add company_id to users table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'company_id'
  ) THEN
    ALTER TABLE users ADD COLUMN company_id uuid REFERENCES companies(id) ON DELETE CASCADE;
    CREATE INDEX IF NOT EXISTS idx_users_company_id ON users(company_id);
  END IF;
END $$;

-- Add company_id to other tables for multi-tenancy
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'clients' AND column_name = 'company_id'
  ) THEN
    ALTER TABLE clients ADD COLUMN company_id uuid REFERENCES companies(id) ON DELETE CASCADE;
    CREATE INDEX IF NOT EXISTS idx_clients_company_id ON clients(company_id);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'services' AND column_name = 'company_id'
  ) THEN
    ALTER TABLE services ADD COLUMN company_id uuid REFERENCES companies(id) ON DELETE CASCADE;
    CREATE INDEX IF NOT EXISTS idx_services_company_id ON services(company_id);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'invoices' AND column_name = 'company_id'
  ) THEN
    ALTER TABLE invoices ADD COLUMN company_id uuid REFERENCES companies(id) ON DELETE CASCADE;
    CREATE INDEX IF NOT EXISTS idx_invoices_company_id ON invoices(company_id);
  END IF;
END $$;

-- Company Settings
CREATE TABLE IF NOT EXISTS company_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES companies(id) ON DELETE CASCADE NOT NULL,
  currency text DEFAULT 'MZN',
  timezone text DEFAULT 'Africa/Maputo',
  date_format text DEFAULT 'DD/MM/YYYY',
  fiscal_year_start text DEFAULT '01-01',
  invoice_prefix text DEFAULT 'INV',
  invoice_number_start integer DEFAULT 1000,
  tax_rate numeric(5,2) DEFAULT 16.00,
  tax_included boolean DEFAULT false,
  auto_send_invoices boolean DEFAULT true,
  auto_send_reminders boolean DEFAULT true,
  reminder_days_before integer DEFAULT 7,
  late_payment_fee_percentage numeric(5,2) DEFAULT 0,
  grace_period_days integer DEFAULT 0,
  branding_color text DEFAULT '#3b82f6',
  email_signature text,
  terms_and_conditions text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(company_id)
);

-- Automation Flows
CREATE TABLE IF NOT EXISTS automation_flows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES companies(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  description text,
  trigger_type text NOT NULL CHECK (trigger_type IN ('subscription_created', 'subscription_renewed', 'subscription_expired', 'payment_received', 'payment_failed', 'invoice_created', 'client_created', 'manual', 'scheduled')),
  is_active boolean DEFAULT true,
  flow_data jsonb DEFAULT '{}'::jsonb,
  execution_count integer DEFAULT 0,
  last_executed_at timestamptz,
  created_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_automation_flows_company_id ON automation_flows(company_id);
CREATE INDEX IF NOT EXISTS idx_automation_flows_trigger_type ON automation_flows(trigger_type);

-- Automation Flow Executions
CREATE TABLE IF NOT EXISTS automation_flow_executions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  flow_id uuid REFERENCES automation_flows(id) ON DELETE CASCADE NOT NULL,
  company_id uuid REFERENCES companies(id) ON DELETE CASCADE NOT NULL,
  trigger_data jsonb DEFAULT '{}'::jsonb,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed')),
  execution_log jsonb DEFAULT '[]'::jsonb,
  error_message text,
  started_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_automation_executions_flow_id ON automation_flow_executions(flow_id);
CREATE INDEX IF NOT EXISTS idx_automation_executions_status ON automation_flow_executions(status);

-- Communication Templates
CREATE TABLE IF NOT EXISTS communication_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES companies(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('email', 'sms', 'whatsapp')),
  category text CHECK (category IN ('invoice', 'reminder', 'welcome', 'renewal', 'expiration', 'payment_confirmation', 'custom')),
  subject text,
  body text NOT NULL,
  variables jsonb DEFAULT '[]'::jsonb,
  is_default boolean DEFAULT false,
  is_active boolean DEFAULT true,
  created_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_comm_templates_company_id ON communication_templates(company_id);
CREATE INDEX IF NOT EXISTS idx_comm_templates_type ON communication_templates(type);

-- Communication Logs
CREATE TABLE IF NOT EXISTS communication_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES companies(id) ON DELETE CASCADE NOT NULL,
  client_id uuid REFERENCES clients(id) ON DELETE SET NULL,
  template_id uuid REFERENCES communication_templates(id) ON DELETE SET NULL,
  type text NOT NULL CHECK (type IN ('email', 'sms', 'whatsapp')),
  recipient text NOT NULL,
  subject text,
  body text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'delivered', 'failed', 'bounced')),
  error_message text,
  metadata jsonb DEFAULT '{}'::jsonb,
  sent_at timestamptz,
  delivered_at timestamptz,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_comm_logs_company_id ON communication_logs(company_id);
CREATE INDEX IF NOT EXISTS idx_comm_logs_client_id ON communication_logs(client_id);
CREATE INDEX IF NOT EXISTS idx_comm_logs_status ON communication_logs(status);
CREATE INDEX IF NOT EXISTS idx_comm_logs_type ON communication_logs(type);

-- Notification Preferences
CREATE TABLE IF NOT EXISTS notification_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  email_notifications boolean DEFAULT true,
  sms_notifications boolean DEFAULT false,
  whatsapp_notifications boolean DEFAULT false,
  invoice_created boolean DEFAULT true,
  payment_received boolean DEFAULT true,
  payment_failed boolean DEFAULT true,
  subscription_expiring boolean DEFAULT true,
  subscription_renewed boolean DEFAULT true,
  new_client boolean DEFAULT true,
  daily_summary boolean DEFAULT false,
  weekly_report boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Tags
CREATE TABLE IF NOT EXISTS tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES companies(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  color text DEFAULT '#3b82f6',
  created_at timestamptz DEFAULT now(),
  UNIQUE(company_id, name)
);

CREATE INDEX IF NOT EXISTS idx_tags_company_id ON tags(company_id);

-- Entity Tags (polymorphic tagging)
CREATE TABLE IF NOT EXISTS entity_tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tag_id uuid REFERENCES tags(id) ON DELETE CASCADE NOT NULL,
  entity_type text NOT NULL CHECK (entity_type IN ('client', 'service', 'invoice', 'subscription')),
  entity_id uuid NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(tag_id, entity_type, entity_id)
);

CREATE INDEX IF NOT EXISTS idx_entity_tags_tag_id ON entity_tags(tag_id);
CREATE INDEX IF NOT EXISTS idx_entity_tags_entity ON entity_tags(entity_type, entity_id);

-- Custom Fields
CREATE TABLE IF NOT EXISTS custom_fields (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES companies(id) ON DELETE CASCADE NOT NULL,
  entity_type text NOT NULL CHECK (entity_type IN ('client', 'service', 'subscription')),
  field_name text NOT NULL,
  field_type text NOT NULL CHECK (field_type IN ('text', 'number', 'date', 'boolean', 'select', 'multiselect')),
  field_options jsonb DEFAULT '[]'::jsonb,
  is_required boolean DEFAULT false,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(company_id, entity_type, field_name)
);

CREATE INDEX IF NOT EXISTS idx_custom_fields_company_id ON custom_fields(company_id);

-- Custom Field Values
CREATE TABLE IF NOT EXISTS custom_field_values (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  custom_field_id uuid REFERENCES custom_fields(id) ON DELETE CASCADE NOT NULL,
  entity_id uuid NOT NULL,
  value text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(custom_field_id, entity_id)
);

CREATE INDEX IF NOT EXISTS idx_custom_field_values_field_id ON custom_field_values(custom_field_id);
CREATE INDEX IF NOT EXISTS idx_custom_field_values_entity_id ON custom_field_values(entity_id);

-- File Attachments
CREATE TABLE IF NOT EXISTS file_attachments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES companies(id) ON DELETE CASCADE NOT NULL,
  entity_type text NOT NULL CHECK (entity_type IN ('client', 'invoice', 'contract', 'subscription', 'company')),
  entity_id uuid NOT NULL,
  file_name text NOT NULL,
  file_type text,
  file_size bigint,
  storage_path text NOT NULL,
  uploaded_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_file_attachments_company_id ON file_attachments(company_id);
CREATE INDEX IF NOT EXISTS idx_file_attachments_entity ON file_attachments(entity_type, entity_id);

-- Digital Contracts
CREATE TABLE IF NOT EXISTS contracts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES companies(id) ON DELETE CASCADE NOT NULL,
  client_id uuid REFERENCES clients(id) ON DELETE CASCADE NOT NULL,
  subscription_id uuid REFERENCES subscriptions(id) ON DELETE SET NULL,
  title text NOT NULL,
  content text NOT NULL,
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'signed', 'cancelled', 'expired')),
  contract_date date,
  start_date date,
  end_date date,
  value numeric(10,2),
  pdf_url text,
  signature_data jsonb DEFAULT '{}'::jsonb,
  signed_at timestamptz,
  created_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_contracts_company_id ON contracts(company_id);
CREATE INDEX IF NOT EXISTS idx_contracts_client_id ON contracts(client_id);
CREATE INDEX IF NOT EXISTS idx_contracts_status ON contracts(status);

-- Update activity_logs to support more action types
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'activity_logs' AND column_name = 'action'
  ) THEN
    ALTER TABLE activity_logs DROP CONSTRAINT IF EXISTS activity_logs_action_check;
    ALTER TABLE activity_logs ADD CONSTRAINT activity_logs_action_check 
      CHECK (action IN ('create', 'update', 'delete', 'login', 'logout', 'payment', 'invoice', 'email', 'sms', 'whatsapp', 'export', 'import'));
  END IF;
END $$;

-- Add company_id to activity_logs
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'activity_logs' AND column_name = 'company_id'
  ) THEN
    ALTER TABLE activity_logs ADD COLUMN company_id uuid REFERENCES companies(id) ON DELETE CASCADE;
    CREATE INDEX IF NOT EXISTS idx_activity_logs_company_id ON activity_logs(company_id);
  END IF;
END $$;

-- Enable RLS
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE automation_flows ENABLE ROW LEVEL SECURITY;
ALTER TABLE automation_flow_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE communication_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE communication_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE entity_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_field_values ENABLE ROW LEVEL SECURITY;
ALTER TABLE file_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Companies
CREATE POLICY "Users can view own company"
  ON companies FOR SELECT
  TO authenticated
  USING (
    id IN (SELECT company_id FROM users WHERE id = auth.uid())
    OR is_super_admin = true
  );

CREATE POLICY "Super admins can manage all companies"
  ON companies FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'super_admin'
    )
  );

-- RLS Policies for Company Settings
CREATE POLICY "Users can view own company settings"
  ON company_settings FOR SELECT
  TO authenticated
  USING (
    company_id IN (SELECT company_id FROM users WHERE id = auth.uid())
  );

CREATE POLICY "Admins can manage company settings"
  ON company_settings FOR ALL
  TO authenticated
  USING (
    company_id IN (
      SELECT company_id FROM users 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'super_admin')
    )
  );

-- RLS Policies for Automation Flows
CREATE POLICY "Users can view own company flows"
  ON automation_flows FOR SELECT
  TO authenticated
  USING (
    company_id IN (SELECT company_id FROM users WHERE id = auth.uid())
  );

CREATE POLICY "Admins can manage flows"
  ON automation_flows FOR ALL
  TO authenticated
  USING (
    company_id IN (
      SELECT company_id FROM users 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'super_admin')
    )
  );

-- RLS Policies for Flow Executions
CREATE POLICY "Users can view own company executions"
  ON automation_flow_executions FOR SELECT
  TO authenticated
  USING (
    company_id IN (SELECT company_id FROM users WHERE id = auth.uid())
  );

-- RLS Policies for Communication Templates
CREATE POLICY "Users can view own company templates"
  ON communication_templates FOR SELECT
  TO authenticated
  USING (
    company_id IN (SELECT company_id FROM users WHERE id = auth.uid())
  );

CREATE POLICY "Admins can manage templates"
  ON communication_templates FOR ALL
  TO authenticated
  USING (
    company_id IN (
      SELECT company_id FROM users 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'super_admin')
    )
  );

-- RLS Policies for Communication Logs
CREATE POLICY "Users can view own company logs"
  ON communication_logs FOR SELECT
  TO authenticated
  USING (
    company_id IN (SELECT company_id FROM users WHERE id = auth.uid())
  );

CREATE POLICY "System can insert logs"
  ON communication_logs FOR INSERT
  TO authenticated
  WITH CHECK (
    company_id IN (SELECT company_id FROM users WHERE id = auth.uid())
  );

-- RLS Policies for Notification Preferences
CREATE POLICY "Users can view own preferences"
  ON notification_preferences FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can manage own preferences"
  ON notification_preferences FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- RLS Policies for Tags
CREATE POLICY "Users can view own company tags"
  ON tags FOR SELECT
  TO authenticated
  USING (
    company_id IN (SELECT company_id FROM users WHERE id = auth.uid())
  );

CREATE POLICY "Users can manage own company tags"
  ON tags FOR ALL
  TO authenticated
  USING (
    company_id IN (SELECT company_id FROM users WHERE id = auth.uid())
  );

-- RLS Policies for Entity Tags
CREATE POLICY "Users can view own company entity tags"
  ON entity_tags FOR SELECT
  TO authenticated
  USING (
    tag_id IN (
      SELECT id FROM tags 
      WHERE company_id IN (SELECT company_id FROM users WHERE id = auth.uid())
    )
  );

CREATE POLICY "Users can manage entity tags"
  ON entity_tags FOR ALL
  TO authenticated
  USING (
    tag_id IN (
      SELECT id FROM tags 
      WHERE company_id IN (SELECT company_id FROM users WHERE id = auth.uid())
    )
  );

-- RLS Policies for Custom Fields
CREATE POLICY "Users can view own company custom fields"
  ON custom_fields FOR SELECT
  TO authenticated
  USING (
    company_id IN (SELECT company_id FROM users WHERE id = auth.uid())
  );

CREATE POLICY "Admins can manage custom fields"
  ON custom_fields FOR ALL
  TO authenticated
  USING (
    company_id IN (
      SELECT company_id FROM users 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'super_admin')
    )
  );

-- RLS Policies for Custom Field Values
CREATE POLICY "Users can view own company field values"
  ON custom_field_values FOR SELECT
  TO authenticated
  USING (
    custom_field_id IN (
      SELECT id FROM custom_fields 
      WHERE company_id IN (SELECT company_id FROM users WHERE id = auth.uid())
    )
  );

CREATE POLICY "Users can manage field values"
  ON custom_field_values FOR ALL
  TO authenticated
  USING (
    custom_field_id IN (
      SELECT id FROM custom_fields 
      WHERE company_id IN (SELECT company_id FROM users WHERE id = auth.uid())
    )
  );

-- RLS Policies for File Attachments
CREATE POLICY "Users can view own company files"
  ON file_attachments FOR SELECT
  TO authenticated
  USING (
    company_id IN (SELECT company_id FROM users WHERE id = auth.uid())
  );

CREATE POLICY "Users can manage files"
  ON file_attachments FOR ALL
  TO authenticated
  USING (
    company_id IN (SELECT company_id FROM users WHERE id = auth.uid())
  );

-- RLS Policies for Contracts
CREATE POLICY "Users can view own company contracts"
  ON contracts FOR SELECT
  TO authenticated
  USING (
    company_id IN (SELECT company_id FROM users WHERE id = auth.uid())
  );

CREATE POLICY "Users can manage contracts"
  ON contracts FOR ALL
  TO authenticated
  USING (
    company_id IN (SELECT company_id FROM users WHERE id = auth.uid())
  );

-- Update RLS policies for existing tables to include company_id isolation

-- Update clients RLS
DROP POLICY IF EXISTS "Users can read own clients" ON clients;
CREATE POLICY "Users can view own company clients"
  ON clients FOR SELECT
  TO authenticated
  USING (
    company_id IN (SELECT company_id FROM users WHERE id = auth.uid())
  );

DROP POLICY IF EXISTS "Users can create clients" ON clients;
CREATE POLICY "Users can create company clients"
  ON clients FOR INSERT
  TO authenticated
  WITH CHECK (
    company_id IN (SELECT company_id FROM users WHERE id = auth.uid())
  );

DROP POLICY IF EXISTS "Users can update own clients" ON clients;
CREATE POLICY "Users can update company clients"
  ON clients FOR UPDATE
  TO authenticated
  USING (
    company_id IN (SELECT company_id FROM users WHERE id = auth.uid())
  );

DROP POLICY IF EXISTS "Users can delete own clients" ON clients;
CREATE POLICY "Users can delete company clients"
  ON clients FOR DELETE
  TO authenticated
  USING (
    company_id IN (SELECT company_id FROM users WHERE id = auth.uid())
  );

-- Update services RLS
DROP POLICY IF EXISTS "Users can read own services" ON services;
CREATE POLICY "Users can view own company services"
  ON services FOR SELECT
  TO authenticated
  USING (
    company_id IN (SELECT company_id FROM users WHERE id = auth.uid())
  );

DROP POLICY IF EXISTS "Users can create services" ON services;
CREATE POLICY "Users can create company services"
  ON services FOR INSERT
  TO authenticated
  WITH CHECK (
    company_id IN (SELECT company_id FROM users WHERE id = auth.uid())
  );

DROP POLICY IF EXISTS "Users can update own services" ON services;
CREATE POLICY "Users can update company services"
  ON services FOR UPDATE
  TO authenticated
  USING (
    company_id IN (SELECT company_id FROM users WHERE id = auth.uid())
  );

DROP POLICY IF EXISTS "Users can delete own services" ON services;
CREATE POLICY "Users can delete company services"
  ON services FOR DELETE
  TO authenticated
  USING (
    company_id IN (SELECT company_id FROM users WHERE id = auth.uid())
  );

-- Update invoices RLS
DROP POLICY IF EXISTS "Users can read own invoices" ON invoices;
CREATE POLICY "Users can view own company invoices"
  ON invoices FOR SELECT
  TO authenticated
  USING (
    company_id IN (SELECT company_id FROM users WHERE id = auth.uid())
  );

DROP POLICY IF EXISTS "Users can create invoices" ON invoices;
CREATE POLICY "Users can create company invoices"
  ON invoices FOR INSERT
  TO authenticated
  WITH CHECK (
    company_id IN (SELECT company_id FROM users WHERE id = auth.uid())
  );

DROP POLICY IF EXISTS "Users can update own invoices" ON invoices;
CREATE POLICY "Users can update company invoices"
  ON invoices FOR UPDATE
  TO authenticated
  USING (
    company_id IN (SELECT company_id FROM users WHERE id = auth.uid())
  );

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_company_settings_updated_at BEFORE UPDATE ON company_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_automation_flows_updated_at BEFORE UPDATE ON automation_flows
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_communication_templates_updated_at BEFORE UPDATE ON communication_templates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notification_preferences_updated_at BEFORE UPDATE ON notification_preferences
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_custom_fields_updated_at BEFORE UPDATE ON custom_fields
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_custom_field_values_updated_at BEFORE UPDATE ON custom_field_values
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contracts_updated_at BEFORE UPDATE ON contracts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();