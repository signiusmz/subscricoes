# DZUMUKA - Platform Setup Guide

## Overview
DZUMUKA is now fully integrated with Supabase for authentication, database operations, and file storage.

## What Has Been Implemented

### ✅ Database
- All core tables created (companies, users, clients, services, subscriptions, invoices, payments)
- Additional tables for automation, communication, settings, and file management
- Row Level Security (RLS) policies configured for multi-tenant isolation
- Proper indexes and triggers for updated_at fields

### ✅ Authentication
- Real Supabase Auth integration (email/password)
- Registration with automatic company and settings creation
- Login with automatic session management
- Logout functionality
- Password reset capability
- Auth state persistence

### ✅ Services Layer
- `authService` - Authentication operations
- `clientService` - Client CRUD and stats
- `serviceService` - Service management
- `subscriptionService` - Subscription management
- `invoiceService` - Invoice and billing operations
- `paymentService` - Payment tracking
- `userService` - User management
- `companyService` - Company and settings management
- `automationService` - Automation flows
- `storageService` - File upload/download with Supabase Storage
- `activityService` - Activity logging

### ✅ Custom Hooks
- `useClients` - Manage clients with real-time data
- `useServices` - Service management
- `useInvoices` - Invoice operations
- `useDashboard` - Dashboard aggregated stats

### ✅ Multi-Tenancy
- Company-based data isolation
- RLS policies ensure users only see their company's data
- Super admin can view all companies

### ✅ File Storage
- Supabase Storage buckets configured:
  - `invoices` - Invoice PDFs
  - `contracts` - Digital contracts
  - `client-documents` - Client files
  - `reports` - Generated reports
  - `avatars` - User/company avatars
- File attachment tracking in database

## Getting Started

### 1. First Time Setup

The database is already provisioned and all migrations have been applied.

### 2. Create Your First Account

**Option A: Regular User Registration**
1. Go to the landing page
2. Click "Começar Agora" or "Experimentar Grátis"
3. Fill in the registration form:
   - Company name
   - Your name
   - Email
   - Password
   - Phone (optional)
   - Choose a plan (Start, Pro, or Premium)
4. Click "Criar Conta"
5. You'll be automatically logged in with a 14-day trial

**Option B: Create Super Admin (Direct Database)**
If you need a super admin account, create it directly using Supabase:

```sql
-- First, create the auth user via Supabase Dashboard Auth section
-- Then run this to create the super admin company and user:

-- Create super admin company
INSERT INTO companies (name, email, plan, status, is_super_admin)
VALUES ('DZUMUKA Admin', 'admin@dzumuka.com', 'premium', 'active', true)
RETURNING id;

-- Use the returned company ID in the next query
INSERT INTO users (id, company_id, email, full_name, role, is_active)
VALUES (
  'YOUR_AUTH_USER_ID', -- Get this from Supabase Auth dashboard
  'COMPANY_ID_FROM_ABOVE',
  'admin@dzumuka.com',
  'Super Administrator',
  'super_admin',
  true
);

INSERT INTO company_settings (company_id)
VALUES ('COMPANY_ID_FROM_ABOVE');
```

### 3. Using the Platform

**As Regular User:**
- Dashboard shows real-time stats from your company's data
- All CRUD operations persist to database
- Files can be uploaded to appropriate storage buckets
- Activity is logged automatically

**As Super Admin:**
- Access Super Admin dashboard via login form
- View and manage all companies
- Monitor system-wide statistics
- Manage company subscriptions and payments

## What Still Uses Mock Data

While the backend infrastructure is complete, some components still render mock data in the UI. To make these components use real data:

1. Import the appropriate hook (e.g., `useClients`, `useServices`)
2. Replace mock data arrays with data from the hook
3. Replace mock CRUD functions with hook functions

Example transformation:
```typescript
// Before (mock)
const [clients, setClients] = useState(mockClients);
const handleAdd = (client) => setClients([...clients, client]);

// After (real data)
const { clients, loading, createClient } = useClients();
const handleAdd = async (clientData) => {
  await createClient(clientData);
  // Data refreshes automatically
};
```

## Features NOT Implemented (As Requested)

### ❌ Payment Processing
- M-Pesa integration code exists but is not connected
- Payment webhooks not configured
- To implement: Connect M-Pesa service and create webhook Edge Function

### ❌ Email / SMTP
- Email templates database tables exist
- Email service not implemented
- To implement: Add Resend/SendGrid integration to send emails

### ❌ WhatsApp / SMS
- Database tables for communication logs exist
- No actual integration
- To implement: Add WhatsApp Business API and SMS gateway

## Environment Variables

Your `.env` file is already configured with:
```
VITE_SUPABASE_URL=https://crpzjcumxqbjfqrxlrob.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## Database Schema

### Core Tables
- `companies` - Tenants/organizations
- `company_settings` - Per-company configuration
- `users` - System users with roles
- `clients` - Customer records
- `services` - Service offerings
- `subscriptions` - Client-service subscriptions
- `invoices` - Billing documents
- `payments` - Payment tracking

### Additional Tables
- `automation_flows` - Workflow definitions
- `automation_flow_executions` - Execution history
- `communication_templates` - Email/SMS templates
- `communication_logs` - Message delivery tracking
- `notification_preferences` - User notification settings
- `tags` - Generic tagging system
- `entity_tags` - Tag assignments
- `custom_fields` - Custom field definitions
- `custom_field_values` - Custom field data
- `file_attachments` - File metadata
- `contracts` - Digital contracts
- `activity_logs` - System activity audit trail

## Security

- All tables have Row Level Security (RLS) enabled
- Users can only access their company's data
- Super admins have special policies to view all data
- File storage uses RLS for access control
- Authentication handled by Supabase Auth
- No passwords stored in application tables

## Next Steps

1. **Test Registration**: Create a test account to verify auth flow
2. **Update Components**: Gradually migrate components from mock to real data using hooks
3. **Add Automation**: Implement automation flow execution engine
4. **Enhance Analytics**: Connect analytics components to real data
5. **Implement Payments** (when ready): Connect M-Pesa and create webhook
6. **Add Communication** (when ready): Integrate email/SMS/WhatsApp services

## Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run linter
npm run lint
```

## Support

For questions or issues:
- Check Supabase dashboard for database/auth issues
- Review browser console for client-side errors
- Check service functions for backend logic
- Review RLS policies if data access issues occur

---

**Platform Status**: Backend infrastructure complete, ready for frontend integration
