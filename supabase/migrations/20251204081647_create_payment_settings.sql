/*
  # Create Payment Settings Table

  Creates a table to store payment gateway configuration (MPGS) with proper security and encryption.

  1. New Tables
    - `payment_settings`
      - `id` (uuid, primary key)
      - `provider` (text) - Payment provider name (mpgs)
      - `merchant_id` (text) - MPGS Merchant ID
      - `api_username` (text) - MPGS API Username
      - `api_password` (text) - MPGS API Password (encrypted)
      - `gateway_url` (text) - Gateway URL
      - `environment` (text) - test or production
      - `is_active` (boolean) - Whether this payment method is active
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on payment_settings table
    - Only super_admin role can access payment settings
    - API password should be encrypted at application level before storage

  3. Indexes
    - Index on provider for fast lookups
*/

-- Create payment_settings table
CREATE TABLE IF NOT EXISTS payment_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider text NOT NULL,
  merchant_id text,
  api_username text,
  api_password text,
  gateway_url text,
  environment text DEFAULT 'production',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(provider)
);

-- Create index on provider
CREATE INDEX IF NOT EXISTS idx_payment_settings_provider ON payment_settings(provider);

-- Enable RLS
ALTER TABLE payment_settings ENABLE ROW LEVEL SECURITY;

-- Policy: Only authenticated users with super_admin role can read payment settings
CREATE POLICY "Super admins can read payment settings"
  ON payment_settings
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'super_admin'
    )
  );

-- Policy: Only authenticated users with super_admin role can insert payment settings
CREATE POLICY "Super admins can insert payment settings"
  ON payment_settings
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'super_admin'
    )
  );

-- Policy: Only authenticated users with super_admin role can update payment settings
CREATE POLICY "Super admins can update payment settings"
  ON payment_settings
  FOR UPDATE
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

-- Policy: Only authenticated users with super_admin role can delete payment settings
CREATE POLICY "Super admins can delete payment settings"
  ON payment_settings
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'super_admin'
    )
  );

-- Create subscription_payments table for tracking recurring payments
CREATE TABLE IF NOT EXISTS subscription_payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  order_id text NOT NULL UNIQUE,
  transaction_id text,
  amount numeric NOT NULL,
  currency text DEFAULT 'MZN',
  status text NOT NULL DEFAULT 'pending',
  payment_method text DEFAULT 'card',
  plan_type text NOT NULL,
  gateway_response jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_subscription_payments_company ON subscription_payments(company_id);
CREATE INDEX IF NOT EXISTS idx_subscription_payments_status ON subscription_payments(status);
CREATE INDEX IF NOT EXISTS idx_subscription_payments_order ON subscription_payments(order_id);

-- Enable RLS
ALTER TABLE subscription_payments ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own company's payments
CREATE POLICY "Users can view own company payments"
  ON subscription_payments
  FOR SELECT
  TO authenticated
  USING (
    company_id IN (
      SELECT company_id FROM users WHERE id = auth.uid()
    )
  );

-- Policy: Service role can insert payments (for webhooks)
CREATE POLICY "Service role can insert payments"
  ON subscription_payments
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Policy: System can update payments (for webhooks)
CREATE POLICY "Service role can update payments"
  ON subscription_payments
  FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Create function to update timestamp
CREATE OR REPLACE FUNCTION update_payment_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_payment_settings_timestamp ON payment_settings;
CREATE TRIGGER update_payment_settings_timestamp
  BEFORE UPDATE ON payment_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_payment_timestamp();

DROP TRIGGER IF EXISTS update_subscription_payments_timestamp ON subscription_payments;
CREATE TRIGGER update_subscription_payments_timestamp
  BEFORE UPDATE ON subscription_payments
  FOR EACH ROW
  EXECUTE FUNCTION update_payment_timestamp();
