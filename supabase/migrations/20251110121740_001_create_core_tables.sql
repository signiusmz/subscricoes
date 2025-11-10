/*
  # Create Core Tables

  1. New Tables
    - `users` - System users (admin/staff)
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `full_name` (text)
      - `role` (text: 'admin', 'staff', 'super_admin')
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `clients` - Client companies
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `company_name` (text)
      - `representative_name` (text)
      - `email` (text)
      - `phone` (text)
      - `nuit` (text, unique)
      - `address` (text)
      - `status` (text: 'active', 'inactive', 'suspended')
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `services` - Services offered to clients
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `base_price` (numeric)
      - `billing_type` (text: 'monthly', 'one-time', 'hourly')
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `client_services` - Relationship between clients and services
      - `id` (uuid, primary key)
      - `client_id` (uuid, foreign key)
      - `service_id` (uuid, foreign key)
      - `price` (numeric)
      - `status` (text: 'active', 'paused', 'cancelled')
      - `start_date` (date)
      - `end_date` (date, nullable)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for data access control

  3. Indexes
    - Add indexes on foreign keys and frequently queried columns
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  role text NOT NULL DEFAULT 'staff' CHECK (role IN ('admin', 'staff', 'super_admin')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create clients table
CREATE TABLE IF NOT EXISTS clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  company_name text NOT NULL,
  representative_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  nuit text UNIQUE NOT NULL,
  address text NOT NULL,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create services table
CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  base_price numeric NOT NULL DEFAULT 0,
  billing_type text NOT NULL DEFAULT 'monthly' CHECK (billing_type IN ('monthly', 'one-time', 'hourly')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create client_services junction table
CREATE TABLE IF NOT EXISTS client_services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  service_id uuid NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  price numeric NOT NULL,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'cancelled')),
  start_date date NOT NULL,
  end_date date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(client_id, service_id)
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_services ENABLE ROW LEVEL SECURITY;

-- Create indexes
CREATE INDEX idx_clients_user_id ON clients(user_id);
CREATE INDEX idx_clients_status ON clients(status);
CREATE INDEX idx_client_services_client_id ON client_services(client_id);
CREATE INDEX idx_client_services_service_id ON client_services(service_id);
CREATE INDEX idx_client_services_status ON client_services(status);
