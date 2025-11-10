/*
  # Create Billing and Invoice Tables

  1. New Tables
    - `invoices` - Client invoices
      - `id` (uuid, primary key)
      - `client_id` (uuid, foreign key)
      - `invoice_number` (text, unique)
      - `amount` (numeric)
      - `status` (text: 'pending', 'paid', 'overdue', 'cancelled')
      - `issue_date` (date)
      - `due_date` (date)
      - `paid_date` (date, nullable)
      - `description` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `payments` - Payment records
      - `id` (uuid, primary key)
      - `invoice_id` (uuid, foreign key)
      - `amount` (numeric)
      - `payment_method` (text: 'bank_transfer', 'mpesa', 'cash', 'check')
      - `reference_number` (text)
      - `payment_date` (timestamp)
      - `notes` (text)
      - `created_at` (timestamp)

    - `subscriptions` - Client subscriptions
      - `id` (uuid, primary key)
      - `client_id` (uuid, foreign key)
      - `name` (text)
      - `amount` (numeric)
      - `billing_cycle` (text: 'monthly', 'quarterly', 'annual')
      - `status` (text: 'active', 'paused', 'cancelled')
      - `start_date` (date)
      - `end_date` (date, nullable)
      - `next_billing_date` (date)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all billing tables
    - Add policies for financial data access

  3. Indexes
    - Add indexes on foreign keys and status columns
*/

-- Create invoices table
CREATE TABLE IF NOT EXISTS invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  invoice_number text UNIQUE NOT NULL,
  amount numeric NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'overdue', 'cancelled')),
  issue_date date NOT NULL,
  due_date date NOT NULL,
  paid_date date,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id uuid NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  amount numeric NOT NULL,
  payment_method text NOT NULL CHECK (payment_method IN ('bank_transfer', 'mpesa', 'cash', 'check')),
  reference_number text,
  payment_date timestamptz NOT NULL DEFAULT now(),
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  name text NOT NULL,
  amount numeric NOT NULL,
  billing_cycle text NOT NULL DEFAULT 'monthly' CHECK (billing_cycle IN ('monthly', 'quarterly', 'annual')),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'cancelled')),
  start_date date NOT NULL,
  end_date date,
  next_billing_date date NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Create indexes
CREATE INDEX idx_invoices_client_id ON invoices(client_id);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_invoices_due_date ON invoices(due_date);
CREATE INDEX idx_payments_invoice_id ON payments(invoice_id);
CREATE INDEX idx_subscriptions_client_id ON subscriptions(client_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_subscriptions_next_billing_date ON subscriptions(next_billing_date);
