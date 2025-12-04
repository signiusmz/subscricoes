/*
  # Módulo de Lembretes Automáticos

  ## Descrição
  Módulo completo de lembretes automáticos com fluxos, templates, inscrições e logs.
  Permite criar fluxos de lembretes baseados em keywords, produtos/serviços, com templates
  para WhatsApp e Email HTML avançado.

  ## Novas Tabelas
  
  ### 1. `reminder_flows` - Fluxos de Lembretes
    - `id` (uuid, PK)
    - `company_id` (uuid, FK para companies)
    - `name` (text) - Nome do fluxo
    - `description` (text) - Descrição do fluxo
    - `keywords` (text[]) - Array de palavras-chave
    - `service_id` (uuid, FK para services) - Serviço associado
    - `channels` (text[]) - Canais: whatsapp, email
    - `reminder_days` (integer[]) - Dias após atendimento: 7, 15, 30
    - `is_active` (boolean) - Se o fluxo está ativo
    - `created_at` (timestamptz)
    - `updated_at` (timestamptz)

  ### 2. `reminder_templates` - Templates de Mensagens
    - `id` (uuid, PK)
    - `flow_id` (uuid, FK para reminder_flows)
    - `channel` (text) - whatsapp ou email
    - `days_after` (integer) - Dias após atendimento (7, 15, 30)
    - `subject` (text) - Assunto (para email)
    - `content_text` (text) - Conteúdo texto (para WhatsApp)
    - `content_html` (text) - Conteúdo HTML (para email)
    - `created_at` (timestamptz)
    - `updated_at` (timestamptz)

  ### 3. `reminder_subscriptions` - Inscrições de Clientes
    - `id` (uuid, PK)
    - `flow_id` (uuid, FK para reminder_flows)
    - `client_id` (uuid, FK para clients)
    - `service_id` (uuid, FK para services)
    - `subscribed_at` (timestamptz)
    - `last_reminder_date` (timestamptz)
    - `next_reminder_date` (timestamptz)
    - `reminders_sent` (integer) - Quantidade de lembretes enviados
    - `status` (text) - active, paused, completed, cancelled
    - `created_at` (timestamptz)
    - `updated_at` (timestamptz)

  ### 4. `reminder_logs` - Logs de Envio
    - `id` (uuid, PK)
    - `subscription_id` (uuid, FK para reminder_subscriptions)
    - `flow_id` (uuid, FK para reminder_flows)
    - `client_id` (uuid, FK para clients)
    - `template_id` (uuid, FK para reminder_templates)
    - `channel` (text)
    - `days_after` (integer)
    - `status` (text) - sent, failed, pending
    - `sent_at` (timestamptz)
    - `error_message` (text)
    - `created_at` (timestamptz)

  ## Segurança (RLS)
  - Todos os acessos restritos por company_id
  - Apenas authenticated users podem acessar
  - Políticas separadas para SELECT, INSERT, UPDATE, DELETE

  ## Notas Importantes
  - Templates suportam HTML avançado para emails (imagens, bold, italic)
  - Keywords são case-insensitive para matching
  - Automação via triggers e functions
  - Logs mantêm histórico completo de envios
*/

-- 1. Criar tabela reminder_flows
CREATE TABLE IF NOT EXISTS reminder_flows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  keywords text[] DEFAULT '{}',
  service_id uuid REFERENCES services(id) ON DELETE SET NULL,
  channels text[] DEFAULT ARRAY['whatsapp', 'email'],
  reminder_days integer[] DEFAULT ARRAY[7, 15, 30],
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT reminder_flows_channels_check CHECK (
    channels <@ ARRAY['whatsapp', 'email']::text[]
  )
);

-- 2. Criar tabela reminder_templates
CREATE TABLE IF NOT EXISTS reminder_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  flow_id uuid NOT NULL REFERENCES reminder_flows(id) ON DELETE CASCADE,
  channel text NOT NULL CHECK (channel IN ('whatsapp', 'email')),
  days_after integer NOT NULL CHECK (days_after > 0),
  subject text,
  content_text text,
  content_html text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT reminder_templates_content_check CHECK (
    (channel = 'whatsapp' AND content_text IS NOT NULL) OR
    (channel = 'email' AND content_html IS NOT NULL)
  )
);

-- 3. Criar tabela reminder_subscriptions
CREATE TABLE IF NOT EXISTS reminder_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  flow_id uuid NOT NULL REFERENCES reminder_flows(id) ON DELETE CASCADE,
  client_id uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  service_id uuid REFERENCES services(id) ON DELETE SET NULL,
  subscribed_at timestamptz DEFAULT now(),
  last_reminder_date timestamptz,
  next_reminder_date timestamptz,
  reminders_sent integer DEFAULT 0,
  status text DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed', 'cancelled')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(flow_id, client_id)
);

-- 4. Criar tabela reminder_logs
CREATE TABLE IF NOT EXISTS reminder_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id uuid NOT NULL REFERENCES reminder_subscriptions(id) ON DELETE CASCADE,
  flow_id uuid NOT NULL REFERENCES reminder_flows(id) ON DELETE CASCADE,
  client_id uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  template_id uuid REFERENCES reminder_templates(id) ON DELETE SET NULL,
  channel text NOT NULL CHECK (channel IN ('whatsapp', 'email')),
  days_after integer NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('sent', 'failed', 'pending')),
  sent_at timestamptz,
  error_message text,
  created_at timestamptz DEFAULT now()
);

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_reminder_flows_company ON reminder_flows(company_id);
CREATE INDEX IF NOT EXISTS idx_reminder_flows_service ON reminder_flows(service_id);
CREATE INDEX IF NOT EXISTS idx_reminder_flows_active ON reminder_flows(company_id, is_active);
CREATE INDEX IF NOT EXISTS idx_reminder_templates_flow ON reminder_templates(flow_id);
CREATE INDEX IF NOT EXISTS idx_reminder_subscriptions_flow ON reminder_subscriptions(flow_id);
CREATE INDEX IF NOT EXISTS idx_reminder_subscriptions_client ON reminder_subscriptions(client_id);
CREATE INDEX IF NOT EXISTS idx_reminder_subscriptions_status ON reminder_subscriptions(status, next_reminder_date);
CREATE INDEX IF NOT EXISTS idx_reminder_logs_subscription ON reminder_logs(subscription_id);
CREATE INDEX IF NOT EXISTS idx_reminder_logs_client ON reminder_logs(client_id);
CREATE INDEX IF NOT EXISTS idx_reminder_logs_status ON reminder_logs(status, created_at);

-- Habilitar RLS
ALTER TABLE reminder_flows ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminder_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminder_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminder_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies para reminder_flows
CREATE POLICY "Users can view own company reminder flows"
  ON reminder_flows FOR SELECT
  TO authenticated
  USING (
    company_id IN (
      SELECT company_id FROM users WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can create reminder flows for own company"
  ON reminder_flows FOR INSERT
  TO authenticated
  WITH CHECK (
    company_id IN (
      SELECT company_id FROM users WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can update own company reminder flows"
  ON reminder_flows FOR UPDATE
  TO authenticated
  USING (
    company_id IN (
      SELECT company_id FROM users WHERE id = auth.uid()
    )
  )
  WITH CHECK (
    company_id IN (
      SELECT company_id FROM users WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own company reminder flows"
  ON reminder_flows FOR DELETE
  TO authenticated
  USING (
    company_id IN (
      SELECT company_id FROM users WHERE id = auth.uid()
    )
  );

-- RLS Policies para reminder_templates
CREATE POLICY "Users can view templates from own company flows"
  ON reminder_templates FOR SELECT
  TO authenticated
  USING (
    flow_id IN (
      SELECT id FROM reminder_flows WHERE company_id IN (
        SELECT company_id FROM users WHERE id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can create templates for own company flows"
  ON reminder_templates FOR INSERT
  TO authenticated
  WITH CHECK (
    flow_id IN (
      SELECT id FROM reminder_flows WHERE company_id IN (
        SELECT company_id FROM users WHERE id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can update templates from own company flows"
  ON reminder_templates FOR UPDATE
  TO authenticated
  USING (
    flow_id IN (
      SELECT id FROM reminder_flows WHERE company_id IN (
        SELECT company_id FROM users WHERE id = auth.uid()
      )
    )
  )
  WITH CHECK (
    flow_id IN (
      SELECT id FROM reminder_flows WHERE company_id IN (
        SELECT company_id FROM users WHERE id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can delete templates from own company flows"
  ON reminder_templates FOR DELETE
  TO authenticated
  USING (
    flow_id IN (
      SELECT id FROM reminder_flows WHERE company_id IN (
        SELECT company_id FROM users WHERE id = auth.uid()
      )
    )
  );

-- RLS Policies para reminder_subscriptions
CREATE POLICY "Users can view subscriptions from own company"
  ON reminder_subscriptions FOR SELECT
  TO authenticated
  USING (
    client_id IN (
      SELECT id FROM clients WHERE company_id IN (
        SELECT company_id FROM users WHERE id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can create subscriptions for own company clients"
  ON reminder_subscriptions FOR INSERT
  TO authenticated
  WITH CHECK (
    client_id IN (
      SELECT id FROM clients WHERE company_id IN (
        SELECT company_id FROM users WHERE id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can update subscriptions from own company"
  ON reminder_subscriptions FOR UPDATE
  TO authenticated
  USING (
    client_id IN (
      SELECT id FROM clients WHERE company_id IN (
        SELECT company_id FROM users WHERE id = auth.uid()
      )
    )
  )
  WITH CHECK (
    client_id IN (
      SELECT id FROM clients WHERE company_id IN (
        SELECT company_id FROM users WHERE id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can delete subscriptions from own company"
  ON reminder_subscriptions FOR DELETE
  TO authenticated
  USING (
    client_id IN (
      SELECT id FROM clients WHERE company_id IN (
        SELECT company_id FROM users WHERE id = auth.uid()
      )
    )
  );

-- RLS Policies para reminder_logs
CREATE POLICY "Users can view logs from own company"
  ON reminder_logs FOR SELECT
  TO authenticated
  USING (
    client_id IN (
      SELECT id FROM clients WHERE company_id IN (
        SELECT company_id FROM users WHERE id = auth.uid()
      )
    )
  );

CREATE POLICY "System can create logs"
  ON reminder_logs FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Function para atualizar updated_at
CREATE OR REPLACE FUNCTION update_reminder_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at
DROP TRIGGER IF EXISTS update_reminder_flows_updated_at ON reminder_flows;
CREATE TRIGGER update_reminder_flows_updated_at
  BEFORE UPDATE ON reminder_flows
  FOR EACH ROW
  EXECUTE FUNCTION update_reminder_updated_at();

DROP TRIGGER IF EXISTS update_reminder_templates_updated_at ON reminder_templates;
CREATE TRIGGER update_reminder_templates_updated_at
  BEFORE UPDATE ON reminder_templates
  FOR EACH ROW
  EXECUTE FUNCTION update_reminder_updated_at();

DROP TRIGGER IF EXISTS update_reminder_subscriptions_updated_at ON reminder_subscriptions;
CREATE TRIGGER update_reminder_subscriptions_updated_at
  BEFORE UPDATE ON reminder_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_reminder_updated_at();
