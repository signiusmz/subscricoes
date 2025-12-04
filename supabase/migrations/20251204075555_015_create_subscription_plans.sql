/*
  # Create Subscription Plans Table

  ## Overview
  This migration creates a table to manage subscription plans that will be
  displayed on the landing page and managed by super admins.

  ## New Tables
  - `subscription_plans` - Available subscription plans
  
  ## Changes
  - Add is_visible column to control which plans appear on landing page
  - Add sort_order for plan display ordering
  - Add features as JSONB for flexible feature lists
  - Update trial period from 14 to 3 days

  ## Security
  - Enable RLS
  - Public can view active plans
  - Only super admins can manage plans
*/

-- Create subscription plans table
CREATE TABLE IF NOT EXISTS subscription_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  price numeric(10,2) NOT NULL DEFAULT 0,
  billing_period text DEFAULT 'monthly' CHECK (billing_period IN ('monthly', 'yearly')),
  features jsonb DEFAULT '[]'::jsonb,
  is_visible boolean DEFAULT true,
  is_popular boolean DEFAULT false,
  sort_order integer DEFAULT 0,
  max_clients integer,
  max_users integer,
  max_invoices_per_month integer,
  has_automation boolean DEFAULT false,
  has_analytics boolean DEFAULT false,
  has_api_access boolean DEFAULT false,
  has_whatsapp boolean DEFAULT false,
  has_custom_domain boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Insert default plans
INSERT INTO subscription_plans (name, slug, description, price, features, is_visible, is_popular, sort_order, max_clients, max_users, has_automation, has_analytics, has_whatsapp) VALUES
('Start', 'start', 'Ideal para pequenos negócios começando', 750.00, 
  '["Até 50 clientes", "1 utilizador", "Faturação básica", "Suporte por email", "Notificações por email"]'::jsonb, 
  true, false, 1, 50, 1, false, false, false),
  
('Pro', 'pro', 'Para empresas em crescimento', 1500.00, 
  '["Até 200 clientes", "3 utilizadores", "Faturação completa", "Automação de processos", "Análises básicas", "Notificações WhatsApp", "Suporte prioritário"]'::jsonb, 
  true, true, 2, 200, 3, true, true, true),
  
('Premium', 'premium', 'Solução completa para grandes empresas', 3500.00, 
  '["Clientes ilimitados", "Utilizadores ilimitados", "Todas as funcionalidades", "Automação avançada", "Análises avançadas", "API de integração", "Notificações WhatsApp", "Suporte dedicado 24/7", "Domínio personalizado"]'::jsonb, 
  true, false, 3, NULL, NULL, true, true, true);

-- Create index for sorting
CREATE INDEX IF NOT EXISTS idx_subscription_plans_sort_order ON subscription_plans(sort_order);
CREATE INDEX IF NOT EXISTS idx_subscription_plans_slug ON subscription_plans(slug);
CREATE INDEX IF NOT EXISTS idx_subscription_plans_is_visible ON subscription_plans(is_visible);

-- Enable RLS
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;

-- Public can view visible plans (for landing page)
CREATE POLICY "Anyone can view visible plans"
  ON subscription_plans FOR SELECT
  USING (is_visible = true);

-- Super admins can view all plans
CREATE POLICY "Super admins can view all plans"
  ON subscription_plans FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'super_admin'
    )
  );

-- Super admins can manage plans
CREATE POLICY "Super admins can manage plans"
  ON subscription_plans FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'super_admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'super_admin'
    )
  );

-- Update trigger for updated_at
CREATE TRIGGER update_subscription_plans_updated_at 
  BEFORE UPDATE ON subscription_plans
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Update companies table to reference subscription_plans
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'companies' AND column_name = 'subscription_plan_id'
  ) THEN
    ALTER TABLE companies ADD COLUMN subscription_plan_id uuid REFERENCES subscription_plans(id);
    CREATE INDEX IF NOT EXISTS idx_companies_subscription_plan_id ON companies(subscription_plan_id);
  END IF;
END $$;

-- Update trial period to 3 days (update existing companies)
UPDATE companies 
SET trial_ends_at = created_at + interval '3 days'
WHERE status = 'trial' AND trial_ends_at > now();

-- Add email and whatsapp configuration for centralized notifications
CREATE TABLE IF NOT EXISTS notification_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  smtp_host text,
  smtp_port integer DEFAULT 587,
  smtp_user text,
  smtp_password text,
  smtp_from_email text,
  smtp_from_name text DEFAULT 'DZUMUKA',
  whatsapp_api_url text,
  whatsapp_api_key text,
  whatsapp_phone_number text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Insert default notification settings
INSERT INTO notification_settings (smtp_from_name, is_active) 
VALUES ('DZUMUKA', true)
ON CONFLICT DO NOTHING;

-- Enable RLS
ALTER TABLE notification_settings ENABLE ROW LEVEL SECURITY;

-- Only super admins can view and manage notification settings
CREATE POLICY "Super admins can view notification settings"
  ON notification_settings FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'super_admin'
    )
  );

CREATE POLICY "Super admins can manage notification settings"
  ON notification_settings FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'super_admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'super_admin'
    )
  );

-- Update trigger
CREATE TRIGGER update_notification_settings_updated_at 
  BEFORE UPDATE ON notification_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
