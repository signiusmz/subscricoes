/*
  # Clean Demo Data

  1. Purpose
    - Remove all demonstrative/sample data from the database
    - Clean up mock clients, services, subscriptions, invoices, and payments
    - Prepare database for production use

  2. Data to Remove
    - All client_services records
    - All payments records
    - All invoices records
    - All subscriptions records
    - All services records
    - All clients records
    - All users records (if any demo users exist)
    - All activity_logs records (if any demo logs exist)

  3. Order of Deletion
    - Delete in reverse order of foreign key dependencies
    - Start with tables that have no dependents
    - End with base tables

  4. Important Notes
    - This migration only removes data, not schema
    - Use TRUNCATE for efficient deletion
    - CASCADE will handle dependent records
*/

-- Truncate all tables in reverse dependency order
TRUNCATE TABLE client_portal_sessions CASCADE;
TRUNCATE TABLE activity_logs CASCADE;
TRUNCATE TABLE payments CASCADE;
TRUNCATE TABLE invoices CASCADE;
TRUNCATE TABLE subscriptions CASCADE;
TRUNCATE TABLE client_services CASCADE;
TRUNCATE TABLE clients CASCADE;
TRUNCATE TABLE services CASCADE;
TRUNCATE TABLE users CASCADE;

-- Reset sequences if they exist
ALTER SEQUENCE IF EXISTS users_id_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS clients_id_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS services_id_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS client_services_id_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS invoices_id_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS payments_id_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS subscriptions_id_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS activity_logs_id_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS client_portal_sessions_id_seq RESTART WITH 1;
