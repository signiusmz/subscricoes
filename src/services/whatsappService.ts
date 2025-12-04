interface WhatsAppConfig {
  apiKey: string;
  apiUrl: string;
}

interface WhatsAppMessage {
  phoneNumber: string;
  text: string;
}

interface WhatsAppResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export class WhatsAppService {
  private config: WhatsAppConfig;

  constructor(config: WhatsAppConfig) {
    this.config = config;
  }

  async sendMessage(message: WhatsAppMessage): Promise<boolean> {
    try {
      const cleanPhone = this.cleanPhoneNumber(message.phoneNumber);
      const url = `${this.config.apiUrl}/sendMessage?phonenumber=${cleanPhone}&text=${encodeURIComponent(message.text)}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`WhatsApp send failed: ${response.status} - ${errorText}`);
      }

      const data: WhatsAppResponse = await response.json();
      return data.success === true;
    } catch (error) {
      console.error('Error sending WhatsApp message:', error);
      throw error;
    }
  }

  private cleanPhoneNumber(phone: string): string {
    return phone.replace(/[^0-9]/g, '');
  }

  async testConnection(testPhone: string): Promise<boolean> {
    try {
      const result = await this.sendMessage({
        phoneNumber: testPhone,
        text: 'Teste de Conexão - DZUMUKA\n\nEste é um teste para verificar a configuração do WhatsApp.'
      });
      return result;
    } catch (error) {
      console.error('WhatsApp connection test failed:', error);
      return false;
    }
  }

  static validateConfig(config: Partial<WhatsAppConfig>): boolean {
    return !!(
      config.apiKey &&
      config.apiUrl &&
      config.apiKey.trim() !== ''
    );
  }

  static getConfigFromEnv(): WhatsAppConfig {
    return {
      apiKey: import.meta.env.VITE_360MESSENGER_API_KEY || '',
      apiUrl: import.meta.env.VITE_360MESSENGER_API_URL || 'https://api.360messenger.com/v2'
    };
  }
}

export const whatsappNotificationUtils = {
  formatInvoiceMessage(
    clientName: string,
    invoiceNumber: string,
    amount: number,
    dueDate: string
  ): string {
    return `*Nova Fatura - DZUMUKA*\n\nOlá ${clientName},\n\nTem uma nova fatura disponível:\n\n📄 *Número:* ${invoiceNumber}\n💰 *Valor:* ${amount} MZN\n📅 *Vencimento:* ${dueDate}\n\nObrigado!`;
  },

  formatPaymentConfirmationMessage(
    clientName: string,
    invoiceNumber: string,
    amount: number
  ): string {
    return `*Pagamento Confirmado* ✅\n\nOlá ${clientName},\n\nO seu pagamento foi confirmado com sucesso!\n\n📄 *Fatura:* ${invoiceNumber}\n💰 *Valor:* ${amount} MZN\n\nObrigado pelo seu pagamento!\n\n*DZUMUKA*`;
  },

  formatPaymentReminderMessage(
    clientName: string,
    invoiceNumber: string,
    amount: number,
    daysOverdue: number
  ): string {
    return `*Lembrete de Pagamento* ⏰\n\nOlá ${clientName},\n\nA fatura ${invoiceNumber} está vencida há ${daysOverdue} dias.\n\n💰 *Valor:* ${amount} MZN\n\nPor favor, regularize o pagamento.\n\nObrigado!\n*DZUMUKA*`;
  },

  formatSubscriptionReminderMessage(
    companyName: string,
    planName: string,
    amount: number,
    nextBillingDate: string
  ): string {
    return `*Lembrete de Subscrição* 📱\n\nOlá ${companyName},\n\nA sua subscrição será renovada em breve:\n\n📦 *Plano:* ${planName}\n💰 *Valor:* ${amount} MZN\n📅 *Próxima Cobrança:* ${nextBillingDate}\n\n*DZUMUKA*`;
  }
};
