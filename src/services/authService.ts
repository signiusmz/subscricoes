import { supabase } from '../lib/supabase';

export interface RegisterData {
  email: string;
  password: string;
  fullName: string;
  companyName: string;
  phone?: string;
  plan?: 'start' | 'pro' | 'premium';
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export const authService = {
  async register(data: RegisterData) {
    const { email, password, fullName, companyName, phone, plan = 'start' } = data;

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error('Failed to create user');

    const trialEndsAt = new Date();
    trialEndsAt.setDate(trialEndsAt.getDate() + 14);

    const { data: company, error: companyError } = await supabase
      .from('companies')
      .insert({
        name: companyName,
        email,
        phone,
        plan,
        status: 'trial',
        trial_ends_at: trialEndsAt.toISOString(),
      })
      .select()
      .single();

    if (companyError) throw companyError;

    const { error: userError } = await supabase.from('users').insert({
      id: authData.user.id,
      company_id: company.id,
      email,
      full_name: fullName,
      role: 'admin',
      is_active: true,
    });

    if (userError) throw userError;

    const { error: settingsError } = await supabase.from('company_settings').insert({
      company_id: company.id,
    });

    if (settingsError) throw settingsError;

    const { error: preferencesError } = await supabase
      .from('notification_preferences')
      .insert({
        user_id: authData.user.id,
      });

    if (preferencesError) throw preferencesError;

    return { user: authData.user, company };
  },

  async login(credentials: LoginCredentials) {
    const { email, password } = credentials;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*, companies(*)')
      .eq('id', data.user.id)
      .single();

    if (userError) throw userError;

    await supabase
      .from('users')
      .update({ last_login: new Date().toISOString() })
      .eq('id', data.user.id);

    return { user: data.user, userData };
  },

  async logout() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getCurrentUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return null;

    const { data: userData, error } = await supabase
      .from('users')
      .select('*, companies(*)')
      .eq('id', user.id)
      .single();

    if (error) return null;

    return { user, userData };
  },

  async resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) throw error;
  },

  async updatePassword(newPassword: string) {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) throw error;
  },

  onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange((event, session) => {
      callback(event, session);
    });
  },
};
