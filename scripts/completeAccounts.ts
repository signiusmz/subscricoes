import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function completeAccounts() {
  console.log('🔧 Completing account setup...\n');

  // Login as super admin to complete setup
  const accounts = [
    {
      email: 'admin@dzumuka.com',
      password: 'Admin123!@#',
      companyName: 'DZUMUKA Admin',
      fullName: 'Super Administrador',
      role: 'super_admin',
      isSuperAdmin: true,
      plan: 'premium',
      status: 'active',
    },
    {
      email: 'admin@empresa.com',
      password: 'Admin123!@#',
      companyName: 'Empresa Demo',
      fullName: 'Administrador da Empresa',
      role: 'admin',
      isSuperAdmin: false,
      plan: 'pro',
      status: 'trial',
    },
  ];

  for (const account of accounts) {
    console.log(`📝 Processing ${account.email}...`);

    try {
      // Try to login
      const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
        email: account.email,
        password: account.password,
      });

      if (loginError) {
        console.log(`⚠️  Cannot login, account may not exist: ${loginError.message}`);
        continue;
      }

      const userId = loginData.user.id;
      console.log(`✓ Logged in as ${account.email}`);

      // Check if user already exists in users table
      const { data: existingUser } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (existingUser) {
        console.log(`✓ User record already exists for ${account.email}`);
        await supabase.auth.signOut();
        continue;
      }

      // Create company
      const trialEndsAt = new Date();
      trialEndsAt.setDate(trialEndsAt.getDate() + 14);

      const { data: company, error: companyError } = await supabase
        .from('companies')
        .insert({
          name: account.companyName,
          email: account.email,
          phone: account.email === 'admin@empresa.com' ? '+258 84 000 0000' : null,
          address: account.email === 'admin@empresa.com' ? 'Av. Julius Nyerere, 1234' : null,
          city: account.email === 'admin@empresa.com' ? 'Maputo' : null,
          country: 'Mozambique',
          tax_id: account.email === 'admin@empresa.com' ? '400000000' : null,
          plan: account.plan,
          status: account.status,
          is_super_admin: account.isSuperAdmin,
          trial_ends_at: account.status === 'trial' ? trialEndsAt.toISOString() : null,
        })
        .select()
        .single();

      if (companyError) {
        console.error(`❌ Error creating company: ${companyError.message}`);
        await supabase.auth.signOut();
        continue;
      }

      console.log(`✓ Company created: ${company.name}`);

      // Create user record
      const { error: userError } = await supabase.from('users').insert({
        id: userId,
        company_id: company.id,
        email: account.email,
        full_name: account.fullName,
        role: account.role,
        is_active: true,
      });

      if (userError) {
        console.error(`❌ Error creating user: ${userError.message}`);
        await supabase.auth.signOut();
        continue;
      }

      console.log(`✓ User record created`);

      // Create company settings
      const { error: settingsError } = await supabase.from('company_settings').insert({
        company_id: company.id,
      });

      if (settingsError) {
        console.error(`❌ Error creating settings: ${settingsError.message}`);
      } else {
        console.log(`✓ Company settings created`);
      }

      // Create notification preferences
      const { error: prefsError } = await supabase.from('notification_preferences').insert({
        user_id: userId,
      });

      if (prefsError) {
        console.error(`❌ Error creating preferences: ${prefsError.message}`);
      } else {
        console.log(`✓ Notification preferences created`);
      }

      console.log(`✅ ${account.email} setup complete!\n`);

      // Logout
      await supabase.auth.signOut();
    } catch (error: any) {
      console.error(`❌ Error processing ${account.email}:`, error.message);
    }
  }

  console.log('\n✨ All accounts processed!');
  console.log('\n📋 Login Credentials:');
  console.log('─────────────────────────────────────────');
  console.log('🔐 Super Admin:');
  console.log('   Email: admin@dzumuka.com');
  console.log('   Password: Admin123!@#');
  console.log('   Access: Use "Super Admin" login option');
  console.log('');
  console.log('🔐 Regular Admin:');
  console.log('   Email: admin@empresa.com');
  console.log('   Password: Admin123!@#');
  console.log('   Access: Use normal login');
  console.log('─────────────────────────────────────────\n');
}

completeAccounts().catch(console.error).finally(() => process.exit(0));
