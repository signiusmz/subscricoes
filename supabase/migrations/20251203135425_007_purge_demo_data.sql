/*
  # Purge Demo Data

  1. Purpose
    - Remove all demo/test data from all tables
    - Preserve database schema
    - Keep user and admin records intact

  2. Tables Cleared
    - payments (all rows)
    - invoices (all rows)
    - subscriptions (all rows)
    - client_services (all rows)
    - client_portal_sessions (all rows)
    - clients (all rows)
    - services (all rows)
    - activity_logs (all rows)

  3. Preserved Data
    - users table remains untouched (all user/admin records preserved)

  4. Execution Order
    - Clearing in reverse dependency order to respect foreign key constraints
*/

DELETE FROM payments;
DELETE FROM invoices;
DELETE FROM subscriptions;
DELETE FROM client_services;
DELETE FROM client_portal_sessions;
DELETE FROM clients;
DELETE FROM services;
DELETE FROM activity_logs;
