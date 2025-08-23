interface MPesaConfig {
  apiKey: string;
  publicKey: string;
  serviceProviderCode: string;
  initiatorIdentifier: string;
  securityCredential: string;
  environment: 'sandbox' | 'production';
}

interface PaymentRequest {
  amount: number;
  msisdn: string; // Phone number
  reference: string;
  thirdPartyReference: string;
}

interface PaymentResponse {
  output_ResponseCode: string;
  output_ResponseDesc: string;
  output_TransactionID: string;
  output_ConversationID: string;
  output_ThirdPartyReference: string;
}

export class MPesaService {
  private config: MPesaConfig;
  private baseUrl: string;

  constructor(config: MPesaConfig) {
    this.config = config;
    this.baseUrl = config.environment === 'production' 
      ? 'https://api.vm.co.mz' 
      : 'https://api.sandbox.vm.co.mz';
  }

  /**
   * Generate Bearer Token for API authentication
   */
  private async generateBearerToken(): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/ipg/v1x/oauth/token`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Token generation failed: ${response.statusText}`);
      }

      const data = await response.json();
      return data.access_token;
    } catch (error) {
      console.error('Error generating bearer token:', error);
      throw error;
    }
  }

  /**
   * Process C2B (Customer to Business) payment
   */
  async processC2BPayment(paymentData: PaymentRequest): Promise<PaymentResponse> {
    try {
      const bearerToken = await this.generateBearerToken();

      const requestBody = {
        input_Amount: paymentData.amount.toString(),
        input_Country: 'MZ',
        input_Currency: 'MZN',
        input_CustomerMSISDN: paymentData.msisdn,
        input_ServiceProviderCode: this.config.serviceProviderCode,
        input_ThirdPartyReference: paymentData.thirdPartyReference,
        input_TransactionReference: paymentData.reference,
        input_PurchasedItemsDesc: 'Pagamento de Subscrição Signius'
      };

      const response = await fetch(`${this.baseUrl}/ipg/v1x/c2bPayment/singleStage/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${bearerToken}`,
          'Content-Type': 'application/json',
          'Origin': '*'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`Payment request failed: ${response.statusText}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error processing C2B payment:', error);
      throw error;
    }
  }

  /**
   * Query transaction status
   */
  async queryTransactionStatus(transactionId: string): Promise<any> {
    try {
      const bearerToken = await this.generateBearerToken();

      const requestBody = {
        input_QueryReference: transactionId,
        input_ServiceProviderCode: this.config.serviceProviderCode,
        input_ThirdPartyReference: transactionId
      };

      const response = await fetch(`${this.baseUrl}/ipg/v1x/queryTransactionStatus/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${bearerToken}`,
          'Content-Type': 'application/json',
          'Origin': '*'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`Query failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error querying transaction status:', error);
      throw error;
    }
  }

  /**
   * Validate phone number format for Mozambique
   */
  static validateMozambiquePhone(phone: string): boolean {
    // Remove any spaces, dashes, or plus signs
    const cleanPhone = phone.replace(/[\s\-\+]/g, '');
    
    // Check if it's a valid Mozambique number
    // Format: 258XXXXXXXXX (with country code) or 8XXXXXXXX/9XXXXXXXX (without)
    const mozambiquePattern = /^(258)?(8[0-9]|9[0-9])[0-9]{7}$/;
    
    return mozambiquePattern.test(cleanPhone);
  }

  /**
   * Format phone number to M-Pesa format
   */
  static formatPhoneNumber(phone: string): string {
    // Remove any spaces, dashes, or plus signs
    let cleanPhone = phone.replace(/[\s\-\+]/g, '');
    
    // Add country code if not present
    if (cleanPhone.startsWith('8') || cleanPhone.startsWith('9')) {
      cleanPhone = '258' + cleanPhone;
    }
    
    return cleanPhone;
  }

  /**
   * Generate unique transaction reference
   */
  static generateTransactionReference(): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `SIGNIUS_${timestamp}_${random}`;
  }

  /**
   * Test API connection
   */
  async testConnection(): Promise<boolean> {
    try {
      await this.generateBearerToken();
      return true;
    } catch (error) {
      console.error('M-Pesa connection test failed:', error);
      return false;
    }
  }
}

// Utility functions for subscription payments
export const subscriptionPaymentUtils = {
  /**
   * Calculate subscription amount based on plan
   */
  calculateSubscriptionAmount(planType: 'basic' | 'professional' | 'enterprise'): number {
    const planPrices = {
      basic: 750,
      professional: 1500,
      enterprise: 3500
    };
    return planPrices[planType];
  },

  /**
   * Generate payment description
   */
  generatePaymentDescription(companyName: string, planType: string): string {
    return `Subscrição ${planType} - ${companyName} - Signius`;
  },

  /**
   * Process subscription payment
   */
  async processSubscriptionPayment(
    mpesaService: MPesaService,
    companyId: string,
    companyName: string,
    planType: 'basic' | 'professional' | 'enterprise',
    phoneNumber: string
  ): Promise<PaymentResponse> {
    const amount = this.calculateSubscriptionAmount(planType);
    const reference = MPesaService.generateTransactionReference();
    const thirdPartyReference = `SUB_${companyId}_${Date.now()}`;

    const paymentRequest: PaymentRequest = {
      amount,
      msisdn: MPesaService.formatPhoneNumber(phoneNumber),
      reference,
      thirdPartyReference
    };

    return await mpesaService.processC2BPayment(paymentRequest);
  }
};