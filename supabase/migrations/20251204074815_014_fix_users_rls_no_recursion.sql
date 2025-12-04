/*
  # Fix Users RLS - Remove Infinite Recursion

  ## Problem
  Current policies cause infinite recursion when querying users table because
  they reference the users table within their own policies.

  ## Solution  
  Split policies into:
  1. Simple policy to view own profile (no recursion)
  2. Separate policy for company users using a function

  ## Changes
  - Drop all existing SELECT policies on users
  - Create non-recursive policy for own profile
  - Create helper function to check company access
  - Create policy for viewing company users using the function
*/

-- Drop all existing policies on users
DROP POLICY IF EXISTS "Users can view company users" ON users;
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Super admins can view all users" ON users;

-- Create a simple policy for viewing own profile (no recursion)
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Create a function to get user's company_id without recursion
CREATE OR REPLACE FUNCTION get_user_company_id(user_id uuid)
RETURNS uuid
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT company_id FROM users WHERE id = user_id LIMIT 1;
$$;

-- Create policy for viewing other users in the same company
CREATE POLICY "Users can view company members"
  ON users FOR SELECT
  TO authenticated
  USING (
    company_id = get_user_company_id(auth.uid())
    AND company_id IS NOT NULL
  );
