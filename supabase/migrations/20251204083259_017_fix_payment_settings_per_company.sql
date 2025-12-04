/*
  # Fix Payment Settings for Multi-Company Support

  1. Changes
    - Add `company_id` column to `payment_settings` table
    - Update RLS policies to allow company admins to manage their own payment settings
    - Create unique constraint on (company_id, provider) to ensure one config per provider per company
  
  2. Security
    - Drop existing super_admin-only policies
    - Create new policies allowing company admins to manage their own settings
    - Super admins can still manage all payment settings
*/

-- Add company_id column to payment_settings
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'payment_settings' AND column_name = 'company_id'
  ) THEN
    ALTER TABLE payment_settings ADD COLUMN company_id uuid REFERENCES companies(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Drop existing RLS policies
DROP POLICY IF EXISTS "Super admins can read payment settings" ON payment_settings;
DROP POLICY IF EXISTS "Super admins can insert payment settings" ON payment_settings;
DROP POLICY IF EXISTS "Super admins can update payment settings" ON payment_settings;
DROP POLICY IF EXISTS "Super admins can delete payment settings" ON payment_settings;

-- Create new RLS policies for company-specific access
CREATE POLICY "Company admins can read own payment settings"
  ON payment_settings
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.company_id = payment_settings.company_id
      AND users.role IN ('admin', 'super_admin')
    )
    OR
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'super_admin'
    )
  );

CREATE POLICY "Company admins can insert own payment settings"
  ON payment_settings
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.company_id = payment_settings.company_id
      AND users.role IN ('admin', 'super_admin')
    )
    OR
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'super_admin'
    )
  );

CREATE POLICY "Company admins can update own payment settings"
  ON payment_settings
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.company_id = payment_settings.company_id
      AND users.role IN ('admin', 'super_admin')
    )
    OR
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
      AND users.company_id = payment_settings.company_id
      AND users.role IN ('admin', 'super_admin')
    )
    OR
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'super_admin'
    )
  );

CREATE POLICY "Company admins can delete own payment settings"
  ON payment_settings
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.company_id = payment_settings.company_id
      AND users.role IN ('admin', 'super_admin')
    )
    OR
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'super_admin'
    )
  );

-- Drop existing unique constraint on provider
ALTER TABLE payment_settings DROP CONSTRAINT IF EXISTS payment_settings_provider_key;

-- Create composite unique constraint (company_id, provider)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'payment_settings_company_provider_unique'
  ) THEN
    ALTER TABLE payment_settings 
    ADD CONSTRAINT payment_settings_company_provider_unique 
    UNIQUE (company_id, provider);
  END IF;
END $$;