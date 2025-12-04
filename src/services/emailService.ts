interface EmailConfig {
  apiKey: string;
  secretKey: string;
  apiUrl: string;
}

interface EmailMessage {
  to: string;
  toName?: string;
  subject: string;
  textContent: string;
  htmlContent?: string;
  fromEmail?: string;
  fromName?: string;
}

interface MailjetResponse {
  Messages: Array<{
    Status: string;
    To: Array<{
      Email: string;
      MessageID: number;
    }>;
  }>;
}

export class EmailService {
  private config: EmailConfig;

  constructor(config: EmailConfig) {
    this.config = config;
  }

  private getAuthHeader(): string {
    const credentials = `${this.config.apiKey}:${this.config.secretKey}`;
    return `Basic ${btoa(credentials)}`;
  }

  async sendEmail(message: EmailMessage): Promise<boolean> {
    try {
      const payload = {
        Messages: [
          {
            From: {
              Email: message.fromEmail || 'noreply@dzumuka.com',
              Name: message.fromName || 'DZUMUKA'
            },
            To: [
              {
                Email: message.to,
                Name: message.toName || message.to
              }
            ],
            Subject: message.subject,
            TextPart: message.textContent,
            HTMLPart: message.htmlContent || message.textContent
          }
        ]
      };

      const response = await fetch(`${this.config.apiUrl}/send`, {
        method: 'POST',
        headers: {
          'Authorization': this.getAuthHeader(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Email send failed: ${response.status} - ${errorText}`);
      }

      const data: MailjetResponse = await response.json();
      return data.Messages[0]?.Status === 'success';
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }

  async testConnection(testEmail: string): Promise<boolean> {
    try {
      const result = await this.sendEmail({
        to: testEmail,
        subject: 'Teste de Conexão - DZUMUKA',
        textContent: 'Este é um email de teste para verificar a configuração do Mailjet.',
        htmlContent: '<h1>Teste de Conexão</h1><p>Este é um email de teste para verificar a configuração do Mailjet.</p>'
      });
      return result;
    } catch (error) {
      console.error('Email connection test failed:', error);
      return false;
    }
  }

  static validateConfig(config: Partial<EmailConfig>): boolean {
    return !!(
      config.apiKey &&
      config.secretKey &&
      config.apiUrl &&
      config.apiKey.trim() !== '' &&
      config.secretKey.trim() !== ''
    );
  }

  static getConfigFromEnv(): EmailConfig {
    return {
      apiKey: import.meta.env.VITE_MAILJET_API_KEY || '',
      secretKey: import.meta.env.VITE_MAILJET_SECRET_KEY || '',
      apiUrl: import.meta.env.VITE_MAILJET_API_URL || 'https://api.mailjet.com/v3.1'
    };
  }
}

export const emailNotificationUtils = {
  formatInvoiceEmail(
    clientName: string,
    invoiceNumber: string,
    amount: number,
    dueDate: string
  ): { subject: string; textContent: string; htmlContent: string } {
    const subject = `Nova Fatura #${invoiceNumber} - DZUMUKA`;
    const textContent = `Olá ${clientName},\n\nTem uma nova fatura disponível.\n\nNúmero: ${invoiceNumber}\nValor: ${amount} MZN\nData de Vencimento: ${dueDate}\n\nObrigado,\nEquipa DZUMUKA`;
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Nova Fatura</h2>
        <p>Olá <strong>${clientName}</strong>,</p>
        <p>Tem uma nova fatura disponível:</p>
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Número:</strong> ${invoiceNumber}</p>
          <p><strong>Valor:</strong> ${amount} MZN</p>
          <p><strong>Data de Vencimento:</strong> ${dueDate}</p>
        </div>
        <p>Obrigado,<br><strong>Equipa DZUMUKA</strong></p>
      </div>
    `;
    return { subject, textContent, htmlContent };
  },

  formatPaymentConfirmationEmail(
    clientName: string,
    invoiceNumber: string,
    amount: number
  ): { subject: string; textContent: string; htmlContent: string } {
    const subject = `Pagamento Confirmado - Fatura #${invoiceNumber}`;
    const textContent = `Olá ${clientName},\n\nO seu pagamento foi confirmado com sucesso.\n\nFatura: ${invoiceNumber}\nValor: ${amount} MZN\n\nObrigado pelo seu pagamento!\n\nEquipa DZUMUKA`;
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #10b981;">Pagamento Confirmado</h2>
        <p>Olá <strong>${clientName}</strong>,</p>
        <p>O seu pagamento foi confirmado com sucesso!</p>
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Fatura:</strong> ${invoiceNumber}</p>
          <p><strong>Valor:</strong> ${amount} MZN</p>
        </div>
        <p>Obrigado pelo seu pagamento!</p>
        <p><strong>Equipa DZUMUKA</strong></p>
      </div>
    `;
    return { subject, textContent, htmlContent };
  }
};
