/*
  # Purge All Demo Data
  
  1. Clear all data tables while preserving schema
  2. Keep users and admin accounts intact
  3. Remove all sample/demo data
  
  Tables cleared (in dependency order):
  - activity_logs
  - payments
  - invoices
  - client_portal_sessions
  - subscriptions
  - client_services
  - clients
  - services
  
  Tables preserved:
  - users (all existing users retained)
*/

DELETE FROM activity_logs;
DELETE FROM payments;
DELETE FROM invoices;
DELETE FROM client_portal_sessions;
DELETE FROM subscriptions;
DELETE FROM client_services;
DELETE FROM clients;
DELETE FROM services;
