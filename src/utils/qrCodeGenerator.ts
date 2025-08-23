/**
 * QR Code generator utility for documents
 * Generates QR codes that link to online document viewing
 */

export interface QRCodeData {
  documentType: 'invoice' | 'receipt' | 'contract';
  documentNumber: string;
  clientId: string;
  companyId: string;
  amount?: number;
  date: string;
}

export class QRCodeGenerator {
  private static baseUrl = 'https://saas-multi-tenant-pl-6fd9.bolt.host';
  
  /**
   * Generate URL for document access
   */
  static generateDocumentUrl(data: QRCodeData): string {
    const params = new URLSearchParams({
      type: data.documentType,
      doc: data.documentNumber,
      client: data.clientId,
      company: data.companyId,
      date: data.date
    });
    
    if (data.amount) {
      params.append('amount', data.amount.toString());
    }
    
    return `${this.baseUrl}/document?${params.toString()}`;
  }
  
  /**
   * Generate QR code data URL using a simple QR code library approach
   * For production, you would use a proper QR code library
   */
  static generateQRCodeDataURL(data: QRCodeData): string {
    const url = this.generateDocumentUrl(data);
    
    // For demo purposes, we'll create a simple placeholder QR code
    // In production, you would use a library like 'qrcode' or similar
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      return '';
    }
    
    canvas.width = 100;
    canvas.height = 100;
    
    // Create a simple pattern that represents a QR code
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, 100, 100);
    
    ctx.fillStyle = '#FFFFFF';
    // Create a pattern that looks like a QR code
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        if ((i + j) % 2 === 0) {
          ctx.fillRect(i * 10, j * 10, 8, 8);
        }
      }
    }
    
    // Add corner markers
    ctx.fillStyle = '#000000';
    ctx.fillRect(10, 10, 20, 20);
    ctx.fillRect(70, 10, 20, 20);
    ctx.fillRect(10, 70, 20, 20);
    
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(15, 15, 10, 10);
    ctx.fillRect(75, 15, 10, 10);
    ctx.fillRect(15, 75, 10, 10);
    
    return canvas.toDataURL();
  }
  
  /**
   * Generate QR code for invoice
   */
  static generateInvoiceQR(invoiceNumber: string, clientId: string, companyId: string, amount: number, date: string): string {
    const data: QRCodeData = {
      documentType: 'invoice',
      documentNumber: invoiceNumber,
      clientId,
      companyId,
      amount,
      date
    };
    
    return this.generateQRCodeDataURL(data);
  }
  
  /**
   * Generate QR code for receipt
   */
  static generateReceiptQR(receiptNumber: string, clientId: string, companyId: string, amount: number, date: string): string {
    const data: QRCodeData = {
      documentType: 'receipt',
      documentNumber: receiptNumber,
      clientId,
      companyId,
      amount,
      date
    };
    
    return this.generateQRCodeDataURL(data);
  }
  
  /**
   * Generate QR code for contract
   */
  static generateContractQR(contractNumber: string, clientId: string, companyId: string, date: string): string {
    const data: QRCodeData = {
      documentType: 'contract',
      documentNumber: contractNumber,
      clientId,
      companyId,
      date
    };
    
    return this.generateQRCodeDataURL(data);
  }
  
  /**
   * Get document URL for sharing
   */
  static getDocumentShareUrl(data: QRCodeData): string {
    return this.generateDocumentUrl(data);
  }
}