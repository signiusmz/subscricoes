import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing environment variables!');
  console.error('Make sure .env file contains VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function createInitialAccounts() {
  console.log('🚀 Creating initial accounts...\n');

  // 1. Create Super Admin
  console.log('📝 Creating Super Admin account...');
  try {
    const { data: superAdminAuth, error: superAdminAuthError } = await supabase.auth.signUp({
      email: 'admin@dzumuka.com',
      password: 'Admin123!@#',
      options: {
        data: {
          full_name: 'Super Administrador',
        },
      },
    });

    if (superAdminAuthError) {
      if (superAdminAuthError.message.includes('already registered')) {
        console.log('⚠️  Super admin email already registered, skipping...');
      } else {
        throw superAdminAuthError;
      }
    } else if (superAdminAuth.user) {
      // Create super admin company
      const { data: superCompany, error: superCompanyError } = await supabase
        .from('companies')
        .insert({
          name: 'DZUMUKA Admin',
          email: 'admin@dzumuka.com',
          plan: 'premium',
          status: 'active',
          is_super_admin: true,
        })
        .select()
        .single();

      if (superCompanyError) throw superCompanyError;

      // Create super admin user
      const { error: superUserError } = await supabase.from('users').insert({
        id: superAdminAuth.user.id,
        company_id: superCompany.id,
        email: 'admin@dzumuka.com',
        full_name: 'Super Administrador',
        role: 'super_admin',
        is_active: true,
      });

      if (superUserError) throw superUserError;

      // Create company settings
      await supabase.from('company_settings').insert({
        company_id: superCompany.id,
      });

      // Create notification preferences
      await supabase.from('notification_preferences').insert({
        user_id: superAdminAuth.user.id,
      });

      console.log('✅ Super Admin created successfully!');
      console.log('   Email: admin@dzumuka.com');
      console.log('   Password: Admin123!@#\n');
    }
  } catch (error: any) {
    console.error('❌ Error creating super admin:', error.message);
  }

  // 2. Create Regular Admin Company
  console.log('📝 Creating Regular Admin account...');
  try {
    const { data: adminAuth, error: adminAuthError } = await supabase.auth.signUp({
      email: 'admin@empresa.com',
      password: 'Admin123!@#',
      options: {
        data: {
          full_name: 'Administrador da Empresa',
        },
      },
    });

    if (adminAuthError) {
      if (adminAuthError.message.includes('already registered')) {
        console.log('⚠️  Admin email already registered, skipping...');
      } else {
        throw adminAuthError;
      }
    } else if (adminAuth.user) {
      const trialEndsAt = new Date();
      trialEndsAt.setDate(trialEndsAt.getDate() + 14);

      // Create company
      const { data: company, error: companyError } = await supabase
        .from('companies')
        .insert({
          name: 'Empresa Demo',
          email: 'admin@empresa.com',
          phone: '+258 84 000 0000',
          address: 'Av. Julius Nyerere, 1234',
          city: 'Maputo',
          country: 'Mozambique',
          tax_id: '400000000',
          plan: 'pro',
          status: 'trial',
          trial_ends_at: trialEndsAt.toISOString(),
        })
        .select()
        .single();

      if (companyError) throw companyError;

      // Create admin user
      const { error: userError } = await supabase.from('users').insert({
        id: adminAuth.user.id,
        company_id: company.id,
        email: 'admin@empresa.com',
        full_name: 'Administrador da Empresa',
        role: 'admin',
        is_active: true,
      });

      if (userError) throw userError;

      // Create company settings
      await supabase.from('company_settings').insert({
        company_id: company.id,
      });

      // Create notification preferences
      await supabase.from('notification_preferences').insert({
        user_id: adminAuth.user.id,
      });

      console.log('✅ Regular Admin created successfully!');
      console.log('   Email: admin@empresa.com');
      console.log('   Password: Admin123!@#\n');
    }
  } catch (error: any) {
    console.error('❌ Error creating regular admin:', error.message);
  }

  console.log('✨ Setup complete!');
  console.log('\n📋 Summary:');
  console.log('─────────────────────────────────────────');
  console.log('Super Admin:');
  console.log('  Email: admin@dzumuka.com');
  console.log('  Password: Admin123!@#');
  console.log('  Access: Super Admin Dashboard');
  console.log('');
  console.log('Regular Admin:');
  console.log('  Email: admin@empresa.com');
  console.log('  Password: Admin123!@#');
  console.log('  Access: Regular Dashboard');
  console.log('─────────────────────────────────────────\n');
}

createInitialAccounts().catch(console.error);
