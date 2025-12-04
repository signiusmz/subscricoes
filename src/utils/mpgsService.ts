interface MPGSConfig {
  merchantId: string;
  apiUsername: string;
  apiPassword: string;
  gatewayUrl: string;
  environment: 'test' | 'production';
}

interface SessionRequest {
  orderId: string;
  amount: number;
  currency: string;
  description: string;
  customerId: string;
  customerEmail: string;
}

interface SessionResponse {
  session: {
    id: string;
    version: string;
  };
  successIndicator: string;
}

interface PaymentResponse {
  result: string;
  orderId: string;
  transactionId: string;
  amount: number;
  currency: string;
}

export class MPGSService {
  private config: MPGSConfig;

  constructor(config: MPGSConfig) {
    this.config = config;
  }

  private getBaseUrl(): string {
    if (this.config.environment === 'production') {
      return this.config.gatewayUrl || 'https://gateway.mastercard.com';
    }
    return 'https://test-gateway.mastercard.com';
  }

  private getAuthHeader(): string {
    const credentials = `${this.config.apiUsername}:${this.config.apiPassword}`;
    return `Basic ${btoa(credentials)}`;
  }

  async createCheckoutSession(request: SessionRequest): Promise<SessionResponse> {
    try {
      const url = `${this.getBaseUrl()}/api/rest/version/73/merchant/${this.config.merchantId}/session`;

      const payload = {
        order: {
          id: request.orderId,
          amount: request.amount,
          currency: request.currency,
          description: request.description
        },
        customer: {
          email: request.customerEmail
        },
        interaction: {
          operation: 'PURCHASE',
          merchant: {
            name: 'Signius',
            address: {
              line1: 'Mozambique'
            }
          }
        }
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': this.getAuthHeader(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Session creation failed: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating checkout session:', error);
      throw error;
    }
  }

  async verifyPayment(orderId: string, transactionId?: string): Promise<PaymentResponse> {
    try {
      const url = `${this.getBaseUrl()}/api/rest/version/73/merchant/${this.config.merchantId}/order/${orderId}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': this.getAuthHeader(),
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Payment verification failed: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      return {
        result: data.result,
        orderId: data.id,
        transactionId: data.transaction?.[0]?.id || transactionId || '',
        amount: parseFloat(data.amount || '0'),
        currency: data.currency || 'MZN'
      };
    } catch (error) {
      console.error('Error verifying payment:', error);
      throw error;
    }
  }

  async createRecurringPayment(request: SessionRequest & { frequency: 'monthly' }): Promise<SessionResponse> {
    try {
      const url = `${this.getBaseUrl()}/api/rest/version/73/merchant/${this.config.merchantId}/session`;

      const payload = {
        order: {
          id: request.orderId,
          amount: request.amount,
          currency: request.currency,
          description: request.description
        },
        customer: {
          email: request.customerEmail
        },
        interaction: {
          operation: 'PURCHASE',
          merchant: {
            name: 'Signius',
            address: {
              line1: 'Mozambique'
            }
          }
        },
        sourceOfFunds: {
          type: 'CARD'
        }
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': this.getAuthHeader(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Recurring payment creation failed: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating recurring payment:', error);
      throw error;
    }
  }

  static validateConfig(config: Partial<MPGSConfig>): boolean {
    return !!(
      config.merchantId &&
      config.apiUsername &&
      config.apiPassword &&
      config.merchantId.trim() !== '' &&
      config.apiUsername.trim() !== '' &&
      config.apiPassword.trim() !== ''
    );
  }

  static generateOrderId(companyId: string): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `ORD_${companyId}_${timestamp}_${random}`;
  }

  async testConnection(): Promise<boolean> {
    try {
      const url = `${this.getBaseUrl()}/api/rest/version/73/merchant/${this.config.merchantId}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': this.getAuthHeader(),
          'Content-Type': 'application/json'
        }
      });

      return response.ok;
    } catch (error) {
      console.error('MPGS connection test failed:', error);
      return false;
    }
  }
}

export const subscriptionPaymentUtils = {
  calculateSubscriptionAmount(planType: 'basic' | 'professional' | 'enterprise'): number {
    const planPrices = {
      basic: 750,
      professional: 1500,
      enterprise: 3500
    };
    return planPrices[planType];
  },

  generatePaymentDescription(companyName: string, planType: string): string {
    return `Subscrição ${planType} - ${companyName} - Signius`;
  },

  async processSubscriptionPayment(
    mpgsService: MPGSService,
    companyId: string,
    companyName: string,
    planType: 'basic' | 'professional' | 'enterprise',
    customerEmail: string
  ): Promise<SessionResponse> {
    const amount = this.calculateSubscriptionAmount(planType);
    const orderId = MPGSService.generateOrderId(companyId);
    const description = this.generatePaymentDescription(companyName, planType);

    const sessionRequest: SessionRequest = {
      orderId,
      amount,
      currency: 'MZN',
      description,
      customerId: companyId,
      customerEmail
    };

    return await mpgsService.createCheckoutSession(sessionRequest);
  }
};
