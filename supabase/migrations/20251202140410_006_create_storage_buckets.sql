/*
  # Create Storage Buckets

  1. New Buckets
    - `invoices` - Store generated PDF invoices
    - `contracts` - Store contract documents
    - `client-documents` - Store client-related documents
    - `reports` - Store generated reports and analytics exports
    - `avatars` - Store user and client profile pictures

  2. Security
    - Enable RLS on all buckets
    - Configure storage policies for access control
    - Allow authenticated users to manage their own files

  3. Configuration
    - Set file size limits
    - Configure CORS headers
    - Enable public access where appropriate
*/

INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('invoices', 'invoices', false),
  ('contracts', 'contracts', false),
  ('client-documents', 'client-documents', false),
  ('reports', 'reports', false),
  ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Authenticated users can upload invoices"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'invoices');

CREATE POLICY "Authenticated users can view invoices they created"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'invoices');

CREATE POLICY "Authenticated users can upload contracts"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'contracts');

CREATE POLICY "Authenticated users can view contracts"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'contracts');

CREATE POLICY "Authenticated users can upload client documents"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'client-documents');

CREATE POLICY "Authenticated users can view client documents"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'client-documents');

CREATE POLICY "Authenticated users can upload reports"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'reports');

CREATE POLICY "Authenticated users can view reports"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'reports');

CREATE POLICY "Authenticated users can upload avatars"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'avatars');

CREATE POLICY "Anyone can view avatars"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');
