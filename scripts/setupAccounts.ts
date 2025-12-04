import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function setupAccounts() {
  console.log('🚀 Setting up admin accounts...\n');

  const accounts = [
    {
      email: 'admin@dzumuka.com',
      password: 'Admin123!@#',
      fullName: 'Super Administrador',
      companyName: 'DZUMUKA Admin',
      role: 'super_admin',
      isSuperAdmin: true,
      plan: 'premium',
    },
    {
      email: 'admin@empresa.com',
      password: 'Admin123!@#',
      fullName: 'Administrador da Empresa',
      companyName: 'Empresa Demo',
      companyPhone: '+258 84 000 0000',
      companyAddress: 'Av. Julius Nyerere, 1234',
      companyCity: 'Maputo',
      companyTaxId: '400000000',
      role: 'admin',
      isSuperAdmin: false,
      plan: 'pro',
    },
  ];

  for (const account of accounts) {
    console.log(`📝 Setting up ${account.email}...`);

    try {
      // Login to get user ID
      const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
        email: account.email,
        password: account.password,
      });

      if (loginError) {
        console.log(`⚠️  Cannot login: ${loginError.message}`);
        console.log(`   Skipping ${account.email}\n`);
        continue;
      }

      const userId = loginData.user.id;

      // Check if already setup
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('id', userId)
        .maybeSingle();

      if (existingUser) {
        console.log(`✓ ${account.email} already setup\n`);
        await supabase.auth.signOut();
        continue;
      }

      // Call the signup completion function
      const { data: result, error: fnError } = await supabase.rpc('complete_user_signup', {
        p_user_id: userId,
        p_email: account.email,
        p_full_name: account.fullName,
        p_company_name: account.companyName,
        p_company_email: account.email,
        p_company_phone: account.companyPhone || null,
        p_company_address: account.companyAddress || null,
        p_company_city: account.companyCity || null,
        p_company_country: 'Mozambique',
        p_company_tax_id: account.companyTaxId || null,
        p_plan: account.plan,
        p_role: account.role,
        p_is_super_admin: account.isSuperAdmin,
      });

      if (fnError) {
        console.error(`❌ Error: ${fnError.message}\n`);
        await supabase.auth.signOut();
        continue;
      }

      if (result && !result.success) {
        console.error(`❌ Setup failed: ${result.error}\n`);
        await supabase.auth.signOut();
        continue;
      }

      console.log(`✅ ${account.email} setup complete!`);
      console.log(`   Company ID: ${result.company_id}`);
      console.log(`   User ID: ${result.user_id}\n`);

      await supabase.auth.signOut();
    } catch (error: any) {
      console.error(`❌ Unexpected error: ${error.message}\n`);
    }
  }

  console.log('✨ Setup complete!\n');
  console.log('📋 Login Credentials:');
  console.log('─────────────────────────────────────────');
  console.log('🔐 Super Admin:');
  console.log('   Email: admin@dzumuka.com');
  console.log('   Password: Admin123!@#');
  console.log('   Access: Login normalmente ou use "Super Admin"');
  console.log('');
  console.log('🔐 Admin Regular:');
  console.log('   Email: admin@empresa.com');
  console.log('   Password: Admin123!@#');
  console.log('   Access: Login normal');
  console.log('─────────────────────────────────────────\n');
}

setupAccounts().catch(console.error).finally(() => process.exit(0));
