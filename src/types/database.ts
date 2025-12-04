export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          company_id: string | null
          email: string
          full_name: string
          role: 'admin' | 'staff' | 'super_admin'
          is_active: boolean
          last_login: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          company_id?: string | null
          email: string
          full_name: string
          role?: 'admin' | 'staff' | 'super_admin'
          is_active?: boolean
          last_login?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company_id?: string | null
          email?: string
          full_name?: string
          role?: 'admin' | 'staff' | 'super_admin'
          is_active?: boolean
          last_login?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      companies: {
        Row: {
          id: string
          name: string
          email: string | null
          phone: string | null
          address: string | null
          city: string | null
          country: string
          tax_id: string | null
          logo_url: string | null
          plan: 'start' | 'pro' | 'premium'
          status: 'trial' | 'active' | 'suspended' | 'cancelled'
          trial_ends_at: string | null
          subscription_starts_at: string | null
          subscription_ends_at: string | null
          monthly_payment: number | null
          is_super_admin: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email?: string | null
          phone?: string | null
          address?: string | null
          city?: string | null
          country?: string
          tax_id?: string | null
          logo_url?: string | null
          plan?: 'start' | 'pro' | 'premium'
          status?: 'trial' | 'active' | 'suspended' | 'cancelled'
          trial_ends_at?: string | null
          subscription_starts_at?: string | null
          subscription_ends_at?: string | null
          monthly_payment?: number | null
          is_super_admin?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string | null
          phone?: string | null
          address?: string | null
          city?: string | null
          country?: string
          tax_id?: string | null
          logo_url?: string | null
          plan?: 'start' | 'pro' | 'premium'
          status?: 'trial' | 'active' | 'suspended' | 'cancelled'
          trial_ends_at?: string | null
          subscription_starts_at?: string | null
          subscription_ends_at?: string | null
          monthly_payment?: number | null
          is_super_admin?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      company_settings: {
        Row: {
          id: string
          company_id: string
          currency: string
          timezone: string
          date_format: string
          fiscal_year_start: string
          invoice_prefix: string
          invoice_number_start: number
          tax_rate: number
          tax_included: boolean
          auto_send_invoices: boolean
          auto_send_reminders: boolean
          reminder_days_before: number
          late_payment_fee_percentage: number
          grace_period_days: number
          branding_color: string
          email_signature: string | null
          terms_and_conditions: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          company_id: string
          currency?: string
          timezone?: string
          date_format?: string
          fiscal_year_start?: string
          invoice_prefix?: string
          invoice_number_start?: number
          tax_rate?: number
          tax_included?: boolean
          auto_send_invoices?: boolean
          auto_send_reminders?: boolean
          reminder_days_before?: number
          late_payment_fee_percentage?: number
          grace_period_days?: number
          branding_color?: string
          email_signature?: string | null
          terms_and_conditions?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company_id?: string
          currency?: string
          timezone?: string
          date_format?: string
          fiscal_year_start?: string
          invoice_prefix?: string
          invoice_number_start?: number
          tax_rate?: number
          tax_included?: boolean
          auto_send_invoices?: boolean
          auto_send_reminders?: boolean
          reminder_days_before?: number
          late_payment_fee_percentage?: number
          grace_period_days?: number
          branding_color?: string
          email_signature?: string | null
          terms_and_conditions?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      clients: {
        Row: {
          id: string
          company_id: string | null
          user_id: string
          name: string
          email: string
          phone: string
          address: string | null
          city: string | null
          country: string | null
          status: string
          segment: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          company_id?: string | null
          user_id: string
          name: string
          email: string
          phone: string
          address?: string | null
          city?: string | null
          country?: string | null
          status?: string
          segment?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company_id?: string | null
          user_id?: string
          name?: string
          email?: string
          phone?: string
          address?: string | null
          city?: string | null
          country?: string | null
          status?: string
          segment?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      services: {
        Row: {
          id: string
          company_id: string | null
          user_id: string
          name: string
          description: string | null
          price: number
          billing_type: string
          category: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          company_id?: string | null
          user_id: string
          name: string
          description?: string | null
          price: number
          billing_type: string
          category?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company_id?: string | null
          user_id?: string
          name?: string
          description?: string | null
          price?: number
          billing_type?: string
          category?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      subscriptions: {
        Row: {
          id: string
          client_id: string
          service_id: string
          status: string
          start_date: string
          end_date: string | null
          next_billing_date: string | null
          auto_renew: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          client_id: string
          service_id: string
          status?: string
          start_date: string
          end_date?: string | null
          next_billing_date?: string | null
          auto_renew?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          client_id?: string
          service_id?: string
          status?: string
          start_date?: string
          end_date?: string | null
          next_billing_date?: string | null
          auto_renew?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      invoices: {
        Row: {
          id: string
          company_id: string | null
          client_id: string
          user_id: string
          invoice_number: string
          amount: number
          tax_amount: number
          total_amount: number
          status: string
          due_date: string
          paid_date: string | null
          payment_method: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          company_id?: string | null
          client_id: string
          user_id: string
          invoice_number: string
          amount: number
          tax_amount?: number
          total_amount: number
          status?: string
          due_date: string
          paid_date?: string | null
          payment_method?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company_id?: string | null
          client_id?: string
          user_id?: string
          invoice_number?: string
          amount?: number
          tax_amount?: number
          total_amount?: number
          status?: string
          due_date?: string
          paid_date?: string | null
          payment_method?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      payments: {
        Row: {
          id: string
          invoice_id: string
          amount: number
          payment_method: string
          transaction_id: string | null
          status: string
          payment_date: string
          created_at: string
        }
        Insert: {
          id?: string
          invoice_id: string
          amount: number
          payment_method: string
          transaction_id?: string | null
          status?: string
          payment_date?: string
          created_at?: string
        }
        Update: {
          id?: string
          invoice_id?: string
          amount?: number
          payment_method?: string
          transaction_id?: string | null
          status?: string
          payment_date?: string
          created_at?: string
        }
      }
      activity_logs: {
        Row: {
          id: string
          company_id: string | null
          user_id: string | null
          entity_type: string
          entity_id: string
          action: string
          details: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          company_id?: string | null
          user_id?: string | null
          entity_type: string
          entity_id: string
          action: string
          details?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          company_id?: string | null
          user_id?: string | null
          entity_type?: string
          entity_id?: string
          action?: string
          details?: Json | null
          created_at?: string
        }
      }
      automation_flows: {
        Row: {
          id: string
          company_id: string
          name: string
          description: string | null
          trigger_type: string
          is_active: boolean
          flow_data: Json
          execution_count: number
          last_executed_at: string | null
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          company_id: string
          name: string
          description?: string | null
          trigger_type: string
          is_active?: boolean
          flow_data?: Json
          execution_count?: number
          last_executed_at?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company_id?: string
          name?: string
          description?: string | null
          trigger_type?: string
          is_active?: boolean
          flow_data?: Json
          execution_count?: number
          last_executed_at?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      automation_flow_executions: {
        Row: {
          id: string
          flow_id: string
          company_id: string
          trigger_data: Json
          status: string
          execution_log: Json
          error_message: string | null
          started_at: string
          completed_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          flow_id: string
          company_id: string
          trigger_data?: Json
          status?: string
          execution_log?: Json
          error_message?: string | null
          started_at?: string
          completed_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          flow_id?: string
          company_id?: string
          trigger_data?: Json
          status?: string
          execution_log?: Json
          error_message?: string | null
          started_at?: string
          completed_at?: string | null
          created_at?: string
        }
      }
      communication_templates: {
        Row: {
          id: string
          company_id: string
          name: string
          type: 'email' | 'sms' | 'whatsapp'
          category: string | null
          subject: string | null
          body: string
          variables: Json
          is_default: boolean
          is_active: boolean
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          company_id: string
          name: string
          type: 'email' | 'sms' | 'whatsapp'
          category?: string | null
          subject?: string | null
          body: string
          variables?: Json
          is_default?: boolean
          is_active?: boolean
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company_id?: string
          name?: string
          type?: 'email' | 'sms' | 'whatsapp'
          category?: string | null
          subject?: string | null
          body?: string
          variables?: Json
          is_default?: boolean
          is_active?: boolean
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      communication_logs: {
        Row: {
          id: string
          company_id: string
          client_id: string | null
          template_id: string | null
          type: 'email' | 'sms' | 'whatsapp'
          recipient: string
          subject: string | null
          body: string | null
          status: string
          error_message: string | null
          metadata: Json
          sent_at: string | null
          delivered_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          company_id: string
          client_id?: string | null
          template_id?: string | null
          type: 'email' | 'sms' | 'whatsapp'
          recipient: string
          subject?: string | null
          body?: string | null
          status?: string
          error_message?: string | null
          metadata?: Json
          sent_at?: string | null
          delivered_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          company_id?: string
          client_id?: string | null
          template_id?: string | null
          type?: 'email' | 'sms' | 'whatsapp'
          recipient?: string
          subject?: string | null
          body?: string | null
          status?: string
          error_message?: string | null
          metadata?: Json
          sent_at?: string | null
          delivered_at?: string | null
          created_at?: string
        }
      }
      notification_preferences: {
        Row: {
          id: string
          user_id: string
          email_notifications: boolean
          sms_notifications: boolean
          whatsapp_notifications: boolean
          invoice_created: boolean
          payment_received: boolean
          payment_failed: boolean
          subscription_expiring: boolean
          subscription_renewed: boolean
          new_client: boolean
          daily_summary: boolean
          weekly_report: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          email_notifications?: boolean
          sms_notifications?: boolean
          whatsapp_notifications?: boolean
          invoice_created?: boolean
          payment_received?: boolean
          payment_failed?: boolean
          subscription_expiring?: boolean
          subscription_renewed?: boolean
          new_client?: boolean
          daily_summary?: boolean
          weekly_report?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          email_notifications?: boolean
          sms_notifications?: boolean
          whatsapp_notifications?: boolean
          invoice_created?: boolean
          payment_received?: boolean
          payment_failed?: boolean
          subscription_expiring?: boolean
          subscription_renewed?: boolean
          new_client?: boolean
          daily_summary?: boolean
          weekly_report?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      tags: {
        Row: {
          id: string
          company_id: string
          name: string
          color: string
          created_at: string
        }
        Insert: {
          id?: string
          company_id: string
          name: string
          color?: string
          created_at?: string
        }
        Update: {
          id?: string
          company_id?: string
          name?: string
          color?: string
          created_at?: string
        }
      }
      entity_tags: {
        Row: {
          id: string
          tag_id: string
          entity_type: string
          entity_id: string
          created_at: string
        }
        Insert: {
          id?: string
          tag_id: string
          entity_type: string
          entity_id: string
          created_at?: string
        }
        Update: {
          id?: string
          tag_id?: string
          entity_type?: string
          entity_id?: string
          created_at?: string
        }
      }
      custom_fields: {
        Row: {
          id: string
          company_id: string
          entity_type: string
          field_name: string
          field_type: string
          field_options: Json
          is_required: boolean
          display_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          company_id: string
          entity_type: string
          field_name: string
          field_type: string
          field_options?: Json
          is_required?: boolean
          display_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company_id?: string
          entity_type?: string
          field_name?: string
          field_type?: string
          field_options?: Json
          is_required?: boolean
          display_order?: number
          created_at?: string
          updated_at?: string
        }
      }
      custom_field_values: {
        Row: {
          id: string
          custom_field_id: string
          entity_id: string
          value: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          custom_field_id: string
          entity_id: string
          value?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          custom_field_id?: string
          entity_id?: string
          value?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      file_attachments: {
        Row: {
          id: string
          company_id: string
          entity_type: string
          entity_id: string
          file_name: string
          file_type: string | null
          file_size: number | null
          storage_path: string
          uploaded_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          company_id: string
          entity_type: string
          entity_id: string
          file_name: string
          file_type?: string | null
          file_size?: number | null
          storage_path: string
          uploaded_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          company_id?: string
          entity_type?: string
          entity_id?: string
          file_name?: string
          file_type?: string | null
          file_size?: number | null
          storage_path?: string
          uploaded_by?: string | null
          created_at?: string
        }
      }
      contracts: {
        Row: {
          id: string
          company_id: string
          client_id: string
          subscription_id: string | null
          title: string
          content: string
          status: string
          contract_date: string | null
          start_date: string | null
          end_date: string | null
          value: number | null
          pdf_url: string | null
          signature_data: Json
          signed_at: string | null
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          company_id: string
          client_id: string
          subscription_id?: string | null
          title: string
          content: string
          status?: string
          contract_date?: string | null
          start_date?: string | null
          end_date?: string | null
          value?: number | null
          pdf_url?: string | null
          signature_data?: Json
          signed_at?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company_id?: string
          client_id?: string
          subscription_id?: string | null
          title?: string
          content?: string
          status?: string
          contract_date?: string | null
          start_date?: string | null
          end_date?: string | null
          value?: number | null
          pdf_url?: string | null
          signature_data?: Json
          signed_at?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      client_portal_sessions: {
        Row: {
          id: string
          client_id: string
          token: string
          expires_at: string
          created_at: string
        }
        Insert: {
          id?: string
          client_id: string
          token: string
          expires_at: string
          created_at?: string
        }
        Update: {
          id?: string
          client_id?: string
          token?: string
          expires_at?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
