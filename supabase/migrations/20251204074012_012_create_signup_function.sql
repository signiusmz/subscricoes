/*
  # Create Signup Function

  ## Purpose
  Create a database function that bypasses RLS to complete user signup.
  This function runs with SECURITY DEFINER to avoid RLS recursion issues.

  ## Usage
  Called during signup to create company, user, settings, and preferences atomically.
*/

CREATE OR REPLACE FUNCTION complete_user_signup(
  p_user_id uuid,
  p_email text,
  p_full_name text,
  p_company_name text,
  p_company_email text,
  p_company_phone text DEFAULT NULL,
  p_company_address text DEFAULT NULL,
  p_company_city text DEFAULT NULL,
  p_company_country text DEFAULT 'Mozambique',
  p_company_tax_id text DEFAULT NULL,
  p_plan text DEFAULT 'start',
  p_role text DEFAULT 'admin',
  p_is_super_admin boolean DEFAULT false
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_company_id uuid;
  v_trial_ends_at timestamptz;
  v_status text;
BEGIN
  -- Calculate trial end date
  v_trial_ends_at := now() + interval '14 days';
  v_status := CASE WHEN p_is_super_admin THEN 'active' ELSE 'trial' END;

  -- Create company
  INSERT INTO companies (
    name,
    email,
    phone,
    address,
    city,
    country,
    tax_id,
    plan,
    status,
    is_super_admin,
    trial_ends_at
  ) VALUES (
    p_company_name,
    p_company_email,
    p_company_phone,
    p_company_address,
    p_company_city,
    p_company_country,
    p_company_tax_id,
    p_plan,
    v_status,
    p_is_super_admin,
    CASE WHEN p_is_super_admin THEN NULL ELSE v_trial_ends_at END
  )
  RETURNING id INTO v_company_id;

  -- Create user record
  INSERT INTO users (
    id,
    company_id,
    email,
    full_name,
    role,
    is_active
  ) VALUES (
    p_user_id,
    v_company_id,
    p_email,
    p_full_name,
    p_role,
    true
  );

  -- Create company settings
  INSERT INTO company_settings (company_id)
  VALUES (v_company_id);

  -- Create notification preferences
  INSERT INTO notification_preferences (user_id)
  VALUES (p_user_id);

  -- Return success with company info
  RETURN jsonb_build_object(
    'success', true,
    'company_id', v_company_id,
    'user_id', p_user_id
  );

EXCEPTION WHEN OTHERS THEN
  -- Return error
  RETURN jsonb_build_object(
    'success', false,
    'error', SQLERRM
  );
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION complete_user_signup TO authenticated;