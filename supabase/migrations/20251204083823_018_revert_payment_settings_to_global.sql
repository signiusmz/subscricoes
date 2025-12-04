/*
  # Revert Payment Settings to Global Configuration

  1. Changes
    - Make `company_id` nullable in `payment_settings` table (for global config)
    - Remove composite unique constraint on (company_id, provider)
    - Restore single unique constraint on provider for global settings
    - Update RLS policies to allow only super_admin access
  
  2. Security
    - Drop all existing company-based policies
    - Create super_admin-only policies
    - Global payment settings (MPGS, SMTP) managed only by super_admin
  
  3. Rationale
    - Payment settings are for system-wide configuration
    - Users pay subscriptions through system's payment gateway
    - Users don't configure their own payment methods
*/

-- Make company_id nullable
ALTER TABLE payment_settings ALTER COLUMN company_id DROP NOT NULL;

-- Drop the composite unique constraint
ALTER TABLE payment_settings DROP CONSTRAINT IF EXISTS payment_settings_company_provider_unique;

-- Restore unique constraint on provider alone (for global settings)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'payment_settings_provider_key'
  ) THEN
    ALTER TABLE payment_settings ADD CONSTRAINT payment_settings_provider_key UNIQUE (provider);
  END IF;
END $$;

-- Drop existing company-based RLS policies
DROP POLICY IF EXISTS "Company admins can read own payment settings" ON payment_settings;
DROP POLICY IF EXISTS "Company admins can insert own payment settings" ON payment_settings;
DROP POLICY IF EXISTS "Company admins can update own payment settings" ON payment_settings;
DROP POLICY IF EXISTS "Company admins can delete own payment settings" ON payment_settings;

-- Create super_admin-only RLS policies
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