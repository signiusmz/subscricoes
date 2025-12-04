/*
  # Fix Companies RLS for Signup

  ## Problem
  During signup, we need to insert into companies before users table has a record.
  Current policies cause recursion by checking users table.

  ## Solution
  Separate INSERT policies from other operations to allow signup flow.
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own company" ON companies;
DROP POLICY IF EXISTS "Super admins can manage all companies" ON companies;

-- Allow authenticated users to INSERT companies (for signup)
CREATE POLICY "Allow company creation on signup"
  ON companies FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Allow users to view their own company (no recursion on SELECT)
CREATE POLICY "Users can view own company"
  ON companies FOR SELECT
  TO authenticated
  USING (
    id IN (
      SELECT company_id FROM users WHERE id = auth.uid()
    )
  );

-- Allow users to update their own company
CREATE POLICY "Admins can update own company"
  ON companies FOR UPDATE
  TO authenticated
  USING (
    id IN (
      SELECT company_id FROM users 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'super_admin')
    )
  )
  WITH CHECK (
    id IN (
      SELECT company_id FROM users 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'super_admin')
    )
  );

-- Allow admins to delete their own company (with caution)
CREATE POLICY "Super admins can delete companies"
  ON companies FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'super_admin'
      AND users.company_id = companies.id
    )
  );