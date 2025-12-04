/*
  # Create Recurring Subscriptions Management

  ## Overview
  Creates infrastructure for managing recurring subscription payments for companies.
  All subscription plans are configured as recurring with automatic billing via MPGS.

  ## New Tables
  - `company_subscriptions` - Tracks active subscriptions for each company
    - Links companies to their subscription plans
    - Manages recurring billing cycles
    - Tracks next billing date and payment status
    - Stores payment method token for automatic charging

  ## Changes
  - Update subscription_plans to mark all as recurring by default
  - Add automatic billing configuration
  - Create indexes for performance

  ## Security
  - Enable RLS on company_subscriptions
  - Users can view their own company subscription
  - Super admins can view and manage all subscriptions
  - Service role can update for webhook processing

  ## Business Logic
  - All plans are monthly recurring subscriptions
  - Automatic billing happens on next_billing_date
  - Failed payments trigger retry logic
  - Companies can upgrade/downgrade plans
*/

-- Create company_subscriptions table for recurring billing
CREATE TABLE IF NOT EXISTS company_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  subscription_plan_id uuid NOT NULL REFERENCES subscription_plans(id),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'past_due', 'cancelled', 'trial')),
  current_period_start timestamptz NOT NULL DEFAULT now(),
  current_period_end timestamptz NOT NULL,
  next_billing_date timestamptz NOT NULL,
  cancel_at_period_end boolean DEFAULT false,
  cancelled_at timestamptz,
  payment_method_token text,
  last_payment_status text,
  last_payment_date timestamptz,
  retry_count integer DEFAULT 0,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(company_id)
);

-- Create indexes for efficient queries
CREATE INDEX IF NOT EXISTS idx_company_subscriptions_company ON company_subscriptions(company_id);
CREATE INDEX IF NOT EXISTS idx_company_subscriptions_plan ON company_subscriptions(subscription_plan_id);
CREATE INDEX IF NOT EXISTS idx_company_subscriptions_status ON company_subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_company_subscriptions_next_billing ON company_subscriptions(next_billing_date);

-- Add is_recurring field to subscription_plans (all plans are recurring)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'subscription_plans' AND column_name = 'is_recurring'
  ) THEN
    ALTER TABLE subscription_plans ADD COLUMN is_recurring boolean DEFAULT true;
  END IF;
END $$;

-- Update all existing plans to be recurring
UPDATE subscription_plans SET is_recurring = true;

-- Enable RLS
ALTER TABLE company_subscriptions ENABLE ROW LEVEL SECURITY;

-- Users can view their own company subscription
CREATE POLICY "Users can view own company subscription"
  ON company_subscriptions
  FOR SELECT
  TO authenticated
  USING (
    company_id IN (
      SELECT company_id FROM users WHERE id = auth.uid()
    )
  );

-- Super admins can view all subscriptions
CREATE POLICY "Super admins can view all subscriptions"
  ON company_subscriptions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'super_admin'
    )
  );

-- Super admins can manage all subscriptions
CREATE POLICY "Super admins can manage subscriptions"
  ON company_subscriptions
  FOR ALL
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

-- Service role can update subscriptions (for automatic billing and webhooks)
CREATE POLICY "Service role can update subscriptions"
  ON company_subscriptions
  FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Create trigger for updated_at
CREATE TRIGGER update_company_subscriptions_updated_at 
  BEFORE UPDATE ON company_subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to initialize subscription when company signs up
CREATE OR REPLACE FUNCTION initialize_company_subscription()
RETURNS TRIGGER AS $$
BEGIN
  -- If company has a subscription plan and no active subscription, create one
  IF NEW.subscription_plan_id IS NOT NULL AND NEW.status IN ('trial', 'active') THEN
    INSERT INTO company_subscriptions (
      company_id,
      subscription_plan_id,
      status,
      current_period_start,
      current_period_end,
      next_billing_date
    )
    VALUES (
      NEW.id,
      NEW.subscription_plan_id,
      NEW.status,
      now(),
      now() + interval '1 month',
      CASE 
        WHEN NEW.status = 'trial' THEN NEW.trial_ends_at
        ELSE now() + interval '1 month'
      END
    )
    ON CONFLICT (company_id) DO NOTHING;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-initialize subscriptions
DROP TRIGGER IF EXISTS trigger_initialize_company_subscription ON companies;
CREATE TRIGGER trigger_initialize_company_subscription
  AFTER INSERT OR UPDATE OF subscription_plan_id, status ON companies
  FOR EACH ROW
  EXECUTE FUNCTION initialize_company_subscription();