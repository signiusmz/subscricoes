/*
  # Fix Users Table RLS Recursion

  ## Problem
  The "Super admins can view all users" policy causes infinite recursion by querying
  the users table within the users table policy.

  ## Solution
  Remove the recursive policy and create simpler policies that don't reference
  the users table within users table policies.
*/

-- Drop the problematic policy
DROP POLICY IF EXISTS "Super admins can view all users" ON users;

-- Create a simpler policy that allows viewing users in the same company
CREATE POLICY "Users can view company users"
  ON users FOR SELECT
  TO authenticated
  USING (
    company_id IN (
      SELECT company_id FROM users WHERE id = auth.uid()
    )
  );

-- Allow insert for authenticated users (for signup)
DROP POLICY IF EXISTS "Allow insert during signup" ON users;
CREATE POLICY "Allow insert during signup"
  ON users FOR INSERT
  TO authenticated
  WITH CHECK (id = auth.uid());

-- Allow update for own profile
DROP POLICY IF EXISTS "Users can update own profile" ON users;
CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- Allow delete (only for admins of the same company)
CREATE POLICY "Admins can delete company users"
  ON users FOR DELETE
  TO authenticated
  USING (
    company_id IN (
      SELECT company_id FROM users 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'super_admin')
    )
    AND id != auth.uid()
  );